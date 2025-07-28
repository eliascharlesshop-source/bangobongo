"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useAudio } from "@/contexts/audio-context"
import type { Track } from "@/types"

interface MusicPlayerProps {
  tracks?: Track[]
  initialTrackIndex?: number
  showAdvancedControls?: boolean
}

export default function MusicPlayer({ 
  tracks: propTracks, 
  initialTrackIndex = 0,
  showAdvancedControls = false 
}: MusicPlayerProps) {
  const {
    tracks: contextTracks,
    currentTrack,
    isPlaying,
    togglePlayPause,
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
    isLoading,
    buffered,
    audioQuality,
    equalizerSettings,
    updateEqualizer,
  } = useAudio()

  const [showEqualizer, setShowEqualizer] = useState(false)

  // Use tracks from props or context
  const tracks = propTracks || contextTracks
  const activeTrack = currentTrack || tracks[initialTrackIndex]

  if (!activeTrack) {
    return (
      <div className="bg-background-lighter rounded-lg p-4 shadow-lg border border-accent">
        <div className="text-center text-muted-foreground">
          <p>No tracks available</p>
        </div>
      </div>
    )
  }

  const handleSeek = (value: number[]): void => {
    seek(value[0])
  }

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-background-lighter rounded-lg p-4 shadow-lg border border-accent">
      <div className="flex items-center mb-4">
        <div className="relative w-16 h-16 mr-4 rounded overflow-hidden">
          <Image
            src={activeTrack.albumArt || "/placeholder.svg?height=300&width=300"}
            alt={activeTrack.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{activeTrack.title}</h3>
            {audioQuality && (
              <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">
                {audioQuality}
              </span>
            )}
            {isLoading && (
              <div className="h-3 w-3 border border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{activeTrack.artist || "BangoBongo"}</p>
          {activeTrack.genre && (
            <p className="text-xs text-muted-foreground/80">{activeTrack.genre}</p>
          )}
        </div>

        {showAdvancedControls && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEqualizer(!showEqualizer)}
            className={showEqualizer ? "text-primary" : "text-muted-foreground"}
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="relative h-2 bg-accent rounded-full overflow-hidden">
          {/* Buffer indicator */}
          <div
            className="absolute inset-0 bg-primary/30 rounded-full transition-all duration-300"
            style={{ width: `${buffered}%` }}
          />
          {/* Progress bar */}
          <div
            className="absolute inset-0 bg-primary rounded-full transition-all duration-150"
            style={{
              width: `${
                duration || activeTrack.duration ? (currentTime / (duration || activeTrack.duration)) * 100 : 0
              }%`,
            }}
          />
        </div>

        <Slider
          value={[currentTime]}
          min={0}
          max={duration || activeTrack.duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="w-full"
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || activeTrack.duration)}</span>
        </div>
      </div>

      {/* Equalizer Controls */}
      {showEqualizer && showAdvancedControls && (
        <div className="mb-4 p-3 bg-background rounded border border-accent">
          <h4 className="text-sm font-medium mb-3">10-Band Equalizer</h4>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(equalizerSettings).map(([frequency, gain]) => (
              <div key={frequency} className="text-center">
                <div className="h-16 flex items-end">
                  <Slider
                    value={[gain]}
                    min={-12}
                    max={12}
                    step={0.5}
                    orientation="vertical"
                    onValueChange={(value) => updateEqualizer(frequency, value[0])}
                    className="h-full"
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {frequency}Hz
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                Object.keys(equalizerSettings).forEach(freq => updateEqualizer(freq, 0))
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleShuffle}
          className={isShuffle ? "text-primary" : "text-muted-foreground"}
        >
          <Shuffle className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={playPrevious}>
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            className="bg-primary text-background hover:bg-secondary rounded-full h-10 w-10 flex items-center justify-center"
            onClick={togglePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          <Button variant="ghost" size="icon" onClick={playNext}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRepeat}
          className={isRepeat ? "text-primary" : "text-muted-foreground"}
        >
          <Repeat className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={toggleMute}>
          {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>

        <Slider
          value={[volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => setVolume(value[0])}
          className="w-24"
        />

        <span className="text-xs text-muted-foreground min-w-[3ch]">
          {Math.round(volume)}%
        </span>
      </div>
    </div>
  )
}
