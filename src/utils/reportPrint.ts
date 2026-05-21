import { MYHORA_CHART_PRINT_CSS } from './myhora/chartHtml'

const CHART_PRINT_STYLE_ID = 'hora-chart-print-overrides'

function removeChartPrintOverrides(): void {
  document.getElementById(CHART_PRINT_STYLE_ID)?.remove()
  document.querySelectorAll<HTMLIFrameElement>('iframe.myhora-embed-iframe').forEach((iframe) => {
    try {
      iframe.contentDocument?.getElementById(CHART_PRINT_STYLE_ID)?.remove()
    } catch {
      /* cross-origin */
    }
  })
  document.querySelectorAll('.myhora-chart-html-shadow').forEach((host) => {
    const root = (host as HTMLElement & { shadowRoot?: ShadowRoot }).shadowRoot
    root?.getElementById(CHART_PRINT_STYLE_ID)?.remove()
  })
}

function injectChartPrintOverrides(target: HTMLElement): void {
  target.querySelectorAll('.myhora-chart-html-shadow').forEach((host) => {
    const root = (host as HTMLElement & { shadowRoot?: ShadowRoot }).shadowRoot
    if (!root || root.getElementById(CHART_PRINT_STYLE_ID)) return
    const style = document.createElement('style')
    style.id = CHART_PRINT_STYLE_ID
    style.textContent = MYHORA_CHART_PRINT_CSS
    root.appendChild(style)
  })

  target.querySelectorAll('iframe.myhora-embed-iframe').forEach((iframe) => {
    try {
      const doc = (iframe as HTMLIFrameElement).contentDocument
      if (!doc || doc.getElementById(CHART_PRINT_STYLE_ID)) return
      const style = doc.createElement('style')
      style.id = CHART_PRINT_STYLE_ID
      style.textContent = MYHORA_CHART_PRINT_CSS
      doc.head.appendChild(style)
    } catch {
      /* cross-origin */
    }
  })
}

export function clearReportPrintState(): void {
  document.body.classList.remove('is-printing-report')
  removeChartPrintOverrides()
}

/** เตรียมก่อนพิมพ์รายงาน — ซ่อน UI กราฟ + เปิดโหมดขาวดำ */
export function prepareReportPrint(): void {
  clearReportPrintState()
  document.body.classList.add('is-printing-report')
  const report = document.getElementById('astrology-report')
  if (report) injectChartPrintOverrides(report)
}
