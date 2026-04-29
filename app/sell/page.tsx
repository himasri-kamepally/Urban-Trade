'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { AuthGuard } from '@/components/auth-guard'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { categories, indianCities } from '@/lib/data'
import {
  Upload,
  X,
  ImagePlus,
  MapPin,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
} from 'lucide-react'

const conditions = ['New', 'Like New', 'Good', 'Fair', 'For Parts']

interface UploadedImage {
  file: File
  previewUrl: string       // local blob URL for immediate preview
  publicUrl: string | null // Supabase public URL after upload
  status: 'uploading' | 'done' | 'error'
  error?: string
}

function generateFileName(file: File): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  const ext = file.name.split('.').pop()
  return `${timestamp}-${random}.${ext}`
}

export default function SellPage() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    description: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dbCategories, setDbCategories] = useState<any[]>([])
  const [submitError, setSubmitError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // ─── Fetch Categories & User Profile from Database ──────────────────────────
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: cats, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('name')
        
        if (catError) throw catError
        if (cats) setDbCategories(cats)

        if (user?.id) {
          const { data: profile, error: profError } = await supabase
            .from('profiles')
            .select('phone')
            .eq('id', user.id)
            .single()
          
          if (profile?.phone) {
            setFormData(prev => ({ ...prev, phone: profile.phone }))
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error)
      }
    }
    fetchData()
  }, [user?.id])

  // ─── Image Handling & Upload ──────────────────────────────────────────────
  const uploadToSupabase = async (file: File, index: number) => {
    try {
      const fileName = generateFileName(file)
      const filePath = `listings/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath)

      setUploadedImages(prev => {
        const next = [...prev]
        if (next[index]) {
          next[index] = { ...next[index], status: 'done', publicUrl }
        }
        return next
      })
    } catch (error: any) {
      console.error('Upload failed:', error)
      setUploadedImages(prev => {
        const next = [...prev]
        if (next[index]) {
          next[index] = { ...next[index], status: 'error', error: error.message }
        }
        return next
      })
    }
  }

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, 10 - uploadedImages.length)
    
    fileArray.forEach(file => {
      const previewUrl = URL.createObjectURL(file)
      const newUpload: UploadedImage = {
        file,
        previewUrl,
        publicUrl: null,
        status: 'uploading'
      }
      
      setUploadedImages(prev => {
        const next = [...prev, newUpload]
        const newIndex = next.length - 1
        uploadToSupabase(file, newIndex)
        return next
      })
    })
  }, [uploadedImages.length])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const next = [...prev]
      URL.revokeObjectURL(next[index].previewUrl)
      next.splice(index, 1)
      return next
    })
  }

  // ─── Submit listing ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (!formData.phone) {
      setSubmitError('Phone number is required so buyers can contact you.')
      return
    }

    // Guard: need at least one successfully uploaded image
    const readyImages = uploadedImages.filter((i) => i.status === 'done' && i.publicUrl)
    if (readyImages.length === 0) {
      setSubmitError('Please wait for images to finish uploading.')
      return
    }

    const stillUploading = uploadedImages.some((i) => i.status === 'uploading')
    if (stillUploading) {
      setSubmitError('Some images are still uploading. Please wait.')
      return
    }

    if (!user?.id) {
      setSubmitError('You must be logged in to create a listing.')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Update user profile with phone number if changed/new
      await supabase
        .from('profiles')
        .update({ phone: formData.phone })
        .eq('id', user.id)

      // 2. Insert into listings table
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert([
          {
            seller_id: user.id,
            title: formData.title,
            description: formData.description,
            price: Number(formData.price),
            category_id: formData.category || null,
            city: formData.location,
            condition: formData.condition,
            status: 'active',
          },
        ])
        .select()
        .single()

      if (listingError) throw listingError

      // 3. Insert all image URLs into listing_images table
      const imageRows = readyImages.map((img) => ({
        listing_id: listing.id,
        image_url: img.publicUrl,
      }))

      const { error: imagesError } = await supabase
        .from('listing_images')
        .insert(imageRows)

      if (imagesError) throw imagesError

      setShowSuccess(true)
    } catch (err: any) {
      console.error('Listing submission error:', err)
      setSubmitError(err.message || 'Failed to publish listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Success Screen ────────────────────────────────────────────────────────
  if (showSuccess) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 items-center justify-center px-4">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <svg className="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="mt-6 text-2xl font-semibold text-foreground">Listing Published!</h1>
              <p className="mt-3 text-muted-foreground">
                Your item is now live on UrbanTrade. Potential buyers can see your phone number and contact you.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  onClick={() => {
                    setShowSuccess(false)
                    setUploadedImages([])
                    setFormData({ title: '', price: '', category: '', condition: '', location: '', description: '', phone: formData.phone })
                  }}
                  variant="outline"
                  className="rounded-xl"
                >
                  Create Another
                </Button>
                <Button onClick={() => router.push('/dashboard')} className="rounded-xl">
                  View My Listings
                </Button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    )
  }

  // ─── Main Form ─────────────────────────────────────────────────────────────
  const hasUploadingImages = uploadedImages.some((i) => i.status === 'uploading')
  const hasReadyImages = uploadedImages.some((i) => i.status === 'done')

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-8 lg:py-12">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
                Sell Your Item
              </h1>
              <p className="mt-2 text-muted-foreground">Create a listing and reach millions of buyers</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* ── Photo Upload Area ── */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  Photos <span className="text-muted-foreground">(up to 10)</span>
                </label>

                {/* Drop zone — only show when there is room for more images */}
                {uploadedImages.length < 10 && (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`mt-3 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors ${
                      dragActive ? 'border-accent bg-accent/5' : 'border-border bg-card hover:border-accent/50'
                    }`}
                  >
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p className="mt-4 text-sm text-foreground">Drag and drop your photos here</p>
                    <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => e.target.files && handleFiles(e.target.files)}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Image Preview Grid */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4 sm:grid-cols-5">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="group relative aspect-square">
                        {/* Preview image */}
                        <Image
                          src={img.previewUrl}
                          alt={`Upload ${index + 1}`}
                          fill
                          className={`rounded-xl object-cover transition-opacity ${
                            img.status === 'uploading' ? 'opacity-50' : 'opacity-100'
                          }`}
                          unoptimized
                        />

                        {/* Uploading spinner overlay */}
                        {img.status === 'uploading' && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/40">
                            <Loader2 className="h-6 w-6 animate-spin text-accent" />
                          </div>
                        )}

                        {/* Success badge */}
                        {img.status === 'done' && (
                          <div className="absolute right-1 top-1">
                            <CheckCircle2 className="h-5 w-5 text-green-400 drop-shadow" />
                          </div>
                        )}

                        {/* Error badge */}
                        {img.status === 'error' && (
                          <div
                            className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-destructive/60"
                            title={img.error}
                          >
                            <AlertCircle className="h-6 w-6 text-destructive-foreground" />
                            <span className="mt-1 text-[10px] text-destructive-foreground">Failed</span>
                          </div>
                        )}

                        {/* Cover badge */}
                        {index === 0 && img.status === 'done' && (
                          <span className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
                            Cover
                          </span>
                        )}

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {/* Add more button */}
                    {uploadedImages.length < 10 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border bg-card transition-colors hover:border-accent/50"
                      >
                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                )}

                {/* Upload status bar */}
                {hasUploadingImages && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    Uploading images to Supabase…
                  </p>
                )}
                {!hasUploadingImages && hasReadyImages && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    All images uploaded successfully
                  </p>
                )}
              </div>

              {/* ── Listing Fields ── */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="What are you selling?"
                    className="mt-2 h-12 w-full rounded-xl border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Price (INR)</label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                      min="0"
                      className="h-12 w-full rounded-xl border border-border bg-card pl-8 pr-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <div className="relative mt-2">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="h-12 w-full appearance-none rounded-xl border border-border bg-card px-4 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      required
                    >
                      <option value="">Select category</option>
                      {dbCategories.length > 0 ? (
                        dbCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      ) : (
                        // Fallback to static data if DB categories aren't loaded yet
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Condition</label>
                  <div className="relative mt-2">
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="h-12 w-full appearance-none rounded-xl border border-border bg-card px-4 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      required
                    >
                      <option value="">Select condition</option>
                      {conditions.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="h-12 w-full appearance-none rounded-xl border border-border bg-card pl-10 pr-10 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      required
                    >
                      <option value="">Select city</option>
                      {indianCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Buyers will use this to contact you about your item.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your item, including its condition, features, and any details buyers should know..."
                    rows={5}
                    className="mt-2 w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                  />
                </div>
              </div>

              {/* ── Error Banner ── */}
              {submitError && (
                <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {submitError}
                </div>
              )}

              {/* ── Action Buttons ── */}
              <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl sm:w-32"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 sm:w-44"
                  disabled={isSubmitting || hasUploadingImages || uploadedImages.length === 0}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing…
                    </span>
                  ) : hasUploadingImages ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading…
                    </span>
                  ) : (
                    'Publish Listing'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  )
}
