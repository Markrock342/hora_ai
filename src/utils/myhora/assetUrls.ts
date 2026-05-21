import { getMyhoraOrigin } from './myhoraProxy'

/** รูปดาว / พื้นหลัง — ใช้ proxy myhora.com (myhora.net มัก redirect 404) */

function assetBase(): string {
  return getMyhoraOrigin()
}

export function myhoraStarImage(planetNum: number): string {
  const file = planetNum === 9 ? 'a9.png' : `A${planetNum}.png`
  return `${assetBase()}/astrology/thai/images/star/${file}`
}

/** พื้นหลังทักษา — TX ไม่มีบนเซิร์ฟเวอร์แล้ว ใช้เฉพาะ TXJ เมื่อเน้น */
export function myhoraTaksaBg(highlighted?: boolean): string | null {
  if (!highlighted) return null
  return `${assetBase()}/astrology/thai/images/taksa/TXJ.png`
}

export function myhoraTriwaiBg(highlighted?: boolean): string {
  const file = highlighted ? 'TWT.png' : 'TW.png'
  return `${assetBase()}/astrology/thai/images/triwai/${file}`
}
