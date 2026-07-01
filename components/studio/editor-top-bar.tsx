'use client'

import { Play, Pause, Save, Download, RotateCcw, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface EditorTopBarProps {
  bpm: number
  setBpm: (bpm: number) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
}

export function EditorTopBar({
  bpm,
  setBpm,
  isPlaying,
  setIsPlaying,
}: EditorTopBarProps) {
  return (
    <div className="h-16 border-b border-primary/10 bg-gradient-to-r from-card to-card/50 flex items-center justify-between px-4 gap-4">
      {/* Left - Back & Title */}
      <div className="flex items-center gap-4 flex-1">
        <Link href="/studio">
          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
            ← Back to Studio
          </Button>
        </Link>
        <div className="h-6 w-px bg-primary/20" />
        <h1 className="text-lg font-bold chrome-text-mint">Create Track</h1>
      </div>

      {/* Center - Transport Controls */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className="hover:bg-primary/20"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-primary/20"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-primary/20" />

        {/* BPM Display */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-muted-foreground">BPM</label>
          <input
            type="number"
            min={60}
            max={200}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-14 h-8 bg-card/50 border border-primary/20 rounded px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 chrome-border"
          />
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="hover:bg-primary/20">
          <Plus className="h-4 w-4 mr-1" />
          New Track
        </Button>
        <Button variant="ghost" size="sm" className="hover:bg-primary/20">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="chrome" size="sm">
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  )
}
