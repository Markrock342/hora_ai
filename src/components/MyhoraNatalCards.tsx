import type { MyhoraNatalPlanet } from '../types/myhora'

interface MyhoraNatalCardsProps {
  planets: MyhoraNatalPlanet[] | null
}

export function MyhoraNatalCards({ planets }: MyhoraNatalCardsProps) {
  if (!planets || planets.length === 0) return null

  return (
    <section
      className="myhora-charts-block gold-glow overflow-hidden rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md"
      aria-label="ข้อมูลสมผุสและตรียางศ์ นวางศ์ ฤกษ์"
    >
      <header className="myhora-embed-header border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-5 py-4">
        <h3 className="font-display text-xl font-medium text-gradient-gold">ตารางสมผุสดวงกำเนิด</h3>
        <p className="mt-1 text-xs text-hora-gold-dim">
          ราศี · เรือนลัคนา · ตรียางศ์ · นวางศ์ · ทักษา · ฤกษ์
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
        {planets.map((p, idx) => (
          <div key={idx} className="bg-white/5 border border-hora-gold/20 rounded-xl p-4 hover:bg-white/10 transition-colors shadow-sm">
            <div className="flex items-center justify-between border-b border-hora-gold/20 pb-2 mb-3">
              <h4 className="font-display font-medium text-lg text-hora-gold">{p.planet}</h4>
              <span className="text-xs bg-hora-gold/20 text-hora-gold px-2 py-1 rounded-full">{p.zodiac}</span>
            </div>
            
            <div className="space-y-2 text-[13px] text-gray-200">
              <div className="flex justify-between">
                <span className="text-hora-gold-dim">องศา:</span>
                <span>{p.degree}° {p.minute}'</span>
              </div>
              {p.house && (
                <div className="flex justify-between">
                  <span className="text-hora-gold-dim">เรือนลัคนา:</span>
                  <span>{p.house}</span>
                </div>
              )}
              {p.triyang && (
                <div className="flex justify-between">
                  <span className="text-hora-gold-dim">ตรียางศ์/นวางศ์:</span>
                  <span>{p.triyang} / {p.nawamang}</span>
                </div>
              )}
              {p.rerkName && (
                <div className="flex justify-between">
                  <span className="text-hora-gold-dim">ฤกษ์:</span>
                  <span className="text-right">{p.rerkName} {p.rerk && `(${p.rerk})`}</span>
                </div>
              )}
              {p.rerkStandard && (
                <div className="flex justify-between">
                  <span className="text-hora-gold-dim">มาตรฐาน:</span>
                  <span className="text-hora-accent">{p.rerkStandard}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
