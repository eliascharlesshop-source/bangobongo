import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import type { Album } from "@/types"

interface MusicSectionProps {
  albums: Album[]
}

export default function MusicSection({ albums }: MusicSectionProps) {
  return (
    <section id="music" className="py-24 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Discography</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Albums &amp; EPs</h2>
          </div>
          <Link
            href="/music"
            className="link-underline text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>

        {albums.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-20 text-center">
            <p className="text-muted-foreground">New releases coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div key={album.id} className="group hover-lift">
                <div className="relative aspect-square rounded-xl overflow-hidden border border-border bg-card">
                  <Image
                    src={album.cover || "/placeholder.svg?height=400&width=400"}
                    alt={album.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Play className="h-5 w-5" />
                    </span>
                  </div>
                </div>
                <div className="pt-4">
                  <h3 className="font-medium text-foreground">{album.title}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{album.year}</span>
                    <span>{album.tracks} tracks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
