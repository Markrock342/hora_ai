/** Base URL สำหรับ proxy ไป myhora (dev: /api/myhora, prod: env หรือ myhora.com) */

export function getMyhoraOrigin(): string {
  return (
    import.meta.env.VITE_MYHORA_ORIGIN ??
    (import.meta.env.DEV ? '/api/myhora' : 'https://myhora.com')
  )
}

/** แปลง path จาก thai.aspx เป็น URL ที่โหลดใน iframe ได้ */
export function myhoraEmbedUrl(embedPath: string): string {
  const path = embedPath.startsWith('/') ? embedPath : `/${embedPath}`
  const origin = getMyhoraOrigin()
  if (origin.startsWith('http')) return `${origin}${path}`
  return `${origin}${path}`
}

const ALLOWED_EMBED = /^\/astrology\/thai\/(?:chart-(?:rasi|taksa|triwai|rasi-navang-triyang|planet|bhava|rasi-analysis-natal|rasi-10luck)|astrology-(?:natal|transit))\.aspx$/i

/** path ต้องเป็นหน้า embed ของ myhora เท่านั้น */
export function isAllowedMyhoraChartPath(path: string): boolean {
  const base = path.split('?')[0] ?? ''
  return ALLOWED_EMBED.test(base)
}
