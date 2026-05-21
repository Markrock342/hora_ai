import { useCallback, useEffect, useRef, useState } from 'react'

const INTRO_KEY = 'hora-intro-seen'

/** ระยะ splash (ms) */
export const CINEMATIC_INTRO_MS = 3200

const INTRO_LEAVE_MS = 520

const STATUS_STEPS: { until: number; text: string }[] = [
  { until: 38, text: 'กำลังเตรียมระบบ' },
  { until: 72, text: 'โหลดดวงชะตา' },
  { until: 100, text: 'เกือบพร้อม' },
]

function statusForProgress(p: number): string {
  for (const step of STATUS_STEPS) {
    if (p < step.until) return step.text
  }
  return STATUS_STEPS[STATUS_STEPS.length - 1].text
}

function finishIntro(setActive: (v: boolean) => void, setLeaving: (v: boolean) => void) {
  try {
    sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    /* ignore */
  }
  setLeaving(false)
  setActive(false)
  document.documentElement.classList.remove('intro-active')
  document.documentElement.classList.add('intro-done')
}

/** Splash เปิดแอป — ครั้งแรกต่อ session */
export function useAppIntro(durationMs = CINEMATIC_INTRO_MS): {
  active: boolean
  leaving: boolean
  progress: number
  statusText: string
  skip: () => void
} {
  const [active, setActive] = useState(() => {
    try {
      return !sessionStorage.getItem(INTRO_KEY)
    } catch {
      return false
    }
  })
  const [leaving, setLeaving] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState(STATUS_STEPS[0].text)
  const rafRef = useRef(0)
  const startRef = useRef(0)
  const durationTimerRef = useRef(0)
  const leaveTimerRef = useRef(0)

  const startLeave = useCallback(() => {
    window.clearTimeout(durationTimerRef.current)
    window.clearTimeout(leaveTimerRef.current)
    cancelAnimationFrame(rafRef.current)
    setProgress(100)
    setLeaving(true)
    leaveTimerRef.current = window.setTimeout(() => {
      finishIntro(setActive, setLeaving)
    }, INTRO_LEAVE_MS)
  }, [])

  const skip = useCallback(() => {
    if (!active || leaving) return
    startLeave()
  }, [active, leaving, startLeave])

  useEffect(() => {
    const root = document.documentElement
    const onScreen = active || leaving
    root.classList.toggle('intro-active', onScreen)

    if (!onScreen) {
      root.classList.add('intro-done')
      return
    }

    if (leaving) return

    setProgress(0)
    setStatusText(STATUS_STEPS[0].text)
    startRef.current = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startRef.current
      const raw = Math.min(1, elapsed / durationMs)
      const eased = 1 - (1 - raw) ** 2.1
      const p = eased * 100
      setProgress(p)
      setStatusText(statusForProgress(p))
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    durationTimerRef.current = window.setTimeout(() => {
      cancelAnimationFrame(rafRef.current)
      startLeave()
    }, durationMs)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.clearTimeout(durationTimerRef.current)
    }
  }, [active, leaving, durationMs, startLeave])

  useEffect(() => {
    return () => {
      window.clearTimeout(leaveTimerRef.current)
    }
  }, [])

  return { active: active || leaving, leaving, progress, statusText, skip }
}
