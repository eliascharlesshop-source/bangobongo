"use client"

import dynamic from "next/dynamic"

const AudioProvider = dynamic(
  () => import("@/contexts/audio-context").then((mod) => ({ default: mod.AudioProvider })),
  { ssr: false }
)

const NotificationProvider = dynamic(
  () => import("@/contexts/notification-context").then((mod) => ({ default: mod.NotificationProvider })),
  { ssr: false }
)

const FixedMediaPlayerWrapper = dynamic(
  () => import("@/components/fixed-media-player-wrapper"),
  { loading: () => null, ssr: false }
)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <AudioProvider>
        {children}
        <FixedMediaPlayerWrapper />
      </AudioProvider>
    </NotificationProvider>
  )
}
