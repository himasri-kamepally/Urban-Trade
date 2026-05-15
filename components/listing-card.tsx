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
        'group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/40 bg-white/60 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1.5',
        className
      )}
    >
      <Link href={`/product/${id}`} className="absolute inset-0 z-0" aria-label={`View ${title}`} />
      
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted/20">
        <Image
          src={image || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized
        />
        
        {/* Glass Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

        {/* Condition & Save Buttons */}
        <div className="absolute top-4 left-4">
          <span className="rounded-xl bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20 text-foreground">
            {condition}
          </span>
        </div>
        
        <button
          onClick={handleSave}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 shadow-xl backdrop-blur-md transition-all hover:bg-primary hover:text-white hover:scale-110 active:scale-90 z-10"
        >
          <Heart className={cn('h-5 w-5 transition-colors', saved ? 'fill-current text-primary group-hover:text-white' : '')} />
        </button>

        {/* Verified Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 shadow-sm">
            <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-[10px] font-bold">Verified</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="line-clamp-1 text-base font-black text-foreground">
            {title}
          </h3>
          <div className="flex items-center gap-1">
             <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
             <span className="text-[10px] font-bold">4.8</span>
          </div>
        </div>
        
        <p className="text-xl font-black text-primary mb-6">
          {formatPrice(price)}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7 rounded-full overflow-hidden bg-secondary border border-white/40">
              <Image src={`https://i.pravatar.cc/150?u=${id}`} alt="Seller" fill className="object-cover" unoptimized/>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black leading-none">Nearby</span>
              <span className="text-[9px] text-muted-foreground">1.2 km away</span>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">{posted}</span>
        </div>
      </div>
    </div>
  )
}

