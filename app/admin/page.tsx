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
  Download,
  Brain,
  Shield,
  FileAudio,
  Cloud
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { AudioPlayer, sampleTracks } from "@/components/ui/audio-player"
import { CompleteLiquidGlassCard } from "@/components/ui/liquid-glass-card"
import { FloatingAnimation, PulseAnimation, ParticleAnimation, HoverLiftAnimation } from "@/components/ui/micro-animations"

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
      // Mock data for demonstration
      setStats({
        music: {
          totalTracks: 127,
          distributedTracks: 89,
          totalStreams: 2456789,
          monthlyRevenue: 12456.78
        },
        store: {
          totalProducts: 45,
          totalOrders: 234,
          monthlyRevenue: 8934.21,
          inventoryAlerts: 3
        },
        tours: {
          upcomingShows: 8,
          ticketsSold: 12567,
          totalRevenue: 456789.12
        },
        analytics: {
          websiteVisitors: 45678,
          conversionRate: 3.4,
          topTrack: 'Summer Vibes',
          topProduct: 'Premium T-Shirt'
        }
      })
      
      setRecentActivity([
        {
          id: '1',
          type: 'music',
          title: 'New Track Uploaded',
          description: 'Summer Vibes has been uploaded to all platforms',
          timestamp: '2 hours ago',
          status: 'success'
        },
        {
          id: '2',
          type: 'order',
          title: 'Bulk Order Received',
          description: '50 Premium T-shirts ordered from corporate client',
          timestamp: '5 hours ago',
          status: 'success'
        },
        {
          id: '3',
          type: 'tour',
          title: 'Show Added',
          description: 'New date added to Summer Tour 2024',
          timestamp: '1 day ago',
          status: 'pending'
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
      case 'success': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'warning': return 'text-orange-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <ParticleAnimation count={20} particleSize="small" color="purple" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Particles */}
      <ParticleAnimation count={30} particleSize="small" color="purple" />
      
      {/* Header */}
      <div className="border-b bg-white/5 backdrop-blur-xl supports-[backdrop-filter]:bg-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="text-purple-400">BangoBongo</span> Admin
              </h1>
              <p className="text-purple-200">Control panel for your music platform</p>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <Button variant="outline" onClick={() => router.push('/')} className="border-white/20 text-white hover:bg-white/10">
                <Globe className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <HoverLiftAnimation>
            <CompleteLiquidGlassCard 
              intensity="medium" 
              animated={true}
              glowColor="purple"
              className="group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-200">Total Streams</p>
                    <p className="text-2xl font-bold text-white">{stats?.music.totalStreams.toLocaleString()}</p>
                    <p className="text-xs text-green-400">+12% from last month</p>
                  </div>
                  <FloatingAnimation duration={3} intensity="low">
                    <div className="bg-purple-600/20 p-3 rounded-full backdrop-blur-sm">
                      <Play className="h-6 w-6 text-purple-400" />
                    </div>
                  </FloatingAnimation>
                </div>
              </CardContent>
            </CompleteLiquidGlassCard>
          </HoverLiftAnimation>

          <HoverLiftAnimation>
            <CompleteLiquidGlassCard 
              intensity="medium" 
              animated={true}
              glowColor="green"
              className="group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-200">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-white">${((stats?.music.monthlyRevenue || 0) + (stats?.store.monthlyRevenue || 0)).toFixed(2)}</p>
                    <p className="text-xs text-green-400">+8% from last month</p>
                  </div>
                  <PulseAnimation duration={2}>
                    <div className="bg-green-600/20 p-3 rounded-full backdrop-blur-sm">
                      <DollarSign className="h-6 w-6 text-green-400" />
                    </div>
                  </PulseAnimation>
                </div>
              </CardContent>
            </CompleteLiquidGlassCard>
          </HoverLiftAnimation>

          <HoverLiftAnimation>
            <CompleteLiquidGlassCard 
              intensity="medium" 
              animated={true}
              glowColor="blue"
              className="group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-200">Store Orders</p>
                    <p className="text-2xl font-bold text-white">{stats?.store.totalOrders}</p>
                    <p className="text-xs text-green-400">+15% from last month</p>
                  </div>
                  <FloatingAnimation duration={4} intensity="low">
                    <div className="bg-blue-600/20 p-3 rounded-full backdrop-blur-sm">
                      <ShoppingBag className="h-6 w-6 text-blue-400" />
                    </div>
                  </FloatingAnimation>
                </div>
              </CardContent>
            </CompleteLiquidGlassCard>
          </HoverLiftAnimation>

          <HoverLiftAnimation>
            <CompleteLiquidGlassCard 
              intensity="medium" 
              animated={true}
              glowColor="orange"
              className="group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-200">Upcoming Shows</p>
                    <p className="text-2xl font-bold text-white">{stats?.tours.upcomingShows}</p>
                    <p className="text-xs text-blue-400">{stats?.tours.ticketsSold} tickets sold</p>
                  </div>
                  <PulseAnimation duration={2.5}>
                    <div className="bg-orange-600/20 p-3 rounded-full backdrop-blur-sm">
                      <Calendar className="h-6 w-6 text-orange-400" />
                    </div>
                  </PulseAnimation>
                </div>
              </CardContent>
            </CompleteLiquidGlassCard>
          </HoverLiftAnimation>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Quick Actions & Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <CompleteLiquidGlassCard 
              intensity="medium" 
              animated={true}
              glowColor="purple"
              title="Quick Actions"
              description="Common management tasks"
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button asChild className="h-20 flex-col gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Link href="/admin/dashboard">
                    <Music className="h-6 w-6" />
                    <span>Music Gen</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2 border-white/20 text-white hover:bg-white/10">
                  <Link href="/admin/collaboration">
                    <Users className="h-6 w-6" />
                    <span>Collaborate</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2 border-white/20 text-white hover:bg-white/10">
                  <Link href="/admin/ai-analysis">
                    <Brain className="h-6 w-6" />
                    <span>AI Analysis</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2 border-white/20 text-white hover:bg-white/10">
                  <Link href="/admin/security-monitoring">
                    <Shield className="h-6 w-6" />
                    <span>Security</span>
                  </Link>
                </Button>
              </div>
            </CompleteLiquidGlassCard>

            {/* Recent Activity */}
            <CompleteLiquidGlassCard 
              intensity="medium" 
              animated={true}
              glowColor="blue"
              title="Recent Activity"
              description="Latest platform activity and updates"
            >
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300">
                    <div className={`p-2 rounded-full bg-white/10 ${getStatusColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{activity.title}</h4>
                      <p className="text-sm text-purple-200">{activity.description}</p>
                      <p className="text-xs text-purple-300 mt-1">{activity.timestamp}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {activity.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                      {activity.status === 'pending' && <Clock className="h-4 w-4 text-yellow-400" />}
                      {activity.status === 'warning' && <AlertCircle className="h-4 w-4 text-orange-400" />}
                      {activity.status === 'error' && <AlertCircle className="h-4 w-4 text-red-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </CompleteLiquidGlassCard>

            {/* Audio Player */}
            <CompleteLiquidGlassCard 
              intensity="high" 
              animated={true}
              glowColor="purple"
              title="Featured Track"
              description="Listen to your latest creation"
            >
              <AudioPlayer tracks={sampleTracks} />
            </CompleteLiquidGlassCard>
          </div>

          {/* Right Column - Management Sections */}
          <div className="space-y-6">
            {/* Music Management */}
            <CompleteLiquidGlassCard 
              intensity="medium" 
              animated={true}
              glowColor="purple"
              title="Music Library"
              description="Track distribution and performance"
            >
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Distribution Progress</span>
                  <span className="text-white">{stats?.music.distributedTracks}/{stats?.music.totalTracks}</span>
                </div>
                <Progress value={(stats?.music.distributedTracks || 0) / (stats?.music.totalTracks || 1) * 100} className="bg-white/20" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-200 text-sm">Total Tracks</span>
                    <span className="text-white text-sm font-medium">{stats?.music.totalTracks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200 text-sm">Distributed</span>
                    <span className="text-white text-sm font-medium">{stats?.music.distributedTracks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200 text-sm">Monthly Revenue</span>
                    <span className="text-white text-sm font-medium">${stats?.music.monthlyRevenue}</span>
                  </div>
                </div>
              </div>
            </CompleteLiquidGlassCard>

            {/* Store Management */}
            <CompleteLiquidGlassCard 
              intensity="medium" 
              animated={true}
              glowColor="green"
              title="Store Performance"
              description="Products, orders and revenue"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-200 text-sm">Products</span>
                    <span className="text-white text-sm font-medium">{stats?.store.totalProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200 text-sm">Orders</span>
                    <span className="text-white text-sm font-medium">{stats?.store.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200 text-sm">Revenue</span>
                    <span className="text-white text-sm font-medium">${stats?.store.monthlyRevenue}</span>
                  </div>
                  {stats?.store.inventoryAlerts && stats.store.inventoryAlerts > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200 text-sm">Inventory Alerts</span>
                      <Badge variant="destructive" className="bg-red-600/20 text-red-400 border-red-600/50">{stats.store.inventoryAlerts}</Badge>
                    </div>
                  )}
                </div>
              </div>
            </CompleteLiquidGlassCard>

            {/* Tours Management */}
            <CompleteLiquidGlassCard 
              intensity="medium" 
              animated={true}
              glowColor="orange"
              title="Tour Management"
              description="Shows, venues and ticket sales"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-200 text-sm">Upcoming Shows</span>
                    <span className="text-white text-sm font-medium">{stats?.tours.upcomingShows}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200 text-sm">Tickets Sold</span>
                    <span className="text-white text-sm font-medium">{stats?.tours.ticketsSold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200 text-sm">Revenue</span>
                    <span className="text-white text-sm font-medium">${stats?.tours.totalRevenue}</span>
                  </div>
                </div>
              </div>
            </CompleteLiquidGlassCard>
          </div>
        </div>

        {/* Enhanced Navigation Grid */}
        <CompleteLiquidGlassCard 
          intensity="high" 
          animated={true}
          glowColor="purple"
          title="Platform Management"
          description="Access all administrative features"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <HoverLiftAnimation>
              <Button asChild variant="outline" className="h-24 flex-col gap-3 border-white/20 text-white hover:bg-white/10 group">
                <Link href="/admin/dashboard">
                  <Music className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <div className="text-center">
                    <div className="font-medium">Music Dashboard</div>
                    <div className="text-xs text-purple-200">Generate & manage music</div>
                  </div>
                </Link>
              </Button>
            </HoverLiftAnimation>

            <HoverLiftAnimation>
              <Button asChild variant="outline" className="h-24 flex-col gap-3 border-white/20 text-white hover:bg-white/10 group">
                <Link href="/admin/users">
                  <Users className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <div className="text-center">
                    <div className="font-medium">User Management</div>
                    <div className="text-xs text-purple-200">Customers & accounts</div>
                  </div>
                </Link>
              </Button>
            </HoverLiftAnimation>

            <HoverLiftAnimation>
              <Button asChild variant="outline" className="h-24 flex-col gap-3 border-white/20 text-white hover:bg-white/10 group">
                <Link href="/admin/collaboration">
                  <Users className="h-8 w-8 text-green-400 group-hover:text-green-300 transition-colors" />
                  <div className="text-center">
                    <div className="font-medium">Collaboration</div>
                    <div className="text-xs text-purple-200">Real-time music creation</div>
                  </div>
                </Link>
              </Button>
            </HoverLiftAnimation>

            <HoverLiftAnimation>
              <Button asChild variant="outline" className="h-24 flex-col gap-3 border-white/20 text-white hover:bg-white/10 group">
                <Link href="/admin/ai-analysis">
                  <Brain className="h-8 w-8 text-orange-400 group-hover:text-orange-300 transition-colors" />
                  <div className="text-center">
                    <div className="font-medium">AI Analysis</div>
                    <div className="text-xs text-purple-200">Music insights & trends</div>
                  </div>
                </Link>
              </Button>
            </HoverLiftAnimation>

            <HoverLiftAnimation>
              <Button asChild variant="outline" className="h-24 flex-col gap-3 border-white/20 text-white hover:bg-white/10 group">
                <Link href="/admin/file-upload">
                  <FileAudio className="h-8 w-8 text-pink-400 group-hover:text-pink-300 transition-colors" />
                  <div className="text-center">
                    <div className="font-medium">Audio Upload</div>
                    <div className="text-xs text-purple-200">Processing & management</div>
                  </div>
                </Link>
              </Button>
            </HoverLiftAnimation>

            <HoverLiftAnimation>
              <Button asChild variant="outline" className="h-24 flex-col gap-3 border-white/20 text-white hover:bg-white/10 group">
                <Link href="/admin/security-monitoring">
                  <Shield className="h-8 w-8 text-red-400 group-hover:text-red-300 transition-colors" />
                  <div className="text-center">
                    <div className="font-medium">Security</div>
                    <div className="text-xs text-purple-200">Monitoring & alerts</div>
                  </div>
                </Link>
              </Button>
            </HoverLiftAnimation>

            <HoverLiftAnimation>
              <Button asChild variant="outline" className="h-24 flex-col gap-3 border-white/20 text-white hover:bg-white/10 group">
                <Link href="/admin/templates">
                  <Cloud className="h-8 w-8 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                  <div className="text-center">
                    <div className="font-medium">Templates</div>
                    <div className="text-xs text-purple-200">Music presets & library</div>
                  </div>
                </Link>
              </Button>
            </HoverLiftAnimation>

            <HoverLiftAnimation>
              <Button asChild variant="outline" className="h-24 flex-col gap-3 border-white/20 text-white hover:bg-white/10 group">
                <Link href="/admin/analytics">
                  <BarChart3 className="h-8 w-8 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                  <div className="text-center">
                    <div className="font-medium">Analytics</div>
                    <div className="text-xs text-purple-200">Performance & insights</div>
                  </div>
                </Link>
              </Button>
            </HoverLiftAnimation>
          </div>
        </CompleteLiquidGlassCard>
      </div>
    </div>
  )
}
