'use client'

import { useCallback, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { startCheckoutSession } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutProps {
  items: Array<{ productId: string; quantity: number }>
  onSuccess?: () => void
}

export function Checkout({ items, onSuccess }: CheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartCheckout = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const secret = await startCheckoutSession(items)
      setClientSecret(secret)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
      setIsLoading(false)
    }
  }, [items])

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-950">
        <p className="font-medium">Error: {error}</p>
        <button
          onClick={() => {
            setError(null)
            setClientSecret(null)
          }}
          className="mt-2 text-sm underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <button
        onClick={handleStartCheckout}
        disabled={isLoading || items.length === 0}
        className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-full font-medium transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading checkout...' : 'Proceed to Checkout'}
      </button>
    )
  }

  return (
    <div id="checkout" className="mt-4">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout onComplete={onSuccess} />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
