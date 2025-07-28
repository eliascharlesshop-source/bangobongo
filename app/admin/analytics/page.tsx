"use client"

import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Music, 
  ShoppingBag, 
  Calendar,
  Globe,
  Play,
  Download,
  Heart,
  Share2,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Headphones,
  Radio,
  Target,
  Zap,
  Star,
  MessageSquare,
  ThumbsUp,
  FileText,
  CreditCard,
  ShoppingCart,
  UserPlus,
  TrendingDown as TrendingDownIcon
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface AnalyticsData {
  overview: {
    totalRevenue: number
    revenueChange: number
    totalStreams: number
    streamsChange: number
    totalFans: number
    fansChange: number
    conversionRate: number
    conversionChange: number
    avgOrderValue: number
    customerLifetimeValue: number
    churnRate: number
    monthlyActiveUsers: number
  }
  music: {
    topTracks: Array<{
      id: string
      title: string
      streams: number
      revenue: number
      change: number
      likes: number
      shares: number
      skips: number
      completionRate: number
    }>
    platforms: Array<{
      name: string
      streams: number
      revenue: number
      percentage: number
      growth: number
    }>
    demographics: {
      ageGroups: Array<{ range: string; percentage: number; growth: number }>
      countries: Array<{ name: string; percentage: number; streams: number }>
      genres: Array<{ name: string; percentage: number; trend: string }>
    }
    engagement: {
      totalLikes: number
      totalShares: number
      totalComments: number
      avgListeningTime: string
      peakListeningHours: Array<{ hour: number; streams: number }>
      deviceBreakdown: Array<{ device: string; percentage: number }>
    }
    royalties: {
      totalEarnings: number
      pendingPayouts: number
      avgRoyaltyPerStream: number
      topEarningTracks: Array<{ title: string; earnings: number }>
    }
  }
  store: {
    topProducts: Array<{
      id: string
      name: string
      sales: number
      revenue: number
      change: number
      inventory: number
      margin: number
    }>
    categories: Array<{
      name: string
      sales: number
      revenue: number
      percentage: number
      growth: number
    }>
    performance: {
      cartAbandonmentRate: number
      avgOrderValue: number
      returnRate: number
      customerSatisfaction: number
      inventoryTurnover: number
    }
    shipping: {
      avgDeliveryTime: string
      shippingCosts: number
      internationalOrders: number
      returnedPackages: number
    }
  }
  tours: {
    upcomingShows: number
    totalRevenue: number
    ticketsSold: number
    avgAttendance: number
    totalCapacity: number
    merchandiseSales: number
    topVenues: Array<{
      name: string
      shows: number
      revenue: number
      avgSellThrough: number
      capacity: number
      city: string
    }>
    fanEngagement: {
      meetAndGreets: number
      vipPackages: number
      socialMentions: number
      fanClubMembers: number
    }
  }
  website: {
    visitors: number
    pageViews: number
    bounceRate: number
    avgSessionDuration: string
    mobileTraffic: number
    organicTraffic: number
    topPages: Array<{
      path: string
      views: number
      change: number
      avgTimeOnPage: string
      bounceRate: number
    }>
    socialMedia: {
      totalFollowers: number
      engagement: number
      reachGrowth: number
      topPosts: Array<{ platform: string; engagement: number; reach: number }>
    }
    conversion: {
      signupRate: number
      purchaseRate: number
      newsletterSignups: number
      downloadRate: number
    }
  }
  financial: {
    monthlyRecurringRevenue: number
    customerAcquisitionCost: number
    grossMargin: number
    netProfitMargin: number
    cashFlow: number
    outstandingPayments: number
    revenueBySource: Array<{ source: string; amount: number; percentage: number }>
    expenses: Array<{ category: string; amount: number; change: number }>
  }
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      // Simulate API call - replace with actual analytics API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setData({
        overview: {
          totalRevenue: 8750.25,
          revenueChange: 12.5,
          totalStreams: 245800,
          streamsChange: 18.2,
          totalFans: 12450,
          fansChange: 8.7,
          conversionRate: 2.4,
          conversionChange: -0.3,
          avgOrderValue: 67.50,
          customerLifetimeValue: 245.80,
          churnRate: 5.2,
          monthlyActiveUsers: 8420
        },
        music: {
          topTracks: [
            { id: '1', title: 'Digital Dreams', streams: 45800, revenue: 1250.50, change: 15.2, likes: 3420, shares: 890, skips: 12.5, completionRate: 87.3 },
            { id: '2', title: 'Midnight Pulse', streams: 38200, revenue: 980.75, change: 22.1, likes: 2890, shares: 650, skips: 8.2, completionRate: 91.8 },
            { id: '3', title: 'Neon Nights', streams: 32100, revenue: 850.25, change: -5.8, likes: 2100, shares: 420, skips: 15.1, completionRate: 84.9 },
            { id: '4', title: 'Cyber Love', streams: 28900, revenue: 720.80, change: 8.3, likes: 1850, shares: 380, skips: 10.7, completionRate: 89.3 },
            { id: '5', title: 'Electric Soul', streams: 25600, revenue: 650.40, change: 12.7, likes: 1650, shares: 320, skips: 9.8, completionRate: 90.2 }
          ],
          platforms: [
            { name: 'Spotify', streams: 125400, revenue: 2890.50, percentage: 51.0, growth: 15.2 },
            { name: 'Apple Music', streams: 68200, revenue: 1580.25, percentage: 27.8, growth: 8.7 },
            { name: 'YouTube Music', streams: 32100, revenue: 650.75, percentage: 13.1, growth: 22.1 },
            { name: 'Amazon Music', streams: 15800, revenue: 380.20, percentage: 6.4, growth: 18.9 },
            { name: 'Other', streams: 4300, revenue: 120.80, percentage: 1.7, growth: -2.1 }
          ],
          demographics: {
            ageGroups: [
              { range: '18-24', percentage: 35.2, growth: 12.5 },
              { range: '25-34', percentage: 42.8, growth: 8.1 },
              { range: '35-44', percentage: 15.6, growth: -2.3 },
              { range: '45-54', percentage: 4.8, growth: 15.7 },
              { range: '55+', percentage: 1.6, growth: 28.4 }
            ],
            countries: [
              { name: 'United States', percentage: 48.5, streams: 119177 },
              { name: 'United Kingdom', percentage: 12.3, streams: 30233 },
              { name: 'Canada', percentage: 8.7, streams: 21384 },
              { name: 'Germany', percentage: 6.2, streams: 15240 },
              { name: 'Australia', percentage: 4.8, streams: 11798 },
              { name: 'Other', percentage: 19.5, streams: 47968 }
            ],
            genres: [
              { name: 'Electronic', percentage: 65.2, trend: 'up' },
              { name: 'Synthwave', percentage: 28.7, trend: 'up' },
              { name: 'Ambient', percentage: 4.1, trend: 'stable' },
              { name: 'Other', percentage: 2.0, trend: 'down' }
            ]
          },
          engagement: {
            totalLikes: 12560,
            totalShares: 2680,
            totalComments: 890,
            avgListeningTime: '2m 45s',
            peakListeningHours: [
              { hour: 20, streams: 12500 },
              { hour: 21, streams: 15800 },
              { hour: 22, streams: 18200 },
              { hour: 15, streams: 9800 }
            ],
            deviceBreakdown: [
              { device: 'Mobile', percentage: 68.5 },
              { device: 'Desktop', percentage: 22.3 },
              { device: 'Tablet', percentage: 6.8 },
              { device: 'Smart Speaker', percentage: 2.4 }
            ]
          },
          royalties: {
            totalEarnings: 4852.30,
            pendingPayouts: 1245.80,
            avgRoyaltyPerStream: 0.0032,
            topEarningTracks: [
              { title: 'Digital Dreams', earnings: 1250.50 },
              { title: 'Midnight Pulse', earnings: 980.75 },
              { title: 'Neon Nights', earnings: 850.25 }
            ]
          }
        },
        store: {
          topProducts: [
            { id: '1', name: 'BangoBongo Hoodie', sales: 48, revenue: 2160.00, change: 15.8, inventory: 12, margin: 65.2 },
            { id: '2', name: 'Digital Dreams Vinyl', sales: 23, revenue: 805.00, change: 28.2, inventory: 8, margin: 45.8 },
            { id: '3', name: 'BangoBongo T-Shirt', sales: 67, revenue: 1675.00, change: -8.1, inventory: 25, margin: 58.3 },
            { id: '4', name: 'Studio Headphones', sales: 15, revenue: 2985.00, change: 45.2, inventory: 3, margin: 35.7 }
          ],
          categories: [
            { name: 'Merchandise', sales: 115, revenue: 3835.00, percentage: 52.8, growth: 12.5 },
            { name: 'Vinyl', sales: 23, revenue: 805.00, percentage: 11.1, growth: 28.2 },
            { name: 'Gear', sales: 15, revenue: 2985.00, percentage: 41.1, growth: 45.2 }
          ],
          performance: {
            cartAbandonmentRate: 23.5,
            avgOrderValue: 67.50,
            returnRate: 2.8,
            customerSatisfaction: 4.7,
            inventoryTurnover: 8.2
          },
          shipping: {
            avgDeliveryTime: '3.2 days',
            shippingCosts: 245.80,
            internationalOrders: 23,
            returnedPackages: 2
          }
        },
        tours: {
          upcomingShows: 8,
          totalRevenue: 18750.00,
          ticketsSold: 1250,
          avgAttendance: 78.5,
          totalCapacity: 1590,
          merchandiseSales: 3200.00,
          topVenues: [
            { name: 'Echo Arena', shows: 3, revenue: 8250.00, avgSellThrough: 85.2, capacity: 500, city: 'Los Angeles' },
            { name: 'The Observatory', shows: 2, revenue: 4580.00, avgSellThrough: 92.1, capacity: 250, city: 'San Diego' },
            { name: 'Festival Grounds', shows: 1, revenue: 5920.00, avgSellThrough: 64.0, capacity: 1200, city: 'Austin' }
          ],
          fanEngagement: {
            meetAndGreets: 45,
            vipPackages: 32,
            socialMentions: 1280,
            fanClubMembers: 890
          }
        },
        website: {
          visitors: 28450,
          pageViews: 76800,
          bounceRate: 34.2,
          avgSessionDuration: '3m 24s',
          mobileTraffic: 72.5,
          organicTraffic: 68.2,
          topPages: [
            { path: '/', views: 18200, change: 12.5, avgTimeOnPage: '2m 15s', bounceRate: 28.5 },
            { path: '/music', views: 12800, change: 22.1, avgTimeOnPage: '4m 32s', bounceRate: 22.1 },
            { path: '/merch', views: 8950, change: -5.2, avgTimeOnPage: '3m 45s', bounceRate: 35.8 },
            { path: '/tour', views: 7600, change: 35.8, avgTimeOnPage: '2m 58s', bounceRate: 31.2 },
            { path: '/gear', views: 5420, change: 18.9, avgTimeOnPage: '5m 12s', bounceRate: 15.7 }
          ],
          socialMedia: {
            totalFollowers: 15420,
            engagement: 8.7,
            reachGrowth: 25.3,
            topPosts: [
              { platform: 'Instagram', engagement: 2850, reach: 18200 },
              { platform: 'Twitter', engagement: 1650, reach: 12400 },
              { platform: 'TikTok', engagement: 4200, reach: 28900 }
            ]
          },
          conversion: {
            signupRate: 3.2,
            purchaseRate: 2.8,
            newsletterSignups: 145,
            downloadRate: 12.5
          }
        },
        financial: {
          monthlyRecurringRevenue: 2850.00,
          customerAcquisitionCost: 15.80,
          grossMargin: 68.5,
          netProfitMargin: 22.3,
          cashFlow: 12450.00,
          outstandingPayments: 890.50,
          revenueBySource: [
            { source: 'Music Streaming', amount: 4852.30, percentage: 55.4 },
            { source: 'Merchandise', amount: 2160.00, percentage: 24.7 },
            { source: 'Tour Revenue', amount: 1250.00, percentage: 14.3 },
            { source: 'Licensing', amount: 487.95, percentage: 5.6 }
          ],
          expenses: [
            { category: 'Marketing', amount: 1200.00, change: 15.2 },
            { category: 'Production', amount: 850.00, change: -8.5 },
            { category: 'Distribution', amount: 320.00, change: 22.1 },
            { category: 'Operations', amount: 680.00, change: 5.8 }
          ]
        }
      })
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />
    if (change < 0) return <TrendingDown className="h-3 w-3" />
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
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
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your platform performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(data?.overview.totalRevenue || 0)}</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(data?.overview.revenueChange || 0)}`}>
                  {getChangeIcon(data?.overview.revenueChange || 0)}
                  <span>{Math.abs(data?.overview.revenueChange || 0)}% vs last period</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Streams</p>
                <p className="text-2xl font-bold">{formatNumber(data?.overview.totalStreams || 0)}</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(data?.overview.streamsChange || 0)}`}>
                  {getChangeIcon(data?.overview.streamsChange || 0)}
                  <span>{Math.abs(data?.overview.streamsChange || 0)}% vs last period</span>
                </div>
              </div>
              <Play className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Fans</p>
                <p className="text-2xl font-bold">{formatNumber(data?.overview.totalFans || 0)}</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(data?.overview.fansChange || 0)}`}>
                  {getChangeIcon(data?.overview.fansChange || 0)}
                  <span>{Math.abs(data?.overview.fansChange || 0)}% vs last period</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{data?.overview.conversionRate}%</p>
                <div className={`flex items-center gap-1 text-xs ${getChangeColor(data?.overview.conversionChange || 0)}`}>
                  {getChangeIcon(data?.overview.conversionChange || 0)}
                  <span>{Math.abs(data?.overview.conversionChange || 0)}% vs last period</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">{formatCurrency(data?.overview.avgOrderValue || 0)}</p>
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Monthly growth</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Active</p>
                <p className="text-2xl font-bold">{formatNumber(data?.overview.monthlyActiveUsers || 0)}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Activity className="h-3 w-3" />
                  <span>Active users</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="music" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="music">Music Analytics</TabsTrigger>
          <TabsTrigger value="store">Store Analytics</TabsTrigger>
          <TabsTrigger value="tours">Tour Analytics</TabsTrigger>
          <TabsTrigger value="website">Website Analytics</TabsTrigger>
          <TabsTrigger value="engagement">Fan Engagement</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* Music Analytics */}
        <TabsContent value="music" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Top Tracks */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Top Performing Tracks
                </CardTitle>
                <CardDescription>Tracks ranked by streams and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.music.topTracks.map((track, index) => (
                    <div key={track.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium">{track.title}</h4>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{formatNumber(track.streams)} streams</span>
                            <span>{track.likes} ❤️</span>
                            <span>{track.shares} shares</span>
                            <span>{track.completionRate}% completion</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(track.revenue)}</p>
                        <div className={`flex items-center gap-1 text-xs ${getChangeColor(track.change)}`}>
                          {getChangeIcon(track.change)}
                          <span>{Math.abs(track.change)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Fan Engagement
                </CardTitle>
                <CardDescription>How fans interact with your music</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold text-red-500">{formatNumber(data?.music.engagement.totalLikes || 0)}</p>
                    <p className="text-xs text-muted-foreground">Total Likes</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold text-blue-500">{formatNumber(data?.music.engagement.totalShares || 0)}</p>
                    <p className="text-xs text-muted-foreground">Total Shares</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold text-green-500">{formatNumber(data?.music.engagement.totalComments || 0)}</p>
                    <p className="text-xs text-muted-foreground">Comments</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold text-purple-500">{data?.music.engagement.avgListeningTime}</p>
                    <p className="text-xs text-muted-foreground">Avg Listen Time</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Device Breakdown</h4>
                  {data?.music.engagement.deviceBreakdown.map((device) => (
                    <div key={device.device} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {device.device === 'Mobile' && <Smartphone className="h-4 w-4" />}
                        {device.device === 'Desktop' && <Monitor className="h-4 w-4" />}
                        {device.device === 'Tablet' && <Tablet className="h-4 w-4" />}
                        {device.device === 'Smart Speaker' && <Radio className="h-4 w-4" />}
                        <span className="text-sm">{device.device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{device.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Distribution & Royalties */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Platform Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution & Growth</CardTitle>
                <CardDescription>Streams and growth by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.music.platforms.map((platform) => (
                    <div key={platform.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{platform.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {platform.percentage}%
                          </span>
                          <div className={`flex items-center gap-1 text-xs ${getChangeColor(platform.growth)}`}>
                            {getChangeIcon(platform.growth)}
                            <span>{Math.abs(platform.growth)}%</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={platform.percentage} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatNumber(platform.streams)} streams</span>
                        <span>{formatCurrency(platform.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Royalties & Earnings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Royalties & Earnings
                </CardTitle>
                <CardDescription>Revenue breakdown and payouts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(data?.music.royalties.totalEarnings || 0)}</p>
                    <p className="text-xs text-muted-foreground">Total Earnings</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                    <p className="text-2xl font-bold text-yellow-600">{formatCurrency(data?.music.royalties.pendingPayouts || 0)}</p>
                    <p className="text-xs text-muted-foreground">Pending Payouts</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg per stream</span>
                    <span className="text-sm font-medium">${data?.music.royalties.avgRoyaltyPerStream}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Top Earning Tracks</h4>
                  {data?.music.royalties.topEarningTracks.map((track, index) => (
                    <div key={track.title} className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">#{index + 1}</span>
                        <span className="text-sm">{track.title}</span>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency(track.earnings)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demographics */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
                <CardDescription>Listener age distribution & growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.music.demographics.ageGroups.map((group) => (
                    <div key={group.range} className="flex justify-between items-center">
                      <span className="text-sm">{group.range}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${group.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{group.percentage}%</span>
                        <div className={`flex items-center gap-1 text-xs ${getChangeColor(group.growth)}`}>
                          {getChangeIcon(group.growth)}
                          <span>{Math.abs(group.growth)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>Geographic distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.music.demographics.countries.map((country) => (
                    <div key={country.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{country.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${country.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{country.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Genre Performance</CardTitle>
                <CardDescription>Performance by genre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.music.demographics.genres.map((genre) => (
                    <div key={genre.name} className="flex justify-between items-center">
                      <span className="text-sm">{genre.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${genre.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{genre.percentage}%</span>
                        <div className="flex items-center gap-1">
                          {genre.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                          {genre.trend === 'down' && <TrendingDownIcon className="h-3 w-3 text-red-500" />}
                          {genre.trend === 'stable' && <div className="h-3 w-3 rounded-full bg-gray-400" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Store Analytics */}
        <TabsContent value="store" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Top Products
                </CardTitle>
                <CardDescription>Best performing products by sales and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.store.topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{product.sales} sold</span>
                            <span>{product.inventory} in stock</span>
                            <span>{product.margin}% margin</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(product.revenue)}</p>
                        <div className={`flex items-center gap-1 text-xs ${getChangeColor(product.change)}`}>
                          {getChangeIcon(product.change)}
                          <span>{Math.abs(product.change)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Sales by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.store.categories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {category.percentage}%
                          </span>
                          <div className={`flex items-center gap-1 text-xs ${getChangeColor(category.growth)}`}>
                            {getChangeIcon(category.growth)}
                            <span>{Math.abs(category.growth)}%</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={category.percentage} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{category.sales} items sold</span>
                        <span>{formatCurrency(category.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Store Performance
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                    <p className="text-2xl font-bold text-red-600">{data?.store.performance.cartAbandonmentRate}%</p>
                    <p className="text-xs text-muted-foreground">Cart Abandonment</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(data?.store.performance.avgOrderValue || 0)}</p>
                    <p className="text-xs text-muted-foreground">Avg Order Value</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <p className="text-2xl font-bold text-blue-600">{data?.store.performance.returnRate}%</p>
                    <p className="text-xs text-muted-foreground">Return Rate</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                    <p className="text-2xl font-bold text-yellow-600">{data?.store.performance.customerSatisfaction}/5</p>
                    <p className="text-xs text-muted-foreground">Customer Rating</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Inventory Turnover</span>
                    <span className="text-sm font-medium">{data?.store.performance.inventoryTurnover}x</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Fulfillment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Shipping & Fulfillment
                </CardTitle>
                <CardDescription>Delivery and logistics metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <p className="text-xl font-bold">{data?.store.shipping.avgDeliveryTime}</p>
                      <p className="text-xs text-muted-foreground">Avg Delivery Time</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <p className="text-xl font-bold">{formatCurrency(data?.store.shipping.shippingCosts || 0)}</p>
                      <p className="text-xs text-muted-foreground">Shipping Costs</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">International Orders</span>
                      <span className="text-sm font-medium">{data?.store.shipping.internationalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Returned Packages</span>
                      <span className="text-sm font-medium">{data?.store.shipping.returnedPackages}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tour Analytics */}
        <TabsContent value="tours" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Tour Performance Overview
                </CardTitle>
                <CardDescription>Overall tour metrics and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Upcoming Shows</p>
                    <p className="text-3xl font-bold">{data?.tours.upcomingShows}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-bold">{formatCurrency(data?.tours.totalRevenue || 0)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Tickets Sold</p>
                    <p className="text-3xl font-bold">{data?.tours.ticketsSold.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                    <p className="text-3xl font-bold">{data?.tours.avgAttendance}%</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold">{data?.tours.totalCapacity}</p>
                      <p className="text-xs text-muted-foreground">Total Capacity</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{formatCurrency(data?.tours.merchandiseSales || 0)}</p>
                      <p className="text-xs text-muted-foreground">Merch Sales</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Venues</CardTitle>
                <CardDescription>Best performing venues by revenue and attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.tours.topVenues.map((venue, index) => (
                    <div key={venue.name} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium">{venue.name}</h4>
                          <div className="flex gap-3 text-sm text-muted-foreground">
                            <span>{venue.city}</span>
                            <span>{venue.shows} shows</span>
                            <span>{venue.capacity} capacity</span>
                            <span>{venue.avgSellThrough}% sell-through</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(venue.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Fan Engagement at Shows
              </CardTitle>
              <CardDescription>How fans engage during live performances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <p className="text-2xl font-bold text-purple-600">{data?.tours.fanEngagement.meetAndGreets}</p>
                  <p className="text-xs text-muted-foreground">Meet & Greets</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gold-50 dark:bg-yellow-950/20">
                  <p className="text-2xl font-bold text-yellow-600">{data?.tours.fanEngagement.vipPackages}</p>
                  <p className="text-xs text-muted-foreground">VIP Packages</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <p className="text-2xl font-bold text-blue-600">{formatNumber(data?.tours.fanEngagement.socialMentions || 0)}</p>
                  <p className="text-xs text-muted-foreground">Social Mentions</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <p className="text-2xl font-bold text-green-600">{data?.tours.fanEngagement.fanClubMembers}</p>
                  <p className="text-xs text-muted-foreground">Fan Club Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Website Analytics */}
        <TabsContent value="website" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Website Overview
                </CardTitle>
                <CardDescription>Key website metrics and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Visitors</p>
                    <p className="text-3xl font-bold">{formatNumber(data?.website.visitors || 0)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                    <p className="text-3xl font-bold">{formatNumber(data?.website.pageViews || 0)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                    <p className="text-3xl font-bold">{data?.website.bounceRate}%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Avg Session</p>
                    <p className="text-3xl font-bold">{data?.website.avgSessionDuration}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold">{data?.website.mobileTraffic}%</p>
                      <p className="text-xs text-muted-foreground">Mobile Traffic</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{data?.website.organicTraffic}%</p>
                      <p className="text-xs text-muted-foreground">Organic Traffic</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.website.topPages.map((page, index) => (
                    <div key={page.path} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium">{page.path}</h4>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{formatNumber(page.views)} views</span>
                            <span>{page.avgTimeOnPage} avg time</span>
                            <span>{page.bounceRate}% bounce</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center gap-1 text-xs ${getChangeColor(page.change)}`}>
                          {getChangeIcon(page.change)}
                          <span>{Math.abs(page.change)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Social Media Performance
                </CardTitle>
                <CardDescription>Social media reach and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <p className="text-xl font-bold text-blue-600">{formatNumber(data?.website.socialMedia.totalFollowers || 0)}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <p className="text-xl font-bold text-green-600">{data?.website.socialMedia.engagement}%</p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <p className="text-xl font-bold text-purple-600">{data?.website.socialMedia.reachGrowth}%</p>
                    <p className="text-xs text-muted-foreground">Reach Growth</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Top Performing Posts</h4>
                  {data?.website.socialMedia.topPosts.map((post, index) => (
                    <div key={post.platform} className="flex justify-between items-center">
                      <span className="text-sm">{post.platform}</span>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{formatNumber(post.engagement)} engagement</span>
                        <span>{formatNumber(post.reach)} reach</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conversion Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Conversion Metrics
                </CardTitle>
                <CardDescription>Website conversion performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <p className="text-2xl font-bold text-green-600">{data?.website.conversion.signupRate}%</p>
                    <p className="text-xs text-muted-foreground">Signup Rate</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <p className="text-2xl font-bold text-blue-600">{data?.website.conversion.purchaseRate}%</p>
                    <p className="text-xs text-muted-foreground">Purchase Rate</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <p className="text-2xl font-bold text-purple-600">{data?.website.conversion.newsletterSignups}</p>
                    <p className="text-xs text-muted-foreground">Newsletter Signups</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                    <p className="text-2xl font-bold text-orange-600">{data?.website.conversion.downloadRate}%</p>
                    <p className="text-xs text-muted-foreground">Download Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Fan Engagement Analytics */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Overall Engagement
                </CardTitle>
                <CardDescription>Fan interaction across all platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                    <p className="text-3xl font-bold text-red-600">{formatNumber(data?.music.engagement.totalLikes || 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Likes</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <p className="text-3xl font-bold text-blue-600">{formatNumber(data?.music.engagement.totalShares || 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Shares</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <p className="text-3xl font-bold text-green-600">{formatNumber(data?.music.engagement.totalComments || 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Comments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Listening Patterns
                </CardTitle>
                <CardDescription>When and how fans listen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold">{data?.music.engagement.avgListeningTime}</p>
                    <p className="text-xs text-muted-foreground">Average Listen Time</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Peak Listening Hours</h4>
                    {data?.music.engagement.peakListeningHours.map((peak, index) => (
                      <div key={peak.hour} className="flex justify-between items-center">
                        <span className="text-sm">{peak.hour}:00</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(peak.streams / 20000) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{formatNumber(peak.streams)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Fan Community
                </CardTitle>
                <CardDescription>Community building metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                      <p className="text-xl font-bold text-purple-600">{data?.tours.fanEngagement.fanClubMembers}</p>
                      <p className="text-xs text-muted-foreground">Fan Club Members</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <p className="text-xl font-bold text-blue-600">{formatNumber(data?.tours.fanEngagement.socialMentions || 0)}</p>
                      <p className="text-xs text-muted-foreground">Social Mentions</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Meet & Greets</span>
                      <span className="text-sm font-medium">{data?.tours.fanEngagement.meetAndGreets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">VIP Packages</span>
                      <span className="text-sm font-medium">{data?.tours.fanEngagement.vipPackages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Newsletter Subscribers</span>
                      <span className="text-sm font-medium">{data?.website.conversion.newsletterSignups}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Analytics */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Breakdown
                </CardTitle>
                <CardDescription>Revenue sources and distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.financial.revenueBySource.map((source) => (
                    <div key={source.source} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{source.source}</span>
                        <span className="text-sm text-muted-foreground">
                          {source.percentage}%
                        </span>
                      </div>
                      <Progress value={source.percentage} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatCurrency(source.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Financial Metrics
                </CardTitle>
                <CardDescription>Key financial performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Monthly Recurring Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(data?.financial.monthlyRecurringRevenue || 0)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Customer Acquisition Cost</p>
                    <p className="text-2xl font-bold">{formatCurrency(data?.financial.customerAcquisitionCost || 0)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Gross Margin</p>
                    <p className="text-2xl font-bold">{data?.financial.grossMargin}%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Net Profit Margin</p>
                    <p className="text-2xl font-bold">{data?.financial.netProfitMargin}%</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-green-600">{formatCurrency(data?.financial.cashFlow || 0)}</p>
                      <p className="text-xs text-muted-foreground">Cash Flow</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-orange-600">{formatCurrency(data?.financial.outstandingPayments || 0)}</p>
                      <p className="text-xs text-muted-foreground">Outstanding Payments</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Expenses Breakdown
              </CardTitle>
              <CardDescription>Monthly expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {data?.financial.expenses.map((expense) => (
                  <div key={expense.category} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{expense.category}</h4>
                      <div className={`flex items-center gap-1 text-xs ${getChangeColor(expense.change)}`}>
                        {getChangeIcon(expense.change)}
                        <span>{Math.abs(expense.change)}%</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(expense.amount)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
