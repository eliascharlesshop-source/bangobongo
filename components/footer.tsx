import Link from "next/link"
import Image from "next/image"
import { Instagram, Twitter, Youtube, Facebook } from "lucide-react"

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Facebook, href: "#", label: "Facebook" },
]

const quickLinks = [
  { href: "/music", label: "Music" },
  { href: "/tour", label: "Tour" },
  { href: "/gear", label: "Gear" },
  { href: "/merch", label: "Merch" },
]

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo/BangoBongo-Trans.png" alt="BangoBongo Logo" width={36} height={36} />
              <span className="font-semibold text-lg tracking-tight text-foreground">BangoBongo</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Electronic music, live shows, and sound design.
            </p>
            <div className="flex gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Explore</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-foreground/80 hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-foreground/80 hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Contact</h3>
            <a
              href="mailto:bangobongo.ece@gmail.com"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors break-all"
            >
              bangobongo.ece@gmail.com
            </a>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              For bookings and inquiries, reach out any time.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BangoBongo. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>VISA</span>
            <span aria-hidden>·</span>
            <span>Mastercard</span>
            <span aria-hidden>·</span>
            <span>ETH</span>
            <span aria-hidden>·</span>
            <span>BTC</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
