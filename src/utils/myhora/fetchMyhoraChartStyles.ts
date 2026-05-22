import { myhoraNetProxyUrl } from './myhoraProxy'

const GLYPH_STYLE = '/include/fonts/glyph/style.min.css'
const SARABUN_STYLE = '/include/fonts/sarabun/style.min.css'
const FETCH_MS = 8000

function rewriteCssUrls(css: string, cssPath: string): string {
  const dir = cssPath.slice(0, cssPath.lastIndexOf('/') + 1)
  return css.replace(
    /url\(\s*(['"]?)(?!https?:|\/\/|data:)([^'")]+)\1\s*\)/gi,
    (_match, quote: string, rel: string) => {
      const asset = rel.startsWith('/') ? rel : `${dir}${rel}`
      return `url(${quote}${myhoraNetProxyUrl(asset)}${quote})`
    },
  )
}

async function fetchCss(path: string): Promise<string> {
  const url = myhoraNetProxyUrl(path)
  if (!url) return ''
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'NewHora/1.0' },
      signal: AbortSignal.timeout(FETCH_MS),
    })
    if (!res.ok) return ''
    const css = await res.text()
    return rewriteCssUrls(css, path)
  } catch {
    return ''
  }
}

/** CSS วงกลม lx-pl-glyph + ฟอนต์ไทย */
export async function fetchMyhoraChartStyles(): Promise<string> {
  try {
    const [glyph, sarabun] = await Promise.all([fetchCss(GLYPH_STYLE), fetchCss(SARABUN_STYLE)])
    return [glyph, sarabun].filter(Boolean).join('\n')
  } catch {
    return ''
  }
}

export function chartStyleLinkTags(): string {
  const glyph = myhoraNetProxyUrl(GLYPH_STYLE)
  const sarabun = myhoraNetProxyUrl(SARABUN_STYLE)
  if (!glyph || !sarabun) return ''
  return `<link rel="stylesheet" href="${glyph}" />\n<link rel="stylesheet" href="${sarabun}" />`
}
