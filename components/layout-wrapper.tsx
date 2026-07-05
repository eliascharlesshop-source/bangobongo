'use client'

import { usePathname } from 'next/navigation'
import Navbar from './navbar'
import Footer from './footer'
import { ReactNode } from 'react'

interface LayoutWrapperProps {
  children: ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  // Home page has its own inline nav & footer
  const isHome = pathname === '/'

  if (isHome) {
    return (
      <div className="min-h-screen flex flex-col pb-[72px]">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-[72px]">
        {children}
      </main>
      <Footer />
    </div>
  )
}
