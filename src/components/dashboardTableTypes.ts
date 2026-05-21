/**
 * โครงสร้าง 3 ตาราง × 25 แถว — สำหรับ ResultDashboard
 */
import type { AstrologyResult } from '../types/astrology'
import { CALCULATION_SETTINGS } from '../data/calculationSettings'
import { MOCK_SIGN_OFFSET_BASE, PLANETS, SIGNS } from '../data/astrologyConstants'
import { birthDataSeed } from '../utils/dateTimeUtils'

export const TABLE_ROW_COUNT = 25

export interface PlanetTableRow {
  rowNo: number
  label: string
  siderealSign: string
  house: string
  degree: string
}

export interface TaksaTableRow {
  rowNo: number
  taksa: string
  lord: string
  sign: string
  count: string
}

export interface HouseTableRow {
  rowNo: number
  bhava: string
  sign: string
  planetsIn: string
}

export interface DashboardTables {
  planets: PlanetTableRow[]
  taksa: TaksaTableRow[]
  houses: HouseTableRow[]
}

const PLANET_TABLE_LABELS = [
  'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'ราหู', 'เกตุ', 'มฤตยู',
  'ลัคนา', 'นวโลห', 'สุภะ', 'กาลา', 'ตนุ', 'ไทย',
  'เรือน 1', 'เรือน 2', 'เรือน 3', 'เรือน 4', 'เรือน 5', 'เรือน 6', 'เรือน 7', 'เรือน 8', 'เรือน 9',
] as const

const TAKSA_TABLE_LABELS = [
  'ทักษา 1 (อาทิตย์)', 'ทักษา 2 (จันทร์)', 'ทักษา 3 (อังคาร)', 'ทักษา 4 (พุธ)',
  'ทักษา 5 (พฤหัส)', 'ทักษา 6 (ศุกร์)', 'ทักษา 7 (เสาร์)', 'ทักษา 8 (ราหู)', 'ทักษา 9 (เกตุ)',
  'ทักษากลาง', 'ทักษาต้น', 'ทักษาปลาย', 'ทักษาเช้า', 'ทักษาเย็น', 'ทักษากลางวัน', 'ทักษากลางคืน',
  'ทักษาพุธกลางวัน', 'ทักษาพุธกลางคืน', 'ทักษาราหู (๘)', 'ทักษาเสาร์', 'ทักษาศุกร์', 'ทักษาพฤหัส',
  'ทักษาอังคาร', 'ทักษาจันทร์', 'ทักษาอาทิตย์',
] as const

const HOUSE_TABLE_LABELS = [
  'ลัคนา', 'เรือน 1', 'เรือน 2', 'เรือน 3', 'เรือน 4', 'เรือน 5', 'เรือน 6',
  'เรือน 7', 'เรือน 8', 'เรือน 9', 'เรือน 10', 'เรือน 11', 'เรือน 12',
  'ภพ 1', 'ภพ 2', 'ภพ 3', 'ภพ 4', 'ภพ 5', 'ภพ 6', 'ภพ 7', 'ภพ 8', 'ภพ 9', 'ภพ 10', 'ภพ 11', 'ภพ 12',
] as const

const TAKSA_LORDS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'ราหู', 'เกตุ'] as const
const AQUARIUS = 'กุมภ'

function pick<T>(arr: readonly T[], index: number): T {
  return arr[((index % arr.length) + arr.length) % arr.length] as T
}

function mockDegree(seed: number, rowIndex: number): string {
  const total = ((seed * 17 + rowIndex * 11) % 3600) / 10
  const deg = Math.floor(total / 30)
  const min = Math.floor((total % 30) * 2)
  return `${deg}° ${min}'`
}

function siderealSignForLabel(label: string, seed: number, rowIndex: number): string {
  if (label === 'ราหู' && CALCULATION_SETTINGS.rahuRule === 'eight_signs_aquarius') {
    const aquariusIndex = SIGNS.indexOf(AQUARIUS)
    if (aquariusIndex < 0) return AQUARIUS
    return pick(SIGNS, aquariusIndex - (seed % 8))
  }
  const planetIndex = PLANETS.indexOf(label as (typeof PLANETS)[number])
  const signOffset = MOCK_SIGN_OFFSET_BASE + (seed % 12)
  const base =
    planetIndex >= 0
      ? (signOffset + planetIndex * 3 + Math.floor(seed / 7)) % 12
      : (signOffset + rowIndex * 2 + Math.floor(seed / 5)) % 12
  return pick(SIGNS, base)
}

/** ผสมสถิตรราศีจริงจาก result.planets + chart (ลาหิรี/ทักษา) */
export function buildDashboardTables(result: AstrologyResult): DashboardTables {
  const seed = birthDataSeed(result.input)
  const lagna = result.meta.lagna ?? result.chart?.lagna
  const signByPlanet = new Map(result.planets.map((p) => [p.planet, p.siderealSign]))
  const chartTaksa = result.chart?.taksa ?? []

  const planets: PlanetTableRow[] = PLANET_TABLE_LABELS.slice(0, TABLE_ROW_COUNT).map((label, i) => {
    let siderealSign =
      signByPlanet.get(label) ?? siderealSignForLabel(label, seed, i)
    if (label === 'ลัคนา' && lagna) siderealSign = lagna
    return {
      rowNo: i + 1,
      label,
      siderealSign,
      house: String(((seed + i) % 12) + 1),
      degree: mockDegree(seed, i),
    }
  })

  const taksa: TaksaTableRow[] = TAKSA_TABLE_LABELS.slice(0, TABLE_ROW_COUNT).map((label, i) => {
    const slot = chartTaksa[i]
    if (slot) {
      return {
        rowNo: i + 1,
        taksa: slot.taksa || label,
        lord: pick(TAKSA_LORDS, i + (seed % 9)),
        sign: slot.sign,
        count: String(slot.index),
      }
    }
    return {
      rowNo: i + 1,
      taksa: label,
      lord: pick(TAKSA_LORDS, i + (seed % 9)),
      sign: pick(SIGNS, (seed + i * 4) % 12),
      count: String(((seed + i * 3) % 9) + 1),
    }
  })

  const houses: HouseTableRow[] = HOUSE_TABLE_LABELS.slice(0, TABLE_ROW_COUNT).map((bhava, i) => ({
    rowNo: i + 1,
    bhava: i === 0 && lagna ? `ลัคนา (${lagna})` : bhava,
    sign: i === 0 && lagna ? lagna : pick(SIGNS, (seed + i) % 12),
    planetsIn: pick(PLANETS, (seed + i * 2) % PLANETS.length),
  }))

  return { planets, taksa, houses }
}
