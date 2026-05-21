#!/usr/bin/env node
/**
 * สร้างไฟล์ปฏิทินปี (สูตรประมาณ) — รันจาก repo root
 *
 *   node scripts/generate-suryayat-year.mjs 2549
 *   node scripts/generate-suryayat-year.mjs 2569 --time 12:00
 *
 * ผลตรง myhora 100% ต้อง export จาก myhora / นำเข้า admin
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const beYear = Number(process.argv[2])
const timeArg = process.argv.find((a) => a.startsWith('--time='))
const defaultTime = timeArg ? timeArg.split('=')[1] : '12:00'

if (!beYear || beYear < 2400 || beYear > 2700) {
  console.error('Usage: node scripts/generate-suryayat-year.mjs <พ.ศ.> [--time=HH:mm]')
  process.exit(1)
}

const ceYear = beYear - 543
const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0

const days = {}
for (let month = 1; month <= 12; month++) {
  const maxDay = [31, isLeap(ceYear) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
  for (let day = 1; day <= maxDay; day++) {
    const key = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${defaultTime}`
    days[key] = {
      planets: {
        อาทิตย์: '—',
        จันทร์: '—',
        อังคาร: '—',
        พุธ: '—',
        พฤหัสบดี: '—',
        ศุกร์: '—',
        เสาร์: '—',
        ราหู: '—',
        เกตุ: '—',
        มฤตยู: '—',
      },
      lagna: '—',
      _note: 'placeholder — รันแอปสูตรหรือ import myhora',
    }
  }
}

const outDir = join(root, 'src/data/suryayat100/years')
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, `${beYear}.json`)
const payload = {
  beYear,
  source: `generated placeholder ${new Date().toISOString().slice(0, 10)} — แทนที่ด้วย myhora`,
  days,
}

writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8')
console.log(`Wrote ${outPath} (${Object.keys(days).length} keys)`)
console.log('Next: fill planets/lagna from myhora thai.aspx or Admin import')
