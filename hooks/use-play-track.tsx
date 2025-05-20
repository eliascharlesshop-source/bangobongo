"use client"

import { useAudio } from "@/contexts/audio-context"
import type { Track } from "@/types"

export function usePlayTrack() {
  const { tracks, setTracks, playTrack, addToQueue, setShowPlayer } = useAudio()

  // Play a track by ID
  const playTrackById = (trackId: string) => {
    const trackIndex = tracks.findIndex((track) => track.id === trackId)

    if (trackIndex !== -1) {
      playTrack(trackIndex)
      setShowPlayer(true)
    }
  }

  // Play a track by object (useful when the track might not be in the current tracks list)
  const playTrackByObject = (track: Track) => {
    const trackIndex = tracks.findIndex((t) => t.id === track.id)

    if (trackIndex !== -1) {
      // Track exists in the list
      playTrack(trackIndex)
    } else {
      // Track doesn't exist, add it to the list
      setTracks([...tracks, track])
      playTrack(tracks.length) // Play the newly added track
    }

    setShowPlayer(true)
  }

  // Add a track to the queue
  const queueTrack = (track: Track) => {
    addToQueue(track)
  }

  return {
    playTrackById,
    playTrackByObject,
    queueTrack,
  }
}
