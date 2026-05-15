'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Trash2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  saved?: boolean // Deprecated
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

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDelete) onDelete()
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1',
        className
      )}
    >
      <Link href={`/product/${id}`} className="absolute inset-0 z-0 focus:outline-none" aria-label={`View ${title}`} />
      
      <div className="relative aspect-square overflow-hidden bg-muted/30 p-4">
        <Image
          src={image || '/placeholder.svg'}
          alt={title}
          fill
          className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized
        />
        <div className="absolute top-3 left-3">
          <span className="rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border border-border/50">
            {condition}
          </span>
        </div>
      </div>
      
      <div className="absolute right-3 top-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleSave}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xl transition-all hover:bg-primary hover:text-white hover:scale-110 focus:outline-none"
          aria-label={saved ? "Unsave" : "Save"}
        >
          <Heart
            className={cn(
              'h-5 w-5 transition-colors',
              saved ? 'fill-current' : ''
            )}
          />
        </button>
      </div>
      
      <div className="flex flex-1 flex-col p-5 text-center items-center">
        <h3 className="line-clamp-1 text-sm font-bold text-foreground mb-1">
          {title}
        </h3>
        
        {/* Mock Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-3 w-3 fill-orange-400 text-orange-400" />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">(4.8)</span>
        </div>

        <p className="text-lg font-black text-primary">
          {formatPrice(price)}
        </p>
        
        <div className="mt-4 w-full">
          <Button variant="outline" className="w-full rounded-xl h-10 text-xs font-bold border-border hover:bg-primary hover:text-white hover:border-primary transition-all">
            View Details
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between w-full pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
            <MapPin className="h-3 w-3" />
            <span>1.2 km away</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">{posted}</span>
        </div>
      </div>
    </div>
  )
}

