import type { AstrologyResult, PlanetSignRow } from '../types/astrology'
import { RasiChakraChart } from './RasiChakraChart'

interface DivisionalChakraChartProps {
  result: AstrologyResult
  title: string
  subtitle?: string
  planets: PlanetSignRow[]
  lagna: string
}

/** วงราศีจักรสำหรับนวางศ์ / ตรียางศ์ — ใช้ SVG เดียวกับราศีจักร */
export function DivisionalChakraChart({
  result,
  title,
  subtitle,
  planets,
  lagna,
}: DivisionalChakraChartProps) {
  const chartResult: AstrologyResult = {
    ...result,
    planets,
    chart: { lagna, taksa: [] },
    meta: { ...result.meta, lagna },
  }
  return (
    <RasiChakraChart result={chartResult} title={title} subtitle={subtitle} />
  )
}
