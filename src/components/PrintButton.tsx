import type { AstrologyResult } from '../types/astrology'

interface PrintButtonProps {
  result: AstrologyResult
}

export function PrintButton({ result }: PrintButtonProps) {
  const handlePrint = () => {
    const prevTitle = document.title
    const lagna = result.meta.lagna ?? result.chart?.lagna
    const titleName = lagna
      ? `${result.meta.birthDisplay} — ลัคนา ${lagna}`
      : result.meta.birthDisplay || 'ดวงชะตา'
    document.title = `NewHora — ${titleName}`
    window.print()
    document.title = prevTitle
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="btn-primary btn-primary-mystic text-xs no-print"
      aria-label="พิมพ์รายงานผลลัพธ์"
    >
      <span className="btn-primary-mystic-icon" aria-hidden>
        ✦
      </span>{' '}
      พิมพ์รายงาน
    </button>
  )
}