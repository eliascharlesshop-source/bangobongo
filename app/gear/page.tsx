"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Star,
  ShoppingCart,
  DollarSign,
  Award,
  ThumbsUp,
  Filter,
  Search,
  Info,
  Play,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useGear } from "@/hooks/use-api"
import { useNotifications } from "@/contexts/notification-context"
import type { GearItem, SetupItem } from "@/types"

interface GearFilters {
  category: string
  priceRange: string
  sortBy: string
  searchTerm: string
}

// Gear categories for filtering
const gearCategories = [
  "All",
  "DJ Controller",
  "DJ Mixer",
  "Controller",
  "Audio Interface",
  "Headphones",
  "Production Software",
  "Synthesizer",
  "Monitor",
]

// Price ranges for filtering
const priceRanges = [
  { id: "all", name: "All Prices", min: 0, max: Infinity },
  { id: "under-500", name: "Under $500", min: 0, max: 500 },
  { id: "500-1000", name: "$500 - $1,000", min: 500, max: 1000 },
  { id: "1000-2000", name: "$1,000 - $2,000", min: 1000, max: 2000 },
  { id: "over-2000", name: "Over $2,000", min: 2000, max: Infinity },
]

// Sort options
const sortOptions = [
  { id: "name", name: "Name A-Z" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "rating", name: "Highest Rated" },
  { id: "newest", name: "Newest First" },
]

// Sample gear data for development
const gearItems: GearItem[] = [
  {
    id: "1",
    name: "Pioneer CDJ-3000",
    category: "DJ Controller",
    image: "/images/gear/cdj-3000.png",
    price: 2499,
    description: "Professional DJ player with advanced mixing capabilities and standalone features.",
    features: ["4-channel mixing", "High-resolution audio", "Advanced search functions", "Multi-format support"],
    rating: 5,
    yearPurchased: 2022,
    isSponsored: false,
    affiliateLink: "#",
    videoReviewLink: "#",
    personalNotes: "Industry standard for professional DJ performances. Reliable and feature-rich."
  },
  {
    id: "2",
    name: "Technics 1200MK7",
    category: "DJ Mixer",
    image: "/images/gear/technics-1200.png",
    price: 3500,
    description: "Legendary turntable with exceptional build quality and performance reliability.",
    features: ["Direct drive motor", "Pitch control", "Durable construction", "Professional grade"],
    rating: 5,
    yearPurchased: 2021,
    isSponsored: false,
    affiliateLink: "#",
    videoReviewLink: "#",
    personalNotes: "My primary turntable for vinyl performances. Best investment in my setup."
  },
  {
    id: "3",
    name: "Ableton Live 12",
    category: "Production Software",
    image: "/images/gear/ableton-live.png",
    price: 799,
    description: "Complete music production suite with powerful tools for beat making and live performance.",
    features: ["Max for Live integration", "Advanced clip editing", "Real-time effects", "Live performance mode"],
    rating: 5,
    yearPurchased: 2023,
    isSponsored: false,
    affiliateLink: "#",
    videoReviewLink: "#",
    personalNotes: "Essential for my production workflow. Highly intuitive and powerful."
  },
  {
    id: "4",
    name: "Audio-Technica AT2035",
    category: "Audio Interface",
    image: "/images/gear/at2035.png",
    price: 199,
    description: "Cardioid condenser microphone for professional recording and streaming.",
    features: ["48V phantom power", "Low noise floor", "Wide frequency response", "Durable metal body"],
    rating: 4,
    yearPurchased: 2022,
    isSponsored: false,
    affiliateLink: "#",
    videoReviewLink: "#",
    personalNotes: "Great quality for the price. Perfect for studio vocals and podcasting."
  },
  {
    id: "5",
    name: "Sennheiser HD 25",
    category: "Headphones",
    image: "/images/gear/sennheiser-hd25.png",
    price: 149,
    description: "Professional DJ headphones with excellent sound isolation and comfort.",
    features: ["Single-sided cable", "Replaceable ear pads", "Closed design", "Professional quality"],
    rating: 5,
    yearPurchased: 2020,
    isSponsored: false,
    affiliateLink: "#",
    videoReviewLink: "#",
    personalNotes: "My go-to headphones for DJing. Reliable and comfortable for long sessions."
  },
  {
    id: "6",
    name: "Moog Mother-32",
    category: "Synthesizer",
    image: "/images/gear/moog-mother-32.png",
    price: 599,
    description: "Compact semi-modular synthesizer with powerful sound design capabilities.",
    features: ["Keyboard interface", "Modular connectivity", "Built-in sequencer", "MIDI support"],
    rating: 4,
    yearPurchased: 2023,
    isSponsored: false,
    affiliateLink: "#",
    videoReviewLink: "#",
    personalNotes: "Great for live performance and experimentation. Excellent sound quality."
  }
]

const setupItems: SetupItem[] = [
  {
    id: "1",
    title: "Studio Production Setup",
    description: "My main production setup for creating beats and tracks.",
    image: "/images/gear/setup-studio.png",
    gearIncluded: ["Ableton Live 12", "Audio-Technica AT2035", "Monitor Setup"]
  },
  {
    id: "2",
    title: "Live DJ Performance",
    description: "Professional DJ setup for live performances and festivals.",
    image: "/images/gear/setup-dj.png",
    gearIncluded: ["Pioneer CDJ-3000", "DJ Mixer", "Technics 1200MK7", "Sennheiser HD 25"]
  },
  {
    id: "3",
    title: "Modular Sound Design",
    description: "Experimental setup for creating unique sounds and textures.",
    image: "/images/gear/setup-modular.png",
    gearIncluded: ["Moog Mother-32", "Eurorack Modules", "Patch Cables"]
  }
]

// Helper function to render star ratings
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "text-primary fill-primary" : "text-muted-foreground"}`} />
      ))}
    </div>
  )
}

export default function GearPage() {
  const [filters, setFilters] = useState<GearFilters>({
    category: "All",
    priceRange: "all",
    sortBy: "name",
    searchTerm: "",
  })

  // Use the API hook with fallback to sample data
  const { data: apiGear, loading, error, refetch } = useGear()
  const { showNotification } = useNotifications()

  // Use API data if available, otherwise fallback to sample data
  const gear = (Array.isArray(apiGear) && apiGear.length > 0) ? apiGear : (apiGear?.gear && apiGear.gear.length > 0 ? apiGear.gear : gearItems)

  const filteredAndSortedGear = useMemo(() => {
    let filtered = gear.filter((item: any) => {
      // Category filter
      if (filters.category !== "All" && item.category !== filters.category) {
        return false
      }

      // Price range filter
      const selectedRange = priceRanges.find(range => range.id === filters.priceRange)
      if (selectedRange && (item.price < selectedRange.min || item.price > selectedRange.max)) {
        return false
      }

      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const searchFields = [
          item.name,
          item.description,
          item.category,
          ...(item.features || []),
          item.personalNotes
        ].filter(Boolean).map(field => field.toLowerCase())

        if (!searchFields.some(field => field.includes(searchLower))) {
          return false
        }
      }

      return true
    })

    // Sort filtered results
    return filtered.sort((a: any, b: any) => {
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "newest":
          return (b.yearPurchased || 0) - (a.yearPurchased || 0)
        default:
          return 0
      }
    })
  }, [gear, filters])

  const updateFilter = (key: keyof GearFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Gear</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">My Gear</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore the equipment and setup I use for producing and performing electronic music.
          Each piece has been carefully chosen and tested in real-world scenarios.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <div className="w-full sm:flex-1 sm:min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search gear..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter("searchTerm", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:contents">
            <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {gearCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.priceRange} onValueChange={(value) => updateFilter("priceRange", value)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <DollarSign className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range.id} value={range.id}>{range.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedGear.length} of {gear.length} items
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse w-2/3 mb-4" />
                <div className="h-10 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Gear Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedGear.map((item: any) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
                {item.isSponsored && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                      Sponsored
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  {item.rating && <StarRating rating={item.rating} />}
                </div>

                <p className="text-muted-foreground mb-2">{item.category}</p>
                <p className="text-2xl font-bold text-primary mb-4">${item.price}</p>

                <p className="text-sm mb-4 line-clamp-3">{item.description}</p>

                {item.features && item.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {item.features.slice(0, 3).map((feature: any, index: any) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {item.features.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          +{item.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {item.personalNotes && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <div className="flex items-center mb-2">
                      <Info className="h-4 w-4 mr-2" />
                      <span className="font-medium text-sm">Personal Notes</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {item.personalNotes}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {item.affiliateLink && (
                    <Button asChild className="flex-1">
                      <Link href={item.affiliateLink} target="_blank">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </Link>
                    </Button>
                  )}

                  {item.videoReviewLink && (
                    <Button variant="outline" asChild>
                      <Link href={item.videoReviewLink} target="_blank">
                        <Play className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>

                {item.alternativeOptions && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Alternative Options:</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        Budget: {item.alternativeOptions.budget}
                      </span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        Premium: {item.alternativeOptions.premium}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredAndSortedGear.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No gear found matching your criteria.</div>
          <Button
            variant="outline"
            onClick={() => setFilters({ category: "All", priceRange: "all", sortBy: "name", searchTerm: "" })}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Setup Showcase */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">My Setups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {setupItems.map((setup) => (
            <Card key={setup.id} className="overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={setup.image}
                  alt={setup.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{setup.title}</h3>
                <p className="text-muted-foreground mb-4">{setup.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Gear Included:</h4>
                  <div className="flex flex-wrap gap-1">
                    {setup.gearIncluded.map((gearName, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {gearName}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
