import type { BirthInput } from '../../types/astrology'
import type { MyhoraTables } from '../../types/myhora'
import {
  mergeMyhoraTables,
  parseAscendantOption,
  parseEmbedUrls,
  parsePlanetTable,
  parseViewState,
  planetsFromMyhoraTable,
} from './parseHtml'
import type { PlanetSignRow } from '../../types/astrology'

const MYHORA_ORIGIN =
  import.meta.env.VITE_MYHORA_ORIGIN ??
  (import.meta.env.DEV ? '/api/myhora' : 'https://myhora.com')

function ceToBe(year: number): number {
  return year + 543
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function countryValue(country: string): string {
  if (country === 'ไทย' || !country.trim()) return 'ไทย(Thailand)'
  return country
}

export function buildMyhoraFormBody(
  input: BirthInput,
  viewState: string,
  generator: string,
  ascValue: string,
): URLSearchParams {
  const [hh, mm] = input.time.split(':')
  const be = ceToBe(input.year)
  const now = new Date()
  const tBe = ceToBe(now.getFullYear())

  const body = new URLSearchParams({
    __VIEWSTATE: viewState,
    __VIEWSTATEGENERATOR: generator,
    txt_name: '',
    dd_day: String(input.day),
    dd_month: pad2(input.month),
    dd_year: String(be),
    dd_hh: String(Number(hh) || 0),
    dd_mm: String(Number(mm) || 0),
    dd_province: input.province,
    dd_amphur: input.district,
    dd_country: countryValue(input.country),
    txt_lat_th: '13.752555',
    txt_lon_th: '100.494066',
    txt_utc_th: '+07:00',
    txt_zoom_th: '16',
    dd_day2: String(now.getDate()),
    dd_month2: pad2(now.getMonth() + 1),
    dd_year2: String(tBe),
    dd_hh2: String(now.getHours()),
    dd_mm2: String(now.getMinutes()),
    dd_province2: input.province,
    dd_amphur2: input.district,
    setcal: 'rb_suriyayas',
    dd_suriyayas_asc: ascValue,
    cb_setday8: 'on',
    cb_settaksamid: 'on',
    cb_setmnnode: 'on',
    cb_setthsnode: 'on',
    cb_setaspt: 'on',
    btn_submit: 'ทำนาย',
  })
  return body
}

async function fetchText(path: string, init?: RequestInit): Promise<string> {
  const url = path.startsWith('http') ? path : `${MYHORA_ORIGIN}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'User-Agent': 'NewHora/1.0',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) throw new Error(`myhora HTTP ${res.status}`)
  return res.text()
}

export interface MyhoraScrapeResult {
  planets: PlanetSignRow[]
  lagna: string | null
  tables: MyhoraTables
}

export async function fetchMyhoraThaiChart(input: BirthInput): Promise<MyhoraScrapeResult> {
  const landing = await fetchText('/astrology/thai.aspx')
  const vs = parseViewState(landing)
  if (!vs) throw new Error('ไม่พบ __VIEWSTATE จาก myhora')

  const ascValue = parseAscendantOption(landing)
  const body = buildMyhoraFormBody(input, vs.viewState, vs.generator, ascValue)

  const resultHtml = await fetchText('/astrology/thai.aspx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const { lagnaSign, planets } = parsePlanetTable(resultHtml)
  const embeds = parseEmbedUrls(resultHtml)

  let taksaHtml = ''
  let triwaiHtml = ''
  if (embeds.taksa) taksaHtml = await fetchText(embeds.taksa)
  if (embeds.triwai) triwaiHtml = await fetchText(embeds.triwai)

  const tables = mergeMyhoraTables(resultHtml, taksaHtml, triwaiHtml)

  return {
    planets: planets.length ? planets : planetsFromMyhoraTable(resultHtml),
    lagna: lagnaSign ?? tables.lagnaSign,
    tables: { ...tables, lagnaSign: lagnaSign ?? tables.lagnaSign },
  }
}

export function isMyhoraScrapeAvailable(): boolean {
  return import.meta.env.DEV || Boolean(import.meta.env.VITE_MYHORA_ORIGIN)
}
