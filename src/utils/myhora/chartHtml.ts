import { getMyhoraOrigin } from './myhoraProxy'

/** proxy สำหรับ asset บน myhora.net (รูปดาว / พื้นหลังกราฟ) */
function myhoraNetBase(): string {
  if (import.meta.env.VITE_MYHORA_NET_ORIGIN) {
    return import.meta.env.VITE_MYHORA_NET_ORIGIN
  }
  if (import.meta.env.DEV || import.meta.env.VITE_MYHORA_ORIGIN) {
    return '/api/myhora-net'
  }
  return 'https://myhora.net'
}

function rewriteAssetUrls(html: string): string {
  const com = getMyhoraOrigin()
  const net = myhoraNetBase()
  return html
    .replace(/https?:\/\/myhora\.com/gi, com)
    .replace(/https?:\/\/myhora\.net/gi, net)
}

/** ดึงส่วนกราฟจากหน้า embed ของ myhora */
function extractChartFragment(raw: string): string {
  const cnt = raw.match(
    /<div[^>]*class="[^"]*cnt-chart[^"]*"[^>]*>[\s\S]*?<\/div>\s*(?=<\/center>|<\/body>|$)/i,
  )?.[0]
  if (cnt) return cnt

  const center = raw.match(/<center[^>]*>([\s\S]*?)<\/center>/i)?.[1]
  if (center?.includes('cnt-chart') || center?.includes('background-image')) {
    return center.trim()
  }

  const body = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1]
  return body?.trim() ?? raw
}

/**
 * เตรียม HTML กราฟ myhora สำหรับ dangerouslySetInnerHTML
 * — ตัด script, ชี้รูปผ่าน proxy
 */
export function prepareMyhoraChartHtml(raw: string): string {
  let html = extractChartFragment(raw)
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  html = html.replace(/<link[^>]*>/gi, '')
  html = html.replace(/<form[\s\S]*?<\/form>/gi, '')
  html = rewriteAssetUrls(html)
  return html.trim()
}
