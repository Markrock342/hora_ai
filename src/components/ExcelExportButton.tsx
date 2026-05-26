import type { AstrologyResult } from '../types/astrology'
import { exportToExcel } from '../utils/excelExporter'

interface ExcelExportButtonProps {
  result: AstrologyResult
}

export function ExcelExportButton({ result }: ExcelExportButtonProps) {
  const handleExport = () => {
    exportToExcel(result)
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="btn-primary btn-primary-mystic text-xs no-print"
      aria-label="ดาวน์โหลดข้อมูลเป็นไฟล์ Excel"
    >
      <span className="btn-primary-mystic-icon" aria-hidden>
        ✦
      </span>{' '}
      ดาวน์โหลด Excel
    </button>
  )
}
