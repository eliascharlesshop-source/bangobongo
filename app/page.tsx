import Link from "next/link"
import dynamic from "next/dynamic"
import { CalendarDays, Music, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Album, TourDate, GearItem, MerchItem } from "@/types"

// Sample data - removed
const albums: Album[] = []
const tourDates: TourDate[] = []
const favoriteGear: GearItem[] = []
const merchItems: MerchItem[] = []

// Lazy load sections below the fold
const MusicSection = dynamic(() => import("@/components/sections/music-section"), {
  loading: () => <div className="py-24"><div className="h-64 bg-card rounded-xl mx-auto max-w-4xl animate-pulse" /></div>,
})
const TourSection = dynamic(() => import("@/components/sections/tour-section"), {
  loading: () => <div className="py-24"><div className="h-64 bg-card rounded-xl mx-auto max-w-4xl animate-pulse" /></div>,
})
const GearSection = dynamic(() => import("@/components/sections/gear-section"), {
  loading: () => <div className="py-24"><div className="h-64 bg-card rounded-xl mx-auto max-w-4xl animate-pulse" /></div>,
})
const MerchSection = dynamic(() => import("@/components/sections/merch-section"), {
  loading: () => <div className="py-24"><div className="h-64 bg-card rounded-xl mx-auto max-w-4xl animate-pulse" /></div>,
})

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex items-center min-h-[88vh] overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="animate-fade-up text-sm uppercase tracking-[0.25em] text-muted-foreground mb-6">
              Electronic Music Artist
            </p>
            <h1 className="animate-fade-up text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-balance leading-[0.95] mb-8">
              BangoBongo
            </h1>
            <p
              className="animate-fade-up text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-10 text-pretty"
              style={{ animationDelay: "80ms" }}
            >
              A fusion of electronic beats and innovative sound design — built for the floor and the headphones alike.
            </p>
            <div className="animate-fade-up flex flex-wrap gap-3" style={{ animationDelay: "160ms" }}>
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

      {/* Newsletter */}
      <section className="py-28 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-balance">Stay connected</h2>
            <p className="text-muted-foreground mb-10 leading-relaxed text-pretty">
              Exclusive updates, early access to new releases, and the occasional secret.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex h-12 w-full rounded-full border border-border bg-card px-5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-300"
              />
              <Button type="submit" variant="chrome" size="lg" className="shrink-0">
                Subscribe
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
