'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity,
  Users,
  Eye,
  Lock,
  Unlock,
  Ban,
  Wifi,
  WifiOff,
  Server,
  Database,
  Key,
  FileText,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  AlertCircle,
  Info,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react'

interface SecurityEvent {
  id: string
  type: 'login_attempt' | 'unauthorized_access' | 'suspicious_activity' | 'data_breach' | 'system_error'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: string
  source: string
  userId?: string
  ipAddress: string
  userAgent: string
  resolved: boolean
  actions: string[]
}

interface SecurityMetric {
  name: string
  value: number
  trend: 'up' | 'down' | 'stable'
  change: number
  status: 'good' | 'warning' | 'critical'
}

interface Threat {
  id: string
  type: 'brute_force' | 'injection' | 'xss' | 'ddos' | 'malware'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  source: string
  status: 'active' | 'mitigated' | 'investigating'
  detectedAt: string
  affectedSystems: string[]
}

export default function SecurityMonitoringPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [threats, setThreats] = useState<Threat[]>([])
  const [metrics, setMetrics] = useState<SecurityMetric[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for demonstration
  const mockEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'login_attempt',
      severity: 'medium',
      title: 'Failed Login Attempt',
      description: 'Multiple failed login attempts from suspicious IP address',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      source: 'auth-service',
      userId: 'user_123',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      resolved: false,
      actions: ['Block IP', 'Reset User Password', 'Enable 2FA']
    },
    {
      id: '2',
      type: 'unauthorized_access',
      severity: 'high',
      title: 'Unauthorized Admin Access',
      description: 'Attempt to access admin panel without proper permissions',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      source: 'admin-gateway',
      ipAddress: '10.0.0.50',
      userAgent: 'curl/7.68.0',
      resolved: false,
      actions: ['Block IP', 'Investigate User', 'Review Permissions']
    },
    {
      id: '3',
      type: 'suspicious_activity',
      severity: 'low',
      title: 'Unusual API Usage',
      description: 'Spike in API requests from single user',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      source: 'api-gateway',
      userId: 'user_456',
      ipAddress: '172.16.0.10',
      userAgent: 'Python/3.9',
      resolved: true,
      actions: ['Rate Limit Applied', 'User Notified']
    }
  ]

  const mockThreats: Threat[] = [
    {
      id: '1',
      type: 'brute_force',
      severity: 'high',
      description: 'Brute force attack detected on login endpoint',
      source: 'External',
      status: 'active',
      detectedAt: new Date(Date.now() - 1800000).toISOString(),
      affectedSystems: ['auth-service', 'api-gateway']
    },
    {
      id: '2',
      type: 'ddos',
      severity: 'critical',
      description: 'DDoS attack targeting main application servers',
      source: 'External',
      status: 'mitigating',
      detectedAt: new Date(Date.now() - 3600000).toISOString(),
      affectedSystems: ['web-server', 'database']
    }
  ]

  const mockMetrics: SecurityMetric[] = [
    { name: 'Failed Logins', value: 47, trend: 'up', change: 23, status: 'warning' },
    { name: 'Blocked IPs', value: 12, trend: 'up', change: 8, status: 'good' },
    { name: 'Security Score', value: 87, trend: 'down', change: -3, status: 'good' },
    { name: 'Active Threats', value: 3, trend: 'stable', change: 0, status: 'critical' },
    { name: 'Response Time', value: 1.2, trend: 'down', change: -0.3, status: 'good' }
  ]

  useEffect(() => {
    // Initialize with mock data
    setEvents(mockEvents)
    setThreats(mockThreats)
    setMetrics(mockMetrics)

    // Simulate real-time updates
    if (isRealTimeEnabled) {
      const interval = setInterval(() => {
        // Add new random event occasionally
        if (Math.random() > 0.8) {
          const newEvent: SecurityEvent = {
            id: Date.now().toString(),
            type: ['login_attempt', 'suspicious_activity'][Math.floor(Math.random() * 2)] as SecurityEvent['type'],
            severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as SecurityEvent['severity'],
            title: 'New Security Event',
            description: 'Automatically detected security event',
            timestamp: new Date().toISOString(),
            source: 'security-monitor',
            ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
            userAgent: 'System Monitor',
            resolved: false,
            actions: ['Investigate', 'Log', 'Alert']
          }
          setEvents(prev => [newEvent, ...prev].slice(0, 50))
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isRealTimeEnabled])

  const getSeverityColor = (severity: SecurityEvent['severity'] | Threat['severity']) => {
    switch (severity) {
      case 'low': return 'bg-green-600/20 text-green-400 border-green-600/50'
      case 'medium': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50'
      case 'high': return 'bg-orange-600/20 text-orange-400 border-orange-600/50'
      case 'critical': return 'bg-red-600/20 text-red-400 border-red-600/50'
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4 text-red-400" />
      case 'mitigated': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'investigating': return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-400" />
      default: return <Info className="h-4 w-4 text-gray-400" />
    }
  }

  const getTrendIcon = (trend: SecurityMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-400" />
      case 'down': return <TrendingDown className="h-4 w-4 text-green-400" />
      case 'stable': return <Activity className="h-4 w-4 text-blue-400" />
      default: return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resolveEvent = (eventId: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, resolved: true } : event
    ))
  }

  const exportSecurityReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      timeRange: selectedTimeRange,
      events: events,
      threats: threats,
      metrics: metrics,
      summary: {
        totalEvents: events.length,
        criticalEvents: events.filter(e => e.severity === 'critical').length,
        activeThreats: threats.filter(t => t.status === 'active').length,
        securityScore: metrics.find(m => m.name === 'Security Score')?.value || 0
      }
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Security Monitoring</h1>
            <p className="text-purple-200">Real-time security monitoring and threat detection</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isRealTimeEnabled ? "default" : "outline"}
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              className={isRealTimeEnabled ? "bg-green-600 hover:bg-green-700" : "border-white/20 text-white hover:bg-white/10"}
            >
              {isRealTimeEnabled ? <Activity className="h-4 w-4 mr-2" /> : <WifiOff className="h-4 w-4 mr-2" />}
              {isRealTimeEnabled ? 'Real-time Active' : 'Real-time Disabled'}
            </Button>
            <Button
              onClick={exportSecurityReport}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-200 text-sm">{metric.name}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-white">{metric.value}</span>
                  <div className={`text-xs px-2 py-1 rounded ${
                    metric.status === 'good' ? 'bg-green-600/20 text-green-400' :
                    metric.status === 'warning' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="events" className="text-white data-[state=active]:bg-purple-600">
              Security Events
            </TabsTrigger>
            <TabsTrigger value="threats" className="text-white data-[state=active]:bg-purple-600">
              Active Threats
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-purple-600">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-purple-600">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Security Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Events List */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>Security Events ({filteredEvents.length})</span>
                      <div className="flex gap-2">
                        <select
                          value={selectedTimeRange}
                          onChange={(e) => setSelectedTimeRange(e.target.value)}
                          className="bg-white/10 border-white/20 text-white px-3 py-1 rounded text-sm"
                        >
                          <option value="1h">Last Hour</option>
                          <option value="24h">Last 24 Hours</option>
                          <option value="7d">Last 7 Days</option>
                          <option value="30d">Last 30 Days</option>
                        </select>
                        <div className="relative">
                          <Search className="absolute left-3 top-2 h-4 w-4 text-purple-300" />
                          <Input
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-300 w-48"
                          />
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {filteredEvents.map(event => (
                          <div key={event.id} className={`p-4 rounded-lg border ${getSeverityColor(event.severity)}`}>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(event.resolved ? 'resolved' : event.severity)}
                                <span className="text-white font-medium">{event.title}</span>
                                {event.resolved && (
                                  <Badge className="bg-green-600/20 text-green-400">Resolved</Badge>
                                )}
                              </div>
                              <span className="text-purple-300 text-xs">
                                {new Date(event.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-purple-200 text-sm mb-3">{event.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-purple-300">
                                <span>🌐 {event.ipAddress}</span>
                                <span>📡 {event.source}</span>
                                {event.userId && <span>👤 {event.userId}</span>}
                              </div>
                              {!event.resolved && (
                                <Button
                                  size="sm"
                                  onClick={() => resolveEvent(event.id)}
                                  className="bg-green-600/20 text-green-400 hover:bg-green-600/30"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Resolve
                                </Button>
                              )}
                            </div>
                            {event.actions.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {event.actions.map(action => (
                                  <Badge key={action} variant="secondary" className="bg-white/10 text-purple-200 text-xs">
                                    {action}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Event Summary */}
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Event Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Total Events</span>
                      <span className="text-white font-medium">{events.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Critical</span>
                      <span className="text-red-400 font-medium">
                        {events.filter(e => e.severity === 'critical').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">High</span>
                      <span className="text-orange-400 font-medium">
                        {events.filter(e => e.severity === 'high').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Medium</span>
                      <span className="text-yellow-400 font-medium">
                        {events.filter(e => e.severity === 'medium').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Low</span>
                      <span className="text-green-400 font-medium">
                        {events.filter(e => e.severity === 'low').length}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Top Sources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {['auth-service', 'api-gateway', 'admin-panel', 'web-server'].map((source, index) => {
                      const count = events.filter(e => e.source === source).length
                      const percentage = (count / events.length) * 100
                      
                      return (
                        <div key={source} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-white">{source}</span>
                            <span className="text-purple-200">{count} events</span>
                          </div>
                          <Progress value={percentage} className="bg-white/20" />
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Active Threats Tab */}
          <TabsContent value="threats" className="space-y-6">
            <div className="grid gap-6">
              {threats.map(threat => (
                <Card key={threat.id} className={`bg-white/10 backdrop-blur-lg border ${getSeverityColor(threat.severity)}`}>
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(threat.status)}
                        <span>{threat.type.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <Badge className={getSeverityColor(threat.severity)}>
                        {threat.severity}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-purple-200">
                      {threat.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-purple-200 text-sm mb-1">Source</p>
                        <p className="text-white font-medium">{threat.source}</p>
                      </div>
                      <div>
                        <p className="text-purple-200 text-sm mb-1">Detected</p>
                        <p className="text-white font-medium">
                          {new Date(threat.detectedAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-purple-200 text-sm mb-1">Status</p>
                        <p className="text-white font-medium capitalize">{threat.status}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-purple-200 text-sm mb-2">Affected Systems</p>
                      <div className="flex flex-wrap gap-2">
                        {threat.affectedSystems.map(system => (
                          <Badge key={system} variant="secondary" className="bg-white/10 text-purple-200">
                            {system}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Shield className="h-4 w-4 mr-2" />
                        Mitigate
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Eye className="h-4 w-4 mr-2" />
                        Investigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Security Trends</CardTitle>
                  <CardDescription className="text-purple-200">
                    Security event trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-32 bg-white/5 rounded-lg flex items-center justify-center">
                      <p className="text-purple-200">Security trend chart would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Threat Distribution</CardTitle>
                  <CardDescription className="text-purple-200">
                    Types of security threats detected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Brute Force', 'DDoS', 'Injection', 'XSS', 'Malware'].map((threatType, index) => {
                      const count = threats.filter(t => t.type === threatType.toLowerCase().replace(' ', '_')).length
                      const percentage = threats.length > 0 ? (count / threats.length) * 100 : 0
                      
                      return (
                        <div key={threatType} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-white">{threatType}</span>
                            <span className="text-purple-200">{count}</span>
                          </div>
                          <Progress value={percentage} className="bg-white/20" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Alert Settings</CardTitle>
                  <CardDescription className="text-purple-200">
                    Configure security alert preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Email Alerts</span>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">SMS Alerts</span>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Slack Integration</span>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Security Policies</CardTitle>
                  <CardDescription className="text-purple-200">
                    Manage security policies and rules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Password Policy</span>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      Edit
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Session Timeout</span>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">API Rate Limits</span>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      Adjust
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
