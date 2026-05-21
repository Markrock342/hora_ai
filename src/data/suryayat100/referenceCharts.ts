/**
 * ชุดอ้างอิงจาก myhora (ราศีจักร — ตัวเลขดำ = ดวงกำเนิด)
 * ใช้จนกว่ามีไฟล์ปฏิทินร้อยปีครบ
 *
 * ตัวอย่างในภาพ: เกิด อาทิตย์ 21 พ.ค. 2549 18:31 พระนคร
 */

import type { SuryayatReferenceEntry } from './types'

/** คีย์ตรง suryayatCalendarKey() */
export const SURIYAYAT_REFERENCE_BY_KEY: Record<string, SuryayatReferenceEntry> = {
  '2006-05-21T18:31|13.75|100.49': {
    lagna: 'พิจิก',
    planets: {
    อาทิตย์: 'มีน',
    จันทร์: 'กุมภ์',
    อังคาร: 'เมษ',
    พุธ: 'พิจิก',
    พฤหัสบดี: 'ตุลย์',
    ศุกร์: 'มีน',
    เสาร์: 'สิงห์',
    ราหู: 'มกร',
    เกตุ: 'พิจิก',
    มฤตยู: 'ตุลย์',
    },
  },
}
