'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  MoreHorizontal
} from 'lucide-react'

interface Track {
  id: string
  title: string
  artist: string
  url: string
  cover?: string
  duration: number
}

interface AudioPlayerProps {
  tracks: Track[]
  initialTrackIndex?: number
  className?: string
}

export function AudioPlayer({ tracks, initialTrackIndex = 0, className = '' }: AudioPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)

  const currentTrack = tracks[currentTrackIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime)
        animationFrameRef.current = requestAnimationFrame(updateTime)
      }
    }

    const handleLoadedMetadata = () => {
      setIsLoading(false)
      updateTime()
    }

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0
        audio.play()
      } else {
        handleNext()
      }
    }

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    const handleWaiting = () => {
      setIsLoading(true)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('waiting', handleWaiting)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('waiting', handleWaiting)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRepeat])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handlePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Audio playback error:', error)
      setIsPlaying(false)
    }
  }

  const handleNext = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length)
      setCurrentTrackIndex(randomIndex)
    } else {
      const nextIndex = (currentTrackIndex + 1) % tracks.length
      setCurrentTrackIndex(nextIndex)
    }
  }

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1
    setCurrentTrackIndex(prevIndex)
  }

  const handleSeek = (value: number) => {
    const audio = audioRef.current
    if (audio && audio.duration) {
      const newTime = (value / 100) * audio.duration
      audio.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = audioRef.current?.duration 
    ? (currentTime / audioRef.current.duration) * 100 
    : 0

  return (
    <div className={`audio-player ${className}`}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />
      
      <Card className="glass-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden group hover:shadow-purple-500/20 transition-all duration-500">
        <div className="p-6 space-y-4">
          {/* Track Info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                {currentTrack.cover ? (
                  <img 
                    src={currentTrack.cover} 
                    alt={currentTrack.title}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="text-white/80 text-2xl font-bold">
                    {currentTrack.title.charAt(0)}
                  </div>
                )}
              </div>
              {isPlaying && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg truncate group-hover:text-purple-300 transition-colors duration-300">
                {currentTrack.title}
              </h3>
              <p className="text-purple-200 text-sm truncate group-hover:text-purple-300 transition-colors duration-300">
                {currentTrack.artist}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`transition-all duration-300 ${
                  isLiked 
                    ? 'text-red-500 hover:text-red-400 hover:bg-red-500/10' 
                    : 'text-purple-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-2 bg-white/20 cursor-pointer group"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const percentage = (x / rect.width) * 100
                handleSeek(percentage)
              }}
            >
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-shadow duration-300" />
            </Progress>
            <div className="flex justify-between text-xs text-purple-200">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShuffle(!isShuffle)}
                className={`transition-all duration-300 ${
                  isShuffle 
                    ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/20' 
                    : 'text-purple-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRepeat(!isRepeat)}
                className={`transition-all duration-300 ${
                  isRepeat 
                    ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/20' 
                    : 'text-purple-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                className="text-purple-300 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                size="lg"
                onClick={handlePlayPause}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full w-12 h-12 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-1" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                className="text-purple-300 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="text-purple-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <div className="w-20">
                <Progress 
                  value={isMuted ? 0 : volume * 100} 
                  className="h-1.5 bg-white/20 cursor-pointer"
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const percentage = x / rect.width
                    setVolume(Math.max(0, Math.min(1, percentage)))
                    setIsMuted(false)
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Animated Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Ripple Effect */}
        {isPlaying && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute w-32 h-32 bg-purple-500/20 rounded-full animate-ping" />
            <div className="absolute w-32 h-32 bg-pink-500/20 rounded-full animate-ping" style={{ animationDelay: '200ms' }} />
          </div>
        )}
      </Card>
    </div>
  )
}

// Sample tracks for testing
export const sampleTracks: Track[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist: 'Alex Producer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 240
  },
  {
    id: '2',
    title: 'Dark Techno',
    artist: 'Techno Master',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 380
  },
  {
    id: '3',
    title: 'Acoustic Folk',
    artist: 'Folk Artist',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 250
  }
]
