"use client"

import Link from "next/link"
import {
  Play,
  ExternalLink,
  Briefcase,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TourPage() {
  return (
    <div className="min-h-screen">

      {/* TikTok Live Sessions Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">TikTok DJ Sessions</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can't make it to a live event? Join us for exclusive DJ sessions and mixing tutorials on TikTok. Follow <span className="font-semibold text-primary">@bangobongo.ece</span> for behind-the-scenes content, real-time performances, and interactive music production sessions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* TikTok Live Session Cards */}
              {[
                {
                  id: 1,
                  title: "Summer Vibes Mix",
                  date: "Jun 15, 2024",
                  duration: "45 mins",
                  views: "12.5K",
                  thumbnail: "/images/tiktok/session-1.png"
                },
                {
                  id: 2,
                  title: "Mixing Masterclass",
                  date: "Jun 12, 2024",
                  duration: "58 mins",
                  views: "8.3K",
                  thumbnail: "/images/tiktok/session-2.png"
                },
                {
                  id: 3,
                  title: "Live Production Session",
                  date: "Jun 10, 2024",
                  duration: "62 mins",
                  views: "15.1K",
                  thumbnail: "/images/tiktok/session-3.png"
                },
                {
                  id: 4,
                  title: "Tech House Exploration",
                  date: "Jun 8, 2024",
                  duration: "52 mins",
                  views: "9.7K",
                  thumbnail: "/images/tiktok/session-4.png"
                },
                {
                  id: 5,
                  title: "Equipment Setup Guide",
                  date: "Jun 5, 2024",
                  duration: "35 mins",
                  views: "11.2K",
                  thumbnail: "/images/tiktok/session-5.png"
                },
                {
                  id: 6,
                  title: "Frequency Mastering Tips",
                  date: "Jun 1, 2024",
                  duration: "48 mins",
                  views: "13.8K",
                  thumbnail: "/images/tiktok/session-6.png"
                }
              ].map((session) => (
                <a
                  key={session.id}
                  href={`https://tiktok.com/@bangobongo.ece`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-background rounded-lg overflow-hidden border border-accent hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="relative h-40 bg-accent flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80">
                      <Play className="h-12 w-12 text-primary" />
                    </div>
                    <span className="absolute top-3 right-3 bg-background/90 px-2 py-1 rounded text-xs font-semibold text-foreground">
                      {session.duration}
                    </span>
                  </div>

                  <div className="p-4">
                    <h4 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {session.title}
                    </h4>
                    <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-4">
                      <span>{session.date}</span>
                      <span>👀 {session.views}</span>
                    </div>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Watch on TikTok
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" asChild>
                <a href="https://tiktok.com/@bangobongo.ece" target="_blank" rel="noopener noreferrer">
                  <Play className="h-4 w-4 mr-2" />
                  Follow @bangobongo.ece
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* DJ Hiring Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-accent overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <Briefcase className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-3">Hire a Remote DJ</h2>
                  <p className="text-lg text-muted-foreground">
                    Looking for professional DJ services for your event? BangoBongo and our network of talented remote DJs are available for online performances, live streaming sessions, and virtual events.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-8">
                <div className="bg-background rounded-lg p-6 border border-accent">
                  <h3 className="text-xl font-semibold text-foreground mb-3">What We Offer</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Professional DJ sets for online events</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Live streaming production support</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Custom music mixing for your event</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Technical setup and sound engineering</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Flexible scheduling and genres</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-background rounded-lg p-6 border border-accent">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Pricing</h3>
                  <div className="space-y-4 mb-4">
                    <div className="bg-accent/30 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Standard DJ Services</div>
                      <div className="text-3xl font-bold text-primary mb-1">$100</div>
                      <div className="text-sm text-muted-foreground">per hour</div>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
                      <div className="text-sm text-muted-foreground mb-1">Premium Performance Package</div>
                      <div className="text-3xl font-bold text-primary mb-1">$5,000</div>
                      <div className="text-sm text-muted-foreground">per performance</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Rate is for remote DJ services. Custom packages and longer-term bookings available at discounted rates.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-primary mr-2" />
                      <span className="text-foreground">Minimum 1 hour booking</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-primary mr-2" />
                      <span className="text-foreground">Package discounts available</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-primary mr-2" />
                      <span className="text-foreground">All equipment included</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-background hover:bg-secondary" asChild>
                  <a href="https://tiktok.com/@bangobongo.ece" target="_blank" rel="noopener noreferrer">
                    Book a DJ - Message on TikTok
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/studio/cart">
                    Add to Cart
                  </Link>
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Message us on TikTok @bangobongo.ece to book a DJ session, or add to cart to get started with checkout.
              </p>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}
