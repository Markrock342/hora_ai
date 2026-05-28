import { useEffect, useRef } from 'react'

interface MyhoraNatalTableProps {
  /** HTML ดิบจาก myhora สำหรับดวงกำเนิด */
  html?: string | null
  /** HTML ดิบจาก myhora สำหรับดาวจร */
  transitHtml?: string | null
}

/**
 * แสดงตารางสมผุสจาก myhora โดยตรง (HTML ดั้งเดิม)
 * ใช้ CSS scale เพื่อให้พอดีจอโดยไม่ต้อง scroll ซ้ายขวา
 */
function MyhoraHtmlTable({
  html,
  title,
  subtitle,
}: {
  html: string
  title: string
  subtitle?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  // scale ให้ตารางพอดีจอ ไม่ต้อง scroll
  useEffect(() => {
    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner) return

    const fit = () => {
      // reset ก่อน
      inner.style.transform = 'none'
      inner.style.width = 'auto'
      wrap.style.height = ''

      const wrapW = wrap.clientWidth
      const innerW = inner.scrollWidth

      if (innerW > wrapW && wrapW > 0) {
        const scale = Math.max(wrapW / innerW, 0.4) // ไม่เล็กกว่า 40%
        inner.style.transform = `scale(${scale})`
        inner.style.transformOrigin = 'top left'
        inner.style.width = `${innerW}px`
        wrap.style.height = `${Math.ceil(inner.scrollHeight * scale)}px`
      }
    }

    // ต้อง setTimeout เพื่อให้ DOM render เสร็จก่อน
    const t = setTimeout(fit, 50)
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)
    return () => {
      clearTimeout(t)
      ro.disconnect()
    }
  }, [html])

  return (
    <section
      className="gold-glow overflow-hidden rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md"
      aria-label={title}
    >
      <header className="border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-5 py-4">
        <h3 className="font-display text-xl font-medium text-gradient-gold">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-hora-gold-dim">{subtitle}</p>}
      </header>
      {/* ห้าม overflow-x ทุกกรณี — ใช้ scale แทน */}
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden bg-white"
        style={{ minHeight: 80 }}
      >
        <div
          ref={innerRef}
          style={{ color: '#111', fontSize: '12px', lineHeight: '1.4' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  )
}

export function MyhoraNatalTable({ html, transitHtml }: MyhoraNatalTableProps) {
  if (!html?.trim() && !transitHtml?.trim()) return null

  return (
    <div className="space-y-6">
      {html?.trim() && (
        <MyhoraHtmlTable
          html={html}
          title="ตารางสมผุสดวงกำเนิด"
          subtitle="ราศี · เรือนลัคนา · ตรียางศ์ · นวางศ์ · ทักษา · ฤกษ์"
        />
      )}
      {transitHtml?.trim() && (
        <MyhoraHtmlTable
          html={transitHtml}
          title="ตารางสมผุสดาวจร"
          subtitle="ตำแหน่งดาวจร ณ วันที่เลือก · ราศี · เรือนลัคนา · ฤกษ์"
        />
      )}
    </div>
  )
}
