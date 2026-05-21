import { useState } from 'react'
import type { BirthInput } from '../types/astrology'
import { resolvePlaceCoords } from '../data/placeCoordinates'
import { setCachedChart } from '../utils/suryayatCache'
import { GlassCard } from './ui/GlassCard'

const EXAMPLE = `{
  "day": 21,
  "month": 5,
  "year": 2006,
  "time": "18:31",
  "country": "ไทย",
  "province": "กรุงเทพมหานคร",
  "district": "พระนคร",
  "lagna": "พิจิก",
  "planets": {
    "อาทิตย์": "มีน",
    "จันทร์": "กุมภ์",
    "อังคาร": "เมษ",
    "พุธ": "พิจิก",
    "พฤหัสบดี": "ตุลย์",
    "ศุกร์": "มีน",
    "เสาร์": "สิงห์",
    "ราหู": "มกร",
    "เกตุ": "พิจิก",
    "มฤตยู": "ตุลย์"
  }
}`

interface ImportPayload extends BirthInput {
  lagna: string
  planets: Record<string, string>
}

export function SuryayatImportForm() {
  const [json, setJson] = useState(EXAMPLE)
  const [message, setMessage] = useState<string | null>(null)

  async function handleImport() {
    setMessage(null)
    try {
      const data = JSON.parse(json) as ImportPayload
      const { lagna, planets, ...input } = data
      if (!lagna || !planets) {
        setMessage('ต้องมี lagna และ planets')
        return
      }
      const place = resolvePlaceCoords(input.country, input.province, input.district)
      await setCachedChart(input, place, {
        planets,
        lagna,
        source: 'myhora-import',
      })
      setMessage('บันทึกแคชแล้ว — กรอกวันเวลาเดียวกันในหน้าหลักแล้วคำนวณ')
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'JSON ไม่ถูกต้อง')
    }
  }

  return (
    <GlassCard mystic className="relative z-[1] space-y-4">
      <h3 className="font-display text-lg text-gradient-gold">นำเข้าจาก myhora</h3>
      <p className="text-sm text-hora-muted">
        คัดลอกราศีจักรจาก thai.aspx ใส่ JSON แล้วบันทึกแคช — ใช้ได้ทันทีโดยไม่ต้องมีไฟล์ปี
      </p>
      <textarea
        className="input-mystic min-h-[200px] w-full font-mono text-xs"
        value={json}
        onChange={(e) => setJson(e.target.value)}
        spellCheck={false}
      />
      <button type="button" className="btn-primary btn-primary-mystic" onClick={handleImport}>
        บันทึกแคช
      </button>
      {message && (
        <p className={`text-sm ${message.includes('แล้ว') ? 'text-hora-gold' : 'text-hora-accent'}`}>
          {message}
        </p>
      )}
    </GlassCard>
  )
}
