import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { CategoriesSection } from '@/components/landing/categories-section'
import { FeaturedSection } from '@/components/landing/featured-section'
import { NearbySection } from '@/components/landing/nearby-section'
import { TrustSection } from '@/components/landing/trust-section'
import { CTASection } from '@/components/landing/cta-section'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedSection />
        <NearbySection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
