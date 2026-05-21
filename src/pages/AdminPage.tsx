import { CALCULATION_SETTINGS, CALCULATION_SETTINGS_LABELS } from '../data/calculationSettings'
import { PLANETS, SIGNS } from '../data/astrologyConstants'
import { GlassCard } from '../components/ui/GlassCard'

export function AdminPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="font-display text-sm tracking-[0.15em] text-hora-gold uppercase">
          ตั้งค่าระบบ
        </p>
        <h2 className="font-display text-3xl font-medium text-hora-cream">
          สูตร & <span className="text-gradient-gold">ค่าคงที่</span>
        </h2>
      </header>

      <GlassCard>
        <h3 className="mb-4 font-display text-lg text-gradient-gold">ระบบคำนวณ (คงที่)</h3>
        <dl className="space-y-2">
          {CALCULATION_SETTINGS_LABELS.map(({ key, label }) => (
            <div
              key={key}
              className="flex flex-wrap justify-between gap-2 rounded-lg border border-hora-gold/10 bg-hora-bg/40 px-3 py-2.5 text-sm"
            >
              <dt className="text-hora-cream">{label}</dt>
              <dd className="font-mono text-xs text-hora-muted">{CALCULATION_SETTINGS[key]}</dd>
            </div>
          ))}
        </dl>
      </GlassCard>

      <GlassCard glow={false}>
        <h3 className="mb-4 font-display text-lg text-hora-gold-light">ดาว / สถิตรราศี</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs text-hora-muted uppercase">ดาว</p>
            <div className="flex flex-wrap gap-1.5">
              {PLANETS.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-hora-gold/15 px-2 py-0.5 text-xs text-hora-cream"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-hora-muted uppercase">ราศี</p>
            <div className="flex flex-wrap gap-1.5">
              {SIGNS.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-hora-gold/15 px-2 py-0.5 text-xs text-hora-cream"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
