import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Add a comment to clarify our approach to wallet integration
// This doesn't change functionality but documents our approach

/**
 * Note: This application supports cryptocurrency payments but avoids
 * direct manipulation of the window.ethereum object to prevent conflicts
 * with browser extensions like MetaMask. We use utility functions in
 * lib/wallet-utils.ts to safely interact with Web3 wallets.
 */

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DJ Music Profile",
  description: "Music profile for a professional DJ and music artist",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

