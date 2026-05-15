'use client'

import { Shield, BadgeCheck, Lock, Headphones } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Shield,
    title: 'Buyer Protection',
    description: 'Shop with confidence knowing your purchases are protected against fraud.',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Sellers',
    description: 'Our verification system ensures you deal with trusted sellers.',
  },
  {
    icon: Lock,
    title: 'Secure Messaging',
    description: 'Communicate safely with end-to-end encrypted messaging.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated team is always here to help across India.',
  },
]

export function TrustSection() {
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation()
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation()

  return (
    <section className="border-t border-border bg-card/50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div 
          ref={headingRef}
          className={cn(
            "text-center transition-all duration-700 ease-out",
            headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-4xl">
            Why Choose UrbanTrade
          </h2>
          <p className="mt-3 text-muted-foreground">
            The safest way to buy and sell locally in India
          </p>
        </div>
        
        <div 
          ref={gridRef}
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={cn(
                  "group rounded-[2rem] border border-white/40 bg-white/40 backdrop-blur-md p-8 transition-all duration-500 hover:border-primary/50 hover:bg-white/60 hover:-translate-y-2 shadow-sm",
                  gridVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: gridVisible ? `${index * 100}ms` : '0ms' }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
