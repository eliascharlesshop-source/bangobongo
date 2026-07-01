'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import { EditorTopBar } from '@/components/studio/editor-top-bar'
import { InstrumentPanel } from '@/components/studio/instrument-panel'
import { SequencerPanel } from '@/components/studio/sequencer-panel'
import { MixingPanel } from '@/components/studio/mixing-panel'

export default function CreatePage() {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [selectedInstrument, setSelectedInstrument] = useState<string>('synth')
  const [bpm, setBpm] = useState(120)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tracks, setTracks] = useState([
    { id: '1', name: 'Synth', instrument: 'synth', volume: 80 },
    { id: '2', name: 'Drums', instrument: 'drums', volume: 85 },
    { id: '3', name: 'Bass', instrument: 'bass', volume: 75 },
  ])

  return (
    <main className="h-screen w-full bg-background text-foreground overflow-hidden flex flex-col">
      {/* Top Bar */}
      <EditorTopBar 
        bpm={bpm} 
        setBpm={setBpm} 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />

      {/* 3-Panel Editor */}
      <div className="flex-1 flex overflow-hidden gap-1 bg-background p-1">
        {/* Left Panel - Instruments */}
        <InstrumentPanel
          selectedInstrument={selectedInstrument}
          setSelectedInstrument={setSelectedInstrument}
          tracks={tracks}
          setTracks={setTracks}
          currentTrack={currentTrack}
          setCurrentTrack={setCurrentTrack}
        />

        {/* Center Panel - Sequencer */}
        <SequencerPanel
          bpm={bpm}
          isPlaying={isPlaying}
          currentTrack={currentTrack}
          selectedInstrument={selectedInstrument}
        />

        {/* Right Panel - Mixing */}
        <MixingPanel
          tracks={tracks}
          setTracks={setTracks}
          currentTrack={currentTrack}
        />
      </div>
    </main>
  )
}
