'use client'

import { useCallback, useState } from 'react'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { X, Bitcoin, CreditCard, MapPin, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { startCheckoutSession } from '@/app/actions/stripe'
import { getWalletAddress, isWalletAvailable } from '@/lib/wallet-utils'
import type { Product } from '@/lib/products'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type PaymentTab = 'card' | 'crypto'

interface CheckoutModalProps {
  product: Product
  onClose: () => void
}

export function CheckoutModal({ product, onClose }: CheckoutModalProps) {
  const [tab, setTab] = useState<PaymentTab>('card')
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [cryptoPaid, setCryptoPaid] = useState(false)
  const [eventDetails, setEventDetails] = useState({
    eventName: '',
    eventDate: '',
    contactEmail: '',
    notes: '',
  })
  const isDJProduct = product.isDJ

  const fetchClientSecret = useCallback(
    () => startCheckoutSession(product.id),
    [product.id],
  )

  const handleConnectWallet = async () => {
    setConnecting(true)
    const address = await getWalletAddress()
    setWalletAddress(address)
    setConnecting(false)
  }

  const handleCryptoPay = () => {
    // Simulate crypto payment confirmation
    setCryptoPaid(true)
  }

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg chrome-glass rounded-2xl overflow-hidden border border-primary/20">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-primary/10">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Checkout</p>
            <h3 className="font-bold text-foreground text-lg leading-tight">{product.name}</h3>
            <p className="text-primary font-semibold">
              ${(product.priceInCents / 100).toFixed(2)}
              {product.cryptoPrice && (
                <span className="text-muted-foreground text-xs ml-2">/ ETH {product.cryptoPrice}</span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-primary/10">
          <button
            onClick={() => setTab('card')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              tab === 'card'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Card / Stripe
          </button>
          <button
            onClick={() => setTab('crypto')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              tab === 'crypto'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bitcoin className="h-4 w-4" />
            Crypto (ETH)
          </button>
        </div>

        {/* DJ Event Details Section */}
        {isDJProduct && (
          <div className="border-b border-primary/10 p-4 space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Event Details</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Event Name *</label>
                <input
                  type="text"
                  placeholder="Wedding, Birthday, Corporate Event, etc."
                  value={eventDetails.eventName}
                  onChange={(e) => setEventDetails({ ...eventDetails, eventName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-primary/10 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Event Date *</label>
                <input
                  type="date"
                  value={eventDetails.eventDate}
                  onChange={(e) => setEventDetails({ ...eventDetails, eventDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-primary/10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Contact Email *</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={eventDetails.contactEmail}
                  onChange={(e) => setEventDetails({ ...eventDetails, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-primary/10 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Additional Notes</label>
                <textarea
                  placeholder="Music preferences, venue details, special requests..."
                  value={eventDetails.notes}
                  onChange={(e) => setEventDetails({ ...eventDetails, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-primary/10 text-foreground placeholder-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {tab === 'card' && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ fetchClientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}

          {tab === 'crypto' && (
            <div className="space-y-4 py-2">
              {cryptoPaid ? (
                <div className="text-center py-6 space-y-3">
                  <div className="text-4xl">✓</div>
                  <p className="text-primary font-semibold text-lg">Payment Submitted</p>
                  <p className="text-muted-foreground text-sm">
                    Your crypto transaction has been initiated. You&apos;ll receive a confirmation email once confirmed on-chain.
                  </p>
                  <Button onClick={onClose} className="mt-4">Close</Button>
                </div>
              ) : (
                <>
                  <div className="chrome-midnight rounded-xl p-4 border border-primary/10 space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Send to this ETH address</p>
                    <p className="text-primary font-mono text-sm break-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
                    <div className="flex justify-between text-sm pt-1 border-t border-primary/10">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="text-foreground font-semibold">ETH {product.cryptoPrice ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Network</span>
                      <span className="text-foreground">Ethereum Mainnet</span>
                    </div>
                  </div>

                  {!walletAddress ? (
                    <Button
                      onClick={handleConnectWallet}
                      disabled={connecting || !isWalletAvailable()}
                      className="w-full"
                      variant="outline"
                    >
                      {connecting ? 'Connecting…' : isWalletAvailable() ? 'Connect Wallet (MetaMask)' : 'No wallet detected — send manually'}
                    </Button>
                  ) : (
                    <div className="chrome-midnight rounded-xl p-3 border border-primary/10 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Connected</span>
                      <span className="text-primary font-mono text-sm">{shortAddress}</span>
                    </div>
                  )}

                  <Button onClick={handleCryptoPay} className="w-full">
                    <Bitcoin className="h-4 w-4 mr-2" />
                    I&apos;ve Sent the Payment
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    After sending, click the button above and we&apos;ll verify your transaction.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
