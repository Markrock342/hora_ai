import { useEffect, useRef, useState } from 'react'
import { fetchMyhoraChartHtml } from '../utils/myhora/fetchMyhoraChartHtml'
import { isAllowedMyhoraChartPath } from '../utils/myhora/myhoraProxy'

interface MyhoraChartHtmlProps {
  embedPath: string | null
  /** HTML ที่เตรียมแล้วจาก scrape (ไม่ต้อง fetch ซ้ำ) */
  preparedHtml?: string | null
  size?: 'large' | 'small'
  className?: string
}

export function MyhoraChartHtml({
  embedPath,
  preparedHtml,
  size = 'large',
  className = '',
}: MyhoraChartHtmlProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [html, setHtml] = useState<string | null>(preparedHtml ?? null)
  const [loading, setLoading] = useState(Boolean(embedPath && !preparedHtml))
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (preparedHtml) {
      setHtml(preparedHtml)
      setLoading(false)
      setFailed(false)
      return
    }
    if (!embedPath || !isAllowedMyhoraChartPath(embedPath)) {
      setHtml(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setFailed(false)
    fetchMyhoraChartHtml(embedPath)
      .then((chunk) => {
        if (cancelled) return
        setHtml(chunk)
        setFailed(!chunk)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [embedPath, preparedHtml])

  useEffect(() => {
    const host = hostRef.current
    if (!host || !html) return
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' })
    shadow.innerHTML = html
  }, [html])

  if (!embedPath && !preparedHtml) return null

  return (
    <div
      className={`myhora-chart-html-host myhora-chart-html-host--fit ${size === 'small' ? 'myhora-chart-html-host--small' : ''} ${className}`.trim()}
    >
      {loading ? (
        <p className="myhora-chart-html-loading text-center text-sm text-hora-muted py-12">
          กำลังโหลดกราฟ…
        </p>
      ) : null}
      {failed && !loading ? (
        <p className="myhora-chart-html-error text-center text-sm text-hora-muted py-12">
          โหลดกราฟไม่สำเร็จ
        </p>
      ) : null}
      <div
        ref={hostRef}
        className={`myhora-chart-html-shadow ${className}`.trim()}
        hidden={loading || failed || !html}
        aria-hidden={loading || failed || !html}
      />
    </div>
  )
}
