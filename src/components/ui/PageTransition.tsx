import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { CalcNavState } from '../../constants/calcTransition'

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { pathname } = location
  const fromCalc = Boolean((location.state as CalcNavState | null)?.fromCalc)
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(false)
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setActive(true))
    })
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <div
      key={pathname}
      className={`page-transition page-enter page-route-enter${fromCalc ? ' page-enter--from-calc' : ''}${active ? ' page-enter--active' : ''}`}
    >
      {children}
    </div>
  )
}
