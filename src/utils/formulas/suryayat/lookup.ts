import type { BirthInput } from '../../../types/astrology'
import type { PlaceCoords } from '../../../data/placeCoordinates'
import { PLANETS } from '../../../data/astrologyConstants'
import type {
  SuryayatDayEntry,
  SuryayatPlanetSigns,
  SuryayatYearFile,
} from '../../../data/suryayat100/types'
import { SURIYAYAT_REFERENCE_BY_KEY } from '../../../data/suryayat100/referenceCharts'
import { buddhistYear, suryayatCalendarKey, suryayatDayKey } from './calendarKey'

const yearFiles = import.meta.glob<{ default: SuryayatYearFile }>(
  '../../../data/suryayat100/years/*.json',
  { eager: true },
)

const yearByBe = new Map<number, SuryayatYearFile>()
for (const path of Object.keys(yearFiles)) {
  const match = path.match(/(\d{4})\.json$/)
  if (!match) continue
  const file = yearFiles[path].default ?? (yearFiles[path] as unknown as SuryayatYearFile)
  yearByBe.set(Number(match[1]), file)
}

function normalizeSigns(raw: SuryayatPlanetSigns): SuryayatPlanetSigns | null {
  const out: SuryayatPlanetSigns = {}
  for (const planet of PLANETS) {
    const sign = raw[planet]
    if (!sign) return null
    out[planet] = sign
  }
  return out
}

function entryToSigns(entry: SuryayatDayEntry): SuryayatPlanetSigns | null {
  return normalizeSigns(entry.planets)
}

export function lookupReferenceChart(
  input: BirthInput,
  place: PlaceCoords,
): SuryayatPlanetSigns | null {
  const key = suryayatCalendarKey(input, place)
  const raw = SURIYAYAT_REFERENCE_BY_KEY[key]
  return raw ? normalizeSigns(raw.planets) : null
}

export function lookupReferenceLagna(
  input: BirthInput,
  place: PlaceCoords,
): string | null {
  const key = suryayatCalendarKey(input, place)
  return SURIYAYAT_REFERENCE_BY_KEY[key]?.lagna ?? null
}

export function lookupSuryayatSync(
  input: BirthInput,
  place: PlaceCoords,
): { signs: SuryayatPlanetSigns; source: 'reference' | 'year-file' } | null {
  const ref = lookupReferenceChart(input, place)
  if (ref) return { signs: ref, source: 'reference' }

  const yearFile = yearByBe.get(buddhistYear(input.year))
  if (yearFile?.days) {
    const withTime = suryayatDayKey(input, true)
    const dayOnly = suryayatDayKey(input, false)
    const entry = yearFile.days[withTime] ?? yearFile.days[dayOnly]
    if (entry) {
      const signs = entryToSigns(entry)
      if (signs) return { signs, source: 'year-file' }
    }
  }

  return null
}

/** ลัคนาจากปฏิทินร้อยปี / ชุดอ้างอิง */
export function lookupLagnaSync(
  input: BirthInput,
  place: PlaceCoords,
): string | null {
  const ref = lookupReferenceLagna(input, place)
  if (ref) return ref

  const yearFile = yearByBe.get(buddhistYear(input.year))
  if (!yearFile?.days) return null
  const withTime = suryayatDayKey(input, true)
  const dayOnly = suryayatDayKey(input, false)
  const entry = yearFile.days[withTime] ?? yearFile.days[dayOnly]
  return entry?.lagna ?? null
}
