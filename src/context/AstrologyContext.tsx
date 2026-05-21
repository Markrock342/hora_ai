import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { buildMockAstrologyResult } from '../data/mockAstrologyResult'
import { PLANETS } from '../data/astrologyConstants'
import type { AstrologyResult, BirthInput } from '../types/astrology'
import { calculateAstrologyAsync } from '../utils/astrologyCalculator'
import {
  formatBirthDisplay,
  formatLocationDisplay,
  hasValidationErrors,
  validateBirthInput,
} from '../utils/dateTimeUtils'

const STORAGE_KEY = 'newhora-astrology-v4'

const emptyInput: BirthInput = {
  day: 0,
  month: 0,
  year: 0,
  time: '',
  country: 'ไทย',
  province: '',
  district: '',
}

interface AstrologyContextValue {
  input: BirthInput
  result: AstrologyResult | null
  setInput: (patch: Partial<BirthInput>) => void
  resetInput: () => void
  calculate: () => Promise<{ ok: boolean; errors: ReturnType<typeof validateBirthInput> }>
  calculating: boolean
  clearResult: () => void
}

const AstrologyContext = createContext<AstrologyContextValue | null>(null)

function isValidResult(parsed: AstrologyResult): boolean {
  return (
    Array.isArray(parsed?.planets) &&
    parsed.planets.length === PLANETS.length &&
    parsed.meta?.birthDisplay != null
  )
}

/** ข้อมูลเก่าใน session อาจมี name / ไม่มี country — ตัดออก */
export function normalizeBirthInput(
  raw: Partial<BirthInput> & { name?: string; firstName?: string; lastName?: string },
): BirthInput {
  const { name: _n, firstName: _fn, lastName: _ln, ...rest } = raw
  return {
    day: Number(rest.day) || 0,
    month: Number(rest.month) || 0,
    year: Number(rest.year) || 0,
    time: String(rest.time ?? ''),
    country: String(rest.country ?? 'ไทย'),
    province: String(rest.province ?? ''),
    district: String(rest.district ?? ''),
  }
}

/** คำนวณ meta ใหม่จาก input (แก้ข้อความสถานที่ค้างจากรอบก่อน) */
export function refreshResultMeta(result: AstrologyResult): AstrologyResult {
  const input = normalizeBirthInput(result.input)
  return {
    ...result,
    input,
    meta: {
      ...result.meta,
      birthDisplay: formatBirthDisplay(input),
      locationDisplay: formatLocationDisplay(input),
    },
  }
}

function migrateLegacy(raw: string): AstrologyResult | null {
  try {
    const parsed = JSON.parse(raw) as { input?: Partial<BirthInput> & { name?: string } }
    if (!parsed.input) return null
    return buildMockAstrologyResult(normalizeBirthInput(parsed.input))
  } catch {
    return null
  }
}

function loadStoredResult(): AstrologyResult | null {
  try {
    const v4 = sessionStorage.getItem(STORAGE_KEY)
    if (v4) {
      const parsed = JSON.parse(v4) as AstrologyResult
      if (isValidResult(parsed)) return refreshResultMeta(parsed)
    }
    for (const key of ['newhora-astrology-v3', 'newhora-astrology-v2']) {
      const legacy = sessionStorage.getItem(key)
      if (legacy) {
        const migrated = migrateLegacy(legacy)
        if (migrated) return refreshResultMeta(migrated)
      }
    }
  } catch {
    /* ignore */
  }
  return null
}

export function AstrologyProvider({ children }: { children: ReactNode }) {
  const [input, setInputState] = useState<BirthInput>(emptyInput)
  const [result, setResult] = useState<AstrologyResult | null>(loadStoredResult)
  const [calculating, setCalculating] = useState(false)

  const setInput = useCallback((patch: Partial<BirthInput>) => {
    setInputState((prev) => ({ ...prev, ...patch }))
  }, [])

  const resetInput = useCallback(() => {
    setInputState(emptyInput)
  }, [])

  const clearResult = useCallback(() => {
    setResult(null)
    sessionStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem('newhora-astrology-v3')
    sessionStorage.removeItem('newhora-astrology-v2')
  }, [])

  const calculate = useCallback(async () => {
    const errors = validateBirthInput(input)
    if (hasValidationErrors(errors)) {
      return { ok: false, errors }
    }
    setCalculating(true)
    try {
      const next = await calculateAstrologyAsync(input)
      setResult(next)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return { ok: true, errors: {} }
    } finally {
      setCalculating(false)
    }
  }, [input])

  const value = useMemo(
    () => ({
      input,
      result,
      setInput,
      resetInput,
      calculate,
      calculating,
      clearResult,
    }),
    [input, result, setInput, resetInput, calculate, calculating, clearResult],
  )

  return (
    <AstrologyContext.Provider value={value}>{children}</AstrologyContext.Provider>
  )
}

export function useAstrology() {
  const ctx = useContext(AstrologyContext)
  if (!ctx) throw new Error('useAstrology must be used within AstrologyProvider')
  return ctx
}
