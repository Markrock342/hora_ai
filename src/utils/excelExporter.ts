import type { AstrologyResult } from '../types/astrology'

const PLANET_NUMBERS: Record<string, string> = {
  อาทิตย์: '๑',
  จันทร์: '๒',
  อังคาร: '๓',
  พุธ: '๔',
  พฤหัสบดี: '๕',
  ศุกร์: '๖',
  เสาร์: '๗',
  ราหู: '๘',
  เกตุ: '๙',
  มฤตยู: '๐',
}

const SOURCE_LABELS: Record<string, string> = {
  'myhora-scrape': 'ข้อมูลดึงตรงจาก myhora.com (ตรงกับเว็บ 100%)',
  'suryayat-100-reference': 'ปฏิทินร้อยปี สุริยยาตร์ (ชุดอ้างอิง)',
  'suryayat-100-year': 'ปฏิทินร้อยปี สุริยยาตร์ (ดึงจากไฟล์ปี)',
  'suryayat-cached': 'ปฏิทินร้อยปี สุริยยาตร์ (ข้อมูลแคชในเครื่อง)',
  'formula-pipeline': 'คำนวณผ่านสูตรสากล (ประมาณการ Lahiri Sidereal)',
  'ephemeris-fallback': 'คำนวณผ่านสูตรดาราศาสตร์ประมาณการ',
}

function normalizeSign(signName: string): string {
  const s = signName.trim()
  if (s === 'กุมภ' || s === 'กุมภ์') return 'กุมภ์'
  return s
}

export function exportToExcel(result: AstrologyResult) {
  const lagnaSign = normalizeSign(result.meta.lagna ?? result.chart?.lagna ?? 'เมษ')

  // Initialize planet lists for each of the 12 signs
  const signs = [
    'เมษ',
    'พฤษภ',
    'มิถุน',
    'กรกฎ',
    'สิงห์',
    'กันย์',
    'ตุลย์',
    'พิจิก',
    'ธนู',
    'มกร',
    'กุมภ์',
    'มีน',
  ]
  const planetsBySign: Record<string, string[]> = {}
  signs.forEach((s) => {
    planetsBySign[s] = []
  })

  // Put Lagna (ล) in its sign
  if (planetsBySign[lagnaSign]) {
    planetsBySign[lagnaSign].push('ล')
  }

  // Put planets in their signs
  result.planets.forEach((p) => {
    const sign = normalizeSign(p.siderealSign)
    const num = PLANET_NUMBERS[p.planet]
    if (sign && planetsBySign[sign] && num) {
      planetsBySign[sign].push(num)
    }
  })

  const sourceLabel = SOURCE_LABELS[result.meta.calculationSource ?? ''] || 'คำนวณจากสูตรระบบ'

  // Generate beautiful HTML-based spreadsheet
  const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<!--[if gte mso 9]>
<xml>
 <x:ExcelWorkbook>
  <x:ExcelWorksheets>
   <x:ExcelWorksheet>
    <x:Name>ดวงชะตาสุริยยาตร์</x:Name>
    <x:WorksheetOptions>
     <x:DisplayGridlines/>
    </x:WorksheetOptions>
   </x:ExcelWorksheet>
  </x:ExcelWorksheets>
 </x:ExcelWorkbook>
</xml>
<![endif]-->
<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .title-header {
    background-color: #1a2035;
    color: #d4a84b;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    padding: 12px;
  }
  .info-table td {
    padding: 4px 8px;
    font-size: 13px;
  }
  .info-label {
    font-weight: bold;
    color: #4a5568;
    width: 130px;
  }
  .planet-table th {
    background-color: #8b6b23;
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 6px;
    border: 1px solid #745719;
  }
  .planet-table td {
    padding: 6px;
    font-size: 12px;
    border: 1px solid #e2e8f0;
  }
  .zodiac-cell {
    background-color: #fbf8f0;
    border: 1px solid #d4a84b;
    text-align: center;
    vertical-align: middle;
    width: 100px;
    height: 90px;
  }
  .zodiac-name {
    font-size: 11px;
    font-weight: bold;
    color: #8b6b23;
  }
  .zodiac-planets {
    font-size: 18px;
    font-weight: bold;
    color: #1a2035;
    margin-top: 4px;
  }
  .zodiac-center {
    background-color: #f5eedc;
    border: 2px solid #8b6b23;
    text-align: center;
    vertical-align: middle;
    padding: 8px;
  }
  .zodiac-center-title {
    font-weight: bold;
    font-size: 13px;
    color: #8b6b23;
  }
  .zodiac-center-detail {
    font-size: 10px;
    color: #4a5568;
    margin-top: 3px;
  }
</style>
</head>
<body>
  <table>
    <!-- Main Title Block -->
    <tr>
      <td colspan="7" class="title-header">
        ตารางคำนวณดวงชะตาโหราศาสตร์ไทย (สุริยยาตร์)
      </td>
    </tr>
    
    <!-- Spacing row -->
    <tr style="height: 15px;">
      <td colspan="7"></td>
    </tr>
    
    <tr>
      <!-- LEFT COLUMN: Birth Info & Planet Table (Cols A to C) -->
      <td colspan="3" valign="top">
        <table class="info-table">
          <tr>
            <td class="info-label">วันเกิด:</td>
            <td>${result.meta.birthDisplay}</td>
          </tr>
          <tr>
            <td class="info-label">เวลาเกิด:</td>
            <td>${result.input.time} น.</td>
          </tr>
          <tr>
            <td class="info-label">สถานที่เกิด:</td>
            <td>${result.meta.locationDisplay}</td>
          </tr>
          <tr>
            <td class="info-label">ลัคนาสถิต:</td>
            <td style="font-weight: bold; color: #1a2035;">ราศี${lagnaSign}</td>
          </tr>
          <tr>
            <td class="info-label">ระบบคำนวณ:</td>
            <td style="font-size: 11px; color: #718096;">${sourceLabel}</td>
          </tr>
        </table>
        
        <br>
        
        <table class="planet-table" cellspacing="0">
          <thead>
            <tr>
              <th>ดาวพระเคราะห์</th>
              <th>สัญลักษณ์</th>
              <th>เลขไทย</th>
              <th>สถิตราศี</th>
              <th>องศา</th>
            </tr>
          </thead>
          <tbody>
            ${result.planets
              .map((p) => {
                const num = PLANET_NUMBERS[p.planet] || '-'
                const symbol =
                  p.planet === 'อาทิตย์'
                    ? '☉'
                    : p.planet === 'จันทร์'
                      ? '☽'
                      : p.planet === 'อังคาร'
                        ? '♂'
                        : p.planet === 'พุธ'
                          ? '☿'
                          : p.planet === 'พฤหัสบดี'
                            ? '♃'
                            : p.planet === 'ศุกร์'
                              ? '♀'
                              : p.planet === 'เสาร์'
                                ? '♄'
                                : p.planet === 'ราหู'
                                  ? '☊'
                                  : p.planet === 'เกตุ'
                                    ? '☋'
                                    : p.planet === 'มฤตยู'
                                      ? '♅'
                                      : '✦'
                return `
            <tr>
              <td style="font-weight: bold;">${p.planet}</td>
              <td style="text-align: center;">${symbol}</td>
              <td style="text-align: center; font-weight: bold;">${num}</td>
              <td>ราศี${normalizeSign(p.siderealSign)}</td>
              <td style="text-align: right;">${p.degreeText || '-'}</td>
            </tr>`
              })
              .join('')}
          </tbody>
        </table>
      </td>
      
      <!-- Spacing Column (Col D) -->
      <td></td>
      
      <!-- RIGHT COLUMN: 4x4 Rasi Chakra Grid (Cols E to H) -->
      <td colspan="4" valign="top">
        <div style="font-weight: bold; font-size: 14px; color: #8b6b23; margin-bottom: 8px; text-align: center;">
          ตารางจักราศี (Rasi Chakra Grid)
        </div>
        <table border="1" style="border-collapse: collapse; border: 2px solid #8b6b23;" cellspacing="0">
          <!-- Row 1 -->
          <tr>
            <td class="zodiac-cell">
              <div class="zodiac-name">ราศีมีน</div>
              <div class="zodiac-planets">${planetsBySign['มีน'].join(' ')}</div>
            </td>
            <td class="zodiac-cell">
              <div class="zodiac-name">ราศีเมษ</div>
              <div class="zodiac-planets">${planetsBySign['เมษ'].join(' ')}</div>
            </td>
            <td class="zodiac-cell">
              <div class="zodiac-name">ราศีพฤษภ</div>
              <div class="zodiac-planets">${planetsBySign['พฤษภ'].join(' ')}</div>
            </td>
            <td class="zodiac-cell">
              <div class="zodiac-name">ราศีมิถุน</div>
              <div class="zodiac-planets">${planetsBySign['มิถุน'].join(' ')}</div>
            </td>
          </tr>
          <!-- Row 2 -->
          <tr>
            <td class="zodiac-cell">
              <div class="zodiac-name">ราศีกุมภ์</div>
              <div class="zodiac-planets">${planetsBySign['กุมภ์'].join(' ')}</div>
            </td>
            <td colspan="2" rowspan="2" class="zodiac-center">
              <div class="zodiac-center-title">ดวงชะตากำเนิด</div>
              <div class="zodiac-center-detail" style="font-weight: bold; color: #1a2035; font-size: 11px;">
                ลัคนา ราศี${lagnaSign}
              </div>
              <div class="zodiac-center-detail">เกิด: ${result.meta.birthDisplay}</div>
              <div class="zodiac-center-detail">เวลา: ${result.input.time} น.</div>
            </td>
            <td class="zodiac-cell">
              <div class="zodiac-name">ราศีกรกฎ</div>
              <div class="zodiac-planets">${planetsBySign['กรกฎ'].join(' ')}</div>
            </td>
          </tr>
          <!-- Row 3 -->
          <tr>
            <td class="zodiac-cell">
              <div class="zodiac-name">ราศีมกร</div>
              <div class="zodiac-planets">${planetsBySign['มกร'].join(' ')}</div>
            </td>
            <td class="zodiac-cell">
              <div class="zodiac-name">ราศีสิงห์</div>
              <div class="zodiac-planets">${planetsBySign['สิงห์'].join(' ')}</div>
            </td>
          </tr>
          <!-- Row 4 -->
          <tr>
            <td class="zodiac-cell">
              <div class="zodiac-name">ราศีธนู</div>
              <div class="zodiac-planets">${planetsBySign['ธนู'].join(' ')}</div>
            </td>
            <td class="zodiac-cell">
              <div class="zodiac-name">ราศีพิจิก</div>
              <div class="zodiac-planets">${planetsBySign['พิจิก'].join(' ')}</div>
            </td>
            <td class="zodiac-cell">
              <div class="zodiac-name">ราศีตุลย์</div>
              <div class="zodiac-planets">${planetsBySign['ตุลย์'].join(' ')}</div>
            </td>
            <td class="zodiac-cell">
              <div class="zodiac-name">ราศีกันย์</div>
              <div class="zodiac-planets">${planetsBySign['กันย์'].join(' ')}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  // Use UTF-8 Byte Order Mark (\uFEFF) to make Excel parse Thai correctly on Windows
  const blob = new Blob(['\uFEFF' + html], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  })

  // Format file name based on date and lagna
  const fileNameDate = result.meta.birthDisplay.replace(/\//g, '-').replace(/\s/g, '_')
  const fileName = `ดวงชะตา_${fileNameDate}_ลัคนา_${lagnaSign}.xls`

  // Trigger download
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
