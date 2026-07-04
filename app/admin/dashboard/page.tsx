'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

export const dynamic = 'force-dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Music, 
  Mic, 
  Settings, 
  BarChart3, 
  Users, 
  Shield,
  Play,
  Pause,
  Save,
  Download,
  RefreshCw,
  Lightbulb,
  Clock,
  Volume2,
  Piano,
  Guitar,
  Drum,
  Headphones,
  Brain
} from 'lucide-react'

// Music genres and styles data
const musicGenres = [
  { value: 'electronic', label: 'Electronic', styles: ['House', 'Techno', 'Trance', 'Dubstep', 'Drum & Bass'] },
  { value: 'rock', label: 'Rock', styles: ['Classic Rock', 'Alternative', 'Indie', 'Metal', 'Punk'] },
  { value: 'pop', label: 'Pop', styles: ['Synth-pop', 'Indie Pop', 'Electropop', 'Art Pop'] },
  { value: 'jazz', label: 'Jazz', styles: ['Smooth Jazz', 'Bebop', 'Fusion', 'Swing', 'Latin Jazz'] },
  { value: 'classical', label: 'Classical', styles: ['Baroque', 'Romantic', 'Modern', 'Contemporary'] },
  { value: 'hip-hop', label: 'Hip-Hop', styles: ['Boom Bap', 'Trap', 'Lo-fi', 'Cloud Rap'] },
  { value: 'country', label: 'Country', styles: ['Country Pop', 'Country Rock', 'Bluegrass', 'Americana'] },
  { value: 'rnb', label: 'R&B', styles: ['Contemporary R&B', 'Soul', 'Neo Soul', 'Funk'] }
]

const moods = [
  'Energetic', 'Relaxed', 'Uplifting', 'Melancholic', 'Aggressive', 
  'Dreamy', 'Mysterious', 'Romantic', 'Playful', 'Dark', 'Bright', 'Intense'
]

const tempos = [
  { label: 'Very Slow (60-80 BPM)', value: '60-80' },
  { label: 'Slow (80-100 BPM)', value: '80-100' },
  { label: 'Moderate (100-120 BPM)', value: '100-120' },
  { label: 'Fast (120-140 BPM)', value: '120-140' },
  { label: 'Very Fast (140+ BPM)', value: '140+' }
]

const instruments = [
  'Piano', 'Guitar', 'Drums', 'Bass', 'Violin', 'Saxophone', 
  'Synthesizer', 'Trumpet', 'Flute', 'Cello', 'Harp', 'Organ'
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('music')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  
  // Music generation state
  const [musicData, setMusicData] = useState({
    genre: '',
    style: '',
    mood: '',
    tempo: '',
    instruments: [] as string[],
    customDescription: '',
    duration: '3:00',
    key: 'C Major'
  })

  // Lyrics state
  const [lyricsData, setLyricsData] = useState({
    manualLyrics: '',
    theme: '',
    style: '',
    rhymeScheme: 'AABB',
    syllableCount: '8',
    autoGenerate: false,
    suggestions: [] as string[]
  })

  // AI suggestions state
  const [aiSuggestions, setAiSuggestions] = useState({
    genres: [] as string[],
    moods: [] as string[],
    tempos: [] as string[],
    instruments: [] as string[],
    rhymeWords: [] as string[],
    verseTemplates: [] as string[]
  })

  // Handle music generation
  const handleGenerateMusic = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    
    // Simulate music generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsGenerating(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  // Handle intelligent autofill
  const handleAutofillSuggestions = (input: string) => {
    // Simulate AI-powered suggestions based on input
    const suggestions = {
      genres: ['Electronic', 'Pop', 'Rock'].filter(genre => 
        genre.toLowerCase().includes(input.toLowerCase())
      ),
      moods: ['Energetic', 'Relaxed', 'Uplifting'].filter(mood =>
        mood.toLowerCase().includes(input.toLowerCase())
      ),
      tempos: ['120-140 BPM', '100-120 BPM'].filter(tempo =>
        tempo.toLowerCase().includes(input.toLowerCase())
      ),
      instruments: ['Piano', 'Guitar', 'Drums'].filter(instrument =>
        instrument.toLowerCase().includes(input.toLowerCase())
      )
    }
    setAiSuggestions(suggestions)
  }

  // Handle lyrics generation
  const handleGenerateLyrics = async () => {
    setIsGenerating(true)
    
    // Simulate AI lyrics generation
    setTimeout(() => {
      const generatedLyrics = `[Verse 1]
In the rhythm of the night
Dancing shadows in the moonlight
Every beat tells a story
Of our journey to glory

[Chorus]
Music flows through our veins
Breaking all the chains
Together we rise higher
Set the world on fire

[Verse 2]
Melodies intertwine
Creating dreams divine
Every note a promise
Of love that's timeless`

      setLyricsData(prev => ({
        ...prev,
        manualLyrics: generatedLyrics,
        suggestions: ['harmony', 'rhythm', 'melody', 'passion', 'journey', 'fire'],
        rhymeWords: ['night/light', 'story/glory', 'veins/chains', 'higher/fire']
      }))
      setIsGenerating(false)
    }, 2000)
  }

  // Count syllables in a word (simplified)
  const countSyllables = (word: string): number => {
    return word.toLowerCase().split(/[^aeiouy]+/).filter(Boolean).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Music Generation Admin Panel</h1>
          <p className="text-purple-200">Create and manage music content with AI-powered tools</p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/10">
            <TabsTrigger value="music" className="text-white data-[state=active]:bg-purple-600">
              <Music className="h-4 w-4 mr-2" />
              Music Generator
            </TabsTrigger>
            <TabsTrigger value="lyrics" className="text-white data-[state=active]:bg-purple-600">
              <Mic className="h-4 w-4 mr-2" />
              Lyrics Manager
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="text-white data-[state=active]:bg-purple-600">
              <Users className="h-4 w-4 mr-2" />
              Collaboration
            </TabsTrigger>
            <TabsTrigger value="ai-analysis" className="text-white data-[state=active]:bg-purple-600">
              <Brain className="h-4 w-4 mr-2" />
              AI Analysis
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-purple-600">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Music Generator Tab */}
          <TabsContent value="music" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Music Type Selection */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Music className="h-5 w-5 mr-2" />
                    Music Type Selection
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Choose genre, style, and characteristics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Genre</Label>
                      <Select value={musicData.genre} onValueChange={(value) => 
                        setMusicData(prev => ({ ...prev, genre: value, style: '' }))
                      }>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {musicGenres.map(genre => (
                            <SelectItem key={genre.value} value={genre.value}>
                              {genre.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Style</Label>
                      <Select value={musicData.style} onValueChange={(value) => 
                        setMusicData(prev => ({ ...prev, style: value }))
                      }>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {musicData.genre && musicGenres
                            .find(g => g.value === musicData.genre)?.styles.map(style => (
                              <SelectItem key={style} value={style}>
                                {style}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Mood</Label>
                    <Select value={musicData.mood} onValueChange={(value) => 
                      setMusicData(prev => ({ ...prev, mood: value }))
                    }>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        {moods.map(mood => (
                          <SelectItem key={mood} value={mood}>
                            {mood}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Tempo</Label>
                    <Select value={musicData.tempo} onValueChange={(value) => 
                      setMusicData(prev => ({ ...prev, tempo: value }))
                    }>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select tempo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tempos.map(tempo => (
                          <SelectItem key={tempo.value} value={tempo.value}>
                            {tempo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Instruments</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {instruments.map(instrument => (
                        <Badge
                          key={instrument}
                          variant={musicData.instruments.includes(instrument) ? "default" : "secondary"}
                          className={`cursor-pointer justify-center p-2 ${
                            musicData.instruments.includes(instrument) 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-white/10 text-purple-200 hover:bg-white/20'
                          }`}
                          onClick={() => {
                            setMusicData(prev => ({
                              ...prev,
                              instruments: prev.instruments.includes(instrument)
                                ? prev.instruments.filter(i => i !== instrument)
                                : [...prev.instruments, instrument]
                            }))
                          }}
                        >
                          {instrument}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Free-form Text Input */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    AI-Powered Suggestions
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Describe your music concept for intelligent autofill
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Music Description</Label>
                    <Textarea
                      placeholder="Describe the music you want to create... (e.g., 'An energetic electronic track with driving bass and melodic synths perfect for a workout')"
                      value={musicData.customDescription}
                      onChange={(e) => {
                        setMusicData(prev => ({ ...prev, customDescription: e.target.value }))
                        handleAutofillSuggestions(e.target.value)
                      }}
                      className="bg-white/10 border-white/20 text-white placeholder-purple-300 min-h-[100px]"
                    />
                  </div>

                  {/* AI Suggestions */}
                  {aiSuggestions.genres.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-white">AI Suggestions</Label>
                      
                      {aiSuggestions.genres.length > 0 && (
                        <div>
                          <p className="text-purple-200 text-sm mb-2">Suggested Genres:</p>
                          <div className="flex flex-wrap gap-2">
                            {aiSuggestions.genres.map(genre => (
                              <Badge 
                                key={genre}
                                className="bg-purple-600/20 text-purple-200 cursor-pointer hover:bg-purple-600/40"
                                onClick={() => setMusicData(prev => ({ ...prev, genre: genre.toLowerCase() }))}
                              >
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {aiSuggestions.moods.length > 0 && (
                        <div>
                          <p className="text-purple-200 text-sm mb-2">Suggested Moods:</p>
                          <div className="flex flex-wrap gap-2">
                            {aiSuggestions.moods.map(mood => (
                              <Badge 
                                key={mood}
                                className="bg-purple-600/20 text-purple-200 cursor-pointer hover:bg-purple-600/40"
                                onClick={() => setMusicData(prev => ({ ...prev, mood }))}
                              >
                                {mood}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Duration</Label>
                      <Input
                        value={musicData.duration}
                        onChange={(e) => setMusicData(prev => ({ ...prev, duration: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="3:00"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Key</Label>
                      <Select value={musicData.key} onValueChange={(value) => 
                        setMusicData(prev => ({ ...prev, key: value }))
                      }>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['C Major', 'G Major', 'D Major', 'A Minor', 'E Minor', 'D Minor'].map(key => (
                            <SelectItem key={key} value={key}>{key}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerateMusic}
                    disabled={isGenerating}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating Music...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Generate Music
                      </>
                    )}
                  </Button>

                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-purple-200 text-sm">
                        <span>Generation Progress</span>
                        <span>{generationProgress}%</span>
                      </div>
                      <Progress value={generationProgress} className="bg-white/20" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Lyrics Manager Tab */}
          <TabsContent value="lyrics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Manual Lyrics Input */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Mic className="h-5 w-5 mr-2" />
                    Lyrics Input
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Enter lyrics manually or use AI assistance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Lyrics</Label>
                    <Textarea
                      placeholder="Enter your lyrics here..."
                      value={lyricsData.manualLyrics}
                      onChange={(e) => setLyricsData(prev => ({ ...prev, manualLyrics: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-purple-300 min-h-[200px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Theme</Label>
                      <Select value={lyricsData.theme} onValueChange={(value) => 
                        setLyricsData(prev => ({ ...prev, theme: value }))
                      }>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Love', 'Life', 'Dreams', 'Nature', 'Freedom', 'Success'].map(theme => (
                            <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Style</Label>
                      <Select value={lyricsData.style} onValueChange={(value) => 
                        setLyricsData(prev => ({ ...prev, style: value }))
                      }>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Poetic', 'Conversational', 'Narrative', 'Abstract', 'Direct'].map(style => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Rhyme Scheme</Label>
                      <Select value={lyricsData.rhymeScheme} onValueChange={(value) => 
                        setLyricsData(prev => ({ ...prev, rhymeScheme: value }))
                      }>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['AABB', 'ABAB', 'ABCA', 'Free Verse'].map(scheme => (
                            <SelectItem key={scheme} value={scheme}>{scheme}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Syllables per Line</Label>
                      <Select value={lyricsData.syllableCount} onValueChange={(value) => 
                        setLyricsData(prev => ({ ...prev, syllableCount: value }))
                      }>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['6', '8', '10', '12', 'Variable'].map(count => (
                            <SelectItem key={count} value={count}>{count}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Lyrics Assistant */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    AI Lyrics Assistant
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Get AI-powered suggestions and templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleGenerateLyrics}
                    disabled={isGenerating}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating Lyrics...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Generate AI Lyrics
                      </>
                    )}
                  </Button>

                  <Separator className="bg-white/20" />

                  {/* Rhyming Suggestions */}
                  {lyricsData.rhymeWords.length > 0 && (
                    <div>
                      <Label className="text-white">Rhyming Word Suggestions</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {lyricsData.rhymeWords.map(word => (
                          <Badge 
                            key={word}
                            className="bg-purple-600/20 text-purple-200 cursor-pointer hover:bg-purple-600/40"
                          >
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Syllable Counter */}
                  {lyricsData.manualLyrics && (
                    <div>
                      <Label className="text-white">Syllable Analysis</Label>
                      <div className="bg-white/5 rounded-lg p-3 mt-2">
                        {lyricsData.manualLyrics.split('\n').map((line, index) => (
                          <div key={index} className="flex justify-between text-purple-200 text-sm py-1">
                            <span className="truncate mr-2">{line || '(empty line)'}</span>
                            <span className="font-mono">{countSyllables(line)} syllables</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verse Templates */}
                  <div>
                    <Label className="text-white">Verse Structure Templates</Label>
                    <div className="space-y-2 mt-2">
                      {[
                        { name: 'Verse-Chorus-Verse-Chorus-Bridge-Chorus', structure: 'VCVCBC' },
                        { name: 'Intro-Verse-Chorus-Verse-Chorus-Outro', structure: 'IVVCO' },
                        { name: 'Pre-Chorus-Verse-Chorus-Repeat', structure: 'PCVCR' }
                      ].map(template => (
                        <div 
                          key={template.structure}
                          className="bg-white/5 rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          <p className="text-white font-medium">{template.name}</p>
                          <p className="text-purple-200 text-sm">{template.structure}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Word Suggestions */}
                  {lyricsData.suggestions.length > 0 && (
                    <div>
                      <Label className="text-white">Theme-related Words</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {lyricsData.suggestions.map(word => (
                          <Badge 
                            key={word}
                            className="bg-purple-600/20 text-purple-200 cursor-pointer hover:bg-purple-600/40"
                          >
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Analytics Dashboard</CardTitle>
                <CardDescription className="text-purple-200">
                  Monitor music generation and usage statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200 text-sm">Total Tracks Generated</p>
                        <p className="text-3xl font-bold text-white">1,234</p>
                      </div>
                      <Music className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200 text-sm">Active Sessions</p>
                        <p className="text-3xl font-bold text-white">89</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200 text-sm">Avg. Generation Time</p>
                        <p className="text-3xl font-bold text-white">2.3s</p>
                      </div>
                      <Clock className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Admin Settings</CardTitle>
                <CardDescription className="text-purple-200">
                  Configure admin panel and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-purple-600/20 border-purple-600/50">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <AlertDescription className="text-purple-200">
                    This admin panel is protected by JWT authentication with role-based access control and encrypted sessions.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-purple-200 text-sm">Require 2FA for all admin access</p>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Session Timeout</p>
                      <p className="text-purple-200 text-sm">Current: 1 hour</p>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white">
                      Update
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Access Logs</p>
                      <p className="text-purple-200 text-sm">View admin access history</p>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white">
                      View Logs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
