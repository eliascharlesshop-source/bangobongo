'use client'

import { Zap, Music, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Track {
  id: string
  name: string
  instrument: string
  volume: number
}

interface InstrumentPanelProps {
  selectedInstrument: string
  setSelectedInstrument: (instrument: string) => void
  tracks: Track[]
  setTracks: (tracks: Track[]) => void
  currentTrack: string | null
  setCurrentTrack: (trackId: string | null) => void
}

const instruments = [
  { id: 'synth', name: 'Synth', icon: Zap, color: 'text-primary' },
  { id: 'drums', name: 'Drums', icon: Music, color: 'text-accent' },
  { id: 'bass', name: 'Bass', icon: Music, color: 'text-secondary' },
  { id: 'piano', name: 'Piano', icon: Music, color: 'text-primary' },
]

export function InstrumentPanel({
  selectedInstrument,
  setSelectedInstrument,
  tracks,
  setTracks,
  currentTrack,
  setCurrentTrack,
}: InstrumentPanelProps) {
  const handleAddTrack = () => {
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      name: `Track ${tracks.length + 1}`,
      instrument: selectedInstrument,
      volume: 80,
    }
    setTracks([...tracks, newTrack])
    setCurrentTrack(newTrack.id)
  }

  const handleDeleteTrack = (id: string) => {
    const newTracks = tracks.filter(t => t.id !== id)
    setTracks(newTracks)
    if (currentTrack === id) {
      setCurrentTrack(newTracks[0]?.id || null)
    }
  }

  return (
    <div className="w-64 chrome-ocean rounded-lg p-4 flex flex-col gap-4 overflow-hidden">
      {/* Instruments Selector */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Instruments</h3>
        <div className="grid grid-cols-2 gap-2">
          {instruments.map(inst => {
            const Icon = inst.icon
            return (
              <button
                key={inst.id}
                onClick={() => setSelectedInstrument(inst.id)}
                className={`p-3 rounded-lg transition-all duration-200 flex flex-col items-center gap-1 ${
                  selectedInstrument === inst.id
                    ? 'chrome-mint'
                    : 'bg-card/50 hover:bg-card/80 border border-primary/10'
                }`}
              >
                <Icon className={`h-5 w-5 ${selectedInstrument === inst.id ? 'text-primary-foreground' : inst.color}`} />
                <span className={`text-xs font-medium ${selectedInstrument === inst.id ? 'text-primary-foreground' : ''}`}>
                  {inst.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-px bg-primary/10" />

      {/* Tracks List */}
      <div className="space-y-2 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Tracks</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleAddTrack}
            className="h-6 w-6 p-0 hover:bg-primary/20"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 pr-4">
            {tracks.map(track => {
              const instrument = instruments.find(i => i.id === track.instrument)
              const Icon = instrument?.icon || Music
              return (
                <button
                  key={track.id}
                  onClick={() => setCurrentTrack(track.id)}
                  className={`w-full p-2 rounded-lg transition-all duration-200 flex items-center justify-between text-left ${
                    currentTrack === track.id
                      ? 'chrome-mint'
                      : 'bg-card/40 hover:bg-card/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`h-4 w-4 flex-shrink-0 ${currentTrack === track.id ? 'text-primary-foreground' : ''}`} />
                    <span className={`text-sm font-medium truncate ${currentTrack === track.id ? 'text-primary-foreground' : ''}`}>
                      {track.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteTrack(track.id)
                    }}
                    className="opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Samples</h3>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {['Kick', 'Snare', 'HiHat', 'Loop'].map(sample => (
            <button
              key={sample}
              className="p-2 bg-card/30 hover:bg-card/60 rounded text-muted-foreground hover:text-foreground transition-colors text-left truncate"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
