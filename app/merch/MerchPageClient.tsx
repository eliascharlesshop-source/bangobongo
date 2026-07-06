"use client"

import { useState } from "react"
import { ShoppingCart, Tag, Truck, CheckCircle2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MerchItem, MerchCategory } from "@/types"
import { isWalletAvailable, getWalletAddress } from "@/lib/wallet-utils"

const merchItems: MerchItem[] = []

const categories: { id: MerchCategory; name: string }[] = [
  { id: "clothing", name: "Clothing" },
  { id: "accessories", name: "Accessories" },
  { id: "vinyl", name: "Vinyl Records" },
  { id: "digital", name: "Digital Downloads" },
  { id: "poster", name: "Posters & Art" },
  { id: "tour", name: "Tour Merchandise" },
  { id: "limited", name: "Limited Edition" },
  { id: "collection", name: "Collections & Bundles" },
]

export default function MerchPageClient() {
  const [walletConnected, setWalletConnected] = useState(false)

  const handleConnectWallet = async () => {
    if (isWalletAvailable()) {
      const address = await getWalletAddress()
      setWalletConnected(!!address)
    } else {
      alert("No Web3 wallet detected. Please install MetaMask or another Web3 wallet.")
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 sm:py-24 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Official Store</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance mb-4">
              Merchandise
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Support the music with exclusive clothing, vinyl records, collectibles, and more. Worldwide shipping available.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Shop Now
              </Button>
              <Button size="lg" variant="outline">
                Browse Categories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Categories</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="border border-border rounded-xl p-4 text-left hover:border-foreground/30 transition-colors duration-200 group"
              >
                <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">0 products</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products — empty state */}
      <section className="py-16 sm:py-20 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">All Products</p>

          {merchItems.length === 0 ? (
            <div className="border border-dashed border-border rounded-2xl py-20 sm:py-28 flex flex-col items-center justify-center text-center px-6">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-6">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No products yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Merch drops are coming soon. Subscribe below to be the first to know.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {merchItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-2xl overflow-hidden group hover:border-foreground/30 transition-all duration-300"
                >
                  <div className="relative h-56 sm:h-64 bg-card overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/60">
                      <Button size="sm">
                        <ShoppingCart className="h-3.5 w-3.5 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shipping info */}
      <section className="py-12 sm:py-16 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: "Worldwide Shipping", desc: "Orders processed within 1–2 business days." },
              { icon: CheckCircle2, title: "Quality Guarantee", desc: "Premium materials, quality-checked before shipping." },
              { icon: Tag, title: "Official Merchandise", desc: "The only official BangoBongo store. Authentic and licensed." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-border rounded-2xl p-6 text-center">
                <Icon className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crypto + Newsletter */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-border rounded-2xl p-6 sm:p-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Crypto Payments</p>
              <h2 className="text-xl font-semibold tracking-tight mb-3">Pay with Cryptocurrency</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                We accept ETH and BTC payments. Connect your wallet to enable crypto checkout.
              </p>
              <Button onClick={handleConnectWallet} className="w-full sm:w-auto">
                {walletConnected ? "Wallet Connected" : "Connect Wallet"}
              </Button>
            </div>

            <div className="border border-border rounded-2xl p-6 sm:p-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Newsletter</p>
              <h2 className="text-xl font-semibold tracking-tight mb-3">Stay in the loop</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Early access to merch drops, limited editions, and exclusive discounts.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex h-10 w-full rounded-full border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                />
                <Button type="submit" className="shrink-0 w-full sm:w-auto">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
