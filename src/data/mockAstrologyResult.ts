/**
 * Mock ผลลัพธ์ — ตารางเดียว ดาว | สถิตราศี (10 ดาว)
 * แทนที่ด้วย buildRealAstrologyResult เมื่อสูตรพร้อม
 */

import type { AstrologyResult, BirthInput, PlanetSignRow } from '../types/astrology'
import { CALCULATION_SETTINGS } from './calculationSettings'
import { MOCK_SIGN_OFFSET_BASE, PLANETS, SIGNS } from './astrologyConstants'
import {
  birthDataSeed,
  formatBirthDisplay,
  formatLocationDisplay,
} from '../utils/dateTimeUtils'

const AQUARIUS = 'กุมภ'

function pick<T>(arr: readonly T[], index: number): T {
  return arr[((index % arr.length) + arr.length) % arr.length] as T
}

function isNightBirth(time: string): boolean {
  const [h] = time.split(':').map(Number)
  return h < 6 || h >= 18
}

function applyRahuEightSignsAquarius(seed: number): string {
  const aquariusIndex = SIGNS.indexOf(AQUARIUS)
  if (aquariusIndex < 0) return AQUARIUS
  return pick(SIGNS, aquariusIndex - (seed % 8))
}

function siderealSignForPlanet(
  planet: (typeof PLANETS)[number],
  seed: number,
  input: BirthInput,
): string {
  if (planet === 'ราหู' && CALCULATION_SETTINGS.rahuRule === 'eight_signs_aquarius') {
    if (CALCULATION_SETTINGS.taksaRahuLord === 'mercury_night') {
      void (isNightBirth(input.time) ? 'พุธกลางคืน' : 'พุธกลางวัน')
    }
    return applyRahuEightSignsAquarius(seed)
  }
  const planetIndex = PLANETS.indexOf(planet)
  const signOffset = MOCK_SIGN_OFFSET_BASE + (seed % 12)
  const base = (signOffset + planetIndex * 3 + Math.floor(seed / 7)) % 12
  return pick(SIGNS, base)
}

function buildPlanetRows(input: BirthInput): PlanetSignRow[] {
  const seed = birthDataSeed(input)
  return PLANETS.map((planet) => ({
    planet,
    siderealSign: siderealSignForPlanet(planet, seed, input),
  }))
}

export function buildMockAstrologyResult(input: BirthInput): AstrologyResult {
  return {
    input,
    calculatedAt: new Date().toISOString(),
    settings: { ...CALCULATION_SETTINGS },
    meta: {
      birthDisplay: formatBirthDisplay(input),
      locationDisplay: formatLocationDisplay(input),
    },
    planets: buildPlanetRows(input),
  }
}
