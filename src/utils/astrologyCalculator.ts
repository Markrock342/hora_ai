import { CALCULATION_SETTINGS } from '../data/calculationSettings'
import { MOCK_SIGN_OFFSET_BASE, PLANETS, SIGNS } from '../data/astrologyConstants'
import type { AstrologyResult, BirthInput, PlanetSignRow } from '../types/astrology'
import {
  birthDataSeed,
  formatBirthDisplay,
  formatLocationDisplay,
} from './dateTimeUtils'

const AQUARIUS = 'กุมภ'

/**
 * [สูตรจริง] แทนที่ calculateSiderealSigns()
 * - สุริยยาตร์ + ลาหิรี → สถิตราศี
 * - อันโตนาทีสามัญ สมผุสอาทิตย์อุทัย + เวลาท้องถิ่น
 * - ราหู ๘ ราศีกุมภ์
 * - ทักษา (ราหู=พุธกลางคืน, นับตากลาง) ใช้ภายใน ไม่แสดงในตาราง
 */
export function calculateAstrology(input: BirthInput): AstrologyResult {
  const seed = birthDataSeed(input)

  return {
    input,
    calculatedAt: new Date().toISOString(),
    settings: { ...CALCULATION_SETTINGS },
    meta: {
      birthDisplay: formatBirthDisplay(input),
      locationDisplay: formatLocationDisplay(input),
    },
    planets: calculateSiderealSigns(input, seed),
  }
}

function pick<T>(arr: readonly T[], index: number): T {
  return arr[((index % arr.length) + arr.length) % arr.length] as T
}

function calculateSiderealSigns(input: BirthInput, seed: number): PlanetSignRow[] {
  const signOffset = MOCK_SIGN_OFFSET_BASE + (seed % 12)
  const isNight = isNightBirth(input.time)

  return PLANETS.map((planet, i) => {
    let siderealSign: string

    if (planet === 'ราหู' && CALCULATION_SETTINGS.rahuRule === 'eight_signs_aquarius') {
      // mock: ราหู ๘ ราศีกุมภ์ — แทนที่ด้วยสูตรราหูจริง
      siderealSign = applyRahuEightSignsAquarius(seed)
    } else {
      const signIndex = (signOffset + i * 3 + Math.floor(seed / 7)) % 12
      siderealSign = pick(SIGNS, signIndex)
    }

    // ทักษาราหู=พุธกลางคืน — ใช้ตอนคำนวณทักษาจริง (ไม่แสดงในตาราง)
    if (planet === 'ราหู' && CALCULATION_SETTINGS.taksaRahuLord === 'mercury_night') {
      void (isNight ? 'พุธกลางคืน' : 'พุธกลางวัน')
    }

    return { planet, siderealSign }
  })
}

/** mock ราหู ๘ ราศีกุมภ์ */
function applyRahuEightSignsAquarius(seed: number): string {
  const offset = seed % 8
  const aquariusIndex = SIGNS.indexOf(AQUARIUS)
  if (aquariusIndex < 0) return AQUARIUS
  return pick(SIGNS, aquariusIndex - offset)
}

function isNightBirth(time: string): boolean {
  const [h] = time.split(':').map(Number)
  return h < 6 || h >= 18
}
