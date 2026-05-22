import type { ReactNode } from 'react'
import { MyhoraEmbedFrame } from './MyhoraEmbedFrame'

interface MyhoraChartEmbedProps {
  embedPath: string | null
  title: string
  subtitle?: string
  size?: 'large' | 'small'
  /** ไม่แสดงหัวข้อการ์ด — checkbox ยังอยู่ในกราฟ myhora */
  bare?: boolean
  /** ความกว้าง/สูงกำหนดเอง (เช่น กราฟ natal 900px) */
  width?: number
  height?: number
  fallback?: ReactNode
  className?: string
  onEmbedFailed?: () => void
}

/** ขนาด embed myhora (layout ~500×450 + แถบ checkbox) */
const CHART_SIZE = {
  large: { width: 500, height: 480 },
  small: { width: 268, height: 300 },
} as const

/**
 * กราฟวงกลมจาก myhora — ใช้ iframe เพื่อให้รูปดาว + checkbox ทำงานเหมือนต้นทาง
 */
export function MyhoraChartEmbed({
  embedPath,
  title,
  subtitle,
  size = 'large',
  bare = false,
  width,
  height,
  fallback,
  className = '',
  onEmbedFailed,
}: MyhoraChartEmbedProps) {
  const dim = CHART_SIZE[size]
  const frameWidth = width ?? dim.width
  const frameHeight = height ?? dim.height

  if (!embedPath) {
    return fallback ? (
      <div className="myhora-chart-fallback">{fallback}</div>
    ) : (
      <section className="myhora-chart-section myhora-chart-section--empty">
        {!bare ? (
          <header className="myhora-chart-header">
            <h3 className="font-display text-lg text-gradient-gold">{title}</h3>
            {subtitle ? <p className="text-xs text-hora-muted">{subtitle}</p> : null}
          </header>
        ) : null}
        <p className="px-4 py-8 text-center text-sm text-hora-muted">ไม่มีกราฟ</p>
      </section>
    )
  }

  return (
    <MyhoraEmbedFrame
      embedPath={embedPath}
      title={title}
      subtitle={bare ? undefined : subtitle}
      height={frameHeight}
      width={frameWidth}
      wide
      bare={bare}
      chartControls
      fallback={fallback}
      onEmbedFailed={onEmbedFailed}
      className={`myhora-chart-embed ${size === 'small' ? 'myhora-chart-embed--small' : ''} ${bare ? 'myhora-chart-embed--bare' : ''} ${className}`.trim()}
    />
  )
}
