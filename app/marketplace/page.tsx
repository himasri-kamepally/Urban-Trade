'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListingCard } from '@/components/listing-card'
import { Button } from '@/components/ui/button'
import { getListings, getCategories } from '@/lib/api'
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown, Loader2 } from 'lucide-react'

const conditions = ['All', 'New', 'Like New', 'Good', 'Fair']
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Lowest Price' },
  { value: 'price-high', label: 'Highest Price' },
]

function MarketplaceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Real Data State
  const [dbListings, setDbListings] = useState<any[]>([])
  const [dbCategories, setDbCategories] = useState<any[]>([])
  
  // Filter states initialized from URL if possible
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [selectedCondition, setSelectedCondition] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  const fetchCategories = async () => {
    try {
      const cats = await getCategories()
      setDbCategories(cats)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchFilteredListings = async () => {
    setLoading(true)
    try {
      const data = await getListings({
        category: selectedCategory,
        search: searchQuery,
        condition: selectedCondition,
        minPrice: priceRange.min ? Number(priceRange.min) : undefined,
        maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
        sortBy: sortBy
      })
      setDbListings(data)
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFilteredListings()
    }, 300) // Debounce search
    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategory, selectedCondition, priceRange.min, priceRange.max, sortBy])

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedCondition('All')
    setPriceRange({ min: '', max: '' })
    setSearchQuery('')
    router.replace('/marketplace')
  }

  const hasActiveFilters = selectedCategory !== 'all' || selectedCondition !== 'All' || priceRange.min || priceRange.max

  return (
    <>
      <div className="sticky top-14 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:px-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search marketplace..."
              className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 rounded-xl border-border bg-card lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          
          <div className="hidden items-center gap-2 lg:flex">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 appearance-none rounded-xl border border-border bg-card pl-4 pr-10 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            
            <div className="flex rounded-xl border border-border bg-card p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          <div className="flex gap-8">
            <aside
              className={`fixed inset-0 z-50 bg-background p-6 transition-transform lg:static lg:block lg:w-64 lg:flex-shrink-0 lg:bg-transparent lg:p-0 ${
                showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
            >
              <div className="flex items-center justify-between lg:hidden">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-6 space-y-6 lg:mt-0">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">Category</h3>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-accent hover:text-foreground"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-secondary text-foreground'
                          : 'text-muted-foreground hover:bg-card hover:text-foreground'
                      }`}
                    >
                      All Categories
                    </button>
                    {dbCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-secondary text-foreground'
                            : 'text-muted-foreground hover:bg-card hover:text-foreground'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-foreground">Price Range</h3>
                  <div className="mt-3 flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-foreground">Condition</h3>
                  <div className="mt-3 space-y-2">
                    {conditions.map((condition) => (
                      <button
                        key={condition}
                        onClick={() => setSelectedCondition(condition)}
                        className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          selectedCondition === condition
                            ? 'bg-secondary text-foreground'
                            : 'text-muted-foreground hover:bg-card hover:text-foreground'
                        }`}
                      >
                        {condition}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="lg:hidden">
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="w-full rounded-xl"
                  >
                    Show {dbListings.length} results
                  </Button>
                </div>
              </div>
            </aside>
            
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Searching...' : `${dbListings.length} items found`}
                </p>
                <div className="flex items-center gap-2 lg:hidden">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-9 appearance-none rounded-lg border border-border bg-card pl-3 pr-8 text-xs text-foreground focus:border-accent focus:outline-none"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : dbListings.length > 0 ? (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'
                      : 'space-y-4'
                  }
                >
                  {dbListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      id={listing.id}
                      title={listing.title}
                      price={listing.price}
                      image={listing.listing_images?.[0]?.image_url || '/placeholder.svg'}
                      location={listing.city}
                      condition={listing.condition}
                      posted={new Date(listing.created_at).toLocaleDateString()}
                      className={viewMode === 'list' ? 'flex-row' : ''}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-lg font-medium text-foreground">No items found</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-4 rounded-xl"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default function MarketplacePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
        <MarketplaceContent />
      </Suspense>
      <Footer />
    </div>
  )
}

