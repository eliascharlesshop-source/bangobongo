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
                  loading="lazy"
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
  )
}
