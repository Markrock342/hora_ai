/**
 * ป้ายแถวมาตรฐาน 25 แถว/ตาราง — ปรับเมื่อลูกค้ายืนยัน layout myhora
 */

import { TABLE_ROW_COUNT } from '../types/astrology'

export const PLANET_TABLE_LABELS = [
  'อาทิตย์',
  'จันทร์',
  'อังคาร',
  'พุธ',
  'พฤหัสบดี',
  'ศุกร์',
  'เสาร์',
  'ราหู',
  'เกตุ',
  'มฤตยู',
  'ลัคนา',
  'นวโลห',
  'สุภะ',
  'กาลา',
  'ตนุ',
  'ไทย',
  'เรือน 1',
  'เรือน 2',
  'เรือน 3',
  'เรือน 4',
  'เรือน 5',
  'เรือน 6',
  'เรือน 7',
  'เรือน 8',
  'เรือน 9',
] as const

export const TAKSA_TABLE_LABELS = [
  'ทักษา 1 (อาทิตย์)',
  'ทักษา 2 (จันทร์)',
  'ทักษา 3 (อังคาร)',
  'ทักษา 4 (พุธ)',
  'ทักษา 5 (พฤหัส)',
  'ทักษา 6 (ศุกร์)',
  'ทักษา 7 (เสาร์)',
  'ทักษา 8 (ราหู)',
  'ทักษา 9 (เกตุ)',
  'ทักษากลาง',
  'ทักษาต้น',
  'ทักษาปลาย',
  'ทักษาเช้า',
  'ทักษาเย็น',
  'ทักษากลางวัน',
  'ทักษากลางคืน',
  'ทักษาพุธกลางวัน',
  'ทักษาพุธกลางคืน',
  'ทักษาราหู (๘)',
  'ทักษาเสาร์',
  'ทักษาศุกร์',
  'ทักษาพฤหัส',
  'ทักษาอังคาร',
  'ทักษาจันทร์',
  'ทักษาอาทิตย์',
] as const

export const HOUSE_TABLE_LABELS = [
  'ลัคนา',
  'เรือน 1',
  'เรือน 2',
  'เรือน 3',
  'เรือน 4',
  'เรือน 5',
  'เรือน 6',
  'เรือน 7',
  'เรือน 8',
  'เรือน 9',
  'เรือน 10',
  'เรือน 11',
  'เรือน 12',
  'ภพ 1',
  'ภพ 2',
  'ภพ 3',
  'ภพ 4',
  'ภพ 5',
  'ภพ 6',
  'ภพ 7',
  'ภพ 8',
  'ภพ 9',
  'ภพ 10',
  'ภพ 11',
  'ภพ 12',
] as const

export function assertTableRowCounts(
  planets: unknown[],
  taksa: unknown[],
  houses: unknown[],
): void {
  if (
    planets.length !== TABLE_ROW_COUNT ||
    taksa.length !== TABLE_ROW_COUNT ||
    houses.length !== TABLE_ROW_COUNT
  ) {
    throw new Error(
      `Astrology tables must have ${TABLE_ROW_COUNT} rows each (got ${planets.length}, ${taksa.length}, ${houses.length})`,
    )
  }
}
