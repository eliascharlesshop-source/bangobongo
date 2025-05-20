import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Merchandise | BangoBongo",
  description:
    "Official merchandise from BangoBongo including clothing, accessories, vinyl records, and limited edition items.",
}

export default function MerchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
