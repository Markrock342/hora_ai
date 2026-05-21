import type { ReactNode } from 'react'
import { useErrorFlash } from '../hooks/useErrorFlash'

/** select/time = ซ่อนไอคอนเบราว์เซอร์ ใช้ลูกศร/นาฬิกา custom แทน */
export type InputControlKind = 'default' | 'select' | 'time'

interface InputFieldProps {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  filled?: boolean
  icon?: ReactNode
  className?: string
  /** ชนิด control — ป้องกันไอคอนทับกัน */
  control?: InputControlKind
  /** เพิ่มเมื่อ submit ล้มเหลว — กระตุ้น shake ซ้ำ */
  errorFlashKey?: number
  children: ReactNode
}

export function InputField({
  id,
  label,
  error,
  hint,
  required,
  filled = false,
  icon,
  className = '',
  control = 'default',
  errorFlashKey = 0,
  children,
}: InputFieldProps) {
  const errorFlash = useErrorFlash(Boolean(error), errorFlashKey)
  const errorId = error ? `${id}-error` : undefined
  const hintId = hint && !error ? `${id}-hint` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  const stateClass = error
    ? 'input-field-group--error'
    : filled
      ? 'input-field-group--filled'
      : ''

  return (
    <div
      className={`input-field-group ${stateClass}${errorFlash ? ' input-field-group--error-flash' : ''} ${className}`}
    >
      <label htmlFor={id} className="input-field-label">
        {icon && control === 'default' && (
          <span className="input-field-label-icon" aria-hidden>
            {icon}
          </span>
        )}
        <span className="input-field-label-text">{label}</span>
        {required && (
          <span className="input-field-required" aria-hidden>
            *
          </span>
        )}
        {filled && !error && (
          <span className="input-field-check" aria-hidden title="กรอกแล้ว">
            ✓
          </span>
        )}
      </label>

      <div
        className={`input-field-shell${control !== 'default' ? ` input-field-shell--${control}` : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      >
        <div className="input-field-border-glow" aria-hidden />
        {control === 'default' && <div className="input-field-mystic-spark" aria-hidden />}
        <div className="input-field-glow" aria-hidden />
        <div className="input-field-inner">
          {control === 'select' || control === 'time' ? (
            <div className={`hora-picker-wrap hora-picker-wrap--${control}`}>
              {children}
              <span className="hora-picker-decor" aria-hidden>
                {control === 'time' ? (
                  <svg
                    className="hora-picker-decor-svg"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg
                    className="hora-picker-decor-svg hora-picker-decor-svg--chevron"
                    viewBox="0 0 12 12"
                    width="12"
                    height="12"
                    fill="currentColor"
                  >
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                )}
              </span>
            </div>
          ) : (
            children
          )}
        </div>
      </div>

      {hint && !error && (
        <p id={hintId} className="input-field-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="input-field-error" role="alert">
          <span className="input-field-error-icon" aria-hidden>
            ✦
          </span>
          {error}
        </p>
      )}
    </div>
  )
}
