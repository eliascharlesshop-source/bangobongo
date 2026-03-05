import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Play, Clock, ArrowLeft, Share, Heart, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Album, Track } from "@/types"

interface AlbumDetailPageProps {
  params: {
    id: string
  }
}

export function generateMetadata({ params }: AlbumDetailPageProps): Metadata {
  // This would typically fetch the album data based on the ID
  // For demonstration, we'll use hardcoded data
  return {
    title: "Hyperspace Journey | BangoBongo",
    description: "Listen to Hyperspace Journey by BangoBongo",
  }
}

// Sample track data for the album - removed demo data
const albumData: Album = {
  id: "",
  title: "",
  year: 2024,
  tracks: 0,
  cover: "/placeholder.svg?height=500&width=500",
  type: "album",
  trackList: [],
}

// Helper function to format time
const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

// Helper to calculate total duration
const calculateTotalDuration = (tracks: Track[]): string => {
  const totalSeconds = tracks.reduce((total, track) => total + track.duration, 0)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export default function AlbumDetailPage({ params }: AlbumDetailPageProps) {
  // In a real app, you would fetch the album data based on params.id
  // For this demo, we'll use the hard-coded data above

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/music"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Music
          </Link>
        </div>

        <div className="bg-background-lighter rounded-lg overflow-hidden border border-accent">
          {/* Album Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background-lighter via-transparent to-transparent z-10"></div>
            <div className="w-full h-40 md:h-60 bg-[url('/placeholder.svg?height=1000&width=1000')] bg-cover bg-center opacity-30"></div>

            <div className="relative z-20 -mt-20 md:-mt-32 flex flex-col md:flex-row items-center md:items-end p-6 md:p-8">
              <div className="w-40 h-40 md:w-52 md:h-52 rounded-lg overflow-hidden border-4 border-background-lighter shadow-xl">
                <Image
                  src={albumData.cover || "/placeholder.svg"}
                  alt={albumData.title}
                  width={208}
                  height={208}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                <div className="inline-flex items-center px-2 py-1 rounded bg-primary/20 text-primary text-xs mb-2">
                  {albumData.type.toUpperCase()}
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-foreground">{albumData.title}</h1>
                <p className="text-muted-foreground mt-1 md:mt-2">
                  BangoBongo • {albumData.year} • {albumData.trackList?.length || albumData.tracks} Tracks •{" "}
                  {calculateTotalDuration(albumData.trackList || [])}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  <Button className="bg-primary text-background hover:bg-secondary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                    <Play className="h-4 w-4 mr-2" />
                    Play All
                  </Button>
                  <Button
                    variant="outline"
                    className="hover:border-primary hover:text-primary transition-all duration-300"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Favorite
                  </Button>
                  <Button
                    variant="outline"
                    className="hover:border-primary hover:text-primary transition-all duration-300"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tracklist */}
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4">Tracklist</h2>

            <div className="overflow-hidden">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground border-b border-accent">
                    <tr>
                      <th scope="col" className="px-4 py-3 w-10">
                        #
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Title
                      </th>
                      <th scope="col" className="px-4 py-3 w-20 text-right">
                        <Clock className="h-4 w-4 inline" />
                      </th>
                      <th scope="col" className="px-4 py-3 w-24"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {albumData.trackList?.map((track, index) => (
                      <tr
                        key={track.id}
                        className="group hover:bg-accent/30 border-b border-accent/50 last:border-0 transition-colors"
                      >
                        <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                        <td className="px-4 py-3 font-medium group-hover:text-primary transition-colors">
                          {track.title}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-right">{formatTime(track.duration)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary hover:bg-primary/10"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary hover:bg-primary/10"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Album Info */}
          <div className="p-6 md:p-8 border-t border-accent">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">About the Album</h2>
                <p className="text-muted-foreground">
                  Hyperspace Journey is BangoBongo's groundbreaking album that takes listeners on a cosmic adventure
                  through pulsating beats and ethereal melodies. Each track represents a different stage of interstellar
                  travel, from the initial launch to the serene drift through distant galaxies.
                </p>
                <p className="text-muted-foreground mt-4">
                  Released in 2023, this album showcases BangoBongo's evolution as an artist and his mastery of
                  electronic music production, blending elements of techno, ambient, and futuristic soundscapes.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Album Credits</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <span className="text-foreground font-medium">Producer:</span> BangoBongo
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Mastering:</span> Studio Nebula
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Artwork:</span> Cosmic Designs
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Label:</span> Electronic Frontier Records
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Release Date:</span> June 15, 2023
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related Albums */}
          <div className="p-6 md:p-8 border-t border-accent">
            <h2 className="text-xl font-semibold mb-6">More by BangoBongo</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Link href={`/music/album${i + 2}`} key={i} className="group block">
                  <div className="relative aspect-square rounded-md overflow-hidden border border-accent group-hover:border-primary transition-all duration-300">
                    <Image
                      src={`/placeholder.svg?height=300&width=300`}
                      alt={`Album ${i + 2}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <Button className="bg-primary text-background hover:bg-secondary rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-300">
                        <Play className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="mt-2 font-medium text-sm group-hover:text-primary transition-colors">
                    {i === 0
                      ? "Electric Pulse"
                      : i === 1
                        ? "Synth Chronicles"
                        : i === 2
                          ? "Cosmic Beats"
                          : "Neon Nights EP"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {i === 0 ? "2022" : i === 1 ? "2021" : i === 2 ? "2020" : "2023"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
