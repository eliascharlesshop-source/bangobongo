import Link from "next/link"
import { CalendarDays, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TourDate } from "@/types"

interface TourSectionProps {
  tourDates: TourDate[]
}

export default function TourSection({ tourDates }: TourSectionProps) {
  return (
    <section id="tour" className="py-24 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Live</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Upcoming Shows</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
            Catch BangoBongo live. Experience the energy and immerse yourself in the music.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {tourDates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-20 text-center">
              <p className="text-muted-foreground">No dates announced yet — check back soon.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {tourDates.map((tour) => (
                <li
                  key={tour.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 group"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-sm font-medium text-foreground tabular-nums w-16 shrink-0">
                      {tour.date.split(",")[0]}
                    </span>
                    <div>
                      <h3 className="font-medium text-foreground">{tour.venue}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {tour.city}
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="sm:opacity-70 group-hover:opacity-100">
                    <Link href={tour.ticketLink}>Get Tickets</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="chromeGlass">
            <Link href="/tour">
              <CalendarDays className="h-4 w-4 mr-2" />
              View All Tour Dates
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
