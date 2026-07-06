import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GearItem } from "@/types"

interface GearSectionProps {
  favoriteGear: GearItem[]
}

export default function GearSection({ favoriteGear }: GearSectionProps) {
  return (
    <section id="gear" className="py-24 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Setup</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Favorite Gear</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
            The tools and equipment behind the BangoBongo sound.
          </p>
        </div>

        {favoriteGear.length === 0 ? (
          <div className="max-w-3xl mx-auto rounded-xl border border-dashed border-border py-20 text-center">
            <p className="text-muted-foreground">Gear list coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteGear.map((gear) => (
              <Link
                key={gear.id}
                href={gear.link}
                className="group surface overflow-hidden hover-lift"
              >
                <div className="relative aspect-square bg-secondary">
                  <Image
                    src={gear.image || "/placeholder.svg?height=200&width=200"}
                    alt={gear.name}
                    fill
                    className="object-cover p-6 transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{gear.category}</span>
                  <h3 className="font-medium text-foreground mt-1">{gear.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-2 group-hover:text-foreground transition-colors">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Learn more
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild variant="chromeGlass">
            <Link href="/gear">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Complete Setup
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
