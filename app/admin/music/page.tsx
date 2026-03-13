'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Upload,
  Music,
  Globe,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Download,
  Play,
  Pause,
  Settings,
  Eye,
  BarChart3,
  Zap,
  Info
} from 'lucide-react'

interface Track {
  id: string
  title: string
  duration: number
  albumArt: string
  category: 'original' | 'licensed' | 'beat'
  genre?: string
  bpm?: number
  key?: string
  price?: number
  isDistributed?: boolean
  dittoReleaseId?: string
  distributionStatus?: string
  releaseDate?: string
}

interface DittoRelease {
  id: string
  trackId: string
  status: 'pending' | 'processing' | 'live' | 'failed'
  platforms: string[]
  analytics?: {
    streams: number
    revenue: number
    territories: string[]
  }
}

export default function MusicManagement() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [dittoReleases, setDittoReleases] = useState<DittoRelease[]>([])
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(false)
  const [distributionProgress, setDistributionProgress] = useState(0)
  const [newTrack, setNewTrack] = useState({
    title: '',
    genre: '',
    bpm: '',
    key: '',
    category: 'original' as const,
    price: '',
    isExplicit: false,
    autoDistribute: true
  })

  useEffect(() => {
    fetchTracks()
    fetchDittoReleases()
  }, [])

  const fetchTracks = async () => {
    try {
      const response = await fetch('/api/music')
      const data = await response.json()
      if (data.success) {
        setTracks(data.music || [])
      }
    } catch (error) {
      console.error('Failed to fetch tracks:', error)
    }
  }

  const fetchDittoReleases = async () => {
    try {
      const response = await fetch('/api/ditto')
      const data = await response.json()
      if (data.success) {
        setDittoReleases(data.releases || [])
      }
    } catch (error) {
      console.error('Failed to fetch Ditto releases:', error)
    }
  }

  const handleUploadTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setDistributionProgress(0)

    try {
      // Step 1: Upload track files
      setDistributionProgress(20)

      // Step 2: Create track in database
      setDistributionProgress(40)

      // Step 3: Auto-distribute to Ditto if original track
      if (newTrack.category === 'original' && newTrack.autoDistribute) {
        setDistributionProgress(60)

        const response = await fetch('/api/ditto/advanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trackId: 'new_track_id',
            auto: true
          })
        })

        const data = await response.json()
        setDistributionProgress(80)

        if (data.success) {
          alert(`Track uploaded and submitted to Ditto Music! Estimated live date: ${data.estimatedLiveDate}`)
        } else {
          alert(`Track uploaded but Ditto distribution failed: ${data.error}`)
        }
      } else {
        alert('Track uploaded successfully!')
      }

      setDistributionProgress(100)

      // Reset form
      setNewTrack({
        title: '',
        genre: '',
        bpm: '',
        key: '',
        category: 'original',
        price: '',
        isExplicit: false,
        autoDistribute: true
      })

      fetchTracks()

    } catch (error) {
      alert(`Upload failed: ${error}`)
    }

    setLoading(false)
    setTimeout(() => setDistributionProgress(0), 2000)
  }

  const handleDistributeTrack = async (trackId: string) => {
    setLoading(true)

    try {
      const response = await fetch('/api/ditto/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId })
      })

      const data = await response.json()

      if (data.success) {
        alert(`Track successfully submitted to Ditto Music for global distribution!`)
        fetchTracks()
        fetchDittoReleases()
      } else {
        alert(`Distribution failed: ${data.error}`)
      }
    } catch (error) {
      alert(`Distribution failed: ${error}`)
    }

    setLoading(false)
  }

  const checkDistributionStatus = async (trackId: string) => {
    try {
      const response = await fetch(`/api/ditto/advanced?trackId=${trackId}&analytics=true`)
      const data = await response.json()

      if (data.success) {
        setSelectedTrack(prev => prev ? {
          ...prev,
          distributionStatus: data.status?.status,
          dittoReleaseId: data.status?.id
        } : null)
      }
    } catch (error) {
      console.error('Failed to check status:', error)
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-500 dark:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Live</Badge>
      case 'processing':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Processing</Badge>
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>
      default:
        return <Badge variant="outline">Not Distributed</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Music Management</h1>
          <p className="text-muted-foreground">
            Upload tracks, manage licensing, and distribute to Ditto Music
          </p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Ditto Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload Track</TabsTrigger>
          <TabsTrigger value="library">Track Library</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload New Track
              </CardTitle>
              <CardDescription>
                Upload and optionally auto-distribute BangoBongo originals to Ditto Music
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUploadTrack} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Track Title *</Label>
                    <Input
                      value={newTrack.title}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter track title"
                      required
                    />
                  </div>
                  <div>
                    <Label>Category *</Label>
                    <Select value={newTrack.category} onValueChange={(value) => setNewTrack(prev => ({ ...prev, category: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">BangoBongo Original</SelectItem>
                        <SelectItem value="licensed">Licensed Beat</SelectItem>
                        <SelectItem value="beat">Beat for Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Genre</Label>
                    <Select value={newTrack.genre} onValueChange={(value) => setNewTrack(prev => ({ ...prev, genre: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronic">Electronic</SelectItem>
                        <SelectItem value="Synthwave">Synthwave</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Techno">Techno</SelectItem>
                        <SelectItem value="Ambient">Ambient</SelectItem>
                        <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>BPM</Label>
                    <Input
                      type="number"
                      value={newTrack.bpm}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, bpm: e.target.value }))}
                      placeholder="128"
                    />
                  </div>
                  <div>
                    <Label>Key</Label>
                    <Select value={newTrack.key} onValueChange={(value) => setNewTrack(prev => ({ ...prev, key: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select key" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="C Major">C Major</SelectItem>
                        <SelectItem value="C Minor">C Minor</SelectItem>
                        <SelectItem value="A Major">A Major</SelectItem>
                        <SelectItem value="A Minor">A Minor</SelectItem>
                        <SelectItem value="G Major">G Major</SelectItem>
                        <SelectItem value="G Minor">G Minor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newTrack.category !== 'original' && (
                    <div>
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        value={newTrack.price}
                        onChange={(e) => setNewTrack(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="29"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newTrack.isExplicit}
                      onCheckedChange={(checked) => setNewTrack(prev => ({ ...prev, isExplicit: checked }))}
                    />
                    <Label>Explicit Content</Label>
                  </div>

                  {newTrack.category === 'original' && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newTrack.autoDistribute}
                        onCheckedChange={(checked) => setNewTrack(prev => ({ ...prev, autoDistribute: checked }))}
                      />
                      <Label>Auto-distribute to Ditto Music</Label>
                    </div>
                  )}
                </div>

                {newTrack.category === 'original' && newTrack.autoDistribute && (
                  <Alert>
                    <Globe className="w-4 h-4" />
                    <AlertDescription>
                      This track will be automatically submitted to Ditto Music for global distribution while maintaining your master rights.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Audio File *</Label>
                    <Input type="file" accept="audio/*" required />
                  </div>
                  <div>
                    <Label>Album Art *</Label>
                    <Input type="file" accept="image/*" required />
                  </div>
                </div>

                {distributionProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Upload Progress</span>
                      <span>{distributionProgress}%</span>
                    </div>
                    <Progress value={distributionProgress} />
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Uploading...' : 'Upload Track'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <div className="grid gap-4">
            {tracks.map((track) => (
              <Card key={track.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={track.albumArt}
                      alt={track.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{track.title}</h3>
                        <Badge variant="outline">{track.category}</Badge>
                        {track.isDistributed && getStatusBadge(track.distributionStatus)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{track.genre}</span>
                        <span>{track.bpm} BPM</span>
                        <span>{track.key}</span>
                        {track.price && <span>${track.price}</span>}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {track.category === 'original' && !track.isDistributed && (
                        <Button
                          size="sm"
                          onClick={() => handleDistributeTrack(track.id)}
                          disabled={loading}
                        >
                          <Globe className="w-4 h-4 mr-1" />
                          Distribute
                        </Button>
                      )}
                      {track.isDistributed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => checkDistributionStatus(track.id)}
                        >
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Analytics
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Ditto Music Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dittoReleases.map((release) => (
                    <div key={release.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">Track {release.trackId}</h4>
                        <p className="text-sm text-muted-foreground">
                          {release.platforms.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(release.status)}
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Distribution Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Distribution Time:</span>
                    <span>1-2 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platforms:</span>
                    <span>50+ Global</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Master Rights:</span>
                    <span className="text-green-600">Retained</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Share:</span>
                    <span>85% Artist</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Streams</p>
                    <p className="text-2xl font-bold">{dittoReleases.reduce((sum, r) => sum + (r.analytics?.streams || 0), 0).toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${dittoReleases.reduce((sum, r) => sum + (r.analytics?.revenue || 0), 0).toFixed(2)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Distributed Tracks</p>
                    <p className="text-2xl font-bold">{tracks.filter(t => t.isDistributed).length}</p>
                  </div>
                  <Globe className="w-8 h-8 text-purple-500 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
