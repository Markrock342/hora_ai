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

/** โหลดแคช IndexedDB ก่อนคำนวณ */
export async function buildRealAstrologyResultAsync(
  input: BirthInput,
): Promise<AstrologyResult> {
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
