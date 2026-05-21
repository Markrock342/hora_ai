import type { CSSProperties } from 'react'

const ZODIAC = ['☽', '☉', '☿', '♀', '♂', '♃', '♄', '♅', '♆', '☸', '✦', '✧'] as const

/** พื้นหลังมิติจักรราศี — ตกแต่งอย่างเดียว */
export function FormAmbient() {
  return (
    <div className="form-ambient" aria-hidden>
      <div className="form-ambient-fog" />
      <div className="form-ambient-aurora form-ambient-aurora--1" />
      <div className="form-ambient-aurora form-ambient-aurora--2" />
      <div className="form-ambient-aurora form-ambient-aurora--3" />
      <div className="form-ambient-aurora form-ambient-aurora--4" />

      <div className="form-ambient-mandala" />

      <svg className="form-ambient-constellation" viewBox="0 0 400 200" preserveAspectRatio="none">
        {[
          [40, 30],
          [120, 80],
          [200, 40],
          [280, 100],
          [360, 50],
          [80, 150],
          [300, 160],
        ].map(([cx, cy], i) => (
          <circle key={i} className="constellation-star" cx={cx} cy={cy} r={i % 2 ? 2 : 1.5} />
        ))}
        <path
          className="constellation-line"
          d="M40 30 L120 80 L200 40 L280 100 L360 50 M120 80 L80 150 L300 160 L280 100"
          fill="none"
        />
      </svg>

      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={`shoot-${i}`}
          className="form-shooting-star"
          style={{ '--shoot-i': i } as CSSProperties}
        />
      ))}

      {ZODIAC.map((sym, i) => (
        <span
          key={`${sym}-${i}`}
          className="form-zodiac-float"
          style={{ '--z-i': i } as CSSProperties}
        >
          {sym}
        </span>
      ))}

      {Array.from({ length: 8 }, (_, i) => (
        <span
          key={`spark-${i}`}
          className="form-mystic-spark"
          style={{ '--s-i': i } as CSSProperties}
        />
      ))}
    </div>
  )
}
