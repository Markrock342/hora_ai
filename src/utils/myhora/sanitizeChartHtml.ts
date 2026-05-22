/** ตัด redirect / base ที่ดึง iframe กลับไปหน้าแรกแอป */

export function sanitizeMyhoraChartHtml(html: string): string {
  return html
    .replace(/<meta[^>]*http-equiv\s*=\s*['"]?refresh['"]?[^>]*>/gi, '')
    .replace(/<base[^>]*>/gi, '')
}

export function isMyhoraChartHtml(html: string): boolean {
  if (!html || html.length < 80) return false

  const lower = html.toLowerCase()

  if (lower.includes('id="root"') && lower.includes('newhora')) return false
  if (/คำนวณ\s*ดวงชะตา/i.test(html) && /กรอกข้อมูล/i.test(html) && /ผลดวง/i.test(html)) {
    return false
  }
  if (
    lower.includes('internal error (500)') ||
    lower.includes('not found (404)') ||
    lower.includes('not found or object not found')
  ) {
    return false
  }

  return (
    lower.includes('<svg') ||
    lower.includes('<?xml') ||
    lower.includes('cr-chart') ||
    lower.includes('cbv-chart') ||
    lower.includes('cnt-chart') ||
    lower.includes('chart-rasi') ||
    lower.includes('chart-natal') ||
    lower.includes('<object') ||
    lower.includes('lx-pl-glyph')
  )
}

/** ตรวจว่า iframe same-origin โหลดผิด (เป็น SPA ของเรา หรือถูก redirect ไป /) */
export function isEmbeddedNewHoraApp(doc: Document | null | undefined): boolean {
  if (!doc) return false

  try {
    const path = doc.defaultView?.location?.pathname ?? ''
    if (path === '/' || path === '/index.html') return true
  } catch {
    /* ignore */
  }

  const text = doc.body?.innerText ?? ''
  if (/คำนวณ\s*ดวงชะตา/i.test(text) && /กรอกข้อมูล/i.test(text)) return true
  return Boolean(doc.querySelector('#root'))
}
