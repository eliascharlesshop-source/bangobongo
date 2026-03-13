import Link from "next/link"
import { CalendarDays, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TourDate } from "@/types"

interface TourSectionProps {
  tourDates: TourDate[]
}

export default function TourSection({ tourDates }: TourSectionProps) {
  return (
    <section id="tour" className="py-16 bg-background-lighter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Shows</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Catch BangoBongo live in action at these upcoming events. Experience the energy and immerse yourself in
            the music.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {tourDates.map((tour) => (
            <div
              key={tour.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 mb-4 bg-background rounded-lg border border-accent hover:border-primary transition-colors"
            >
              <div className="flex items-start sm:items-center mb-4 sm:mb-0">
                <div className="bg-accent p-3 rounded-lg text-center mr-6 hidden sm:block">
                  <span className="block text-lg font-bold text-primary">{tour.date.split(",")[0]}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{tour.venue}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {tour.city}
                  </div>
                  <div className="sm:hidden text-xs text-muted-foreground mt-1">{tour.date}</div>
                </div>
              </div>
              <Button asChild>
                <Link href={tour.ticketLink}>Get Tickets</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="outline">
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
