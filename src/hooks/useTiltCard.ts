import { useCallback, useRef, type MouseEvent } from 'react'

/** เอียงการ์ดตามเมาส์ — ปิดอัตโนมัติถ้า prefers-reduced-motion */
export function useTiltCard(intensity = 6) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.setProperty('--tilt-x', `${(-y * intensity).toFixed(2)}deg`)
      el.style.setProperty('--tilt-y', `${(x * intensity).toFixed(2)}deg`)
    },
    [intensity],
  )

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
  }, [])

  return { ref, onMove, onLeave }
}
