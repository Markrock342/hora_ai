/** เอฟเฟกต์ลอยรอบหน้า (ผลดวง / สูตร / empty) */
export function PageAmbient({ variant = 'default' }: { variant?: 'default' | 'result' | 'admin' }) {
  const symbols = ['☉', '☽', '♃', '♄', '♀', '♂', '☿', '☊', '☋', '✦', '☸', '◈'] as const

  return (
    <div className={`page-ambient page-ambient--${variant}`} aria-hidden>
      <div className="page-ambient-aurora page-ambient-aurora--1" />
      <div className="page-ambient-aurora page-ambient-aurora--2" />
      <div className="page-ambient-aurora page-ambient-aurora--3" />
      <div className="page-ambient-ring" />
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={`p-${i}`}
          className="page-ambient-particle"
          style={{ '--p-i': i } as React.CSSProperties}
        />
      ))}
      {symbols.map((sym, i) => (
        <span
          key={`${sym}-${i}`}
          className="page-ambient-symbol"
          style={{ '--z-i': i } as React.CSSProperties}
        >
          {sym}
        </span>
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={`shoot-${i}`}
          className="page-ambient-shooting-star"
          style={{ '--s-i': i } as React.CSSProperties}
        />
      ))}
      <div className="page-ambient-vignette" />
    </div>
  )
}
