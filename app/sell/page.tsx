'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { AuthGuard } from '@/components/auth-guard'
import { categories, indianCities } from '@/lib/data'
import { Upload, X, ImagePlus, MapPin, ChevronDown } from 'lucide-react'

const conditions = ['New', 'Like New', 'Good', 'Fair', 'For Parts']

export default function SellPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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
    
    const files = e.dataTransfer.files
    handleFiles(files)
  }

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result && images.length < 10) {
            setImages((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setShowSuccess(true)
  }

  if (showSuccess) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 items-center justify-center px-4">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <svg
                  className="h-8 w-8 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="mt-6 text-2xl font-semibold text-foreground">
                Listing Published!
              </h1>
              <p className="mt-3 text-muted-foreground">
                Your item is now live on UrbanTrade. Potential buyers can now see and contact you about your listing.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  onClick={() => {
                    setShowSuccess(false)
                    setImages([])
                    setFormData({
                      title: '',
                      price: '',
                      category: '',
                      condition: '',
                      location: '',
                      description: '',
                    })
                  }}
                  variant="outline"
                  className="rounded-xl"
                >
                  Create Another
                </Button>
                <Button
                  onClick={() => window.location.href = '/dashboard'}
                  className="rounded-xl"
                >
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
            <p className="mt-2 text-muted-foreground">
              Create a listing and reach millions of buyers
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="text-sm font-medium text-foreground">
                Photos <span className="text-muted-foreground">(up to 10)</span>
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-3 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors ${
                  dragActive
                    ? 'border-accent bg-accent/5'
                    : 'border-border bg-card hover:border-accent/50'
                }`}
              >
                <Upload className="h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-sm text-foreground">
                  Drag and drop your photos here
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                />
              </div>
              
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4 sm:grid-cols-5">
                  {images.map((image, index) => (
                    <div key={index} className="group relative aspect-square">
                      <Image
                        src={image}
                        alt={`Upload ${index + 1}`}
                        fill
                        className="rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                  {images.length < 10 && (
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
            </div>
            
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
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
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
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 sm:w-40"
                disabled={isSubmitting || images.length === 0}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
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
