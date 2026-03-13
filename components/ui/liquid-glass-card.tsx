'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ReactNode, useEffect, useRef, useState } from 'react'

interface LiquidGlassCardProps {
  children: ReactNode
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  animated?: boolean
  glowColor?: 'purple' | 'blue' | 'green' | 'pink' | 'orange'
}

export function LiquidGlassCard({ 
  children, 
  className = '',
  intensity = 'medium',
  animated = true,
  glowColor = 'purple'
}: LiquidGlassCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card || !animated) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePosition({ x, y })
    }

    const handleMouseLeave = () => {
      setMousePosition({ x: 50, y: 50 })
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [animated])

  const getIntensityClasses = () => {
    switch (intensity) {
      case 'low':
        return 'backdrop-blur-sm bg-white/5 border-white/10'
      case 'medium':
        return 'backdrop-blur-md bg-white/10 border-white/20'
      case 'high':
        return 'backdrop-blur-lg bg-white/15 border-white/30'
      default:
        return 'backdrop-blur-md bg-white/10 border-white/20'
    }
  }

  const getGlowGradient = () => {
    switch (glowColor) {
      case 'purple':
        return 'from-purple-500/20 via-pink-500/10 to-blue-500/20'
      case 'blue':
        return 'from-blue-500/20 via-cyan-500/10 to-teal-500/20'
      case 'green':
        return 'from-green-500/20 via-emerald-500/10 to-lime-500/20'
      case 'pink':
        return 'from-pink-500/20 via-rose-500/10 to-fuchsia-500/20'
      case 'orange':
        return 'from-orange-500/20 via-amber-500/10 to-yellow-500/20'
      default:
        return 'from-purple-500/20 via-pink-500/10 to-blue-500/20'
    }
  }

  return (
    <div 
      ref={cardRef}
      className={cn(
        'relative rounded-2xl overflow-hidden transition-all duration-500',
        getIntensityClasses(),
        animated && 'hover:shadow-2xl hover:scale-[1.02]',
        className
      )}
      style={{
        background: animated 
          ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          : undefined
      }}
    >
      {/* Liquid effect overlay */}
      <div 
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700',
          animated && 'hover:opacity-100'
        )}
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${getGlowGradient().split(' ').join(', ')})`,
          filter: 'blur(40px)',
          transform: animated ? `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px)` : undefined
        }}
      />

      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Floating particles */}
      {animated && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Shimmer effect */}
      {animated && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12" />
        </div>
      )}
    </div>
  )
}

// Enhanced Card Components with Liquid Glass Effect
export function LiquidGlassCardHeader({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <CardHeader className={cn('relative z-10', className)}>
      {children}
    </CardHeader>
  )
}

export function LiquidGlassCardTitle({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <CardTitle className={cn('text-white font-semibold group-hover:text-purple-200 transition-colors duration-300', className)}>
      {children}
    </CardTitle>
  )
}

export function LiquidGlassCardDescription({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <CardDescription className={cn('text-purple-200 group-hover:text-purple-100 transition-colors duration-300', className)}>
      {children}
    </CardDescription>
  )
}

export function LiquidGlassCardContent({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <CardContent className={cn('relative z-10 space-y-4', className)}>
      {children}
    </CardContent>
  )
}

// Complete Liquid Glass Card Component
export function CompleteLiquidGlassCard({ 
  children, 
  title,
  description,
  className = '',
  intensity = 'medium',
  animated = true,
  glowColor = 'purple',
  headerClassName = '',
  contentClassName = ''
}: LiquidGlassCardProps & {
  title?: ReactNode
  description?: ReactNode
  headerClassName?: string
  contentClassName?: string
}) {
  return (
    <LiquidGlassCard 
      className={className} 
      intensity={intensity} 
      animated={animated}
      glowColor={glowColor}
    >
      {(title || description) && (
        <LiquidGlassCardHeader className={headerClassName}>
          {title && <LiquidGlassCardTitle>{title}</LiquidGlassCardTitle>}
          {description && <LiquidGlassCardDescription>{description}</LiquidGlassCardDescription>}
        </LiquidGlassCardHeader>
      )}
      <LiquidGlassCardContent className={contentClassName}>
        {children}
      </LiquidGlassCardContent>
    </LiquidGlassCard>
  )
}
