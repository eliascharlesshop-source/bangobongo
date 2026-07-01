'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateItem, getTotalPrice, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleQuantityChange = (id: string, quantity: number) => {
    const item = items.find((i) => i.id === id)
    if (item && quantity > 0) {
      updateItem(id, { ...item, quantity })
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const response = await fetch('/api/studio/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, type: 'studio-services' }),
      })

      if (!response.ok) throw new Error('Checkout failed')

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('[v0] Checkout error:', error)
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/studio" className="text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold">Your Cart</h1>
          </div>

          <Card className="chrome-glass text-center py-16">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="text-muted-foreground">Start building your music by adding studio services.</p>
              <Button asChild variant="chrome">
                <Link href="/studio">Browse Services</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/studio" className="text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold">Your Cart</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="chrome-glass">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.serviceName}</h3>
                      <p className="text-sm text-muted-foreground">Base: ${item.basePrice}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Add-ons */}
                  {item.addOns.length > 0 && (
                    <div className="mb-4 space-y-2 p-3 rounded-lg bg-card/40">
                      <p className="text-sm font-medium">Add-ons:</p>
                      {item.addOns.map((addon) => (
                        <div key={addon.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{addon.name}</span>
                          <span>+${addon.price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold chrome-text-mint">${item.totalPrice * item.quantity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="chrome-glass sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 pb-4 border-b border-primary/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold">Total</span>
                  <span className="text-3xl font-black chrome-text-mint">${total.toFixed(2)}</span>
                </div>

                <Button
                  variant="chrome"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || items.length === 0}
                  className="w-full"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </Button>

                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full"
                >
                  Clear Cart
                </Button>

                <Button asChild variant="ghost" className="w-full">
                  <Link href="/studio">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
