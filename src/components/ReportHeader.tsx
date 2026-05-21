import { CALCULATION_SETTINGS_LABELS } from '../data/calculationSettings'
import type { AstrologyResult } from '../types/astrology'

interface ReportHeaderProps {
  result: AstrologyResult
}

export function ReportHeader({ result }: ReportHeaderProps) {
  const { meta, calculatedAt } = result
  const calculatedLabel = new Date(calculatedAt).toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <header className="report-print-header mb-6 hidden border-b-2 border-black pb-4 print:block">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">
            รายงานตำแหน่งดาว (สถิตราศี)
          </p>
          <h1 className="mt-1 text-2xl font-bold text-black">NewHora</h1>
        </div>
        <p className="text-right text-xs text-gray-600">
          พิมพ์เมื่อ {new Date().toLocaleString('th-TH')}
          <br />
          คำนวณเมื่อ {calculatedLabel}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {meta.subjectName && (
          <div className="col-span-2">
            <dt className="font-medium text-gray-600">เจ้าชะตา</dt>
            <dd className="text-lg font-semibold text-black">{meta.subjectName}</dd>
          </div>
        )}
        <div>
          <dt className="font-medium text-gray-600">วันเวลาเกิด</dt>
          <dd className="text-black">{meta.birthDisplay}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">สถานที่เกิด</dt>
          <dd className="text-black">{meta.locationDisplay}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-gray-600">
        ระบบ:{' '}
        {CALCULATION_SETTINGS_LABELS.map((s) => s.label).join(' · ')}
      </p>
    </header>
  )
}
