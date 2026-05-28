import { chartStyleLinkTags, fetchMyhoraChartStyles } from './fetchMyhoraChartStyles'
import { natalChartOverlayScript } from './natalChartOverlayScript'
import type { NatalChartDisplayOptions } from './natalChartOptions'
import { myhoraEmbedUrl, normalizeMyhoraEmbedPath } from './myhoraProxy'
import { natalWheelBackgroundImage } from './natalWheelBackground'
import { parseNatalSvgChartPath } from './parseNatalChart'
import { fetchMyhoraChartRaw } from './fetchMyhoraChartRaw'
import { rewriteAssetUrls } from './rewriteAssetUrls'
import { prepareMyhoraChartHtml } from './chartHtml'
import { sanitizeMyhoraChartHtml } from './sanitizeChartHtml'

const CHART_LINE_FALLBACK_CSS = `
.lx-pl-glyph { stroke-width: 0.8; stroke: #15c; }
.lx-deg { stroke: #555; stroke-width: 0.3; }
.lx-aspt { stroke-width: 0.9; }
`

const CHROME_CSS = `
html, body { margin: 0; padding: 0; background: #fff; overflow: hidden; }
.print-btn, .cr-tool-export, .cbv-tool-export, .cnt-tool-export,
.cr-info, .cbv-info, .cnt-info { display: none !important; }
svg { display: block; margin: 0 auto; max-width: 100%; height: auto; }
.myhora-natal-chart-stage {
  position: relative;
  width: 900px;
  height: 900px;
  max-width: 100%;
  margin: 0 auto;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 900px 900px;
}
.myhora-natal-chart-stage > svg {
  position: relative;
  z-index: 2;
  display: block;
  margin: 0 auto;
  width: 900px;
  height: 900px;
}
.myhora-natal-chart-stage .cn-chart {
  position: relative;
  width: 900px;
  height: 900px;
  margin: 0;
  background: none !important;
}
.myhora-natal-chart-stage .cn-chart object {
  position: absolute;
  left: 0;
  top: 0;
  width: 900px;
  height: 900px;
  z-index: 3;
  pointer-events: none;
}
.myhora-natal-chart-stage .cn-nsign,
.myhora-natal-chart-stage .cn-tsign {
  z-index: 1;
}
/* ซ่อนดาวจร (เลขเดี่ยวอารบิกวงนอก) ในวงจักรดาวกำเนิด */
.myhora-natal-chart-stage.myhora-natal-chart-stage--natal-only .cn-tsign {
  display: none !important;
}
/* ซ่อนดาวพื้นดวง (เลขไทยวงใน) ในวงจักรดวงจร */
.myhora-natal-chart-stage.myhora-natal-chart-stage--transit-only .cn-nsign {
  display: none !important;
}
`

function isNatalChartPath(embedPath: string): boolean {
  const base = normalizeMyhoraEmbedPath(embedPath).split('?')[0] ?? ''
  return /chart-rasi-analysis-natal\.aspx$/i.test(base) || /chart-natal\.aspx$/i.test(base)
}

/** CSS จัดตำแหน่งเรือน/ราศี — อยู่ก่อน cn-chart ใน chart-rasi-analysis-natal */
function extractAnalysisLayoutStyles(html: string): string {
  return html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)?.[1]?.trim() ?? ''
}

function extractCnChartMarkup(html: string): string | null {
  const re = /<div[^>]*class=['"][^'"]*\bcn-chart\b[^'"]*['"][^>]*>/i
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

function wrapNatalChartBody(body: string, opts?: NatalChartDisplayOptions): string {
  const bg = natalWheelBackgroundImage(opts?.aspectLines ?? false)
  let extraClass = '';
  if (opts?.isTransitOnly !== undefined) {
    extraClass = opts.isTransitOnly 
      ? ' myhora-natal-chart-stage--transit-only'
      : ' myhora-natal-chart-stage--natal-only';
  }
  return `<div class="myhora-natal-chart-stage${extraClass}" style="background-image:${bg};">${body}</div>`
}

function isSvgMarkup(html: string): boolean {
  return /<svg[\s>]/i.test(html)
}

/**
 * ห่อ HTML/SVG กราฟ myhora เป็นเอกสารเต็ม — ฉีด CSS glyph เพื่อให้วงจักร (lx-pl-glyph) แสดงครบ
 */
export async function buildChartIframeDocument(
  raw: string,
  embedPath: string,
  displayOpts?: NatalChartDisplayOptions,
): Promise<string> {
  let content = raw
  let basePath = embedPath
  let analysisRaw = !isSvgMarkup(raw) ? raw : null

  const natal = isNatalChartPath(embedPath)
  const analysisCnChart = analysisRaw ? extractCnChartMarkup(analysisRaw) : null

  if (analysisCnChart) {
    content = analysisCnChart
    basePath = embedPath
  } else if (!isSvgMarkup(raw)) {
    const svgPath = parseNatalSvgChartPath(raw)
    if (svgPath) {
      const svgRaw = await fetchMyhoraChartRaw(svgPath)
      if (svgRaw) {
        content = svgRaw
        basePath = svgPath
      }
    }
  }

  const baseHref = myhoraEmbedUrl(basePath)
  const svg = isSvgMarkup(content)
  const useNatalWheel = natal || Boolean(analysisCnChart)

  let cleaned = sanitizeMyhoraChartHtml(content)
  if (svg) {
    cleaned = cleaned.replace(/@import[^;]+;/gi, '')
  }

  const chartStyles = svg ? await fetchMyhoraChartStyles() : ''
  const styleLinks = svg ? chartStyleLinkTags() : ''
  const analysisLayoutCss = analysisRaw ? extractAnalysisLayoutStyles(analysisRaw) : ''

  const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  const headStyles = [...cleaned.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((m) => m[1])
    .join('\n')
  const headLinks = [...cleaned.matchAll(/<link[^>]*>/gi)].map((m) => m[0]).join('\n')
  const inlineScripts = [...cleaned.matchAll(/<script[^>]*>[\s\S]*?<\/script>/gi)].map((m) => m[0])

  let body = bodyMatch?.[1] ?? cleaned
  if (!natal && !svg && !analysisCnChart) {
    body = prepareMyhoraChartHtml(raw)
  } else {
    body = rewriteAssetUrls(body)
    if (useNatalWheel) {
      body = wrapNatalChartBody(body, displayOpts)
    }
  }

  const lineFallback = svg || analysisCnChart ? CHART_LINE_FALLBACK_CSS : ''
  const overlayScript =
    analysisCnChart && displayOpts ? natalChartOverlayScript(displayOpts) : ''
  const scripts = inlineScripts.join('\n')

  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="utf-8" />
<base href="${baseHref}" />
${styleLinks}
${headLinks}
<style>${analysisLayoutCss}\n${chartStyles}\n${headStyles}\n${lineFallback}\n${CHROME_CSS}</style>
</head>
<body>${body}</body>
${scripts}
${overlayScript}
</html>`
}

export function chartDocumentBlobUrl(doc: string): string {
  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' })
  return URL.createObjectURL(blob)
}
