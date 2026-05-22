import { isAllowedMyhoraChartPath, myhoraProxyUrl } from './myhoraProxy'
import { isMyhoraChartHtml } from './sanitizeChartHtml'

const FETCH_MS = 20000

/** ดึง HTML/SVG กราฟ myhora ดิบ */
export async function fetchMyhoraChartRaw(embedPath: string): Promise<string | null> {
  if (!isAllowedMyhoraChartPath(embedPath)) return null

  const url = myhoraProxyUrl(embedPath)
  if (!url) return null

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'NewHora/1.0' },
      signal: AbortSignal.timeout(FETCH_MS),
    })
    if (!res.ok) return null
    const raw = await res.text()
    if (!isMyhoraChartHtml(raw)) return null
    return raw.length > 80 ? raw : null
  } catch {
    return null
  }
}
