"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function StudioHero() {
  return (
    <section className="relative overflow-hidden border-b border-primary/10">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(140 80% 69% / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(140 80% 69% / 1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Neon glow orb */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 relative z-10">
        <div className="max-w-5xl">
          {/* Eyebrow label */}
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-12 bg-primary" />
            <span className="text-primary text-sm font-medium tracking-widest uppercase">
              BangoBongo Studio
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight text-balance mb-8">
            Create.
            <br />
            <span className="text-primary">Elevate.</span>
            <br />
            Release.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12">
            Professional music creation from concept to final master. Songwriting,
            beat production, full tracks, DJ sets, and mixing — everything you need
            to bring your sound to life.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              variant="chrome"
              size="lg"
              className="bg-primary text-background hover:bg-primary/90 font-semibold px-8 glow-primary"
            >
              <Link href="#services">
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary/30 hover:border-primary hover:text-primary px-8"
            >
              <Link href="#contact">Book a Session</Link>
            </Button>
          </div>
        </div>

        {/* Stat bar */}
        <div className="mt-20 pt-10 border-t border-primary/10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "500+", label: "Tracks Produced" },
            { value: "12+", label: "Years in Studio" },
            { value: "50+", label: "Artists Collaborated" },
            { value: "3", label: "Studio Rooms" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-black text-primary tabular-nums">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
