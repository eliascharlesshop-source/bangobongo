"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import {
  ShoppingCart,
  Filter,
  Search,
  Tag,
  Clock,
  ChevronDown,
  CheckCircle2,
  ArrowUpDown,
  Heart,
  AlertCircle,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useProducts } from "@/hooks/use-api"
import { useNotifications } from "@/contexts/notification-context"
import { isWalletAvailable, getWalletAddress } from "@/lib/wallet-utils"
import type { MerchItem, MerchCategory } from "@/types"

interface ProductFilters {
  category: string
  priceRange: string
  inStock: boolean
  sortBy: string
  searchTerm: string
}

const categories: { id: string; name: string }[] = [
  { id: "all", name: "All Categories" },
  { id: "clothing", name: "Clothing" },
  { id: "accessories", name: "Accessories" },
  { id: "vinyl", name: "Vinyl Records" },
  { id: "digital", name: "Digital Downloads" },
  { id: "poster", name: "Posters & Art" },
  { id: "tour", name: "Tour Merchandise" },
  { id: "collection", name: "Collections & Bundles" },
]

const priceRanges = [
  { id: "all", name: "All Prices", min: 0, max: Infinity },
  { id: "under-25", name: "Under $25", min: 0, max: 25 },
  { id: "25-50", name: "$25 - $50", min: 25, max: 50 },
  { id: "50-100", name: "$50 - $100", min: 50, max: 100 },
  { id: "over-100", name: "Over $100", min: 100, max: Infinity },
]

const sortOptions = [
  { id: "featured", name: "Featured" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "name", name: "Name A-Z" },
  { id: "newest", name: "Newest First" },
]

export default function MerchPage() {
  const [walletConnected, setWalletConnected] = useState<boolean>(false)
  const [filters, setFilters] = useState<ProductFilters>({
    category: "all",
    priceRange: "all",
    inStock: true,
    sortBy: "featured",
    searchTerm: ""
  })

  const { showSuccess, showError } = useNotifications()
  
  // Use our API hook instead of static data
  const { data: productsData, loading, error, refetch } = useProducts({
    category: filters.category !== "all" ? filters.category : undefined,
    page: 1,
    limit: 50
  })

  const products = productsData?.products || []

  // Sample data for development
  const featuredItems = products.filter(product => product.is_featured).slice(0, 8)
  const limitedItems = products.filter(product => product.is_limited_edition).slice(0, 6)
  const merchItems = products
  const merchByCategory = categories.reduce((acc, category) => {
    acc[category.id] = products.filter(p => p.category_name?.toLowerCase() === category.id.toLowerCase())
    return acc
  }, {} as Record<string, any[]>)

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      const range = priceRanges.find(r => r.id === filters.priceRange)
      if (range) {
        filtered = filtered.filter(product => 
          product.price >= range.min && product.price <= range.max
        )
      }
    }

    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.in_stock)
    }

    // Sort products
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        break
      default: // featured
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
    }

    return filtered
  }, [products, filters])

  const handleConnectWallet = async () => {
    try {
      if (isWalletAvailable()) {
        const address = await getWalletAddress()
        if (address) {
          setWalletConnected(true)
          showSuccess("Wallet Connected", "You can now pay with cryptocurrency")
        }
      } else {
        showError("Wallet Not Found", "Please install MetaMask or another Web3 wallet")
      }
    } catch (error) {
      showError("Connection Failed", "Failed to connect wallet")
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      // In a real app, this would call the cart API
      showSuccess("Added to Cart", "Item has been added to your cart")
    } catch (error) {
      showError("Failed to Add", "Could not add item to cart")
    }
  }

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Products</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background to-background-lighter">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              <span className="text-primary">Official</span> <br />
              Merchandise
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Support the music with exclusive clothing, vinyl records, collectibles, and more. Worldwide shipping
              available.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-primary text-background hover:bg-secondary"
                onClick={() => document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Shop Now
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Browse Categories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-background-lighter border-b" id="shop-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter('searchTerm', e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map(range => (
                    <SelectItem key={range.id} value={range.id}>
                      {range.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredItems.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">Featured Items</h2>
            <ProductGrid 
              products={featuredItems} 
              onAddToCart={handleAddToCart} 
              loading={loading}
            />
          </div>
        </section>
      )}

      {/* Limited Edition */}
      {limitedItems.length > 0 && (
        <section className="py-16 bg-background-lighter">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">Limited Edition</h2>
              <Button variant="link" className="text-primary">
                View All Limited Items
              </Button>
            </div>
            <ProductGrid 
              products={limitedItems.slice(0, 6)} 
              onAddToCart={handleAddToCart} 
              loading={loading}
            />
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">All Products</h2>
          <ProductGrid 
            products={filteredProducts} 
            onAddToCart={handleAddToCart} 
            loading={loading}
          />
        </div>
      </section>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* FAQ */}
      <FAQ />
    </div>
  )
}

// Reusable Product Grid Component
function ProductGrid({ 
  products, 
  onAddToCart, 
  loading 
}: { 
  products: any[]
  onAddToCart: (id: string) => void
  loading: boolean 
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-64 bg-muted animate-pulse" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2 animate-pulse" />
              <div className="h-3 bg-muted rounded w-2/3 mb-3 animate-pulse" />
              <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart} 
        />
      ))}
    </div>
  )
}

// Product Card Component
function ProductCard({ 
  product, 
  onAddToCart 
}: { 
  product: any
  onAddToCart: (id: string) => void 
}) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {product.is_limited_edition && (
          <Badge className="absolute top-2 left-2" variant="default">
            Limited Edition
          </Badge>
        )}

        {product.discount_percentage && (
          <Badge className="absolute top-2 right-2" variant="destructive">
            {product.discount_percentage}% OFF
          </Badge>
        )}

        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            onClick={() => onAddToCart(product.id)}
            className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {product.category_name && (
            <Badge variant="secondary" className="text-xs">
              {product.category_name}
            </Badge>
          )}
          
          <Badge variant={product.in_stock ? "default" : "destructive"} className="text-xs">
            {product.in_stock ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                In Stock
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Out of Stock
              </>
            )}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {product.discount_percentage ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">
                  ${(product.price * (1 - product.discount_percentage / 100)).toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
            )}
            {product.crypto_price && (
              <span className="text-xs text-muted-foreground block">
                ETH {product.crypto_price}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Trust Indicators Component
function TrustIndicators() {
  return (
    <section className="py-12 bg-background-lighter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <Truck className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Worldwide Shipping</h3>
            <p className="text-sm text-muted-foreground">
              We ship to most countries worldwide. Orders are typically processed within 1-2 business days.
            </p>
          </Card>

          <Card className="text-center p-6">
            <CheckCircle2 className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Quality Guarantee</h3>
            <p className="text-sm text-muted-foreground">
              All merchandise is produced with premium materials and undergoes quality checks before shipping.
            </p>
          </Card>

          <Card className="text-center p-6">
            <Tag className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Official Merchandise</h3>
            <p className="text-sm text-muted-foreground">
              This is the only official store for BangoBongo merchandise. All designs are authentic and licensed.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}

// FAQ Component
function FAQ() {
  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Domestic orders typically arrive within 3-5 business days. International orders may take 7-14 business days depending on your location and customs processing."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) and cryptocurrency payments in ETH and BTC."
    },
    {
      question: "What is your return policy?",
      answer: "If you're not satisfied with your purchase, you can return unworn/unused items within 30 days of delivery for a full refund. Please note that custom and limited edition items are not eligible for returns."
    }
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline">View All FAQs</Button>
        </div>
      </div>
    </section>
  )
}
