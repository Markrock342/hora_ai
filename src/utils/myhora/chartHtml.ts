import { rewriteAssetUrls } from './rewriteAssetUrls'

const CHART_ROOT_CLASSES = ['cr-chart', 'cbv-chart', 'cnt-chart'] as const

/** ซ่อนเฉพาะปุ่ม export/พิมพ์ — คง checkbox ดวงจร·เกษตร·นวางศ์ */
export const MYHORA_CHART_CHROME_CSS = `
.print-btn,
.cr-tool-export, .cbv-tool-export, .cnt-tool-export,
.cr-info, .cbv-info, .cnt-info { display: none !important; }
`

function extractInlineStyles(raw: string): string {
  return [...raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((m) => m[1])
    .join('\n')
}

function extractDivByClass(html: string, className: string): string | null {
  const re = new RegExp(
    `<div[^>]*class=['"][^'"]*\\b${className}\\b[^'"]*['"][^>]*>`,
    'i',
  )
  const m = html.match(re)
  if (m?.index == null) return null
  let i = m.index
  let depth = 0
  const tagRe = /<div\b|<\/div>/gi
  tagRe.lastIndex = i
  let match: RegExpExecArray | null
  while ((match = tagRe.exec(html))) {
    if (match[0].toLowerCase() === '<div') depth++
    else depth--
    if (depth === 0) return html.slice(i, tagRe.lastIndex)
  }
  return null
}

/** ดึง div กราฟหลัก (ราศีจักร / เรือนลัคนา / นวางศ์·ตรียางศ์) */
function extractEmbedControls(raw: string): string {
  const blocks: string[] = []
  for (const cls of ['cnt-set-embed', 'cr-set-embed', 'cbv-set-embed']) {
    const m = raw.match(
      new RegExp(`<div[^>]*class=['"][^'"]*\\b${cls}\\b[^'"]*['"][^>]*>[\\s\\S]*?</div>`, 'i'),
    )?.[0]
    if (m) blocks.push(m)
  }
  return blocks.join('\n')
}

function extractChartMarkup(raw: string): string | null {
  const controls = extractEmbedControls(raw)
  for (const cls of CHART_ROOT_CLASSES) {
    const block = extractDivByClass(raw, cls)
    if (block) return controls ? `${controls}\n${block}` : block
  }

  const cnt = raw.match(
    /<div[^>]*class="[^"]*cnt-chart[^"]*"[^>]*>[\s\S]*?<\/div>\s*(?=<\/center>|<\/body>|$)/i,
  )?.[0]
  if (cnt) return cnt

  const center = raw.match(/<center[^>]*>([\s\S]*?)<\/center>/i)?.[1]
  if (center?.includes('background-image')) return center.trim()

  return null
}

/**
 * เตรียม HTML กราฟ myhora สำหรับ Shadow DOM / dangerouslySetInnerHTML
 * — คง CSS ตำแหน่งดาว, ตัด script/form, ซ่อนเครื่องมือ embed
 */
export function prepareMyhoraChartHtml(raw: string): string {
  const styles = extractInlineStyles(raw)
  let markup = extractChartMarkup(raw) ?? ''
  markup = markup.replace(/<script[\s\S]*?<\/script>/gi, '')
  markup = rewriteAssetUrls(markup)

  const styleBlock = styles
    ? `<style>${styles}\n${MYHORA_CHART_CHROME_CSS}</style>`
    : `<style>${MYHORA_CHART_CHROME_CSS}</style>`

  return `${styleBlock}${markup}`.trim()
}
