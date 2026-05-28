import { normalizeMyhoraEmbedPath } from './myhoraProxy'

const LS_PREFIX = 'newhora_chart_natal_'

export type NatalHouseMode = 'lux' | 'tanuluk' | 'tanuset' | 'tanukaset'

export type NatalOuterMode = 'navang' | 'triyang'

/** ตัวเลือกแสดงผลกราฟดวงกำเนิด (ตรง myhora cb_nhou / cb_nstd / cb_nouter / cb_nasptline) */
export interface NatalChartDisplayOptions {
  showHouses: boolean
  houseMode: NatalHouseMode
  showStd: boolean
  /** ค่า dd_nstd เช่น A = เกษตร (๘) */
  stdMode: string
  showOuter: boolean
  outerMode: NatalOuterMode
  aspectLines: boolean
  /** แยกวงจักร: แสดงเฉพาะดาวจร (เลขเดี่ยวอารบิกวงนอก) */
  isTransitOnly?: boolean
}

export const DEFAULT_NATAL_STD_MODE = 'A'

export const NATAL_STD_OPTIONS: { value: string; label: string }[] = [
  { value: 'A', label: 'เกษตร (๘)' },
  { value: 'B', label: 'เกษตร (๗)' },
  { value: 'C', label: 'เกษตร (พลูหลวง)' },
  { value: 'D', label: 'เกษตร (พลูหลวง) 2' },
  { value: 'E', label: 'เกษตร (สากล)' },
  { value: 'F', label: 'เกษตร (สากล) 2' },
  { value: 'G', label: 'เกษตร (สากล) 3' },
  { value: 'aut', label: 'อุจจ์' },
  { value: 'aut_plu', label: 'อุจจ์ (พลูหลวง)' },
  { value: 'pra7', label: 'ประ (๗)' },
  { value: 'pra8', label: 'ประ (๘)' },
  { value: 'pra_plu', label: 'ประ (พลูหลวง)' },
  { value: 'nij', label: 'นิจ' },
  { value: 'nij_plu', label: 'นิจ (พลูหลวง)' },
  { value: 'rachachoke', label: 'ราชาโชค' },
  { value: 'dewechoke', label: 'เทวีโชค' },
  { value: 'mullkaset', label: 'มูลเกษตร' },
  { value: 'julachak', label: 'จุลจักร' },
]

export const NATAL_HOUSE_OPTIONS: { value: NatalHouseMode; label: string }[] = [
  { value: 'lux', label: 'เรือนลัคนา' },
  { value: 'tanuluk', label: 'เรือนตนุลัคน์' },
  { value: 'tanuset', label: 'เรือนตนุเศษ' },
  { value: 'tanukaset', label: 'เรือนตนุเกษตร' },
]

export const NATAL_OUTER_OPTIONS: { value: NatalOuterMode; label: string }[] = [
  { value: 'navang', label: 'นวางค์ กำเนิด' },
  { value: 'triyang', label: 'ตรียางค์ กำเนิด' },
]

export function defaultNatalChartOptions(): NatalChartDisplayOptions {
  return {
    showHouses: readBool('hou', true),
    houseMode: readHouseMode(),
    showStd: readBool('std', false),
    stdMode: readStdMode(),
    showOuter: readBool('outer', true),
    outerMode: readOuterMode(),
    aspectLines: readBool('asptline', false),
  }
}

function readBool(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(`${LS_PREFIX}${key}`)
    if (v == null) return fallback
    return v === 'true'
  } catch {
    return fallback
  }
}

function readHouseMode(): NatalHouseMode {
  try {
    const v = localStorage.getItem(`${LS_PREFIX}hou_mode`)
    if (v === 'tanuluk' || v === 'tanuset' || v === 'tanukaset' || v === 'lux') return v
  } catch {
    /* ignore */
  }
  return 'lux'
}

function readStdMode(): string {
  try {
    return localStorage.getItem(`${LS_PREFIX}std_mode`) ?? DEFAULT_NATAL_STD_MODE
  } catch {
    return DEFAULT_NATAL_STD_MODE
  }
}

function readOuterMode(): NatalOuterMode {
  try {
    const v = localStorage.getItem(`${LS_PREFIX}outer_mode`)
    if (v === 'triyang' || v === 'navang') return v
  } catch {
    /* ignore */
  }
  return 'navang'
}

export function persistNatalChartOptions(opts: NatalChartDisplayOptions): void {
  try {
    localStorage.setItem(`${LS_PREFIX}hou`, String(opts.showHouses))
    localStorage.setItem(`${LS_PREFIX}hou_mode`, opts.houseMode)
    localStorage.setItem(`${LS_PREFIX}std`, String(opts.showStd))
    localStorage.setItem(`${LS_PREFIX}std_mode`, opts.stdMode)
    localStorage.setItem(`${LS_PREFIX}outer`, String(opts.showOuter))
    localStorage.setItem(`${LS_PREFIX}outer_mode`, opts.outerMode)
    localStorage.setItem(`${LS_PREFIX}asptline`, String(opts.aspectLines))
  } catch {
    /* ignore */
  }
}

/** อัปเดต query บน chart-rasi-analysis-natal.aspx */
export function buildNatalAnalysisEmbedPath(
  basePath: string,
  opts: NatalChartDisplayOptions,
): string {
  const normalized = normalizeMyhoraEmbedPath(basePath)
  const qIndex = normalized.indexOf('?')
  const path = qIndex >= 0 ? normalized.slice(0, qIndex) : normalized
  const params = new URLSearchParams(qIndex >= 0 ? normalized.slice(qIndex + 1) : '')

  params.set('display', 'embed')
  params.set('asptline', opts.aspectLines ? 'true' : 'false')
  params.set('aspect', 'XTTTTTTTTT')
  if (opts.showOuter) {
    params.set('outer', opts.outerMode)
  } else {
    params.delete('outer')
  }

  return `${path}?${params.toString()}`
}

export function isNatalAnalysisPath(path: string): boolean {
  const base = normalizeMyhoraEmbedPath(path).split('?')[0] ?? ''
  return /chart-rasi-analysis-natal\.aspx$/i.test(base)
}
