import { useEffect, useState } from 'react'
import type { TransitInput } from '../types/transit'
import { TRANSIT_DATE_PRESETS } from '../types/transit'
import { defaultTransitInput } from '../types/transit'

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

interface TransitDateControlsProps {
  transit: TransitInput
  loading?: boolean
  onApply: (next: TransitInput) => void
}

export function TransitDateControls({
  transit,
  loading = false,
  onApply,
}: TransitDateControlsProps) {
  const [draft, setDraft] = useState(transit)

  useEffect(() => {
    setDraft(transit)
  }, [transit])

  const buddhistYear = draft.year >= 1900 ? draft.year + 543 : null
  const customDate = !draft.preset

  return (
    <div className="transit-controls rounded-xl border border-hora-gold/25 bg-hora-panel/80 px-4 py-4 backdrop-blur-md no-print">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-hora-gold-light">ปรับวันจร (ดวงจร)</p>
        <button
          type="button"
          className="text-xs text-hora-gold-dim underline-offset-2 hover:text-hora-gold hover:underline"
          disabled={loading}
          onClick={() => onApply(defaultTransitInput())}
        >
          วันนี้ / ตอนนี้
        </button>
      </div>

      <div
        className={`transit-controls-grid${customDate ? ' transit-controls-grid--custom' : ' transit-controls-grid--preset-only'}`}
      >
        <label className="transit-field transit-field--preset">
          <span className="transit-label">ช่วงดวงจร</span>
          <select
            className="hora-input hora-input-3d hora-select transit-control-input"
            value={draft.preset ?? ''}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                preset: e.target.value || undefined,
              }))
            }
          >
            {TRANSIT_DATE_PRESETS.map((p) => (
              <option key={p.value || 'custom'} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        {customDate ? (
          <>
            <label className="transit-field transit-field--day">
              <span className="transit-label">วัน</span>
              <select
                className="hora-input hora-input-3d hora-select transit-control-input"
                value={draft.day}
                onChange={(e) => setDraft((d) => ({ ...d, day: Number(e.target.value) }))}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>

            <label className="transit-field transit-field--month">
              <span className="transit-label">เดือน</span>
              <select
                className="hora-input hora-input-3d hora-select transit-control-input"
                value={draft.month}
                onChange={(e) => setDraft((d) => ({ ...d, month: Number(e.target.value) }))}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="transit-field transit-field--year">
              <span className="transit-label">ปี (ค.ศ.)</span>
              <div className="transit-year-row">
                <input
                  type="text"
                  inputMode="numeric"
                  className="hora-input hora-input-3d transit-control-input transit-year-input"
                  placeholder="2026"
                  value={draft.year || ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
                    setDraft((d) => ({
                      ...d,
                      year: raw === '' ? 0 : Number(raw),
                    }))
                  }}
                />
                {buddhistYear ? (
                  <span className="transit-year-be">พ.ศ. {buddhistYear}</span>
                ) : null}
              </div>
            </label>

            <label className="transit-field transit-field--time">
              <span className="transit-label">เวลา</span>
              <input
                type="time"
                className="hora-input hora-input-3d hora-input-time transit-control-input"
                value={draft.time}
                step={60}
                onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))}
              />
            </label>
          </>
        ) : null}

        <button
          type="button"
          className="btn-primary btn-primary-3d transit-apply-btn"
          disabled={loading}
          onClick={() => onApply(draft)}
        >
          {loading ? 'กำลังอัปเดต…' : 'อัปเดตดวงจร'}
        </button>
      </div>
    </div>
  )
}
