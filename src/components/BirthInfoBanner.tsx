interface BirthInfoBannerProps {
  birth: string
  location: string
}

export function BirthInfoBanner({ birth, location }: BirthInfoBannerProps) {
  return (
    <div className="result-hero-strip">
      <div className="result-hero-strip-block">
        <p className="result-hero-strip-label">วันเวลาเกิด</p>
        <p className="result-hero-strip-value">{birth}</p>
      </div>
      <div className="result-hero-strip-block">
        <p className="result-hero-strip-label">สถานที่เกิด</p>
        <p className="result-hero-strip-value">{location}</p>
      </div>
    </div>
  )
}
