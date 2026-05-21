export interface BirthInput {
  day: number
  month: number
  year: number
  time: string
  country: string
  province: string
  district: string
}

/** ผลลัพธ์ — ตารางเดียว 2 คอลัมน์ */
export interface PlanetSignRow {
  planet: string
  siderealSign: string
}

export interface CalculationSettings {
  calendar: 'suryayat'
  ayanamsa: 'lahiri'
  timeMethod: 'antonathi_samrap_sunrise_local'
  rahuRule: 'eight_signs_aquarius'
  taksaRahuLord: 'mercury_night'
  taksaCountFrom: 'center'
}

export interface AstrologyResultMeta {
  birthDisplay: string
  locationDisplay: string
}

export interface AstrologyResult {
  input: BirthInput
  calculatedAt: string
  settings: CalculationSettings
  meta: AstrologyResultMeta
  /** ตารางดาว — ดาว + สถิตราศี เท่านั้น */
  planets: PlanetSignRow[]
}

export type BirthFormErrors = Partial<Record<keyof BirthInput, string>>
