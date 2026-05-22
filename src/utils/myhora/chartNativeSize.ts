/** ขนาดดั้งเดิมของกราฟ myhora (ก่อน scale) */
export const MYHORA_CHART_NATIVE = {
  rasi: { width: 500, height: 450 },
  divisional: { width: 325, height: 325 },
} as const

export type MyhoraChartNativeKey = keyof typeof MYHORA_CHART_NATIVE

export function chartNativeForMarkup(html: string): (typeof MYHORA_CHART_NATIVE)[MyhoraChartNativeKey] {
  if (html.includes('cnt-chart')) return MYHORA_CHART_NATIVE.divisional
  return MYHORA_CHART_NATIVE.rasi
}
