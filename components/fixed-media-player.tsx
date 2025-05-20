"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Maximize2,
  Minimize2,
  X,
  Grip,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  ListMusic,
  Trash2,
  Music,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useAudio } from "@/contexts/audio-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function FixedMediaPlayer() {
  const {
    tracks,
    currentTrackIndex,
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
    playerMode,
    setPlayerMode,
    togglePlayerMode,
    showPlayer,
    setShowPlayer,
    queue,
    removeFromQueue,
    clearQueue,
    playTrack,
  } = useAudio()

  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [showQueue, setShowQueue] = useState<boolean>(false)

  const playerRef = useRef<HTMLDivElement | null>(null)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)

  // Handle dragging for floating mode
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStartRef.current) {
        const dx = e.clientX - dragStartRef.current.x
        const dy = e.clientY - dragStartRef.current.y
        dragStartRef.current = { x: e.clientX, y: e.clientY }

        setPosition((prev) => ({
          x: Math.max(0, Math.min(window.innerWidth - 320, prev.x + dx)),
          y: Math.max(0, Math.min(window.innerHeight - 80, prev.y + dy)),
        }))
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      dragStartRef.current = null
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  // Handle touch events for mobile dragging
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && dragStartRef.current && e.touches[0]) {
        const touch = e.touches[0]
        const dx = touch.clientX - dragStartRef.current.x
        const dy = touch.clientY - dragStartRef.current.y
        dragStartRef.current = { x: touch.clientX, y: touch.clientY }

        setPosition((prev) => ({
          x: Math.max(0, Math.min(window.innerWidth - 320, prev.x + dx)),
          y: Math.max(0, Math.min(window.innerHeight - 80, prev.y + dy)),
        }))
      }
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      dragStartRef.current = null
    }

    if (isDragging) {
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging])

  // Close queue when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showQueue && playerRef.current && !playerRef.current.contains(e.target as Node)) {
        setShowQueue(false)
      }
    }

    if (showQueue) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showQueue])

  const handleSeek = (value: number[]): void => {
    seek(value[0])
  }

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (playerMode !== "floating") return

    setIsDragging(true)

    if ("touches" in e) {
      const touch = e.touches[0]
      dragStartRef.current = { x: touch.clientX, y: touch.clientY }
    } else {
      dragStartRef.current = { x: e.clientX, y: e.clientY }
    }
  }

  const closePlayer = () => {
    setShowPlayer(false)
  }

  const toggleQueue = () => {
    setShowQueue(!showQueue)
  }

  const handlePlayTrack = (index: number) => {
    playTrack(index)
  }

  const handleTogglePlayerMode = () => {
    if (playerMode === "thin") {
      setPlayerMode("full")
    } else if (playerMode === "full") {
      setPlayerMode("thin")
    } else if (playerMode === "floating") {
      setPlayerMode("thin")
    }
  }

  if (!showPlayer || !currentTrack) return null

  if (playerMode === "floating") {
    return (
      <div
        ref={playerRef}
        className="fixed z-50 shadow-xl rounded-lg overflow-hidden border border-accent bg-background-lighter"
        style={{
          width: "320px",
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div
          className="bg-accent/30 p-2 cursor-move flex justify-between items-center"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="flex items-center">
            <Grip className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">Now Playing</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={togglePlayerMode}>
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={closePlayer}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className="relative w-12 h-12 mr-3 rounded overflow-hidden">
              <Image
                src={currentTrack.albumArt || "/placeholder.svg?height=300&width=300"}
                alt={currentTrack.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{currentTrack.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist || "BangoBongo"}</p>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="music-player-progress">
              <div
                className="music-player-progress-bar"
                style={{
                  width: `${
                    duration || currentTrack.duration ? (currentTime / (duration || currentTrack.duration)) * 100 : 0
                  }%`,
                }}
              />
            </div>

            <Slider
              value={[currentTime]}
              min={0}
              max={duration || currentTrack.duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="mt-1"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || currentTrack.duration)}</span>
            </div>
          </div>

          <div className="flex justify-center items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={playPrevious}>
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              className="bg-primary text-background hover:bg-secondary rounded-full h-10 w-10 flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={playNext}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={playerRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background-lighter border-t border-accent transition-all duration-300",
        playerMode === "full" ? "h-[250px]" : "h-[72px]",
      )}
    >
      {/* Queue Panel */}
      {showQueue && (
        <div className="absolute bottom-full left-0 right-0 bg-background-lighter border-t border-accent shadow-lg max-h-[70vh] overflow-y-auto">
          <div className="p-4 border-b border-accent flex justify-between items-center sticky top-0 bg-background-lighter z-10">
            <div className="flex items-center">
              <ListMusic className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Queue</h3>
              <span className="ml-2 text-xs bg-primary text-background px-2 py-0.5 rounded-full">
                {queue.length} tracks
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearQueue}
                className="text-xs h-8"
                disabled={queue.length === 0}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleQueue} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Now Playing</h4>
              <div className="flex items-center p-2 bg-accent/10 rounded-md">
                <div className="relative w-10 h-10 mr-3 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={currentTrack.albumArt || "/placeholder.svg?height=300&width=300"}
                    alt={currentTrack.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm truncate">{currentTrack.title}</h5>
                  <p className="text-xs text-muted-foreground truncate">{currentTrack.artist || "BangoBongo"}</p>
                </div>
                {isPlaying ? (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className="flex items-end space-x-0.5 h-4">
                      <div className="w-1 bg-primary animate-music-bar h-1"></div>
                      <div className="w-1 bg-primary animate-music-bar-2 h-3"></div>
                      <div className="w-1 bg-primary animate-music-bar h-2"></div>
                      <div className="w-1 bg-primary animate-music-bar-2 h-4"></div>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlayPause}
                    className="h-8 w-8 rounded-full hover:bg-background-darker"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {queue.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium mb-2">Up Next</h4>
                <div className="space-y-2">
                  {queue.map((track, index) => (
                    <div
                      key={`${track.id}-${index}`}
                      className="flex items-center p-2 hover:bg-accent/10 rounded-md group"
                    >
                      <div className="relative w-10 h-10 mr-3 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={track.albumArt || "/placeholder.svg?height=300&width=300"}
                          alt={track.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">{track.title}</h5>
                        <p className="text-xs text-muted-foreground truncate">{track.artist || "BangoBongo"}</p>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromQueue(track.id)}
                          className="h-8 w-8 rounded-full hover:bg-background-darker hover:text-red-400"
                          aria-label={`Remove ${track.title} from queue`}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Music className="h-12 w-12 mb-2 opacity-20" />
                <p className="text-sm">Your queue is empty</p>
                <p className="text-xs mt-1">Add tracks to your queue to listen to them next</p>
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Library</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className={cn(
                      "flex items-center p-2 hover:bg-accent/10 rounded-md cursor-pointer group",
                      index === currentTrackIndex && "bg-accent/20",
                    )}
                    onClick={() => handlePlayTrack(index)}
                  >
                    <div className="relative w-10 h-10 mr-3 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={track.albumArt || "/placeholder.svg?height=300&width=300"}
                        alt={track.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm truncate">{track.title}</h5>
                      <p className="text-xs text-muted-foreground truncate">{track.artist || "BangoBongo"}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{formatTime(track.duration)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thin Mode - Only show when not in full mode */}
      {playerMode !== "full" && (
        <div className="h-[72px] px-4 flex items-center">
          <div className="flex items-center flex-1 min-w-0">
            <div className="relative w-12 h-12 mr-3 rounded overflow-hidden">
              <Image
                src={currentTrack.albumArt || "/placeholder.svg?height=300&width=300"}
                alt={currentTrack.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 mr-4">
              <h3 className="font-semibold text-foreground truncate">{currentTrack.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist || "BangoBongo"}</p>
            </div>

            <div className="hidden sm:flex items-center space-x-2 mr-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleShuffle}
                className={cn(
                  "rounded-full transition-all hover:bg-background-darker hover:scale-105 active:scale-95",
                  isShuffle ? "text-primary bg-background-darker/40" : "text-muted-foreground",
                )}
                aria-label={isShuffle ? "Shuffle is on" : "Shuffle is off"}
                aria-pressed={isShuffle}
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={playPrevious}
                className="rounded-full transition-all hover:bg-background-darker hover:scale-105 active:scale-95"
                aria-label="Previous track"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                className="bg-primary text-background hover:bg-secondary rounded-full h-10 w-10 flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 mr-2"
                onClick={togglePlayPause}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={playNext}
                className="rounded-full transition-all hover:bg-background-darker hover:scale-105 active:scale-95"
                aria-label="Next track"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRepeat}
                className={cn(
                  "rounded-full transition-all hover:bg-background-darker hover:scale-105 active:scale-95",
                  isRepeat ? "text-primary bg-background-darker/40" : "text-muted-foreground",
                )}
                aria-label={isRepeat ? "Repeat is on" : "Repeat is off"}
                aria-pressed={isRepeat}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            <div className="hidden md:flex items-center space-x-2 mr-4 flex-1 max-w-xs">
              <div className="music-player-progress flex-1">
                <div
                  className="music-player-progress-bar"
                  style={{
                    width: `${
                      duration || currentTrack.duration ? (currentTime / (duration || currentTrack.duration)) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-2 mr-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="rounded-full transition-all hover:bg-background-darker hover:scale-105 active:scale-95"
                aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => {
                  setVolume(value[0])
                }}
                className="w-24"
              />
            </div>

            <div className="flex sm:hidden">
              <Button
                className="bg-primary text-background hover:bg-secondary rounded-full h-10 w-10 flex items-center justify-center mr-2 shadow-md transition-transform hover:scale-105 active:scale-95"
                onClick={togglePlayPause}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleQueue}
                className={cn(
                  "rounded-full transition-all hover:bg-background-darker hover:scale-105 active:scale-95 relative",
                  showQueue && "bg-background-darker/40 text-primary",
                )}
                aria-label="Show queue"
                aria-pressed={showQueue}
              >
                <ListMusic className="h-4 w-4" />
                {queue.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-xs text-background rounded-full h-4 w-4 flex items-center justify-center">
                    {queue.length}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleTogglePlayerMode}
                className="rounded-full transition-all hover:bg-background-darker hover:scale-105 active:scale-95"
                aria-label="Expand player"
              >
                {playerMode === "thin" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayerMode}
                className="rounded-full transition-all hover:bg-background-darker hover:scale-105 active:scale-95"
                aria-label="Toggle floating mode"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={closePlayer}
                className="rounded-full transition-all hover:bg-background-darker hover:text-red-400 hover:scale-105 active:scale-95"
                aria-label="Close player"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Full Mode */}
      {playerMode === "full" && (
        <div className="p-6 flex flex-col md:flex-row h-[178px]">
          <div className="md:w-1/3 flex items-center mb-4 md:mb-0">
            <div className="relative w-32 h-32 mr-4 rounded overflow-hidden">
              <Image
                src={currentTrack.albumArt || "/placeholder.svg?height=300&width=300"}
                alt={currentTrack.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{currentTrack.title}</h3>
              <p className="text-sm text-muted-foreground">{currentTrack.artist || "BangoBongo"}</p>
              <p className="text-xs text-muted-foreground mt-1">From: Album Name</p>
              <Button variant="link" size="sm" className="text-primary p-0 h-auto mt-2">
                <ExternalLink className="h-3 w-3 mr-1" />
                View Album
              </Button>
            </div>
          </div>

          <div className="md:w-2/3 md:pl-6 flex flex-col justify-center">
            <div className="space-y-2 mb-4">
              <div className="music-player-progress">
                <div
                  className="music-player-progress-bar"
                  style={{
                    width: `${
                      duration || currentTrack.duration ? (currentTime / (duration || currentTrack.duration)) * 100 : 0
                    }%`,
                  }}
                />
              </div>

              <Slider
                value={[currentTime]}
                min={0}
                max={duration || currentTrack.duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="mt-1"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || currentTrack.duration)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleShuffle}
                        className={cn(
                          "rounded-full h-12 w-12 transition-all hover:bg-background-darker hover:scale-105 active:scale-95",
                          isShuffle ? "text-primary bg-background-darker/40" : "text-muted-foreground",
                        )}
                        aria-label={isShuffle ? "Shuffle is on" : "Shuffle is off"}
                        aria-pressed={isShuffle}
                      >
                        <Shuffle className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{isShuffle ? "Shuffle: On" : "Shuffle: Off"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={playPrevious}
                        className="rounded-full h-12 w-12 transition-all hover:bg-background-darker hover:scale-105 active:scale-95"
                        aria-label="Previous track"
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Previous</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  className={cn(
                    "bg-primary text-background hover:bg-secondary rounded-full h-14 w-14 flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95",
                    isPlaying && "animate-pulse-slow",
                  )}
                  onClick={togglePlayPause}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-0.5" />}
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={playNext}
                        className="rounded-full h-12 w-12 transition-all hover:bg-background-darker hover:scale-105 active:scale-95"
                        aria-label="Next track"
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Next</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleRepeat}
                        className={cn(
                          "rounded-full h-12 w-12 transition-all hover:bg-background-darker hover:scale-105 active:scale-95",
                          isRepeat ? "text-primary bg-background-darker/40" : "text-muted-foreground",
                        )}
                        aria-label={isRepeat ? "Repeat is on" : "Repeat is off"}
                        aria-pressed={isRepeat}
                      >
                        <Repeat className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{isRepeat ? "Repeat: On" : "Repeat: Off"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center space-x-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleQueue}
                        className={cn(
                          "rounded-full h-12 w-12 transition-all hover:bg-background-darker hover:scale-105 active:scale-95 relative",
                          showQueue && "bg-background-darker/40 text-primary",
                        )}
                        aria-label="Show queue"
                        aria-pressed={showQueue}
                      >
                        <ListMusic className="h-5 w-5" />
                        {queue.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-xs text-background rounded-full h-4 w-4 flex items-center justify-center">
                            {queue.length}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Queue</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="rounded-full transition-all hover:bg-background-darker hover:scale-105 active:scale-95"
                    aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>

                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => {
                      setVolume(value[0])
                    }}
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {playerMode === "full" && (
        <div className="absolute top-4 right-4 flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleTogglePlayerMode}
                  className="rounded-full h-8 w-8 transition-all hover:bg-background-darker hover:scale-105 active:scale-95"
                  aria-label="Collapse player"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Collapse Player</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}
