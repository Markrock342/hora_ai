import { useEffect, useRef, useState } from 'react'

export type ScrollRevealVariant = 'up' | 'left' | 'right' | 'scale' | 'fade'

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number
  rootMargin?: string
  once?: boolean
}) {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(false)
  const once = options?.once ?? true

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setRevealed(false)
        }
      },
      {
        threshold: options?.threshold ?? 0.12,
        rootMargin: options?.rootMargin ?? '0px 0px -6% 0px',
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options?.threshold, options?.rootMargin, once])

  return { ref, revealed }
}

export function scrollRevealClass(
  revealed: boolean,
  variant: ScrollRevealVariant = 'up',
  extra = '',
): string {
  return [
    'scroll-reveal',
    `scroll-reveal--${variant}`,
    revealed ? 'is-revealed' : '',
    extra,
  ]
    .filter(Boolean)
    .join(' ')
}
