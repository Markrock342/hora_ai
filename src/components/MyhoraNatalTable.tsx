import { useEffect, useRef, useMemo } from 'react'
import type { MyhoraNatalPlanet } from '../types/myhora'
import { extractNatalTableData } from '../utils/myhora/parseSamrapData'

interface MyhoraNatalTableProps {
  /** HTML ดิบจาก myhora สำหรับดวงกำเนิด */
  html?: string | null
  /** HTML ดิบจาก myhora สำหรับดาวจร */
  transitHtml?: string | null
  /** ข้อมูลดาวกำเนิด (ถ้า parse มาแล้ว) */
  natalPlanets?: MyhoraNatalPlanet[] | null
  /** ข้อมูลดาวจร (ถ้า parse มาแล้ว) */
  transitPlanets?: MyhoraNatalPlanet[] | null
}

function MyhoraPlanetTable({
  planets,
  title,
  subtitle,
}: {
  planets: MyhoraNatalPlanet[]
  title: string
  subtitle?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  const handleExport = () => {
    const headers = [
      'ดาว/ปัจจัย', 'ราศี', 'องศา', 'ลิปดา', 'เรือนลัคนา', 'ตรียางศ์', 'พิษ', 'นวางศ์',
      'ฤกษ์:นาที', 'นักษัตรฤกษ์', 'บาท', 'ฤกษ์', 'ฤกษ์ใหญ่', 'เจ้าเรือน', 'มาตรฐาน เกณฑ์ ฯ'
    ]

    const rows = planets.map(p => [
      p.planet,
      p.zodiac,
      p.degree,
      p.minute,
      p.house,
      p.triyang,
      p.poison || '—',
      p.nawamang,
      p.rerk,
      p.rerkName,
      p.baht,
      p.rerk2,
      p.rerkBig,
      p.rerkOwner,
      p.rerkStandard || '—'
    ])

    const csvContent = "\uFEFF" + [
      headers.join(','),
      ...rows.map(r => r.map(val => {
        const s = String(val ?? '').replace(/"/g, '""');
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${title}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // scale ให้ตารางพอดีจอ ไม่ต้อง scroll
  useEffect(() => {
    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner) return

    const fit = () => {
      // reset
      inner.style.transform = 'none'
      inner.style.width = 'auto'
      wrap.style.height = ''

      const wrapW = wrap.clientWidth
      const innerW = inner.scrollWidth

      if (innerW > wrapW && wrapW > 0) {
        const scale = Math.max(wrapW / innerW, 0.3) // รองรับจอเล็กมาก
        inner.style.transform = `scale(${scale})`
        inner.style.transformOrigin = 'top left'
        inner.style.width = `${innerW}px`
        wrap.style.height = `${Math.ceil(inner.scrollHeight * scale)}px`
      }
    }

    const t = setTimeout(fit, 50)
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)
    return () => {
      clearTimeout(t)
      ro.disconnect()
    }
  }, [planets])

  return (
    <section
      className="gold-glow overflow-hidden rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md"
      aria-label={title}
    >
      <header className="border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-medium text-gradient-gold">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-hora-gold-dim">{subtitle}</p>}
        </div>
        <button
          onClick={handleExport}
          className="no-print flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-hora-gold/45 bg-gradient-to-r from-hora-gold/20 to-hora-gold/5 text-hora-gold-light hover:from-hora-gold/30 hover:to-hora-gold/15 active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <span className="text-lg">📥</span>
          ส่งออก Excel
        </button>
      </header>
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden p-3 md:p-5"
        style={{ minHeight: 80 }}
      >
        <div ref={innerRef} className="w-full">
          <table className="min-w-[950px] w-full border-collapse border border-hora-gold/15 text-[12px] leading-relaxed">
            <thead className="bg-white/5 border-b border-hora-gold/25 text-hora-gold font-medium">
              <tr>
                <th className="px-2 py-2.5 border-r border-hora-gold/15 text-left">ดาว/ปัจจัย</th>
                <th className="px-2 py-2.5 border-r border-hora-gold/15 text-center">ราศี</th>
                <th className="px-1 py-2.5 border-r border-hora-gold/15 text-center w-[45px]">ํ</th>
                <th className="px-1 py-2.5 border-r border-hora-gold/15 text-center w-[45px]">'</th>
                <th className="px-2 py-2.5 border-r border-hora-gold/15 text-center">เรือนลัคนา</th>
                <th className="px-2 py-2.5 border-r border-hora-gold/15 text-center">ตรียางศ์</th>
                <th className="px-2 py-2.5 border-r border-hora-gold/15 text-center w-[50px]">พิษ</th>
                <th className="px-2 py-2.5 border-r border-hora-gold/15 text-center">นวางศ์</th>
                <th className="px-2 py-2.5 border-r border-hora-gold/15 text-center">ฤกษ์:นาที</th>
                <th className="px-2 py-2.5 border-r border-hora-gold/15 text-left">นักษัตรฤกษ์</th>
                <th className="px-2 py-2.5 border-r border-hora-gold/15 text-center">บาท</th>
                <th className="px-2 py-2.5 border-r border-hora-gold/15 text-center">ฤกษ์</th>
                <th className="px-2 py-2.5 border-r border-hora-gold/15 text-center">ฤกษ์ใหญ่</th>
                <th className="px-2 py-2.5 border-r border-hora-gold/15 text-left">เจ้าเรือน</th>
                <th className="px-2 py-2.5 text-left">มาตรฐาน เกณฑ์ ฯ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hora-gold/10 text-hora-cream">
              {planets.map((p, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-2 py-2 border-r border-hora-gold/10 font-medium text-white">{p.planet}</td>
                  <td className="px-2 py-2 border-r border-hora-gold/10 text-center font-medium text-white">{p.zodiac}</td>
                  <td className="px-1 py-2 border-r border-hora-gold/10 text-center">{p.degree}</td>
                  <td className="px-1 py-2 border-r border-hora-gold/10 text-center">{p.minute}</td>
                  <td className="px-2 py-2 border-r border-hora-gold/10 text-center text-hora-gold-light">{p.house}</td>
                  <td className="px-2 py-2 border-r border-hora-gold/10 text-center text-[11px] text-hora-muted">{p.triyang}</td>
                  <td className="px-2 py-2 border-r border-hora-gold/10 text-center font-semibold text-red-400">{p.poison || '—'}</td>
                  <td className="px-2 py-2 border-r border-hora-gold/10 text-center text-[11px] text-hora-muted">{p.nawamang}</td>
                  <td className="px-2 py-2 border-r border-hora-gold/10 text-center text-hora-muted">{p.rerk}</td>
                  <td className="px-2 py-2 border-r border-hora-gold/10 text-left">{p.rerkName}</td>
                  <td className="px-2 py-2 border-r border-hora-gold/10 text-center text-[11px] text-hora-muted">{p.baht}</td>
                  <td className="px-2 py-2 border-r border-hora-gold/10 text-center text-[11px] text-hora-muted">{p.rerk2}</td>
                  <td className="px-2 py-2 border-r border-hora-gold/10 text-center text-[11px] text-hora-muted">{p.rerkBig}</td>
                  <td className="px-2 py-2 border-r border-hora-gold/10 text-left text-hora-gold-light">{p.rerkOwner}</td>
                  <td className="px-2 py-2 text-left text-[11px] text-hora-accent font-medium">{p.rerkStandard || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export function MyhoraNatalTable({
  html,
  transitHtml,
  natalPlanets,
  transitPlanets,
}: MyhoraNatalTableProps) {
  const natal = useMemo(() => natalPlanets ?? (html ? extractNatalTableData(html) : null), [html, natalPlanets])
  const transit = useMemo(() => transitPlanets ?? (transitHtml ? extractNatalTableData(transitHtml) : null), [transitHtml, transitPlanets])

  if (!natal && !transit) return null

  return (
    <div className="space-y-6">
      {natal && natal.length > 0 && (
        <MyhoraPlanetTable
          planets={natal}
          title="ตารางสมผุสดวงกำเนิด"
          subtitle="ราศี · เรือนลัคนา · ตรียางศ์ · นวางศ์ · ทักษา · ฤกษ์"
        />
      )}
      {transit && transit.length > 0 && (
        <MyhoraPlanetTable
          planets={transit}
          title="ตารางสมผุสดาวจร"
          subtitle="ตำแหน่งดาวจร ณ วันที่เลือก · ราศี · เรือนลัคนา · ฤกษ์"
        />
      )}
    </div>
  )
}
