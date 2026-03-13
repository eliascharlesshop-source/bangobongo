import Image from "next/image"
import Link from "next/link"
import { Package, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MerchItem } from "@/types"

interface MerchSectionProps {
  merchItems: MerchItem[]
}

export default function MerchSection({ merchItems }: MerchSectionProps) {
  return (
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
                  loading="lazy"
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
  )
}
