import type { AstrologyResult } from '../types/astrology'
import { clearReportPrintState, prepareReportPrint } from '../utils/reportPrint'

interface PrintButtonProps {
  result: AstrologyResult
}

/** พิมพ์รายงานทั้งหมด — ขาวดำบนกระดาษ */
export function PrintButton({ result }: PrintButtonProps) {
  const handlePrint = () => {
    prepareReportPrint()

    const prevTitle = document.title
    const lagna = result.meta.lagna ?? result.chart?.lagna
    const titleName = lagna
      ? `${result.meta.birthDisplay} — ลัคนา ${lagna}`
      : result.meta.birthDisplay || 'ดวงชะตา'
    document.title = `NewHora — ${titleName}`

    const onAfterPrint = () => {
      document.title = prevTitle
      clearReportPrintState()
      window.removeEventListener('afterprint', onAfterPrint)
    }
    window.addEventListener('afterprint', onAfterPrint)
    window.print()
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="btn-primary btn-primary-mystic text-xs no-print"
      aria-label="พิมพ์รายงานผลลัพธ์ทั้งหมด"
    >
      <span className="btn-primary-mystic-icon" aria-hidden>
        ✦
      </span>{' '}
      พิมพ์รายงาน
    </button>
  )
}
