/**
 * Mock ผลลัพธ์ 3 ตาราง × 25 แถว
 * แทนที่ด้วยสูตรจริงใน utils/formulas/ เมื่อมีแหล่งอ้างอิง
 * @see docs/FORMULA_SOURCES.md
 */

import type {
  AstrologyResult,
  AstrologyResultTables,
  BirthInput,
  HouseTableRow,
  PlanetSignRow,
  PlanetTableRow,
  TaksaTableRow,
} from '../types/astrology'
import { TABLE_ROW_COUNT } from '../types/astrology'
import { CALCULATION_SETTINGS } from './calculationSettings'
import { MOCK_SIGN_OFFSET_BASE, PLANETS, SIGNS } from './astrologyConstants'
import {
  HOUSE_TABLE_LABELS,
  PLANET_TABLE_LABELS,
  TAKSA_TABLE_LABELS,
  assertTableRowCounts,
} from './tableRowLabels'
import {
  birthDataSeed,
  formatBirthDisplay,
  formatLocationDisplay,
  formatSubjectName,
} from '../utils/dateTimeUtils'

const AQUARIUS = 'กุมภ'
const TAKSA_LORDS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'ราหู', 'เกตุ'] as const

function pick<T>(arr: readonly T[], index: number): T {
  return arr[((index % arr.length) + arr.length) % arr.length] as T
}

function mockDegree(seed: number, rowIndex: number): string {
  const total = ((seed * 17 + rowIndex * 11) % 3600) / 10
  const deg = Math.floor(total / 30)
  const min = Math.floor((total % 30) * 2)
  return `${deg}° ${min}'`
}

function mockHouse(seed: number, rowIndex: number): string {
  return String(((seed + rowIndex) % 12) + 1)
}

function isNightBirth(time: string): boolean {
  const [h] = time.split(':').map(Number)
  return h < 6 || h >= 18
}

function applyRahuEightSignsAquarius(seed: number): string {
  const offset = seed % 8
  const aquariusIndex = SIGNS.indexOf(AQUARIUS)
  if (aquariusIndex < 0) return AQUARIUS
  return pick(SIGNS, aquariusIndex - offset)
}

function siderealSignForLabel(
  label: string,
  seed: number,
  rowIndex: number,
  input: BirthInput,
): string {
  if (label === 'ราหู' && CALCULATION_SETTINGS.rahuRule === 'eight_signs_aquarius') {
    if (CALCULATION_SETTINGS.taksaRahuLord === 'mercury_night') {
      void (isNightBirth(input.time) ? 'พุธกลางคืน' : 'พุธกลางวัน')
    }
    return applyRahuEightSignsAquarius(seed)
  }
  const planetIndex = PLANETS.indexOf(label as (typeof PLANETS)[number])
  const signOffset = MOCK_SIGN_OFFSET_BASE + (seed % 12)
  const base =
    planetIndex >= 0
      ? (signOffset + planetIndex * 3 + Math.floor(seed / 7)) % 12
      : (signOffset + rowIndex * 2 + Math.floor(seed / 5)) % 12
  return pick(SIGNS, base)
}

function buildPlanetTable(input: BirthInput, seed: number): PlanetTableRow[] {
  return PLANET_TABLE_LABELS.slice(0, TABLE_ROW_COUNT).map((label, i) => ({
    rowNo: i + 1,
    label,
    siderealSign: siderealSignForLabel(label, seed, i, input),
    house: mockHouse(seed, i),
    degree: mockDegree(seed, i),
  }))
}

function buildTaksaTable(seed: number): TaksaTableRow[] {
  return TAKSA_TABLE_LABELS.slice(0, TABLE_ROW_COUNT).map((taksa, i) => ({
    rowNo: i + 1,
    taksa,
    lord: pick(TAKSA_LORDS, i + (seed % 9)),
    sign: pick(SIGNS, (seed + i * 4) % 12),
    count: String(((seed + i * 3) % 9) + 1),
  }))
}

function buildHouseTable(seed: number): HouseTableRow[] {
  return HOUSE_TABLE_LABELS.slice(0, TABLE_ROW_COUNT).map((bhava, i) => ({
    rowNo: i + 1,
    bhava,
    sign: pick(SIGNS, (seed + i) % 12),
    planetsIn: pick(PLANETS, (seed + i * 2) % PLANETS.length),
  }))
}

/** สรุป 10 ดาวหลัก → PlanetSignRow[] สำหรับ UI แบบ 2 คอลัมน์ */
export function toPlanetSignRows(planetTable: PlanetTableRow[]): PlanetSignRow[] {
  return PLANETS.map((planet) => {
    const row = planetTable.find((r) => r.label === planet)
    return {
      planet,
      siderealSign: row?.siderealSign ?? '—',
    }
  })
}

export function buildMockTables(input: BirthInput): AstrologyResultTables {
  const seed = birthDataSeed(input)
  const tables = {
    planets: buildPlanetTable(input, seed),
    taksa: buildTaksaTable(seed),
    houses: buildHouseTable(seed),
  }
  assertTableRowCounts(tables.planets, tables.taksa, tables.houses)
  return tables
}

/** ผลลัพธ์ mock ครบชุด — จุดเดียวที่ UI ควรได้รับข้อมูลหลังคำนวณ */
export function buildMockAstrologyResult(input: BirthInput): AstrologyResult {
  const tables = buildMockTables(input)
  return {
    input,
    calculatedAt: new Date().toISOString(),
    settings: { ...CALCULATION_SETTINGS },
    meta: {
      subjectName: formatSubjectName(input),
      birthDisplay: formatBirthDisplay(input),
      locationDisplay: formatLocationDisplay(input),
    },
    tables,
    planets: toPlanetSignRows(tables.planets),
  }
}
