import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppIntro } from '../hooks/useAppIntro'
import { useClickEffects } from '../hooks/useClickEffects'
import { useScrollMotion } from '../hooks/useScrollMotion'
import { CelestialBackdrop } from './ui/CelestialBackdrop'
import { CinematicIntro } from './ui/CinematicIntro'
import { PageTransition } from './ui/PageTransition'
import { ScrollProgress } from './ui/ScrollProgress'
import { ScrollReveal } from './ui/ScrollReveal'

const navItems = [
  { to: '/', label: 'กรอกข้อมูล', icon: '☉', end: true },
  { to: '/result', label: 'ผลดวง', icon: '☽', end: false },
  { to: '/calendar', label: 'ปฏิทิน 100 ปี', icon: '📅', end: false },
  { to: '/admin', label: 'สูตร', icon: '⚙', end: false },
]

export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { active: introActive, leaving: introLeaving, progress: introProgress, statusText: introStatus, skip: skipIntro } =
    useAppIntro()
  const introPlayedRef = useRef(false)

  useScrollMotion()
  useClickEffects()

  useEffect(() => {
    if (introActive) {
      introPlayedRef.current = true
    }
  }, [introActive])

  /** หลังสแปชเปิดแอป — ไปหน้ากรอกข้อมูล (ไม่ค้างที่ /result จากรอบก่อน) */
  useEffect(() => {
    if (introActive) return
    if (!introPlayedRef.current) return
    introPlayedRef.current = false
    if (location.pathname !== '/') {
      navigate('/', { replace: true })
    }
  }, [introActive, location.pathname, navigate])

  useEffect(() => {
    if (introActive) return
    const t = requestAnimationFrame(() => {
      document.documentElement.classList.add('app-header-ready')
    })
    return () => cancelAnimationFrame(t)
  }, [introActive])

  return (
    <div className="app-shell app-shell--lux relative min-h-screen text-hora-cream">
      <CinematicIntro
        active={introActive}
        leaving={introLeaving}
        progress={introProgress}
        statusText={introStatus}
        onSkip={skipIntro}
      />

      <CelestialBackdrop />
      <ScrollProgress />

      <header className="mystic-header no-print sticky top-0 z-20 border-b border-hora-gold/15 bg-hora-bg/75 backdrop-blur-xl">
        <div className="mystic-header-shimmer" aria-hidden />
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 md:gap-4 md:px-8 md:py-4">
          <NavLink to="/" className="group flex items-center gap-3">
            <div
              className="mystic-logo-emblem relative flex h-11 w-11 items-center justify-center rounded-xl border border-hora-gold/40 bg-gradient-to-br from-hora-panel-light to-hora-bg font-display text-xl text-hora-gold-light shadow-lg"
              aria-hidden
            >
              <span className="mystic-logo-emblem-ring absolute inset-0 rounded-xl" />
              <span className="absolute inset-0 rounded-xl bg-hora-gold/10 blur-sm" />
              <span className="relative">☸</span>
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold tracking-wide text-gradient-gold">
                NewHora
              </h1>
              <p className="text-[11px] tracking-widest text-hora-muted uppercase">
                โหราศาสตร์ไทย
              </p>
            </div>
          </NavLink>

          <nav
            className="mystic-nav flex w-full justify-start overflow-x-auto whitespace-nowrap scrollbar-none gap-0.5 rounded-xl border border-hora-gold/15 bg-hora-panel/50 p-1 backdrop-blur-sm sm:w-auto sm:justify-start"
            aria-label="หลัก"
          >
            {navItems.map(({ to, label, icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `mystic-nav-link rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'nav-pill-active mystic-nav-link--active text-hora-gold-light'
                      : 'text-hora-muted hover:text-hora-cream'
                  }`
                }
              >
                <span className="mystic-nav-icon" aria-hidden>
                  {icon}
                </span>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10 print:max-w-none print:px-8">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <ScrollReveal
        as="footer"
        variant="fade"
        className="mystic-footer no-print relative border-t border-hora-gold/10 py-8 text-center text-xs text-hora-muted"
      >
        <div className="mystic-footer-inner">
          <p>
            <span className="mystic-footer-star text-hora-gold-dim" aria-hidden>
              ✦
            </span>{' '}
            สถิตราศี · ลาหิรี · สุริยยาตร์{' '}
            <span className="mystic-footer-star text-hora-gold-dim" aria-hidden>
              ✦
            </span>
          </p>
          <p className="mystic-footer-tagline">NewHora — โหราศาสตร์ไทย</p>
        </div>
      </ScrollReveal>
    </div>
  )
}
