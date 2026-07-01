"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SERVICES } from "./studio-services"

export function StudioCTA() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder — wire to your backend / email service
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 border-t border-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — copy */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-primary" />
              <span className="text-primary text-sm font-medium tracking-widest uppercase">Book a Session</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-balance mb-6">
              Let&apos;s Make
              <br />
              <span className="chrome-text-mint">Something.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-md">
              Fill in the form and we will get back to you within 24 hours with
              availability, rates, and next steps. Remote and in-person sessions
              available.
            </p>

            {/* Trust signals */}
            <ul className="space-y-3">
              {[
                "Response within 24 hours",
                "Remote sessions worldwide",
                "Custom bundles available",
                "Revisions included in every service",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="chrome-glass rounded-2xl p-8 backdrop-blur-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black">Message Sent</h3>
                <p className="text-muted-foreground max-w-xs">
                  Thanks — we will be in touch within 24 hours to discuss your project.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-primary/30 hover:border-primary"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="studio-name" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </label>
                    <Input
                      id="studio-name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="studio-email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Email
                    </label>
                    <Input
                      id="studio-email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="studio-service" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Service
                  </label>
                  <Select
                    value={form.service}
                    onValueChange={(v) => setForm((f) => ({ ...f, service: v }))}
                    required
                  >
                    <SelectTrigger id="studio-service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="bundle">Bundle / Multiple Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="studio-message" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Project Brief
                  </label>
                  <Textarea
                    id="studio-message"
                    placeholder="Tell us about your project — genre, vibe, references, timeline..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="chrome"
                  size="lg"
                  className="w-full font-semibold"
                >
                  Send Enquiry
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Or email us directly at{" "}
                  <a
                    href="mailto:studio@bangobongo.com"
                    className="text-primary hover:underline"
                  >
                    studio@bangobongo.com
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
