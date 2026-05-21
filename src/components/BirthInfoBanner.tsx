interface BirthInfoBannerProps {
  subjectName?: string
  birth: string
  location: string
}

export function BirthInfoBanner({ subjectName, birth, location }: BirthInfoBannerProps) {
  return (
    <section className="result-hero-strip" aria-label="สรุปข้อมูลเกิด">
      <div className="result-hero-strip-glow" aria-hidden />
      {subjectName && (
        <div className="result-hero-strip-name">
          <span className="result-hero-strip-icon" aria-hidden>
            ✦
          </span>
          <div>
            <p className="result-hero-strip-label">เจ้าชะตา</p>
            <p className="result-hero-strip-value result-hero-strip-value--title">
              {subjectName}
            </p>
          </div>
        </div>
      )}
      <div className="result-hero-strip-grid">
        <div className="result-hero-strip-item">
          <span className="result-hero-strip-icon" aria-hidden>
            ☉
          </span>
          <div>
            <p className="result-hero-strip-label">วันเวลาเกิด</p>
            <p className="result-hero-strip-value">{birth}</p>
          </div>
        </div>
        <div className="result-hero-strip-item">
          <span className="result-hero-strip-icon" aria-hidden>
            ⌖
          </span>
          <div>
            <p className="result-hero-strip-label">สถานที่เกิด</p>
            <p className="result-hero-strip-value">{location}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
