import type { CalculationSource } from '../types/astrology'

interface ResultCalculationNoticeProps {
  source: CalculationSource | undefined
  isMyhoraPanel: boolean
}

export function ResultCalculationNotice({
  source,
  isMyhoraPanel,
}: ResultCalculationNoticeProps) {
  if (source === 'myhora-scrape' && isMyhoraPanel) {
    return (
      <p className="result-calc-notice result-calc-notice--myhora rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100/90 no-print">
        <strong className="text-emerald-200">กราฟและตารางจาก myhora.com</strong>
        {' — '}
        ตัวเลขดำในวงราศีจักร = ดวงกำเนิด · ตัวแดง = วันจร (ปรับได้ด้านล่าง)
      </p>
    )
  }

  if (source === 'suryayat-100-reference' || source === 'suryayat-100-year') {
    return (
      <p className="result-calc-notice rounded-lg border border-hora-gold/25 bg-hora-panel/60 px-4 py-3 text-sm text-hora-cream/90 no-print">
        ใช้ปฏิทินสุริยยาตร์ที่บันทึกจาก myhora สำหรับวันเวลานี้
      </p>
    )
  }

  if (source === 'formula-pipeline' || source === 'ephemeris-fallback') {
    return (
      <p className="result-calc-notice result-calc-notice--warn rounded-lg border border-amber-500/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-100/90 no-print">
        <strong className="text-amber-200">ผลประมาณ — อาจไม่ตรง myhora.com</strong>
        {' — '}
        ดึงข้อมูลจาก myhora ไม่สำเร็จ หรือยังไม่มีปฏิทินวันนี้ในระบบ
        {' '}
        ลองรีเฟรชหรือรันผ่านเซิร์ฟเวอร์ที่มี proxy{' '}
        <code className="text-amber-200/80">/api/myhora</code>
      </p>
    )
  }

  return null
}
