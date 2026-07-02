'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/contexts/cart-context'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart, items } = useCart()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Clear cart after successful checkout
    clearCart()

    // Fetch order details from session
    if (sessionId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`/api/studio/checkout/status?session_id=${sessionId}`)
          if (response.ok) {
            const data = await response.json()
            setOrderDetails(data)
          }
        } catch (error) {
          console.error('[v0] Failed to fetch order details:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchOrderDetails()
    } else {
      setLoading(false)
    }
  }, [sessionId, clearCart])

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold mb-2 chrome-text-mint">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg">Your studio services have been booked successfully.</p>
        </div>

        {/* Order Details */}
        <Card className="chrome-glass mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-card rounded w-3/4" />
                <div className="h-4 bg-card rounded w-1/2" />
              </div>
            ) : orderDetails ? (
              <>
                <div className="flex justify-between py-2 border-b border-primary/10">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono">{orderDetails.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-primary/10">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-semibold">${(orderDetails.amount_total / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-primary/10">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className="text-green-600 font-semibold capitalize">{orderDetails.payment_status}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Email</span>
                  <span>{orderDetails.customer_email || 'Not provided'}</span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Order details unavailable</p>
            )}
          </CardContent>
        </Card>

        {/* Services Booked */}
        {items.length > 0 && (
          <Card className="chrome-glass mb-8">
            <CardHeader>
              <CardTitle>Services Booked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-3 bg-card/40 rounded-lg">
                    <div>
                      <p className="font-medium">{item.serviceName}</p>
                      {item.addOns.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Add-ons: {item.addOns.map((ao) => ao.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold">${item.totalPrice * item.quantity}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="chrome-glass mb-8 bg-card/30">
          <CardHeader>
            <CardTitle>What&apos;s Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              A confirmation email has been sent to you with your order details and booking information. Our team will contact you shortly to schedule your session.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Check your email for confirmation details</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Review your booking information</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Prepare for your session</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="chrome" size="lg">
            <Link href="/studio">Return to Studio</Link>
          </Button>
          <Button asChild variant="chromeGlass" size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
