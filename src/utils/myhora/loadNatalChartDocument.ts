import { buildChartIframeDocument, chartDocumentBlobUrl } from './buildChartIframeDocument'
import type { NatalChartDisplayOptions } from './natalChartOptions'
import { fetchMyhoraChartRaw } from './fetchMyhoraChartRaw'
import { isAllowedMyhoraChartPath, normalizeMyhoraEmbedPath } from './myhoraProxy'
import { parseNatalSvgChartPath } from './parseNatalChart'

function isSvgMarkup(html: string): boolean {
  return /<svg[\s>]/i.test(html)
}

/** โหลดกราฟ natal เป็น blob URL — ดึง SVG + ฉีด CSS glyph */
export async function loadNatalChartBlobUrl(
  embedPath: string,
  displayOpts?: NatalChartDisplayOptions,
): Promise<string | null> {
  if (!isAllowedMyhoraChartPath(embedPath)) return null

  let raw = await fetchMyhoraChartRaw(embedPath)
  let basePath = embedPath

  const pathBase = normalizeMyhoraEmbedPath(embedPath).split('?')[0] ?? ''
  const isNatalAnalysis = /chart-rasi-analysis-natal\.aspx$/i.test(pathBase)

  if (raw && !isSvgMarkup(raw) && !isNatalAnalysis) {
    const svgPath = parseNatalSvgChartPath(raw)
    if (svgPath) {
      const svgRaw = await fetchMyhoraChartRaw(svgPath)
      if (svgRaw) {
        raw = svgRaw
        basePath = svgPath
      }
    }
  }

  if (!raw) return null

  try {
    const doc = await buildChartIframeDocument(raw, basePath, displayOpts)
    return chartDocumentBlobUrl(doc)
  } catch {
    return null
  }
}
