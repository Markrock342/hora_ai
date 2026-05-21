import type { MyhoraTables } from '../types/myhora'
import { isMyhoraHtmlSubstantive } from '../utils/myhora/prepareContentHtml'
import { MyhoraChartEmbed } from './MyhoraChartEmbed'
import { MyhoraChartsPanel } from './MyhoraChartsPanel'
import { MyhoraEmbedFrame } from './MyhoraEmbedFrame'
import { MyhoraHtmlBlock } from './MyhoraHtmlBlock'
import { MyhoraTaksaTriwaiRow } from './MyhoraTaksaTriwaiRow'

interface MyhoraExactPanelProps {
  tables: MyhoraTables
}

function MyhoraNatalSummary({ tables }: { tables: MyhoraTables }) {
  const detail = tables.dateDetailNatal
  const lines = detail?.lines ?? []

  if (!detail && !tables.summaryNatal) return null

  return (
    <section className="myhora-native-summary" aria-label="ข้อมูลสรุปดวงกำเนิด">
      <p className="myhora-native-summary-title">{detail?.title ?? 'ดวงกำเนิด'}</p>
      {lines.length ? (
        <div className="myhora-native-summary-lines">
          {lines.map((line, index) => (
            <p key={`${line.type}-${index}`}>{line.text}</p>
          ))}
        </div>
      ) : (
        <p className="myhora-native-summary-lines">{tables.summaryNatal}</p>
      )}
    </section>
  )
}

export function MyhoraExactPanel({ tables }: MyhoraExactPanelProps) {
  const charts = tables.chartEmbeds
  const content = tables.contentEmbeds
  const html = tables.htmlFragments
  const predictHtml = isMyhoraHtmlSubstantive(html?.astrologyNatal)
    ? html!.astrologyNatal
    : null

  return (
    <div className="myhora-exact-panel space-y-8">
      <section className="myhora-charts-block" aria-label="กราฟดวงกำเนิด">
        <MyhoraNatalSummary tables={tables} />
        {charts ? <MyhoraChartsPanel charts={charts} bare /> : null}
      </section>

      {charts?.bhava ? (
        <MyhoraChartEmbed
          embedPath={charts.bhava}
          title="เรือนลัคนา"
          subtitle="ภวะจักร"
          size="large"
        />
      ) : null}

      <MyhoraHtmlBlock
        title="ตารางสมผุสดวงกำเนิด"
        subtitle="เรือนลัคนา · ตรียางค์ · นวางค์ · ทักษา · ฤกษ์"
        html={html?.natalTable ?? null}
        minHeight={200}
        className="myhora-html-block--samrap"
      />

      {predictHtml ? (
        <MyhoraHtmlBlock
          title="ทำนายดวงกำเนิด"
          subtitle="จักรราศี"
          html={predictHtml}
          minHeight={320}
          className="myhora-html-block--predict"
        />
      ) : content?.astrologyNatal ? (
        <MyhoraEmbedFrame
          embedPath={content.astrologyNatal}
          title="ทำนายดวงกำเนิด"
          subtitle="ลัคนา · มาตรฐานดาว · เจ้าเรือน · ดาวในเรือน/ราศี"
          height={720}
          wide
          className="myhora-embed-section--natal"
        />
      ) : null}

      <MyhoraTaksaTriwaiRow tables={tables} />
    </div>
  )
}
