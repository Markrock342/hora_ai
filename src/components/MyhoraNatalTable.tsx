import { useMemo } from 'react'
import type { MyhoraNatalPlanet } from '../types/myhora'
import { extractNatalTableData } from '../utils/myhora/parseSamrapData'

interface MyhoraNatalTableProps {
  /** HTML ดิบจาก myhora (fallback) */
  html?: string | null
  /** ข้อมูลดาวกำเนิด parse แล้ว (ถ้ามี) */
  natalPlanets?: MyhoraNatalPlanet[] | null
  /** ข้อมูลดาวจร parse แล้ว (ถ้ามี) */
  transitPlanets?: MyhoraNatalPlanet[] | null
}

/** คอลัมน์หลักส่วนที่ 1 */
function PlanetBasicTable({ planets, title }: { planets: MyhoraNatalPlanet[]; title: string }) {
  return (
    <div className="w-full">
      <p className="mb-2 text-sm text-hora-gold-light font-semibold">{title}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-white/5 border-b border-hora-gold/20">
            <tr>
              <th className="px-3 py-2 font-medium text-hora-gold whitespace-nowrap">ดาว/ปัจจัย</th>
              <th className="px-3 py-2 font-medium text-hora-gold whitespace-nowrap">ราศี</th>
              <th className="px-3 py-2 font-medium text-hora-gold whitespace-nowrap">องศา</th>
              <th className="px-3 py-2 font-medium text-hora-gold whitespace-nowrap">ลิปดา</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hora-gold/10">
            {planets.map((p, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="px-3 py-2 font-medium text-hora-cream whitespace-nowrap">{p.planet}</td>
                <td className="px-3 py-2 text-hora-muted whitespace-nowrap">{p.zodiac}</td>
                <td className="px-3 py-2 text-hora-muted">{p.degree}</td>
                <td className="px-3 py-2 text-hora-muted">{p.minute}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** คอลัมน์รายละเอียดส่วนที่ 2 (เรือน ฤกษ์) — เรียงตามดาวเหมือนกัน, อนุญาตให้ scroll เพราะมีหลายคอลัมน์ */
function PlanetDetailTable({ planets, title }: { planets: MyhoraNatalPlanet[]; title: string }) {
  return (
    <div className="w-full">
      <p className="mb-2 text-sm text-hora-gold-light font-semibold">{title}</p>
      <div className="overflow-x-auto">
        <table className="min-w-max text-left text-[12px]">
          <thead className="bg-white/5 border-b border-hora-gold/20">
            <tr>
              <th className="px-2 py-2 font-medium text-hora-gold whitespace-nowrap">ดาว/ปัจจัย</th>
              <th className="px-2 py-2 font-medium text-hora-gold whitespace-nowrap border-l border-hora-gold/10">เรือนลัคนา</th>
              <th className="px-2 py-2 font-medium text-hora-gold whitespace-nowrap">ตรียางศ์</th>
              <th className="px-2 py-2 font-medium text-hora-gold whitespace-nowrap">พิษ</th>
              <th className="px-2 py-2 font-medium text-hora-gold whitespace-nowrap">นวางศ์</th>
              <th className="px-2 py-2 font-medium text-hora-gold whitespace-nowrap border-l border-hora-gold/10">ฤกษ์:นาที</th>
              <th className="px-2 py-2 font-medium text-hora-gold whitespace-nowrap">นักษัตรฤกษ์</th>
              <th className="px-2 py-2 font-medium text-hora-gold whitespace-nowrap">บาท</th>
              <th className="px-2 py-2 font-medium text-hora-gold whitespace-nowrap">ฤกษ์</th>
              <th className="px-2 py-2 font-medium text-hora-gold whitespace-nowrap">ฤกษ์ใหญ่</th>
              <th className="px-2 py-2 font-medium text-hora-gold whitespace-nowrap">เจ้าเรือน</th>
              <th className="px-2 py-2 font-medium text-hora-gold whitespace-nowrap">มาตรฐาน</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hora-gold/10">
            {planets.map((p, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="px-2 py-2 font-medium text-hora-cream whitespace-nowrap">{p.planet}</td>
                <td className="px-2 py-2 text-hora-muted whitespace-nowrap border-l border-hora-gold/10">{p.house}</td>
                <td className="px-2 py-2 text-hora-muted whitespace-nowrap">{p.triyang}</td>
                <td className="px-2 py-2 text-red-400/80 whitespace-nowrap">{p.poison}</td>
                <td className="px-2 py-2 text-hora-muted whitespace-nowrap">{p.nawamang}</td>
                <td className="px-2 py-2 text-hora-muted whitespace-nowrap border-l border-hora-gold/10">{p.rerk}</td>
                <td className="px-2 py-2 text-hora-muted whitespace-nowrap">{p.rerkName}</td>
                <td className="px-2 py-2 text-hora-muted">{p.baht}</td>
                <td className="px-2 py-2 text-hora-muted whitespace-nowrap">{p.rerk2}</td>
                <td className="px-2 py-2 text-hora-muted whitespace-nowrap">{p.rerkBig}</td>
                <td className="px-2 py-2 text-hora-muted whitespace-nowrap">{p.rerkOwner}</td>
                <td className="px-2 py-2 text-hora-accent whitespace-nowrap">{p.rerkStandard}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PlanetSection({
  planets,
  sectionTitle,
}: {
  planets: MyhoraNatalPlanet[]
  sectionTitle: string
}) {
  return (
    <div className="space-y-6">
      <p className="text-base font-semibold text-hora-gold border-b border-hora-gold/20 pb-2">
        {sectionTitle}
      </p>
      <PlanetBasicTable planets={planets} title="ส่วนที่ 1: สมผุสดาว (ราศี · องศา · ลิปดา)" />
      <PlanetDetailTable planets={planets} title="ส่วนที่ 2: รายละเอียดเรือน · ฤกษ์ (เรียงตามดาว)" />
    </div>
  )
}

export function MyhoraNatalTable({ html, natalPlanets: natalPlanetsProp, transitPlanets: transitPlanetsProp }: MyhoraNatalTableProps) {
  const parsedFromHtml = useMemo(() => {
    if (natalPlanetsProp || !html) return null
    return extractNatalTableData(html)
  }, [html, natalPlanetsProp])

  const natal = natalPlanetsProp ?? parsedFromHtml
  const transit = transitPlanetsProp

  if (!natal || natal.length === 0) return null

  return (
    <section
      className="myhora-charts-block gold-glow overflow-hidden rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md"
      aria-label="ตารางสมผุสดวงชะตา"
    >
      <header className="myhora-embed-header border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-5 py-4">
        <h3 className="font-display text-xl font-medium text-gradient-gold">ตารางสมผุสดวงชะตา</h3>
        <p className="mt-1 text-xs text-hora-gold-dim">
          ราศี · เรือนลัคนา · ตรียางศ์ · นวางศ์ · ทักษา · ฤกษ์ — เรียงตามลำดับดาว
        </p>
      </header>

      <div className="flex flex-col gap-8 p-4 md:p-6">
        <PlanetSection planets={natal} sectionTitle="☀ ดวงกำเนิด" />

        {transit && transit.length > 0 && (
          <>
            <div className="border-t border-hora-gold/20" />
            <PlanetSection planets={transit} sectionTitle="☽ ดาวจร (Transit)" />
          </>
        )}
      </div>
    </section>
  )
}
