import type { AstrologyResult } from '../types/astrology'

interface PrintButtonProps {
  result: AstrologyResult
}

export function PrintButton({ result }: PrintButtonProps) {
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newhora-chart-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    const prevTitle = document.title
    document.title = `NewHora — ${result.meta.birthDisplay}`
    window.print()
    document.title = prevTitle
  }

  return (
    <div className="flex flex-wrap gap-2 no-print">
      <button type="button" onClick={handleExportJson} className="btn-ghost text-xs">
        Export JSON
      </button>
      <button type="button" onClick={handlePrint} className="btn-primary text-xs">
        พิมพ์รายงาน
      </button>
    </div>
  )
}
