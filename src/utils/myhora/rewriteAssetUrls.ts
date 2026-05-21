import { getMyhoraOrigin } from './myhoraProxy'

function myhoraNetBase(): string {
  if (import.meta.env.VITE_MYHORA_NET_ORIGIN) {
    return import.meta.env.VITE_MYHORA_NET_ORIGIN
  }
  if (import.meta.env.DEV || import.meta.env.VITE_MYHORA_ORIGIN) {
    return '/api/myhora-net'
  }
  return 'https://myhora.net'
}

function joinOrigin(origin: string, path: string): string {
  if (path.startsWith('http')) return path
  const base = origin.endsWith('/') ? origin.slice(0, -1) : origin
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/**
 * ชี้ asset ผ่าน proxy ในแอป
 * — รูป/กราฟใต้ /astrology/ อยู่ที่ myhora.com (ไม่ใช่ myhora-net → 404)
 */
export function rewriteAssetUrls(html: string): string {
  const com = getMyhoraOrigin()
  const net = myhoraNetBase()

  let out = html
    .replace(/https?:\/\/myhora\.com/gi, com)
    .replace(/https?:\/\/myhora\.net\/astrology/gi, `${com.replace(/\/$/, '')}/astrology`)
    .replace(/https?:\/\/myhora\.net/gi, net)

  out = out.replace(
    /url\(\s*(['"]?)https?:\/\/myhora\.net\/astrology/gi,
    (_m, q: string) => `url(${q}${com.replace(/\/$/, '')}/astrology`,
  )

  out = out.replace(
    /(\s(?:src|href)=["'])\/(astrology\/[^"']+)/gi,
    (_m, prefix: string, path: string) => `${prefix}${joinOrigin(com, `/${path}`)}`,
  )
  out = out.replace(
    /(\s(?:src|href)=["'])\/(image\/[^"']+)/gi,
    (_m, prefix: string, path: string) => `${prefix}${joinOrigin(net, `/${path}`)}`,
  )

  return out
}
