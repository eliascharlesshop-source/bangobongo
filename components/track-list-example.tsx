"use client"

import { usePlayTrack } from "@/hooks/use-play-track"
import { useAudio } from "@/contexts/audio-context"
import { Play, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function TrackListExample() {
  const { tracks, currentTrackIndex, isPlaying } = useAudio()
  const { playTrackById, queueTrack } = usePlayTrack()

  return (
    <div className="bg-background-lighter rounded-lg border border-accent p-4">
      <h2 className="text-xl font-bold mb-4">Track List</h2>

      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`flex items-center justify-between p-2 rounded-md ${
              currentTrackIndex === index ? "bg-accent/50" : "hover:bg-accent/20"
            }`}
          >
            <div className="flex items-center">
              <div className="relative w-10 h-10 mr-3 rounded overflow-hidden">
                <Image
                  src={track.albumArt || "/placeholder.svg?height=300&width=300"}
                  alt={track.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="font-medium text-sm">{track.title}</h3>
                <p className="text-xs text-muted-foreground">{track.artist || "BangoBongo"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => playTrackById(track.id)}>
                <Play className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => queueTrack(track)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
