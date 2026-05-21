import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import type { CalcNavState } from '../constants/calcTransition'
import type { AstrologyResult } from '../types/astrology'
import { RasiChakraChart } from './RasiChakraChart'
import { TABLE_ROW_COUNT, buildDashboardTables } from './dashboardTableTypes'
import { SummaryCard } from './SummaryCard'
import { PrintButton } from './PrintButton'
import { ExportButton } from './ExportButton'
import { ReportHeader } from './ReportHeader'
import { ResultTable } from './ResultTable'
import {
  HOUSE_TABLE_COLUMNS,
  PLANET_TABLE_COLUMNS,
  TAKSA_TABLE_COLUMNS,
} from './resultTableColumns'
import { ScrollReveal } from './ui/ScrollReveal'

interface ResultDashboardProps {
  result: AstrologyResult
}

export function ResultDashboard({ result }: ResultDashboardProps) {
  const location = useLocation()
  const fromCalc = Boolean((location.state as CalcNavState | null)?.fromCalc)
  const { meta } = result
  const lagna = meta.lagna ?? result.chart?.lagna
  const tables = useMemo(() => buildDashboardTables(result), [result])
  const totalRows = tables.planets.length + tables.taksa.length + tables.houses.length

  return (
    <>
      <div className="relative z-[1] flex flex-wrap items-start justify-between gap-4 no-print">
        <ScrollReveal as="header" variant="up" className="result-page-header">
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
            {totalRows} แถว
          </p>
          {lagna && (
            <div className="result-stats-row mt-3">
              <span className="result-stat-chip result-stat-chip--gold">
                <span className="result-stat-chip-icon" aria-hidden>
                  ✦
                </span>
                ลัคนา {lagna}
              </span>
              <span className="result-stat-chip">
                <span className="result-stat-chip-icon" aria-hidden>
                  ☉
                </span>
                3 ตาราง
              </span>
            </div>
          )}
        </ScrollReveal>
        <ScrollReveal variant="right" delay={80} className="print-actions-mystic flex flex-wrap gap-2">
          <ExportButton result={result} />
          <PrintButton result={result} />
        </ScrollReveal>
      </div>

      <article
        id="astrology-report"
        className="astrology-report relative z-[1] flex flex-col gap-6 print:gap-5"
        aria-label="รายงานโหราศาสตร์"
      >
        <ScrollReveal variant="up" delay={60}>
          <ReportHeader result={result} />
        </ScrollReveal>

        {fromCalc ? (
          <RasiChakraChart result={result} animateOnEnter />
        ) : (
          <ScrollReveal variant="scale" delay={80}>
            <RasiChakraChart result={result} />
          </ScrollReveal>
        )}

        <ScrollReveal variant="scale" delay={120}>
          <SummaryCard result={result} />
        </ScrollReveal>

        <div className="result-section-divider no-print" aria-hidden>
          ตารางดวงชะตา
        </div>

        <ScrollReveal variant="up" delay={0}>
          <ResultTable
            title="ตารางที่ 1 — ดาว"
            subtitle={`${TABLE_ROW_COUNT} แถว`}
            columns={PLANET_TABLE_COLUMNS}
            rows={tables.planets}
            variant="chart"
            staggerIndex={0}
          />
        </ScrollReveal>

        <ScrollReveal variant="up" delay={100}>
          <ResultTable
            title="ตารางที่ 2 — ทักษา"
            subtitle={`${TABLE_ROW_COUNT} แถว`}
            columns={TAKSA_TABLE_COLUMNS}
            rows={tables.taksa}
            variant="chart"
            staggerIndex={1}
          />
        </ScrollReveal>

        <ScrollReveal variant="up" delay={200}>
          <ResultTable
            title="ตารางที่ 3 — ราศี / ภพ / เรือน"
            subtitle={`${TABLE_ROW_COUNT} แถว`}
            columns={HOUSE_TABLE_COLUMNS}
            rows={tables.houses}
            variant="chart"
            staggerIndex={2}
          />
        </ScrollReveal>

        <footer className="hidden border-t border-gray-300 pt-4 text-center text-xs text-gray-500 print:block">
          NewHora — {totalRows} แถว · {meta.birthDisplay}
        </footer>
      </article>
    </>
  )
}
