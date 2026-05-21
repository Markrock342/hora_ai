import type { AstrologyResult } from '../types/astrology'
import { buildDashboardTables } from './dashboardTableTypes'

interface ExportButtonProps {
  result: AstrologyResult
  filenamePrefix?: string
}

export function ExportButton({
  result,
  filenamePrefix = 'newhora-chart',
}: ExportButtonProps) {
  const handleExportJson = () => {
    const payload = {
      ...result,
      dashboardTables: buildDashboardTables(result),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filenamePrefix}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      type="button"
      onClick={handleExportJson}
      className="btn-ghost btn-ghost-mystic text-xs no-print"
      aria-label="ส่งออกผลลัพธ์เป็น JSON"
    >
      Export JSON
    </button>
  )
}