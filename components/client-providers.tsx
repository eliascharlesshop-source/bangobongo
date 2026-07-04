"use client"

import dynamic from "next/dynamic"
import { CartProvider } from "@/contexts/cart-context"

const AudioProvider = dynamic(
  () => import("@/contexts/audio-context").then((mod) => ({ default: mod.AudioProvider })),
  { loading: () => null }
)

const NotificationProvider = dynamic(
  () => import("@/contexts/notification-context").then((mod) => ({ default: mod.NotificationProvider })),
  { loading: () => null }
)

const FixedMediaPlayerWrapper = dynamic(
  () => import("@/components/fixed-media-player-wrapper"),
  { loading: () => null }
)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <NotificationProvider>
        <AudioProvider>
          {children}
          <FixedMediaPlayerWrapper />
        </AudioProvider>
      </NotificationProvider>
    </CartProvider>
  )
}
