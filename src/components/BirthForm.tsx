import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { CALCULATION_SETTINGS_LABELS } from '../data/calculationSettings'
import { useAstrology } from '../context/AstrologyContext'
import type { BirthFormErrors } from '../types/astrology'
import { GlassCard } from './ui/GlassCard'

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

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)
const COUNTRIES = ['ไทย', 'ลาว', 'กัมพูชา', 'พม่า', 'อื่นๆ']

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-hora-accent">{message}</p>
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium tracking-wide text-hora-gold-dim uppercase">
      {children}
    </label>
  )
}

export function BirthForm() {
  const { input, setInput, resetInput, calculate } = useAstrology()
  const navigate = useNavigate()
  const [errors, setErrors] = useState<BirthFormErrors>({})

  const handleCalculate = () => {
    const { ok, errors: nextErrors } = calculate()
    setErrors(nextErrors)
    if (ok) navigate('/result')
  }

  return (
    <GlassCard>
      <header className="mb-8 flex items-start gap-4 border-b border-hora-gold/15 pb-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-hora-gold/30 bg-hora-gold/10 text-2xl text-hora-gold-light">
          ☽
        </span>
        <div>
          <h2 className="font-display text-2xl font-medium text-gradient-gold">ข้อมูลเกิด</h2>
          <p className="mt-1 text-sm text-hora-muted">
            วัน · เดือน · ปี · เวลา · สถานที่เกิด
          </p>
        </div>
      </header>

      <form
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault()
          handleCalculate()
        }}
      >
        <div>
          <FieldLabel htmlFor="day">วัน</FieldLabel>
          <select
            id="day"
            className="hora-input"
            value={input.day || ''}
            onChange={(e) => setInput({ day: Number(e.target.value) })}
          >
            <option value="">เลือกวัน</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <FieldError message={errors.day} />
        </div>

        <div>
          <FieldLabel htmlFor="month">เดือน</FieldLabel>
          <select
            id="month"
            className="hora-input"
            value={input.month || ''}
            onChange={(e) => setInput({ month: Number(e.target.value) })}
          >
            <option value="">เลือกเดือน</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.month} />
        </div>

        <div>
          <FieldLabel htmlFor="year">ปี (ค.ศ.)</FieldLabel>
          <input
            id="year"
            type="number"
            min={1900}
            max={2100}
            className="hora-input"
            placeholder="เช่น 1990"
            value={input.year || ''}
            onChange={(e) => setInput({ year: Number(e.target.value) })}
          />
          <FieldError message={errors.year} />
        </div>

        <div>
          <FieldLabel htmlFor="time">เวลา (HH:mm)</FieldLabel>
          <input
            id="time"
            type="time"
            className="hora-input"
            value={input.time}
            onChange={(e) => setInput({ time: e.target.value })}
          />
          <FieldError message={errors.time} />
        </div>

        <div>
          <FieldLabel htmlFor="country">ประเทศ</FieldLabel>
          <select
            id="country"
            className="hora-input"
            value={input.country}
            onChange={(e) => setInput({ country: e.target.value })}
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <FieldError message={errors.country} />
        </div>

        <div>
          <FieldLabel htmlFor="province">จังหวัด / รัฐ</FieldLabel>
          <input
            id="province"
            type="text"
            className="hora-input"
            placeholder="เช่น กรุงเทพมหานคร"
            value={input.province}
            onChange={(e) => setInput({ province: e.target.value })}
          />
          <FieldError message={errors.province} />
        </div>

        <div>
          <FieldLabel htmlFor="district">อำเภอ / เมือง</FieldLabel>
          <input
            id="district"
            type="text"
            className="hora-input"
            placeholder="เช่น เมือง"
            value={input.district}
            onChange={(e) => setInput({ district: e.target.value })}
          />
          <FieldError message={errors.district} />
        </div>

        <div className="rounded-xl border border-hora-gold/10 bg-hora-bg/40 p-4 md:col-span-2 lg:col-span-3">
          <p className="text-xs font-medium tracking-wide text-hora-gold uppercase">
            ระบบคำนวณ (คงที่)
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {CALCULATION_SETTINGS_LABELS.map(({ label }) => (
              <li
                key={label}
                className="rounded-full border border-hora-gold/20 bg-hora-panel-light/50 px-3 py-1 text-xs text-hora-muted"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3 md:col-span-2 lg:col-span-3 lg:justify-end">
          <button type="button" onClick={() => { resetInput(); setErrors({}) }} className="btn-ghost">
            ล้างข้อมูล
          </button>
          <button type="submit" className="btn-primary">
            ✦ คำนวณดวง
          </button>
        </div>
      </form>
    </GlassCard>
  )
}
