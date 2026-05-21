import { useMemo, useState } from 'react'
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
  fromMyhora?: boolean
}

type DetailTab = 'natal' | 'transit'

export function MyhoraDetailPanel({
  natal,
  transit,
  fromMyhora = false,
}: MyhoraDetailPanelProps) {
  const tabs = useMemo(() => {
    const list: { id: DetailTab; label: string }[] = []
    if (natal) list.push({ id: 'natal', label: 'สรุปดารา' })
    if (transit) list.push({ id: 'transit', label: 'ดวงจร' })
    return list
  }, [natal, transit])

  const [tab, setTab] = useState<DetailTab>(() => tabs[0]?.id ?? 'natal')

  const activeTab = tabs.some((t) => t.id === tab) ? tab : tabs[0]?.id

  if (!natal && !transit) return null
  if (!tabs.length) return null

  const activeDetail = activeTab === 'natal' ? natal : transit

  return (
    <section className="myhora-detail-panel no-print" aria-label="สรุปวันเกิดและวันจร">
      <div className="myhora-detail-tabs" role="tablist">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={activeTab === id ? 'myhora-detail-tab is-active' : 'myhora-detail-tab'}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="myhora-detail-grid">
        {activeDetail ? <DateDetailCard detail={activeDetail} /> : null}
      </div>

      {fromMyhora ? (
        <p className="myhora-detail-footnote text-xs text-hora-muted">
          ปฏิทินจันทรคติ · ลัคนาอันโตนาที
        </p>
      ) : (
        <p className="myhora-detail-footnote text-xs text-hora-muted">
          สรุปจากข้อมูลเกิด + พิกัดสถานที่
        </p>
      )}
    </section>
  )
}
