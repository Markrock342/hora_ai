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
      <h3 className="myhora-date-summary-title">{detail.title}</h3>
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

export function MyhoraDateSummaryBlock({ natal, transit, fromMyhora = false }: MyhoraDateSummaryBlockProps) {
  if (!natal && !transit) return null

  return (
    <section className="myhora-date-summary-block" aria-label="ข้อมูลวันเกิดและวันจร">
      <div className="myhora-date-summary-head">
        <p className="myhora-date-summary-eyebrow">ข้อมูลคำนวณ</p>
        <p className="myhora-date-summary-source">
          {fromMyhora ? 'ข้อมูลจาก myhora' : 'ข้อมูลจากระบบคำนวณในเครื่อง'}
        </p>
      </div>
      {natal ? <SummaryLines detail={natal} /> : null}
      {transit ? <SummaryLines detail={transit} /> : null}
    </section>
  )
}
