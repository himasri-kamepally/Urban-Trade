'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Trash2 } from 'lucide-react'
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
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-black/10',
        className
      )}
    >
      <Link href={`/product/${id}`} className="absolute inset-0 z-0 focus:outline-none" aria-label={`View ${title}`} />
      
      <div className="relative aspect-[4/3] overflow-hidden pointer-events-none">
        <Image
          src={image || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur-md shadow-sm">
            {condition}
          </span>
        </div>
      </div>
      
      <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
        <button
          onClick={handleSave}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur-md shadow-sm transition-all hover:bg-background hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label={saved ? "Unsave" : "Save"}
        >
          <Heart
            className={cn(
              'h-5 w-5 transition-colors',
              saved ? 'fill-accent text-accent' : 'text-foreground'
            )}
          />
        </button>
        {onDelete && (
          <button
            onClick={handleDelete}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-destructive backdrop-blur-md shadow-sm transition-all hover:bg-destructive hover:text-destructive-foreground hover:scale-110 focus:outline-none focus:ring-2 focus:ring-destructive"
            aria-label="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-4 pointer-events-none">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          {formatPrice(price)}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
          <span className="text-xs text-muted-foreground">{posted}</span>
        </div>
      </div>
    </div>
  )
}

