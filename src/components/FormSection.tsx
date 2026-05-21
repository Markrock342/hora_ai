import type { ReactNode } from 'react'

interface FormSectionProps {
  id: string
  title: string
  icon: ReactNode
  step: number
  children: ReactNode
  delay?: number
}

export function FormSection({
  id,
  title,
  icon,
  step,
  children,
  delay = 0,
}: FormSectionProps) {
  return (
    <section
      className="form-section"
      style={{ animationDelay: `${delay}ms` }}
      aria-labelledby={id}
    >
      <div className="form-section-connector" aria-hidden>
        <span className="form-section-step">{step}</span>
      </div>

      <div className="form-section-panel">
        <div className="form-section-border-shine" aria-hidden />
        <div className="form-section-corner form-section-corner--tl" aria-hidden />
        <div className="form-section-corner form-section-corner--br" aria-hidden />
        <div className="form-section-shine" aria-hidden />
        <div className="form-section-aurora" aria-hidden />

        <header className="form-section-header">
          <span className="form-section-icon form-section-icon--mystic" aria-hidden>
            <span className="form-section-icon-glow" aria-hidden />
            {icon}
          </span>
          <div>
            <p className="form-section-kicker">ขั้นที่ {step}</p>
            <h3 id={id} className="form-section-title">
              {title}
            </h3>
          </div>
        </header>

        <div className="form-section-body">{children}</div>
      </div>
    </section>
  )
}
