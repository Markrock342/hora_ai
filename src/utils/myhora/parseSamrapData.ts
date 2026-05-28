import type { MyhoraNatalPlanet } from '../../types/myhora'

/**
 * Extracts structured JSON data from the raw Myhora natal table HTML.
 * The table from Myhora contains 15 columns of data for each planet.
 */
export function extractNatalTableData(html: string | null): MyhoraNatalPlanet[] | null {
  if (!html) return null

  // Find all tr elements
  const trRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi
  const trs = [...html.matchAll(trRegex)]
  
  if (trs.length <= 2) return null // First two are usually headers

  const planets: MyhoraNatalPlanet[] = []

  const planetOrder = [
    /^(ลัคนา|ล\.ลัคนา|ล\.)/,
    /^(อาทิตย์|๑\.อาทิตย์|๑\.)/,
    /^(จันทร์|๒\.จันทร์|๒\.)/,
    /^(อังคาร|๓\.อังคาร|๓\.)/,
    /^(พุธ|๔\.พุธ|๔\.)/,
    /^(พฤหัสบดี|พฤหัส|๕\.พฤหัสบดี|๕\.)/,
    /^(ศุกร์|๖\.ศุกร์|๖\.)/,
    /^(เสาร์|๗\.เสาร์|๗\.)/,
    /^(ราหู|๘\.ราหู|๘\.)/,
    /^(เกตุ|๙\.เกตุ|๙\.)/,
    /^(มฤตยู|๐\.มฤตยู|๐\.)/
  ]

  function getPlanetIndex(text: string): number {
    for (let i = 0; i < planetOrder.length; i++) {
      if (planetOrder[i].test(text)) return i
    }
    return 999
  }

  // Group columns from both tables if they are split.
  // Actually, each <tr> in Myhora's output contains multiple <td>s.
  // Wait, if they are two separate tables side-by-side, we have to match rows by index.
  const tableRegex = /<table\b[^>]*>([\s\S]*?)<\/table>/gi
  const tables = [...html.matchAll(tableRegex)]
  
  let leftRows: string[][] = []
  let rightRows: string[][] = []

  // Find the actual data tables by looking at their content
  const dataTables = tables.filter(t => {
    const content = t[1]
    return content.includes('ดาว/ปัจจัย') || content.includes('เรือนลัคนา') || content.includes('ตรียางศ์') || content.includes('พิษ')
  })

  if (dataTables.length >= 2) {
    const leftTrs = [...dataTables[0][1].matchAll(trRegex)]
    const rightTrs = [...dataTables[1][1].matchAll(trRegex)]

    leftRows = leftTrs.map(trMatch => {
      const tdRegex = /<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi
      return [...trMatch[1].matchAll(tdRegex)].map(m => 
        m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, '').trim().replace(/\s+/g, ' ')
      )
    })

    rightRows = rightTrs.map(trMatch => {
      const tdRegex = /<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi
      return [...trMatch[1].matchAll(tdRegex)].map(m => 
        m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, '').trim().replace(/\s+/g, ' ')
      )
    })
  } else if (dataTables.length === 1) {
    // Single table
    const allTrs = [...dataTables[0][1].matchAll(trRegex)]
    const allRows = allTrs.map(trMatch => {
      const tdRegex = /<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi
      return [...trMatch[1].matchAll(tdRegex)].map(m => 
        m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, '').trim().replace(/\s+/g, ' ')
      )
    })
    
    // Split into left/right artificially for unified processing
    leftRows = allRows.map(r => r.slice(0, 4))
    rightRows = allRows.map(r => r.slice(4))
  } else {
    return null
  }

  // Merge rows (skip headers, usually 2 rows)
  for (let i = 2; i < Math.min(leftRows.length, rightRows.length); i++) {
    const leftCols = leftRows[i]
    const rightCols = rightRows[i]
    if (leftCols.length < 2) continue

    const planet = leftCols[0] || ''
    const zodiac = leftCols[1] || ''
    const degree = leftCols[2] || ''
    const minute = leftCols[3] || ''

    const house = rightCols[0] || ''
    const triyang = rightCols[1] || ''
    const poison = rightCols[2] || ''
    const nawamang = rightCols[3] || ''
    const rerk = rightCols[4] || ''
    const rerkName = rightCols[5] || ''
    const baht = rightCols[6] || ''
    const rerk2 = rightCols[7] || ''
    const rerkBig = rightCols[8] || ''
    const rerkOwner = rightCols[9] || ''
    const rerkStandard = rightCols[10] || ''

    if (planet && getPlanetIndex(planet) < 999) {
      planets.push({
        planet,
        zodiac,
        degree,
        minute,
        house,
        triyang,
        poison,
        nawamang,
        rerk,
        rerkName,
        baht,
        rerk2,
        rerkBig,
        rerkOwner,
        rerkStandard
      })
    }
  }

  // Sort by traditional order
  planets.sort((a, b) => getPlanetIndex(a.planet) - getPlanetIndex(b.planet))

  return planets.length > 0 ? planets : null
}
