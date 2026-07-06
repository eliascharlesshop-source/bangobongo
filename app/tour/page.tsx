"use client"

import { ExternalLink, Briefcase, ChevronRight, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TourPage() {
  return (
    <div className="min-h-screen">

      {/* DJ Sessions Section */}
      <section className="py-16 sm:py-20 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Live Sessions</p>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance mb-4">
              DJ Sessions
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Catch live DJ sets and mixing sessions on TikTok. Follow{" "}
              <a
                href="https://tiktok.com/@bangobongo.pulse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium hover:text-primary transition-colors"
              >
                @bangobongo.pulse
              </a>{" "}
              for real-time performances, behind-the-scenes content, and interactive production sessions.
            </p>
          </div>

          {/* No live sessions state */}
          <div className="border border-dashed border-border rounded-2xl py-20 sm:py-28 flex flex-col items-center justify-center text-center px-6">
            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-6">
              <Radio className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No live sessions yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-8">
              Sessions will appear here when they go live. Follow on TikTok to get notified first.
            </p>
            <Button size="sm" asChild>
              <a
                href="https://tiktok.com/@bangobongo.pulse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Follow @bangobongo.pulse
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Hire a DJ Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Bookings</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance mb-4">
              Hire a Remote DJ
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Professional DJ services for online events, live streaming sessions, and virtual performances.
              Custom packages and longer-term bookings available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* What we offer */}
            <div className="border border-border rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium text-foreground">What We Offer</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Professional DJ sets for online events",
                  "Live streaming production support",
                  "Custom music mixing for your event",
                  "Technical setup and sound engineering",
                  "Flexible scheduling and genres",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <ChevronRight className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing */}
            <div className="border border-border rounded-2xl p-6 sm:p-8">
              <h3 className="font-medium text-foreground mb-6">Pricing</h3>
              <div className="space-y-4 mb-6">
                <div className="border border-border rounded-xl p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Standard</p>
                  <p className="text-3xl font-semibold text-foreground">$100</p>
                  <p className="text-sm text-muted-foreground mt-1">per hour</p>
                </div>
                <div className="border border-border rounded-xl p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Premium Performance</p>
                  <p className="text-3xl font-semibold text-foreground">$5,000</p>
                  <p className="text-sm text-muted-foreground mt-1">per performance</p>
                </div>
              </div>
              <ul className="space-y-2">
                {[
                  "Minimum 1 hour booking",
                  "Package discounts available",
                  "All equipment included",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ChevronRight className="h-3 w-3 text-foreground shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" asChild>
              <a href="mailto:bangobongo.ece@gmail.com?subject=DJ Booking Inquiry">
                Book a DJ
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:bangobongo.ece@gmail.com?subject=DJ Rates Question">
                Ask About Rates
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Contact us with your event details for custom quotes and availability.
          </p>
        </div>
      </section>
    </div>
  )
}
