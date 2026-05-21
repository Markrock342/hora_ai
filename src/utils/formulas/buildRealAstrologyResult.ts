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
import type { TransitInput } from '../../types/transit'
import { defaultTransitInput } from '../../types/transit'
import { computeFullChartSync } from './pipeline'
import { lookupSuryayatSync } from './suryayat/lookup'

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
    myhora: scraped.tables,
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
  if (isMyhoraScrapeAvailable()) {
    try {
      const scraped = await fetchMyhoraThaiChart(input, {
        transit: defaultTransitInput(),
      })
      return myhoraScrapeToResult(input, scraped)
    } catch (err) {
      console.warn('[newhora] myhora scrape failed, using local formulas', err)
    }
  }

  const place = resolvePlaceCoords(input.country, input.province, input.district)
  const cached = await getCachedChart(input, place)
  const lookup = lookupSuryayatSync(input, place)

  if (cached && !lookup) {
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

  const result = buildRealAstrologyResult(input)
  if (result.meta.calculationSource === 'formula-pipeline' && result.chart?.lagna) {
    await setCachedChart(input, place, {
      planets: Object.fromEntries(
        result.planets.map((p) => [p.planet, p.siderealSign]),
      ),
      lagna: result.chart.lagna,
      source: 'formula-pipeline',
    })
  }
  return result
}
