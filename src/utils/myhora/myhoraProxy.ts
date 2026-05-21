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

/** path ต้องเป็นกราฟ myhora เท่านั้น */
export function isAllowedMyhoraChartPath(path: string): boolean {
  return /^\/astrology\/thai\/chart-(rasi|taksa|triwai|rasi-navang-triyang)\.aspx/i.test(
    path.split('?')[0] ?? '',
  )
}
