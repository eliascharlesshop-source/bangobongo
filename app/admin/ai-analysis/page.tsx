'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Brain, 
  TrendingUp, 
  Music, 
  Mic, 
  BarChart3, 
  Target,
  Zap,
  Lightbulb,
  Radio,
  Headphones,
  Piano,
  Drum,
  Guitar,
  Volume2,
  Activity,
  Clock,
  Award,
  Star,
  Sparkles
} from 'lucide-react'

interface AIMusicAnalysis {
  genre: string
  confidence: number
  characteristics: string[]
  similarArtists: string[]
  moodAnalysis: {
    primary: string
    secondary: string[]
    energy: number
    valence: number
  }
  technicalAnalysis: {
    tempo: number
    key: string
    timeSignature: string
    complexity: number
  }
  recommendations: {
    instruments: string[]
    effects: string[]
    arrangements: string[]
  }
}

interface AIInsight {
  id: string
  type: 'trend' | 'opportunity' | 'improvement'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionable: boolean
  category: string
}

interface MusicTrend {
  genre: string
  growth: number
  popularity: number
  description: string
  keyElements: string[]
}

export default function AIAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentAnalysis, setCurrentAnalysis] = useState<AIMusicAnalysis | null>(null)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [trends, setTrends] = useState<MusicTrend[]>([])
  const [selectedTrack, setSelectedTrack] = useState('')

  // Mock data for demonstration
  const mockAnalysis: AIMusicAnalysis = {
    genre: 'Electronic Dance Music',
    confidence: 92,
    characteristics: ['Synth-heavy', '4/4 rhythm', 'Build-up structure', 'Drop sections'],
    similarArtists: ['Calvin Harris', 'David Guetta', 'Swedish House Mafia'],
    moodAnalysis: {
      primary: 'Energetic',
      secondary: ['Uplifting', 'Anthemic'],
      energy: 8.5,
      valence: 7.2
    },
    technicalAnalysis: {
      tempo: 128,
      key: 'C Minor',
      timeSignature: '4/4',
      complexity: 6.8
    },
    recommendations: {
      instruments: ['Synthesizer', 'Drum Machine', 'Sub Bass', 'Vocal Chops'],
      effects: ['Reverb', 'Delay', 'Sidechain Compression', 'Filter Sweeps'],
      arrangements: ['Build-up to Drop', 'Bridge Section', 'Extended Outro']
    }
  }

  const mockInsights: AIInsight[] = [
    {
      id: '1',
      type: 'trend',
      title: 'Melodic Techno Rising',
      description: 'Melodic techno tracks are seeing 45% increased engagement on streaming platforms',
      impact: 'high',
      actionable: true,
      category: 'Genre Trends'
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Vocal Sample Gap',
      description: 'Your style could benefit from more vocal samples - 80% of top tracks use them',
      impact: 'medium',
      actionable: true,
      category: 'Production'
    },
    {
      id: '3',
      type: 'improvement',
      title: 'Bass Frequency Optimization',
      description: 'Sub-bass frequencies could be better balanced for club systems',
      impact: 'medium',
      actionable: true,
      category: 'Mixing'
    }
  ]

  const mockTrends: MusicTrend[] = [
    {
      genre: 'Melodic Techno',
      growth: 45,
      popularity: 78,
      description: 'Emotional melodies with driving techno beats',
      keyElements: ['Arpeggios', 'Reverb-drenched pads', 'Groovy basslines']
    },
    {
      genre: 'Future Bass',
      growth: 32,
      popularity: 82,
      description: 'Heavy bass with melodic elements and trap influences',
      keyElements: ['Supersaw chords', 'Vocal chops', '808 bass']
    },
    {
      genre: 'Organic House',
      growth: 28,
      popularity: 65,
      description: 'Natural sounds blended with house rhythms',
      keyElements: ['Live percussion', 'Acoustic elements', 'Nature samples']
    }
  ]

  useEffect(() => {
    // Initialize with mock data
    setInsights(mockInsights)
    setTrends(mockTrends)
  }, [])

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    // Simulate AI analysis progress
    const progressSteps = [
      { step: 'Analyzing audio spectrum...', progress: 20 },
      { step: 'Detecting genre patterns...', progress: 40 },
      { step: 'Analyzing mood and energy...', progress: 60 },
      { step: 'Comparing with market trends...', progress: 80 },
      { step: 'Generating recommendations...', progress: 100 }
    ]
    
    for (const { step, progress } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setAnalysisProgress(progress)
    }
    
    setCurrentAnalysis(mockAnalysis)
    setIsAnalyzing(false)
  }

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-4 w-4" />
      case 'opportunity': return <Lightbulb className="h-4 w-4" />
      case 'improvement': return <Target className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend': return 'bg-green-600/20 text-green-400 border-green-600/50'
      case 'opportunity': return 'bg-blue-600/20 text-blue-400 border-blue-600/50'
      case 'improvement': return 'bg-orange-600/20 text-orange-400 border-orange-600/50'
      default: return 'bg-purple-600/20 text-purple-400 border-purple-600/50'
    }
  }

  const getImpactColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Music Analysis</h1>
          <p className="text-purple-200">Advanced AI-powered music analysis and recommendations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Analysis Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analysis Input */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Music Analysis Engine
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Upload or select a track for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/30 rounded-lg p-6 text-center border-2 border-dashed border-white/20">
                  <Music className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-white mb-2">Drop audio file here or click to browse</p>
                  <p className="text-purple-200 text-sm mb-4">Supports MP3, WAV, FLAC (max 50MB)</p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Select File
                  </Button>
                </div>

                <Button 
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-pulse" />
                      Analyzing Music...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Run AI Analysis
                    </>
                  )}
                </Button>

                {isAnalyzing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-purple-200 text-sm">
                      <span>Analysis Progress</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="bg-white/20" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {currentAnalysis && (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Genre Detection */}
                  <div>
                    <h3 className="text-white font-semibold mb-3">Genre Detection</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-200">Primary Genre</span>
                      <Badge className="bg-purple-600">{currentAnalysis.genre}</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-purple-200">Confidence</span>
                      <span className="text-white font-medium">{currentAnalysis.confidence}%</span>
                    </div>
                    <Progress value={currentAnalysis.confidence} className="bg-white/20 mb-3" />
                    <div className="flex flex-wrap gap-2">
                      {currentAnalysis.characteristics.map(char => (
                        <Badge key={char} variant="secondary" className="bg-white/10 text-purple-200">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  {/* Mood Analysis */}
                  <div>
                    <h3 className="text-white font-semibold mb-3">Mood Analysis</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-purple-200 text-sm">Primary Mood</p>
                        <p className="text-white font-medium">{currentAnalysis.moodAnalysis.primary}</p>
                      </div>
                      <div>
                        <p className="text-purple-200 text-sm">Secondary Moods</p>
                        <div className="flex flex-wrap gap-1">
                          {currentAnalysis.moodAnalysis.secondary.map(mood => (
                            <Badge key={mood} variant="secondary" className="bg-white/10 text-purple-200 text-xs">
                              {mood}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-purple-200 text-sm">Energy Level</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={currentAnalysis.moodAnalysis.energy * 10} className="flex-1 bg-white/20" />
                          <span className="text-white text-sm">{currentAnalysis.moodAnalysis.energy}/10</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-purple-200 text-sm">Valence (Positivity)</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={currentAnalysis.moodAnalysis.valence * 10} className="flex-1 bg-white/20" />
                          <span className="text-white text-sm">{currentAnalysis.moodAnalysis.valence}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  {/* Technical Analysis */}
                  <div>
                    <h3 className="text-white font-semibold mb-3">Technical Analysis</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-purple-200 text-sm">Tempo</p>
                        <p className="text-white font-medium">{currentAnalysis.technicalAnalysis.tempo} BPM</p>
                      </div>
                      <div>
                        <p className="text-purple-200 text-sm">Key</p>
                        <p className="text-white font-medium">{currentAnalysis.technicalAnalysis.key}</p>
                      </div>
                      <div>
                        <p className="text-purple-200 text-sm">Time Signature</p>
                        <p className="text-white font-medium">{currentAnalysis.technicalAnalysis.timeSignature}</p>
                      </div>
                      <div>
                        <p className="text-purple-200 text-sm">Complexity</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={currentAnalysis.technicalAnalysis.complexity * 10} className="flex-1 bg-white/20" />
                          <span className="text-white text-sm">{currentAnalysis.technicalAnalysis.complexity}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  {/* AI Recommendations */}
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-purple-200 text-sm mb-2">Recommended Instruments</p>
                        <div className="space-y-1">
                          {currentAnalysis.recommendations.instruments.map(instrument => (
                            <div key={instrument} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full" />
                              <span className="text-white text-sm">{instrument}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-purple-200 text-sm mb-2">Suggested Effects</p>
                        <div className="space-y-1">
                          {currentAnalysis.recommendations.effects.map(effect => (
                            <div key={effect} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <span className="text-white text-sm">{effect}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-purple-200 text-sm mb-2">Arrangement Ideas</p>
                        <div className="space-y-1">
                          {currentAnalysis.recommendations.arrangements.map(arrangement => (
                            <div key={arrangement} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-white text-sm">{arrangement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  AI Insights
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Actionable insights for your music
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 space-y-3">
                  {insights.map(insight => (
                    <div key={insight.id} className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getInsightIcon(insight.type)}
                          <span className="text-white font-medium text-sm">{insight.title}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getImpactColor(insight.impact)}`} />
                      </div>
                      <p className="text-purple-200 text-xs mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-white/10 text-purple-200 text-xs">
                          {insight.category}
                        </Badge>
                        {insight.actionable && (
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-1">
                            <Target className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Market Trends */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Market Trends
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Current music industry trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trends.map(trend => (
                  <div key={trend.genre} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{trend.genre}</span>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-600/20 text-green-400">
                          +{trend.growth}%
                        </Badge>
                        <div className="w-16 bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${trend.popularity}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-purple-200 text-xs">{trend.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {trend.keyElements.map(element => (
                        <Badge key={element} variant="secondary" className="bg-white/10 text-purple-200 text-xs">
                          {element}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Performance Stats */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  AI Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-200">Analyses Completed</span>
                  <span className="text-white font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Accuracy Rate</span>
                  <span className="text-white font-medium">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Avg. Processing Time</span>
                  <span className="text-white font-medium">2.3s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Models Trained</span>
                  <span className="text-white font-medium">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Last Updated</span>
                  <span className="text-white font-medium">2 hours ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
