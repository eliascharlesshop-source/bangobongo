"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Play,
  Calendar,
  Clock,
  ExternalLink,
  Music,
  Filter,
  Search,
  Disc3,
  Heart,
  AlertCircle,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMusic } from "@/hooks/use-api"
import { useNotifications } from "@/contexts/notification-context"
import type { Album, Single } from "@/types"

interface MusicFilters {
  type: string
  year: string
  sortBy: string
  searchTerm: string
}

const musicTypes = ["All", "Singles", "EPs", "Albums"]
const years = ["All Years", "2023", "2022", "2021", "2020"]
const sortOptions = [
  { id: "newest", name: "Newest First" },
  { id: "oldest", name: "Oldest First" },
  { id: "name", name: "Name A-Z" },
  { id: "duration", name: "Duration" },
]

// Chrome Hearts — First Album
const chromeHeartsAlbum: Album = {
  id: "chrome-hearts",
  title: "Chrome Hearts",
  year: 2024,
  type: "album",
  cover: "/placeholder.svg?height=400&width=400",
  artist: "BangoBongo",
  tracks: 19,
  trackList: [
    // Side A — Chrome Hearts
    {
      id: "ch-01",
      title: "What I'm Afraid Of (Intro)",
      duration: 185,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-02",
      title: "Angel Baby",
      duration: 234,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-03",
      title: "Either Way",
      duration: 198,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-04",
      title: "Emotional",
      duration: 215,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-05",
      title: "Guts",
      duration: 201,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-06",
      title: "Heartless",
      duration: 187,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-07",
      title: "In Time",
      duration: 223,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-08",
      title: "Jealous",
      duration: 209,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-09",
      title: "Never Buy",
      duration: 195,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    // Side B — Night Runs
    {
      id: "ch-10",
      title: "Nightshift",
      duration: 212,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-11",
      title: "Paradise Lost",
      duration: 201,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-12",
      title: "Pretty But Tough",
      duration: 189,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-13",
      title: "Save Me",
      duration: 218,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-14",
      title: "She",
      duration: 176,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-15",
      title: "Summer Reign",
      duration: 224,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-16",
      title: "Recovering Lungs",
      duration: 241,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-17",
      title: "Timing",
      duration: 207,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-18",
      title: "Trap Soul II",
      duration: 213,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
    {
      id: "ch-19",
      title: "Whatever You Don't Do (Outro)",
      duration: 197,
      albumArt: "/placeholder.svg?height=400&width=400",
      artist: "BangoBongo",
    },
  ],
}

// Sample data
const singles: Single[] = []
const eps: Album[] = []
const albums: Album[] = [chromeHeartsAlbum]

// Helper function to format time
const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export default function MusicPage() {
  const [filters, setFilters] = useState<MusicFilters>({
    type: "All",
    year: "All Years",
    sortBy: "newest",
    searchTerm: "",
  })

  // Use the API hook with fallback to sample data
  const { data: apiMusic, loading, error, refetch } = useMusic()
  const { showNotification } = useNotifications()

  // Combine sample data for fallback
  const allMusic = useMemo(() => {
    if (apiMusic?.music) {
      return apiMusic.music
    }

    // Transform our sample data to unified format
    const transformedSingles = singles.map(single => ({
      ...single,
      type: 'single' as const,
      year: single.releaseYear,
    }))

    const transformedEPs = eps.map(ep => ({
      ...ep,
      type: 'ep' as const,
    }))

    const transformedAlbums = albums.map(album => ({
      ...album,
      type: 'album' as const,
    }))

    return [...transformedSingles, ...transformedEPs, ...transformedAlbums]
  }, [apiMusic])

  const filteredAndSortedMusic = useMemo(() => {
    let filtered = allMusic.filter((item: any) => {
      // Type filter
      if (filters.type !== "All") {
        const typeMap = {
          "Singles": "single",
          "EPs": "ep",
          "Albums": "album"
        }
        if (item.type !== typeMap[filters.type as keyof typeof typeMap]) {
          return false
        }
      }

      // Year filter
      if (filters.year !== "All Years" && item.year.toString() !== filters.year) {
        return false
      }

      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const searchFields = [
          item.title,
          item.type,
          item.year.toString()
        ].map(field => field.toLowerCase())

        if (!searchFields.some(field => field.includes(searchLower))) {
          return false
        }
      }

      return true
    })

    // Sort filtered results
    return filtered.sort((a: any, b: any) => {
      switch (filters.sortBy) {
        case "newest":
          return b.year - a.year
        case "oldest":
          return a.year - b.year
        case "name":
          return a.title.localeCompare(b.title)
        case "duration":
          const aDuration = 'duration' in a ? a.duration : ('tracks' in a ? a.tracks * 180 : 180)
          const bDuration = 'duration' in b ? b.duration : ('tracks' in b ? b.tracks * 180 : 180)
          return bDuration - aDuration
        default:
          return 0
      }
    })
  }, [allMusic, filters])

  const updateFilter = (key: keyof MusicFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Music</h2>
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
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-primary">Music</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore the complete discography of BangoBongo, including the latest singles, EPs, and albums.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search music..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter("searchTerm", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {musicTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.year} onValueChange={(value) => updateFilter("year", value)}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
            <SelectTrigger className="w-[150px]">
              <Music className="h-4 w-4 mr-2" />
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
          Showing {filteredAndSortedMusic.length} of {allMusic.length} items
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

      {/* Music Grid */}
      {!loading && (
        <div className="space-y-12">
          {/* Singles */}
          {filteredAndSortedMusic.some((item: any) => item.type === 'single') && (
            <section>
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <Disc3 className="h-7 w-7 mr-2 text-primary" />
                Singles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredAndSortedMusic
                  .filter((item: any) => item.type === 'single')
                  .map((single: any) => (
                    <MusicCard key={single.id} item={single} />
                  ))}
              </div>
            </section>
          )}

          {/* EPs */}
          {filteredAndSortedMusic.some((item: any) => item.type === 'ep') && (
            <section>
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <Music className="h-7 w-7 mr-2 text-primary" />
                EPs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedMusic
                  .filter((item: any) => item.type === 'ep')
                  .map((ep: any) => (
                    <EPCard key={ep.id} item={ep} />
                  ))}
              </div>
            </section>
          )}

          {/* Albums */}
          {filteredAndSortedMusic.some((item: any) => item.type === 'album') && (
            <section>
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <Music className="h-7 w-7 mr-2 text-primary" />
                Albums
              </h2>
              <div className="space-y-8">
                {filteredAndSortedMusic
                  .filter((item: any) => item.type === 'album')
                  .map((album: any) => (
                    <AlbumCard key={album.id} item={album} />
                  ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredAndSortedMusic.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No music found matching your criteria.</div>
          <Button
            variant="outline"
            onClick={() => setFilters({ type: "All", year: "All Years", sortBy: "newest", searchTerm: "" })}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

// Music Card Component
const MusicCard = ({ item }: { item: any }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={item.albumArt || item.cover || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button className="bg-primary text-primary-foreground hover:bg-secondary rounded-full h-12 w-12 flex items-center justify-center">
            <Play className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="text-xs">
            {item.type.toUpperCase()}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {item.title}
        </h3>
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{item.year}</span>
          </div>
          {item.duration && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatTime(item.duration)}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" className="flex-1">
            <Play className="h-3 w-3 mr-1" />
            Play
          </Button>
          <Button size="sm" variant="outline">
            <Heart className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// EP Card Component  
const EPCard = ({ item }: { item: any }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={item.cover || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
          <div className="pb-8">
            <Button className="bg-primary text-primary-foreground hover:bg-secondary rounded-full h-14 w-14 flex items-center justify-center">
              <Play className="h-7 w-7" />
            </Button>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="text-xs">
            EP
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
          {item.title}
        </h3>
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>{item.year}</span>
          <span>{item.tracks} tracks</span>
        </div>

        {item.trackList && (
          <div className="mt-4 space-y-1 border-t border-border pt-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Tracklist:</h4>
            {item.trackList.slice(0, 3).map((track: any, index: number) => (
              <div
                key={track.id}
                className="flex justify-between items-center text-sm hover:bg-accent/30 p-1 rounded cursor-pointer group/track"
              >
                <div className="flex items-center">
                  <span className="w-5 text-muted-foreground">{index + 1}</span>
                  <span className="group-hover/track:text-primary transition-colors line-clamp-1">{track.title}</span>
                </div>
                <span className="text-muted-foreground">{formatTime(track.duration)}</span>
              </div>
            ))}
            {item.trackList.length > 3 && (
              <div className="text-xs text-muted-foreground pt-1">
                +{item.trackList.length - 3} more tracks
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button size="sm" className="flex-1">
            <Play className="h-3 w-3 mr-1" />
            Play EP
          </Button>
          <Button size="sm" variant="outline">
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Album Card Component
const AlbumCard = ({ item }: { item: any }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative aspect-square md:aspect-auto overflow-hidden">
          <Image
            src={item.cover || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button className="bg-primary text-primary-foreground hover:bg-secondary rounded-full h-16 w-16 flex items-center justify-center">
              <Play className="h-8 w-8" />
            </Button>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="text-xs">
              ALBUM
            </Badge>
          </div>
        </div>

        <div className="p-6 md:w-2/3 flex flex-col">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>
              <span className="text-sm text-muted-foreground">{item.year}</span>
            </div>
            <p className="text-muted-foreground mt-2">{item.tracks} tracks • Full Album</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {item.trackList && item.trackList.length > 0 ? (
                item.trackList.slice(0, 6).map((track: any, index: number) => (
                  <div
                    key={track.id}
                    className="flex justify-between items-center text-sm hover:bg-accent/30 p-1 rounded cursor-pointer group/track"
                  >
                    <div className="flex items-center">
                      <span className="w-5 text-muted-foreground">{index + 1}</span>
                      <span className="group-hover/track:text-primary transition-colors line-clamp-1">{track.title}</span>
                    </div>
                    <span className="text-muted-foreground">{formatTime(track.duration)}</span>
                  </div>
                ))
              ) : (
                Array.from({ length: Math.min(6, item.tracks) }).map((_, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm hover:bg-accent/30 p-1 rounded cursor-pointer group/track"
                  >
                    <div className="flex items-center">
                      <span className="w-5 text-muted-foreground">{index + 1}</span>
                      <span className="group-hover/track:text-primary transition-colors">
                        {index === 0
                          ? "Intro"
                          : index === 1
                            ? item.title.split(" ")[0] + " Rhythm"
                            : index === 2
                              ? "Electric " + (item.title.split(" ")[1] || "Beat")
                              : index === 3
                                ? "Digital Dreams"
                                : index === 4
                                  ? "Midnight Echo"
                                  : "Outro"}
                      </span>
                    </div>
                    <span className="text-muted-foreground">{formatTime(180 + index * 15)}</span>
                  </div>
                ))
              )}
            </div>

            {item.trackList && item.trackList.length > 6 && (
              <div className="mt-2 text-right">
                <Button variant="link" size="sm" className="text-primary hover:text-secondary">
                  View all {item.trackList.length} tracks
                </Button>
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 flex flex-wrap gap-2">
            <Button className="bg-primary text-primary-foreground hover:bg-secondary">
              <Play className="h-4 w-4 mr-2" />
              Play Album
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline">
              Album Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
