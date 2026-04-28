'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/data'
import { useAuth } from '@/contexts/auth-context'

interface ListingCardProps {
  id: string
  title: string
  price: number
  image: string
  location: string
  condition: string
  posted: string
  saved?: boolean
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
  saved: initialSaved = false,
  className,
}: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const { requireAuth } = useAuth()

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    requireAuth(() => {
      setIsSaved(!isSaved)
    })
  }

  return (
    <Link
      href={`/product/${id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-black/20',
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <button
          onClick={handleSave}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
        >
          <Heart
            className={cn(
              'h-5 w-5 transition-colors',
              isSaved ? 'fill-accent text-accent' : 'text-foreground'
            )}
          />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            {condition}
          </span>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-4">
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
    </Link>
  )
}
