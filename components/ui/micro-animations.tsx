'use client'

import { ReactNode, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// Floating animation component
export function FloatingAnimation({ 
  children, 
  duration = 3, 
  delay = 0,
  intensity = 'medium' 
}: { 
  children: ReactNode
  duration?: number
  delay?: number
  intensity?: 'low' | 'medium' | 'high'
}) {
  const getIntensityClass = () => {
    switch (intensity) {
      case 'low': return 'animate-float-low'
      case 'medium': return 'animate-float-medium'
      case 'high': return 'animate-float-high'
      default: return 'animate-float-medium'
    }
  }

  return (
    <div 
      className={cn('inline-block', getIntensityClass())}
      style={{
        animation: `float ${duration}s ease-in-out ${delay}s infinite`
      }}
    >
      {children}
    </div>
  )
}

// Pulse animation component
export function PulseAnimation({ 
  children, 
  duration = 2, 
  delay = 0,
  scale = 1.05 
}: { 
  children: ReactNode
  duration?: number
  delay?: number
  scale?: number
}) {
  return (
    <div 
      className="inline-block"
      style={{
        animation: `pulse ${duration}s ease-in-out ${delay}s infinite`
      }}
    >
      {children}
    </div>
  )
}

// Shimmer animation component
export function ShimmerAnimation({ 
  children, 
  className = '',
  duration = 2 
}: { 
  children: ReactNode
  className?: string
  duration?: number
}) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="shimmer-wrapper">
        {children}
      </div>
      <div 
        className="shimmer-effect"
        style={{
          animation: `shimmer ${duration}s infinite`
        }}
      />
    </div>
  )
}

// Typewriter animation component
export function TypewriterAnimation({ 
  text, 
  className = '',
  speed = 50,
  onComplete
}: { 
  text: string
  className?: string
  speed?: number
  onComplete?: () => void
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className={cn('font-mono', className)}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Morph animation component
export function MorphAnimation({ 
  children, 
  className = '',
  duration = 4 
}: { 
  children: ReactNode
  className?: string
  duration?: number
}) {
  return (
    <div 
      className={cn('morph-container', className)}
      style={{
        animation: `morph ${duration}s ease-in-out infinite`
      }}
    >
      {children}
    </div>
  )
}

// Particle animation component
export function ParticleAnimation({ 
  count = 20,
  className = '',
  particleSize = 'small',
  color = 'purple'
}: { 
  count?: number
  className?: string
  particleSize?: 'small' | 'medium' | 'large'
  color?: 'purple' | 'blue' | 'green' | 'pink' | 'orange'
}) {
  const getSizeClass = () => {
    switch (particleSize) {
      case 'small': return 'w-1 h-1'
      case 'medium': return 'w-2 h-2'
      case 'large': return 'w-3 h-3'
      default: return 'w-1 h-1'
    }
  }

  const getColorClass = () => {
    switch (color) {
      case 'purple': return 'bg-purple-400'
      case 'blue': return 'bg-blue-400'
      case 'green': return 'bg-green-400'
      case 'pink': return 'bg-pink-400'
      case 'orange': return 'bg-orange-400'
      default: return 'bg-purple-400'
    }
  }

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn('absolute rounded-full opacity-60', getSizeClass(), getColorClass())}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particle-float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite`
          }}
        />
      ))}
    </div>
  )
}

// Ripple animation component
export function RippleAnimation({ 
  children, 
  className = '',
  color = 'purple',
  duration = 2 
}: { 
  children: ReactNode
  className?: string
  color?: 'purple' | 'blue' | 'green' | 'pink' | 'orange'
  duration?: number
}) {
  const getColorClass = () => {
    switch (color) {
      case 'purple': return 'bg-purple-500/20'
      case 'blue': return 'bg-blue-500/20'
      case 'green': return 'bg-green-500/20'
      case 'pink': return 'bg-pink-500/20'
      case 'orange': return 'bg-orange-500/20'
      default: return 'bg-purple-500/20'
    }
  }

  return (
    <div className={cn('relative', className)}>
      {children}
      <div 
        className={cn('absolute inset-0 rounded-full', getColorClass())}
        style={{
          animation: `ripple ${duration}s ease-out infinite`
        }}
      />
    </div>
  )
}

// Glitch animation component
export function GlitchAnimation({ 
  children, 
  className = '',
  intensity = 'medium' 
}: { 
  children: ReactNode
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}) {
  const getIntensityClass = () => {
    switch (intensity) {
      case 'low': return 'glitch-low'
      case 'medium': return 'glitch-medium'
      case 'high': return 'glitch-high'
      default: return 'glitch-medium'
    }
  }

  return (
    <div className={cn('relative', className)}>
      <div className={cn('glitch-text', getIntensityClass())}>
        {children}
      </div>
      <div className={cn('absolute inset-0 glitch-text glitch-blue', getIntensityClass())}>
        {children}
      </div>
      <div className={cn('absolute inset-0 glitch-text glitch-red', getIntensityClass())}>
        {children}
      </div>
    </div>
  )
}

// Hover lift animation component
export function HoverLiftAnimation({ 
  children, 
  className = '',
  liftAmount = 8 
}: { 
  children: ReactNode
  className?: string
  liftAmount?: number
}) {
  return (
    <div 
      className={cn('transition-transform duration-300 hover:shadow-xl', className)}
      style={{
        transform: 'translateY(0)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `translateY(-${liftAmount}px)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {children}
    </div>
  )
}

// Stagger animation wrapper
export function StaggerAnimation({ 
  children, 
  stagger = 100,
  className = '' 
}: { 
  children: ReactNode[]
  stagger?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {children.map((child, index) => (
        <div
          key={index}
          className="animate-slide-up"
          style={{
            animation: `slide-up 0.5s ease-out ${index * stagger}ms both`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// CSS-in-JS animations
export const animations = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes float-low {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes float-high {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-30px); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes morph {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }

  @keyframes particle-float {
    0% { transform: translateY(0px) translateX(0px); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
  }

  @keyframes ripple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }

  @keyframes slide-up {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }

  .shimmer-wrapper {
    position: relative;
    overflow: hidden;
  }

  .shimmer-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  }

  .glitch-text {
    position: relative;
    color: white;
    font-weight: bold;
  }

  .glitch-blue {
    color: #00ffff;
    animation: glitch-anim 0.5s infinite;
  }

  .glitch-red {
    color: #ff00ff;
    animation: glitch-anim 0.5s infinite reverse;
  }

  @keyframes glitch-anim {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }

  .glitch-low .glitch-blue,
  .glitch-low .glitch-red {
    animation-duration: 1s;
    opacity: 0.5;
  }

  .glitch-high .glitch-blue,
  .glitch-high .glitch-red {
    animation-duration: 0.2s;
    opacity: 0.8;
  }
`

// Hook to inject animations
export function useAnimations() {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = animations
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])
}
