'use client'

import { Volume2, Sliders, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'

interface Track {
  id: string
  name: string
  instrument: string
  volume: number
}

interface MixingPanelProps {
  tracks: Track[]
  setTracks: (tracks: Track[]) => void
  currentTrack: string | null
}

export function MixingPanel({
  tracks,
  setTracks,
  currentTrack,
}: MixingPanelProps) {
  const [muted, setMuted] = useState<Set<string>>(new Set())

  const updateTrack = (id: string, updates: Partial<Track>) => {
    setTracks(tracks.map(t => (t.id === id ? { ...t, ...updates } : t)))
  }

  const toggleMute = (id: string) => {
    const newMuted = new Set(muted)
    if (newMuted.has(id)) {
      newMuted.delete(id)
    } else {
      newMuted.add(id)
    }
    setMuted(newMuted)
  }

  return (
    <div className="w-72 chrome-ocean rounded-lg p-4 flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
        <Sliders className="h-4 w-4" />
        Mixing Console
      </h3>

      <div className="h-px bg-primary/10" />

      {/* Master Controls */}
      <div className="space-y-3 pb-4 border-b border-primary/10">
        <h4 className="text-xs font-semibold text-muted-foreground">Master</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-foreground">Level</span>
            <span className="text-xs font-mono text-primary">0dB</span>
          </div>
          <div className="w-full h-2 bg-card/50 rounded-full overflow-hidden">
            <div className="h-full w-1/2 chrome-mint rounded-full" />
          </div>
        </div>
      </div>

      {/* Tracks Mixer */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-4">
          {tracks.map(track => (
            <div
              key={track.id}
              className={`p-3 rounded-lg transition-all duration-200 space-y-3 ${
                currentTrack === track.id
                  ? 'bg-primary/10 border border-primary/20'
                  : 'bg-card/30 hover:bg-card/50'
              }`}
            >
              {/* Track Name */}
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-semibold text-foreground">{track.name}</h5>
                <button
                  onClick={() => toggleMute(track.id)}
                  className={`p-1.5 rounded transition-colors ${
                    muted.has(track.id)
                      ? 'bg-destructive/20 text-destructive'
                      : 'bg-card/50 hover:bg-card/80'
                  }`}
                >
                  {muted.has(track.id) ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Volume2 className="h-3 w-3" />
                    Volume
                  </span>
                  <span className="text-xs font-mono text-primary">{track.volume}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={track.volume}
                  onChange={(e) => updateTrack(track.id, { volume: Number(e.target.value) })}
                  className="w-full h-2 bg-card/50 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(113, 238, 151) 0%, rgb(113, 238, 151) ${track.volume}%, rgb(34, 58, 73) ${track.volume}%, rgb(34, 58, 73) 100%)`,
                  }}
                />
              </div>

              {/* Pan Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Pan</span>
                  <span className="text-xs font-mono text-primary">C</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">L</span>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    defaultValue={0}
                    className="flex-1 h-1.5 bg-card/50 rounded-full appearance-none cursor-pointer"
                  />
                  <span className="text-xs">R</span>
                </div>
              </div>

              {/* Effects Toggle */}
              <div className="flex gap-1">
                <button className="flex-1 text-xs py-1 px-2 rounded bg-card/30 hover:bg-card/60 transition-colors border border-primary/10">
                  Reverb
                </button>
                <button className="flex-1 text-xs py-1 px-2 rounded bg-card/30 hover:bg-card/60 transition-colors border border-primary/10">
                  Delay
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Info */}
      <div className="text-xs text-muted-foreground text-center border-t border-primary/10 pt-3">
        {tracks.length} track{tracks.length !== 1 ? 's' : ''} active
      </div>
    </div>
  )
}
