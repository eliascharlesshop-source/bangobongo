import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AudioProvider } from "@/contexts/audio-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { ErrorBoundary } from "@/components/error-boundary"
import FixedMediaPlayerWrapper from "@/components/fixed-media-player-wrapper"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

/**
 * Note: This application supports cryptocurrency payments but avoids
 * direct manipulation of the window.ethereum object to prevent conflicts
 * with browser extensions like MetaMask. We use utility functions in
 * lib/wallet-utils.ts to safely interact with Web3 wallets.
 */

const inter = Inter({ subsets: ["latin"] })

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
      url: '/placeholder-logo.png',
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
    images: ['/placeholder-logo.png'],
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BangoBongo" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ErrorBoundary>
            <NotificationProvider>
              <AudioProvider>
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1 pb-[72px]">
                    <ErrorBoundary>
                      {children}
                    </ErrorBoundary>
                  </main>
                  <Footer />
                  <FixedMediaPlayerWrapper />
                </div>
                <Toaster />
              </AudioProvider>
            </NotificationProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
