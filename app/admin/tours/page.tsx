"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Ticket,
  Music,
  Navigation,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface Show {
  id: string
  title: string
  venue: string
  city: string
  state: string
  country: string
  date: string
  time: string
  capacity: number
  ticketsSold: number
  ticketPrice: number
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
  description: string
  imageUrl: string
  ticketUrl?: string
}

interface Venue {
  id: string
  name: string
  address: string
  city: string
  state: string
  capacity: number
  contactEmail: string
  contactPhone: string
  notes: string
}

export default function TourManagement() {
  const [shows, setShows] = useState<Show[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    fetchTourData()
  }, [])

  const fetchTourData = async () => {
    try {
      // Fetch shows from API
      const showsResponse = await fetch('/api/tours')
      const showsData = await showsResponse.json()
      if (showsData.success) {
        setShows(showsData.tours || [])
      }

      // Fetch venues from API
      const venuesResponse = await fetch('/api/tours/venues')
      const venuesData = await venuesResponse.json()
      if (venuesData.success) {
        setVenues(venuesData.venues || [])
      }
    } catch (error) {
      console.error('Failed to fetch tour data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const calculateRevenue = (ticketsSold: number, ticketPrice: number) => {
    return ticketsSold * ticketPrice
  }

  const calculateSellThrough = (ticketsSold: number, capacity: number) => {
    return Math.round((ticketsSold / capacity) * 100)
  }

  const filteredShows = shows.filter(show => {
    const matchesSearch = show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || show.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalRevenue = shows.reduce((sum, show) => sum + calculateRevenue(show.ticketsSold, show.ticketPrice), 0)
  const totalTicketsSold = shows.reduce((sum, show) => sum + show.ticketsSold, 0)
  const upcomingShows = shows.filter(show => new Date(show.date) > new Date() && show.status !== 'cancelled').length

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tour data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Tour Management</h1>
          <p className="text-muted-foreground">Manage shows, venues, and bookings</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Show
        </Button>
      </div>

      {/* Tour Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Shows</p>
                <p className="text-2xl font-bold">{upcomingShows}</p>
                <p className="text-xs text-blue-600">Next: {shows.find(s => new Date(s.date) > new Date())?.date}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tickets Sold</p>
                <p className="text-2xl font-bold">{totalTicketsSold.toLocaleString()}</p>
                <p className="text-xs text-green-600">Across all shows</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">From ticket sales</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Sell-Through</p>
                <p className="text-2xl font-bold">
                  {Math.round(shows.reduce((sum, show) => sum + calculateSellThrough(show.ticketsSold, show.capacity), 0) / shows.length)}%
                </p>
                <p className="text-xs text-purple-600">Capacity utilization</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="shows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="shows">Shows</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Shows Tab */}
        <TabsContent value="shows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Show Management</CardTitle>
              <CardDescription>Manage your upcoming and past performances</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search shows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Shows Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Show</TableHead>
                    <TableHead>Venue & Location</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Tickets</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShows.map((show) => {
                    const sellThrough = calculateSellThrough(show.ticketsSold, show.capacity)
                    const revenue = calculateRevenue(show.ticketsSold, show.ticketPrice)

                    return (
                      <TableRow key={show.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={show.imageUrl}
                              alt={show.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium">{show.title}</div>
                              <div className="text-sm text-muted-foreground">
                                ${show.ticketPrice} per ticket
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{show.venue}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {show.city}, {show.state}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{show.date}</div>
                            <div className="text-sm text-muted-foreground">{show.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {show.ticketsSold.toLocaleString()} / {show.capacity.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {sellThrough}% sold
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${revenue.toLocaleString()}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(show.status)} flex items-center gap-1`}>
                            {getStatusIcon(show.status)}
                            {show.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Show
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Ticket className="h-4 w-4 mr-2" />
                                Ticket Sales
                              </DropdownMenuItem>
                              {show.ticketUrl && (
                                <DropdownMenuItem>
                                  <Navigation className="h-4 w-4 mr-2" />
                                  Ticket Link
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Cancel Show
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Venues Tab */}
        <TabsContent value="venues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Venue Management</CardTitle>
              <CardDescription>Manage venue contacts and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {venues.map((venue) => (
                  <div key={venue.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{venue.name}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{venue.address}, {venue.city}, {venue.state}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>Capacity: {venue.capacity.toLocaleString()}</span>
                          </div>
                          <span>Email: {venue.contactEmail}</span>
                          <span>Phone: {venue.contactPhone}</span>
                        </div>
                        {venue.notes && (
                          <p className="text-sm text-muted-foreground">{venue.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Book Show
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tour Calendar</CardTitle>
              <CardDescription>Visual overview of your tour schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                  <p>Interactive calendar component would be integrated here</p>
                  <p className="text-sm">Shows scheduled, venues, and availability at a glance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Venue</CardTitle>
                <CardDescription>Revenue and attendance by venue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {venues.map((venue) => {
                    const venueShows = shows.filter(show => show.venue === venue.name)
                    const totalRevenue = venueShows.reduce((sum, show) =>
                      sum + calculateRevenue(show.ticketsSold, show.ticketPrice), 0)
                    const totalTickets = venueShows.reduce((sum, show) => sum + show.ticketsSold, 0)

                    return (
                      <div key={venue.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{venue.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {venueShows.length} shows • {totalTickets} tickets
                          </p>
                        </div>
                        <p className="font-medium">${totalRevenue.toLocaleString()}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Shows</CardTitle>
                <CardDescription>Shows requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shows
                    .filter(show => new Date(show.date) > new Date())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 5)
                    .map((show) => {
                      const sellThrough = calculateSellThrough(show.ticketsSold, show.capacity)

                      return (
                        <div key={show.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{show.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {show.date} • {show.city}, {show.state}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{sellThrough}% sold</p>
                            <p className="text-sm text-muted-foreground">
                              {show.ticketsSold} / {show.capacity}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
