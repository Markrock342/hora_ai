import type { ReactNode } from 'react'
import { MyhoraEmbedFrame } from './MyhoraEmbedFrame'

interface MyhoraChartEmbedProps {
  embedPath: string | null
  title: string
  subtitle?: string
  size?: 'large' | 'small'
  /** ไม่แสดงหัวข้อการ์ด — checkbox ยังอยู่ในกราฟ myhora */
  bare?: boolean
  fallback?: ReactNode
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
  fallback,
}: MyhoraChartEmbedProps) {
  const dim = CHART_SIZE[size]

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
      height={dim.height}
      width={dim.width}
      wide
      bare={bare}
      chartControls
      fallback={fallback}
      className={`myhora-chart-embed ${size === 'small' ? 'myhora-chart-embed--small' : ''} ${bare ? 'myhora-chart-embed--bare' : ''}`.trim()}
    />
  )
}
