import { useEffect, useRef, useState, type ReactNode } from 'react'

interface MyhoraChartFitHostProps {
  nativeWidth: number
  nativeHeight: number
  className?: string
  children: ReactNode
}

/** ย่อ/ขยายกราฟให้พอดีกล่อง ไม่เกิด scrollbar */
export function MyhoraChartFitHost({
  nativeWidth,
  nativeHeight,
  className = '',
  children,
}: MyhoraChartFitHostProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = outerRef.current
    if (!el) return

    const update = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (w <= 0 || h <= 0) return
      setScale(Math.min(w / nativeWidth, h / nativeHeight, 1))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [nativeWidth, nativeHeight])

  const scaledW = nativeWidth * scale
  const scaledH = nativeHeight * scale

  return (
    <div
      ref={outerRef}
      className={`myhora-chart-fit-host ${className}`.trim()}
      style={{ aspectRatio: `${nativeWidth} / ${nativeHeight}` }}
    >
      <div className="myhora-chart-fit-scaler" style={{ width: scaledW, height: scaledH }}>
        <div
          className="myhora-chart-fit-inner"
          style={{
            width: nativeWidth,
            height: nativeHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
