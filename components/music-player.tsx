"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { Track } from "@/types"

interface MusicPlayerProps {
  tracks: Track[]
  initialTrackIndex?: number
}

export default function MusicPlayer({ tracks, initialTrackIndex = 0 }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(initialTrackIndex)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [volume, setVolume] = useState<number>(80)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isRepeat, setIsRepeat] = useState<boolean>(false)
  const [isShuffle, setIsShuffle] = useState<boolean>(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentTrack = tracks[currentTrackIndex]

  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentTrackIndex])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume / 100
  }, [volume])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.muted = isMuted
  }, [isMuted])

  const handlePlayPause = (): void => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = (): void => {
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

  const handleNext = (): void => {
    if (isShuffle) {
      // Play a random track
      const randomIndex = Math.floor(Math.random() * tracks.length)
      setCurrentTrackIndex(randomIndex)
    } else {
      // Play next track
      setCurrentTrackIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1))
    }
  }

  const handleTimeUpdate = (): void => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleTrackEnded = (): void => {
    if (isRepeat) {
      // Repeat the current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(console.error)
      }
    } else {
      // Play next track
      handleNext()
    }
  }

  const handleSeek = (value: number[]): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-background-lighter rounded-lg p-4 shadow-lg border border-accent">
      <audio
        ref={audioRef}
        src={`/audio/${currentTrack.id}.mp3`}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      <div className="flex items-center mb-4">
        <div className="relative w-16 h-16 mr-4 rounded overflow-hidden">
          <Image
            src={currentTrack.albumArt || "/placeholder.svg?height=300&width=300"}
            alt={currentTrack.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{currentTrack.title}</h3>
          <p className="text-sm text-muted-foreground">{currentTrack.artist || "BangoBongo"}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="music-player-progress">
          <div
            className="music-player-progress-bar"
            style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsShuffle(!isShuffle)}
          className={isShuffle ? "text-primary" : "text-muted-foreground"}
        >
          <Shuffle className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handlePrevious}>
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            className="bg-primary text-background hover:bg-secondary rounded-full h-10 w-10 flex items-center justify-center"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={handleNext}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsRepeat(!isRepeat)}
          className={isRepeat ? "text-primary" : "text-muted-foreground"}
        >
          <Repeat className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
          {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>

        <Slider
          value={[volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => {
            setVolume(value[0])
            if (value[0] > 0 && isMuted) {
              setIsMuted(false)
            }
          }}
          className="w-24"
        />
      </div>
    </div>
  )
}
