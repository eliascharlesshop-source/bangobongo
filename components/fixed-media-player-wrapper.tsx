"use client"

import { useEffect, useState } from "react"
import FixedMediaPlayer from "@/components/fixed-media-player"
import { useAudio } from "@/contexts/audio-context"

export default function FixedMediaPlayerWrapper() {
  const [isMounted, setIsMounted] = useState(false)
  const audioContext = useAudio()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <FixedMediaPlayer />
}
