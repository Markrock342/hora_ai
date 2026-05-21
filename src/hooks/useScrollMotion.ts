import { useEffect } from 'react'

/** เลื่อนหน้า: header หด, parallax, แถบ progress */
export function useScrollMotion() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement

    const update = () => {
      const y = window.scrollY
      const max = root.scrollHeight - root.clientHeight
      const progress = max > 0 ? y / max : 0

      root.classList.toggle('is-scrolled', y > 20)
      root.classList.toggle('is-scrolled-deep', y > 280)

      if (!reduced) {
        root.style.setProperty('--scroll-y', `${y}`)
        root.style.setProperty('--scroll-parallax', `${Math.min(y * 0.35, 180)}`)
        root.style.setProperty('--scroll-progress', `${progress}`)
      }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
}
