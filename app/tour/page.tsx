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
  Clock,
  Play,
  ExternalLink,
  Briefcase
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

// Cheers Tour — dates
const tourDatesSample: TourDate[] = [
  {
    id: "1",
    date: "March 15, 2024",
    venue: "Fabric London",
    city: "London",
    country: "UK",
    ticketLink: "#",
    status: "upcoming",
    price: { general: 45, vip: 85 },
    description: "Cheers Tour opens in London. An unforgettable night of electronic music at Fabric.",
    image: "/images/tour/cheers-tour-card.png",
    coordinates: { lat: 51.5195, lng: -0.0935 }
  },
  {
    id: "2",
    date: "April 22, 2024",
    venue: "Berghain",
    city: "Berlin",
    country: "Germany",
    ticketLink: "#",
    status: "upcoming",
    price: { general: 35, vip: 75 },
    description: "Cheers Tour hits Berlin at one of the world's most iconic venues.",
    image: "/images/tour/cheers-tour-card.png",
    coordinates: { lat: 52.5200, lng: 13.4050 }
  },
  {
    id: "3",
    date: "May 10, 2024",
    venue: "Awakenings Festival",
    city: "Amsterdam",
    country: "Netherlands",
    ticketLink: "#",
    status: "upcoming",
    price: { general: 55, vip: 95 },
    description: "Cheers Tour — festival appearance with a special extended DJ set.",
    image: "/images/tour/cheers-tour-card.png",
    coordinates: { lat: 52.3676, lng: 4.9041 }
  },
  {
    id: "4",
    date: "June 5, 2024",
    venue: "Printworks",
    city: "London",
    country: "UK",
    ticketLink: "#",
    status: "upcoming",
    price: { general: 50, vip: 90 },
    description: "Cheers Tour returns to London with a full live production setup.",
    image: "/images/tour/cheers-tour-card.png",
    coordinates: { lat: 51.5195, lng: -0.0935 }
  },
  {
    id: "5",
    date: "July 12, 2024",
    venue: "Tomorrowland",
    city: "Boom",
    country: "Belgium",
    ticketLink: "#",
    status: "upcoming",
    price: { general: 150, vip: 250 },
    description: "Cheers Tour — headlining slot at Tomorrowland Main Stage.",
    image: "/images/tour/cheers-tour-card.png",
    coordinates: { lat: 51.1534, lng: 4.6889 }
  },
  {
    id: "6",
    date: "August 3, 2024",
    venue: "Sónar Festival",
    city: "Barcelona",
    country: "Spain",
    ticketLink: "#",
    status: "upcoming",
    price: { general: 65, vip: 105 },
    description: "Cheers Tour closes the summer at one of Europe's biggest electronic music festivals.",
    image: "/images/tour/cheers-tour-card.png",
    coordinates: { lat: 41.3851, lng: 2.1734 }
  }
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

  const tourDates = toursData?.tours && toursData.tours.length > 0 ? toursData.tours : tourDatesSample

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
      <section className="relative h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/tour/cheers-tour-banner.png"
            alt="Cheers Tour"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase mb-3">BangoBongo</p>
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4 tracking-tight">
              <span className="chrome-text-mint">Cheers</span> Tour
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Six nights. Six cities. One unforgettable run — catch BangoBongo live in 2024.
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
              <Image src="/images/tour/cheers-tour-banner.png" alt="Cheers Tour Map" fill className="object-cover opacity-60" />
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

      {/* TikTok Live Sessions Section */}
      <section className="py-16 bg-background-lighter">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">TikTok DJ Sessions</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can't make it to a live event? Join us for exclusive DJ sessions and mixing tutorials on TikTok. Follow <span className="font-semibold text-primary">@bangobongo.ece</span> for behind-the-scenes content, real-time performances, and interactive music production sessions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* TikTok Live Session Cards */}
              {[
                {
                  id: 1,
                  title: "Summer Vibes Mix",
                  date: "Jun 15, 2024",
                  duration: "45 mins",
                  views: "12.5K",
                  thumbnail: "/images/tiktok/session-1.png"
                },
                {
                  id: 2,
                  title: "Mixing Masterclass",
                  date: "Jun 12, 2024",
                  duration: "58 mins",
                  views: "8.3K",
                  thumbnail: "/images/tiktok/session-2.png"
                },
                {
                  id: 3,
                  title: "Live Production Session",
                  date: "Jun 10, 2024",
                  duration: "62 mins",
                  views: "15.1K",
                  thumbnail: "/images/tiktok/session-3.png"
                },
                {
                  id: 4,
                  title: "Tech House Exploration",
                  date: "Jun 8, 2024",
                  duration: "52 mins",
                  views: "9.7K",
                  thumbnail: "/images/tiktok/session-4.png"
                },
                {
                  id: 5,
                  title: "Equipment Setup Guide",
                  date: "Jun 5, 2024",
                  duration: "35 mins",
                  views: "11.2K",
                  thumbnail: "/images/tiktok/session-5.png"
                },
                {
                  id: 6,
                  title: "Frequency Mastering Tips",
                  date: "Jun 1, 2024",
                  duration: "48 mins",
                  views: "13.8K",
                  thumbnail: "/images/tiktok/session-6.png"
                }
              ].map((session) => (
                <a
                  key={session.id}
                  href={`https://tiktok.com/@bangobongo.ece`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-background rounded-lg overflow-hidden border border-accent hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="relative h-40 bg-accent flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80">
                      <Play className="h-12 w-12 text-primary" />
                    </div>
                    <span className="absolute top-3 right-3 bg-background/90 px-2 py-1 rounded text-xs font-semibold text-foreground">
                      {session.duration}
                    </span>
                  </div>

                  <div className="p-4">
                    <h4 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {session.title}
                    </h4>
                    <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-4">
                      <span>{session.date}</span>
                      <span>👀 {session.views}</span>
                    </div>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Watch on TikTok
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" asChild>
                <a href="https://tiktok.com/@bangobongo.ece" target="_blank" rel="noopener noreferrer">
                  <Play className="h-4 w-4 mr-2" />
                  Follow @bangobongo.ece
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* DJ Hiring Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-accent overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <Briefcase className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-3">Hire a Remote DJ</h2>
                  <p className="text-lg text-muted-foreground">
                    Looking for professional DJ services for your event? BangoBongo and our network of talented remote DJs are available for online performances, live streaming sessions, and virtual events.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-8">
                <div className="bg-background rounded-lg p-6 border border-accent">
                  <h3 className="text-xl font-semibold text-foreground mb-3">What We Offer</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Professional DJ sets for online events</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Live streaming production support</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Custom music mixing for your event</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Technical setup and sound engineering</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Flexible scheduling and genres</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-background rounded-lg p-6 border border-accent">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Pricing</h3>
                  <div className="bg-accent/30 rounded-lg p-4 mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Standard DJ Services</div>
                    <div className="text-3xl font-bold text-primary mb-1">$100</div>
                    <div className="text-sm text-muted-foreground">per hour</div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Rate is for remote DJ services. Custom packages and longer-term bookings available at discounted rates.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-primary mr-2" />
                      <span className="text-foreground">Minimum 1 hour booking</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-primary mr-2" />
                      <span className="text-foreground">Package discounts available</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-primary mr-2" />
                      <span className="text-foreground">All equipment included</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-background hover:bg-secondary">
                  Book a DJ
                </Button>
                <Button size="lg" variant="outline">
                  Learn More About Rates
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Contact us with your event details for custom quotes and availability.
              </p>
            </div>
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
