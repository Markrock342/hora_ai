import type { TransitInput } from './transit'
import type { MyhoraDateDetail } from '../utils/myhora/parseDateDetail'

export type { MyhoraDateDetail, MyhoraDateLine, MyhoraDateLineType } from '../utils/myhora/parseDateDetail'

/** ข้อมูลดึงจาก myhora thai.aspx (กราฟ / ตารางทักษา / ตรีวัย) */

export interface MyhoraChartEmbeds {
  /** chart-rasi-analysis-natal.aspx — วงกลมหลัก #chart_natal (900px) */
  natalAnalysis?: string | null
  /** chart-natal.aspx (SVG) — โหลดใน iframe ได้ตรง ไม่ redirect */
  natalSvg?: string | null
  /** chart-rasi.aspx */
  rasi: string | null
  /** chart-rasi-navang-triyang.aspx?type=navang */
  navamsa: string | null
  /** chart-rasi-navang-triyang.aspx?type=triyang */
  drekkana: string | null
  /** HTML กราพร้อมแสดง (มี CSS ตำแหน่งดาว) */
  rasiHtml?: string | null
  navamsaHtml?: string | null
  drekkanaHtml?: string | null
  /** chart-bhava.aspx */
  bhava?: string | null
  bhavaHtml?: string | null
}

/** path สำหรับ iframe ทักษา / ตรีวัย */
export interface MyhoraWidgetEmbeds {
  taksa: string | null
  triwai: string | null
}

export interface MyhoraNatalPlanet {
  planet: string
  zodiac: string
  degree: string
  minute: string
  house?: string
  triyang?: string
  poison?: string
  nawamang?: string
  rerk?: string
  rerkName?: string
  baht?: string
  rerk2?: string
  rerkBig?: string
  rerkOwner?: string
  rerkStandard?: string
}

/** iframe เพิ่ม — ดาวรอบกราฟ, คำทำนาย, เรือนลัคนา ฯลฯ */
export interface MyhoraContentEmbeds {
  chartPlanet: string | null
  astrologyNatal: string | null
  astrologyTransit: string | null
  chartBhava: string | null
  chartRasiAnalysisNatal: string | null
  chartRasi10Luck: string | null
}

/** HTML ฝังใน thai.aspx หรือดึงมาแล้วเตรียมแสดง */
export interface MyhoraHtmlFragments {
  natalTable: string | null
  astrologyNatal: string | null
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
  /** กราฟ/คำทำนายเพิ่มจาก .load() ใน thai.aspx */
  contentEmbeds?: MyhoraContentEmbeds
  /** ตารางสมผุส + คำทำนาย (HTML พร้อมแสดง) */
  htmlFragments?: MyhoraHtmlFragments
  /** วันจรที่ใช้คำนวณรอบนี้ */
  transit?: TransitInput
  /** 3×3 ทักษา */
  taksa: (MyhoraTaksaCell | null)[][]
  /** ดวงกำเนิด 2×4 */
  triwaiNatal: (MyhoraTriwaiCell | null)[][]
  /** ดวงจร 2×4 */
  triwaiTransit: (MyhoraTriwaiCell | null)[][]
}
