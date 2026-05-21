import type { ReactNode } from 'react'
import { MyhoraEmbedFrame } from './MyhoraEmbedFrame'

interface MyhoraChartEmbedProps {
  embedPath: string | null
  title: string
  subtitle?: string
  size?: 'large' | 'small'
  fallback?: ReactNode
}

export function MyhoraChartEmbed({
  embedPath,
  title,
  subtitle,
  size = 'large',
  fallback,
}: MyhoraChartEmbedProps) {
  const height = size === 'large' ? 460 : 380

  if (!embedPath) {
    return fallback ? (
      <div className="myhora-chart-fallback">{fallback}</div>
    ) : (
      <section className="myhora-chart-section myhora-chart-section--empty">
        <header className="myhora-chart-header">
          <h3 className="font-display text-lg text-gradient-gold">{title}</h3>
          {subtitle ? <p className="text-xs text-hora-muted">{subtitle}</p> : null}
        </header>
        <p className="px-4 py-8 text-center text-sm text-hora-muted">ไม่มีกราฟจาก myhora</p>
      </section>
    )
  }

  return (
    <MyhoraEmbedFrame
      embedPath={embedPath}
      title={title}
      subtitle={subtitle}
      height={height}
      fallback={fallback}
      className={`myhora-chart-embed gold-glow ${size === 'small' ? 'myhora-chart-embed--small' : ''}`}
    />
  )
}
