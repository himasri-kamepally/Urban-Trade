'use client'

import Link from 'next/link'
import { Smartphone, Car, Sofa, Shirt, Home, Briefcase, Wrench, BookOpen, ShoppingBag } from 'lucide-react'
import { categories } from '@/lib/data'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  Smartphone,
  Car,
  Sofa,
  Shirt,
  Home,
  Briefcase,
  Wrench,
  BookOpen,
  ShoppingBag,
}

export function CategoriesSection() {
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation()
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation()

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div 
          ref={headingRef}
          className={cn(
            "text-center transition-all duration-700 ease-out",
            headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-3 text-muted-foreground">
            Find exactly what you&apos;re looking for across India
          </p>
        </div>
        
        <div 
          ref={gridRef}
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-9 lg:gap-4"
        >
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon]
            return (
              <Link
                key={category.id}
                href={`/marketplace?category=${category.id}`}
                className={cn(
                  "group flex flex-col items-center rounded-2xl border border-border bg-card p-5 transition-all duration-500 hover:border-accent/50 hover:bg-secondary hover:scale-105 hover:-translate-y-1",
                  gridVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: gridVisible ? `${index * 50}ms` : '0ms' }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-all duration-300 group-hover:bg-background group-hover:scale-110">
                  {Icon && <Icon className="h-6 w-6 text-foreground" />}
                </div>
                <h3 className="mt-3 text-center text-xs font-medium text-foreground sm:text-sm">{category.name}</h3>
                <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                  {category.count.toLocaleString('en-IN')} items
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
