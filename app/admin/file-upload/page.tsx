'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Upload, 
  FileAudio, 
  FileMusic, 
  FileWaveform,
  Play,
  Pause,
  Download,
  Trash2,
  Settings,
  Volume2,
  Headphones,
  Mic,
  Radio,
  Music,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Filter,
  Search,
  MoreHorizontal
} from 'lucide-react'

interface AudioFile {
  id: string
  name: string
  size: number
  duration: number
  format: string
  sampleRate: number
  bitRate: number
  channels: number
  uploadDate: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  url?: string
  waveform?: number[]
  metadata: {
    title?: string
    artist?: string
    album?: string
    genre?: string
    tempo?: number
    key?: string
  }
}

interface ProcessingJob {
  id: string
  fileId: string
  type: 'normalize' | 'equalize' | 'compress' | 'convert' | 'analyze'
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  settings: Record<string, any>
}

export default function FileUploadPage() {
  const [files, setFiles] = useState<AudioFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterFormat, setFilterFormat] = useState('all')
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([])
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const supportedFormats = [
    { format: 'MP3', extension: '.mp3', description: 'MPEG Audio Layer III' },
    { format: 'WAV', extension: '.wav', description: 'Waveform Audio File Format' },
    { format: 'FLAC', extension: '.flac', description: 'Free Lossless Audio Codec' },
    { format: 'AAC', extension: '.aac', description: 'Advanced Audio Coding' },
    { format: 'OGG', extension: '.ogg', description: 'Ogg Vorbis' }
  ]

  const processingOptions = [
    { type: 'normalize', name: 'Normalize', description: 'Adjust audio levels to optimal range' },
    { type: 'equalize', name: 'Equalize', description: 'Apply frequency adjustments' },
    { type: 'compress', name: 'Compress', description: 'Dynamic range compression' },
    { type: 'convert', name: 'Convert', description: 'Change audio format' },
    { type: 'analyze', name: 'Analyze', description: 'Extract audio characteristics' }
  ]

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }, [])

  const processFiles = async (fileList: File[]) => {
    const audioFiles = fileList.filter(file => 
      supportedFormats.some(format => 
        file.name.toLowerCase().endsWith(format.extension.toLowerCase())
      )
    )

    for (const file of audioFiles) {
      const newFile: AudioFile = {
        id: Date.now().toString() + Math.random().toString(36),
        name: file.name,
        size: file.size,
        duration: 0,
        format: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        sampleRate: 44100,
        bitRate: 320,
        channels: 2,
        uploadDate: new Date().toISOString(),
        status: 'uploading',
        progress: 0,
        metadata: {}
      }

      setFiles(prev => [...prev, newFile])

      // Simulate upload and processing
      await simulateFileProcessing(newFile.id)
    }
  }

  const simulateFileProcessing = async (fileId: string) => {
    // Upload phase
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, progress, status: progress === 100 ? 'processing' : 'uploading' }
          : file
      ))
    }

    // Processing phase
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        const duration = Math.random() * 300 + 60 // 1-6 minutes
        return {
          ...file,
          status: 'completed',
          duration,
          metadata: {
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: 'Unknown Artist',
            genre: 'Electronic',
            tempo: Math.floor(Math.random() * 60) + 90,
            key: ['C Major', 'D Minor', 'E Major', 'A Minor'][Math.floor(Math.random() * 4)]
          }
        }
      }
      return file
    }))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusIcon = (status: AudioFile['status']) => {
    switch (status) {
      case 'uploading': return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'processing': return <Settings className="h-4 w-4 animate-pulse" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getFileIcon = (format: string) => {
    switch (format.toUpperCase()) {
      case 'MP3': return <FileAudio className="h-8 w-8" />
      case 'WAV': return <FileWaveform className="h-8 w-8" />
      default: return <FileMusic className="h-8 w-8" />
    }
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFormat = filterFormat === 'all' || file.format.toLowerCase() === filterFormat.toLowerCase()
    return matchesSearch && matchesFormat
  })

  const handlePlayPause = (fileId: string) => {
    if (isPlaying === fileId) {
      setIsPlaying(null)
    } else {
      setIsPlaying(fileId)
    }
  }

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
    setSelectedFiles(prev => prev.filter(id => id !== fileId))
  }

  const startProcessing = (fileIds: string[], processingType: ProcessingJob['type']) => {
    const newJobs: ProcessingJob[] = fileIds.map(fileId => ({
      id: Date.now().toString() + Math.random().toString(36),
      fileId,
      type: processingType,
      status: 'pending',
      progress: 0,
      settings: {}
    }))

    setProcessingJobs(prev => [...prev, ...newJobs])

    // Simulate processing
    newJobs.forEach(job => {
      simulateProcessing(job.id)
    })
  }

  const simulateProcessing = async (jobId: string) => {
    // Set to running
    setProcessingJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'running' } : job
    ))

    // Progress simulation
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 500))
      setProcessingJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, progress } : job
      ))
    }

    // Complete
    setProcessingJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'completed' } : job
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Audio Upload & Processing</h1>
            <p className="text-purple-200">Upload, process, and manage audio files</p>
          </div>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={supportedFormats.map(f => f.extension).join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Upload Area */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Drop Zone</CardTitle>
            <CardDescription className="text-purple-200">
              Drag and drop audio files or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging 
                  ? 'border-purple-400 bg-purple-600/10' 
                  : 'border-white/30 bg-white/5 hover:border-white/50'
              }`}
            >
              <Upload className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {isDragging ? 'Drop files here' : 'Upload Audio Files'}
              </h3>
              <p className="text-purple-200 mb-4">
                Supported formats: {supportedFormats.map(f => f.format).join(', ')}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {supportedFormats.map(format => (
                  <Badge key={format.format} variant="secondary" className="bg-white/10 text-purple-200">
                    {format.format}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                      <Input
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-300"
                      />
                    </div>
                  </div>
                  <select
                    value={filterFormat}
                    onChange={(e) => setFilterFormat(e.target.value)}
                    className="bg-white/10 border-white/20 text-white px-3 py-2 rounded-lg"
                  >
                    <option value="all">All Formats</option>
                    {supportedFormats.map(format => (
                      <option key={format.format} value={format.format.toLowerCase()}>
                        {format.format}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Files */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Audio Files ({filteredFiles.length})</span>
                  {selectedFiles.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() => startProcessing(selectedFiles, 'normalize')}
                      >
                        Normalize
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() => startProcessing(selectedFiles, 'convert')}
                      >
                        Convert
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {filteredFiles.map(file => (
                      <div key={file.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFiles(prev => [...prev, file.id])
                            } else {
                              setSelectedFiles(prev => prev.filter(id => id !== file.id))
                            }
                          }}
                          className="rounded"
                        />
                        
                        <div className="text-purple-400">
                          {getFileIcon(file.format)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-medium truncate">{file.name}</p>
                            {getStatusIcon(file.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-purple-200">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{file.format}</span>
                            {file.duration > 0 && <span>{formatDuration(file.duration)}</span>}
                            <span>{file.sampleRate} Hz</span>
                          </div>
                          {file.metadata.title && (
                            <div className="flex items-center gap-4 text-sm text-purple-300 mt-1">
                              <span>🎵 {file.metadata.title}</span>
                              <span>🎤 {file.metadata.artist}</span>
                              <span>🎼 {file.metadata.genre}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {file.status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePlayPause(file.id)}
                              className="text-white hover:bg-white/10"
                            >
                              {isPlaying === file.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/10"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteFile(file.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Processing Queue */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Processing Queue
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Active audio processing jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 space-y-3">
                  {processingJobs.map(job => {
                    const file = files.find(f => f.id === job.fileId)
                    const option = processingOptions.find(o => o.type === job.type)
                    
                    return (
                      <div key={job.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-sm font-medium">{option?.name}</span>
                          <Badge className={
                            job.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                            job.status === 'running' ? 'bg-blue-600/20 text-blue-400' :
                            job.status === 'failed' ? 'bg-red-600/20 text-red-400' :
                            'bg-gray-600/20 text-gray-400'
                          }>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-purple-200 text-xs mb-2 truncate">{file?.name}</p>
                        {job.status === 'running' && (
                          <Progress value={job.progress} className="bg-white/20" />
                        )}
                      </div>
                    )
                  })}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Processing Options */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Processing Options</CardTitle>
                <CardDescription className="text-purple-200">
                  Available audio processing tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {processingOptions.map(option => (
                  <div key={option.type} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-1">{option.name}</h4>
                    <p className="text-purple-200 text-xs">{option.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Storage Stats */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Storage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-200">Total Files</span>
                  <span className="text-white font-medium">{files.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Total Size</span>
                  <span className="text-white font-medium">
                    {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Completed</span>
                  <span className="text-white font-medium">
                    {files.filter(f => f.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Processing</span>
                  <span className="text-white font-medium">
                    {files.filter(f => f.status === 'processing').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
