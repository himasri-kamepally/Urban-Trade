'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { PremiumNavbar } from '@/components/landing/premium-navbar'
import { PremiumHero } from '@/components/landing/premium-hero'
import { PremiumDiscovery } from '@/components/landing/premium-discovery'
import { PremiumCategories } from '@/components/landing/premium-categories'
import { PremiumMarketplace } from '@/components/landing/premium-marketplace'
import { PremiumTrust } from '@/components/landing/premium-trust'
import { PremiumHowItWorks } from '@/components/landing/premium-how-it-works'
import { PremiumSellCta } from '@/components/landing/premium-sell-cta'
import { PremiumFinalCta } from '@/components/landing/premium-final-cta'
import { PremiumFooter } from '@/components/landing/premium-footer'

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
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-foreground/10 selection:text-foreground relative overflow-hidden">
      <PremiumNavbar />
      <main className="flex-1 relative z-10">
        <PremiumHero />
        <PremiumDiscovery />
        <PremiumCategories />
        <PremiumMarketplace />
        <PremiumTrust />
        <PremiumHowItWorks />
        <PremiumSellCta />
        <PremiumFinalCta />
      </main>
      <PremiumFooter />
    </div>
  )
}
