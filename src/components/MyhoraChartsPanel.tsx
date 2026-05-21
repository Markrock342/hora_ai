import type { MyhoraChartEmbeds } from '../types/myhora'
import { MyhoraChartEmbed } from './MyhoraChartEmbed'

interface MyhoraChartsPanelProps {
  charts: MyhoraChartEmbeds
}

export function MyhoraChartsPanel({ charts }: MyhoraChartsPanelProps) {
  const hasSide = Boolean(charts.navamsa || charts.drekkana)

  return (
    <div
      className={`myhora-charts-panel ${hasSide ? 'myhora-charts-panel--with-side' : ''}`}
    >
      <MyhoraChartEmbed
        embedPath={charts.rasi}
        title="ราศีจักร"
        subtitle="ดวงกำเนิด + ดวงจร (จาก myhora.com)"
        size="large"
      />
      {hasSide ? (
        <div className="myhora-charts-side space-y-4">
          <MyhoraChartEmbed
            embedPath={charts.navamsa}
            title="นวางศ์จักร"
            subtitle="ดวงกำเนิด"
            size="small"
          />
          <MyhoraChartEmbed
            embedPath={charts.drekkana}
            title="ตรียางศ์จักร"
            subtitle="ดวงกำเนิด"
            size="small"
          />
        </div>
      ) : null}
    </div>
  )
}
