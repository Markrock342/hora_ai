/**
 * โครงข้อมูลกลาง — แก้ชื่อ field ต้อง review (คนที่ 1)
 * @see docs/FORMULA_SOURCES.md
 */

// ——— Input ———

export interface BirthInput {
  name: string
  day: number
  month: number
  year: number
  /** HH:mm 24h */
  time: string
  province: string
  district: string
}

export type BirthFormErrors = Partial<Record<keyof BirthInput, string>>

// ——— ระบบคำนวณ (คงที่) ———

export interface CalculationSettings {
  calendar: 'suryayat'
  ayanamsa: 'lahiri'
  timeMethod: 'antonathi_samrap_sunrise_local'
  rahuRule: 'eight_signs_aquarius'
  taksaRahuLord: 'mercury_night'
  taksaCountFrom: 'center'
}

// ——— Output: 3 ตาราง × 25 แถว ———

export const TABLE_ROW_COUNT = 25

/** ตารางที่ 1 — ดาว / สถิตราศี */
export interface PlanetTableRow {
  rowNo: number
  label: string
  siderealSign: string
  house: string
  degree: string
}

/** ตารางที่ 2 — ทักษา */
export interface TaksaTableRow {
  rowNo: number
  taksa: string
  lord: string
  sign: string
  count: string
}

/** ตารางที่ 3 — ราศี / ภพ / เรือน */
export interface HouseTableRow {
  rowNo: number
  bhava: string
  sign: string
  planetsIn: string
}

/** @deprecated ใช้ PlanetTableRow — คงไว้ชั่วคราวสำหรับ UI เก่า */
export interface PlanetSignRow {
  planet: string
  siderealSign: string
}

/** ชื่อเดิมใน spec — เท่ากับ PlanetTableRow */
export type PlanetPosition = PlanetTableRow

export interface AstrologyResultTables {
  planets: PlanetTableRow[]
  taksa: TaksaTableRow[]
  houses: HouseTableRow[]
}

export interface AstrologyResultMeta {
  subjectName: string
  birthDisplay: string
  locationDisplay: string
}

export interface AstrologyResult {
  input: BirthInput
  calculatedAt: string
  settings: CalculationSettings
  meta: AstrologyResultMeta
  tables: AstrologyResultTables
  /**
   * สรุปตารางดาว (10 ดาวหลัก) — derive จาก tables.planets
   * อย่าแก้ชื่อโดยไม่ sync กับ tables
   */
  planets: PlanetSignRow[]
}
