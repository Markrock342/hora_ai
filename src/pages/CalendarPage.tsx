import { useMemo, useState, type CSSProperties } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { PageAmbient } from '../components/ui/PageAmbient'
import { PLANETS } from '../data/astrologyConstants'
import { getPlanetTheme, getSignTheme } from '../data/planetTheme'
import { resolvePlaceCoords } from '../data/placeCoordinates'
import { computeFullChartSync } from '../utils/formulas/pipeline'

const MONTHS = [
  { value: 1, label: 'มกราคม' },
  { value: 2, label: 'กุมภาพันธ์' },
  { value: 3, label: 'มีนาคม' },
  { value: 4, label: 'เมษายน' },
  { value: 5, label: 'พฤษภาคม' },
  { value: 6, label: 'มิถุนายน' },
  { value: 7, label: 'กรกฎาคม' },
  { value: 8, label: 'สิงหาคม' },
  { value: 9, label: 'กันยายน' },
  { value: 10, label: 'ตุลาคม' },
  { value: 11, label: 'พฤศจิกายน' },
  { value: 12, label: 'ธันวาคม' },
]

const PLANET_ABBRS: Record<string, string> = {
  อาทิตย์: '๑',
  จันทร์: '๒',
  อังคาร: '๓',
  พุธ: '๔',
  พฤหัสบดี: '๕',
  ศุกร์: '๖',
  เสาร์: '๗',
  ราหู: '๘',
  เกตุ: '๙',
  มฤตยู: '๐',
}

const WEEKDAYS_TH = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.']

export function CalendarPage() {
  const [selectYear, setSelectYear] = useState<number>(2549) // Default matching example case
  const [selectMonth, setSelectMonth] = useState<number>(5) // May

  // Year choices from 2400 to 2600
  const yearChoices = useMemo(() => {
    const arr = []
    for (let y = 2600; y >= 2400; y--) {
      arr.push(y)
    }
    return arr
  }, [])

  const daysData = useMemo(() => {
    const ceYear = selectYear - 543
    const daysInMonth = new Date(ceYear, selectMonth, 0).getDate()
    const place = resolvePlaceCoords('ไทย', 'กรุงเทพมหานคร', 'พระนคร')

    const list = []
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(ceYear, selectMonth - 1, day)
      const dayOfWeek = WEEKDAYS_TH[dateObj.getDay()] ?? ''
      
      const birthInput = {
        day,
        month: selectMonth,
        year: ceYear,
        time: '12:00', // Standard reference time (midday)
        country: 'ไทย',
        province: 'กรุงเทพมหานคร',
        district: 'พระนคร',
      }

      const calc = computeFullChartSync(birthInput, place)
      list.push({
        day,
        dayOfWeek,
        planets: calc.planets,
        source: calc.source,
      })
    }
    return list
  }, [selectYear, selectMonth])

  return (
    <div className="mystic-page calendar-page-mystic relative space-y-8">
      <PageAmbient variant="result" />
      
      <header className="relative z-[1] calendar-page-header">
        <p className="calendar-page-eyebrow font-display text-sm tracking-[0.15em] text-hora-gold uppercase">
          <span aria-hidden>📅</span> ไดอารี่ดาวสถิตราศี
        </p>
        <h2 className="calendar-page-title font-display text-3xl font-medium text-hora-cream">
          ปฏิทิน <span className="text-gradient-gold">100 ปีสุริยยาตร์</span>
        </h2>
        <p className="mt-2 text-xs text-hora-muted">
          ตำแหน่งดาวพระเคราะห์สถิตราศี เวลา 12:00 น. (คำนวณอ้างอิงพิกัดพระนคร)
        </p>
      </header>

      {/* Select Controls */}
      <GlassCard mystic className="relative z-[1] no-print">
        <div className="flex flex-wrap items-end gap-6">
          <label className="flex flex-col gap-1.5 min-w-[120px]">
            <span className="text-xs text-hora-gold-dim uppercase tracking-wider">เลือกปี พ.ศ.</span>
            <select
              className="hora-input hora-input-3d hora-select"
              value={selectYear}
              onChange={(e) => setSelectYear(Number(e.target.value))}
            >
              {yearChoices.map((y) => (
                <option key={y} value={y}>
                  พ.ศ. {y}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 min-w-[150px]">
            <span className="text-xs text-hora-gold-dim uppercase tracking-wider">เลือกเดือน</span>
            <select
              className="hora-input hora-input-3d hora-select"
              value={selectMonth}
              onChange={(e) => setSelectMonth(Number(e.target.value))}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <div className="text-xs text-hora-muted py-2">
            พบข้อมูลปฏิทินหลวง (บันทึกคงที่) ในเครื่องเฉพาะปี พ.ศ. 2549 · ปีอื่นจะใช้วิธีคำนวณประมาณผลดาราศาสตร์ชดเชย
          </div>
        </div>
      </GlassCard>

      {/* Calendar Grid Table */}
      <GlassCard mystic className="relative z-[1] overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs min-w-[800px]">
          <thead>
            <tr className="border-b border-hora-gold/20 text-hora-gold-light font-display uppercase tracking-wider">
              <th className="py-3 px-2 text-center w-[80px]">วันที่</th>
              {PLANETS.map((planet) => {
                const abbr = PLANET_ABBRS[planet] || '?'
                const theme = getPlanetTheme(planet)
                return (
                  <th key={planet} className="py-3 px-1.5 text-center" style={{ minWidth: 60 }}>
                    <div style={{ color: theme.color }} className="text-sm font-semibold mb-0.5">
                      {abbr}
                    </div>
                    <div className="text-[9px] text-hora-muted font-normal">{planet}</div>
                  </th>
                )
              })}
              <th className="py-3 px-2 text-center w-[110px]">แหล่งข้อมูล</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hora-gold/10 font-sans">
            {daysData.map((row) => {
              const isReferenceSource = row.source.startsWith('suryayat-100')
              return (
                <tr key={row.day} className="hover:bg-hora-gold/5 transition-colors">
                  <td className="py-3 px-2 text-center font-display font-medium text-hora-cream">
                    <span className="text-hora-muted mr-1">{row.dayOfWeek}</span>
                    {row.day}
                  </td>
                  {row.planets.map((p) => {
                    const signTheme = getSignTheme(p.siderealSign)
                    return (
                      <td key={p.planet} className="py-2 px-1 text-center">
                        <span
                          className="inline-block rounded-md px-1.5 py-0.5 text-[11px] font-medium"
                          style={{
                            backgroundColor: signTheme.bg,
                            color: signTheme.hue,
                            border: `1px solid ${signTheme.hue}25`,
                          }}
                        >
                          {p.siderealSign}
                        </span>
                      </td>
                    )
                  })}
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        isReferenceSource
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'bg-hora-gold/10 text-hora-gold-light border border-hora-gold/20'
                      }`}
                    >
                      {isReferenceSource ? 'ปฏิทินหลวง' : 'คำนวณสุริยศาสตร์'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
