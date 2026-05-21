#!/usr/bin/env node
/**
 * ดึงผลจาก https://myhora.com/astrology/thai.aspx (CLI)
 * node scripts/scrape-myhora-thai.mjs
 */
import { writeFileSync } from 'fs'

const input = {
  day: 21,
  month: 5,
  year: 2006,
  time: '18:31',
  country: 'ไทย',
  province: 'กรุงเทพมหานคร',
  district: 'พระนคร',
}

const landing = await fetch('https://myhora.com/astrology/thai.aspx')
const landingHtml = await landing.text()
const vs = landingHtml.match(/name="__VIEWSTATE"[^>]*value="([^"]*)"/)?.[1]
const vsg = landingHtml.match(/name="__VIEWSTATEGENERATOR"[^>]*value="([^"]*)"/)?.[1] ?? ''
if (!vs) throw new Error('no VIEWSTATE')

const body = new URLSearchParams({
  __VIEWSTATE: vs,
  __VIEWSTATEGENERATOR: vsg,
  txt_name: '',
  dd_day: '21',
  dd_month: '05',
  dd_year: '2549',
  dd_hh: '18',
  dd_mm: '31',
  dd_province: input.province,
  dd_amphur: input.district,
  dd_country: 'ไทย(Thailand)',
  dd_day2: '21',
  dd_month2: '05',
  dd_year2: '2569',
  dd_hh2: '18',
  dd_mm2: '31',
  dd_province2: input.province,
  dd_amphur2: input.district,
  setcal: 'rb_suriyayas',
  dd_suriyayas_asc: '3',
  cb_setday8: 'on',
  cb_settaksamid: 'on',
  cb_setmnnode: 'on',
  cb_setthsnode: 'on',
  cb_setaspt: 'on',
  btn_submit: 'ทำนาย',
})

const result = await fetch('https://myhora.com/astrology/thai.aspx', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: body.toString(),
})
const html = await result.text()
const taksaUrl = html.match(/#div_chart_taksa'\)\.load\("([^"]+)"/)?.[1]
const triwaiUrl = html.match(/#div_chart_triwai'\)\.load\("([^"]+)"/)?.[1]

const out = {
  input,
  embeds: { taksa: taksaUrl, triwai: triwaiUrl },
  planetSample: [...html.matchAll(/<tr class="tr\d+">[\s\S]*?<td[^>]*>([^<]*)<\/td>[\s\S]*?<td[^>]*>\s*(\d+)\s*:\s*([^<]+)<\/td>/gi)].map((m) => ({
    label: m[1].trim(),
    sign: m[3].trim(),
  })),
}

if (taksaUrl) {
  out.taksaHtml = await (await fetch('https://myhora.com' + taksaUrl)).text()
}
if (triwaiUrl) {
  out.triwaiHtml = await (await fetch('https://myhora.com' + triwaiUrl)).text()
}

writeFileSync('docs/myhora-scrape-raw.json', JSON.stringify({ ...out, mainHtmlLength: html.length }, null, 2))
console.log('Wrote docs/myhora-scrape-raw.json', out.planetSample.length, 'planet rows')
