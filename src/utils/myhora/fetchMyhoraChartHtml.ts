import { isAllowedMyhoraChartPath, myhoraEmbedUrl } from './myhoraProxy'
import { prepareMyhoraChartHtml } from './chartHtml'
import { isMyhoraChartHtml } from './sanitizeChartHtml'

export async function fetchMyhoraChartHtml(embedPath: string): Promise<string | null> {
  if (!isAllowedMyhoraChartPath(embedPath)) return null
  const url = myhoraEmbedUrl(embedPath)
  if (!url) return null
  const res = await fetch(url, { headers: { 'User-Agent': 'NewHora/1.0' } })
  if (!res.ok) return null
  const raw = await res.text()
  if (!isMyhoraChartHtml(raw)) return null
  const prepared = prepareMyhoraChartHtml(raw)
  return prepared.length > 80 ? prepared : null
}
