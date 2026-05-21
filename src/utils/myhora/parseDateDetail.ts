/** แยกข้อมูลจาก n_date_info / t_date_info ใน thai.aspx */

export type MyhoraDateLineType =
  | 'date'
  | 'lunar'
  | 'place'
  | 'coords'
  | 'astro'
  | 'lagna'
  | 'age'
  | 'text'

export interface MyhoraDateLine {
  type: MyhoraDateLineType
  text: string
}

export interface MyhoraDateDetail {
  title: string
  lines: MyhoraDateLine[]
  raw: string
}

function classifyLine(text: string): MyhoraDateLineType {
  if (
    (/วัน(?:เกิด|จร)?/.test(text) || /วันจันทร์|วันอังคาร|วันพุธ|วันพฤหัส|วันศุกร์|วันเสาร์|วันอาทิตย์/.test(text)) &&
    (/พ\.ศ\.|ค\.ศ\.|น\./.test(text) || /\d{1,2}:\d{2}/.test(text))
  ) {
    return 'date'
  }
  if (/ค่ำ|ขึ้น|แรม|เดือนอ้าย|เดือนสิบ|ปีงู|ปีม้|ปีมะโรง|จ\.ศ\.|จุลศักราช|อธิกมาส/.test(text)) {
    return 'lunar'
  }
  if (/Lat\s|Long\s|ละติจูด|ลองจิจูด/i.test(text)) return 'coords'
  if (
    /อาทิตย์ขึ้น|อาทิตย์ตก|จันทร์ขึ้น|จันทร์ตก|ข้างขึ้น|ข้างแรม|เรืองแสง|ดวงจันทร์/.test(
      text,
    )
  ) {
    return 'astro'
  }
  if (/ลัคนา|นวางศ์|ตรียางศ์|นักษัตร|ตนุเกษตร/.test(text)) return 'lagna'
  if (/อายุ|ปี\s*\d|เดือน\s*\d|ขวบ/.test(text)) return 'age'
  if (
    /เขต|อำเภอ|จังหวัด|กรุงเทพ|บาง|พระนคร|แขวง|ต\./.test(text) &&
    !/Lat/i.test(text)
  ) {
    return 'place'
  }
  return 'text'
}

function htmlToLines(html: string): MyhoraDateLine[] {
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')

  const lines: MyhoraDateLine[] = []
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\s+/g, ' ').trim()
    if (!line || line.length < 2) continue
    if (/^วันเกิด|^วันจร/.test(line) && lines.some((l) => l.type === 'date')) continue
    lines.push({ type: classifyLine(line), text: line })
  }
  return lines
}

export function parseDateInfoBlock(html: string | undefined, title: string): MyhoraDateDetail | null {
  if (!html?.trim()) return null
  const lines = htmlToLines(html)
  if (!lines.length) return null
  return {
    title,
    lines,
    raw: lines.map((l) => l.text).join(' '),
  }
}

export function parseDateInfoFromMainHtml(html: string): {
  natal: MyhoraDateDetail | null
  transit: MyhoraDateDetail | null
} {
  const natalHtml = html.match(/id="n_date_info"[^>]*>([\s\S]*?)<\/div>/i)?.[1]
  const transitHtml = html.match(/id="t_date_info"[^>]*>([\s\S]*?)<\/div>/i)?.[1]
  return {
    natal: parseDateInfoBlock(natalHtml, 'วันเกิด'),
    transit: parseDateInfoBlock(transitHtml, 'วันจร'),
  }
}
