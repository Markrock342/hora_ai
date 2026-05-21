import { rewriteAssetUrls } from './rewriteAssetUrls'

/** ตัดโฆษณา / รูปช่วยที่มักทับตาราง */
function stripMyhoraChrome(html: string): string {
  return html
    .replace(/<img[^>]*help-slide[^>]*\/?>/gi, '')
    .replace(/<center[^>]*class="content-ads"[\s\S]*?<\/center>/gi, '')
}

/**
 * แปลง form → div (เนื้อหาคำทำนาย myhora อยู่ใน form — ห้ามลบทั้งก้อน)
 */
function unwrapForms(html: string): string {
  return html
    .replace(/<form\b[^>]*>/gi, '<div class="myhora-form-body">')
    .replace(/<\/form>/gi, '</div>')
    .replace(/<input\b[^>]*>/gi, '')
}

/**
 * HTML จาก myhora (ตารางสมผุส / คำทำนาย) — ตัด script ชี้ asset ผ่าน proxy
 */
/** เปิดบล็อกที่ถูกซ่อน + ลิงก์ javascript "แสดง…" (ใช้กับคำทำนาย) */
export function expandMyhoraInteractiveHtml(html: string): string {
  let out = html

  out = out.replace(/<div(\s[^>]*)>/gi, (full, attrs) => {
    if (!/display\s*:\s*none/i.test(attrs)) return full
    if (/content-ads|print-hide|tool-export|loading-status|cb_/i.test(attrs)) return full
    const next = attrs
      .replace(/display\s*:\s*none\s*;?/gi, '')
      .replace(/;\s*;/g, ';')
      .replace(/\sstyle="\s*"/i, '')
    return `<div${next}>`
  })

  out = out.replace(
    /<div(\s[^>]*)>/gi,
    (full, attrs) => {
      if (!/overflow\s*:\s*hidden/i.test(attrs) || !/height\s*:/i.test(attrs)) return full
      const next = attrs
        .replace(/overflow\s*:\s*hidden\s*;?/gi, 'overflow:visible;')
        .replace(/height\s*:\s*[^;"']+;?/gi, '')
      return `<div${next}>`
    },
  )

  return out
}

/** ตัดพื้นขาว/ตัวอักษรสีอ่อนจาก inline style ของตารางสมผุส */
function stripSamrapLightInlineStyles(html: string): string {
  let out = html
  out = out.replace(/\sbgcolor="[^"]*"/gi, '')
  out = out.replace(/\sbackground="[^"]*"/gi, '')
  out = out.replace(/<style[\s\S]*?<\/style>/gi, '')

  out = out.replace(/style="([^"]*)"/gi, (_full, styleContent: string) => {
    let s = styleContent
    s = s.replace(/background(?:-color)?\s*:\s*[^;]+;?/gi, '')
    s = s.replace(/color\s*:\s*([^;]+);?/gi, (_cm, col: string) => {
      const c = col.trim().toLowerCase()
      if (
        c === 'white' ||
        c === '#fff' ||
        c === '#ffffff' ||
        /^#f[ef][ef][ef0-9a-f]{0,3}$/i.test(c) ||
        /^#ff[ef][a-f0-9]{2,4}$/i.test(c) ||
        /^#fad[a-f0-9]{0,4}$/i.test(c)
      ) {
        return ''
      }
      return `color:${col};`
    })
    s = s.replace(/;\s*;/g, ';').replace(/^;|;$/g, '').trim()
    return s ? `style="${s}"` : ''
  })

  return out
}

export function prepareMyhoraContentHtml(raw: string, options?: { expandInteractive?: boolean }): string {
  let html = raw
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  html = unwrapForms(html)
  html = rewriteAssetUrls(html)
  html = stripMyhoraChrome(html)
  if (options?.expandInteractive !== false) {
    html = expandMyhoraInteractiveHtml(html)
  }
  return html.trim()
}

/** ตารางสมผุสดวงกำเนิด — ไม่ขยาย interactive + ลบธีมขาวจาก myhora */
export function prepareSamrapTableHtml(raw: string): string {
  return prepareMyhoraContentHtml(stripSamrapLightInlineStyles(raw), { expandInteractive: false })
}

/** มีข้อความจริงพอให้แสดง (ไม่ใช่แค่โครงว่างหลังตัด form) */
export function isMyhoraHtmlSubstantive(html: string | null | undefined, minChars = 600): boolean {
  if (!html?.trim()) return false
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length >= minChars
}
