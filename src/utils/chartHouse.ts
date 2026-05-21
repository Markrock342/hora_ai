import { SIGNS } from '../data/astrologyConstants'

export function signIndex(sign: string): number {
  const i = SIGNS.indexOf(sign as (typeof SIGNS)[number])
  return i >= 0 ? i : 0
}

/** เรือน Whole Sign จากลัคนา (1–12) */
export function houseFromLagna(lagnaSign: string, planetSign: string): number {
  const lagnaIdx = signIndex(lagnaSign)
  const planetIdx = signIndex(planetSign)
  return ((planetIdx - lagnaIdx + 12) % 12) + 1
}
