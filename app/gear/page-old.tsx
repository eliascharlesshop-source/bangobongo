"use client"

import { useState, useMemo } from "react"
import type { Metadata } from "next"
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
  rating: string
  sortBy: string
  searchTerm: string
}

const categories = [
  "All Categories",
  "DJ Controller",
  "DJ Mixer", 
  "Production Software",
  "DJ Software",
  "Headphones",
  "Synthesizer",
  "Audio Interface",
  "Studio Monitors"
]

const priceRanges = [
  { id: "all", name: "All Prices", min: 0, max: Infinity },
  { id: "under-200", name: "Under $200", min: 0, max: 200 },
  { id: "200-500", name: "$200 - $500", min: 200, max: 500 },
  { id: "500-1000", name: "$500 - $1,000", min: 500, max: 1000 },
  { id: "over-1000", name: "Over $1,000", min: 1000, max: Infinity },
]

const sortOptions = [
  { id: "featured", name: "Featured" },
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
      "The industry-standard 4-channel digital mixer with enhanced EQ and effects, plus dual USB ports for seamless DJ changeovers and back-to-back sets.",
    price: 2199,
    features: [
      "64-bit mixing processor for pristine audio quality",
      "Improved Sound Color FX and Beat FX with parameters control",
      "EQ/ISO selectable per channel",
      "Independent Send/Return circuit",
      "Two USB ports for smooth DJ transitions",
    ],
    personalNotes:
      "The audio quality of the DJM-900NXS2 is exceptional, with noticeably clearer highs and punchier bass than previous models. The effects section has become an integral part of my performances, allowing me to completely transform tracks on the fly.",
    rating: 5,
    yearPurchased: 2021,
    alternativeOptions: {
      budget: "Pioneer DJ DJM-750MK2",
      premium: "Allen & Heath Xone:96",
    },
  },
  {
    id: "gear3",
    name: "Ableton Live 11 Suite",
    category: "Production Software",
    image: "/placeholder.svg?height=500&width=500",
    link: "#",
    affiliateLink: "https://example.com/affiliate/ableton11",
    description:
      "Ableton Live 11 Suite is a complete music production package with everything you need to create and finish tracks, including professional instruments, effects, sounds, and features.",
    price: 749,
    features: [
      "Comping for taking multiple passes of an idea",
      "MPE compatibility for expressive controller support",
      "Linked-track editing for managing multi-track recordings",
      "Updated devices and sounds with new creative possibilities",
      "Tempo following and improved performance capabilities",
    ],
    personalNotes:
      "Ableton Live has been my primary DAW for over a decade, and version 11 brings some incredibly useful workflow enhancements. The comping feature alone has saved me countless hours during vocal and instrument recording sessions.",
    rating: 5,
    yearPurchased: 2021,
    alternativeOptions: {
      budget: "Ableton Live 11 Standard",
      premium: "Ableton Live 11 Suite + Max for Live",
    },
    videoReviewLink: "#",
  },
  {
    id: "gear4",
    name: "Native Instruments Traktor Pro 3",
    category: "DJ Software",
    image: "/placeholder.svg?height=500&width=500",
    link: "#",
    affiliateLink: "https://example.com/affiliate/traktorpro3",
    description:
      "Professional DJ software with powerful features for creative DJing, advanced track analysis, and intuitive performance workflow.",
    price: 99,
    features: [
      "Harmonic mixing with key detection and matching",
      "Elastic beats engine for accurate beatgrid alignment",
      "Over 40 built-in effects with customizable parameters",
      "4-deck mixing with advanced sample capabilities",
      "Comprehensive controller integration",
    ],
    personalNotes:
      "I use Traktor Pro 3 when performing hybrid sets that combine traditional DJing with live elements. The stability is rock-solid, and the effects are perfect for creating unique transitions between tracks.",
    rating: 4,
    yearPurchased: 2020,
    alternativeOptions: {
      budget: "Algoriddim djay Pro",
      premium: "Traktor Pro 3 + Kontrol S4 MK3",
    },
  },
  {
    id: "gear5",
    name: "Sennheiser HD-25",
    category: "Headphones",
    image: "/placeholder.svg?height=500&width=500",
    link: "#",
    affiliateLink: "https://example.com/affiliate/hd25",
    description:
      "Industry-standard DJ headphones delivering exceptional sound isolation, handling high sound pressure levels, and featuring a tough, modular design.",
    price: 149,
    features: [
      "Excellent ambient noise isolation",
      "High maximum sound pressure level (120dB)",
      "Lightweight and comfortable for extended wear",
      "Rotatable ear cup for single-ear monitoring",
      "Fully modular design for easy maintenance and replacement parts",
    ],
    personalNotes:
      "These headphones have survived countless gigs in challenging environments. The sound isolation is crucial in loud club settings, and the replaceable parts have saved me money over time. The clear, accurate monitoring has helped me match beats perfectly even in the most challenging acoustic environments.",
    rating: 5,
    yearPurchased: 2019,
    alternativeOptions: {
      budget: "Audio-Technica ATH-M40x",
      premium: "V-Moda Crossfade M-100",
    },
  },
  {
    id: "gear6",
    name: "Moog Subsequent 37",
    category: "Synthesizer",
    image: "/placeholder.svg?height=500&width=500",
    link: "#",
    affiliateLink: "https://example.com/affiliate/subsequent37",
    description:
      "Analog paraphonic synthesizer featuring two oscillators with selectable waveshape and hard sync, dual-source analog filter, and multidrive circuit.",
    price: 1599,
    features: [
      "Paraphonic capabilities for playing two notes simultaneously",
      "37 full-size keys with velocity and aftertouch",
      "256 preset locations with front panel preset buttons",
      "MIDI and USB connectivity with DAW integration",
      "Two dedicated modulation busses",
    ],
    personalNotes:
      "The Moog Subsequent 37 delivers the iconic Moog bass sound that's been foundational to my productions. The hands-on control and tactile interface inspire creativity in ways that software instruments simply can't match. The build quality is exceptional - this is an instrument built to last decades.",
    rating: 5,
    yearPurchased: 2021,
    alternativeOptions: {
      budget: "Behringer Model D",
      premium: "Moog One",
    },
    videoReviewLink: "#",
  },
  {
    id: "gear7",
    name: "Universal Audio Apollo Twin X",
    category: "Audio Interface",
    image: "/placeholder.svg?height=500&width=500",
    link: "#",
    affiliateLink: "https://example.com/affiliate/apollotwinx",
    description:
      "Desktop Thunderbolt 3 audio interface with class-leading 24-bit/192 kHz conversion and real-time UAD processing for recording through UAD plugins with near-zero latency.",
    price: 899,
    features: [
      "Elite-class AD/DA conversion for pristine recording quality",
      "Unison-enabled mic preamps for authentic emulation of classic gear",
      "UAD-2 DUO Core processing for real-time effects",
      "Thunderbolt 3 connectivity for ultra-low latency",
      "Bundled with UAD plugins worth over $1000",
    ],
    personalNotes:
      "The Apollo Twin X has dramatically improved my recording and production workflow. Being able to track through UAD plugins with virtually no latency lets me commit to sounds during the creative process. The preamp emulations are incredibly accurate - I've been able to achieve studio-quality vocal and instrument recordings in my home setup.",
    rating: 5,
    yearPurchased: 2022,
    alternativeOptions: {
      budget: "Focusrite Scarlett 2i2",
      premium: "Universal Audio Apollo x8",
    },
  },
  {
    id: "gear8",
    name: "KRK Rokit 8 G4",
    category: "Studio Monitors",
    image: "/placeholder.svg?height=500&width=500",
    link: "#",
    affiliateLink: "https://example.com/affiliate/rokit8g4",
    description:
      "Professional studio monitors with DSP-driven EQ and room correction, featuring an 8-inch composite woofer and 1-inch tweeter for accurate sound reproduction.",
    price: 299,
    features: [
      "Built-in LCD visual EQ with 25 settings",
      "Kevlar drivers for precise playback and imaging",
      "Class D power amplifier for optimal performance",
      "Brick wall limiter for protection and clarity at high volumes",
      "Low-resonance enclosure for minimized distortion",
    ],
    personalNotes:
      "After trying several monitor options, I settled on the KRK Rokit 8 G4s for their balanced sound and adjustable EQ, which helped compensate for my imperfect studio acoustics. They provide enough low-end response that I rarely need to check mixes on a subwoofer, while still maintaining clear, accurate mids and highs.",
    rating: 4,
    yearPurchased: 2020,
    alternativeOptions: {
      budget: "PreSonus Eris E5",
      premium: "Adam Audio A7X",
    },
  },
]

// Studio setups data
const studioSetups: SetupItem[] = [
  {
    id: "setup1",
    title: "Main DJ Setup",
    description:
      "My club-standard performance rig with premium controllers for maximum creative flexibility during live sets.",
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

]

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

export default function GearPage() {
  {
    id: "gear3",
    name: "Ableton Live 11 Suite",
    category: "Production Software",
    image: "/placeholder.svg?height=500&width=500",
    link: "#",
    affiliateLink: "https://example.com/affiliate/ableton11",
    description:
      "Ableton Live 11 Suite is a complete music production package with everything you need to create and finish tracks, including professional instruments, effects, sounds, and features.",
    price: 749,
    features: [
      "Comping for taking multiple passes of an idea",
      "MPE compatibility for expressive controller support",
      "Linked-track editing for managing multi-track recordings",
      "Updated devices and sounds with new creative possibilities",
      "Tempo following and improved performance capabilities",
    ],
    personalNotes:
      "Ableton Live has been my primary DAW for over a decade, and version 11 brings some incredibly useful workflow enhancements. The comping feature alone has saved me countless hours during vocal and instrument recording sessions.",
    rating: 5,
    yearPurchased: 2021,
    alternativeOptions: {
      budget: "Ableton Live 11 Standard",
      premium: "Ableton Live 11 Suite + Max for Live",
    },
    videoReviewLink: "#",
  },
]

// Studio setups data
const studioSetupsData: SetupItem[] = [
  {
    id: "setup1",
    title: "Main DJ Setup",
    description:
      "My club-standard performance rig with premium controllers for maximum creative flexibility during live sets.",
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

// Gear Card Component
function GearCard({ item }: { item: GearItem }) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary flex flex-col h-full">
      <div className="relative">
        <div className="relative aspect-square overflow-hidden bg-background-lighter">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          />
          {item.videoReviewLink && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
              <Button
                variant="ghost"
                className="rounded-full h-12 w-12 bg-primary/80 hover:bg-primary text-background transform scale-90 group-hover:scale-100 transition-all duration-300"
              >
                <Play className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>

        {item.isSponsored && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/20 text-primary font-medium backdrop-blur-sm">
              <Award className="h-3 w-3 mr-1" />
              Sponsored
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <div className="flex justify-between items-start">
            <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {item.name}
            </h4>
            <StarRating rating={item.rating || 0} />
          </div>

          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <span className="mr-3">Since {item.yearPurchased}</span>
            {item.price && (
              <span className="flex items-center font-medium text-primary">
                <DollarSign className="h-3 w-3 mr-1" />
                {item.price?.toLocaleString("en-US", { style: "currency", currency: "USD" })}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">{item.description}</p>

        {item.features && item.features.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-foreground mb-2">Top Features:</div>
            <ul className="text-xs text-muted-foreground space-y-1">
              {item.features.slice(0, 2).map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="h-3 w-3 text-primary mr-1 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={item.affiliateLink || item.link} target="_blank" rel="noopener noreferrer">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Now
            </Link>
          </Button>

          <Button variant="outline" size="sm" className="flex-1">
            <Info className="h-4 w-4 mr-2" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function GearPage() {
  const [filters, setFilters] = useState<GearFilters>({
    category: "All Categories",
    priceRange: "all",
    rating: "all",
    sortBy: "featured",
    searchTerm: ""
  })

  const { showSuccess, showError } = useNotifications()
  
  // Use our API hook
  const { data: gearData, loading, error, refetch } = useGear({
    category: filters.category !== "All Categories" ? filters.category : undefined,
    page: 1,
    limit: 50
  })

  const gearItems = gearData?.gear || gearItemsSample // Fallback to sample data
  
  // Filter and sort gear
  const filteredGear = useMemo(() => {
    let filtered = [...gearItems]

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (filters.category !== "All Categories") {
      filtered = filtered.filter(item => item.category === filters.category)
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      const range = priceRanges.find(r => r.id === filters.priceRange)
      if (range) {
        filtered = filtered.filter(item => 
          item.price >= range.min && item.price <= range.max
        )
      }
    }

    // Rating filter
    if (filters.rating !== "all") {
      const minRating = parseInt(filters.rating)
      filtered = filtered.filter(item => (item.rating || 0) >= minRating)
    }

    // Sort gear
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "newest":
        filtered.sort((a, b) => (b.yearPurchased || 0) - (a.yearPurchased || 0))
        break
      default: // featured
        filtered.sort((a, b) => (b.isSponsored ? 1 : 0) - (a.isSponsored ? 1 : 0))
    }

    return filtered
  }, [gearItems, filters])

  // Group gear by category
  const gearByCategory: Record<string, GearItem[]> = filteredGear.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, GearItem[]>,
  )

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background to-background-lighter">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              <span className="text-primary">My Gear</span> <br />
              Studio & Performance
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore the equipment I use to create and perform electronic music, with my personal insights and
              recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Studio Setups Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">My Studio Setups</h2>

          <div className="space-y-12">
            {studioSetupsData.map((setup) => (
              <div key={setup.id} className="bg-background-lighter rounded-lg overflow-hidden border border-accent">
                <div className="lg:flex">
                  <div className="lg:w-1/2">
                    <div className="relative h-64 lg:h-full">
                      <Image src={setup.image || "/placeholder.svg"} alt={setup.title} fill className="object-cover" />
                    </div>
                  </div>

                  <div className="lg:w-1/2 p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{setup.title}</h3>
                    <p className="text-muted-foreground mb-6">{setup.description}</p>

                    <h4 className="font-semibold text-foreground mb-3">Featured Equipment:</h4>
                    <ul className="space-y-2 mb-6">
                      {setup.gearIncluded.map((gear, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3 mt-0.5">
                            {index + 1}
                          </div>
                          <span>{gear}</span>
                        </li>
                      ))}
                    </ul>

                    <Button className="bg-primary text-background hover:bg-secondary">See Equipment Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gear Categories Section */}
      <section className="py-16 bg-background-lighter">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-foreground">My Equipment</h2>

            <div className="flex items-center gap-3">
              <div className="relative w-60">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search gear..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter('searchTerm', e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger className="w-48">
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
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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
          ) : (
            <div className="space-y-16">
              {Object.entries(gearByCategory).map(([category, items]) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-foreground">{category}</h3>
                    <Button variant="link" className="text-primary text-sm">
                      View All {category}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <GearCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Gear Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Featured Gear</h2>

          <div className="max-w-5xl mx-auto">
            {gearItems
              .filter((item) => item.isSponsored)
              .map((item) => (
                <div
                  key={item.id}
                  className="mb-16 bg-background-lighter rounded-lg overflow-hidden border border-accent hover:border-primary transition-all duration-300"
                >
                  <div className="md:flex">
                    <div className="md:w-2/5">
                      <div className="relative h-72 md:h-full">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-contain p-6"
                        />
                      </div>
                    </div>

                    <div className="md:w-3/5 p-6 md:p-8">
                      <div className="flex items-center mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/20 text-primary mr-3">
                          <Award className="h-3 w-3 mr-1" />
                          Featured Gear
                        </span>
                        <StarRating rating={item.rating || 0} />
                      </div>

                      <h3 className="text-2xl font-bold text-foreground mb-2">{item.name}</h3>
                      <p className="text-muted-foreground mb-6">{item.description}</p>

                      <div className="mb-6">
                        <h4 className="font-semibold text-foreground mb-3">Key Features:</h4>
                        <ul className="space-y-2 text-sm">
                          {item.features?.map((feature: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <ThumbsUp className="h-4 w-4 text-primary mr-2 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-foreground mb-2">My Experience:</h4>
                        <p className="text-sm text-muted-foreground italic">"{item.personalNotes}"</p>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <Button asChild>
                          <Link href={item.affiliateLink || item.link} target="_blank" rel="noopener noreferrer">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Buy Now (${item.price})
                          </Link>
                        </Button>

                        {item.alternativeOptions && (
                          <div className="flex flex-col text-sm">
                            {item.alternativeOptions.budget && (
                              <span className="text-muted-foreground">
                                Budget alternative:{" "}
                                <Link href="#" className="text-primary hover:underline">
                                  {item.alternativeOptions.budget}
                                </Link>
                              </span>
                            )}
                            {item.alternativeOptions.premium && (
                              <span className="text-muted-foreground">
                                Premium alternative:{" "}
                                <Link href="#" className="text-primary hover:underline">
                                  {item.alternativeOptions.premium}
                                </Link>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Beginner Recommendations */}
      <section className="py-16 bg-background-lighter">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Starting Your Own Setup</h2>
            <p className="text-muted-foreground">
              Recommendations for beginners looking to get into DJing and music production without breaking the bank.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg overflow-hidden border border-accent hover:border-primary transition-all duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Entry-Level DJ Setup</h3>
                <ul className="space-y-4 mb-6">
                  <li className="flex flex-col">
                    <span className="font-medium">Controller:</span>
                    <span className="text-sm text-muted-foreground">Pioneer DJ DDJ-400 ($249)</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-medium">Software:</span>
                    <span className="text-sm text-muted-foreground">Rekordbox DJ (included)</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-medium">Headphones:</span>
                    <span className="text-sm text-muted-foreground">Audio-Technica ATH-M40x ($99)</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-medium">Speakers:</span>
                    <span className="text-sm text-muted-foreground">PreSonus Eris E3.5 ($99)</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full hover:bg-primary hover:text-background">
                  View Equipment
                </Button>
              </div>
            </div>

            <div className="bg-background rounded-lg overflow-hidden border border-accent hover:border-primary transition-all duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Starter Production Setup</h3>
                <ul className="space-y-4 mb-6">
                  <li className="flex flex-col">
                    <span className="font-medium">DAW:</span>
                    <span className="text-sm text-muted-foreground">Ableton Live 11 Intro ($99)</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-medium">Audio Interface:</span>
                    <span className="text-sm text-muted-foreground">Focusrite Scarlett 2i2 ($169)</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-medium">Monitors:</span>
                    <span className="text-sm text-muted-foreground">PreSonus Eris E3.5 ($99)</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-medium">MIDI Controller:</span>
                    <span className="text-sm text-muted-foreground">Akai MPK Mini MK3 ($119)</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full hover:bg-primary hover:text-background">
                  View Equipment
                </Button>
              </div>
            </div>

            <div className="bg-background rounded-lg overflow-hidden border border-accent hover:border-primary transition-all duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Mobile Setup</h3>
                <ul className="space-y-4 mb-6">
                  <li className="flex flex-col">
                    <span className="font-medium">Laptop:</span>
                    <span className="text-sm text-muted-foreground">MacBook Air M1 (from $999)</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-medium">DJ Controller:</span>
                    <span className="text-sm text-muted-foreground">Native Instruments Traktor Kontrol S2 ($299)</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-medium">Headphones:</span>
                    <span className="text-sm text-muted-foreground">Sennheiser HD-25 Light ($99)</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-medium">Portable Speaker:</span>
                    <span className="text-sm text-muted-foreground">JBL Flip 5 ($129)</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full hover:bg-primary hover:text-background">
                  View Equipment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-background-lighter rounded-lg border border-accent p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                What equipment do you recommend for beginners?
              </h3>
              <p className="text-muted-foreground">
                For beginners, I recommend starting with user-friendly DJ controllers like the Pioneer DDJ-400 or
                Traktor Kontrol S2. For production, Ableton Live Intro or FL Studio Fruity Edition are great entry
                points. The key is to start with something approachable but capable enough to grow with you.
              </p>
            </div>

            <div className="bg-background-lighter rounded-lg border border-accent p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Do I need expensive gear to make professional-sounding music?
              </h3>
              <p className="text-muted-foreground">
                Not necessarily. While professional equipment can offer advantages in sound quality and features,
                creative skills and technical knowledge are far more important. Many successful tracks have been
                produced on basic setups. Focus on mastering your tools rather than constantly upgrading.
              </p>
            </div>

            <div className="bg-background-lighter rounded-lg border border-accent p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">How do you maintain your equipment?</h3>
              <p className="text-muted-foreground">
                Regular maintenance is essential. I clean my DJ equipment after every gig, use protective covers when
                not in use, and keep gear in flight cases for transportation. For studio equipment, I ensure proper
                ventilation, use surge protectors, and perform regular software updates. Preventative care extends the
                life of your investment.
              </p>
            </div>

            <div className="bg-background-lighter rounded-lg border border-accent p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Are the affiliate links how you make money?
              </h3>
              <p className="text-muted-foreground">
                The affiliate links provide a small commission when purchases are made, which helps support the website
                and my content creation. However, I only recommend equipment I personally use and believe in. My reviews
                and opinions remain honest and unbiased regardless of affiliate relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Got Questions About Gear?</h2>
            <p className="text-muted-foreground mb-8">
              Have specific questions about my setup or need personalized recommendations? Get in touch and I'll be
              happy to help you find the right equipment for your needs and budget.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-primary text-background hover:bg-secondary">
                Contact Me
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-background"
              >
                Join Discord Community
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
