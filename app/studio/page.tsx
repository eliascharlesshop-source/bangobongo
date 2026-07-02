import type { Metadata } from "next"
import { StudioHero } from "@/components/studio/studio-hero"
import { StudioServices } from "@/components/studio/studio-services"
import { StudioProcess } from "@/components/studio/studio-process"
import { StudioCTA } from "@/components/studio/studio-cta"

export const metadata: Metadata = {
  title: "Studio | BangoBongo",
  description: "Professional music creation services — Songwriting, Beats, Tracks, DJ Sets, and Mixing. Collaborate with BangoBongo in the studio.",
}

export default function StudioPage() {
  return (
    <main className="min-h-screen">
      <StudioHero />
      <StudioServices />
      <StudioProcess />
      <StudioCTA />
    </main>
  )
}
