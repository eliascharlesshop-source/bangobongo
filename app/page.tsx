'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Music,
  CalendarDays,
  MapPin,
  Play,
  ShoppingBag,
  ExternalLink,
  Mail,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  CreditCard,
  Bitcoin,
  Menu,
  X,
  ShoppingCart,
  Clock,
  Video,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CheckoutModal } from '@/components/checkout-modal'
import { PRODUCTS } from '@/lib/products'
import { useAudio } from '@/contexts/audio-context'
import type { Product } from '@/lib/products'

/* ─────────────────── Static data ─────────────────── */
const tracklist = [
  'What I\'m Afraid Of (Intro)', 'Angel Baby', 'Either Way', 'Emotional',
  'Guts', 'Heartless', 'In Time', 'Jealous', 'Never Buy', 'Nightshift',
  'Paradise Lost', 'Pretty But Tough', 'Save Me', 'She', 'Summer Reign',
  'Recovering Lungs', 'Timing', 'Trap Soul II', 'Whatever You Don\'t Do (Outro)',
]



const gearItems: Array<{ id: string; name: string; category: string; link: string }> = []

const navLinks = [
  { href: '#music', label: 'Music' },
  { href: '#dj', label: 'Hire DJ' },
  { href: '#store', label: 'Store' },
  { href: '#gear', label: 'Gear' },
  { href: '#contact', label: 'Contact' },
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [storeTab, setStoreTab] = useState<'merch' | 'license' | 'dj'>('merch')
  const [djTab, setDjTab] = useState<'online' | 'inperson'>('online')
  
  const { setTracks, setShowPlayer } = useAudio()

  const merch = PRODUCTS.filter((p) => p.category === 'merch')
  const licenses = PRODUCTS.filter((p) => p.category === 'license')
  const djServices = PRODUCTS.filter((p) => p.category === 'dj')
  const djOnline = djServices.filter((p) => p.id.includes('online'))
  const djInPerson = djServices.filter((p) => !p.id.includes('online'))

  // Chrome Hearts album tracks
  const chromeHeartsTracks = [
    { id: 'ch-01', title: 'What I\'m Afraid Of (Intro)', artist: 'BangoBongo', duration: 185, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-02', title: 'Angel Baby', artist: 'BangoBongo', duration: 234, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-03', title: 'Either Way', artist: 'BangoBongo', duration: 198, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-04', title: 'Emotional', artist: 'BangoBongo', duration: 215, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-05', title: 'Neon Dreams', artist: 'BangoBongo', duration: 212, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-06', title: 'Paradise Lost', artist: 'BangoBongo', duration: 206, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-07', title: 'Midnight Whispers', artist: 'BangoBongo', duration: 187, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-08', title: 'Chrome Hearts', artist: 'BangoBongo', duration: 203, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-09', title: 'Electric Soul', artist: 'BangoBongo', duration: 192, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-10', title: 'Starlight', artist: 'BangoBongo', duration: 229, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-11', title: 'Paradise Lost (Remix)', artist: 'BangoBongo', duration: 201, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-12', title: 'Infinite', artist: 'BangoBongo', duration: 217, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-13', title: 'Shattered Dreams', artist: 'BangoBongo', duration: 219, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-14', title: 'Ultraviolet', artist: 'BangoBongo', duration: 226, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-15', title: 'Pulse', artist: 'BangoBongo', duration: 208, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-16', title: 'Digital', artist: 'BangoBongo', duration: 183, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-17', title: 'Hypnotic', artist: 'BangoBongo', duration: 195, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-18', title: 'Euphoria', artist: 'BangoBongo', duration: 227, albumArt: '/placeholder.svg?height=400&width=400' },
    { id: 'ch-19', title: 'The End (Outro)', artist: 'BangoBongo', duration: 217, albumArt: '/placeholder.svg?height=400&width=400' },
  ]

  // Load tracks into audio context on mount
  useEffect(() => {
    setTracks(chromeHeartsTracks)
  }, [setTracks])

  return (
    <>
      {/* ── Checkout Modal ── */}
      {selectedProduct && (
        <CheckoutModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      {/* ── Sticky Nav ── */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2">
            <Image src="/logo/BangoBongo-Trans.png" alt="BangoBongo" width={32} height={32} />
            <span className="font-bold text-primary text-lg tracking-tight">BangoBongo</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-muted-foreground hover:text-primary transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="#store">
              <Button size="sm" className="chrome-mint text-background gap-2">
                <ShoppingCart className="h-4 w-4" />
                Shop
              </Button>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-muted-foreground hover:text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-background border-t border-primary/10 px-4 py-3 flex flex-col gap-3 text-sm">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4">

        {/* ── Hero ── */}
        <section className="py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <p className="text-xs text-primary uppercase tracking-widest font-semibold">Electronic Music Artist</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
              <span className="chrome-text-mint">BangoBongo</span>
            </h1>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Electronic beats, innovative sounds, and live energy that define the future of music.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#music">
                <Button size="sm" className="chrome-mint text-background gap-2">
                  <Play className="h-4 w-4" />
                  Listen Now
                </Button>
              </a>
              <a href="#dj">
                <Button size="sm" variant="outline" className="gap-2">
                  <Music className="h-4 w-4" />
                  Hire DJ
                </Button>
              </a>
              <a href="#store">
                <Button size="sm" variant="outline" className="gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Shop
                </Button>
              </a>
            </div>
            {/* Payment badges */}
            <div className="flex items-center gap-2 pt-1">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <Bitcoin className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Stripe & Crypto accepted</span>
            </div>
          </div>

          {/* Album art */}
          <div className="w-52 h-52 md:w-64 md:h-64 relative rounded-2xl overflow-hidden chrome-border glow-primary flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
              <Music className="h-16 w-16 text-primary/40" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
              <p className="text-xs font-semibold text-foreground">Chrome Hearts</p>
              <p className="text-xs text-muted-foreground">2024 · 19 tracks</p>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="border-t border-primary/10" />

        {/* ── Music ── */}
        <section id="music" className="py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              <span className="chrome-text-mint">Chrome Hearts</span>
              <span className="text-muted-foreground text-base font-normal ml-3">2024 · Album</span>
            </h2>
            <Link href="/music" className="text-primary text-sm hover:underline flex items-center gap-1">
              Full Discography <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {tracklist.map((title, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 cursor-pointer group transition-colors"
              >
                <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}</span>
                <button className="text-muted-foreground group-hover:text-primary transition-colors">
                  <Play className="h-3.5 w-3.5" />
                </button>
                <span className="text-sm text-foreground group-hover:text-primary transition-colors flex-1 truncate">
                  {title}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.floor(180 + Math.random() * 60)}s
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="border-t border-primary/10" />

        {/* ── Hire DJ ── */}
        <section id="dj" className="py-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              <span className="chrome-text-mint">Hire as DJ</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Professional DJ services — online streams or in-person events.
            </p>
          </div>

          {/* DJ Type Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-lg bg-secondary inline-flex w-fit">
            <button
              onClick={() => setDjTab('online')}
              className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors flex items-center gap-2 ${
                djTab === 'online'
                  ? 'bg-primary text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Video className="h-4 w-4" />
              Online
            </button>
            <button
              onClick={() => setDjTab('inperson')}
              className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors flex items-center gap-2 ${
                djTab === 'inperson'
                  ? 'bg-primary text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MapPin className="h-4 w-4" />
              In-Person
            </button>
          </div>

          {/* Online DJ Services */}
          {djTab === 'online' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {djOnline.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border p-5 space-y-3 transition-all border-primary/10 chrome-glass"
                >
                  <div>
                    <p className="font-bold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">${(item.priceInCents / 100).toFixed(0)}</p>
                    {item.cryptoPrice && (
                      <p className="text-xs text-muted-foreground">ETH {item.cryptoPrice}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedProduct(item)}
                  >
                    Book Now
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* In-Person DJ Services */}
          {djTab === 'inperson' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {djInPerson.map((item, i) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-5 space-y-3 transition-all ${
                    i === 0
                      ? 'border-primary/40 bg-primary/5 relative'
                      : 'border-primary/10 chrome-glass'
                  }`}
                >
                  {i === 0 && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-background text-xs px-3 py-0.5 rounded-full font-semibold">
                      Popular
                    </span>
                  )}
                  <div>
                    <p className="font-bold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">${(item.priceInCents / 100).toFixed(0)}</p>
                    {item.cryptoPrice && (
                      <p className="text-xs text-muted-foreground">ETH {item.cryptoPrice}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    variant={i === 0 ? 'default' : 'outline'}
                    onClick={() => setSelectedProduct(item)}
                  >
                    Book Now
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Divider ── */}
        <div className="border-t border-primary/10" />

        {/* ── Store ── */}
        <section id="store" className="py-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Store</h2>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CreditCard className="h-3.5 w-3.5" />
              <Bitcoin className="h-3.5 w-3.5" />
              <span>Stripe &amp; Crypto</span>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 mb-6 p-1 rounded-lg bg-secondary inline-flex w-fit flex-wrap">
            {(['merch', 'license', 'dj'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setStoreTab(t)}
                className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${
                  storeTab === t
                    ? 'bg-primary text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'merch' ? 'Merch' : t === 'license' ? 'Beat Licenses' : 'DJ Services'}
              </button>
            ))}
          </div>

          {/* Merch grid */}
          {storeTab === 'merch' && (
            <div className="py-16 text-center">
              <ShoppingBag className="h-16 w-16 text-primary/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Merch Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Exclusive BangoBongo merchandise including apparel, vinyl, and limited editions will be available soon.
              </p>
            </div>
          )}

          {/* Licenses grid */}
          {storeTab === 'license' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {licenses.map((item, i) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-5 space-y-3 transition-all ${
                    i === 1
                      ? 'border-primary/40 bg-primary/5 relative'
                      : 'border-primary/10 chrome-glass'
                  }`}
                >
                  {i === 1 && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-background text-xs px-3 py-0.5 rounded-full font-semibold">
                      Popular
                    </span>
                  )}
                  <div>
                    <p className="font-bold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">${(item.priceInCents / 100).toFixed(0)}</p>
                    {item.cryptoPrice && (
                      <p className="text-xs text-muted-foreground">ETH {item.cryptoPrice}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    variant={i === 1 ? 'default' : 'outline'}
                    onClick={() => setSelectedProduct(item)}
                  >
                    Get License
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* DJ Services grid */}
          {storeTab === 'dj' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {djServices.map((item, i) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-5 space-y-3 transition-all ${
                    i === 1
                      ? 'border-primary/40 bg-primary/5 relative'
                      : 'border-primary/10 chrome-glass'
                  }`}
                >
                  {i === 1 && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-background text-xs px-3 py-0.5 rounded-full font-semibold">
                      Popular
                    </span>
                  )}
                  <div>
                    <p className="font-bold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">${(item.priceInCents / 100).toFixed(0)}</p>
                    {item.cryptoPrice && (
                      <p className="text-xs text-muted-foreground">ETH {item.cryptoPrice}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    variant={i === 1 ? 'default' : 'outline'}
                    onClick={() => setSelectedProduct(item)}
                  >
                    Book Now
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Divider ── */}
        <div className="border-t border-primary/10" />

        {/* ── Gear ── */}
        <section id="gear" className="py-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Gear Setup</h2>
          </div>

          <div className="py-16 text-center">
            <Music className="h-16 w-16 text-primary/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Equipment Guide Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              A complete breakdown of the equipment and setup used to create BangoBongo tracks will be available soon.
            </p>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="border-t border-primary/10" />

        {/* ── Contact / Newsletter ── */}
        <section id="contact" className="py-10">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Stay Connected</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Subscribe for exclusive updates, early releases, and special offers.
              </p>
              <form className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex h-9 w-full rounded-lg border border-primary/20 bg-background/80 backdrop-blur px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                />
                <Button size="sm" type="submit">Subscribe</Button>
              </form>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Follow</p>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Youtube, href: '#', label: 'YouTube' },
                  { icon: Facebook, href: '#', label: 'Facebook' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
              <a
                href="mailto:bangobongo.ece@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                bangobongo.ece@gmail.com
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-primary/10 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BangoBongo. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/refund-policy" className="hover:text-primary transition-colors">Refunds</Link>
          </div>
          <div className="flex items-center gap-2">
            <span>Payments:</span>
            {['VISA', 'MC', 'ETH', 'BTC'].map((p) => (
              <span key={p} className="px-1.5 py-0.5 bg-secondary rounded text-xs">{p}</span>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}
