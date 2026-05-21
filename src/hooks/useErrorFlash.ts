import { useEffect, useRef, useState } from 'react'

/** สั่น/ pulse ครั้งเดียวเมื่อ error โผล่หรือรอบ validate ใหม่ */
export function useErrorFlash(active: boolean, pulseKey = 0): boolean {
  const [flash, setFlash] = useState(false)
  const prevKey = useRef(pulseKey)
  const prevActive = useRef(active)

  useEffect(() => {
    const keyChanged = pulseKey !== prevKey.current
    const becameActive = active && (!prevActive.current || keyChanged)
    prevKey.current = pulseKey
    prevActive.current = active

    if (!becameActive) return

    setFlash(true)
    const t = window.setTimeout(() => setFlash(false), 700)
    return () => window.clearTimeout(t)
  }, [active, pulseKey])

  return flash
}
