import { useEffect } from 'react'

const PRESSABLE =
  '.btn-primary, .btn-ghost, .mystic-nav-link, .country-pill, .mystic-logo-emblem, .mystic-back-link, .hora-input, .hora-select'

function findPressable(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) return null
  const el = target.closest(PRESSABLE) as HTMLElement | null
  if (!el || (el as HTMLButtonElement).disabled) return null
  return el
}

/** Ripple + สถานะกด สำหรับปุ่ม/ลิงก์/อินพุต */
export function useClickEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onDown = (e: PointerEvent) => {
      const el = findPressable(e.target)
      if (!el) return

      el.classList.add('is-pressing')

      if (
        el.classList.contains('hora-input') ||
        el.classList.contains('hora-select') ||
        el.tagName === 'SELECT'
      ) {
        return
      }

      const rect = el.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2.2
      const ripple = document.createElement('span')
      ripple.className = 'click-ripple'
      ripple.setAttribute('aria-hidden', 'true')
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`

      const pos = getComputedStyle(el).position
      if (pos === 'static') el.style.position = 'relative'
      if (getComputedStyle(el).overflow === 'visible') el.style.overflow = 'hidden'

      el.appendChild(ripple)
      window.setTimeout(() => ripple.remove(), 700)
    }

    const clearPress = (e: PointerEvent) => {
      findPressable(e.target)?.classList.remove('is-pressing')
    }

    document.addEventListener('pointerdown', onDown)
    document.addEventListener('pointerup', clearPress)
    document.addEventListener('pointercancel', clearPress)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', clearPress)
      document.removeEventListener('pointercancel', clearPress)
    }
  }, [])
}
