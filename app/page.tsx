'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { CinematicNavbar } from '@/components/landing/cinematic-navbar'
import { CinematicHero } from '@/components/landing/cinematic-hero'
import { LocalInternetSection } from '@/components/landing/local-internet-section'
import { PinnedStorySection } from '@/components/landing/pinned-story-section'
import { MarketplaceDifferenceSection } from '@/components/landing/marketplace-difference-section'
import { TrustFeaturesSection } from '@/components/landing/trust-features-section'
import { HowItWorksVisual } from '@/components/landing/how-it-works-visual'
import { FinalCtaSection } from '@/components/landing/final-cta-section'
import { CinematicFooter } from '@/components/landing/cinematic-footer'

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace('/marketplace')
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-foreground/10 selection:text-foreground relative">
      <CinematicNavbar />
      <main className="flex-1 relative">
        <CinematicHero />
        <LocalInternetSection />
        <PinnedStorySection />
        <MarketplaceDifferenceSection />
        <TrustFeaturesSection />
        <HowItWorksVisual />
        <FinalCtaSection />
      </main>
      <CinematicFooter />
    </div>
  )
}
