/** พื้นหลังดาราจักรทั้งแอป */
export function CelestialBackdrop() {
  return (
    <div className="celestial-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="cosmic-gradient absolute inset-0" />
      <div className="celestial-nebula celestial-nebula--1" />
      <div className="celestial-nebula celestial-nebula--2" />
      <div className="celestial-nebula celestial-nebula--3" />
      <div className="stars-layer absolute inset-0" />
      <div className="stars-layer stars-layer--fast absolute inset-0" />
      <div className="stars-layer stars-layer--deep absolute inset-0" />
      {Array.from({ length: 6 }, (_, i) => (
        <span
          key={i}
          className="celestial-shooting-star"
          style={{ '--cs-i': i } as React.CSSProperties}
        />
      ))}
      <div className="moon-glow absolute -right-24 top-20 h-64 w-64 rounded-full md:-right-16 md:top-12 md:h-80 md:w-80" />
      <div className="moon-glow-pulse absolute -right-24 top-20 h-64 w-64 rounded-full md:-right-16 md:top-12 md:h-80 md:w-80" />
      <div className="orbit-ring absolute left-1/2 top-1/3 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 opacity-[0.07]" />
      <div className="orbit-ring orbit-ring--reverse absolute left-1/2 top-[38%] h-[min(70vw,400px)] w-[min(70vw,400px)] -translate-x-1/2 opacity-[0.05]" />
      <div className="celestial-sacred-geometry" />
    </div>
  )
}
