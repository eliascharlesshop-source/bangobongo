"use client"

import { useEffect } from "react"
import { X, CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Service } from "./studio-services"

interface ServiceDetailProps {
  service: Service
  onClose: () => void
}

export function ServiceDetail({ service, onClose }: ServiceDetailProps) {
  const Icon = service.icon

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${service.title} service details`}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-[#1A2A37] border-l border-primary/15 overflow-y-auto flex flex-col shadow-2xl"
        style={{ boxShadow: "-20px 0 80px rgba(113,238,151,0.06)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10 sticky top-0 bg-[#1A2A37] z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 chrome-border flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-mono">{service.number}</p>
              <h2 className="font-black text-lg leading-none">{service.title}</h2>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 space-y-8">
          {/* Tagline + description */}
          <div>
            <p className="text-primary font-semibold italic mb-3">{service.tagline}</p>
            <p className="text-muted-foreground leading-relaxed">{service.description}</p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
              What&apos;s Included
            </h3>
            <ul className="space-y-3">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/90 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverables */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
              Deliverables
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.deliverables.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 bg-card chrome-border rounded-lg px-3 py-2"
                >
                  <Package className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="text-xs text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-primary/20 text-muted-foreground text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-6 border-t border-primary/10 bg-gradient-to-r from-[#1A2A37] to-[#141D27] sticky bottom-0 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Starting at</p>
              <p className="text-3xl font-black chrome-text-mint">{service.startingAt}</p>
            </div>
            <p className="text-xs text-muted-foreground text-right max-w-[160px]">
              Custom quotes available for larger projects
            </p>
          </div>
          <Button
            variant="chrome"
            size="lg"
            asChild
          >
            <a href="mailto:studio@bangobongo.com">
              Book {service.title} Session
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Response within 24 hours
          </p>
        </div>
      </aside>
    </>
  )
}
