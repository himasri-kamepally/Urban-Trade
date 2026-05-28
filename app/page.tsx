'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { CategoriesSection } from '@/components/landing/categories-section'
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
    <div className="flex min-h-screen flex-col bg-[#07110F] text-[#F5F7F6] font-sans selection:bg-[#49D17D]/30 selection:text-[#5BFF9D] relative overflow-hidden">
      <Header />
      <main className="flex-1 relative z-10">
        <HeroSection />
        <HowItWorks />
        <CategoriesSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
