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
  country: 'ไทย',
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

function migrateV2(raw: string): AstrologyResult | null {
  try {
    const parsed = JSON.parse(raw) as {
      input?: BirthInput
      planets?: PlanetSignRow[]
    }
    if (!parsed.input) return null
    return buildMockAstrologyResult(parsed.input)
  } catch {
    return null
  }
}

function loadStoredResult(): AstrologyResult | null {
  try {
    const v3 = sessionStorage.getItem(STORAGE_KEY)
    if (v3) {
      const parsed = JSON.parse(v3) as AstrologyResult
      if (isValidResult(parsed)) return parsed
    }
    const v2 = sessionStorage.getItem('newhora-astrology-v2')
    if (v2) return migrateV2(v2)
  } catch {
    /* ignore */
  }
  return null
}

export function AstrologyProvider({ children }: { children: ReactNode }) {
  const [input, setInputState] = useState<BirthInput>(emptyInput)
  const [result, setResult] = useState<AstrologyResult | null>(loadStoredResult)

  const setInput = useCallback((patch: Partial<BirthInput>) => {
    setInputState((prev) => ({ ...prev, ...patch }))
  }, [])

  const resetInput = useCallback(() => {
    setInputState(emptyInput)
  }, [])

  const clearResult = useCallback(() => {
    setResult(null)
    sessionStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem('newhora-astrology-v2')
  }, [])

  const calculate = useCallback(() => {
    const errors = validateBirthInput(input)
    if (hasValidationErrors(errors)) {
      return { ok: false, errors }
    }
    const next = calculateAstrology(input)
    setResult(next)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
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
