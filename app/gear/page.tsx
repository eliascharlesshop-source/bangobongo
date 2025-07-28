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

// Sample gear data
const gearItems: GearItem[] = [
  {
    id: "gear1",
    name: "Pioneer DJ CDJ-3000",
    category: "DJ Controller",
    image: "/placeholder.svg?height=500&width=500",
    link: "#",
    affiliateLink: "https://example.com/affiliate/cdj3000",
    description:
      "The CDJ-3000 represents a new frontier in player design. Pioneer DJ's most advanced player ever brings a host of new features that can help you craft unique performances and take your DJ career to new heights.",
    price: 2299,
    features: [
      "9-inch touch screen with higher resolution than the CDJ-2000NXS2",
      "MPU (micro-processing unit) for advanced track analysis and features",
      "Key Sync and Key Shift functions to mix harmonically",
      "8 Hot Cue buttons with gate playback",
      "Advanced Beat Jump functionality",
    ],
    personalNotes:
      "The CDJ-3000s completely transformed my performance workflow. The responsive jog wheels and improved hot cues make live remixing more intuitive than ever before. The large display makes track navigation effortless in dark club environments.",
    rating: 5,
    yearPurchased: 2022,
    isSponsored: true,
    alternativeOptions: {
      budget: "Pioneer DJ XDJ-700",
      premium: "Denon DJ SC6000M Prime",
    },
    videoReviewLink: "#",
  },
  {
    id: "gear2",
    name: "Pioneer DJ DJM-900NXS2",
    category: "DJ Mixer",
    image: "/placeholder.svg?height=500&width=500",
    link: "#",
    affiliateLink: "https://example.com/affiliate/djm900nxs2",
    description:
      "The DJM-900NXS2 is Pioneer DJ's flagship mixer, known for its professional-grade performance and industry-standard build quality.",
    price: 1299,
    features: [
      "4-channel mixer with built-in effects",
      "Beat FX with 14 different effects",
      "Sound Color FX for creative transitions",
      "32-bit/96 kHz sound card for premium audio quality",
      "Connect up to 4 CDJs with a single USB cable",
    ],
    personalNotes:
      "This mixer has been the backbone of my setup for years. The sound quality is exceptional, and the effects engine adds a professional polish to every mix. The build quality means it handles the rigors of touring without missing a beat.",
    rating: 5,
    yearPurchased: 2021,
    isSponsored: false,
    alternativeOptions: {
      budget: "Pioneer DJ DJM-750MK2",
      premium: "Allen & Heath Model 1",
    },
    videoReviewLink: "#",
  },
  {
    id: "gear3",
    name: "Ableton Push 3",
    category: "Controller",
    image: "/placeholder.svg?height=500&width=500",
    link: "#",
    affiliateLink: "https://example.com/affiliate/push3",
    description:
      "The latest generation of Ableton's flagship controller features MPE support, an upgraded display, and standalone capabilities.",
    price: 799,
    features: [
      "MPE support for expressive control",
      "High-resolution color display",
      "Standalone operation without computer",
      "64 velocity-sensitive pads",
      "Built-in sequencer and sampler",
    ],
    personalNotes:
      "The Push 3 has revolutionized my production workflow. Being able to sketch ideas without booting up my laptop has led to more spontaneous creativity. The MPE capabilities open up new dimensions of expression in my performances.",
    rating: 4,
    yearPurchased: 2023,
    isSponsored: false,
    alternativeOptions: {
      budget: "Novation Launchpad X",
      premium: "Native Instruments Maschine+",
    },
    videoReviewLink: "#",
  },
  {
    id: "gear4",
    name: "Universal Audio Apollo Twin X",
    category: "Audio Interface",
    image: "/placeholder.svg?height=500&width=500",
    link: "#",
    affiliateLink: "https://example.com/affiliate/apollotwinx",
    description:
      "Professional 2x6 Thunderbolt 3 audio interface with UAD DSP processing and premium mic preamps.",
    price: 699,
    features: [
      "QUAD Core UAD DSP processing",
      "2 Unison-enabled mic preamps",
      "Real-time UAD processing",
      "Thunderbolt 3 connectivity",
      "Luna Recording System included",
    ],
    personalNotes:
      "The Apollo Twin X delivers studio-quality sound that's noticeable in every recording. The UAD plugins process in real-time without latency, making the recording process feel natural and inspiring.",
    rating: 5,
    yearPurchased: 2022,
    isSponsored: true,
    alternativeOptions: {
      budget: "Focusrite Scarlett 2i2",
      premium: "Universal Audio Apollo x6",
    },
    videoReviewLink: "#",
  },
  {
    id: "gear5",
    name: "Sennheiser HD 650",
    category: "Headphones",
    image: "/placeholder.svg?height=500&width=500",
    link: "#",
    affiliateLink: "https://example.com/affiliate/hd650",
    description:
      "Open-back dynamic headphones renowned for their natural sound reproduction and comfort during long listening sessions.",
    price: 399,
    features: [
      "Open-back design for natural soundstage",
      "300-ohm impedance for detailed reproduction",
      "Replaceable cable and parts",
      "Comfortable for extended wear",
      "Legendary Sennheiser sound signature",
    ],
    personalNotes:
      "These headphones have been my reference for mixing and mastering for over a decade. The natural, uncolored sound helps me make decisions that translate well across different playback systems.",
    rating: 5,
    yearPurchased: 2020,
    isSponsored: false,
    alternativeOptions: {
      budget: "Audio-Technica ATH-M40x",
      premium: "Focal Clear MG",
    },
    videoReviewLink: "#",
  },
]

const setupItems: SetupItem[] = [
  {
    id: "setup1",
    title: "Live Performance Rig",
    description:
      "My go-to setup for live shows and club performances, designed for reliability and creative expression.",
    image: "/placeholder.svg?height=800&width=1200",
    gearIncluded: ["Pioneer DJ CDJ-3000", "Pioneer DJ DJM-900NXS2", "Sennheiser HD-25"],
  },
  {
    id: "setup2",
    title: "Production Studio",
    description:
      "The heart of my music creation process, featuring high-quality audio processing and monitoring equipment.",
    image: "/placeholder.svg?height=800&width=1200",
    gearIncluded: ["Ableton Live 11 Suite", "Universal Audio Apollo Twin X", "KRK Rokit 8 G4", "Moog Subsequent 37"],
  },
  {
    id: "setup3",
    title: "Mobile Setup",
    description: "My compact travel rig for producing on the road and preparing sets while touring.",
    image: "/placeholder.svg?height=800&width=1200",
    gearIncluded: ["Native Instruments Traktor Pro 3", "Ableton Live 11 Suite", "Sennheiser HD-25"],
  },
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
  const gear = Array.isArray(apiGear) ? apiGear : (apiGear?.gear || gearItems)

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
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search gear..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter("searchTerm", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {gearCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.priceRange} onValueChange={(value) => updateFilter("priceRange", value)}>
            <SelectTrigger className="w-[200px]">
              <DollarSign className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range.id} value={range.id}>
                  {range.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
            <SelectTrigger className="w-[200px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
