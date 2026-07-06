import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ClientProviders } from "@/components/client-providers"
import { ErrorBoundary } from "@/components/error-boundary"
import { LayoutWrapper } from "@/components/layout-wrapper"

/**
 * Note: This application supports cryptocurrency payments but avoids
 * direct manipulation of the window.ethereum object to prevent conflicts
 * with browser extensions like MetaMask. We use utility functions in
 * lib/wallet-utils.ts to safely interact with Web3 wallets.
 */

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: {
    default: "BangoBongo - Professional Electronic Music Artist",
    template: "%s | BangoBongo Music"
  },
  description: "Experience the future of electronic music with BangoBongo. Professional DJ, producer, and electronic music artist bringing innovative beats, live performances, and cutting-edge sound design.",
  generator: 'BangoBongo Music Platform',
  keywords: ['BangoBongo', 'electronic music', 'DJ', 'producer', 'beats', 'music licensing', 'live performances', 'EDM', 'techno', 'house music'],
  authors: [{ name: 'BangoBongo', url: 'https://bangobongo.com' }],
  creator: 'BangoBongo Music',
  publisher: 'BangoBongo Music',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bangobongo.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bangobongo.com',
    title: 'BangoBongo - Professional Electronic Music Artist',
    description: 'Experience the future of electronic music with BangoBongo. Professional DJ, producer, and electronic music artist bringing innovative beats and live performances.',
    siteName: 'BangoBongo Music',
    images: [{
      url: '/logo/BangoBongo-Trans.png',
      width: 1200,
      height: 630,
      alt: 'BangoBongo Music Logo'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BangoBongo - Professional Electronic Music Artist',
    description: 'Experience the future of electronic music with BangoBongo.',
    creator: '@bangobongo',
    images: ['/logo/BangoBongo-Trans.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo/BangoBongo-Trans.png" />
        <link rel="apple-touch-icon" href="/logo/BangoBongo-Trans.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0E1216" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BangoBongo" />
        
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//v0.blob.com" />
        <link rel="dns-prefetch" href="//hebbkx1anhila5yf.public.blob.vercel-storage.com" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ErrorBoundary>
            <ClientProviders>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
              <Toaster />
            </ClientProviders>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
