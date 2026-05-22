/** Base URL สำหรับ proxy ไป myhora (dev: /api/myhora, prod: env หรือ myhora.com) */

export function getMyhoraOrigin(): string {
  return (
    import.meta.env.VITE_MYHORA_ORIGIN ??
    (import.meta.env.DEV ? '/api/myhora' : 'https://myhora.com')
  )
}

/** แปลง path จาก scrape → pathname + query (ห้ามมี host) */
export function normalizeMyhoraEmbedPath(embedPath: string): string {
  const trimmed = embedPath.trim()
  if (!trimmed) return ''

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed)
      return u.pathname + u.search
    } catch {
      return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
    }
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

/** URL ผ่าน proxy สำหรับ fetch / iframe (absolute บน browser) */
export function myhoraProxyUrl(path: string): string {
  const normalized = normalizeMyhoraEmbedPath(path)
  if (!normalized) return ''

  const origin = getMyhoraOrigin()
  if (origin.startsWith('http')) {
    return `${origin.replace(/\/$/, '')}${normalized}`
  }

  if (typeof window !== 'undefined') {
    const prefix = origin.startsWith('/') ? origin : `/${origin}`
    return `${window.location.origin}${prefix}${normalized}`
  }

  return `${origin}${normalized}`
}

/** URL สำหรับ iframe กราฟ (ต้องผ่าน allowlist) */
export function myhoraEmbedUrl(embedPath: string): string {
  if (!isAllowedMyhoraChartPath(embedPath)) return ''
  return myhoraProxyUrl(embedPath)
}

const ALLOWED_THAI_CHART =
  /^\/astrology\/thai\/(?:chart-(?:rasi|taksa|triwai|rasi-navang-triyang|planet|bhava|rasi-analysis-natal|rasi-10luck|analysis-natal)|astrology-(?:natal|transit))\.aspx$/i

const ALLOWED_NATAL_SVG = /^\/astrology\/thai\/images\/chart-natal\.aspx$/i

/** path ต้องเป็นหน้า embed ของ myhora เท่านั้น */
export function isAllowedMyhoraChartPath(path: string): boolean {
  const base = normalizeMyhoraEmbedPath(path).split('?')[0] ?? ''
  return ALLOWED_THAI_CHART.test(base) || ALLOWED_NATAL_SVG.test(base)
}

/** asset บน myhora.net (ฟอนต์ glyph, รูปทักษา ฯลฯ) */
export function myhoraNetProxyUrl(path: string): string {
  const normalized = normalizeMyhoraEmbedPath(path)
  if (!normalized) return ''

  const net =
    import.meta.env.VITE_MYHORA_NET_ORIGIN ??
    (import.meta.env.DEV || import.meta.env.VITE_MYHORA_ORIGIN
      ? '/api/myhora-net'
      : 'https://myhora.net')

  if (net.startsWith('http')) {
    return `${net.replace(/\/$/, '')}${normalized}`
  }

  if (typeof window !== 'undefined') {
    const prefix = net.startsWith('/') ? net : `/${net}`
    return `${window.location.origin}${prefix}${normalized}`
  }

  return `${net}${normalized}`
}
