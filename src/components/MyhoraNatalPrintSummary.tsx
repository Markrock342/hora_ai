import { CALCULATION_SETTINGS_LABELS } from '../data/calculationSettings'
import type { MyhoraDateDetail } from '../types/myhora'

interface MyhoraNatalPrintSummaryProps {
  natal: MyhoraDateDetail
  /** ข้อความสรุประบบจาก myhora (เช่น ลัคนาอันโตนาที + เวลาอาทิตย์ขึ้น) */
  settingsLine?: string | null
}

/**
 * สรุปดวงกำเนิดด้านบนเมื่อพิมพ์ — โครงใกล้ myhora (ข้อความจันทรคติ · พิกัด · อาทิตย์ขึ้น/ตก)
 */
export function MyhoraNatalPrintSummary({
  natal,
  settingsLine,
}: MyhoraNatalPrintSummaryProps) {
  const calcLine =
    settingsLine ??
    `ปฏิทินโหราศาสตร์ไทย ${CALCULATION_SETTINGS_LABELS.map((s) => s.label).join(' · ')}`

  return (
    <section
      className="myhora-natal-print hidden print:block"
      aria-label="สรุปดวงกำเนิด"
    >
      <p className="myhora-natal-print-settings">{calcLine}</p>
      <h2 className="myhora-natal-print-title">{natal.title}</h2>
      <div className="myhora-natal-print-body">
        {natal.lines.map((line, i) => (
          <p key={i} className={`myhora-natal-print-line myhora-natal-print-line--${line.type}`}>
            {line.text}
          </p>
        ))}
      </div>
    </section>
  )
}
