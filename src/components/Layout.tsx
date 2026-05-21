import { NavLink, Outlet } from 'react-router-dom'
import { CelestialBackdrop } from './ui/CelestialBackdrop'
import { PageTransition } from './ui/PageTransition'
import { ScrollProgress } from './ui/ScrollProgress'

const navItems = [
  { to: '/', label: 'กรอกข้อมูล', icon: '☉', end: true },
  { to: '/result', label: 'ผลดวง', icon: '☽', end: false },
  { to: '/admin', label: 'สูตร', icon: '⚙', end: false },
]

export function Layout() {
  return (
    <div className="relative min-h-screen text-hora-cream">
      <CelestialBackdrop />
      <ScrollProgress />

      <header className="mystic-header no-print sticky top-0 z-20 border-b border-hora-gold/15 bg-hora-bg/75 backdrop-blur-xl">
        <div className="mystic-header-shimmer" aria-hidden />
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
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

          <nav className="mystic-nav flex gap-1 rounded-xl border border-hora-gold/15 bg-hora-panel/50 p-1 backdrop-blur-sm" aria-label="หลัก">
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

      <footer className="mystic-footer no-print relative border-t border-hora-gold/10 py-8 text-center text-xs text-hora-muted">
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
      </footer>
    </div>
  )
}
