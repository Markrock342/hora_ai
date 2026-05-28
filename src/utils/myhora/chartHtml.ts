import { rewriteAssetUrls } from './rewriteAssetUrls'

const CHART_ROOT_CLASSES = ['cr-chart', 'cbv-chart', 'cnt-chart'] as const

/** ซ่อนเฉพาะปุ่ม export/พิมพ์ — คง checkbox ดวงจร·เกษตร·นวางศ์ */
export const MYHORA_CHART_CHROME_CSS = `
.print-btn,
.cr-tool-export, .cbv-tool-export, .cnt-tool-export,
.cr-info, .cbv-info, .cnt-info { display: none !important; }

/* ทำให้ตัวหนังสือองศาตรงกลาง (เช่น 16 องศา 8) เป็นสีดำเข้มชัดเจน */
.cr-deg, .cbv-deg, .cnt-deg, .lx-deg, text[class*="deg"] {
  fill: #000000 !important;
  color: #000000 !important;
  font-weight: bold !important;
  opacity: 1 !important;
}

/* แยกวงจักร: เมื่อระบุว่าต้องการซ่อนดาวจร (เลขอารบิกวงนอก) ในวงดาวกำเนิด */
.myhora-chart-rasi-stage--natal-only .cr-tsign,
.myhora-chart-section--chart-only.myhora-chart-rasi-stage--natal-only .cr-tsign,
.myhora-chart-html-shadow.myhora-chart-rasi-stage--natal-only .cr-tsign {
  display: none !important;
}
/* แยกวงจักร: เมื่อระบุว่าต้องการซ่อนดาวพื้นดวง (เลขไทยวงใน) ในวงดาวจร */
.myhora-chart-rasi-stage--transit-only .cr-nsign,
.myhora-chart-section--chart-only.myhora-chart-rasi-stage--transit-only .cr-nsign,
.myhora-chart-html-shadow.myhora-chart-rasi-stage--transit-only .cr-nsign {
  display: none !important;
}
`

/** ตอนพิมพ์ PDF — ซ่อนแถบ checkbox ในกราฟ */
export const MYHORA_CHART_PRINT_CSS = `
${MYHORA_CHART_CHROME_CSS}
.cnt-set-embed, .cr-set-embed, .cbv-set-embed { display: none !important; }
`

export const MYHORA_CHART_FIT_STAGE_CSS = `
.myhora-chart-fit-stage {
  position: relative;
  margin: 0 auto;
  overflow: hidden;
}
.myhora-chart-fit-stage--rasi {
  width: 500px;
  height: 450px;
}
.myhora-chart-fit-stage--divisional {
  width: 325px;
  height: 325px;
}
.myhora-chart-fit-stage .cr-chart,
.myhora-chart-fit-stage .cbv-chart,
.myhora-chart-fit-stage .cnt-chart {
  margin: 0 auto;
}
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
/** checkbox / select มุมซ้ายบน (ราศีจักร) */
function extractCrControls(raw: string): string {
  const parts: string[] = []
  const re = /<div\s+class="((?:cb-cr|dd-cr|tx-cr)[^"]*)"[^>]*>[\s\S]*?<\/div>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(raw))) parts.push(m[0])
  return parts.join('\n')
}

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
function wrapChartStage(markup: string, raw: string): string {
  if (!markup) return ''
  const isDivisional = /\bcnt-chart\b/.test(markup)
  const stageClass = isDivisional
    ? 'myhora-chart-fit-stage myhora-chart-fit-stage--divisional'
    : 'myhora-chart-fit-stage myhora-chart-fit-stage--rasi'
  const controls = isDivisional ? '' : extractCrControls(raw)
  return `<div class="${stageClass}">${controls}${markup}</div>`
}

export function prepareMyhoraChartHtml(raw: string): string {
  const styles = extractInlineStyles(raw)
  let markup = extractChartMarkup(raw) ?? ''
  markup = markup.replace(/<script[\s\S]*?<\/script>/gi, '')
  markup = rewriteAssetUrls(markup)
  markup = wrapChartStage(markup, raw)

  const styleBlock = styles
    ? `<style>${styles}\n${MYHORA_CHART_CHROME_CSS}\n${MYHORA_CHART_FIT_STAGE_CSS}</style>`
    : `<style>${MYHORA_CHART_CHROME_CSS}\n${MYHORA_CHART_FIT_STAGE_CSS}</style>`

  return `${styleBlock}${markup}`.trim()
}
