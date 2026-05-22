import { myhoraProxyUrl } from './myhoraProxy'

/** พื้นหลังวงจักรดวงกำเนิด (set_nbg_img บน myhora) — ไฟล์อยู่ที่ myhora.com ไม่ใช่ myhora.net */
const WHEEL_BG = '/astrology/thai/images/bg-900x900-a.svg'
const WHEEL_BG_ASPECT = '/astrology/thai/images/bg-900x900-ax.svg'

export function natalWheelBackgroundUrl(aspectLines = false): string {
  const path = aspectLines ? WHEEL_BG_ASPECT : WHEEL_BG
  return myhoraProxyUrl(path)
}

export function natalWheelBackgroundImage(aspectLines = false): string {
  const url = natalWheelBackgroundUrl(aspectLines)
  return url ? `url('${url}')` : 'none'
}
