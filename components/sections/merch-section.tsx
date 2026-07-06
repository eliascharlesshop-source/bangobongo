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
    <section id="merch" className="py-24 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Store</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Merchandise</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
            Official BangoBongo merch. Pay with USD or cryptocurrency.
          </p>
        </div>

        {merchItems.length === 0 ? (
          <div className="max-w-3xl mx-auto rounded-xl border border-dashed border-border py-20 text-center">
            <p className="text-muted-foreground">New drops landing soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchItems.map((item) => (
              <div key={item.id} className="group surface overflow-hidden hover-lift">
                <div className="relative aspect-square bg-secondary">
                  <Image
                    src={item.image || "/placeholder.svg?height=300&width=300"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground">{item.name}</h3>
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <div className="text-foreground font-medium">${item.price.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">ETH {item.cryptoPrice}</div>
                    </div>
                    <Button size="icon" variant="secondary" aria-label={`Add ${item.name} to cart`}>
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild variant="chrome">
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
