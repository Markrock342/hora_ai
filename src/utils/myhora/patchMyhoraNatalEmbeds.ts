import type { MyhoraChartEmbeds, MyhoraTables } from '../../types/myhora'

/** เติม path ดวงจักรกำเนิดจาก contentEmbeds เมื่อ chartEmbeds เก่า (session ก่อนมี natal) */
export function patchMyhoraNatalEmbeds(tables: MyhoraTables): MyhoraTables {
  const embeds = tables.chartEmbeds
  if (!embeds) return tables
  if (embeds.natalAnalysis || embeds.natalSvg) return tables

  const fallback = tables.contentEmbeds?.chartRasiAnalysisNatal ?? null
  if (!fallback) return tables

  return {
    ...tables,
    chartEmbeds: {
      ...embeds,
      natalAnalysis: fallback,
    },
  }
}

export function resolveNatalChartPaths(
  charts: MyhoraChartEmbeds,
  natalAnalysisFallback?: string | null,
): { analysis: string | null; svg: string | null } {
  return {
    analysis: charts.natalAnalysis ?? natalAnalysisFallback ?? null,
    svg: charts.natalSvg ?? null,
  }
}
