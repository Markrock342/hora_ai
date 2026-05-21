import { resolvePlaceCoords } from '../../data/placeCoordinates'
import type { BirthInput } from '../../types/astrology'
import type { MyhoraChartEmbeds, MyhoraTables } from '../../types/myhora'
import type { TransitInput } from '../../types/transit'
import { defaultTransitInput } from '../../types/transit'
import { prepareMyhoraChartHtml } from './chartHtml'
import { prepareMyhoraContentHtml } from './prepareContentHtml'
import { parseMyhoraContentPaths } from './parseContent'
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
  transit: TransitInput = defaultTransitInput(),
): URLSearchParams {
  const [hh, mm] = input.time.split(':')
  const [tHh, tMm] = transit.time.split(':')
  const be = ceToBe(input.year)
  const tBe = ceToBe(transit.year)
  const place = resolvePlaceCoords(input.country, input.province, input.district)
  const utcHours = place.utcOffsetMinutes / 60
  const utcFormatted =
    utcHours >= 0
      ? `+${String(Math.floor(utcHours)).padStart(2, '0')}:${String(place.utcOffsetMinutes % 60).padStart(2, '0')}`
      : `-${String(Math.floor(-utcHours)).padStart(2, '0')}:${String(Math.abs(place.utcOffsetMinutes % 60)).padStart(2, '0')}`

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
    txt_lat_th: String(place.lat),
    txt_lon_th: String(place.lon),
    txt_utc_th: utcFormatted,
    txt_zoom_th: '16',
    dd_day2: String(transit.day),
    dd_month2: pad2(transit.month),
    dd_year2: String(tBe),
    dd_hh2: String(Number(tHh) || 0),
    dd_mm2: String(Number(tMm) || 0),
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
  if (transit.preset) {
    body.set('dd_transit_date_option', transit.preset)
  }
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

export interface FetchMyhoraOptions {
  transit?: TransitInput
}

export async function fetchMyhoraThaiChart(
  input: BirthInput,
  options: FetchMyhoraOptions = {},
): Promise<MyhoraScrapeResult> {
  const transit = options.transit ?? defaultTransitInput()

  const landing = await fetchText('/astrology/thai.aspx')
  const vs = parseViewState(landing)
  if (!vs) throw new Error('ไม่พบ __VIEWSTATE จาก myhora')

  const ascValue = parseAscendantOption(landing)
  const body = buildMyhoraFormBody(input, vs.viewState, vs.generator, ascValue, transit)

  const resultHtml = await fetchText('/astrology/thai.aspx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const { lagnaSign, planets } = parsePlanetTable(resultHtml)
  const embeds = parseEmbedUrls(resultHtml)

  const contentPaths = parseMyhoraContentPaths(resultHtml)

  const [taksaHtml, triwaiHtml, natalHtml, rasiRaw, navamsaRaw, drekkanaRaw, bhavaRaw] =
    await Promise.all([
      embeds.taksa ? fetchText(embeds.taksa) : Promise.resolve(''),
      embeds.triwai ? fetchText(embeds.triwai) : Promise.resolve(''),
      contentPaths.astrologyNatal
        ? fetchText(contentPaths.astrologyNatal)
        : Promise.resolve(''),
      embeds.rasi ? fetchText(embeds.rasi) : Promise.resolve(''),
      embeds.navamsa ? fetchText(embeds.navamsa) : Promise.resolve(''),
      embeds.drekkana ? fetchText(embeds.drekkana) : Promise.resolve(''),
      contentPaths.chartBhava ? fetchText(contentPaths.chartBhava) : Promise.resolve(''),
    ])

  const chartEmbeds: MyhoraChartEmbeds = {
    rasi: embeds.rasi,
    navamsa: embeds.navamsa,
    drekkana: embeds.drekkana,
    rasiHtml: rasiRaw ? prepareMyhoraChartHtml(rasiRaw) : null,
    navamsaHtml: navamsaRaw ? prepareMyhoraChartHtml(navamsaRaw) : null,
    drekkanaHtml: drekkanaRaw ? prepareMyhoraChartHtml(drekkanaRaw) : null,
    bhava: contentPaths.chartBhava,
    bhavaHtml: bhavaRaw ? prepareMyhoraChartHtml(bhavaRaw) : null,
  }

  const astrologyNatalHtml = natalHtml
    ? prepareMyhoraContentHtml(
        natalHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? natalHtml,
      )
    : null

  const tables = mergeMyhoraTables(resultHtml, taksaHtml, triwaiHtml, {
    chartEmbeds,
    transit,
    htmlFragments: {
      astrologyNatal: astrologyNatalHtml,
    },
  })

  return {
    planets: planets.length ? planets : planetsFromMyhoraTable(resultHtml),
    lagna: lagnaSign ?? tables.lagnaSign,
    tables: { ...tables, lagnaSign: lagnaSign ?? tables.lagnaSign },
  }
}

/** true เมื่อ client ชี้ไป same-origin proxy (dev / .env.production / VITE_MYHORA_ORIGIN) */
export function isMyhoraScrapeAvailable(): boolean {
  const origin = import.meta.env.VITE_MYHORA_ORIGIN
  if (origin?.startsWith('/')) return true
  if (import.meta.env.DEV) return true
  return Boolean(origin)
}
