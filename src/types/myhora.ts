/** ข้อมูลดึงจาก myhora thai.aspx (ตารางทักษา / ตรีวัย) */

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
  summaryNatal: string | null
  summaryTransit: string | null
  /** 3×3 ทักษา */
  taksa: (MyhoraTaksaCell | null)[][]
  /** ดวงกำเนิด 2×4 */
  triwaiNatal: (MyhoraTriwaiCell | null)[][]
  /** ดวงจร 2×4 */
  triwaiTransit: (MyhoraTriwaiCell | null)[][]
}
