/** พื้นหลังดาว/จันทร์ — ตกแต่งเท่านั้น */
export function CelestialBackdrop() {
  return (
    <div className="celestial-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="cosmic-gradient absolute inset-0" />
      <div className="stars-layer absolute inset-0" />
      <div className="moon-glow absolute -right-24 top-20 h-64 w-64 rounded-full md:-right-16 md:top-12 md:h-80 md:w-80" />
      <div className="orbit-ring absolute left-1/2 top-1/3 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 opacity-[0.07]" />
    </div>
  )
}
