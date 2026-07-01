import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { CalendarDays, MapPin, Music, Package, ShoppingBag, ExternalLink, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Track, Album, TourDate, GearItem, MerchItem } from "@/types"

// Sample data - removed
const featuredTracks: Track[] = []
const albums: Album[] = []
const tourDates: TourDate[] = []
const favoriteGear: GearItem[] = []
const merchItems: MerchItem[] = []

// Lazy load sections below the fold
const MusicSection = dynamic(() => import("@/components/sections/music-section"), {
  loading: () => <div className="py-16 bg-background animate-pulse"><div className="h-64 bg-background-lighter rounded-lg mx-auto max-w-4xl"></div></div>
})

const TourSection = dynamic(() => import("@/components/sections/tour-section"), {
  loading: () => <div className="py-16 bg-background-lighter animate-pulse"><div className="h-64 bg-background rounded-lg mx-auto max-w-4xl"></div></div>
})

const GearSection = dynamic(() => import("@/components/sections/gear-section"), {
  loading: () => <div className="py-16 bg-background animate-pulse"><div className="h-64 bg-background-lighter rounded-lg mx-auto max-w-4xl"></div></div>
})

const MerchSection = dynamic(() => import("@/components/sections/merch-section"), {
  loading: () => <div className="py-16 bg-background-lighter animate-pulse"><div className="h-64 bg-background rounded-lg mx-auto max-w-4xl"></div></div>
})

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Critical for initial paint */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background to-background-lighter">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              <span className="text-primary">BangoBongo</span> <br />
              Electronic Music Artist
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Experience the fusion of electronic beats and innovative sounds that define the future of music.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/music">
                <Button variant="chrome" size="lg">
                  <Music className="h-4 w-4 mr-2" />
                  Listen Now
                </Button>
              </Link>
              <Link href="/tour">
                <Button variant="chromeGlass" size="lg">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Tour Dates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lazy-loaded sections below the fold */}
      <MusicSection albums={albums} />
      <TourSection tourDates={tourDates} />
      <GearSection favoriteGear={favoriteGear} />
      <MerchSection merchItems={merchItems} />

      {/* Newsletter Section - Critical for conversion */}
      <section className="py-24 chrome-glass relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 chrome-text-mint">Stay Connected</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
              Subscribe to our newsletter for exclusive updates, early access to new releases, and special offers.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex h-12 w-full rounded-lg border border-primary/20 bg-background/80 backdrop-blur px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
              />
              <Button type="submit" variant="chrome" size="lg">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
