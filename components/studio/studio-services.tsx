"use client"

import { useState } from "react"
import { Pen, Drum, Music2, Disc3, SlidersHorizontal, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ServiceDetail } from "./service-detail"

export type ServiceId = "songwriting" | "beats" | "tracks" | "dj-sets" | "mixing"

export interface Service {
  id: ServiceId
  number: string
  title: string
  tagline: string
  description: string
  icon: React.ElementType
  features: string[]
  deliverables: string[]
  startingAt: string
  tags: string[]
}

export const SERVICES: Service[] = [
  {
    id: "songwriting",
    number: "01",
    title: "Songwriting",
    tagline: "Your story. Our craft.",
    description:
      "Collaborative songwriting sessions where melody, lyrics, and structure come together. We work with you to develop hooks, verses, and choruses that resonate — from initial concept to a fully arranged demo.",
    icon: Pen,
    features: [
      "Co-writing sessions (remote or in-studio)",
      "Melody and hook development",
      "Lyric writing and concept refinement",
      "Topline vocal arrangements",
      "Full song structure mapping",
    ],
    deliverables: ["Demo recording", "Lyric sheet", "Chord chart", "Reference track"],
    startingAt: "$250",
    tags: ["Co-write", "Lyrics", "Melody", "Demo"],
  },
  {
    id: "beats",
    number: "02",
    title: "Beats",
    tagline: "The foundation of sound.",
    description:
      "Custom beat production spanning electronic, synthwave, hip-hop, ambient, and beyond. Every beat is crafted from scratch with precision sound design, dynamic arrangement, and a mix-ready bounce.",
    icon: Drum,
    features: [
      "Custom beat production from scratch",
      "Genre-spanning styles (electronic, hip-hop, synthwave)",
      "Professional sound design and synthesis",
      "Arrangement and dynamic structure",
      "Stems and trackouts available",
    ],
    deliverables: ["Tagged MP3 preview", "WAV master", "Stems (trackout)", "License agreement"],
    startingAt: "$150",
    tags: ["Electronic", "Hip-Hop", "Synthwave", "Custom"],
  },
  {
    id: "tracks",
    number: "03",
    title: "Tracks",
    tagline: "Full production. Full vision.",
    description:
      "End-to-end track production — from bare idea to a release-ready master. We handle instrumentation, arrangement, recording, and production with the same standards used on our own releases.",
    icon: Music2,
    features: [
      "Full instrumentation and arrangement",
      "Session musician coordination",
      "Vocal production and recording",
      "Sound design and synthesis",
      "Release-ready final mix",
    ],
    deliverables: ["Stereo mix WAV", "Stems", "Instrumental version", "Project file (on request)"],
    startingAt: "$500",
    tags: ["Full Production", "Arrangement", "Recording", "Master"],
  },
  {
    id: "dj-sets",
    number: "04",
    title: "DJ Sets",
    tagline: "Built for the floor.",
    description:
      "Custom DJ sets crafted for your event, brand, or release campaign. From live performance-ready sets to promotional mixes, we engineer flow, energy curves, and transitions that move crowds.",
    icon: Disc3,
    features: [
      "Custom set curation and programming",
      "Live performance sets",
      "Promotional and promo mixes",
      "Brand / event-specific theming",
      "Seamless transition engineering",
    ],
    deliverables: ["Recorded set (WAV/MP3)", "Tracklist", "Event-ready stems", "Promo artwork"],
    startingAt: "$300",
    tags: ["Live Sets", "Promo Mix", "Events", "Custom"],
  },
  {
    id: "mixing",
    number: "05",
    title: "Mixing",
    tagline: "Clarity meets power.",
    description:
      "Professional mixing that balances every element — frequency carving, dynamic control, spatial placement, and loudness optimisation. We mix to industry standards so your music translates across every speaker and platform.",
    icon: SlidersHorizontal,
    features: [
      "Stem mixing (up to 64 tracks)",
      "Frequency balance and EQ sculpting",
      "Dynamic processing and compression",
      "Stereo imaging and width control",
      "Loudness optimisation for streaming",
    ],
    deliverables: ["Stereo mix WAV (24-bit)", "Alternate versions (clean/radio)", "Mix notes", "2 rounds of revisions"],
    startingAt: "$200",
    tags: ["Stems", "Mastering-ready", "Streaming", "Revisions"],
  },
]

export function StudioServices() {
  const [activeService, setActiveService] = useState<Service | null>(null)

  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-12 bg-primary" />
              <span className="text-primary text-sm font-medium tracking-widest uppercase">Services</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-balance">
              What We Build
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Five distinct services, one unified standard of quality. Click any service to explore details.
          </p>
        </div>

        {/* Service rows — editorial list style */}
        <div className="divide-y divide-primary/10">
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <button
                key={service.id}
                onClick={() => setActiveService(service)}
                className="w-full text-left group py-8 flex items-start gap-6 md:gap-10 hover:bg-card/40 transition-colors px-4 -mx-4 rounded-lg"
              >
                {/* Number */}
                <span className="text-sm font-mono text-muted-foreground mt-1 w-6 flex-shrink-0">
                  {service.number}
                </span>

                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-card chrome-border flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors mt-0.5">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 flex-wrap mb-2">
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <span className="text-muted-foreground text-sm italic">{service.tagline}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base line-clamp-2 max-w-2xl">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {service.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-primary/20 text-muted-foreground group-hover:border-primary/40"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price + arrow */}
                <div className="flex-shrink-0 text-right hidden sm:flex flex-col items-end gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">Starting at</p>
                  <p className="text-2xl font-black text-primary tabular-nums">{service.startingAt}</p>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Service detail drawer */}
      {activeService && (
        <ServiceDetail service={activeService} onClose={() => setActiveService(null)} />
      )}
    </section>
  )
}
