interface CinematicIntroProps {
  active: boolean
  leaving?: boolean
  progress: number
  statusText: string
  onSkip?: () => void
}

/** Splash เปิดแอป — โหลดนุ่ม ไม่กระตุก (ครั้งแรกต่อ session) */
export function CinematicIntro({
  active,
  leaving = false,
  progress,
  statusText,
  onSkip,
}: CinematicIntroProps) {
  if (!active) return null

  const pct = Math.min(100, Math.max(0, progress))

  return (
    <div
      className={`cine-intro${leaving ? ' cine-intro--leaving' : ''}`}
      role="dialog"
      aria-label="กำลังเปิด NewHora"
      aria-modal="true"
      aria-busy={!leaving}
      onClick={() => onSkip?.()}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onSkip?.()
      }}
    >
      <button
        type="button"
        className="cine-intro__skip"
        onClick={(e) => {
          e.stopPropagation()
          onSkip?.()
        }}
      >
        ข้าม
      </button>

      <div className="cine-intro__backdrop" aria-hidden />
      <div className="cine-intro__vignette" aria-hidden />
      <div className="cine-intro__glow" aria-hidden />

      <span className="cine-intro__corner cine-intro__corner--tl" aria-hidden />
      <span className="cine-intro__corner cine-intro__corner--tr" aria-hidden />
      <span className="cine-intro__corner cine-intro__corner--bl" aria-hidden />
      <span className="cine-intro__corner cine-intro__corner--br" aria-hidden />

      <div className="cine-intro__panel">
        <div className="cine-intro__mark" aria-hidden>
          <span className="cine-intro__mark-spinner" />
          <span className="cine-intro__mark-ring" />
          <span className="cine-intro__mark-icon">☸</span>
        </div>

        <p className="cine-intro__kicker">โหราศาสตร์ไทย</p>
        <h2 className="cine-intro__brand">NewHora</h2>
        <p className="cine-intro__ornament" aria-hidden>
          <span />
          <span>✦</span>
          <span />
        </p>
        <p className="cine-intro__tagline">สถิตราศี · ลาหิรี · สุริยยาตร์</p>

        <div className="cine-intro__progress-wrap">
          <div
            className="cine-intro__progress"
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="ความคืบหน้าการโหลด"
          >
            <span className="cine-intro__progress-track" aria-hidden />
            <span
              className="cine-intro__progress-fill"
              style={{ width: `${pct}%` }}
            />
            <span
              className="cine-intro__progress-head"
              style={{ left: `${pct}%` }}
            />
          </div>
          <div className="cine-intro__status-row">
            <p className="cine-intro__status">
              <span className="cine-intro__status-text" key={statusText}>
                {statusText}
              </span>
              <span className="cine-intro__status-dots" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </p>
            <p className="cine-intro__percent">{Math.round(pct)}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
