"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ShoppingCart,
  Filter,
  Search,
  Tag,
  Clock,
  ChevronDown,
  CheckCircle2,
  ArrowUpDown,
  Heart,
  AlertCircle,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MerchItem, MerchCategory } from "@/types"
import { isWalletAvailable, getWalletAddress } from "@/lib/wallet-utils"

// Sample merchandise data - removed
const merchItems: MerchItem[] = []

// Define categories with display names and icon functions
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
  const [walletConnected, setWalletConnected] = useState<boolean>(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Group featured items
  const featuredItems = merchItems.filter((item) => item.isFeatured)

  // Group limited edition items
  const limitedItems = merchItems.filter((item) => item.isLimited)

  // Group by category for the main section
  const merchByCategory: Record<MerchCategory, MerchItem[]> = {} as Record<MerchCategory, MerchItem[]>

  merchItems.forEach((item) => {
    if (item.category) {
      if (!merchByCategory[item.category]) {
        merchByCategory[item.category] = []
      }
      merchByCategory[item.category].push(item)
    }
  })

  // Safe wallet connection handler
  const handleConnectWallet = async () => {
    if (isWalletAvailable()) {
      const address = await getWalletAddress()
      setWalletConnected(!!address)
    } else {
      alert("No Web3 wallet detected. Please install MetaMask or another Web3 wallet.")
    }
  }

  // Add to cart handler
  const handleAddToCart = (itemId: string) => {
    setSelectedItems((prev) => [...prev, itemId])
    // In a real app, this would add to cart state or call an API
    alert(`Item added to cart! In a complete implementation, this would update your cart.`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background to-background-lighter">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              <span className="text-primary">Official</span> <br />
              Merchandise
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Support the music with exclusive clothing, vinyl records, collectibles, and more. Worldwide shipping
              available.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-primary text-background hover:bg-secondary">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Shop Now
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Browse Categories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4 md:mb-0">Featured Items</h2>

            <div className="flex items-center gap-4">
              <div className="relative w-60">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search merchandise..."
                  className="w-full pl-10 pr-4 py-2 bg-background-lighter border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="bg-background-lighter rounded-lg overflow-hidden border border-accent group hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="relative">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {item.isLimited && (
                    <div className="absolute top-2 left-2 bg-primary text-background text-xs font-bold px-2 py-1 rounded">
                      Limited Edition
                    </div>
                  )}

                  {item.discountPercentage && (
                    <div className="absolute top-2 right-2 bg-destructive text-background text-xs font-bold px-2 py-1 rounded">
                      {item.discountPercentage}% OFF
                    </div>
                  )}

                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      className="bg-primary text-background hover:bg-secondary transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      onClick={() => handleAddToCart(item.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {item.category && (
                          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-accent/50 rounded">
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </span>
                        )}

                        {item.inStock ? (
                          <span className="text-xs text-primary flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            In Stock
                          </span>
                        ) : (
                          <span className="text-xs text-destructive flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-2">
                    {item.discountPercentage ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">
                          ${(item.price * (1 - item.discountPercentage / 100)).toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">${item.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                    )}
                    <span className="text-xs text-muted-foreground ml-2">ETH {item.cryptoPrice}</span>
                  </div>

                  {item.colors && item.colors.length > 0 && (
                    <div className="mt-3 flex items-center gap-1">
                      {item.colors.map((color) => (
                        <div
                          key={color}
                          className="h-4 w-4 rounded-full border border-accent cursor-pointer"
                          style={{
                            backgroundColor:
                              color.toLowerCase() === "black"
                                ? "#000"
                                : color.toLowerCase() === "white"
                                  ? "#fff"
                                  : color.toLowerCase() === "navy"
                                    ? "#001f3f"
                                    : color.toLowerCase() === "gray"
                                      ? "#808080"
                                      : color.toLowerCase() === "red"
                                        ? "#ff0000"
                                        : color.toLowerCase() === "blue"
                                          ? "#0000ff"
                                          : color.toLowerCase() === "teal"
                                            ? "#008080"
                                            : color.toLowerCase() === "silver"
                                              ? "#c0c0c0"
                                              : undefined,
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}

                  {item.sizes && item.sizes.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.sizes.map((size) => (
                        <span key={size} className="text-xs px-1.5 py-0.5 border border-accent rounded">
                          {size}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-12 bg-background-lighter">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Shop by Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-background rounded-lg p-4 text-center border border-accent hover:border-primary cursor-pointer transition-all duration-300 hover:shadow-md"
              >
                <h3 className="font-semibold text-foreground">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {merchByCategory[category.id]?.length || 0} Products
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limited Edition Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Limited Edition</h2>
            <Button variant="link" className="text-primary">
              View All Limited Items
            </Button>
          </div>

          <div className="relative bg-accent/30 rounded-lg p-6 mb-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2 space-y-4">
                <div className="inline-flex items-center px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Limited Time Offer
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  Hyperspace Journey Collector's Edition
                </h3>

                <p className="text-muted-foreground">
                  Exclusive collector's box set featuring colored vinyl, art booklet, and signed poster. Only 500 copies
                  available worldwide.
                </p>

                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-primary">$99.99</span>
                  <Button
                    className="bg-primary text-background hover:bg-secondary"
                    onClick={() => handleAddToCart("hyperspace-collectors")}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              <div className="w-full md:w-1/2 md:h-64 relative">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Hyperspace Journey Collector's Edition"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {limitedItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-background-lighter rounded-lg overflow-hidden border border-accent group hover:border-primary transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-primary text-background text-xs font-bold px-2 py-1 rounded">
                    Limited Edition
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                    <Button size="sm" onClick={() => handleAddToCart(item.id)}>
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Merchandise Section */}
      <section className="py-16 bg-background-lighter">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">All Merchandise</h2>
              <p className="text-muted-foreground">{merchItems.length} items available for purchase</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="flex items-center whitespace-nowrap">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort by: Featured
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>

              <Button variant="outline" size="sm" className="flex items-center whitespace-nowrap">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {merchItems.map((item) => (
              <div
                key={item.id}
                className="bg-background rounded-lg overflow-hidden border border-accent group hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="relative">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {item.isLimited && (
                    <div className="absolute top-2 left-2 bg-primary text-background text-xs font-bold px-2 py-1 rounded">
                      Limited Edition
                    </div>
                  )}

                  {item.discountPercentage && (
                    <div className="absolute top-2 right-2 bg-destructive text-background text-xs font-bold px-2 py-1 rounded">
                      {item.discountPercentage}% OFF
                    </div>
                  )}

                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      className="bg-primary text-background hover:bg-secondary transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      onClick={() => handleAddToCart(item.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {item.category && (
                          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-accent/50 rounded">
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </span>
                        )}

                        {item.inStock ? (
                          <span className="text-xs text-primary flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            In Stock
                          </span>
                        ) : (
                          <span className="text-xs text-destructive flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-2">
                    {item.discountPercentage ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">
                          ${(item.price * (1 - item.discountPercentage / 100)).toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">${item.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                    )}
                    <span className="text-xs text-muted-foreground ml-2">ETH {item.cryptoPrice}</span>
                  </div>

                  {item.colors && item.colors.length > 0 && (
                    <div className="mt-3 flex items-center gap-1">
                      {item.colors.map((color) => (
                        <div
                          key={color}
                          className="h-4 w-4 rounded-full border border-accent cursor-pointer"
                          style={{
                            backgroundColor:
                              color.toLowerCase() === "black"
                                ? "#000"
                                : color.toLowerCase() === "white"
                                  ? "#fff"
                                  : color.toLowerCase() === "navy"
                                    ? "#001f3f"
                                    : color.toLowerCase() === "gray"
                                      ? "#808080"
                                      : color.toLowerCase() === "red"
                                        ? "#ff0000"
                                        : color.toLowerCase() === "blue"
                                          ? "#0000ff"
                                          : color.toLowerCase() === "teal"
                                            ? "#008080"
                                            : color.toLowerCase() === "silver"
                                              ? "#c0c0c0"
                                              : undefined,
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}

                  {item.sizes && item.sizes.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.sizes.map((size) => (
                        <span key={size} className="text-xs px-1.5 py-0.5 border border-accent rounded">
                          {size}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button variant="outline" className="mx-auto">
              Load More Products
            </Button>
          </div>
        </div>
      </section>

      {/* Album Merchandise */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Album Collections</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Digital Dreams", "Electric Pulse", "Hyperspace Journey"].map((album) => {
              const albumItems = merchItems.filter((item) => item.relatedAlbum === album)
              return (
                <div
                  key={album}
                  className="bg-background-lighter rounded-lg overflow-hidden border border-accent hover:border-primary transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image src="/placeholder.svg?height=500&width=800" alt={album} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-darker via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-xl font-bold text-foreground">{album}</h3>
                      <p className="text-sm text-muted-foreground">{albumItems.length} items available</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {albumItems.slice(0, 4).map((item, index) => (
                        <div key={item.id} className="relative h-24 rounded overflow-hidden">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                          {index >= 2 && albumItems.length > 4 && index === 3 && (
                            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                              <span className="text-foreground font-medium">+{albumItems.length - 4} more</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button className="w-full">View Collection</Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Shipping Information */}
      <section className="py-12 bg-background-lighter">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg border border-accent text-center">
              <Truck className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Worldwide Shipping</h3>
              <p className="text-sm text-muted-foreground">
                We ship to most countries worldwide. Orders are typically processed within 1-2 business days.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-accent text-center">
              <CheckCircle2 className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                All merchandise is produced with premium materials and undergoes quality checks before shipping.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg border border-accent text-center">
              <Tag className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Official Merchandise</h3>
              <p className="text-sm text-muted-foreground">
                This is the only official store for BangoBongo merchandise. All designs are authentic and licensed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-background-lighter rounded-lg border border-accent p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">How long does shipping take?</h3>
              <p className="text-muted-foreground">
                Domestic orders typically arrive within 3-5 business days. International orders may take 7-14 business
                days depending on your location and customs processing.
              </p>
            </div>

            <div className="bg-background-lighter rounded-lg border border-accent p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American Express) and cryptocurrency payments in ETH
                and BTC.
              </p>
            </div>

            <div className="bg-background-lighter rounded-lg border border-accent p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">What is your return policy?</h3>
              <p className="text-muted-foreground">
                If you're not satisfied with your purchase, you can return unworn/unused items within 30 days of
                delivery for a full refund. Please note that custom and limited edition items are not eligible for
                returns.
              </p>
            </div>

            <div className="bg-background-lighter rounded-lg border border-accent p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Are the sizes true to fit?</h3>
              <p className="text-muted-foreground">
                Yes, our clothing follows standard sizing. We recommend checking the size chart provided on each product
                page for specific measurements to ensure the best fit.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline">View All FAQs</Button>
          </div>
        </div>
      </section>

      {/* Crypto Payment Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Pay with Cryptocurrency</h2>
            <p className="text-muted-foreground mb-8">
              We accept ETH and BTC payments. Connect your wallet to enable crypto checkout options.
            </p>

            <Button onClick={handleConnectWallet} className="bg-primary text-background hover:bg-secondary">
              {walletConnected ? "Wallet Connected" : "Connect Wallet"}
            </Button>

            {walletConnected && (
              <p className="text-sm text-primary mt-4">
                Wallet connected! You can now purchase merchandise using cryptocurrency.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Get Exclusive Merchandise Updates</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for early access to new merchandise drops, limited editions, and exclusive
              discounts.
            </p>

            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
