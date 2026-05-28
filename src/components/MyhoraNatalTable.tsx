import { useMemo } from 'react'
import { extractNatalTableData } from '../utils/myhora/parseSamrapData'

interface MyhoraNatalTableProps {
  html: string | null
}

export function MyhoraNatalTable({ html }: MyhoraNatalTableProps) {
  const planets = useMemo(() => {
    if (!html) return null
    return extractNatalTableData(html)
  }, [html])

  if (!planets || planets.length === 0) {
    // If parsing fails for any reason, fallback to rendering the raw HTML cleanly
    return (
      <section className="myhora-charts-block gold-glow overflow-hidden rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md">
        <header className="border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-5 py-4">
          <h3 className="font-display text-xl font-medium text-gradient-gold">ตารางสมผุสดวงกำเนิด</h3>
          <p className="mt-1 text-xs text-hora-gold-dim">เรือนลัคนา · ตรียางศ์ · นวางศ์ · ทักษา · ฤกษ์</p>
        </header>
        <div className="overflow-x-auto p-4 w-full">
          <div className="min-w-max" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </section>
    )
  }

  return (
    <section
      className="myhora-charts-block gold-glow overflow-hidden rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md"
      aria-label="ตารางสมผุสดวงกำเนิด"
    >
      <header className="myhora-embed-header border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-5 py-4">
        <h3 className="font-display text-xl font-medium text-gradient-gold">ตารางสมผุสดวงกำเนิด</h3>
        <p className="mt-1 text-xs text-hora-gold-dim">
          ราศี · เรือนลัคนา · ตรียางศ์ · นวางศ์ · ทักษา · ฤกษ์ (เรียงตามดาว)
        </p>
      </header>
      
      <div className="flex flex-col gap-6 p-4 w-full">
        {/* Table 1: สมผุสดาว */}
        <div className="w-full">
          <p className="mb-2 text-sm text-hora-gold-light font-medium">ส่วนที่ 1: สมผุสดาว (เรียงตามดาว)</p>
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead className="bg-white/5 border-b border-hora-gold/20">
              <tr>
                <th className="px-3 py-2 font-medium text-hora-gold">ดาว/ปัจจัย</th>
                <th className="px-3 py-2 font-medium text-hora-gold">ราศี</th>
                <th className="px-3 py-2 font-medium text-hora-gold">องศา</th>
                <th className="px-3 py-2 font-medium text-hora-gold">ลิปดา</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hora-gold/10">
              {planets.map((p, idx) => (
                <tr key={`t1-${idx}`} className="hover:bg-white/5 transition-colors">
                  <td className="px-3 py-2 font-medium text-hora-cream">{p.planet}</td>
                  <td className="px-3 py-2 text-hora-muted">{p.zodiac}</td>
                  <td className="px-3 py-2 text-hora-muted">{p.degree}</td>
                  <td className="px-3 py-2 text-hora-muted">{p.minute}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table 2: รายละเอียดนวางศ์/ฤกษ์ */}
        <div className="w-full">
          <p className="mb-2 text-sm text-hora-gold-light font-medium">ส่วนที่ 2: รายละเอียดเรือนและฤกษ์ (เรียงตามดาว)</p>
          <div className="overflow-x-auto custom-scrollbar w-full">
            <table className="w-full text-left text-[12px] whitespace-nowrap">
              <thead className="bg-white/5 border-b border-hora-gold/20">
                <tr>
                  <th className="px-2 py-2 font-medium text-hora-gold">ดาว/ปัจจัย</th>
                  <th className="px-2 py-2 font-medium text-hora-gold border-l border-hora-gold/10">เรือนลัคนา</th>
                  <th className="px-2 py-2 font-medium text-hora-gold">ตรียางศ์</th>
                  <th className="px-2 py-2 font-medium text-hora-gold">พิษ</th>
                  <th className="px-2 py-2 font-medium text-hora-gold">นวางศ์</th>
                  <th className="px-2 py-2 font-medium text-hora-gold border-l border-hora-gold/10">ฤกษ์:นาที</th>
                  <th className="px-2 py-2 font-medium text-hora-gold">นักษัตรฤกษ์</th>
                  <th className="px-2 py-2 font-medium text-hora-gold">บาท</th>
                  <th className="px-2 py-2 font-medium text-hora-gold">ฤกษ์</th>
                  <th className="px-2 py-2 font-medium text-hora-gold">ฤกษ์ใหญ่</th>
                  <th className="px-2 py-2 font-medium text-hora-gold">เจ้าเรือน</th>
                  <th className="px-2 py-2 font-medium text-hora-gold">มาตรฐาน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hora-gold/10">
                {planets.map((p, idx) => (
                  <tr key={`t2-${idx}`} className="hover:bg-white/5 transition-colors">
                    <td className="px-2 py-2 font-medium text-hora-cream">{p.planet}</td>
                    <td className="px-2 py-2 text-hora-muted border-l border-hora-gold/10">{p.house}</td>
                    <td className="px-2 py-2 text-hora-muted">{p.triyang}</td>
                    <td className="px-2 py-2 text-hora-muted text-red-400/80">{p.poison}</td>
                    <td className="px-2 py-2 text-hora-muted">{p.nawamang}</td>
                    <td className="px-2 py-2 text-hora-muted border-l border-hora-gold/10">{p.rerk}</td>
                    <td className="px-2 py-2 text-hora-muted">{p.rerkName}</td>
                    <td className="px-2 py-2 text-hora-muted">{p.baht}</td>
                    <td className="px-2 py-2 text-hora-muted">{p.rerk2}</td>
                    <td className="px-2 py-2 text-hora-muted">{p.rerkBig}</td>
                    <td className="px-2 py-2 text-hora-muted">{p.rerkOwner}</td>
                    <td className="px-2 py-2 text-hora-accent">{p.rerkStandard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
