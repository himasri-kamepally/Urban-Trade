'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { CategoriesSection } from '@/components/landing/categories-section'
import { FeaturedSection } from '@/components/landing/featured-section'
import { NearbySection } from '@/components/landing/nearby-section'
import { TrustSection } from '@/components/landing/trust-section'
import { CTASection } from '@/components/landing/cta-section'

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace('/marketplace')
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated) {
    return null // or a loading spinner
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
