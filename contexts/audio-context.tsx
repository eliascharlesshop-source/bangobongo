"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useEffect } from "react"
import type { Track } from "@/types"

// Sample tracks data - in a real app, you might fetch this from an API
const sampleTracks: Track[] = [
  {
    id: "track1",
    title: "Neon Pulse",
    duration: 215, // 3:35
    albumArt: "/abstract-electronic-album-art.png",
    artist: "BangoBongo",
  },
  {
    id: "track2",
    title: "Digital Dreams",
    duration: 187, // 3:07
    albumArt: "/futuristic-electronic-album-art.png",
    artist: "BangoBongo",
  },
  {
    id: "track3",
    title: "Midnight Echo",
    duration: 243, // 4:03
    albumArt: "/dark-electronic-album-art.png",
    artist: "BangoBongo",
  },
  {
    id: "track4",
    title: "Cyber Horizons",
    duration: 198, // 3:18
    albumArt: "/cyberpunk-electronic-album.png",
    artist: "BangoBongo",
  },
  {
    id: "track5",
    title: "Synth Wave",
    duration: 227, // 3:47
    albumArt: "/synthwave-album-art.png",
    artist: "BangoBongo",
  },
]

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

  // Navigation
  playNext: () => void
  playPrevious: () => void

  // Time and progress
  currentTime: number
  duration: number
  seek: (time: number) => void

  // Volume
  volume: number
  setVolume: (volume: number) => void
  isMuted: boolean
  toggleMute: () => void

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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // Tracks and current track state
  const [tracks, setTracks] = useState<Track[]>(sampleTracks)
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0)
  const [queue, setQueue] = useState<Track[]>([])

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)

  // Volume state
  const [volume, setVolume] = useState<number>(80)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  // Player settings
  const [isRepeat, setIsRepeat] = useState<boolean>(false)
  const [isShuffle, setIsShuffle] = useState<boolean>(false)

  // Player UI state
  const [playerMode, setPlayerMode] = useState<PlayerMode>("thin")
  const [showPlayer, setShowPlayer] = useState<boolean>(true)

  // Audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Current track
  const currentTrack = tracks[currentTrackIndex] || null

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()

      // Set initial volume
      if (audioRef.current) {
        audioRef.current.volume = volume / 100
      }

      // Clean up on unmount
      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [])

  // Update audio source when current track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      // In a real app, this would be the path to actual audio files
      // For demo purposes, we'll use a non-existent path but handle the error gracefully
      audioRef.current.src = `/audio/${currentTrack.id}.mp3`

      // Set the duration from the track data since we might not be able to load the actual audio
      setDuration(currentTrack.duration)

      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
          // Continue with UI updates even if audio fails to play
          setIsPlaying(true)

          // Simulate playback by incrementing currentTime
          const playbackSimulator = setInterval(() => {
            setCurrentTime((prev) => {
              if (prev >= currentTrack.duration) {
                clearInterval(playbackSimulator)
                // Trigger the "ended" event handler manually
                if (isRepeat) {
                  setCurrentTime(0)
                  return 0
                } else {
                  playNext()
                  return 0
                }
              }
              return prev + 1
            })
          }, 1000)

          // Clean up the interval when component unmounts or track changes
          return () => clearInterval(playbackSimulator)
        })
      }

      // Update duration when metadata is loaded
      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration || currentTrack.duration)
        }
      }

      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata)
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
          // Continue with UI updates even if audio fails to play
          setIsPlaying(true)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Update mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

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
  const play = () => {
    setIsPlaying(true)
  }

  const pause = () => {
    setIsPlaying(false)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Navigation functions
  const playNext = () => {
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
  }

  const playPrevious = () => {
    if (currentTime > 3) {
      // If more than 3 seconds into the song, restart the current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
    } else {
      // Otherwise go to previous track
      setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1))
    }
  }

  // Seek function
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  // Toggle functions
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat)
  }

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle)
  }

  const togglePlayerMode = () => {
    setPlayerMode((prev) => {
      if (prev === "thin") return "full"
      if (prev === "full") return "floating"
      return "thin"
    })
  }

  // Queue management
  const addToQueue = (track: Track) => {
    setQueue([...queue, track])
  }

  const removeFromQueue = (trackId: string) => {
    setQueue(queue.filter((track) => track.id !== trackId))
  }

  const clearQueue = () => {
    setQueue([])
  }

  // Play specific track
  const playTrack = (trackIndex: number) => {
    setCurrentTrackIndex(trackIndex)
    setIsPlaying(true)
  }

  const value = {
    tracks,
    setTracks,
    currentTrackIndex,
    setCurrentTrackIndex,
    currentTrack,
    isPlaying,
    togglePlayPause,
    play,
    pause,
    playNext,
    playPrevious,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
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
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
      {/* Hidden audio element for time tracking */}
      <audio
        style={{ display: "none" }}
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
          }
        }}
        onEnded={() => {
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
        }}
      />
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
