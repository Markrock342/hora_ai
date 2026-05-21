import { useEffect, useState } from 'react'

/** เปิด class motion พร้อมหลัง mount — ใช้กับ CSS transition */
export function useEnterMotion(delayMs = 0): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(false)
    let cancelled = false
    const start = () => {
      if (!cancelled) setReady(true)
    }
    const t = window.setTimeout(() => {
      requestAnimationFrame(() => requestAnimationFrame(start))
    }, delayMs)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [delayMs])

  return ready
}
