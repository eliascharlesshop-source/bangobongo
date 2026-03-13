import Image from "next/image"
import Link from "next/link"
import { Music, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Album } from "@/types"

interface MusicSectionProps {
  albums: Album[]
}

export default function MusicSection({ albums }: MusicSectionProps) {
  return (
    <section id="music" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full">
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
                      loading="lazy"
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
  )
}
