import { useMemo, useState, type CSSProperties } from 'react'
import { CALC_OUTRO_MS, CALC_RITUAL_MIN_MS, sleep, type CalcNavState } from '../constants/calcTransition'
import { useEnterMotion } from '../hooks/useEnterMotion'
import { useNavigate } from 'react-router-dom'
import { CALCULATION_SETTINGS_LABELS } from '../data/calculationSettings'
import { useAstrology } from '../context/AstrologyContext'
import type { BirthFormErrors, BirthInput } from '../types/astrology'
import { daysInMonth } from '../utils/dateTimeUtils'
import { FormSection } from './FormSection'
import { InputField } from './InputField'
import { LocationSelect } from './LocationSelect'
import { FormAmbient } from './form/FormAmbient'
import { GlassCard } from './ui/GlassCard'
import { ScrollReveal } from './ui/ScrollReveal'

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

const CHECKLIST: { key: keyof BirthInput; label: string }[] = [
  { key: 'day', label: 'วันเกิด' },
  { key: 'month', label: 'เดือน' },
  { key: 'year', label: 'ปี' },
  { key: 'time', label: 'เวลา' },
  { key: 'country', label: 'ประเทศ' },
  { key: 'province', label: 'จังหวัด' },
  { key: 'district', label: 'อำเภอ' },
]

function clearFieldError(
  errors: BirthFormErrors,
  key: keyof BirthInput,
): BirthFormErrors {
  if (!errors[key]) return errors
  const next = { ...errors }
  delete next[key]
  return next
}

function isFieldFilled(input: BirthInput, key: keyof BirthInput): boolean {
  const v = input[key]
  if (typeof v === 'string') return v.trim().length > 0
  if (typeof v === 'number') return v > 0
  return Boolean(v)
}

export function BirthForm() {
  const { input, setInput, resetInput, calculate, calculating } = useAstrology()
  const navigate = useNavigate()
  const formMotionReady = useEnterMotion(80)
  const [errors, setErrors] = useState<BirthFormErrors>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [errorFlashKey, setErrorFlashKey] = useState(0)
  const [ritualHold, setRitualHold] = useState(false)
  const [calcOutro, setCalcOutro] = useState(false)

  const maxDay = useMemo(
    () => (input.month && input.year ? daysInMonth(input.month, input.year) : 31),
    [input.month, input.year],
  )

  const dayOptions = useMemo(
    () => Array.from({ length: maxDay }, (_, i) => i + 1),
    [maxDay],
  )

  const patchInput = (patch: Partial<BirthInput>) => {
    setInput(patch)
    if (submitAttempted) {
      setErrors((prev) => {
        let next = prev
        for (const key of Object.keys(patch) as (keyof BirthInput)[]) {
          next = clearFieldError(next, key)
        }
        return next
      })
    }
  }

  const handleCalculate = async () => {
    setSubmitAttempted(true)
    const started = performance.now()
    const { ok, errors: nextErrors } = await calculate()
    setErrors(nextErrors)

    if (!ok) {
      setErrorFlashKey((k) => k + 1)
      return
    }

    setRitualHold(true)
    const ritualRemain = Math.max(0, CALC_RITUAL_MIN_MS - (performance.now() - started))
    await sleep(ritualRemain)

    setCalcOutro(true)
    document.documentElement.classList.add('calc-transition-outro')
    await sleep(CALC_OUTRO_MS)

    document.documentElement.classList.remove('calc-transition-outro')
    setCalcOutro(false)
    setRitualHold(false)
    navigate('/result', { state: { fromCalc: true } satisfies CalcNavState })
  }

  const showCalcOverlay = calculating || ritualHold || calcOutro

  const handleReset = () => {
    resetInput()
    setErrors({})
    setSubmitAttempted(false)
  }

  const hasErrors = Object.keys(errors).length > 0
  const filledCount = CHECKLIST.filter(({ key }) => isFieldFilled(input, key)).length
  const progress = Math.round((filledCount / CHECKLIST.length) * 100)
  const allFilled = filledCount === CHECKLIST.length

  const buddhistYear =
    input.year >= 1900 ? input.year + 543 : null

  return (
    <div
      className={`birth-form-wrapper birth-form-wrapper--centered birth-form-wrapper--lux${formMotionReady ? ' is-motion-ready' : ''}${calcOutro ? ' birth-form-wrapper--outro' : ''}`}
    >
      <FormAmbient />
      <div className="birth-form-particles birth-form-particles--subtle" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="birth-form-particle" style={{ '--i': i } as CSSProperties} />
        ))}
      </div>

      <ScrollReveal variant="scale" delay={120} className="w-full max-w-4xl mx-auto">
      <GlassCard
        className="birth-form-card mx-auto w-full max-w-4xl"
        glow
        mystic
      >
        {showCalcOverlay && (
          <div
            className={`calc-ritual-overlay${calcOutro ? ' calc-ritual-overlay--outro' : ''}`}
            aria-live="polite"
          >
            <div className="calc-ritual-mandala" aria-hidden />
            <div className="calc-ritual-mandala calc-ritual-mandala--reverse" aria-hidden />
            <p className="calc-ritual-text">
              <span className="calc-ritual-icon" aria-hidden>
                ☽
              </span>
              กำลังอ่านดวงชะตา…
            </p>
            <div className="calc-ritual-stars" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ '--r-i': i } as CSSProperties} />
              ))}
            </div>
          </div>
        )}

        <div
          className={`birth-form-card-inner${showCalcOverlay ? ' birth-form-card-inner--dim' : ''}${calcOutro ? ' birth-form-card-inner--outro' : ''}`}
        >
          <header className="birth-form-header">
          <div className="birth-form-emblem" aria-hidden>
            <span className="birth-form-mandala" />
            <span className="birth-form-emblem-ring birth-form-emblem-ring--outer" />
            <span className="birth-form-emblem-ring birth-form-emblem-ring--mid" />
            <span className="birth-form-emblem-ring birth-form-emblem-ring--inner" />
            <span className="birth-form-emblem-core">☸</span>
            <span className="birth-form-emblem-pulse" />
          </div>

            <div className="min-w-0 flex-1">
              <p className="birth-form-eyebrow">
                <span className="birth-form-eyebrow-dot" aria-hidden />
                กรอกข้อมูลเพื่อคำนวณดวง
              </p>
              <h2 className="birth-form-title">ข้อมูลเกิด</h2>
              <p className="birth-form-subtitle">
                วันเวลา · สถานที่ — ระบบคำนวณคงที่ (สุริยยาตร์ · ลาหิรี)
              </p>

              <div
                className="birth-form-progress-wrap"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="ความครบถ้วนของฟอร์ม"
              >
                <div
                  className={`birth-form-progress-ring ${allFilled ? 'birth-form-progress-ring--complete' : ''}`}
                  style={{ '--progress': progress } as CSSProperties}
                >
                  <svg viewBox="0 0 56 56" className="birth-form-progress-svg" aria-hidden>
                    <circle className="birth-form-progress-bg" cx="28" cy="28" r="24" />
                    <circle className="birth-form-progress-arc" cx="28" cy="28" r="24" />
                  </svg>
                  <span className="birth-form-progress-percent">{progress}%</span>
                </div>
                <div className="birth-form-progress-meta">
                  <span className="birth-form-progress-label">
                    {allFilled ? '✦ พร้อมคำนวณดวง' : `กรอกแล้ว ${filledCount} จาก ${CHECKLIST.length} ช่อง`}
                  </span>
                  <div className="birth-form-progress-track">
                    <div
                      className={`birth-form-progress-fill ${allFilled ? 'birth-form-progress-fill--complete' : ''}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="birth-form-checklist-wrap">
                <p className="birth-form-checklist-title">ความครบถ้วน</p>
                <ul className="birth-form-checklist" aria-label="รายการที่ต้องกรอก">
                {CHECKLIST.map(({ key, label }) => {
                  const done = isFieldFilled(input, key)
                  const err = Boolean(errors[key])
                  return (
                    <li
                      key={key}
                      className={`birth-form-checklist-item ${done ? 'is-done' : ''} ${err ? 'is-error' : ''}`}
                    >
                      <span className="birth-form-checklist-mark" aria-hidden>
                        {err ? '!' : done ? '✓' : '○'}
                      </span>
                      {label}
                    </li>
                  )
                })}
                </ul>
              </div>
            </div>
          </header>

          <form
            className="birth-form-fields"
            onSubmit={(e) => {
              e.preventDefault()
              void handleCalculate()
            }}
            noValidate
          >
            <FormSection id="section-datetime" title="วันเวลาเกิด" icon="☽" step={1} delay={420}>
              <div className="datetime-panel">
                <div className="datetime-grid">
                  <InputField
                    id="day"
                    label="วัน"
                    required
                    filled={Boolean(input.day)}
                    error={errors.day}
                    errorFlashKey={errorFlashKey}
                    icon="①"
                    control="select"
                  >
                    <select
                      id="day"
                      className="hora-input hora-input-3d hora-select"
                      value={input.day || ''}
                      onChange={(e) => {
                        const day = Number(e.target.value)
                        patchInput({
                          day,
                          ...(day > maxDay ? { day: maxDay } : {}),
                        })
                      }}
                    >
                      <option value="">วัน</option>
                      {dayOptions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </InputField>

                  <InputField
                    id="month"
                    label="เดือน"
                    required
                    filled={Boolean(input.month)}
                    error={errors.month}
                    errorFlashKey={errorFlashKey}
                    icon="②"
                    control="select"
                  >
                    <select
                      id="month"
                      className="hora-input hora-input-3d hora-select"
                      value={input.month || ''}
                      onChange={(e) => {
                        const month = Number(e.target.value)
                        const max = input.year ? daysInMonth(month, input.year) : 31
                        patchInput({
                          month,
                          ...(input.day > max ? { day: max } : {}),
                        })
                      }}
                    >
                      <option value="">เดือน</option>
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </InputField>

                  <InputField
                    id="year"
                    label="ปี (ค.ศ.)"
                    required
                    filled={Boolean(input.year)}
                    error={errors.year}
                    errorFlashKey={errorFlashKey}
                    icon="③"
                    className="datetime-grid-year"
                    hint={
                      buddhistYear
                        ? `พ.ศ. ${buddhistYear}`
                        : 'พ.ศ. = ค.ศ. + 543'
                    }
                  >
                    <input
                      id="year"
                      type="number"
                      inputMode="numeric"
                      min={1900}
                      max={2100}
                      className="hora-input hora-input-3d"
                      placeholder="เช่น 1990"
                      value={input.year || ''}
                      onChange={(e) => {
                        const year = Number(e.target.value)
                        const max = input.month ? daysInMonth(input.month, year) : 31
                        patchInput({
                          year,
                          ...(input.day > max ? { day: max } : {}),
                        })
                      }}
                    />
                  </InputField>

                  <InputField
                    id="time"
                    label="เวลาเกิด"
                    required
                    filled={Boolean(input.time)}
                    error={errors.time}
                    errorFlashKey={errorFlashKey}
                    icon="🕐"
                    hint="รูปแบบ 24 ชม. HH:mm"
                    className="datetime-grid-time"
                    control="time"
                  >
                    <input
                      id="time"
                      type="time"
                      className="hora-input hora-input-3d hora-input-time"
                      value={input.time}
                      onChange={(e) => patchInput({ time: e.target.value })}
                      step={60}
                    />
                  </InputField>
                </div>
              </div>
            </FormSection>

            <FormSection id="section-location" title="สถานที่เกิด" icon="⌖" step={2} delay={540}>
              <LocationSelect
                country={input.country}
                province={input.province}
                district={input.district}
                errors={errors}
                errorFlashKey={errorFlashKey}
                onChange={(patch) => patchInput(patch)}
              />
            </FormSection>

            <div className="settings-capsules">
              <p className="settings-capsules-title">
                <span aria-hidden>⚙</span> ระบบคำนวณ (คงที่)
              </p>
              <ul className="settings-capsules-list">
                {CALCULATION_SETTINGS_LABELS.map(({ label }, i) => (
                  <li
                    key={label}
                    className="settings-capsule"
                    style={{ animationDelay: `${180 + i * 35}ms` }}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {submitAttempted && hasErrors && (
              <div className="form-alert form-alert--error" role="alert">
                <span className="form-alert-icon" aria-hidden>
                  ☽
                </span>
                <div>
                  <p className="form-alert-title">ยังกรอกไม่ครบ</p>
                  <p className="form-alert-desc">
                    กรุณาแก้ไขช่องที่มีเครื่องหมาย * และรายการที่ขึ้น ! ในด้านบน
                  </p>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={handleReset}
                className="btn-ghost btn-ghost-3d w-full sm:w-auto"
                disabled={calculating}
              >
                <span aria-hidden>↺</span> ล้างข้อมูล
              </button>
              <button
                type="submit"
                className={`btn-primary btn-primary-3d btn-primary-cosmic w-full sm:w-auto sm:min-w-[240px] ${calculating ? 'btn-primary-3d--loading' : ''} ${allFilled ? 'btn-primary--ready' : ''}`}
                disabled={calculating}
              >
                <span className="btn-primary-shine" aria-hidden />
                <span className="btn-primary-orbit" aria-hidden />
                <span className="btn-primary-text">
                  {calculating ? (
                    <>
                      <span className="btn-spinner" aria-hidden />
                      กำลังคำนวณดวง…
                    </>
                  ) : (
                    <>✦ คำนวณดวงชะตา</>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </GlassCard>
      </ScrollReveal>
    </div>
  )
}
