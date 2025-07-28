"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Music, 
  ShoppingBag, 
  Calendar,
  Users,
  Settings,
  BarChart3,
  Package,
  CreditCard,
  Globe,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Play,
  Download
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DashboardStats {
  music: {
    totalTracks: number
    distributedTracks: number
    totalStreams: number
    monthlyRevenue: number
  }
  store: {
    totalProducts: number
    totalOrders: number
    monthlyRevenue: number
    inventoryAlerts: number
  }
  tours: {
    upcomingShows: number
    ticketsSold: number
    totalRevenue: number
  }
  analytics: {
    websiteVisitors: number
    conversionRate: number
    topTrack: string
    topProduct: string
  }
}

interface RecentActivity {
  id: string
  type: 'music' | 'order' | 'tour' | 'user'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'pending' | 'warning' | 'error'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls - replace with actual API endpoints
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        music: {
          totalTracks: 24,
          distributedTracks: 18,
          totalStreams: 125420,
          monthlyRevenue: 1234.56
        },
        store: {
          totalProducts: 12,
          totalOrders: 89,
          monthlyRevenue: 2845.50,
          inventoryAlerts: 3
        },
        tours: {
          upcomingShows: 8,
          ticketsSold: 1250,
          totalRevenue: 18500.00
        },
        analytics: {
          websiteVisitors: 8420,
          conversionRate: 2.4,
          topTrack: "Digital Dreams",
          topProduct: "BangoBongo Hoodie"
        }
      })

      setRecentActivity([
        {
          id: '1',
          type: 'music',
          title: 'New track uploaded',
          description: '"Midnight Pulse" uploaded and queued for distribution',
          timestamp: '2 hours ago',
          status: 'success'
        },
        {
          id: '2',
          type: 'order',
          title: 'New merchandise order',
          description: 'Order #1234 - BangoBongo T-Shirt x2',
          timestamp: '4 hours ago',
          status: 'pending'
        },
        {
          id: '3',
          type: 'tour',
          title: 'Venue confirmed',
          description: 'Echo Arena - Los Angeles show confirmed',
          timestamp: '1 day ago',
          status: 'success'
        },
        {
          id: '4',
          type: 'music',
          title: 'Distribution complete',
          description: '"Electronic Dreams" now live on all platforms',
          timestamp: '2 days ago',
          status: 'success'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'music': return <Music className="h-4 w-4" />
      case 'order': return <ShoppingBag className="h-4 w-4" />
      case 'tour': return <Calendar className="h-4 w-4" />
      case 'user': return <Users className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500'
      case 'pending': return 'text-yellow-500'
      case 'warning': return 'text-orange-500'
      case 'error': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                <span className="text-primary">BangoBongo</span> Admin
              </h1>
              <p className="text-muted-foreground">Control panel for your music platform</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/')}>
                <Globe className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Streams</p>
                  <p className="text-2xl font-bold">{stats?.music.totalStreams.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+12% from last month</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Play className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold">${((stats?.music.monthlyRevenue || 0) + (stats?.store.monthlyRevenue || 0)).toFixed(2)}</p>
                  <p className="text-xs text-green-600">+8% from last month</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Store Orders</p>
                  <p className="text-2xl font-bold">{stats?.store.totalOrders}</p>
                  <p className="text-xs text-green-600">+15% from last month</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Shows</p>
                  <p className="text-2xl font-bold">{stats?.tours.upcomingShows}</p>
                  <p className="text-xs text-blue-600">{stats?.tours.ticketsSold} tickets sold</p>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Quick Actions & Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Button asChild className="h-20 flex-col gap-2">
                    <Link href="/admin/music">
                      <Music className="h-6 w-6" />
                      <span>Upload Track</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2">
                    <Link href="/admin/store">
                      <Package className="h-6 w-6" />
                      <span>Add Product</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2">
                    <Link href="/admin/tours">
                      <Calendar className="h-6 w-6" />
                      <span>Schedule Show</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2">
                    <Link href="/admin/analytics">
                      <BarChart3 className="h-6 w-6" />
                      <span>View Analytics</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activity and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className={`p-2 rounded-full bg-muted ${getStatusColor(activity.status)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {activity.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {activity.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                        {activity.status === 'warning' && <AlertCircle className="h-4 w-4 text-orange-500" />}
                        {activity.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Management Sections */}
          <div className="space-y-6">
            {/* Music Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Music Library
                  </span>
                  <Button asChild size="sm">
                    <Link href="/admin/music">Manage</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Distribution Progress</span>
                  <span>{stats?.music.distributedTracks}/{stats?.music.totalTracks}</span>
                </div>
                <Progress value={(stats?.music.distributedTracks || 0) / (stats?.music.totalTracks || 1) * 100} />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Tracks</span>
                    <span className="text-sm font-medium">{stats?.music.totalTracks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Distributed</span>
                    <span className="text-sm font-medium">{stats?.music.distributedTracks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                    <span className="text-sm font-medium">${stats?.music.monthlyRevenue}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Store
                  </span>
                  <Button asChild size="sm">
                    <Link href="/admin/store">Manage</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Products</span>
                    <span className="text-sm font-medium">{stats?.store.totalProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Orders</span>
                    <span className="text-sm font-medium">{stats?.store.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="text-sm font-medium">${stats?.store.monthlyRevenue}</span>
                  </div>
                  {stats?.store.inventoryAlerts && stats.store.inventoryAlerts > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Inventory Alerts</span>
                      <Badge variant="destructive">{stats.store.inventoryAlerts}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tours Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Tours
                  </span>
                  <Button asChild size="sm">
                    <Link href="/admin/tours">Manage</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Upcoming Shows</span>
                    <span className="text-sm font-medium">{stats?.tours.upcomingShows}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tickets Sold</span>
                    <span className="text-sm font-medium">{stats?.tours.ticketsSold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="text-sm font-medium">${stats?.tours.totalRevenue}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Management</CardTitle>
            <CardDescription>Access all administrative features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button asChild variant="outline" className="h-24 flex-col gap-3">
                <Link href="/admin/music">
                  <Music className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <div className="font-medium">Music Management</div>
                    <div className="text-xs text-muted-foreground">Upload, distribute & licensing</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-24 flex-col gap-3">
                <Link href="/admin/store">
                  <ShoppingBag className="h-8 w-8 text-blue-600" />
                  <div className="text-center">
                    <div className="font-medium">Store Management</div>
                    <div className="text-xs text-muted-foreground">Products, orders & inventory</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-24 flex-col gap-3">
                <Link href="/admin/tours">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div className="text-center">
                    <div className="font-medium">Tour Management</div>
                    <div className="text-xs text-muted-foreground">Shows, venues & bookings</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-24 flex-col gap-3">
                <Link href="/admin/users">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="text-center">
                    <div className="font-medium">User Management</div>
                    <div className="text-xs text-muted-foreground">Customers & accounts</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-24 flex-col gap-3">
                <Link href="/admin/analytics">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                  <div className="text-center">
                    <div className="font-medium">Analytics</div>
                    <div className="text-xs text-muted-foreground">Performance & insights</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-24 flex-col gap-3">
                <Link href="/admin/payments">
                  <CreditCard className="h-8 w-8 text-yellow-600" />
                  <div className="text-center">
                    <div className="font-medium">Payments</div>
                    <div className="text-xs text-muted-foreground">Transactions & billing</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-24 flex-col gap-3">
                <Link href="/admin/licensing">
                  <Package className="h-8 w-8 text-indigo-600" />
                  <div className="text-center">
                    <div className="font-medium">Licensing</div>
                    <div className="text-xs text-muted-foreground">Beat licenses & contracts</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-24 flex-col gap-3">
                <Link href="/admin/settings">
                  <Settings className="h-8 w-8 text-gray-600" />
                  <div className="text-center">
                    <div className="font-medium">Settings</div>
                    <div className="text-xs text-muted-foreground">Configuration & preferences</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
