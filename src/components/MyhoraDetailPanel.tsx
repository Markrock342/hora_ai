import { useState } from 'react'
import type { MyhoraDateDetail, MyhoraDateLineType } from '../types/myhora'

const LINE_ICONS: Record<MyhoraDateLineType, string> = {
  date: '📅',
  lunar: '🌙',
  place: '📍',
  coords: '⊕',
  astro: '☀',
  lagna: '✦',
  age: '⏳',
  text: '·',
}

function DateDetailCard({ detail }: { detail: MyhoraDateDetail }) {
  return (
    <article className="myhora-detail-card">
      <h4 className="myhora-detail-card-title">{detail.title}</h4>
      <ul className="myhora-detail-lines">
        {detail.lines.map((line, i) => (
          <li
            key={i}
            className={`myhora-detail-line myhora-detail-line--${line.type}`}
          >
            <span className="myhora-detail-line-icon" aria-hidden>
              {LINE_ICONS[line.type]}
            </span>
            <span className="myhora-detail-line-text">{line.text}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

interface MyhoraDetailPanelProps {
  natal: MyhoraDateDetail | null
  transit: MyhoraDateDetail | null
  /** มีข้อมูล myhora scrape */
  fromMyhora?: boolean
}

export function MyhoraDetailPanel({
  natal,
  transit,
  fromMyhora = false,
}: MyhoraDetailPanelProps) {
  const [tab, setTab] = useState<'all' | 'natal' | 'transit'>('all')

  if (!natal && !transit) return null

  const showNatal = tab === 'all' || tab === 'natal'
  const showTransit = tab === 'all' || tab === 'transit'

  return (
    <section className="myhora-detail-panel no-print" aria-label="สรุปวันเกิดและวันจร">
      <div className="myhora-detail-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'all'}
          className={tab === 'all' ? 'myhora-detail-tab is-active' : 'myhora-detail-tab'}
          onClick={() => setTab('all')}
        >
          สรุปดารา
        </button>
        {natal ? (
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'natal'}
            className={tab === 'natal' ? 'myhora-detail-tab is-active' : 'myhora-detail-tab'}
            onClick={() => setTab('natal')}
          >
            ดวงกำเนิด
          </button>
        ) : null}
        {transit ? (
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'transit'}
            className={
              tab === 'transit' ? 'myhora-detail-tab is-active' : 'myhora-detail-tab'
            }
            onClick={() => setTab('transit')}
          >
            ดวงจร
          </button>
        ) : null}
      </div>

      <div
        className={`myhora-detail-grid ${tab === 'all' && natal && transit ? 'myhora-detail-grid--two' : ''}`}
      >
        {showNatal && natal ? <DateDetailCard detail={natal} /> : null}
        {showTransit && transit ? <DateDetailCard detail={transit} /> : null}
      </div>

      {fromMyhora ? (
        <p className="myhora-detail-footnote text-xs text-hora-muted">
          ปฏิทินจันทรคติ · ลัคนาอันโตนาที
        </p>
      ) : (
        <p className="myhora-detail-footnote text-xs text-hora-muted">
          สรุปจากข้อมูลเกิด + พิกัดสถานที่ (รายละเอียดจันทรคติเต็มเมื่อดึง myhora สำเร็จ)
        </p>
      )}
    </section>
  )
}
