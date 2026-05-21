import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { buildMockAstrologyResult } from '../data/mockAstrologyResult'
import type { AstrologyResult, BirthInput, PlanetSignRow } from '../types/astrology'
import { TABLE_ROW_COUNT } from '../types/astrology'
import { calculateAstrology } from '../utils/astrologyCalculator'
import {
  formatBirthDisplay,
  formatLocationDisplay,
  formatSubjectName,
  hasValidationErrors,
  validateBirthInput,
} from '../utils/dateTimeUtils'

const STORAGE_KEY = 'newhora-astrology-v3'

const emptyInput: BirthInput = {
  name: '',
  day: 0,
  month: 0,
  year: 0,
  time: '',
  province: '',
  district: '',
}

interface AstrologyContextValue {
  input: BirthInput
  result: AstrologyResult | null
  setInput: (patch: Partial<BirthInput>) => void
  resetInput: () => void
  calculate: () => { ok: boolean; errors: ReturnType<typeof validateBirthInput> }
  clearResult: () => void
}

const AstrologyContext = createContext<AstrologyContextValue | null>(null)

function isValidResult(parsed: AstrologyResult): boolean {
  return (
    Boolean(parsed?.tables?.planets?.length === TABLE_ROW_COUNT) &&
    Boolean(parsed?.planets?.length)
  )
}

/** ข้อมูลเก่าใน session อาจมี country — ตัดออกแล้วเติมค่าเริ่มต้น */
export function normalizeBirthInput(
  raw: Partial<BirthInput> & { country?: string },
): BirthInput {
  return {
    name: String(raw.name ?? ''),
    day: Number(raw.day) || 0,
    month: Number(raw.month) || 0,
    year: Number(raw.year) || 0,
    time: String(raw.time ?? ''),
    province: String(raw.province ?? ''),
    district: String(raw.district ?? ''),
  }
}

/** คำนวณ meta ใหม่จาก input ปัจจุบัน (แก้ข้อความสถานที่ค้างจากรอบก่อน) */
export function refreshResultMeta(result: AstrologyResult): AstrologyResult {
  const input = normalizeBirthInput(result.input)
  return {
    ...result,
    input,
    meta: {
      subjectName: formatSubjectName(input),
      birthDisplay: formatBirthDisplay(input),
      locationDisplay: formatLocationDisplay(input),
    },
  }
}

function persistResult(result: AstrologyResult) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result))
}

function clearStoredResults() {
  sessionStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem('newhora-astrology-v2')
}

function migrateV2(raw: string): AstrologyResult | null {
  try {
    const parsed = JSON.parse(raw) as {
      input?: Partial<BirthInput> & { country?: string }
      planets?: PlanetSignRow[]
    }
    if (!parsed.input) return null
    return buildMockAstrologyResult(normalizeBirthInput(parsed.input))
  } catch {
    return null
  }
}

function loadStoredResult(): AstrologyResult | null {
  try {
    const v3 = sessionStorage.getItem(STORAGE_KEY)
    if (v3) {
      const parsed = JSON.parse(v3) as AstrologyResult
      if (isValidResult(parsed)) return refreshResultMeta(parsed)
    }
    const v2 = sessionStorage.getItem('newhora-astrology-v2')
    if (v2) {
      const migrated = migrateV2(v2)
      return migrated ? refreshResultMeta(migrated) : null
    }
  } catch {
    /* ignore */
  }
  return null
}

function getInitialState(): { input: BirthInput; result: AstrologyResult | null } {
  const loaded = loadStoredResult()
  if (!loaded) return { input: emptyInput, result: null }
  persistResult(loaded)
  return { input: loaded.input, result: loaded }
}

export function AstrologyProvider({ children }: { children: ReactNode }) {
  const [{ input, result }, setAppState] = useState(getInitialState)

  const setInput = useCallback((patch: Partial<BirthInput>) => {
    setAppState((s) => ({ ...s, input: { ...s.input, ...patch } }))
  }, [])

  const clearResult = useCallback(() => {
    setAppState((s) => ({ ...s, result: null }))
    clearStoredResults()
  }, [])

  const resetInput = useCallback(() => {
    setAppState({ input: emptyInput, result: null })
    clearStoredResults()
  }, [])

  const calculate = useCallback(() => {
    const errors = validateBirthInput(input)
    if (hasValidationErrors(errors)) {
      return { ok: false, errors }
    }
    const next = refreshResultMeta(calculateAstrology(input))
    setAppState((s) => ({ ...s, result: next }))
    persistResult(next)
    return { ok: true, errors: {} }
  }, [input])

  const value = useMemo(
    () => ({
      input,
      result,
      setInput,
      resetInput,
      calculate,
      clearResult,
    }),
    [input, result, setInput, resetInput, calculate, clearResult],
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
