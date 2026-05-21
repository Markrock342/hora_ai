import { useLayoutEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { CalcNavState } from '../../constants/calcTransition'

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { pathname } = location
  const fromCalc = Boolean((location.state as CalcNavState | null)?.fromCalc)
  const [active, setActive] = useState(fromCalc)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    let cancelled = false
    let innerFrame = 0

    if (fromCalc) {
      setActive(true)
      return
    }

    setActive(false)
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        if (!cancelled) setActive(true)
      })
    })
    const fallback = window.setTimeout(() => {
      if (!cancelled) setActive(true)
    }, 150)

    return () => {
      cancelled = true
      cancelAnimationFrame(outerFrame)
      cancelAnimationFrame(innerFrame)
      clearTimeout(fallback)
    }
  }, [pathname, fromCalc])

  return (
    <div
      key={pathname}
      className={`page-transition page-enter page-route-enter${fromCalc ? ' page-enter--from-calc' : ''}${active ? ' page-enter--active' : ''}`}
    >
      {children}
    </div>
  )
}
