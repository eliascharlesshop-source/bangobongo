'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Music, 
  Play, 
  Pause,
  Save,
  Download,
  Star,
  Heart,
  Copy,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Clock,
  TrendingUp,
  Zap,
  Sparkles,
  FileMusic,
  Piano,
  Guitar,
  Drum,
  Mic,
  Headphones
} from 'lucide-react'

interface MusicTemplate {
  id: string
  name: string
  description: string
  genre: string
  mood: string
  tempo: number
  key: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  instruments: string[]
  tags: string[]
  rating: number
  downloads: number
  isPremium: boolean
  createdBy: string
  createdAt: string
  audioPreview?: string
  structure: {
    intro: number
    verse: number
    chorus: number
    bridge: number
    outro: number
  }
  settings: {
    reverb: number
    compression: number
    eq: Record<string, number>
  }
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<MusicTemplate[]>([
    {
      id: '1',
      name: 'Summer Vibes',
      description: 'Upbeat tropical house track with steel drums and marimbas',
      genre: 'House',
      mood: 'Uplifting',
      tempo: 124,
      key: 'C Major',
      duration: '3:45',
      difficulty: 'beginner',
      instruments: ['Piano', 'Drums', 'Bass', 'Synthesizer', 'Steel Drums'],
      tags: ['tropical', 'summer', 'upbeat', 'beach'],
      rating: 4.8,
      downloads: 1250,
      isPremium: false,
      createdBy: 'Alex Producer',
      createdAt: '2024-01-15',
      structure: {
        intro: 8,
        verse: 16,
        chorus: 16,
        bridge: 8,
        outro: 12
      },
      settings: {
        reverb: 30,
        compression: 40,
        eq: { bass: 60, mid: 50, treble: 70 }
      }
    },
    {
      id: '2',
      name: 'Dark Techno',
      description: 'Industrial techno with heavy bass and atmospheric pads',
      genre: 'Techno',
      mood: 'Dark',
      tempo: 135,
      key: 'A Minor',
      duration: '6:20',
      difficulty: 'advanced',
      instruments: ['Synthesizer', 'Drum Machine', 'Sub Bass', 'Effects'],
      tags: ['industrial', 'dark', 'techno', 'club'],
      rating: 4.6,
      downloads: 890,
      isPremium: true,
      createdBy: 'Techno Master',
      createdAt: '2024-02-20',
      structure: {
        intro: 16,
        verse: 32,
        chorus: 32,
        bridge: 16,
        outro: 24
      },
      settings: {
        reverb: 60,
        compression: 70,
        eq: { bass: 80, mid: 40, treble: 60 }
      }
    },
    {
      id: '3',
      name: 'Acoustic Folk',
      description: 'Warm acoustic folk with guitar and gentle percussion',
      genre: 'Folk',
      mood: 'Relaxed',
      tempo: 95,
      key: 'G Major',
      duration: '4:10',
      difficulty: 'intermediate',
      instruments: ['Acoustic Guitar', 'Violin', 'Light Percussion'],
      tags: ['acoustic', 'folk', 'warm', 'intimate'],
      rating: 4.9,
      downloads: 2100,
      isPremium: false,
      createdBy: 'Folk Artist',
      createdAt: '2024-01-10',
      structure: {
        intro: 4,
        verse: 24,
        chorus: 16,
        bridge: 12,
        outro: 8
      },
      settings: {
        reverb: 20,
        compression: 25,
        eq: { bass: 50, mid: 60, treble: 65 }
      }
    }
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<MusicTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterGenre, setFilterGenre] = useState('all')
  const [filterMood, setFilterMood] = useState('all')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [isPlaying, setIsPlaying] = useState<string | null>(null)

  const genres = ['House', 'Techno', 'Trance', 'Folk', 'Rock', 'Pop', 'Hip-Hop', 'Jazz']
  const moods = ['Uplifting', 'Dark', 'Relaxed', 'Energetic', 'Melancholic', 'Romantic']
  const difficulties = ['beginner', 'intermediate', 'advanced']

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesGenre = filterGenre === 'all' || template.genre === filterGenre
    const matchesMood = filterMood === 'all' || template.mood === filterMood
    const matchesDifficulty = filterDifficulty === 'all' || template.difficulty === filterDifficulty
    
    return matchesSearch && matchesGenre && matchesMood && matchesDifficulty
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating
      case 'downloads': return b.downloads - a.downloads
      case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'name': return a.name.localeCompare(b.name)
      default: return 0
    }
  })

  const getDifficultyColor = (difficulty: MusicTemplate['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600/20 text-green-400 border-green-600/50'
      case 'intermediate': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50'
      case 'advanced': return 'bg-red-600/20 text-red-400 border-red-600/50'
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/50'
    }
  }

  const getInstrumentIcon = (instrument: string) => {
    switch (instrument.toLowerCase()) {
      case 'piano':
      case 'acoustic guitar': return <Piano className="h-4 w-4" />
      case 'guitar': return <Guitar className="h-4 w-4" />
      case 'drums':
      case 'drum machine': return <Drum className="h-4 w-4" />
      case 'synthesizer': return <Music className="h-4 w-4" />
      case 'mic': return <Mic className="h-4 w-4" />
      default: return <Headphones className="h-4 w-4" />
    }
  }

  const handlePlayPause = (templateId: string) => {
    if (isPlaying === templateId) {
      setIsPlaying(null)
    } else {
      setIsPlaying(templateId)
    }
  }

  const duplicateTemplate = (template: MusicTemplate) => {
    const newTemplate: MusicTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      downloads: 0,
      createdAt: new Date().toISOString()
    }
    setTemplates(prev => [newTemplate, ...prev])
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId))
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Music Templates</h1>
            <p className="text-purple-200">Pre-built music templates and presets</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-300"
                    />
                  </div>
                  <select
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    className="bg-white/10 border-white/20 text-white px-3 py-2 rounded-lg"
                  >
                    <option value="all">All Genres</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                  <select
                    value={filterMood}
                    onChange={(e) => setFilterMood(e.target.value)}
                    className="bg-white/10 border-white/20 text-white px-3 py-2 rounded-lg"
                  >
                    <option value="all">All Moods</option>
                    {moods.map(mood => (
                      <option key={mood} value={mood}>{mood}</option>
                    ))}
                  </select>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="bg-white/10 border-white/20 text-white px-3 py-2 rounded-lg"
                  >
                    <option value="all">All Levels</option>
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/10 border-white/20 text-white px-3 py-2 rounded-lg"
                  >
                    <option value="rating">Top Rated</option>
                    <option value="downloads">Most Downloaded</option>
                    <option value="newest">Newest</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTemplates.map(template => (
                <Card 
                  key={template.id} 
                  className={`bg-white/10 backdrop-blur-lg border-white/20 cursor-pointer transition-all hover:bg-white/15 ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-semibold">{template.name}</h3>
                          {template.isPremium && (
                            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/50">
                              <Star className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-purple-200 text-sm">{template.description}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-sm">{template.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Template Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-purple-200">Genre:</span>
                        <span className="text-white ml-2">{template.genre}</span>
                      </div>
                      <div>
                        <span className="text-purple-200">Mood:</span>
                        <span className="text-white ml-2">{template.mood}</span>
                      </div>
                      <div>
                        <span className="text-purple-200">Tempo:</span>
                        <span className="text-white ml-2">{template.tempo} BPM</span>
                      </div>
                      <div>
                        <span className="text-purple-200">Key:</span>
                        <span className="text-white ml-2">{template.key}</span>
                      </div>
                    </div>

                    {/* Instruments */}
                    <div>
                      <p className="text-purple-200 text-sm mb-2">Instruments:</p>
                      <div className="flex flex-wrap gap-2">
                        {template.instruments.slice(0, 3).map(instrument => (
                          <Badge key={instrument} variant="secondary" className="bg-white/10 text-purple-200 flex items-center gap-1">
                            {getInstrumentIcon(instrument)}
                            {instrument}
                          </Badge>
                        ))}
                        {template.instruments.length > 3 && (
                          <Badge variant="secondary" className="bg-white/10 text-purple-200">
                            +{template.instruments.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-purple-600/20 text-purple-300 text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/20">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePlayPause(template.id)
                          }}
                        >
                          {isPlaying === template.id ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateTemplate(template)
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-purple-200 text-sm">
                        <Download className="h-3 w-3" />
                        <span>{template.downloads}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Template Details */}
          <div className="space-y-6">
            {selectedTemplate ? (
              <>
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>{selectedTemplate.name}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          onClick={() => deleteTemplate(selectedTemplate.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-purple-200">
                      {selectedTemplate.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Basic Info */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-purple-200">Genre</span>
                        <span className="text-white">{selectedTemplate.genre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Mood</span>
                        <span className="text-white">{selectedTemplate.mood}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Tempo</span>
                        <span className="text-white">{selectedTemplate.tempo} BPM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Key</span>
                        <span className="text-white">{selectedTemplate.key}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Duration</span>
                        <span className="text-white">{selectedTemplate.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Difficulty</span>
                        <Badge className={getDifficultyColor(selectedTemplate.difficulty)}>
                          {selectedTemplate.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {/* Structure */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Structure</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedTemplate.structure).map(([section, bars]) => (
                          <div key={section} className="flex justify-between">
                            <span className="text-purple-200 capitalize">{section}</span>
                            <span className="text-white">{bars} bars</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Settings */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Mix Settings</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-purple-200 text-sm">Reverb</span>
                            <span className="text-white text-sm">{selectedTemplate.settings.reverb}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${selectedTemplate.settings.reverb}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-purple-200 text-sm">Compression</span>
                            <span className="text-white text-sm">{selectedTemplate.settings.compression}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${selectedTemplate.settings.compression}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Download className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        <Save className="h-4 w-4 mr-2" />
                        Save as Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Creator Info */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Creator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <Music className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedTemplate.createdBy}</p>
                        <p className="text-purple-200 text-sm">Created {new Date(selectedTemplate.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-8 text-center">
                  <FileMusic className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Select a Template</h3>
                  <p className="text-purple-200 text-sm">
                    Choose a template from the list to view details and settings
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Library Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-200">Total Templates</span>
                  <span className="text-white font-medium">{templates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Premium</span>
                  <span className="text-white font-medium">
                    {templates.filter(t => t.isPremium).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Total Downloads</span>
                  <span className="text-white font-medium">
                    {templates.reduce((sum, t) => sum + t.downloads, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Avg Rating</span>
                  <span className="text-white font-medium">
                    {(templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1)}
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
