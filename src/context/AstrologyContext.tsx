import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AstrologyResult, BirthInput } from '../types/astrology'
import { calculateAstrology } from '../utils/astrologyCalculator'
import {
  hasValidationErrors,
  validateBirthInput,
} from '../utils/dateTimeUtils'

const STORAGE_KEY = 'newhora-astrology-v2'

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
  calculate: () => { ok: boolean; errors: ReturnType<typeof validateBirthInput> }
  clearResult: () => void
}

const AstrologyContext = createContext<AstrologyContextValue | null>(null)

function loadStoredResult(): AstrologyResult | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AstrologyResult
    if (!parsed?.planets?.length) return null
    return parsed
  } catch {
    return null
  }
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
