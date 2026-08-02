'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Star, BadgeCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/data'
import { useSavedListings } from '@/contexts/saved-context'

interface ListingCardProps {
  id: string
  title: string
  price: number
  image: string
  location: string
  condition: string
  posted: string
  seller?: { full_name?: string; avatar_url?: string }
  distance?: string
  saved?: boolean
  onDelete?: () => void
  className?: string
}

export function ListingCard({
  id,
  title,
  price,
  image,
  location,
  condition,
  posted,
  seller,
  distance,
  saved: initialSaved,
  onDelete,
  className,
}: ListingCardProps) {
  const { isSaved, toggleSaved } = useSavedListings()
  const saved = isSaved(id)

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleSaved(id)
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-0.5',
        className
      )}
    >
      <Link href={`/product/${id}`} className="absolute inset-0 z-0" aria-label={`View ${title}`} />
      
      {/* Image Container - Reduced Height */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={image || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/3 transition-colors duration-300" />

        {/* Condition Badge */}
        <div className="absolute top-3 left-3">
          <span className="rounded-lg bg-card px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider shadow-soft border border-border text-foreground">
            {condition}
          </span>
        </div>
        
        {/* Save Button */}
        <button
          onClick={handleSave}
          className="group/btn absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-card shadow-soft-lg transition-all hover:bg-foreground hover:text-background hover:scale-110 active:scale-90 z-10 border border-border"
        >
          <Heart className={cn('h-4 w-4 transition-colors', saved ? 'fill-current text-destructive' : 'text-muted-foreground group-hover/btn:fill-current')} />
        </button>

        {/* Verified Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-1 bg-card shadow-soft px-2 py-1 rounded-lg border border-border">
            <BadgeCheck className="h-3 w-3 text-foreground" />
            <span className="text-[9px] font-bold text-foreground">Verified</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="line-clamp-1 text-sm font-bold text-foreground">
            {title}
          </h3>
          <div className="flex items-center gap-1">
             <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
             <span className="text-[9px] font-bold text-foreground">4.8</span>
          </div>
        </div>
        
        <p className="text-base font-bold text-foreground mb-4">
          {formatPrice(price)}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div className="relative h-6 w-6 rounded-full overflow-hidden bg-secondary border border-border shrink-0">
              <Image 
                src={seller?.avatar_url || `https://ui-avatars.com/api/?name=${seller?.full_name || 'User'}&background=random`} 
                alt={seller?.full_name || "Seller"} 
                fill 
                className="object-cover" 
                unoptimized
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-bold leading-none truncate">{seller?.full_name || 'Nearby User'}</span>
              <span className="text-[8px] text-muted-foreground truncate">{distance ? `${distance} away` : location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            {onDelete && (
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} className="text-[8px] font-bold text-destructive hover:underline whitespace-nowrap">
                Delete
              </button>
            )}
            <span className="text-[8px] text-muted-foreground font-medium whitespace-nowrap">{posted}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
