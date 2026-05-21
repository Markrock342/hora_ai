import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { SIGNS } from '../data/astrologyConstants'
import { getPlanetTheme, getSignTheme } from '../data/planetTheme'
import type { AstrologyResult } from '../types/astrology'
import { houseFromLagna, signIndex } from '../utils/chartHouse'

const SIZE = 420
const CX = SIZE / 2
const CY = SIZE / 2
const R_OUTER = 190
const R_INNER = 118
const R_PLANET = 152

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

interface RasiChakraChartProps {
  result: AstrologyResult
  /** เปิดแอนิเมชันวงล้อ + ดาวทีละดวง (หลังคำนวณ) */
  animateOnEnter?: boolean
}

export function RasiChakraChart({ result, animateOnEnter = false }: RasiChakraChartProps) {
  const lagna = result.chart?.lagna ?? result.meta.lagna ?? 'เมษ'
  const lagnaIdx = signIndex(lagna)
  const [chartRevealed, setChartRevealed] = useState(!animateOnEnter)

  useEffect(() => {
    if (!animateOnEnter) {
      setChartRevealed(true)
      return
    }
    setChartRevealed(false)
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setChartRevealed(true))
    })
    return () => cancelAnimationFrame(id)
  }, [animateOnEnter, result.calculatedAt])

  const segments = useMemo(() => {
    return SIGNS.map((sign, i) => {
      const rel = (i - lagnaIdx + 12) % 12
      const startDeg = rel * 30
      const endDeg = startDeg + 30
      const midDeg = startDeg + 15
      const house = rel + 1
      const theme = getSignTheme(sign)
      return { sign, startDeg, endDeg, midDeg, house, theme }
    })
  }, [lagnaIdx])

  const planetsBySign = useMemo(() => {
    const map = new Map<string, typeof result.planets>()
    for (const row of result.planets) {
      const list = map.get(row.siderealSign) ?? []
      list.push(row)
      map.set(row.siderealSign, list)
    }
    return map
  }, [result.planets])

  const planetGlyphs = useMemo(() => {
    const items: {
      key: string
      sign: string
      midDeg: number
      idx: number
      row: (typeof result.planets)[number]
    }[] = []
    for (const { sign, midDeg } of segments) {
      const rows = planetsBySign.get(sign) ?? []
      rows.forEach((row, idx) => {
        items.push({
          key: `${sign}-${row.planet}`,
          sign,
          midDeg,
          idx,
          row,
        })
      })
    }
    return items.map((item, i) => ({ ...item, planetIndex: i }))
  }, [segments, planetsBySign])

  return (
    <section
      className={`rasi-chakra-section gold-glow relative overflow-hidden rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md print:border-gray-300 print:bg-white${chartRevealed ? ' is-chart-revealed' : ''}`}
      aria-label="กราฟราศีจักร"
    >
      <header className="border-b border-hora-gold/20 px-5 py-4 print:border-gray-300">
        <h3 className="font-display text-xl font-medium text-gradient-gold print:text-black">
          ราศีจักร
        </h3>
        <p className="text-xs text-hora-muted print:text-gray-600">
          ลัคนา {lagna} · เรือน Whole Sign · ทักษานับตากลาง
        </p>
      </header>

      <div className="rasi-chakra-body flex flex-col items-center gap-6 p-4 md:flex-row md:p-6">
        <div className="rasi-chakra-wheel-wrap h-auto w-full max-w-[min(100%,420px)] shrink-0">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="rasi-chakra-svg rasi-chakra-wheel h-auto w-full"
            role="img"
            aria-labelledby="rasi-chakra-title"
          >
            <title id="rasi-chakra-title">ราศีจักร ลัคนา {lagna}</title>

            <circle
              cx={CX}
              cy={CY}
              r={R_OUTER}
              fill="none"
              stroke="rgba(212,168,75,0.35)"
              strokeWidth="1.5"
              className="rasi-chakra-ring-outer"
            />
            <circle
              cx={CX}
              cy={CY}
              r={R_INNER}
              fill="rgba(6,8,24,0.55)"
              stroke="rgba(212,168,75,0.2)"
              strokeWidth="1"
            />

            {segments.map(({ sign, startDeg, endDeg, midDeg, house, theme }) => {
              const p1 = polar(CX, CY, R_INNER, startDeg)
              const p2 = polar(CX, CY, R_OUTER, startDeg)
              const p3 = polar(CX, CY, R_OUTER, endDeg)
              const p4 = polar(CX, CY, R_INNER, endDeg)
              const label = polar(CX, CY, (R_OUTER + R_INNER) / 2, midDeg)
              const isLagna = sign === lagna
              return (
                <g key={sign} className="rasi-chakra-segment">
                  <path
                    d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${R_OUTER} ${R_OUTER} 0 0 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${R_INNER} ${R_INNER} 0 0 0 ${p1.x} ${p1.y} Z`}
                    fill={isLagna ? 'rgba(212,168,75,0.18)' : theme.bg}
                    stroke="rgba(212,168,75,0.15)"
                    strokeWidth="0.5"
                  />
                  <text
                    x={label.x}
                    y={label.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-hora-cream font-display text-[11px] print:fill-black"
                    style={{ fontSize: isLagna ? 13 : 11, fontWeight: isLagna ? 600 : 400 }}
                  >
                    {sign}
                  </text>
                  <text
                    x={label.x}
                    y={label.y + 14}
                    textAnchor="middle"
                    className="fill-hora-gold-dim text-[9px] print:fill-gray-600"
                  >
                    {house}
                  </text>
                </g>
              )
            })}

            <text
              x={CX}
              y={CY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-hora-gold font-display text-sm font-medium print:fill-black"
            >
              ลัคนา
            </text>
            <text
              x={CX}
              y={CY + 16}
              textAnchor="middle"
              className="fill-hora-cream text-xs print:fill-black"
            >
              {lagna}
            </text>

            {planetGlyphs.map(({ key, sign, midDeg, idx, row, planetIndex }) => {
              const rows = planetsBySign.get(sign) ?? []
              const offset = (idx - (rows.length - 1) / 2) * 8
              const pos = polar(CX, CY, R_PLANET + offset, midDeg)
              const theme = getPlanetTheme(row.planet)
              return (
                <g
                  key={key}
                  className="rasi-chakra-planet"
                  style={{ '--planet-i': planetIndex } as CSSProperties}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={14}
                    fill="rgba(6,8,24,0.9)"
                    stroke={theme.color}
                    strokeWidth="1.2"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={theme.color}
                    fontSize="14"
                  >
                    {theme.symbol}
                  </text>
                  <title>
                    {row.planet} · {row.siderealSign} · เรือน{' '}
                    {houseFromLagna(lagna, row.siderealSign)}
                  </title>
                </g>
              )
            })}
          </svg>
        </div>

        {result.chart?.taksa && result.chart.taksa.length > 0 && (
          <div className="rasi-chakra-taksa w-full min-w-0 md:max-w-[220px]">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-hora-gold-dim">
              ทักษา (กลาง = ลัคนา)
            </p>
            <ul className="space-y-1.5 text-sm">
              {result.chart.taksa.map((slot, i) => (
                <li
                  key={slot.taksa}
                  className="rasi-chakra-taksa-item flex justify-between gap-2 rounded-lg border border-hora-gold/10 bg-hora-bg/50 px-2.5 py-1.5"
                  style={{ '--taksa-i': i } as CSSProperties}
                >
                  <span className="text-hora-muted">{slot.taksa}</span>
                  <span className="font-medium text-hora-cream">{slot.sign}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-hora-gold/15 px-5 py-3 print:border-gray-200">
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-hora-muted print:text-gray-600">
          {result.planets.map((row) => {
            const theme = getPlanetTheme(row.planet)
            return (
              <li key={row.planet} className="inline-flex items-center gap-1">
                <span style={{ color: theme.color }}>{theme.symbol}</span>
                <span>{row.planet}</span>
                <span className="text-hora-cream print:text-black">{row.siderealSign}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
