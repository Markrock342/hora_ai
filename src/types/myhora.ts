import type { TransitInput } from './transit'
import type { MyhoraDateDetail } from '../utils/myhora/parseDateDetail'

export type { MyhoraDateDetail, MyhoraDateLine, MyhoraDateLineType } from '../utils/myhora/parseDateDetail'

/** ข้อมูลดึงจาก myhora thai.aspx (กราฟ / ตารางทักษา / ตรีวัย) */

export interface MyhoraChartEmbeds {
  /** chart-rasi.aspx */
  rasi: string | null
  /** chart-rasi-navang-triyang.aspx?type=navang */
  navamsa: string | null
  /** chart-rasi-navang-triyang.aspx?type=triyang */
  drekkana: string | null
}

/** path สำหรับ iframe ทักษา / ตรีวัย */
export interface MyhoraWidgetEmbeds {
  taksa: string | null
  triwai: string | null
}

export interface MyhoraTaksaCell {
  label: string
  planetNum: number | null
  transitLabel: string
  /** ช่องกลาง (เกตุ นับตากลาง) */
  isCenter?: boolean
  highlighted?: boolean
}

export interface MyhoraTriwaiCell {
  house: string
  planetNum: number
  ageRange: string
  /** ช่วงอายุปัจจุบัน (พื้นหลัง TWT) */
  highlighted?: boolean
}

export interface MyhoraTables {
  lagnaSign: string | null
  /** ข้อความสรุป (สำรอง / ค้นหา) */
  summaryNatal: string | null
  summaryTransit: string | null
  /** รายละเอียดแยกบรรทัดจาก myhora */
  dateDetailNatal?: MyhoraDateDetail | null
  dateDetailTransit?: MyhoraDateDetail | null
  /** path สำหรับ iframe กราฟ (ดึงจาก myhora โดยตรง) */
  chartEmbeds?: MyhoraChartEmbeds
  /** chart-taksa.aspx / chart-triwai.aspx */
  widgetEmbeds?: MyhoraWidgetEmbeds
  /** วันจรที่ใช้คำนวณรอบนี้ */
  transit?: TransitInput
  /** 3×3 ทักษา */
  taksa: (MyhoraTaksaCell | null)[][]
  /** ดวงกำเนิด 2×4 */
  triwaiNatal: (MyhoraTriwaiCell | null)[][]
  /** ดวงจร 2×4 */
  triwaiTransit: (MyhoraTriwaiCell | null)[][]
}
