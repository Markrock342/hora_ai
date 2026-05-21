import type { BirthInput } from '../../types/astrology'
import type { PlaceCoords } from '../../data/placeCoordinates'
import type { MyhoraDateDetail, MyhoraDateLine } from '../myhora/parseDateDetail'
import { formatBirthDisplay, formatLocationDisplay } from '../dateTimeUtils'

function line(type: MyhoraDateLine['type'], text: string): MyhoraDateLine {
  return { type, text }
}

export function buildLocalNatalDetail(
  input: BirthInput,
  place: PlaceCoords,
  extras?: { lagna?: string; navamsaLagna?: string; drekkanaLagna?: string },
): MyhoraDateDetail {
  const utc =
    place.utcOffsetMinutes >= 0
      ? `+${(place.utcOffsetMinutes / 60).toFixed(2)}`
      : String(place.utcOffsetMinutes / 60)

  const lines: MyhoraDateLine[] = [
    line('date', formatBirthDisplay(input)),
    line('place', formatLocationDisplay(input)),
    line('coords', `Lat ${place.lat.toFixed(6)}° · Long ${place.lon.toFixed(6)}° · UTC ${utc}`),
  ]

  if (extras?.lagna) {
    const parts = [`ลัคนา ${extras.lagna}`]
    if (extras.navamsaLagna) parts.push(`นวางศ์ ${extras.navamsaLagna}`)
    if (extras.drekkanaLagna) parts.push(`ตรียางศ์ ${extras.drekkanaLagna}`)
    lines.push(line('lagna', parts.join(' · ')))
  }

  return { title: 'วันเกิด', lines, raw: lines.map((l) => l.text).join(' ') }
}

export function buildLocalTransitDetail(
  transit: { day: number; month: number; year: number; time: string },
  birthPlace: BirthInput,
  place: PlaceCoords,
): MyhoraDateDetail {
  const fakeInput: BirthInput = {
    ...birthPlace,
    day: transit.day,
    month: transit.month,
    year: transit.year,
    time: transit.time,
  }
  const lines: MyhoraDateLine[] = [
    line('date', formatBirthDisplay(fakeInput)),
    line('place', formatLocationDisplay(birthPlace)),
    line(
      'coords',
      `Lat ${place.lat.toFixed(6)}° · Long ${place.lon.toFixed(6)}° (สถานที่เกิด)`,
    ),
  ]
  return { title: 'วันจร', lines, raw: lines.map((l) => l.text).join(' ') }
}
