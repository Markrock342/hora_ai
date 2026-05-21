import { useEffect, useState, type CSSProperties } from 'react'

export function ScrollProgress() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setWidth(max > 0 ? (el.scrollTop / max) * 100 : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      className="scroll-progress no-print"
      role="presentation"
      aria-hidden
      style={{ '--scroll-pct': `${width}%` } as CSSProperties}
    >
      <div className="scroll-progress-bar" />
    </div>
  )
}
