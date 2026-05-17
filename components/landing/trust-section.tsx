'use client'

import { UserCheck, Shield, MapPin, Zap } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: UserCheck,
    title: 'Verified Profiles',
    description: 'Every seller is verified to ensure a trustworthy marketplace for everyone.',
  },
  {
    icon: Shield,
    title: 'Secure Messaging',
    description: 'End-to-end encrypted chat keeps your personal details private.',
  },
  {
    icon: MapPin,
    title: 'Safe Local Meetups',
    description: 'Guidelines and community-rated spots for secure physical trades.',
  },
  {
    icon: Zap,
    title: 'Instant Listing System',
    description: 'Our proprietary AI helps you list and sell products in seconds.',
  },
]

export function TrustSection() {
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation()
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation()

  return (
    <section className="py-24 lg:py-32 bg-background border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div 
          ref={headingRef}
          className={cn(
            "max-w-3xl mb-16 transition-all duration-1000 ease-out",
            headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Built for Trust
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            We've reimagined the local marketplace with safety and speed at its core. No friction, just pure community trading.
          </p>
        </div>
        
        <div 
          ref={gridRef}
          className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={cn(
                  "group relative p-8 rounded-[2.5rem] border border-red-500/10 bg-gradient-to-br from-white via-white to-rose-500/[0.02] backdrop-blur-2xl transition-all duration-1000 ease-out hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 hover:border-primary/30 hover:to-primary/[0.05]",
                  gridVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: gridVisible ? `${index * 150}ms` : '0ms' }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-secondary text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110 shadow-sm">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-black text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
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
