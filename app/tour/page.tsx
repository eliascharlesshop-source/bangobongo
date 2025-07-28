"use client"

import { useState, useMemo } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { 
  CalendarDays, 
  MapPin, 
  Ticket, 
  Calendar, 
  ChevronRight, 
  Filter, 
  Search, 
  Globe,
  AlertCircle,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTours } from "@/hooks/use-api"
import { useNotifications } from "@/contexts/notification-context"
import type { TourDate } from "@/types"

interface TourFilters {
  country: string
  month: string
  status: string
  sortBy: string
  searchTerm: string
}

const countries = [
  "All Countries",
  "USA", 
  "Germany",
  "UK",
  "Belgium",
  "Spain", 
  "Japan",
  "Netherlands",
  "France"
]

const months = [
  "All Months",
  "March 2024",
  "April 2024", 
  "May 2024",
  "June 2024",
  "July 2024",
  "August 2024"
]

const sortOptions = [
  { id: "date", name: "Date" },
  { id: "city", name: "City A-Z" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
]

// Sample tour data
const tourDates: TourDate[] = [
  {
    id: "tour1",
    date: "Mar 15, 2024",
    venue: "Pulse Nightclub",
    city: "Miami",
    country: "USA",
    ticketLink: "#",
    status: "upcoming",
    price: {
      general: 45,
      vip: 120,
    },
    description: "Join BangoBongo for a night of electronic beats and immersive visuals at Miami's premier nightclub.",
    image: "/placeholder.svg?height=500&width=800",
    coordinates: {
      lat: 25.7617,
      lng: -80.1918,
    },
  },
  {
    id: "tour2",
    date: "Apr 2, 2024",
    venue: "Echo Arena",
    city: "Los Angeles",
    country: "USA",
    ticketLink: "#",
    status: "upcoming",
    price: {
      general: 55,
      vip: 150,
    },
    description:
      "BangoBongo brings his Neon Nights tour to LA with special guest performers and state-of-the-art production.",
    image: "/placeholder.svg?height=500&width=800",
    coordinates: {
      lat: 34.0522,
      lng: -118.2437,
    },
  },
  {
    id: "tour3",
    date: "Apr 18, 2024",
    venue: "Neon Gardens",
    city: "New York",
    country: "USA",
    ticketLink: "#",
    status: "upcoming",
    price: {
      general: 60,
      vip: 180,
    },
    description: "Experience the fusion of electronic music and innovative visuals in this special NYC performance.",
    image: "/placeholder.svg?height=500&width=800",
    coordinates: {
      lat: 40.7128,
      lng: -74.006,
    },
  },
  {
    id: "tour4",
    date: "May 5, 2024",
    venue: "Digital Dreams Festival",
    city: "Chicago",
    country: "USA",
    ticketLink: "#",
    status: "upcoming",
    price: {
      general: 85,
      vip: 220,
    },
    description: "BangoBongo headlines the Digital Dreams Festival with a 2-hour set featuring new unreleased tracks.",
    image: "/placeholder.svg?height=500&width=800",
    coordinates: {
      lat: 41.8781,
      lng: -87.6298,
    },
  },
  {
    id: "tour5",
    date: "May 20, 2024",
    venue: "Techno Temple",
    city: "Berlin",
    country: "Germany",
    ticketLink: "#",
    status: "upcoming",
    price: {
      general: 50,
      vip: 140,
    },
    description: "BangoBongo makes his European tour debut at Berlin's legendary Techno Temple.",
    image: "/placeholder.svg?height=500&width=800",
    coordinates: {
      lat: 52.52,
      lng: 13.405,
    },
  },
  {
    id: "tour6",
    date: "Jun 8, 2024",
    venue: "Warehouse Project",
    city: "Manchester",
    country: "UK",
    ticketLink: "#",
    status: "upcoming",
    price: {
      general: 45,
      vip: 125,
    },
    description: "A special warehouse set featuring extended play and collaborative performances.",
    image: "/placeholder.svg?height=500&width=800",
    coordinates: {
      lat: 53.4808,
      lng: -2.2426,
    },
  },
  {
    id: "tour7",
    date: "Jun 15, 2024",
    venue: "Fabric",
    city: "London",
    country: "UK",
    ticketLink: "#",
    status: "upcoming",
    price: {
      general: 55,
      vip: 150,
    },
    description: "BangoBongo takes over Room 1 at the iconic Fabric nightclub for an unforgettable night.",
    image: "/placeholder.svg?height=500&width=800",
    coordinates: {
      lat: 51.5074,
      lng: -0.1278,
    },
  },
  {
    id: "tour8",
    date: "Jul 1, 2024",
    venue: "Tomorrowland",
    city: "Boom",
    country: "Belgium",
    ticketLink: "#",
    status: "upcoming",
    price: {
      general: 110,
      vip: 300,
    },
    description: "BangoBongo performs on the main stage at one of the world's biggest electronic music festivals.",
    image: "/placeholder.svg?height=500&width=800",
    coordinates: {
      lat: 51.0897,
      lng: 4.3651,
    },
  },
  {
    id: "tour9",
    date: "Jul 20, 2024",
    venue: "Ibiza Club",
    city: "Ibiza",
    country: "Spain",
    ticketLink: "#",
    status: "upcoming",
    price: {
      general: 70,
      vip: 200,
    },
    description: "Summer residency kickoff at Ibiza's premier nightlife destination.",
    image: "/placeholder.svg?height=500&width=800",
    coordinates: {
      lat: 38.9067,
      lng: 1.4206,
    },
  },
  {
    id: "tour10",
    date: "Aug 15, 2024",
    venue: "Fuji Rock Festival",
    city: "Tokyo",
    country: "Japan",
    ticketLink: "#",
    status: "upcoming",
    price: {
      general: 95,
      vip: 250,
    },
    description: "BangoBongo makes his Japanese debut at the legendary Fuji Rock Festival.",
    image: "/placeholder.svg?height=500&width=800",
    coordinates: {
      lat: 35.6762,
      lng: 139.6503,
    },
  },
]

// Sample tour data for development
const tourDatesSample: TourDate[] = [
  {
    id: "tour1",
    date: "Mar 15, 2024",
    venue: "Pulse Nightclub",
    city: "Miami",
    country: "USA",
    ticketLink: "#",
    status: "upcoming",
    price: {
      general: 45,
      vip: 120,
    },
    description: "Join BangoBongo for a night of electronic beats and immersive visuals at Miami's premier nightclub.",
    image: "/placeholder.svg?height=500&width=800",
    coordinates: {
      lat: 25.7617,
      lng: -80.1918,
    },
  },
  {
    id: "tour2",
    date: "Apr 2, 2024",
    venue: "Echo Arena",
    city: "Los Angeles",
    country: "USA",
    ticketLink: "#",
    status: "upcoming",
    price: {
      general: 55,
      vip: 150,
    },
    description:
      "BangoBongo brings his Neon Nights tour to LA with special guest performers and state-of-the-art production.",
    image: "/placeholder.svg?height=500&width=800",
    coordinates: {
      lat: 34.0522,
      lng: -118.2437,
    },
  },
  {
    id: "tour3",
    date: "Apr 18, 2024",
    venue: "Neon Gardens",
    city: "New York",
    country: "USA",
    ticketLink: "#",
    status: "upcoming",
    price: {
      general: 60,
      vip: 180,
    },
    description: "Experience the fusion of electronic music and innovative visuals in this special NYC performance.",
    image: "/placeholder.svg?height=500&width=800",
    coordinates: {
      lat: 40.7128,
      lng: -74.006,
    },
  },
]

// Group tour dates by month
const groupTourDatesByMonth = (dates: TourDate[]) => {
  const grouped: Record<string, TourDate[]> = {}

  dates.forEach((date) => {
    const monthYear = date.date.split(",")[0].split(" ")[0] + " " + date.date.split(",")[1].trim()
    if (!grouped[monthYear]) {
      grouped[monthYear] = []
    }
    grouped[monthYear].push(date)
  })

  return grouped
}

export default function TourPage() {
  const [filters, setFilters] = useState<TourFilters>({
    country: "All Countries",
    month: "All Months", 
    status: "upcoming",
    sortBy: "date",
    searchTerm: ""
  })

  const { showSuccess, showError } = useNotifications()
  
  // Use our API hook
  const { data: toursData, loading, error, refetch } = useTours({
    upcoming: filters.status === "upcoming",
    page: 1,
    limit: 50
  })

  const tourDates = toursData?.tours || tourDatesSample // Fallback to sample data
  
  // Filter and sort tours
  const filteredTours = useMemo(() => {
    let filtered = [...tourDates]

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(tour =>
        tour.city.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        tour.venue.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        tour.country.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    }

    // Country filter
    if (filters.country !== "All Countries") {
      filtered = filtered.filter(tour => tour.country === filters.country)
    }

    // Month filter
    if (filters.month !== "All Months") {
      filtered = filtered.filter(tour => {
        const tourMonth = tour.date.split(",")[0].split(" ")[0] + " " + tour.date.split(",")[1].trim()
        return tourMonth === filters.month
      })
    }

    // Status filter
    filtered = filtered.filter(tour => tour.status === filters.status)

    // Sort tours
    switch (filters.sortBy) {
      case "city":
        filtered.sort((a, b) => a.city.localeCompare(b.city))
        break
      case "price-low":
        filtered.sort((a, b) => (a.price?.general || 0) - (b.price?.general || 0))
        break
      case "price-high":
        filtered.sort((a, b) => (b.price?.general || 0) - (a.price?.general || 0))
        break
      default: // date
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    return filtered
  }, [tourDates, filters])

  const groupedTourDates = groupTourDatesByMonth(filteredTours)

  const updateFilter = (key: keyof TourFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleTicketPurchase = (tourId: string) => {
    showSuccess("Redirecting to Tickets", "Opening ticket vendor page...")
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Tours</h2>
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
              <span className="text-primary">World Tour</span> <br />
              2024
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Experience BangoBongo live across the globe. Check out upcoming shows and secure your tickets.
            </p>
          </div>
        </div>
      </section>

      {/* Tour Map Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
            <Globe className="h-7 w-7 mr-2 text-primary" />
            Tour Locations
          </h2>

          <div className="bg-background-lighter rounded-lg overflow-hidden border border-accent p-4 md:p-6 mb-12">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=800&width=1600" alt="Tour Map" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-foreground bg-background/80 px-4 py-2 rounded-md">
                  Interactive tour map would be displayed here
                </p>
              </div>

              {/* Tour location markers would be positioned here */}
              {tourDates.map((tour) => (
                <div
                  key={tour.id}
                  className="absolute w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 transition-transform duration-300"
                  style={{
                    left: `${(tour.coordinates!.lng + 180) * (100 / 360)}%`,
                    top: `${(90 - tour.coordinates!.lat) * (100 / 180)}%`,
                  }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-background-darker text-foreground text-xs rounded py-1 px-2 pointer-events-none">
                      {tour.city}, {tour.country}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tour Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                All Locations
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                All Dates
              </Button>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 bg-background-lighter border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Featured Events */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Featured Events</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tourDates.slice(0, 3).map((tour) => (
                <div
                  key={tour.id}
                  className="bg-background-lighter rounded-lg overflow-hidden border border-accent group hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={tour.image || "/placeholder.svg?height=500&width=800"}
                      alt={tour.venue}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-darker to-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <div className="flex items-center text-sm text-foreground mb-1">
                        <CalendarDays className="h-4 w-4 mr-1 text-primary" />
                        {tour.date}
                      </div>
                      <h4 className="text-lg font-semibold text-foreground">{tour.venue}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {tour.city}, {tour.country}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tour.description}</p>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs text-muted-foreground">Starting at</span>
                        <div className="text-primary font-bold">${tour.price?.general}</div>
                      </div>

                      <Button asChild>
                        <Link href={tour.ticketLink}>
                          <Ticket className="h-4 w-4 mr-2" />
                          Get Tickets
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Tour Dates */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">All Tour Dates</h3>

            <div className="space-y-8">
              {Object.entries(groupedTourDates).map(([monthYear, dates]) => (
                <div key={monthYear} className="bg-background-lighter rounded-lg border border-accent overflow-hidden">
                  <div className="bg-accent px-6 py-3">
                    <h4 className="text-lg font-semibold text-foreground">{monthYear}</h4>
                  </div>

                  <div className="divide-y divide-accent">
                    {dates.map((tour) => (
                      <div
                        key={tour.id}
                        className="p-4 md:p-6 hover:bg-accent/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                            <div className="text-foreground font-medium w-32">{tour.date.split(",")[0]}</div>

                            <div className="flex-1">
                              <h5 className="font-semibold text-foreground">{tour.venue}</h5>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1" />
                                {tour.city}, {tour.country}
                              </div>
                            </div>

                            <div className="hidden md:block text-right">
                              <div className="text-primary font-bold">${tour.price?.general}</div>
                              {tour.price?.vip && (
                                <div className="text-xs text-muted-foreground">VIP: ${tour.price.vip}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4">
                          <div className="md:hidden">
                            <div className="text-primary font-bold">${tour.price?.general}</div>
                            {tour.price?.vip && (
                              <div className="text-xs text-muted-foreground">VIP: ${tour.price.vip}</div>
                            )}
                          </div>

                          <Button asChild>
                            <Link href={tour.ticketLink}>
                              <Ticket className="h-4 w-4 mr-2" />
                              Tickets
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VIP Experience */}
      <section className="py-16 bg-background-lighter">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-accent rounded-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 relative">
                <Image
                  src="/placeholder.svg?height=800&width=1200"
                  alt="VIP Experience"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:w-1/2 p-6 md:p-8 lg:p-12">
                <h3 className="text-3xl font-bold text-foreground mb-4">VIP Experience</h3>
                <p className="text-muted-foreground mb-6">
                  Upgrade your concert experience with our exclusive VIP packages. Get early entry, premium seating,
                  meet & greet opportunities, exclusive merchandise, and more.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span className="text-foreground">Early venue access and premium viewing areas</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span className="text-foreground">Exclusive pre-show meet & greet with BangoBongo</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span className="text-foreground">Limited edition tour merchandise package</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span className="text-foreground">Dedicated VIP host and expedited entry</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span className="text-foreground">Commemorative VIP laminate and lanyard</span>
                  </li>
                </ul>

                <Button size="lg" className="bg-primary text-background hover:bg-secondary">
                  Learn More About VIP Packages
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tour FAQ */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-background-lighter rounded-lg border border-accent p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">What time do doors open?</h3>
              <p className="text-muted-foreground">
                Doors typically open 1 hour before the show starts. VIP ticket holders get early access 30 minutes
                before general admission.
              </p>
            </div>

            <div className="bg-background-lighter rounded-lg border border-accent p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Are there age restrictions for shows?</h3>
              <p className="text-muted-foreground">
                Most shows are 18+ with valid ID required. Some venues may be 21+. Please check the specific event
                details for age requirements.
              </p>
            </div>

            <div className="bg-background-lighter rounded-lg border border-accent p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">What's the refund policy?</h3>
              <p className="text-muted-foreground">
                Tickets are generally non-refundable. In case of event cancellation, tickets will be refunded
                automatically. For rescheduled events, tickets will be valid for the new date.
              </p>
            </div>

            <div className="bg-background-lighter rounded-lg border border-accent p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Can I transfer my tickets to someone else?</h3>
              <p className="text-muted-foreground">
                Yes, tickets can be transferred to another person through our official ticketing platform. Please note
                that reselling tickets at a price higher than face value is prohibited.
              </p>
            </div>

            <div className="bg-background-lighter rounded-lg border border-accent p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">What should I bring to the show?</h3>
              <p className="text-muted-foreground">
                Bring your ticket (digital or printed), valid ID, and any essential personal items. Check venue policies
                for prohibited items before attending.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline">View All FAQs</Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Get Tour Updates</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for exclusive tour announcements, pre-sale access, and special VIP offers.
            </p>

            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
