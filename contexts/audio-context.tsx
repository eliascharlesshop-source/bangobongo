"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"
import type { Track } from "@/types"

// High-quality sample tracks data - removed
const sampleTracks: Track[] = []

type PlayerMode = "full" | "thin" | "floating"

interface AudioContextType {
  // Tracks and current track
  tracks: Track[]
  currentTrackIndex: number
  setCurrentTrackIndex: (index: number) => void
  currentTrack: Track | null

  // Playback state
  isPlaying: boolean
  togglePlayPause: () => void
  play: () => void
  pause: () => void
  isLoading: boolean

  // Navigation
  playNext: () => void
  playPrevious: () => void

  // Time and progress
  currentTime: number
  duration: number
  seek: (time: number) => void
  buffered: number

  // Volume and audio quality
  volume: number
  setVolume: (volume: number) => void
  isMuted: boolean
  toggleMute: () => void
  audioQuality: 'high' | 'medium' | 'low'
  setAudioQuality: (quality: 'high' | 'medium' | 'low') => void

  // Player settings
  isRepeat: boolean
  toggleRepeat: () => void
  isShuffle: boolean
  toggleShuffle: () => void

  // Player UI
  playerMode: PlayerMode
  setPlayerMode: (mode: PlayerMode) => void
  togglePlayerMode: () => void
  showPlayer: boolean
  setShowPlayer: (show: boolean) => void

  // Queue management
  queue: Track[]
  addToQueue: (track: Track) => void
  removeFromQueue: (trackId: string) => void
  clearQueue: () => void

  // Playlist management
  playTrack: (trackIndex: number) => void
  setTracks: (tracks: Track[]) => void

  // Advanced features
  crossfadeTime: number
  setCrossfadeTime: (time: number) => void
  equalizer: EqualizerSettings
  setEqualizer: (settings: EqualizerSettings) => void
  // Alias exports for convenience
  equalizerSettings: EqualizerSettings
  updateEqualizer: (frequency: string, gain: number) => void
}

interface EqualizerSettings {
  '32': number
  '64': number
  '125': number
  '250': number
  '500': number
  '1000': number
  '2000': number
  '4000': number
  '8000': number
  '16000': number
  [key: string]: number
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // Tracks and current track state
  const [tracks, setTracks] = useState<Track[]>(sampleTracks)
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0)
  const [queue, setQueue] = useState<Track[]>([])

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [buffered, setBuffered] = useState<number>(0)

  // Volume and quality state
  const [volume, setVolume] = useState<number>(80)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [audioQuality, setAudioQuality] = useState<'high' | 'medium' | 'low'>('high')

  // Player settings
  const [isRepeat, setIsRepeat] = useState<boolean>(false)
  const [isShuffle, setIsShuffle] = useState<boolean>(false)
  const [crossfadeTime, setCrossfadeTime] = useState<number>(3)

  // Equalizer settings
  const [equalizer, setEqualizer] = useState<EqualizerSettings>({
    '32': 0,
    '64': 0,
    '125': 0,
    '250': 0,
    '500': 0,
    '1000': 0,
    '2000': 0,
    '4000': 0,
    '8000': 0,
    '16000': 0
  })

  // Player UI state
  const [playerMode, setPlayerMode] = useState<PlayerMode>("thin")
  const [showPlayer, setShowPlayer] = useState<boolean>(true)

  // Audio element and Web Audio API refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const analyserNodeRef = useRef<AnalyserNode | null>(null)
  const equalizerNodesRef = useRef<BiquadFilterNode[]>([])
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)

  // Current track
  const currentTrack = tracks[currentTrackIndex] || null

  // Initialize Web Audio API
  const initializeWebAudio = useCallback(() => {
    if (typeof window === 'undefined' || audioContextRef.current) return

    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Create gain node for volume control
      gainNodeRef.current = audioContextRef.current.createGain()

      // Create analyser for visualizations
      analyserNodeRef.current = audioContextRef.current.createAnalyser()
      analyserNodeRef.current.fftSize = 256

      // Create 10-band equalizer
      const frequencies = [60, 170, 350, 1000, 3500, 10000, 16000, 22000]
      equalizerNodesRef.current = frequencies.map((freq, index) => {
        const filter = audioContextRef.current!.createBiquadFilter()
        if (index === 0) {
          filter.type = 'lowshelf'
        } else if (index === frequencies.length - 1) {
          filter.type = 'highshelf'
        } else {
          filter.type = 'peaking'
          filter.Q.value = 1
        }
        filter.frequency.value = freq
        filter.gain.value = 0 // Will be set by equalizer updates
        return filter
      })

      // Connect audio chain
      if (audioRef.current && !sourceNodeRef.current) {
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)

        // Chain: source -> equalizer -> gain -> analyser -> destination
        let previousNode: AudioNode = sourceNodeRef.current

        equalizerNodesRef.current.forEach(filter => {
          previousNode.connect(filter)
          previousNode = filter
        })

        previousNode.connect(gainNodeRef.current)
        gainNodeRef.current.connect(analyserNodeRef.current)
        analyserNodeRef.current.connect(audioContextRef.current.destination)
      }
    } catch (error) {
      console.error('Failed to initialize Web Audio API:', error)
    }
  }, [equalizer])

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
      audioRef.current.crossOrigin = "anonymous"
      audioRef.current.preload = "metadata"

      // Set initial volume
      if (audioRef.current) {
        audioRef.current.volume = volume / 100
      }

      // Initialize Web Audio API
      initializeWebAudio()

      // Clean up on unmount
      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
        if (audioContextRef.current) {
          audioContextRef.current.close()
          audioContextRef.current = null
        }
      }
    }
  }, [initializeWebAudio, volume])

  // Update audio source when current track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      setIsLoading(true)

      // Check if we have a valid audio URL
      if (!currentTrack.audioUrl || currentTrack.audioUrl === '' || currentTrack.audioUrl === null) {
        console.warn(`Track "${currentTrack.title}" has no audio file - UI only mode`)
        setIsLoading(false)
        setIsPlaying(false)
        // Still set duration for UI purposes
        setDuration(currentTrack.duration)
        // Clear the audio source to prevent errors
        audioRef.current.src = ''
        audioRef.current.removeAttribute('src')
        return
      }

      // Use audioUrl if available, otherwise fallback to constructed path
      const audioSrc = currentTrack.audioUrl || `/audio/${currentTrack.id}.mp3`

      // Only set src if we have a valid URL
      if (audioSrc && audioSrc !== '') {
        audioRef.current.src = audioSrc
      }

      // Set the duration from the track data
      setDuration(currentTrack.duration)

      // Handle audio events
      const handleLoadStart = () => setIsLoading(true)
      const handleCanPlay = () => setIsLoading(false)
      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration || currentTrack.duration)
        }
        setIsLoading(false)
      }
      const handleProgress = () => {
        if (audioRef.current && audioRef.current.buffered.length > 0) {
          const bufferedEnd = audioRef.current.buffered.end(audioRef.current.buffered.length - 1)
          const duration = audioRef.current.duration || currentTrack.duration
          setBuffered((bufferedEnd / duration) * 100)
        }
      }
      const handleError = (e: Event) => {
        const audio = e.target as HTMLAudioElement

        setIsLoading(false)
        setIsPlaying(false)

        // Show user-friendly message only for unexpected errors
        if (!audio?.src || audio.src === '') {
          console.info('Track has no audio file - UI demonstration mode active')
          return
        }

        // Log error details only in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Audio file not found:', audio.src.split('/').pop(), '- UI will continue to work')
        }
      }

      audioRef.current.addEventListener("loadstart", handleLoadStart)
      audioRef.current.addEventListener("canplay", handleCanPlay)
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)
      audioRef.current.addEventListener("progress", handleProgress)
      audioRef.current.addEventListener("error", handleError)

      // Resume Web Audio Context if suspended
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume()
      }

      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
          setIsLoading(false)
        })
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("loadstart", handleLoadStart)
          audioRef.current.removeEventListener("canplay", handleCanPlay)
          audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata)
          audioRef.current.removeEventListener("progress", handleProgress)
          audioRef.current.removeEventListener("error", handleError)
        }
      }
    }
  }, [currentTrack, currentTrackIndex, isPlaying])

  // Update playback state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
          setIsLoading(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Update volume with Web Audio API
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume / 100
    } else if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  // Update equalizer settings
  useEffect(() => {
    if (equalizerNodesRef.current.length > 0) {
      const frequencies = ['32', '64', '125', '250', '500', '1000', '2000', '4000', '8000', '16000']
      frequencies.forEach((freq, index) => {
        if (equalizerNodesRef.current[index] && equalizer[freq] !== undefined) {
          equalizerNodesRef.current[index].gain.value = equalizer[freq]
        }
      })
    }
  }, [equalizer])

  // Handle time updates
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
    }

    const handleEnded = () => {
      if (isRepeat) {
        // Repeat the current track
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(console.error)
        }
      } else {
        // Play next track
        playNext()
      }
    }

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate)
      audioRef.current.addEventListener("ended", handleEnded)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate)
        audioRef.current.removeEventListener("ended", handleEnded)
      }
    }
  }, [isRepeat])

  // Play/pause functions
  const play = useCallback(() => {
    if (!currentTrack?.audioUrl) {
      console.warn('Cannot play track without audio file - UI demonstration mode')
      return
    }
    setIsPlaying(true)
  }, [currentTrack])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const togglePlayPause = useCallback(() => {
    if (!currentTrack?.audioUrl) {
      console.warn('Cannot play track without audio file - UI demonstration mode')
      return
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, currentTrack])

  // Navigation functions
  const playNext = useCallback(() => {
    if (queue.length > 0) {
      // Play from queue
      const nextTrack = queue[0]
      const nextTrackIndex = tracks.findIndex((track) => track.id === nextTrack.id)

      if (nextTrackIndex !== -1) {
        setCurrentTrackIndex(nextTrackIndex)
      } else {
        // If track is not in the main tracks list, add it
        setTracks([...tracks, nextTrack])
        setCurrentTrackIndex(tracks.length)
      }

      // Remove from queue
      setQueue(queue.slice(1))
    } else if (isShuffle) {
      // Play random track
      const randomIndex = Math.floor(Math.random() * tracks.length)
      setCurrentTrackIndex(randomIndex)
    } else {
      // Play next track in order
      setCurrentTrackIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1))
    }
  }, [queue, tracks, isShuffle])

  const playPrevious = useCallback(() => {
    if (currentTime > 3) {
      // If more than 3 seconds into the song, restart the current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
    } else {
      // Otherwise go to previous track
      setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1))
    }
  }, [currentTime, tracks.length])

  // Seek function with smooth crossfading
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  // Toggle functions
  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted)
  }, [isMuted])

  const toggleRepeat = useCallback(() => {
    setIsRepeat(!isRepeat)
  }, [isRepeat])

  const toggleShuffle = useCallback(() => {
    setIsShuffle(!isShuffle)
  }, [isShuffle])

  const togglePlayerMode = useCallback(() => {
    setPlayerMode((prev) => {
      if (prev === "thin") return "full"
      if (prev === "full") return "floating"
      return "thin"
    })
  }, [])

  // Queue management
  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track])
  }, [])

  const removeFromQueue = useCallback((trackId: string) => {
    setQueue(prev => prev.filter((track) => track.id !== trackId))
  }, [])

  const clearQueue = useCallback(() => {
    setQueue([])
  }, [])

  // Play specific track
  const playTrack = useCallback((trackIndex: number) => {
    setCurrentTrackIndex(trackIndex)
    setIsPlaying(true)
  }, [])

  // Update individual equalizer band
  const updateEqualizer = useCallback((frequency: string, gain: number) => {
    setEqualizer(prev => ({
      ...prev,
      [frequency]: gain
    }))
  }, [])

  const value = {
    tracks,
    setTracks,
    currentTrackIndex,
    setCurrentTrackIndex,
    currentTrack,
    isPlaying,
    isLoading,
    togglePlayPause,
    play,
    pause,
    playNext,
    playPrevious,
    currentTime,
    duration,
    buffered,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    audioQuality,
    setAudioQuality,
    isRepeat,
    toggleRepeat,
    isShuffle,
    toggleShuffle,
    playerMode,
    setPlayerMode,
    togglePlayerMode,
    showPlayer,
    setShowPlayer,
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    playTrack,
    crossfadeTime,
    setCrossfadeTime,
    // Equalizer exports
    equalizer,
    setEqualizer,
    equalizerSettings: equalizer,
    updateEqualizer,
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

// Custom hook to use the audio context
export function useAudio() {
  const context = useContext(AudioContext)

  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }

  return context
}
