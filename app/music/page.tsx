import type { Metadata } from "next"
import Image from "next/image"
import { Play, Calendar, Clock, ExternalLink, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Album, Single } from "@/types"

export const metadata: Metadata = {
  title: "Music | BangoBongo",
  description: "Explore the latest singles, EPs, and albums by BangoBongo",
}

// Sample data
const singles: Single[] = [
  {
    id: "single1",
    title: "Neon Pulse",
    duration: 215, // 3:35
    albumArt: "/placeholder.svg?height=300&width=300",
    releaseYear: 2023,
    releaseDate: "Oct 15, 2023",
  },
  {
    id: "single2",
    title: "Digital Dreams",
    duration: 187, // 3:07
    albumArt: "/placeholder.svg?height=300&width=300",
    releaseYear: 2023,
    releaseDate: "Aug 22, 2023",
  },
  {
    id: "single3",
    title: "Midnight Echo",
    duration: 243, // 4:03
    albumArt: "/placeholder.svg?height=300&width=300",
    releaseYear: 2023,
    releaseDate: "Jun 10, 2023",
  },
  {
    id: "single4",
    title: "Cyber Horizons",
    duration: 198, // 3:18
    albumArt: "/placeholder.svg?height=300&width=300",
    releaseYear: 2023,
    releaseDate: "Apr 5, 2023",
  },
  {
    id: "single5",
    title: "Synth Wave",
    duration: 227, // 3:47
    albumArt: "/placeholder.svg?height=300&width=300",
    releaseYear: 2022,
    releaseDate: "Dec 12, 2022",
  },
]

const eps: Album[] = [
  {
    id: "ep1",
    title: "Neon Nights EP",
    year: 2023,
    tracks: 4,
    cover: "/placeholder.svg?height=400&width=400",
    type: "ep",
    trackList: [
      {
        id: "ep1_track1",
        title: "Neon Intro",
        duration: 120,
        albumArt: "/placeholder.svg?height=400&width=400",
      },
      {
        id: "ep1_track2",
        title: "City Lights",
        duration: 205,
        albumArt: "/placeholder.svg?height=400&width=400",
      },
      {
        id: "ep1_track3",
        title: "Midnight Drive",
        duration: 230,
        albumArt: "/placeholder.svg?height=400&width=400",
      },
      {
        id: "ep1_track4",
        title: "Neon Dreams",
        duration: 245,
        albumArt: "/placeholder.svg?height=400&width=400",
      },
    ],
  },
  {
    id: "ep2",
    title: "Digital Dreamscape EP",
    year: 2022,
    tracks: 5,
    cover: "/placeholder.svg?height=400&width=400",
    type: "ep",
    trackList: [
      {
        id: "ep2_track1",
        title: "Digital Dawn",
        duration: 185,
        albumArt: "/placeholder.svg?height=400&width=400",
      },
      {
        id: "ep2_track2",
        title: "Virtual Reality",
        duration: 210,
        albumArt: "/placeholder.svg?height=400&width=400",
      },
      {
        id: "ep2_track3",
        title: "Pixel Pulse",
        duration: 195,
        albumArt: "/placeholder.svg?height=400&width=400",
      },
      {
        id: "ep2_track4",
        title: "Binary Beats",
        duration: 225,
        albumArt: "/placeholder.svg?height=400&width=400",
      },
      {
        id: "ep2_track5",
        title: "Digital Dusk",
        duration: 240,
        albumArt: "/placeholder.svg?height=400&width=400",
      },
    ],
  },
  {
    id: "ep3",
    title: "Cosmic Frequencies EP",
    year: 2022,
    tracks: 3,
    cover: "/placeholder.svg?height=400&width=400",
    type: "ep",
  },
]

const albums: Album[] = [
  {
    id: "album1",
    title: "Hyperspace Journey",
    year: 2023,
    tracks: 12,
    cover: "/placeholder.svg?height=500&width=500",
    type: "album",
  },
  {
    id: "album2",
    title: "Electric Pulse",
    year: 2022,
    tracks: 10,
    cover: "/placeholder.svg?height=500&width=500",
    type: "album",
  },
  {
    id: "album3",
    title: "Synth Chronicles",
    year: 2021,
    tracks: 14,
    cover: "/placeholder.svg?height=500&width=500",
    type: "album",
  },
  {
    id: "album4",
    title: "Cosmic Beats",
    year: 2020,
    tracks: 11,
    cover: "/placeholder.svg?height=500&width=500",
    type: "album",
  },
]

// Helper function to format time
const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export default function MusicPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-primary">Music</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore the complete discography of BangoBongo, including the latest singles, EPs, and albums.
          </p>
        </div>

        {/* Singles Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
            <Music className="h-7 w-7 mr-2 text-primary" />
            Singles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {singles.map((single) => (
              <div
                key={single.id}
                className="bg-background-lighter rounded-lg overflow-hidden border border-accent group hover:border-primary transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={single.albumArt || "/placeholder.svg"}
                    alt={single.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button className="bg-primary text-background hover:bg-secondary rounded-full h-12 w-12 flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {single.title}
                  </h3>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{single.releaseYear}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTime(single.duration)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EPs Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
            <Music className="h-7 w-7 mr-2 text-primary" />
            EPs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {eps.map((ep) => (
              <div
                key={ep.id}
                className="bg-background-lighter rounded-lg overflow-hidden border border-accent group hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={ep.cover || "/placeholder.svg"}
                    alt={ep.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                    <div className="pb-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Button className="bg-primary text-background hover:bg-secondary rounded-full h-14 w-14 flex items-center justify-center">
                        <Play className="h-7 w-7" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                    {ep.title}
                  </h3>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{ep.year}</span>
                    <span>{ep.tracks} tracks</span>
                  </div>

                  {ep.trackList && (
                    <div className="mt-4 space-y-2 border-t border-accent pt-4">
                      <h4 className="text-sm font-medium text-foreground mb-2">Tracklist:</h4>
                      {ep.trackList.map((track, index) => (
                        <div
                          key={track.id}
                          className="flex justify-between items-center text-sm hover:bg-accent/30 p-1 rounded cursor-pointer group/track"
                        >
                          <div className="flex items-center">
                            <span className="w-5 text-muted-foreground">{index + 1}</span>
                            <span className="group-hover/track:text-primary transition-colors">{track.title}</span>
                          </div>
                          <span className="text-muted-foreground">{formatTime(track.duration)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Albums Section */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
            <Music className="h-7 w-7 mr-2 text-primary" />
            Albums
          </h2>

          <div className="space-y-8">
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-background-lighter rounded-lg overflow-hidden border border-accent group hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative aspect-square md:aspect-auto overflow-hidden">
                    <Image
                      src={album.cover || "/placeholder.svg"}
                      alt={album.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button className="bg-primary text-background hover:bg-secondary rounded-full h-16 w-16 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play className="h-8 w-8" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 md:w-2/3 flex flex-col">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors duration-300">
                          {album.title}
                        </h3>
                        <span className="text-sm text-muted-foreground">{album.year}</span>
                      </div>
                      <p className="text-muted-foreground mt-2">{album.tracks} tracks • 47:24 • Full Album</p>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        {Array.from({ length: Math.min(6, album.tracks) }).map((_, index) => (
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
                                    ? album.title.split(" ")[0] + " Rhythm"
                                    : index === 2
                                      ? "Electric " + album.title.split(" ")[1]
                                      : index === 3
                                        ? "Digital Dreams"
                                        : index === 4
                                          ? "Midnight Echo"
                                          : "Outro"}
                              </span>
                            </div>
                            <span className="text-muted-foreground">{formatTime(180 + index * 15)}</span>
                          </div>
                        ))}
                      </div>

                      {album.tracks > 6 && (
                        <div className="mt-2 text-right">
                          <Button variant="link" size="sm" className="text-primary hover:text-secondary">
                            View all {album.tracks} tracks
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto pt-4 flex flex-wrap gap-2">
                      <Button className="bg-primary text-background hover:bg-secondary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform group-hover:scale-105">
                        <Play className="h-4 w-4 mr-2" />
                        Play Album
                      </Button>
                      <Button
                        variant="outline"
                        className="hover:border-primary hover:text-primary transition-all duration-300"
                      >
                        Album Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
