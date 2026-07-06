'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Trash2, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkout } from '@/components/checkout'
import type { CartItem } from '@/types'

// Sample cart items - in production, these would come from state management or a database
const initialCartItems: CartItem[] = []

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [checkoutStarted, setCheckoutStarted] = useState(false)

  const updateQuantity = (id: string, newQuantity: number): void => {
    if (newQuantity < 1) return
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: string): void => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = cartItems.length > 0 ? 4.99 : 0
  const total = subtotal + shipping

  // Convert cart items to Stripe checkout format
  const checkoutItems = cartItems.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
  }))

  const handleCheckoutSuccess = () => {
    setCartItems([])
    setCheckoutStarted(false)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6 sm:mb-8 px-4">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button asChild>
            <Link href="/merch" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="border border-border rounded-2xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Cart Items
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-border last:border-b-0"
                  >
                    <div className="relative w-full sm:w-24 h-40 sm:h-24 rounded-md overflow-hidden shrink-0">
                      <Image
                        src={item.image || '/placeholder.svg?height=300&width=300'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg">
                        {item.name}
                      </h3>
                      <div className="text-primary font-medium mt-1">
                        ${item.price.toFixed(2)}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link href="/merch" className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="border border-border rounded-2xl p-4 sm:p-6 sticky top-20">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                Order Summary
              </h2>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {shipping > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-border my-2 pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {!checkoutStarted ? (
                <Button
                  className="w-full"
                  onClick={() => setCheckoutStarted(true)}
                  disabled={cartItems.length === 0}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
              ) : (
                <Checkout items={checkoutItems} onSuccess={handleCheckoutSuccess} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
