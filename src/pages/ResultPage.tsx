import { Link } from 'react-router-dom'
import { BirthInfoBanner } from '../components/BirthInfoBanner'
import { CalculationSettingsBadge } from '../components/CalculationSettingsBadge'
import { PrintButton } from '../components/PrintButton'
import { ReportHeader } from '../components/ReportHeader'
import { PLANET_SIGN_COLUMNS } from '../components/resultTableColumns'
import { MyhoraSummaryBanner } from '../components/MyhoraSummaryBanner'
import { MyhoraTaksaTable } from '../components/MyhoraTaksaTable'
import { MyhoraTriwaiTable } from '../components/MyhoraTriwaiTable'
import { RasiChakraChart } from '../components/RasiChakraChart'
import { ResultTable } from '../components/ResultTable'
import { useAstrology } from '../context/AstrologyContext'
import { GlassCard } from '../components/ui/GlassCard'
import { PageAmbient } from '../components/ui/PageAmbient'

export function ResultPage() {
  const { result } = useAstrology()

  if (!result) {
    return (
      <div className="mystic-page result-page-mystic result-page-mystic--empty relative">
        <PageAmbient variant="result" />
        <GlassCard mystic className="mystic-empty-card text-center">
          <div className="mystic-empty-mandala" aria-hidden />
          <p className="mystic-empty-moon text-5xl text-hora-gold/60">☽</p>
          <p className="mt-4 font-display text-lg text-hora-cream">ยังไม่มีผลคำนวณ</p>
          <p className="mt-2 text-sm text-hora-muted">กรอกวันเวลาและสถานที่เกิด</p>
          <Link to="/" className="btn-primary btn-primary-mystic mt-8 inline-block">
            กรอกข้อมูลเกิด
          </Link>
        </GlassCard>
      </div>
    )
  }

  const { meta, planets } = result
  const sourceLabel =
    meta.calculationSource === 'myhora-scrape'
      ? 'ดึงจาก myhora.com (thai.aspx) — ตารางทักษา/ตรีวัย/ดาว'
      : meta.calculationSource === 'suryayat-100-reference' ||
          meta.calculationSource === 'suryayat-100-year'
        ? 'ปฏิทินร้อยปี สุริยยาตร์ (ตรง myhora)'
        : meta.calculationSource === 'suryayat-cached'
        ? 'แคชในเครื่อง (คำนวณ/นำเข้าแล้ว)'
        : meta.calculationSource === 'formula-pipeline'
          ? 'สูตร: อันโตนาที + ลาหิรี + ราหู 8 + ทักษา (เทียบ myhora ต่อ)'
          : meta.calculationSource === 'ephemeris-fallback'
            ? 'ประมาณ (ephemeris)'
            : null

  return (
    <div className="mystic-page result-page-mystic relative space-y-8 print:space-y-5">
      <PageAmbient variant="result" />
      <div className="relative z-[1] flex flex-wrap items-start justify-between gap-4 no-print">
        <header className="result-page-header">
          <p className="result-page-eyebrow font-display text-sm tracking-[0.15em] text-hora-gold uppercase">
            <span className="result-page-eyebrow-icon" aria-hidden>
              ✦
            </span>{' '}
            ผลการคำนวณ
          </p>
          <h2 className="result-page-title font-display text-4xl font-medium text-hora-cream">
            สถิตร<span className="text-gradient-gold">ราศี</span>
          </h2>
          <p className="mt-2 text-sm text-hora-muted">
            {new Date(result.calculatedAt).toLocaleString('th-TH')}
            {' · '}
            {planets.length} ดาว
          </p>
        </header>
        <PrintButton result={result} />
      </div>

      <article
        id="astrology-report"
        className="astrology-report relative z-[1] space-y-6 print:space-y-5"
        aria-label="ตารางดาวสถิตรราศี"
      >
        <ReportHeader result={result} />

        <div className="result-info-stack no-print">
          <BirthInfoBanner birth={meta.birthDisplay} location={meta.locationDisplay} />
          <CalculationSettingsBadge />
          {sourceLabel && (
            <p className="text-xs text-hora-gold-dim">{sourceLabel}</p>
          )}
        </div>

        {result.myhora && <MyhoraSummaryBanner tables={result.myhora} />}

        {result.chart && <RasiChakraChart result={result} />}

        {result.myhora && (
          <div className="myhora-tables-row grid gap-6 lg:grid-cols-2">
            <MyhoraTaksaTable tables={result.myhora} />
            <div className="space-y-6">
              <MyhoraTriwaiTable
                title="ตรีวัย"
                subtitle="ดวงกำเนิด"
                grid={result.myhora.triwaiNatal}
              />
              {result.myhora.triwaiTransit.length > 0 && (
                <MyhoraTriwaiTable
                  title="ตรีวัย"
                  subtitle="ดวงจร (วันจร)"
                  grid={result.myhora.triwaiTransit}
                />
              )}
            </div>
          </div>
        )}

        <ResultTable
          title="ดาวสถิตรราศี"
          subtitle="สุริยยาตร์ · ลาหิรี · อันโตนาทีฯ · ราหู ๘ กุมภ์ · ทักษา (คงที่)"
          columns={PLANET_SIGN_COLUMNS}
          rows={planets}
          variant="chart"
          staggerIndex={1}
        />

        <footer className="hidden border-t border-gray-300 pt-4 text-center text-xs text-gray-500 print:block">
          NewHora — {meta.birthDisplay} — {meta.locationDisplay}
        </footer>
      </article>

      <p className="relative z-[1] text-center no-print">
        <Link to="/" className="mystic-back-link text-sm text-hora-gold-dim transition hover:text-hora-gold-light">
          ← แก้ข้อมูลเกิด
        </Link>
      </p>
    </div>
  )
}
