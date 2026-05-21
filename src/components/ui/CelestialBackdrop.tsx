import cosmicBg from '../../assets/cosmic-bg-16x9.png'

/** พื้นหลังดาราจักรทั้งแอป */
export function CelestialBackdrop() {
  return (
    <div className="celestial-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <img
        src={cosmicBg}
        alt=""
        className="celestial-backdrop__photo absolute inset-0 h-full w-full object-cover object-center"
        decoding="async"
      />
      <div className="cosmic-gradient absolute inset-0" />
      <div className="stars-layer celestial-backdrop__stars absolute inset-0" />
    </div>
  )
}
