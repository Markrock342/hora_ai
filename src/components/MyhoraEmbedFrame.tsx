import { useEffect, useRef, useState, type ReactNode } from 'react'
import { isAllowedMyhoraChartPath, myhoraEmbedUrl } from '../utils/myhora/myhoraProxy'

interface MyhoraEmbedFrameProps {
  embedPath: string | null
  title: string
  subtitle?: string
  /** ความสูง iframe (px) */
  height?: number
  fallback?: ReactNode
  className?: string
}

export function MyhoraEmbedFrame({
  embedPath,
  title,
  subtitle,
  height = 300,
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
      className={`myhora-embed-section ${className}`.trim()}
      aria-label={title}
    >
      <header className="myhora-embed-header">
        <h3 className="font-display text-lg text-gradient-gold print:text-black">{title}</h3>
        {subtitle ? (
          <p className="text-xs text-hora-muted print:text-gray-600">{subtitle}</p>
        ) : null}
      </header>
      <div className="myhora-embed-frame-wrap">
        <iframe
          src={safe}
          title={title}
          className="myhora-embed-iframe"
          style={{ height }}
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
