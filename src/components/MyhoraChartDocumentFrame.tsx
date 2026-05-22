import { useEffect, useRef, useState } from 'react'
import type { NatalChartDisplayOptions } from '../utils/myhora/natalChartOptions'
import { loadNatalChartBlobUrl } from '../utils/myhora/loadNatalChartDocument'
import { isAllowedMyhoraChartPath } from '../utils/myhora/myhoraProxy'

interface MyhoraChartDocumentFrameProps {
  embedPath: string | null
  title: string
  width?: number
  height?: number
  className?: string
  onFailed?: () => void
  natalDisplayOpts?: NatalChartDisplayOptions
}

export function MyhoraChartDocumentFrame({
  embedPath,
  title,
  width = 500,
  height = 480,
  className = '',
  onFailed,
  natalDisplayOpts,
}: MyhoraChartDocumentFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const blobRef = useRef<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(Boolean(embedPath))

  useEffect(() => {
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current)
      blobRef.current = null
    }
    if (!embedPath || !isAllowedMyhoraChartPath(embedPath)) {
      setLoading(false)
      setFailed(true)
      onFailed?.()
      return
    }

    let cancelled = false
    setLoading(true)
    setFailed(false)

    loadNatalChartBlobUrl(embedPath, natalDisplayOpts)
      .then((url) => {
        if (cancelled) return
        if (!url) {
          setFailed(true)
          onFailed?.()
          return
        }
        blobRef.current = url
        if (iframeRef.current) {
          iframeRef.current.src = url
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true)
          onFailed?.()
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current)
        blobRef.current = null
      }
    }
  }, [embedPath, natalDisplayOpts, onFailed])

  if (!embedPath || !isAllowedMyhoraChartPath(embedPath)) return null

  return (
    <div
      className={`myhora-chart-document-frame ${className}`.trim()}
      style={{ width: '100%', maxWidth: width }}
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
      <iframe
        ref={iframeRef}
        title={title}
        className="myhora-chart-document-iframe"
        style={{
          width: `${width}px`,
          maxWidth: '100%',
          height: loading || failed ? 0 : height,
          border: 'none',
          display: loading || failed ? 'none' : 'block',
        }}
        scrolling="no"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}
