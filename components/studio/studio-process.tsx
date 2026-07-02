"use client"

import { MessageSquare, Pencil, Headphones, Send } from "lucide-react"

const STEPS = [
  {
    icon: MessageSquare,
    step: "1",
    title: "Consult",
    description:
      "We start with a brief — your vision, references, and goals. No forms, no friction. Just a direct conversation about your project.",
  },
  {
    icon: Pencil,
    step: "2",
    title: "Create",
    description:
      "We get to work in the studio. Whether that is writing, producing, mixing, or all three — you receive updates throughout the process.",
  },
  {
    icon: Headphones,
    step: "3",
    title: "Refine",
    description:
      "Review, feedback, revisions. Every service includes revision rounds so the final product is exactly what you heard in your head.",
  },
  {
    icon: Send,
    step: "4",
    title: "Deliver",
    description:
      "Files delivered in your required formats — WAV, MP3, stems, project files. Ready to upload, perform, or press.",
  },
]

export function StudioProcess() {
  return (
    <section className="py-24 border-t border-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — heading */}
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-primary" />
              <span className="text-primary text-sm font-medium tracking-widest uppercase">Process</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-balance mb-6">
              How It Works
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              A streamlined four-step process built around clear communication and
              professional output — from first message to final file.
            </p>
          </div>

          {/* Right — steps */}
          <div className="space-y-0 divide-y divide-primary/10">
            {STEPS.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="py-8 flex gap-6 group">
                  {/* Step number + icon */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-card chrome-border flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{step.step}</span>
                  </div>

                  {/* Content */}
                  <div className="pt-1">
                    <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
