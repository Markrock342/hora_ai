import type { MyhoraDateDetail, MyhoraDateLineType } from '../types/myhora'

const LINE_CLASS: Record<MyhoraDateLineType, string> = {
  date: 'myhora-date-summary-line--date',
  lunar: 'myhora-date-summary-line--lunar',
  place: 'myhora-date-summary-line--place',
  coords: 'myhora-date-summary-line--coords',
  astro: 'myhora-date-summary-line--astro',
  lagna: 'myhora-date-summary-line--lagna',
  age: 'myhora-date-summary-line--age',
  text: 'myhora-date-summary-line--text',
}

interface MyhoraDateSummaryBlockProps {
  natal: MyhoraDateDetail | null
  transit: MyhoraDateDetail | null
  fromMyhora?: boolean
}

function SummaryLines({ detail }: { detail: MyhoraDateDetail }) {
  return (
    <div className="myhora-date-summary-group">
      <h4 className="myhora-date-summary-title font-display text-base font-medium text-hora-accent">
        {detail.title}
      </h4>
      <div className="myhora-date-summary-lines">
        {detail.lines.map((line, index) => (
          <p key={`${line.type}-${index}`} className={`myhora-date-summary-line ${LINE_CLASS[line.type]}`}>
            {line.text}
          </p>
        ))}
      </div>
    </div>
  )
}

export function MyhoraDateSummaryBlock({ natal, transit }: MyhoraDateSummaryBlockProps) {
  if (!natal && !transit) return null

  return (
    <section
      className="myhora-date-summary-block gold-glow rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md print:border-gray-300 print:bg-white"
      aria-label="ข้อมูลคำนวณ"
    >
      <header className="myhora-date-summary-header border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-5 py-4 print:border-gray-300 print:bg-gray-100">
        <h3 className="font-display text-xl font-medium text-gradient-gold print:text-black">
          ข้อมูลคำนวณ
        </h3>
      </header>
      <div className="myhora-date-summary-body px-5 py-5 print:py-4">
        {natal ? <SummaryLines detail={natal} /> : null}
        {transit ? <SummaryLines detail={transit} /> : null}
      </div>
    </section>
  )
}
