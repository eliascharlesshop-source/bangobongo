"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Music,
  ShoppingBag,
  Activity
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"

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
    monthlyActiveUsers: number
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
      // TODO: Replace with actual analytics API endpoint
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      }
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
    if (change > 0) return 'text-green-600 dark:text-green-400'
    if (change < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
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

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">No analytics data available</p>
            <p className="text-sm text-muted-foreground mt-2">Start collecting data to see insights here</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Advanced Analytics</h1>
            <p className="text-purple-200">Comprehensive insights and reporting</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
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
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-200">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(data.overview.totalRevenue)}</p>
                  <div className={`flex items-center gap-1 text-xs ${getChangeColor(data.overview.revenueChange)}`}>
                    {getChangeIcon(data.overview.revenueChange)}
                    <span>{Math.abs(data.overview.revenueChange)}% vs last period</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-200">Total Streams</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(data.overview.totalStreams)}</p>
                  <div className={`flex items-center gap-1 text-xs ${getChangeColor(data.overview.streamsChange)}`}>
                    {getChangeIcon(data.overview.streamsChange)}
                    <span>{Math.abs(data.overview.streamsChange)}% vs last period</span>
                  </div>
                </div>
                <Music className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-200">Total Fans</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(data.overview.totalFans)}</p>
                  <div className={`flex items-center gap-1 text-xs ${getChangeColor(data.overview.fansChange)}`}>
                    {getChangeIcon(data.overview.fansChange)}
                    <span>{Math.abs(data.overview.fansChange)}% vs last period</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-200">Conversion Rate</p>
                  <p className="text-2xl font-bold text-white">{data.overview.conversionRate}%</p>
                  <div className={`flex items-center gap-1 text-xs ${getChangeColor(data.overview.conversionChange)}`}>
                    {getChangeIcon(data.overview.conversionChange)}
                    <span>{Math.abs(data.overview.conversionChange)}% vs last period</span>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-200">Avg Order Value</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(data.overview.avgOrderValue)}</p>
                  <div className="flex items-center gap-1 text-xs text-blue-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>Monthly growth</span>
                  </div>
                </div>
                <ShoppingBag className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-200">Monthly Active</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(data.overview.monthlyActiveUsers)}</p>
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <Activity className="h-3 w-3" />
                    <span>Active users</span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-indigo-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Revenue Trends</CardTitle>
              <CardDescription className="text-purple-200">Monthly revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
                <p className="text-purple-200">Revenue chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">User Engagement</CardTitle>
              <CardDescription className="text-purple-200">User activity and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
                <p className="text-purple-200">Engagement chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Content and Users */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Top Performing Content</CardTitle>
              <CardDescription className="text-purple-200">Most popular tracks and albums</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Summer Vibes', 'Dark Techno', 'Acoustic Folk'].map((track, index) => (
                  <div key={track} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{track}</p>
                        <p className="text-purple-200 text-sm">{Math.floor(Math.random() * 100000 + 10000).toLocaleString()} streams</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">${(Math.random() * 10000 + 1000).toFixed(2)}</p>
                      <p className="text-purple-200 text-sm">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">User Segments</CardTitle>
              <CardDescription className="text-purple-200">User distribution by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Premium Users', 'Free Users', 'Trial Users', 'Inactive Users'].map((segment, index) => {
                  const percentage = Math.floor(Math.random() * 40 + 10)
                  return (
                    <div key={segment} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white">{segment}</span>
                        <span className="text-purple-200">{percentage}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
