'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { 
  Download, 
  Upload, 
  FileAudio, 
  FileVideo, 
  FileText,
  Settings,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Globe,
  Database,
  Cloud,
  Music,
  Radio,
  Headphones,
  Smartphone,
  Laptop,
  Server,
  Link,
  Copy,
  RefreshCw,
  AlertCircle,
  Info
} from 'lucide-react'

interface ExportJob {
  id: string
  name: string
  type: 'audio' | 'video' | 'project' | 'analytics'
  format: string
  quality: 'low' | 'medium' | 'high' | 'lossless'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  fileSize: number
  createdAt: string
  completedAt?: string
  downloadUrl?: string
  settings: Record<string, any>
}

interface Integration {
  id: string
  name: string
  type: 'streaming' | 'storage' | 'social' | 'api'
  status: 'connected' | 'disconnected' | 'error'
  description: string
  features: string[]
  lastSync?: string
  settings: Record<string, any>
}

export default function ExportPage() {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([
    {
      id: '1',
      name: 'Summer Vibes Mix',
      type: 'audio',
      format: 'MP3',
      quality: 'high',
      status: 'completed',
      progress: 100,
      fileSize: 8547328,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3000000).toISOString(),
      downloadUrl: '/exports/summer-vibes.mp3',
      settings: { bitrate: 320, sampleRate: 44100 }
    },
    {
      id: '2',
      name: 'Dark Techno Visual',
      type: 'video',
      format: 'MP4',
      quality: 'high',
      status: 'processing',
      progress: 65,
      fileSize: 0,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      settings: { resolution: '1080p', frameRate: 30 }
    },
    {
      id: '3',
      name: 'Project Backup',
      type: 'project',
      format: 'ZIP',
      quality: 'lossless',
      status: 'pending',
      progress: 0,
      fileSize: 0,
      createdAt: new Date(Date.now() - 300000).toISOString(),
      settings: { includeAudio: true, includeMidi: true }
    }
  ])

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Spotify',
      type: 'streaming',
      status: 'connected',
      description: 'Direct upload to Spotify for Artists',
      features: ['Track Upload', 'Album Management', 'Analytics Sync'],
      lastSync: new Date(Date.now() - 86400000).toISOString(),
      settings: { clientId: 'spotify_123' }
    },
    {
      id: '2',
      name: 'SoundCloud',
      type: 'streaming',
      status: 'connected',
      description: 'Upload and share on SoundCloud',
      features: ['Track Upload', 'Playlist Management', 'Stats Sync'],
      lastSync: new Date(Date.now() - 3600000).toISOString(),
      settings: { clientId: 'sc_456' }
    },
    {
      id: '3',
      name: 'YouTube Music',
      type: 'streaming',
      status: 'disconnected',
      description: 'Publish to YouTube Music',
      features: ['Video Upload', 'Audio Upload', 'Metadata Sync'],
      settings: {}
    },
    {
      id: '4',
      name: 'Google Drive',
      type: 'storage',
      status: 'connected',
      description: 'Cloud storage and backup',
      features: ['Auto Backup', 'File Sync', 'Version Control'],
      lastSync: new Date(Date.now() - 7200000).toISOString(),
      settings: { folderId: 'drive_789' }
    },
    {
      id: '5',
      name: 'Dropbox',
      type: 'storage',
      status: 'disconnected',
      description: 'File synchronization and sharing',
      features: ['File Sync', 'Sharing Links', 'Version History'],
      settings: {}
    }
  ])

  const [selectedFormat, setSelectedFormat] = useState('mp3')
  const [selectedQuality, setSelectedQuality] = useState('high')
  const [isExporting, setIsExporting] = useState(false)

  const audioFormats = [
    { format: 'mp3', description: 'MPEG Audio Layer III', size: 'Small', quality: 'Good' },
    { format: 'wav', description: 'Waveform Audio File Format', size: 'Large', quality: 'Excellent' },
    { format: 'flac', description: 'Free Lossless Audio Codec', size: 'Medium', quality: 'Excellent' },
    { format: 'aac', description: 'Advanced Audio Coding', size: 'Small', quality: 'Very Good' },
    { format: 'ogg', description: 'Ogg Vorbis', size: 'Small', quality: 'Good' }
  ]

  const videoFormats = [
    { format: 'mp4', description: 'MPEG-4 Video', size: 'Medium', quality: 'Excellent' },
    { format: 'mov', description: 'QuickTime Movie', size: 'Large', quality: 'Excellent' },
    { format: 'avi', description: 'Audio Video Interleave', size: 'Large', quality: 'Good' },
    { format: 'webm', description: 'Web Media', size: 'Small', quality: 'Good' }
  ]

  const getStatusIcon = (status: ExportJob['status'] | Integration['status']) => {
    switch (status) {
      case 'completed':
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'processing': return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />
      case 'failed':
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />
      case 'disconnected': return <AlertCircle className="h-4 w-4 text-gray-400" />
      default: return <Info className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: ExportJob['status'] | Integration['status']) => {
    switch (status) {
      case 'completed':
      case 'connected': return 'bg-green-600/20 text-green-400 border-green-600/50'
      case 'processing': return 'bg-blue-600/20 text-blue-400 border-blue-600/50'
      case 'pending': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50'
      case 'failed':
      case 'error': return 'bg-red-600/20 text-red-400 border-red-600/50'
      case 'disconnected': return 'bg-gray-600/20 text-gray-400 border-gray-600/50'
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/50'
    }
  }

  const getTypeIcon = (type: ExportJob['type']) => {
    switch (type) {
      case 'audio': return <FileAudio className="h-5 w-5" />
      case 'video': return <FileVideo className="h-5 w-5" />
      case 'project': return <FileText className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const getIntegrationIcon = (type: Integration['type']) => {
    switch (type) {
      case 'streaming': return <Radio className="h-5 w-5" />
      case 'storage': return <Cloud className="h-5 w-5" />
      case 'social': return <Globe className="h-5 w-5" />
      case 'api': return <Link className="h-5 w-5" />
      default: return <Settings className="h-5 w-5" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const startExport = (type: ExportJob['type']) => {
    setIsExporting(true)
    
    const newJob: ExportJob = {
      id: Date.now().toString(),
      name: `New ${type} export`,
      type,
      format: type === 'audio' ? selectedFormat.toUpperCase() : 'MP4',
      quality: selectedQuality as ExportJob['quality'],
      status: 'pending',
      progress: 0,
      fileSize: 0,
      createdAt: new Date().toISOString(),
      settings: {
        bitrate: selectedQuality === 'lossless' ? 'lossless' : '320',
        sampleRate: 44100
      }
    }

    setExportJobs(prev => [newJob, ...prev])

    // Simulate export process
    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, status: 'processing' } : job
      ))
    }, 1000)

    // Simulate progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, progress } : job
      ))

      if (progress >= 100) {
        clearInterval(interval)
        setExportJobs(prev => prev.map(job => 
          job.id === newJob.id ? {
            ...job,
            status: 'completed',
            progress: 100,
            fileSize: Math.random() * 10000000,
            completedAt: new Date().toISOString(),
            downloadUrl: `/exports/${newJob.id}.${selectedFormat}`
          } : job
        ))
        setIsExporting(false)
      }
    }, 500)
  }

  const downloadFile = (job: ExportJob) => {
    if (job.downloadUrl) {
      const link = document.createElement('a')
      link.href = job.downloadUrl
      link.download = `${job.name}.${job.format.toLowerCase()}`
      link.click()
    }
  }

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === integrationId) {
        const newStatus = integration.status === 'connected' ? 'disconnected' : 'connected'
        return {
          ...integration,
          status: newStatus,
          lastSync: newStatus === 'connected' ? new Date().toISOString() : undefined
        }
      }
      return integration
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Export & Integration</h1>
            <p className="text-purple-200">Export music and manage external integrations</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Cloud className="h-4 w-4 mr-2" />
            Cloud Settings
          </Button>
        </div>

        <Tabs defaultValue="export" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="export" className="text-white data-[state=active]:bg-purple-600">
              <Download className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
            <TabsTrigger value="integrations" className="text-white data-[state=active]:bg-purple-600">
              <Link className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="history" className="text-white data-[state=active]:bg-purple-600">
              <Clock className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Export Options */}
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Export Settings</CardTitle>
                    <CardDescription className="text-purple-200">
                      Configure export format and quality
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Content Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => startExport('audio')}
                          disabled={isExporting}
                        >
                          <FileAudio className="h-4 w-4 mr-2" />
                          Audio
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => startExport('video')}
                          disabled={isExporting}
                        >
                          <FileVideo className="h-4 w-4 mr-2" />
                          Video
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => startExport('project')}
                          disabled={isExporting}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Project
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Audio Format</label>
                      <div className="grid grid-cols-2 gap-2">
                        {audioFormats.map(format => (
                          <Button
                            key={format.format}
                            variant={selectedFormat === format.format ? "default" : "outline"}
                            className={selectedFormat === format.format ? "bg-purple-600" : "border-white/20 text-white hover:bg-white/10"}
                            onClick={() => setSelectedFormat(format.format)}
                          >
                            {format.format.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Quality</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['low', 'medium', 'high', 'lossless'].map(quality => (
                          <Button
                            key={quality}
                            variant={selectedQuality === quality ? "default" : "outline"}
                            className={selectedQuality === quality ? "bg-purple-600" : "border-white/20 text-white hover:bg-white/10"}
                            onClick={() => setSelectedQuality(quality)}
                          >
                            {quality.charAt(0).toUpperCase() + quality.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-200 text-sm">Estimated file size</span>
                        <span className="text-white text-sm">~8.5 MB</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-200 text-sm">Processing time</span>
                        <span className="text-white text-sm">~2 minutes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Format Comparison */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Format Comparison</CardTitle>
                    <CardDescription className="text-purple-200">
                      Compare audio formats and quality
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {audioFormats.map(format => (
                        <div key={format.format} className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{format.format.toUpperCase()}</span>
                            <Badge variant="secondary" className="bg-white/10 text-purple-200">
                              {format.size}
                            </Badge>
                          </div>
                          <p className="text-purple-200 text-sm mb-2">{format.description}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-purple-300">Quality: {format.quality}</span>
                            <span className="text-purple-300">Compatibility: High</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Exports */}
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Active Exports</CardTitle>
                    <CardDescription className="text-purple-200">
                      Current and recent export jobs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {exportJobs.map(job => (
                          <div key={job.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {getTypeIcon(job.type)}
                                <div>
                                  <h4 className="text-white font-medium">{job.name}</h4>
                                  <div className="flex items-center gap-2 text-sm text-purple-200">
                                    <span>{job.format}</span>
                                    <span>•</span>
                                    <span>{job.quality}</span>
                                    <span>•</span>
                                    <span>{formatFileSize(job.fileSize)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(job.status)}
                                <Badge className={getStatusColor(job.status)}>
                                  {job.status}
                                </Badge>
                              </div>
                            </div>

                            {job.status === 'processing' && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-purple-200">Progress</span>
                                  <span className="text-white">{job.progress}%</span>
                                </div>
                                <Progress value={job.progress} className="bg-white/20" />
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-3">
                              <div className="text-xs text-purple-300">
                                Created {new Date(job.createdAt).toLocaleTimeString()}
                                {job.completedAt && (
                                  <span> • Finished {new Date(job.completedAt).toLocaleTimeString()}</span>
                                )}
                              </div>
                              {job.status === 'completed' && (
                                <Button
                                  size="sm"
                                  onClick={() => downloadFile(job)}
                                  className="bg-green-600/20 text-green-400 hover:bg-green-600/30"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {integrations.map(integration => (
                <Card key={integration.id} className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getIntegrationIcon(integration.type)}
                        <span>{integration.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(integration.status)}
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-purple-200">
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-white text-sm font-medium mb-2">Features</p>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map(feature => (
                          <Badge key={feature} variant="secondary" className="bg-white/10 text-purple-200 text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {integration.lastSync && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-200">Last sync</span>
                        <span className="text-white">
                          {new Date(integration.lastSync).toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={integration.status === 'connected' ? "destructive" : "default"}
                        onClick={() => toggleIntegration(integration.id)}
                        className={integration.status === 'connected' ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"}
                      >
                        {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Export History</CardTitle>
                <CardDescription className="text-purple-200">
                  View and manage past exports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                      </Button>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                        <Download className="h-3 w-3 mr-1" />
                        Export All
                      </Button>
                    </div>
                    <div className="text-purple-200 text-sm">
                      Showing {exportJobs.length} exports
                    </div>
                  </div>

                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {exportJobs.map(job => (
                        <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(job.type)}
                            <div>
                              <p className="text-white font-medium">{job.name}</p>
                              <p className="text-purple-200 text-sm">
                                {job.format} • {job.quality} • {formatFileSize(job.fileSize)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(job.status)}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
