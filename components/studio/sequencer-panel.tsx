'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface SequencerPanelProps {
  bpm: number
  isPlaying: boolean
  currentTrack: string | null
  selectedInstrument: string
}

const GRID_COLS = 16
const GRID_ROWS = 12

export function SequencerPanel({
  bpm,
  isPlaying,
  currentTrack,
  selectedInstrument,
}: SequencerPanelProps) {
  const [notes, setNotes] = useState<Set<string>>(new Set())
  const [octave, setOctave] = useState(3)

  const toggleNote = (row: number, col: number) => {
    const noteKey = `${row}-${col}`
    const newNotes = new Set(notes)
    if (newNotes.has(noteKey)) {
      newNotes.delete(noteKey)
    } else {
      newNotes.add(noteKey)
    }
    setNotes(newNotes)
  }

  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const currentNote = (row: number) => `${noteNames[row % 12]}${octave}`

  return (
    <div className="flex-1 chrome-glass rounded-lg p-4 flex flex-col gap-4 overflow-hidden backdrop-blur">
      {/* Sequencer Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
          {currentTrack ? 'Piano Roll' : 'Select Track'}
        </h3>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-muted-foreground">Octave</label>
          <div className="flex items-center gap-1 bg-card/50 rounded px-2 py-1 border border-primary/20">
            <button
              onClick={() => setOctave(Math.max(0, octave - 1))}
              className="text-xs text-primary hover:text-primary/80"
            >
              ▼
            </button>
            <span className="text-sm font-mono w-4 text-center">{octave}</span>
            <button
              onClick={() => setOctave(Math.min(8, octave + 1))}
              className="text-xs text-primary hover:text-primary/80"
            >
              ▲
            </button>
          </div>
        </div>
      </div>

      {/* Piano Roll Grid */}
      <div className="flex-1 overflow-auto border border-primary/10 rounded-lg bg-card/30 p-2">
        <div className="inline-block min-w-full">
          {/* Column Headers (Time Steps) */}
          <div className="flex mb-1">
            <div className="w-16 flex-shrink-0" />
            {Array.from({ length: GRID_COLS }).map((_, col) => (
              <div
                key={`header-${col}`}
                className="h-6 w-12 flex-shrink-0 flex items-center justify-center text-xs font-mono text-muted-foreground border-r border-primary/5"
              >
                {col + 1}
              </div>
            ))}
          </div>

          {/* Piano Roll Notes */}
          <div className="relative">
            {Array.from({ length: GRID_ROWS }).map((_, row) => (
              <div key={`row-${row}`} className="flex mb-1">
                {/* Note Label */}
                <div className="w-16 flex-shrink-0 flex items-center justify-end pr-2 text-xs font-mono text-muted-foreground bg-card/20 rounded-l">
                  {currentNote(row)}
                </div>

                {/* Grid Cells */}
                {Array.from({ length: GRID_COLS }).map((_, col) => {
                  const noteKey = `${row}-${col}`
                  const isActive = notes.has(noteKey)
                  const isPlayingColumn = isPlaying && col % 4 === Math.floor((Date.now() / 100) % 4)

                  return (
                    <button
                      key={noteKey}
                      onClick={() => currentTrack && toggleNote(row, col)}
                      className={`h-8 w-12 flex-shrink-0 border transition-all duration-75 ${
                        isActive
                          ? 'chrome-mint'
                          : isPlayingColumn
                            ? 'bg-primary/20 border-primary/40'
                            : 'bg-card/40 border-primary/10 hover:bg-card/60'
                      } ${!currentTrack ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      disabled={!currentTrack}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="text-xs text-muted-foreground">
        <p>Click to place notes • Drag to create melodies • Current BPM: {bpm}</p>
      </div>
    </div>
  )
}
