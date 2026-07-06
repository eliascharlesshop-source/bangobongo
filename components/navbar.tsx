"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { href: "/music", label: "Music" },
  { href: "/studio", label: "Studio" },
  { href: "/tour", label: "Tour" },
  { href: "/gear", label: "Gear" },
  { href: "/merch", label: "Merch" },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo/BangoBongo-Trans.png"
              alt="BangoBongo Logo"
              width={32}
              height={32}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-semibold text-lg tracking-tight text-foreground">BangoBongo</span>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/cart" aria-label="Cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/music">
              <Button variant="chrome" size="sm">
                Listen Now
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl transition-all duration-300 ease-out",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-transparent",
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-3 mt-2 border-t border-border">
            <Link href="/cart" onClick={() => setIsMenuOpen(false)} aria-label="Cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/music" onClick={() => setIsMenuOpen(false)} className="flex-1">
              <Button variant="chrome" size="sm" className="w-full">
                Listen Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
