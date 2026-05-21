import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: boolean
}

export function GlassCard({ children, className = '', glow = true }: GlassCardProps) {
  return (
    <div
      className={`glass-card rounded-2xl border border-hora-gold/25 bg-hora-panel/70 p-5 shadow-2xl backdrop-blur-md md:p-8 ${
        glow ? 'gold-glow' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
