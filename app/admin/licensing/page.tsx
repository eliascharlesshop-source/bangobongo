'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Music, 
  DollarSign, 
  Download, 
  Clock, 
  TrendingUp, 
  Users,
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react'

interface LicenseTier {
  type: string
  name: string
  price: number
  description: string
  rights: any
  leasePeriod?: string
  popular?: boolean
  features: string[]
}

interface License {
  id: string
  trackId: string
  trackTitle: string
  licenseType: string
  customerEmail: string
  price: number
  purchaseDate: string
  expiryDate?: string
  isActive: boolean
  downloadCount: number
  streamCount: number
}

interface DittoRelease {
  id: string
  trackId: string
  trackTitle: string
  status: 'pending' | 'processing' | 'live' | 'failed'
  distributionDate?: string
  platforms: string[]
  analytics?: {
    streams: number
    revenue: number
    territories: string[]
  }
}

export default function LicensingManager() {
  const [licenseTiers, setLicenseTiers] = useState<Record<string, LicenseTier>>({})
  const [licenses, setLicenses] = useState<License[]>([])
  const [dittoReleases, setDittoReleases] = useState<DittoRelease[]>([])
  const [selectedTrack, setSelectedTrack] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('tiers')

  useEffect(() => {
    fetchLicenseTiers()
    fetchLicenses()
    fetchDittoReleases()
  }, [])

  const fetchLicenseTiers = async () => {
    try {
      const response = await fetch('/api/licenses')
      const data = await response.json()
      if (data.success) {
        setLicenseTiers(data.tiers)
      }
    } catch (error) {
      console.error('Failed to fetch license tiers:', error)
    }
  }

  const fetchLicenses = async () => {
    try {
      // TODO: Implement license fetching
      setLicenses([
        {
          id: 'lic_1',
          trackId: 'track_1',
          trackTitle: 'Midnight Vibes',
          licenseType: 'premium',
          customerEmail: 'artist@example.com',
          price: 100,
          purchaseDate: '2024-01-15',
          expiryDate: '2027-01-15',
          isActive: true,
          downloadCount: 5,
          streamCount: 1250
        }
      ])
    } catch (error) {
      console.error('Failed to fetch licenses:', error)
    }
  }

  const fetchDittoReleases = async () => {
    try {
      // TODO: Implement Ditto releases fetching
      setDittoReleases([
        {
          id: 'ditto_1',
          trackId: 'track_original_1',
          trackTitle: 'BangoBongo - Electronic Dreams',
          status: 'live',
          distributionDate: '2024-01-20',
          platforms: ['Spotify', 'Apple Music', 'Amazon Music'],
          analytics: {
            streams: 15420,
            revenue: 234.56,
            territories: ['US', 'UK', 'CA', 'AU', 'DE']
          }
        }
      ])
    } catch (error) {
      console.error('Failed to fetch Ditto releases:', error)
    }
  }

  const distributeToD鉄 = async (trackId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ditto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          trackId,
          trackData: {
            // TODO: Get actual track data
            title: 'Sample Track',
            category: 'original'
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('Track successfully submitted to Ditto for distribution!')
        fetchDittoReleases()
      } else {
        alert(`Distribution failed: ${data.error}`)
      }
    } catch (error) {
      alert(`Distribution failed: ${error}`)
    }
    setLoading(false)
  }

  const updateLicenseTier = async (tierType: string, updates: Partial<LicenseTier>) => {
    try {
      // TODO: Implement tier updates
      setLicenseTiers(prev => ({
        ...prev,
        [tierType]: { ...prev[tierType], ...updates }
      }))
    } catch (error) {
      console.error('Failed to update license tier:', error)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Music Licensing & Distribution</h1>
          <p className="text-muted-foreground">
            Manage licensing tiers, customer licenses, and Ditto Music distribution
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tiers">License Tiers</TabsTrigger>
          <TabsTrigger value="licenses">Active Licenses</TabsTrigger>
          <TabsTrigger value="ditto">Ditto Distribution</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(licenseTiers).map(([type, tier]) => (
              <Card key={type} className={`relative ${tier.popular ? 'ring-2 ring-primary' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-2 left-4">Most Popular</Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {tier.name}
                    <Badge variant="outline">${tier.price}</Badge>
                  </CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Price:</Label>
                      <Input
                        type="number"
                        value={tier.price}
                        onChange={(e) => updateLicenseTier(type, { price: parseInt(e.target.value) })}
                        className="w-20"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">Features:</h4>
                    <ul className="text-sm space-y-1">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="licenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Active Licenses
              </CardTitle>
              <CardDescription>
                Manage customer licenses and track usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {licenses.map((license) => (
                  <div key={license.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{license.trackTitle}</h3>
                      <p className="text-sm text-muted-foreground">{license.customerEmail}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs">
                          Downloads: {license.downloadCount}
                        </span>
                        <span className="text-xs">
                          Streams: {license.streamCount}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={license.isActive ? "default" : "secondary"}
                        className="mb-2"
                      >
                        {license.licenseType}
                      </Badge>
                      <p className="text-sm font-medium">${license.price}</p>
                      <p className="text-xs text-muted-foreground">
                        Expires: {license.expiryDate ? new Date(license.expiryDate).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ditto" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Distribute New Track
                </CardTitle>
                <CardDescription>
                  Send BangoBongo originals to Ditto for global distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Track</Label>
                  <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a BangoBongo original track" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="track_1">Electronic Dreams</SelectItem>
                      <SelectItem value="track_2">Midnight Synthwave</SelectItem>
                      <SelectItem value="track_3">Digital Horizon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => distributeToD鉄(selectedTrack)}
                  disabled={!selectedTrack || loading}
                  className="w-full"
                >
                  {loading ? 'Distributing...' : 'Distribute to Ditto'}
                </Button>
                <Alert>
                  <Shield className="w-4 h-4" />
                  <AlertDescription>
                    Only BangoBongo original tracks maintain master rights through Ditto distribution.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Distribution Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dittoReleases.map((release) => (
                    <div key={release.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{release.trackTitle}</h4>
                        <p className="text-sm text-muted-foreground">
                          {release.platforms.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={
                            release.status === 'live' ? 'default' :
                            release.status === 'processing' ? 'secondary' :
                            release.status === 'failed' ? 'destructive' : 'outline'
                          }
                        >
                          {release.status}
                        </Badge>
                        {release.analytics && (
                          <div className="text-xs mt-1 space-y-1">
                            <div>{release.analytics.streams.toLocaleString()} streams</div>
                            <div>${release.analytics.revenue.toFixed(2)} revenue</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">$2,345.67</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Licenses</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Distributed Tracks</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <Globe className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Streams</p>
                    <p className="text-2xl font-bold">125.4K</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
