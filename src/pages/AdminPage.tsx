import type { CSSProperties } from 'react'
import { CALCULATION_SETTINGS, CALCULATION_SETTINGS_LABELS } from '../data/calculationSettings'
import { PLANETS, SIGNS } from '../data/astrologyConstants'
import { SuryayatImportForm } from '../components/SuryayatImportForm'
import { GlassCard } from '../components/ui/GlassCard'
import { PageAmbient } from '../components/ui/PageAmbient'

export function AdminPage() {
  return (
    <div className="mystic-page admin-page-mystic relative space-y-8">
      <PageAmbient variant="admin" />
      <div className="admin-hero-orbs" aria-hidden>
        <span className="admin-hero-orb admin-hero-orb--1" />
        <span className="admin-hero-orb admin-hero-orb--2" />
      </div>
      <header className="relative z-[1] admin-page-header">
        <p className="admin-page-eyebrow font-display text-sm tracking-[0.15em] text-hora-gold uppercase">
          <span aria-hidden>☸</span> ตั้งค่าระบบ
        </p>
        <h2 className="admin-page-title font-display text-3xl font-medium text-hora-cream">
          สูตร & <span className="text-gradient-gold">ค่าคงที่</span>
        </h2>
      </header>

      <GlassCard mystic className="relative z-[1]" style={{ '--admin-card-i': 0 } as CSSProperties}>
        <h3 className="mb-4 font-display text-lg text-gradient-gold">ระบบคำนวณ (คงที่)</h3>
        <dl className="space-y-2">
          {CALCULATION_SETTINGS_LABELS.map(({ key, label }) => (
            <div
              key={key}
              className="admin-setting-row flex flex-wrap justify-between gap-2 rounded-lg border border-hora-gold/10 bg-hora-bg/40 px-3 py-2.5 text-sm"
            >
              <dt className="text-hora-cream">{label}</dt>
              <dd className="font-mono text-xs text-hora-muted">{CALCULATION_SETTINGS[key]}</dd>
            </div>
          ))}
        </dl>
      </GlassCard>

      <GlassCard
        mystic
        glow={false}
        className="relative z-[1]"
        style={{ '--admin-card-i': 1 } as CSSProperties}
      >
        <h3 className="mb-4 font-display text-lg text-hora-gold-light">ดาว / สถิตรราศี</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs text-hora-muted uppercase">ดาว</p>
            <div className="flex flex-wrap gap-1.5">
              {PLANETS.map((p, i) => (
                <span
                  key={p}
                  className="mystic-chip mystic-chip--planet rounded-full border border-hora-gold/15 px-2 py-0.5 text-xs text-hora-cream"
                  style={{ animationDelay: `${i * 40}ms` } as React.CSSProperties}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-hora-muted uppercase">ราศี</p>
            <div className="flex flex-wrap gap-1.5">
              {SIGNS.map((s, i) => (
                <span
                  key={s}
                  className="mystic-chip mystic-chip--sign rounded-full border border-hora-gold/15 px-2 py-0.5 text-xs text-hora-cream"
                  style={{ animationDelay: `${i * 35}ms` } as React.CSSProperties}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      <SuryayatImportForm />
    </div>
  )
}
