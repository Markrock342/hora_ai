import type { AstrologyResult } from '../types/astrology'

interface SummaryCardProps {
  result: AstrologyResult
}

/** ระบบคำนวณคงที่ — ไม่พึ่ง calculationSettings.ts */
const CALC_SETTINGS_DISPLAY = [
  'สุริยยาตร์',
  'ลาหิรี',
  'อันโตนาทีสามัญ สมผุสอาทิตย์อุทัย',
  'ราหู ๘ ราศีกุมภ์',
  'ทักษาราหู = พุธกลางคืน',
  'ทักษานับตากลาง',
]

export function SummaryCard({ result }: SummaryCardProps) {
  const { input, meta, calculatedAt } = result
  const calculatedLabel = new Date(calculatedAt).toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <section className="summary-card summary-card-mystic rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md print:rounded-none print:border print:border-gray-300 print:bg-gray-50">
      <header className="summary-card-header border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-5 py-4 print:border-gray-300 print:bg-gray-100">
        <div className="flex items-center gap-3">
          <span className="summary-card-icon text-hora-gold-light" aria-hidden>
            ☽
          </span>
          <div>
            <h3 className="font-display text-xl font-medium text-gradient-gold print:text-base print:font-bold print:text-black">
              ข้อมูลเจ้าชะตา
            </h3>
            <p className="text-xs text-hora-muted print:text-gray-600">
              คำนวณเมื่อ {calculatedLabel}
            </p>
          </div>
        </div>
      </header>

      <dl className="summary-card-grid grid gap-3 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3 print:gap-3 print:py-4">
        <div className="summary-card-field">
          <dt className="text-xs font-medium tracking-wide text-hora-gold-dim uppercase print:text-gray-600">
            วันเวลาเกิด
          </dt>
          <dd className="mt-1 font-display text-lg text-hora-accent print:text-black">
            {meta.birthDisplay}
          </dd>
        </div>
        <div className="summary-card-field">
          <dt className="text-xs font-medium tracking-wide text-hora-gold-dim uppercase print:text-gray-600">
            สถานที่เกิด
          </dt>
          <dd className="mt-1 text-base text-hora-cream print:text-black">
            {meta.locationDisplay}
          </dd>
        </div>
        <div className="summary-card-field sm:col-span-2 lg:col-span-1">
          <dt className="text-xs font-medium tracking-wide text-hora-gold-dim uppercase print:text-gray-600">
            รายละเอียดที่กรอก
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-hora-cream print:text-black">
            {input.day}/{input.month}/{input.year} เวลา {input.time || '—'}
            <span className="mx-1 text-hora-muted print:text-gray-500">·</span>
            {input.district}, {input.province}, {input.country}
          </dd>
        </div>
      </dl>

      <footer className="summary-card-footer border-t border-hora-gold/15 px-5 py-3 print:border-gray-200">
        <div className="summary-card-tags flex flex-wrap gap-1.5">
          {CALC_SETTINGS_DISPLAY.map((label) => (
            <span key={label} className="summary-card-tag">
              {label}
            </span>
          ))}
        </div>
      </footer>
    </section>
  )
}