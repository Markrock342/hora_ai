import type { CSSProperties, ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: boolean
  mystic?: boolean
  style?: CSSProperties
}

export function GlassCard({
  children,
  className = '',
  glow = true,
  mystic = false,
  style,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card rounded-2xl border border-hora-gold/25 bg-hora-panel/70 p-5 shadow-2xl backdrop-blur-md md:p-8 ${
        glow ? 'gold-glow' : ''
      } ${mystic ? 'glass-card-mystic' : ''} ${className}`}
      style={style}
    >
      {mystic && (
        <>
          <div className="glass-card-mystic-border" aria-hidden />
          <span className="glass-card-corner glass-card-corner--tl" aria-hidden>
            ✦
          </span>
          <span className="glass-card-corner glass-card-corner--br" aria-hidden>
            ✦
          </span>
        </>
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
