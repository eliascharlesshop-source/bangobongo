import Image from "next/image"
import Link from "next/link"
import { CalendarDays, MapPin, Music, Package, ShoppingBag, ExternalLink, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Track, Album, TourDate, GearItem, MerchItem } from "@/types"

// Import the TrackListExample component at the top of the file
import TrackListExample from "@/components/track-list-example"

// Sample data
const featuredTracks: Track[] = [
  {
    id: "track1",
    title: "Neon Pulse",
    duration: 215, // 3:35
    albumArt: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "track2",
    title: "Digital Dreams",
    duration: 187, // 3:07
    albumArt: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "track3",
    title: "Midnight Echo",
    duration: 243, // 4:03
    albumArt: "/placeholder.svg?height=300&width=300",
  },
]

const albums: Album[] = [
  {
    id: "album1",
    title: "Neon Nights",
    year: 2023,
    tracks: 8,
    cover: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "album2",
    title: "Digital Dreamscape",
    year: 2022,
    tracks: 6,
    cover: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "album3",
    title: "Cosmic Beats",
    year: 2021,
    tracks: 10,
    cover: "/placeholder.svg?height=400&width=400",
  },
]

const tourDates: TourDate[] = [
  {
    id: "tour1",
    date: "Mar 15, 2024",
    venue: "Pulse Nightclub",
    city: "Miami, FL",
    country: "USA",
    ticketLink: "#",
  },
  {
    id: "tour2",
    date: "Apr 2, 2024",
    venue: "Echo Arena",
    city: "Los Angeles, CA",
    country: "USA",
    ticketLink: "#",
  },
  {
    id: "tour3",
    date: "Apr 18, 2024",
    venue: "Neon Gardens",
    city: "New York, NY",
    country: "USA",
    ticketLink: "#",
  },
  {
    id: "tour4",
    date: "May 5, 2024",
    venue: "Digital Dreams Festival",
    city: "Chicago, IL",
    country: "USA",
    ticketLink: "#",
  },
]

const favoriteGear: GearItem[] = [
  {
    id: "gear1",
    name: "Pioneer DJ CDJ-3000",
    category: "Hardware",
    image: "/placeholder.svg?height=200&width=200",
    link: "#",
  },
  {
    id: "gear2",
    name: "Ableton Live 11",
    category: "Software",
    image: "/placeholder.svg?height=200&width=200",
    link: "#",
  },
  {
    id: "gear3",
    name: "Native Instruments Traktor Pro",
    category: "Software",
    image: "/placeholder.svg?height=200&width=200",
    link: "#",
  },
  {
    id: "gear4",
    name: "Sennheiser HD-25",
    category: "Headphones",
    image: "/placeholder.svg?height=200&width=200",
    link: "#",
  },
]

const merchItems: MerchItem[] = [
  {
    id: "merch1",
    name: "BangoBongo T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    cryptoPrice: 0.015,
  },
  {
    id: "merch2",
    name: "Neon Nights Hoodie",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    cryptoPrice: 0.03,
  },
  {
    id: "merch3",
    name: "Digital Dreams Vinyl",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    cryptoPrice: 0.012,
  },
  {
    id: "merch4",
    name: "BangoBongo Snapback",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    cryptoPrice: 0.01,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
                <Button className="bg-primary text-background hover:bg-secondary">
                  <Music className="h-4 w-4 mr-2" />
                  Listen Now
                </Button>
              </Link>
              <Link href="/tour">
                <Button variant="outline">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Tour Dates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Music Section */}
      <section id="music" className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <h2 className="text-3xl font-bold text-foreground mb-6">Latest Tracks</h2>
              <TrackListExample />
            </div>

            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-foreground">Albums & EPs</h2>
                <Link href="/music" className="text-primary hover:text-secondary transition-colors">
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="bg-background-lighter rounded-lg overflow-hidden border border-accent album-hover transform transition-all duration-300 hover:scale-103 hover:shadow-lg hover:shadow-primary/15"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={album.cover || "/placeholder.svg?height=400&width=400"}
                        alt={album.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button className="bg-primary text-background hover:bg-secondary rounded-full h-12 w-12 flex items-center justify-center transform translate-y-4 hover:translate-y-0 transition-transform duration-300">
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground">{album.title}</h3>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{album.year}</span>
                        <span>{album.tracks} tracks</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Section */}
      <section id="tour" className="py-16 bg-background-lighter">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Shows</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Catch BangoBongo live in action at these upcoming events. Experience the energy and immerse yourself in
              the music.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {tourDates.map((tour) => (
              <div
                key={tour.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 mb-4 bg-background rounded-lg border border-accent hover:border-primary transition-colors"
              >
                <div className="flex items-start sm:items-center mb-4 sm:mb-0">
                  <div className="bg-accent p-3 rounded-lg text-center mr-6 hidden sm:block">
                    <span className="block text-lg font-bold text-primary">{tour.date.split(",")[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{tour.venue}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {tour.city}
                    </div>
                    <div className="sm:hidden text-xs text-muted-foreground mt-1">{tour.date}</div>
                  </div>
                </div>
                <Button asChild>
                  <Link href={tour.ticketLink}>Get Tickets</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/tour">
                <CalendarDays className="h-4 w-4 mr-2" />
                View All Tour Dates
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gear Section */}
      <section id="gear" className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Favorite Gear</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check out the tools and equipment that help create the BangoBongo sound.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteGear.map((gear) => (
              <Link
                key={gear.id}
                href={gear.link}
                className="bg-background-lighter rounded-lg overflow-hidden border border-accent hover:border-primary transition-colors"
              >
                <div className="relative aspect-square">
                  <Image
                    src={gear.image || "/placeholder.svg?height=200&width=200"}
                    alt={gear.name}
                    fill
                    className="object-cover p-4"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs text-primary px-2 py-1 rounded-full bg-primary/10 mb-2 inline-block">
                    {gear.category}
                  </span>
                  <h3 className="font-semibold text-foreground">{gear.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Learn More
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/gear">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Complete Setup
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Merch Section */}
      <section id="merch" className="py-16 bg-background-lighter">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Merchandise</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Show your support with official BangoBongo merchandise. Available for purchase with USD or cryptocurrency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchItems.map((item) => (
              <div key={item.id} className="bg-background rounded-lg overflow-hidden border border-accent merch-item">
                <div className="relative aspect-square">
                  <Image
                    src={item.image || "/placeholder.svg?height=300&width=300"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <div className="text-primary font-bold">${item.price.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">ETH {item.cryptoPrice}</div>
                    </div>
                    <Button size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/merch">
                <Package className="h-4 w-4 mr-2" />
                Visit Store
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Stay Connected</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for exclusive updates, early access to new releases, and special offers.
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
