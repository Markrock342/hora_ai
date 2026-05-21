import { GlassCard } from './ui/GlassCard'

interface BirthInfoBannerProps {
  birth: string
  location: string
}

export function BirthInfoBanner({ birth, location }: BirthInfoBannerProps) {
  return (
    <GlassCard glow={false} className="!p-5">
      <dl className="grid gap-6 sm:grid-cols-2">
        <div className="flex gap-3">
          <span className="text-2xl text-hora-gold/60">☉</span>
          <div>
            <dt className="text-xs font-medium tracking-wide text-hora-gold-dim uppercase">
              วันเวลาเกิด
            </dt>
            <dd className="mt-1 font-display text-lg text-hora-accent">{birth}</dd>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="text-2xl text-hora-gold/60">⌖</span>
          <div>
            <dt className="text-xs font-medium tracking-wide text-hora-gold-dim uppercase">
              สถานที่เกิด
            </dt>
            <dd className="mt-1 text-base text-hora-cream">{location}</dd>
          </div>
        </div>
      </dl>
    </GlassCard>
  )
}
