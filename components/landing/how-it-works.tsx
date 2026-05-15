'use client'

import { Upload, MessageSquare, Handshake } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

const steps = [
  {
    icon: Upload,
    title: 'Upload Product',
    description: 'Snap a few photos and list your item in under 60 seconds.',
  },
  {
    icon: MessageSquare,
    title: 'Connect with Buyers',
    description: 'Chat directly with people in your neighborhood.',
  },
  {
    icon: Handshake,
    title: 'Meet & Trade Locally',
    description: 'Arrange a safe meetup and complete the trade instantly.',
  },
]

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Simple, safe, and built for your community.
          </p>
        </div>

        <div 
          ref={ref}
          className="grid gap-8 md:grid-cols-3"
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className={cn(
                  "group relative p-10 rounded-[3rem] border border-white/40 bg-white/40 backdrop-blur-2xl transition-all duration-1000 ease-out hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary text-white shadow-xl shadow-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                
                {/* Decorative Number */}
                <div className="absolute top-8 right-10 text-8xl font-black text-foreground/[0.03] select-none pointer-events-none">
                  0{index + 1}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
