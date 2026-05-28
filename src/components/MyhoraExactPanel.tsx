import type { MyhoraTables } from '../types/myhora'
import { patchMyhoraNatalEmbeds } from '../utils/myhora/patchMyhoraNatalEmbeds'
import { MyhoraChartEmbed } from './MyhoraChartEmbed'
import { MyhoraChartsPanel } from './MyhoraChartsPanel'
import { MyhoraNatalTable } from './MyhoraNatalTable'
import { MyhoraTaksaTriwaiRow } from './MyhoraTaksaTriwaiRow'

interface MyhoraExactPanelProps {
  tables: MyhoraTables
}

export function MyhoraExactPanel({ tables: tablesProp }: MyhoraExactPanelProps) {
  const tables = patchMyhoraNatalEmbeds(tablesProp)
  const charts = tables.chartEmbeds
  const content = tables.contentEmbeds
  const html = tables.htmlFragments

  return (
    <div className="myhora-exact-panel space-y-8">
      {charts ? (
        <section
          className="myhora-charts-block gold-glow overflow-hidden rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md"
          aria-label="กราฟดวงชะตา"
        >
          <header className="myhora-embed-header border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-5 py-4">
            <h3 className="font-display text-xl font-medium text-gradient-gold">กราฟดวงชะตา</h3>
            <p className="mt-1 text-xs text-hora-gold-dim">
              ดวงจักรกำเนิด · ราศีจักร · นวางศ์จักร · ตรียางศ์จักร
            </p>
          </header>
          <div className="myhora-charts-block-body px-3 py-4 md:px-5 md:py-5">
            <MyhoraChartsPanel
              charts={charts}
              natalAnalysisFallback={content?.chartRasiAnalysisNatal}
              bare
            />
          </div>
        </section>
      ) : null}

      {charts?.bhava ? (
        <section className="myhora-bhava-block" aria-label="เรือนลัคนา">
          <MyhoraChartEmbed
            embedPath={charts.bhava}
            title="เรือนลัคนา"
            subtitle="ภวจักร"
            size="large"
            className="myhora-embed-section--bhava"
          />
        </section>
      ) : null}

      <MyhoraNatalTable
        html={html?.natalTable ?? null}
        transitHtml={html?.transitTable ?? null}
        natalPlanets={tables.natalPlanets}
        transitPlanets={tables.transitPlanets}
      />

      <MyhoraTaksaTriwaiRow tables={tables} />
    </div>
  )
}
