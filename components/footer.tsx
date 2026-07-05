import Link from "next/link"
import Image from "next/image"
import { Mail } from "lucide-react"

const TikTokIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.08 1.61 2.88 2.88 0 0 1 4.07-4.77v-3.5a6.34 6.34 0 0 0-5.07 2.86 6.34 6.34 0 0 0 10.86 7.09v-3.5a3.08 3.08 0 0 0 1.96-.64Z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-background-darker border-t border-accent py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo/BangoBongo-Trans.png"
                alt="BangoBongo Logo"
                width={50}
                height={50}
                className="mr-2"
              />
              <span className="text-primary font-bold text-xl">BangoBongo</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional DJ and music producer bringing you the best electronic music experience.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <TikTokIcon />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/music" className="text-muted-foreground hover:text-primary transition-colors">
                  Music
                </Link>
              </li>
              <li>
                <Link href="/gear" className="text-muted-foreground hover:text-primary transition-colors">
                  Gear
                </Link>
              </li>
              <li>
                <Link href="/merch" className="text-muted-foreground hover:text-primary transition-colors">
                  Merch
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <a
                  href="mailto:bangobongo.ece@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  bangobongo.ece@gmail.com
                </a>
              </li>
              <li className="text-muted-foreground">
                For bookings and inquiries, please email us or use the contact form on our website.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-accent flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} BangoBongo. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Payment Options:</span>
            <span className="text-xs px-2 py-1 bg-accent rounded text-muted-foreground">VISA</span>
            <span className="text-xs px-2 py-1 bg-accent rounded text-muted-foreground">MASTERCARD</span>
            <span className="text-xs px-2 py-1 bg-accent rounded text-muted-foreground">ETH</span>
            <span className="text-xs px-2 py-1 bg-accent rounded text-muted-foreground">BTC</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
