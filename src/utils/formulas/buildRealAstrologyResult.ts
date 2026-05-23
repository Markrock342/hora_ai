/**
 * คำนวณจริง → ตาราง ดาว | สถิตรราศี + กราฟราศีจักร
 */

import { CALCULATION_SETTINGS } from '../../data/calculationSettings'
import { resolvePlaceCoords } from '../../data/placeCoordinates'
import type { AstrologyResult, BirthInput } from '../../types/astrology'
import {
  formatBirthDisplay,
  formatLocationDisplay,
} from '../dateTimeUtils'
import { getCachedChart, setCachedChart } from '../suryayatCache'
import {
  fetchMyhoraThaiChart,
  isMyhoraScrapeAvailable,
  type MyhoraScrapeResult,
} from '../myhora/fetchMyhoraThai'
import { patchMyhoraNatalEmbeds } from '../myhora/patchMyhoraNatalEmbeds'
import type { TransitInput } from '../../types/transit'
import { defaultTransitInput } from '../../types/transit'
import { computeFullChartSync } from './pipeline'
import { lookupSuryayatSync } from './suryayat/lookup'

/** ผล scrape ต้องมีตารางดาว + ลัคนา + กราฟราศีจักร — มิฉะนั้นอย่าใช้ (จะเพี้ยน) */
export function isValidMyhoraScrape(scraped: MyhoraScrapeResult): boolean {
  const lagna = scraped.lagna ?? scraped.tables.lagnaSign
  const hasPlanets = scraped.planets.some(
    (p) => p.siderealSign && p.siderealSign !== '—',
  )
  const charts = scraped.tables.chartEmbeds
  const hasChart = Boolean(
    charts?.rasiHtml?.trim() ||
      charts?.rasi ||
      charts?.natalAnalysis ||
      charts?.natalSvg,
  )
  return Boolean(lagna && hasPlanets && hasChart)
}

function toResult(input: BirthInput, chart: ReturnType<typeof computeFullChartSync>): AstrologyResult {
  return {
    input,
    calculatedAt: new Date().toISOString(),
    settings: { ...CALCULATION_SETTINGS },
    meta: {
      birthDisplay: formatBirthDisplay(input),
      locationDisplay: formatLocationDisplay(input),
      calculationSource: chart.source,
      lagna: chart.lagna,
    },
    planets: chart.planets,
    chart: {
      lagna: chart.lagna,
      taksa: chart.taksa,
    },
  }
}

export function buildRealAstrologyResult(input: BirthInput): AstrologyResult {
  const place = resolvePlaceCoords(input.country, input.province, input.district)
  return toResult(input, computeFullChartSync(input, place))
}

function myhoraScrapeToResult(input: BirthInput, scraped: MyhoraScrapeResult): AstrologyResult {
  const lagna = scraped.lagna ?? scraped.tables.lagnaSign
  return {
    input,
    calculatedAt: new Date().toISOString(),
    settings: { ...CALCULATION_SETTINGS },
    meta: {
      birthDisplay: formatBirthDisplay(input),
      locationDisplay: formatLocationDisplay(input),
      calculationSource: 'myhora-scrape',
      lagna: lagna ?? undefined,
    },
    planets: scraped.planets,
    chart: lagna ? { lagna, taksa: [] } : undefined,
    myhora: patchMyhoraNatalEmbeds(scraped.tables),
  }
}

/** อัปเดตเฉพาะวันจร — ดึง myhora ใหม่ (กราฟ / ทักษา / ตรีวัยจร) */
export async function refreshMyhoraTransit(
  input: BirthInput,
  transit: TransitInput,
): Promise<AstrologyResult> {
  const scraped = await fetchMyhoraThaiChart(input, { transit })
  return myhoraScrapeToResult(input, scraped)
}

/** โหลดแคช IndexedDB ก่อนคำนวณ — ลองดึง myhora ก่อน (dev + proxy) */
export async function buildRealAstrologyResultAsync(
  input: BirthInput,
): Promise<AstrologyResult> {
  const place = resolvePlaceCoords(input.country, input.province, input.district)

  if (isMyhoraScrapeAvailable()) {
    try {
      const scraped = await fetchMyhoraThaiChart(input, {
        transit: defaultTransitInput(),
      })
      if (isValidMyhoraScrape(scraped)) {
        const lagna = scraped.lagna ?? scraped.tables.lagnaSign!
        await setCachedChart(input, place, {
          planets: Object.fromEntries(
            scraped.planets.map((p) => [p.planet, p.siderealSign]),
          ),
          lagna,
          source: 'myhora-scrape',
        })
        return myhoraScrapeToResult(input, scraped)
      }
      console.warn('[newhora] myhora scrape incomplete, using local lookup/formulas')
    } catch (err) {
      console.warn('[newhora] myhora scrape failed, using local lookup/formulas', err)
    }
  }

  const cached = await getCachedChart(input, place)
  const lookup = lookupSuryayatSync(input, place)

  if (cached && !lookup && cached.source !== 'formula-pipeline') {
    const base = computeFullChartSync(input, place)
    const planets = base.planets.map((p) => ({
      ...p,
      siderealSign: cached.planets[p.planet] ?? p.siderealSign,
    }))
    return toResult(input, {
      ...base,
      planets,
      lagna: cached.lagna,
      source: 'suryayat-cached',
    })
  }

  return buildRealAstrologyResult(input)
}
