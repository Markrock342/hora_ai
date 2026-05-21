import type { BirthInput, BirthFormErrors } from '../types/astrology'

const TIME_PATTERN = /^([01]?\d|2[0-3]):([0-5]\d)$/

export function parseTime(time: string): { hours: number; minutes: number } | null {
  const match = time.trim().match(TIME_PATTERN)
  if (!match) return null
  return { hours: Number(match[1]), minutes: Number(match[2]) }
}

export function daysInMonth(month: number, year: number): number {
  if (month < 1 || month > 12 || year < 1900 || year > 2100) return 31
  return new Date(year, month, 0).getDate()
}

export function isValidDate(day: number, month: number, year: number): boolean {
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
    return false
  }
  if (month < 1 || month > 12 || day < 1) return false
  return day <= daysInMonth(month, year) && year >= 1900 && year <= 2100
}

export function formatSubjectName(input: BirthInput): string {
  return input.name.trim()
}

export function formatBirthDisplay(input: BirthInput): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(input.day)}/${pad(input.month)}/${input.year} เวลา ${input.time}`
}

export function formatLocationDisplay(input: BirthInput): string {
  const parts = [input.district, input.province].filter(Boolean)
  return parts.join(', ')
}

export function validateBirthInput(input: BirthInput): BirthFormErrors {
  const errors: BirthFormErrors = {}

  const name = input.name.trim()
  if (!name) {
    errors.name = 'กรุณากรอกชื่อเจ้าชะตา'
  } else if (name.length < 2) {
    errors.name = 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'
  }

  if (!input.day || !input.month || !input.year) {
    if (!input.day) errors.day = 'กรุณาเลือกวัน'
    if (!input.month) errors.month = 'กรุณาเลือกเดือน'
    if (!input.year) errors.year = 'กรุณากรอกปี'
  } else if (!isValidDate(input.day, input.month, input.year)) {
    errors.day = 'วันที่ไม่ถูกต้อง'
  }

  if (!input.time.trim()) {
    errors.time = 'กรุณากรอกเวลาเกิด'
  } else if (!parseTime(input.time)) {
    errors.time = 'รูปแบบเวลาไม่ถูกต้อง (ใช้ HH:mm)'
  }

  if (!input.province.trim()) errors.province = 'กรุณาเลือกจังหวัด'
  if (!input.district.trim()) errors.district = 'กรุณากรอกอำเภอ/เมือง'

  return errors
}

export function hasValidationErrors(errors: BirthFormErrors): boolean {
  return Object.keys(errors).length > 0
}

export function birthDataSeed(input: BirthInput): number {
  const time = parseTime(input.time)
  const h = time?.hours ?? 0
  const m = time?.minutes ?? 0
  const str = `${input.name}${input.year}${input.month}${input.day}${h}${m}${input.province}${input.district}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return hash
}
