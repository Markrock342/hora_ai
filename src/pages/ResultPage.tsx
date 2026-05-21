import { Link } from 'react-router-dom'
import { BirthInfoBanner } from '../components/BirthInfoBanner'
import { CalculationSettingsBadge } from '../components/CalculationSettingsBadge'
import { PrintButton } from '../components/PrintButton'
import { ReportHeader } from '../components/ReportHeader'
import {
  HOUSE_TABLE_COLUMNS,
  PLANET_SIGN_COLUMNS,
  PLANET_TABLE_COLUMNS,
  TAKSA_TABLE_COLUMNS,
} from '../components/resultTableColumns'
import { ResultTable } from '../components/ResultTable'
import { useAstrology } from '../context/AstrologyContext'
import { TABLE_ROW_COUNT } from '../types/astrology'
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
          <p className="mt-2 text-sm text-hora-muted">กรอกข้อมูลเกิดเพื่อเปิดเผยดวงชะตา</p>
          <Link to="/" className="btn-primary btn-primary-mystic mt-8 inline-block">
            กรอกข้อมูลเกิด
          </Link>
        </GlassCard>
      </div>
    )
  }

  const { meta, tables, planets } = result
  const totalRows =
    tables.planets.length + tables.taksa.length + tables.houses.length

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
            รายงาน<span className="text-gradient-gold">ดวงชะตา</span>
          </h2>
          <p className="mt-2 text-sm text-hora-muted">
            {new Date(result.calculatedAt).toLocaleString('th-TH')}
            {' · '}
            {totalRows} แถว (mock)
          </p>
          <div className="result-stats-row">
            {meta.subjectName && (
              <span className="result-stat-chip result-stat-chip--gold">
                <span className="result-stat-chip-icon" aria-hidden>
                  ✦
                </span>
                {meta.subjectName}
              </span>
            )}
            <span className="result-stat-chip">
              <span className="result-stat-chip-icon" aria-hidden>
                ☉
              </span>
              4 ตาราง
            </span>
            <span className="result-stat-chip">
              <span className="result-stat-chip-icon" aria-hidden>
                ☽
              </span>
              สถิตราศี
            </span>
          </div>
        </header>
        <PrintButton result={result} />
      </div>

      <article
        id="astrology-report"
        className="astrology-report relative z-[1] space-y-6 print:space-y-5"
        aria-label="รายงานโหราศาสตร์"
      >
        <ReportHeader result={result} />

        <div className="result-info-stack no-print">
          <BirthInfoBanner
            subjectName={meta.subjectName}
            birth={meta.birthDisplay}
            location={meta.locationDisplay}
          />
          <CalculationSettingsBadge />
          <p className="mystic-mock-banner">
            <span className="mystic-mock-banner-pulse" aria-hidden>
              ◈
            </span>
            <span>
              โหมด mock — สูตรจริงรอจากลูกค้า ·{' '}
              <code>docs/FORMULA_SOURCES.md</code>
            </span>
          </p>
        </div>

        <div className="result-section-divider no-print" aria-hidden>
          ตารางดวงชะตา
        </div>

        <ResultTable
          title="ตารางที่ 1 — ดาว"
          subtitle={`${TABLE_ROW_COUNT} แถว`}
          columns={PLANET_TABLE_COLUMNS}
          rows={tables.planets}
          variant="chart"
          staggerIndex={0}
        />

        <ResultTable
          title="ตารางที่ 2 — ทักษา"
          subtitle={`${TABLE_ROW_COUNT} แถว`}
          columns={TAKSA_TABLE_COLUMNS}
          rows={tables.taksa}
          staggerIndex={1}
        />

        <ResultTable
          title="ตารางที่ 3 — ราศี / ภพ / เรือน"
          subtitle={`${TABLE_ROW_COUNT} แถว`}
          columns={HOUSE_TABLE_COLUMNS}
          rows={tables.houses}
          staggerIndex={2}
        />

        <div className="result-section-divider no-print" aria-hidden>
          สรุปดาวหลัก
        </div>

        <ResultTable
          title="สรุป — ดาวหลัก (10 ดวง)"
          subtitle="2 คอลัมน์"
          columns={PLANET_SIGN_COLUMNS}
          rows={planets}
          variant="chart"
          staggerIndex={3}
        />

        <footer className="hidden border-t border-gray-300 pt-4 text-center text-xs text-gray-500 print:block">
          NewHora — {totalRows} แถว · {meta.subjectName}
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
