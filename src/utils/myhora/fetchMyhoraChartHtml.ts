import { getMyhoraOrigin, isAllowedMyhoraChartPath } from './myhoraProxy'
import { prepareMyhoraChartHtml } from './chartHtml'

export async function fetchMyhoraChartHtml(embedPath: string): Promise<string | null> {
  if (!isAllowedMyhoraChartPath(embedPath)) return null
  const origin = getMyhoraOrigin()
  const path = embedPath.startsWith('/') ? embedPath : `/${embedPath}`
  const url = origin.startsWith('http') ? `${origin}${path}` : `${origin}${path}`
  const res = await fetch(url, { headers: { 'User-Agent': 'NewHora/1.0' } })
  if (!res.ok) return null
  const raw = await res.text()
  const prepared = prepareMyhoraChartHtml(raw)
  return prepared.length > 80 ? prepared : null
}
