/** ระยะเวลา ritual ขั้นต่ำก่อน outro (ms) */
export const CALC_RITUAL_MIN_MS = 1200

/** outro ฟอร์ม + ritual ก่อน navigate (ms) — สอดคล้อง calc-ritual-outro ใน CSS */
export const CALC_OUTRO_MS = 900

export type CalcNavState = { fromCalc?: boolean }

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
