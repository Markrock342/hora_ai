import { Link } from 'react-router-dom'
import { BirthInfoBanner } from '../components/BirthInfoBanner'
import { CalculationSettingsBadge } from '../components/CalculationSettingsBadge'
import { PrintButton } from '../components/PrintButton'
import { ReportHeader } from '../components/ReportHeader'
import { PLANET_SIGN_COLUMNS, ResultTable } from '../components/ResultTable'
import { useAstrology } from '../context/AstrologyContext'
import type { PlanetSignRow } from '../types/astrology'
import { GlassCard } from '../components/ui/GlassCard'

export function ResultPage() {
  const { result } = useAstrology()

  if (!result) {
    return (
      <GlassCard className="text-center">
        <p className="text-4xl text-hora-gold/40">☽</p>
        <p className="mt-4 text-hora-muted">ยังไม่มีผลคำนวณ</p>
        <Link to="/" className="btn-primary mt-6 inline-block">
          กรอกข้อมูลเกิด
        </Link>
      </GlassCard>
    )
  }

  const { meta, planets } = result

  return (
    <div className="space-y-8 print:space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4 no-print">
        <header>
          <p className="font-display text-sm tracking-[0.15em] text-hora-gold uppercase">
            ผลการคำนวณ
          </p>
          <h2 className="font-display text-4xl font-medium text-hora-cream">
            ตำแหน่ง<span className="text-gradient-gold">สถิตรราศี</span>
          </h2>
          <p className="mt-2 text-sm text-hora-muted">
            {new Date(result.calculatedAt).toLocaleString('th-TH')}
          </p>
        </header>
        <PrintButton result={result} />
      </div>

      <article
        id="astrology-report"
        className="astrology-report space-y-6 print:space-y-5"
        aria-label="รายงานตำแหน่งดาว"
      >
        <ReportHeader result={result} />

        <div className="no-print space-y-4">
          <BirthInfoBanner birth={meta.birthDisplay} location={meta.locationDisplay} />
          <CalculationSettingsBadge />
        </div>

        <ResultTable<PlanetSignRow>
          title="ตารางดาว"
          columns={PLANET_SIGN_COLUMNS}
          rows={planets}
          variant="chart"
        />

        <footer className="hidden border-t border-gray-300 pt-4 text-center text-xs text-gray-500 print:block">
          NewHora — ดาว / สถิตราศี
        </footer>
      </article>

      <p className="text-center no-print">
        <Link
          to="/"
          className="text-sm text-hora-gold-dim transition hover:text-hora-gold-light"
        >
          ← แก้ข้อมูลเกิด
        </Link>
      </p>
    </div>
  )
}
