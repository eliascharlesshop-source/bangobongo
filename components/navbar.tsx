"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Music, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-accent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo/BangoBongo-Trans.png"
                alt="BangoBongo Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-primary font-bold text-xl">BangoBongo</span>
            </Link>
          </div>

          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link href="/music" className="text-foreground hover:text-primary transition-colors">
                  Music
                </Link>
              </li>
              <li>
                <Link href="/studio" className="text-foreground hover:text-primary transition-colors">
                  Studio
                </Link>
              </li>
              <li>
                <Link href="/tour" className="text-foreground hover:text-primary transition-colors">
                  Tour
                </Link>
              </li>
              <li>
                <Link href="/gear" className="text-foreground hover:text-primary transition-colors">
                  Gear
                </Link>
              </li>
              <li>
                <Link href="/merch" className="text-foreground hover:text-primary transition-colors">
                  Merch
                </Link>
              </li>
            </ul>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/music">
              <Button className="bg-primary text-background hover:bg-secondary">
                <Music className="h-4 w-4 mr-2" />
                Listen Now
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-accent">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/music"
              className="block px-3 py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Music
            </Link>
            <Link
              href="/studio"
              className="block px-3 py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Studio
            </Link>
            <Link
              href="/tour"
              className="block px-3 py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Tour
            </Link>
            <Link
              href="/gear"
              className="block px-3 py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Gear
            </Link>
            <Link
              href="/merch"
              className="block px-3 py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Merch
            </Link>
            <div className="flex items-center space-x-4 px-3 py-2">
              <ThemeToggle />
              <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/music" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-primary text-background hover:bg-secondary">
                  <Music className="h-4 w-4 mr-2" />
                  Listen Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
