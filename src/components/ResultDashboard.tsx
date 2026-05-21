import { useMemo } from 'react'
import type { AstrologyResult } from '../types/astrology'
import { SIGNS } from '../data/astrologyConstants'
import { birthDataSeed } from '../utils/dateTimeUtils'
import { SummaryCard } from './SummaryCard'
import { PrintButton } from './PrintButton'
import { ExportButton } from './ExportButton'
import {
  ResultTable,
  PLANET_SIGN_COLUMNS,
  TAKSA_COLUMNS,
  RASHI_BHAVA_COLUMNS,
  type PlanetSignRow,
  type TaksaRow,
  type RashiBhavaRow,
} from './ResultTable'

const TABLE_ROW_COUNT = 25

const TAKSA_COUNT_FROM = ['กลาง', 'ลัคนา', 'จันทร์', 'อาทิตย์'] as const
const HOUSE_LORDS = [
  'อาทิตย์',
  'จันทร์',
  'อังคาร',
  'พุธ',
  'พฤหัสบดี',
  'ศุกร์',
  'เสาร์',
  'ราหู',
  'เกตุ',
] as const

interface ResultDashboardProps {
  result: AstrologyResult
}

function pick<T>(arr: readonly T[], index: number): T {
  return arr[((index % arr.length) + arr.length) % arr.length] as T
}

/** ขยาย/เติมให้ครบ 25 แถว */
function buildPlanetRows(result: AstrologyResult): PlanetSignRow[] {
  const { planets, input } = result
  const seed = birthDataSeed(input)

  return Array.from({ length: TABLE_ROW_COUNT }, (_, i) => {
    if (i < planets.length) return planets[i]
    return {
      planet: `ทศา ${i + 1}`,
      siderealSign: pick(SIGNS, seed + i * 3),
    }
  })
}

function buildTaksaRows(result: AstrologyResult): TaksaRow[] {
  const seed = birthDataSeed(result.input)

  return Array.from({ length: TABLE_ROW_COUNT }, (_, i) => ({
    taksa: `ทักษา ${i + 1}`,
    countFrom: pick(TAKSA_COUNT_FROM, seed + i),
    position: String((i % 12) + 1),
    sign: pick(SIGNS, seed + i * 5),
  }))
}

function buildRashiBhavaRows(result: AstrologyResult): RashiBhavaRow[] {
  const seed = birthDataSeed(result.input)

  return Array.from({ length: TABLE_ROW_COUNT }, (_, i) => ({
    bhava: String(i + 1),
    sign: pick(SIGNS, seed + i),
    house: `เรือน ${(i % 12) + 1}`,
    lord: pick(HOUSE_LORDS, seed + i * 2),
  }))
}

export function ResultDashboard({ result }: ResultDashboardProps) {
  const planetRows = useMemo(() => buildPlanetRows(result), [result])
  const taksaRows = useMemo(() => buildTaksaRows(result), [result])
  const rashiRows = useMemo(() => buildRashiBhavaRows(result), [result])

  const calculatedLabel = new Date(result.calculatedAt).toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="result-dashboard space-y-8 print:space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4 no-print">
        <header>
          <p className="font-display text-sm tracking-[0.15em] text-hora-gold uppercase">
            รายงานผลลัพธ์
          </p>
          <h2 className="font-display text-3xl font-medium text-hora-cream md:text-4xl">
            ตาราง<span className="text-gradient-gold">โหราศาสตร์</span>
          </h2>
          <p className="mt-2 text-sm text-hora-muted">คำนวณเมื่อ {calculatedLabel}</p>
        </header>
        <div className="print-actions-mystic flex flex-wrap gap-2">
          <ExportButton result={result} />
          <PrintButton result={result} />
        </div>
      </div>

      <article
        id="astrology-report"
        className="astrology-report flex flex-col gap-6 print:gap-5"
        aria-label="รายงานโหราศาสตร์"
      >
        <SummaryCard result={result} />

        <ResultTable<PlanetSignRow>
          title="ตารางดาว"
          subtitle="ดาวเคราะห์และสถิตราศี — 25 แถว"
          columns={[...PLANET_SIGN_COLUMNS]}
          rows={planetRows}
          variant="chart"
          rowNumber
        />

        <ResultTable<TaksaRow>
          title="ตารางทักษา"
          subtitle="ทักษาและตำแหน่ง — 25 แถว"
          columns={[...TAKSA_COLUMNS]}
          rows={taksaRows}
          variant="chart"
          rowNumber
        />

        <ResultTable<RashiBhavaRow>
          title="ตารางราศี / ภพ / เรือน"
          subtitle="ภพ ราศี เรือน เจ้าเรือน — 25 แถว"
          columns={[...RASHI_BHAVA_COLUMNS]}
          rows={rashiRows}
          variant="chart"
          rowNumber
        />

        <footer className="hidden border-t border-gray-300 pt-4 text-center text-xs text-gray-500 print:block">
          NewHora — ตารางดาว · ทักษา · ราศี/ภพ/เรือน
        </footer>
      </article>
    </div>
  )
}