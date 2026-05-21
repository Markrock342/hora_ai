import { useEffect, useRef, useState, type ReactNode } from 'react'
import { isAllowedMyhoraChartPath, myhoraEmbedUrl } from '../utils/myhora/myhoraProxy'

interface MyhoraEmbedFrameProps {
  embedPath: string | null
  title: string
  subtitle?: string
  /** ความสูง iframe (px) */
  height?: number
  /** กว้างเต็มพื้นที่ (ตารางดาว / เรือนลัคนา) */
  wide?: boolean
  /** ไม่แสดงหัวข้อการ์ด — กราฟ myhora + checkbox ยังอยู่ใน iframe */
  bare?: boolean
  /** กราฟ myhora (เปิด scroll, ไม่ตัด checkbox) */
  chartControls?: boolean
  /** ความกว้าง iframe (px) — myhora กราฟออกแบบ ~500px */
  width?: number
  fallback?: ReactNode
  className?: string
}

export function MyhoraEmbedFrame({
  embedPath,
  title,
  subtitle,
  height = 300,
  wide = false,
  bare = false,
  chartControls = false,
  width,
  fallback = null,
  className = '',
}: MyhoraEmbedFrameProps) {
  const safe =
    embedPath && isAllowedMyhoraChartPath(embedPath) ? myhoraEmbedUrl(embedPath) : null
  const [failed, setFailed] = useState(false)
  const loadedRef = useRef(false)

  useEffect(() => {
    loadedRef.current = false
    setFailed(false)
    if (!safe) return
    const timer = window.setTimeout(() => {
      if (!loadedRef.current) setFailed(true)
    }, 12000)
    return () => window.clearTimeout(timer)
  }, [safe])

  if (!embedPath || !safe) {
    return fallback ? <>{fallback}</> : null
  }

  if (failed && fallback) {
    return <>{fallback}</>
  }

  return (
    <section
      className={`myhora-embed-section ${bare ? 'myhora-embed-section--bare' : ''} ${chartControls ? 'myhora-embed-section--chart' : ''} ${className}`.trim()}
      aria-label={title}
    >
      {!bare ? (
        <header className="myhora-embed-header">
          <h3 className="font-display text-lg text-gradient-gold print:text-black">{title}</h3>
          {subtitle ? (
            <p className="text-xs text-hora-muted print:text-gray-600">{subtitle}</p>
          ) : null}
        </header>
      ) : null}
      <div
        className={`myhora-embed-frame-wrap ${wide ? 'myhora-embed-frame-wrap--wide' : ''} ${bare ? 'myhora-embed-frame-wrap--bare' : ''} ${chartControls ? 'myhora-embed-frame-wrap--chart' : ''}`.trim()}
      >
        <iframe
          src={safe}
          title={title}
          className={`myhora-embed-iframe ${wide ? 'myhora-embed-iframe--wide' : ''} ${bare ? 'myhora-embed-iframe--bare' : ''} ${chartControls ? 'myhora-embed-iframe--chart' : ''}`.trim()}
          style={{
            height,
            ...(width != null ? { width: `${width}px`, maxWidth: '100%' } : {}),
          }}
          scrolling={chartControls ? 'auto' : 'no'}
          loading="lazy"
          onLoad={() => {
            loadedRef.current = true
            setFailed(false)
          }}
        />
      </div>
    </section>
  )
}
