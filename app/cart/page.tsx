"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Trash2, CreditCard, Bitcoin } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CartItem, PaymentMethod } from "@/types"

// Import the wallet utilities at the top of the file
import { getWalletAddress } from "@/lib/wallet-utils"

// Sample cart items
const initialCartItems: CartItem[] = [
  {
    id: "merch1",
    name: "BangoBongo T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    quantity: 1,
    cryptoPrice: 0.015,
  },
  {
    id: "merch2",
    name: "Neon Nights Hoodie",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    quantity: 1,
    cryptoPrice: 0.03,
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("usd")

  const updateQuantity = (id: string, newQuantity: number): void => {
    if (newQuantity < 1) return

    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string): void => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 4.99
  const total = subtotal + shipping

  const cryptoSubtotal = cartItems.reduce((sum, item) => sum + item.cryptoPrice * item.quantity, 0)
  const cryptoShipping = 0.0025
  const cryptoTotal = cryptoSubtotal + cryptoShipping

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6 sm:mb-8 px-4">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild>
            <Link href="/store" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-background-lighter rounded-lg border border-accent p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Cart Items</h2>

              <div className="space-y-4 sm:space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-accent"
                  >
                    <div className="relative w-full sm:w-24 h-40 sm:h-24 rounded-md overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg?height=300&width=300"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 mt-2 sm:mt-0">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="text-primary font-medium mt-1">
                        ${item.price.toFixed(2)}
                        <span className="text-xs text-muted-foreground ml-2">ETH {item.cryptoPrice}</span>
                      </div>

                      <div className="flex items-center justify-between mt-3 sm:mt-4">
                        <div className="flex items-center">
                          <button
                            className="w-10 h-10 flex items-center justify-center rounded-md border border-accent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <button
                            className="w-10 h-10 flex items-center justify-center rounded-md border border-accent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 sm:mt-6">
                <Button asChild variant="outline">
                  <Link href="/store" className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-background-lighter rounded-lg border border-accent p-4 sm:p-6 sticky top-20">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Order Summary</h2>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {paymentMethod === "usd" ? `$${subtotal.toFixed(2)}` : `ETH ${cryptoSubtotal.toFixed(4)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {paymentMethod === "usd" ? `$${shipping.toFixed(2)}` : `ETH ${cryptoShipping.toFixed(4)}`}
                  </span>
                </div>
                <div className="border-t border-accent my-2 pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">
                    {paymentMethod === "usd" ? `$${total.toFixed(2)}` : `ETH ${cryptoTotal.toFixed(4)}`}
                  </span>
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <h3 className="font-medium mb-2">Payment Method</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant={paymentMethod === "usd" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setPaymentMethod("usd")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    USD
                  </Button>
                  <Button
                    variant={paymentMethod === "crypto" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setPaymentMethod("crypto")}
                  >
                    <Bitcoin className="h-4 w-4 mr-2" />
                    Crypto
                  </Button>
                </div>
              </div>

              <Button
                className="w-full mt-2"
                onClick={async () => {
                  const walletAddress = await getWalletAddress()
                  if (walletAddress) {
                    // proceed with payment
                    alert(`Payment processed from wallet: ${walletAddress}`) // Replace with actual payment logic
                  } else {
                    alert("Please connect your wallet.")
                  }
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
