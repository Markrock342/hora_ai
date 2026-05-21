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
export function prepareMyhoraContentHtml(raw: string): string {
  let html = raw
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  html = unwrapForms(html)
  html = rewriteAssetUrls(html)
  html = stripMyhoraChrome(html)
  return html.trim()
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
