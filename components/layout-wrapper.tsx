'use client'

import Navbar from './navbar'
import Footer from './footer'
import { ReactNode } from 'react'

interface LayoutWrapperProps {
  children: ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
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
