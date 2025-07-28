'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { 
  Play, 
  Pause, 
  Download, 
  Star, 
  Clock, 
  Music, 
  Zap,
  Crown,
  Infinity,
  Shield,
  CheckCircle,
  Filter
} from 'lucide-react'

interface Track {
  id: string
  title: string
  bpm: number
  key: string
  genre: string
  tags: string[]
  duration: number
  price: number
  albumArt: string
  audioPreview: string
  category: 'licensed' | 'beat'
  producer: string
  releaseDate: string
  plays: number
  likes: number
  isNew: boolean
  isTrending: boolean
}

interface LicenseTier {
  type: string
  name: string
  price: number
  originalPrice?: number
  description: string
  features: string[]
  popular?: boolean
  icon: any
}

export default function BeatsStore() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [licenseTiers, setLicenseTiers] = useState<LicenseTier[]>([])
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    genre: '',
    key: '',
    bpmRange: [60, 200],
    searchQuery: ''
  })
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchTracks()
    fetchLicenseTiers()
  }, [])

  const fetchTracks = async () => {
    // Mock data - replace with actual API call
    setTracks([
      {
        id: 'beat_1',
        title: 'Midnight Drive',
        bpm: 140,
        key: 'C Minor',
        genre: 'Electronic',
        tags: ['dark', 'atmospheric', 'cinematic'],
        duration: 180,
        price: 35,
        albumArt: '/abstract-electronic-album-art.png',
        audioPreview: '/previews/midnight-drive.mp3',
        category: 'licensed',
        producer: 'BangoBongo',
        releaseDate: '2024-01-15',
        plays: 1250,
        likes: 89,
        isNew: true,
        isTrending: false
      },
      {
        id: 'beat_2',
        title: 'Neon Vibes',
        bpm: 128,
        key: 'A Major',
        genre: 'Synthwave',
        tags: ['retro', 'upbeat', 'nostalgic'],
        duration: 165,
        price: 35,
        albumArt: '/synthwave-album-art.png',
        audioPreview: '/previews/neon-vibes.mp3',
        category: 'licensed',
        producer: 'BangoBongo',
        releaseDate: '2024-01-10',
        plays: 2100,
        likes: 156,
        isNew: false,
        isTrending: true
      }
    ])
  }

  const fetchLicenseTiers = async () => {
    try {
      const response = await fetch('/api/licenses')
      const data = await response.json()
      if (data.success) {
        const tiersArray = Object.values(data.tiers).map((tier: any) => ({
          ...tier,
          icon: getIconForTier(tier.type)
        }))
        setLicenseTiers(tiersArray)
      }
    } catch (error) {
      console.error('Failed to fetch license tiers:', error)
    }
  }

  const getIconForTier = (type: string) => {
    switch (type) {
      case 'basic': return Music
      case 'premium': return Star
      case 'trackout': return Download
      case 'unlimited': return Infinity
      case 'exclusive': return Crown
      default: return Music
    }
  }

  const handlePlayPause = (trackId: string) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null)
      // Pause audio
    } else {
      setCurrentlyPlaying(trackId)
      // Play audio
    }
  }

  const handlePurchaseLicense = async (trackId: string, licenseType: string) => {
    try {
      const response = await fetch('/api/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId,
          licenseType,
          customerId: 'user_123' // Replace with actual user ID
        })
      })

      const data = await response.json()
      if (data.success) {
        // Redirect to download or show success message
        window.open(data.downloadUrl, '_blank')
        alert('License purchased successfully! Check your email for the contract.')
      } else {
        alert(`Purchase failed: ${data.error}`)
      }
    } catch (error) {
      alert(`Purchase failed: ${error}`)
    }
  }

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                         track.tags.some(tag => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    const matchesGenre = !filters.genre || track.genre === filters.genre
    const matchesKey = !filters.key || track.key === filters.key
    const matchesBpm = track.bpm >= filters.bpmRange[0] && track.bpm <= filters.bpmRange[1]
    
    return matchesSearch && matchesGenre && matchesKey && matchesBpm
  })

  const sortedTracks = [...filteredTracks].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      case 'popular': return b.plays - a.plays
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'bpm-low': return a.bpm - b.bpm
      case 'bpm-high': return b.bpm - a.bpm
      default: return 0
    }
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">BangoBongo Beats Store</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Professional beats and instrumentals with flexible licensing options. 
          Perfect for artists, content creators, and music producers.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search beats..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Genre</label>
              <Select value={filters.genre} onValueChange={(value) => setFilters(prev => ({ ...prev, genre: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Genres</SelectItem>
                  <SelectItem value="Electronic">Electronic</SelectItem>
                  <SelectItem value="Synthwave">Synthwave</SelectItem>
                  <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                  <SelectItem value="Ambient">Ambient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Key</label>
              <Select value={filters.key} onValueChange={(value) => setFilters(prev => ({ ...prev, key: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Keys" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Keys</SelectItem>
                  <SelectItem value="C Major">C Major</SelectItem>
                  <SelectItem value="C Minor">C Minor</SelectItem>
                  <SelectItem value="A Major">A Major</SelectItem>
                  <SelectItem value="A Minor">A Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">BPM Range: {filters.bpmRange[0]} - {filters.bpmRange[1]}</label>
              <Slider
                value={filters.bpmRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, bpmRange: value }))}
                min={60}
                max={200}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="bpm-low">BPM: Low to High</SelectItem>
                  <SelectItem value="bpm-high">BPM: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Beats List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold">Available Beats ({sortedTracks.length})</h2>
          <div className="space-y-4">
            {sortedTracks.map((track) => (
              <Card key={track.id} className={`cursor-pointer transition-all hover:shadow-lg ${selectedTrack?.id === track.id ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={track.albumArt} 
                        alt={track.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity"
                        onClick={() => handlePlayPause(track.id)}
                      >
                        {currentlyPlaying === track.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{track.title}</h3>
                        {track.isNew && <Badge variant="secondary">New</Badge>}
                        {track.isTrending && <Badge variant="default">Trending</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">by {track.producer}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{track.bpm} BPM</span>
                        <span>{track.key}</span>
                        <span>{track.genre}</span>
                        <span className="flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          {track.plays.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {track.likes}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {track.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Starting at</p>
                      <p className="text-2xl font-bold">${track.price}</p>
                      <Button 
                        onClick={() => setSelectedTrack(track)}
                        className="mt-2"
                      >
                        License This Beat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* License Options */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Licensing Options</h2>
          
          {selectedTrack ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Beat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedTrack.albumArt} 
                      alt={selectedTrack.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{selectedTrack.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedTrack.bpm} BPM • {selectedTrack.key}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {licenseTiers.slice(0, 3).map((tier) => {
                const Icon = tier.icon
                return (
                  <Card key={tier.type} className={`relative ${tier.popular ? 'ring-2 ring-primary' : ''}`}>
                    {tier.popular && (
                      <Badge className="absolute -top-2 left-4 z-10">Most Popular</Badge>
                    )}
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          {tier.name}
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-lg font-bold">
                            ${tier.price}
                          </Badge>
                          {tier.originalPrice && tier.originalPrice > tier.price && (
                            <p className="text-xs text-muted-foreground line-through">
                              ${tier.originalPrice}
                            </p>
                          )}
                        </div>
                      </CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full"
                        variant={tier.popular ? "default" : "outline"}
                        onClick={() => handlePurchaseLicense(selectedTrack.id, tier.type)}
                      >
                        Lease for ${tier.price}
                      </Button>
                      <div className="text-center">
                        <Button variant="link" className="text-xs p-0 h-auto">
                          Download Contract
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Music className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Select a Beat</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a beat from the list to see licensing options
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
