/** ดึง path / HTML ส่วนเนื้อหาจาก thai.aspx (ตารางสมผุส, คำทำนาย, ฯลฯ) */

function firstLoadPath(html: string, needle: string): string | null {
  const re = new RegExp(`\\.load\\("(/astrology/thai/${needle}[^"]+)"`, 'i')
  return html.match(re)?.[1] ?? null
}

export interface MyhoraContentPaths {
  chartPlanet: string | null
  astrologyNatal: string | null
  astrologyTransit: string | null
  chartBhava: string | null
  chartRasiAnalysisNatal: string | null
  chartRasi10Luck: string | null
}

/** path โหลดเข้า #astrology_natal (มี query ครบ) */
export function parseAstrologyNatalEmbedPath(html: string): string | null {
  return (
    html.match(/#astrology_natal["']?\)\.load\("([^"]+)"/i)?.[1] ??
    firstLoadPath(html, 'astrology-natal\\.aspx')
  )
}

export function parseMyhoraContentPaths(html: string): MyhoraContentPaths {
  return {
    chartPlanet: firstLoadPath(html, 'chart-planet\\.aspx'),
    astrologyNatal: parseAstrologyNatalEmbedPath(html),
    astrologyTransit: firstLoadPath(html, 'astrology-transit\\.aspx'),
    chartBhava: firstLoadPath(html, 'chart-bhava\\.aspx'),
    chartRasiAnalysisNatal: firstLoadPath(html, 'chart-rasi-analysis-natal\\.aspx'),
    chartRasi10Luck: firstLoadPath(html, 'chart-rasi-10luck\\.aspx'),
  }
}

/** ตารางสมผุสดวงกำเนิด — ฝังใน thai.aspx หลัง POST */
export function extractNatalTableHtml(html: string): string | null {
  const m = html.match(
    /id="natal-table"[^>]*>([\s\S]*?)(?=<div id="astrology_natal")/i,
  )
  const inner = m?.[1]?.trim()
  return inner && inner.length > 50 ? inner : null
}
