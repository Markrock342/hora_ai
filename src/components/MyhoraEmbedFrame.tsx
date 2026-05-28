import { useEffect, useRef, useState, type ReactNode } from 'react'
import { isAllowedMyhoraChartPath, myhoraEmbedUrl } from '../utils/myhora/myhoraProxy'
import { isEmbeddedNewHoraApp } from '../utils/myhora/sanitizeChartHtml'

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
  onEmbedFailed?: () => void
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
  onEmbedFailed,
  className = '',
}: MyhoraEmbedFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const safe =
    embedPath && isAllowedMyhoraChartPath(embedPath) ? myhoraEmbedUrl(embedPath) : null
  const [failed, setFailed] = useState(false)
  const loadedRef = useRef(false)

  useEffect(() => {
    loadedRef.current = false
    setFailed(false)
    if (!safe) return
    const timer = window.setTimeout(() => {
      if (!loadedRef.current) {
        setFailed(true)
        onEmbedFailed?.()
      }
    }, 12000)
    return () => window.clearTimeout(timer)
  }, [safe, onEmbedFailed])

  const verifyLoaded = () => {
    const doc = iframeRef.current?.contentDocument
    if (isEmbeddedNewHoraApp(doc)) {
      setFailed(true)
      onEmbedFailed?.()
      return false
    }
    setFailed(false)
    return true
  }

  const handleLoad = () => {
    loadedRef.current = true
    if (!verifyLoaded()) return
    
    // ฉีด CSS เพิ่มเติมเข้าไปใน iframe เพื่อซ่อนดาวจรหรือดาวพื้นดวงดั้งเดิมตามคลาสส่งผ่าน
    try {
      const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document
      if (doc) {
        const style = doc.createElement('style')
        let rules = ''
        if (className.includes('myhora-chart-rasi-stage--natal-only')) {
          rules = '.cr-tsign { display: none !important; }'
        } else if (className.includes('myhora-chart-rasi-stage--transit-only')) {
          rules = '.cr-nsign { display: none !important; }'
        }
        if (rules) {
          style.innerHTML = rules
          doc.head.appendChild(style)
        }
      }
    } catch (e) {
      console.warn("Failed to inject CSS into iframe due to cross-origin restriction:", e)
    }

    window.setTimeout(verifyLoaded, 400)
    window.setTimeout(verifyLoaded, 1200)
  }

  if (!embedPath || !safe) {
    return fallback ? <>{fallback}</> : null
  }

  if (failed && fallback) {
    return <>{fallback}</>
  }

  return (
    <section
      className={`myhora-embed-section gold-glow overflow-hidden rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md ${bare ? 'myhora-embed-section--bare' : ''} ${chartControls ? 'myhora-embed-section--chart' : ''} ${className}`.trim()}
      aria-label={title}
    >
      {!bare ? (
        <header className="myhora-embed-header border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-5 py-4 print:border-gray-300">
          <h3 className="font-display text-xl font-medium text-gradient-gold print:text-black">{title}</h3>
          {subtitle ? (
            <p className="text-xs text-hora-muted print:text-gray-600">{subtitle}</p>
          ) : null}
        </header>
      ) : null}
      <div
        className={`myhora-embed-frame-wrap ${wide ? 'myhora-embed-frame-wrap--wide' : ''} ${bare ? 'myhora-embed-frame-wrap--bare' : ''} ${chartControls ? 'myhora-embed-frame-wrap--chart' : ''}`.trim()}
      >
        <iframe
          ref={iframeRef}
          src={failed && fallback ? undefined : safe}
          title={title}
          className={`myhora-embed-iframe ${wide ? 'myhora-embed-iframe--wide' : ''} ${bare ? 'myhora-embed-iframe--bare' : ''} ${chartControls ? 'myhora-embed-iframe--chart' : ''}`.trim()}
          style={{
            height,
            ...(width != null ? { width: `${width}px`, maxWidth: '100%' } : {}),
          }}
          scrolling={chartControls ? 'auto' : 'no'}
          loading="lazy"
          onLoad={handleLoad}
        />
      </div>
    </section>
  )
}
