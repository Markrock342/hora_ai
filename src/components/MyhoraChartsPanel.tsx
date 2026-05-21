import type { MyhoraChartEmbeds } from '../types/myhora'
import { MyhoraChartEmbed } from './MyhoraChartEmbed'

interface MyhoraChartsPanelProps {
  charts: MyhoraChartEmbeds
  /** แสดงเฉพาะกราฟวงกลม ไม่มีหัวข้อ/ปุ่ม */
  bare?: boolean
}

export function MyhoraChartsPanel({ charts, bare = false }: MyhoraChartsPanelProps) {
  const hasSide = Boolean(charts.navamsa || charts.drekkana)

  return (
    <div
      className={`myhora-charts-panel ${hasSide ? 'myhora-charts-panel--with-side' : ''} ${bare ? 'myhora-charts-panel--bare' : ''}`.trim()}
      aria-label="กราฟราศีจักร"
    >
      <MyhoraChartEmbed
        embedPath={charts.rasi}
        title="ราศีจักร"
        subtitle="ดวงกำเนิด + ดวงจร"
        size="large"
        bare={bare}
      />
      {hasSide ? (
        <div className="myhora-charts-side">
          <MyhoraChartEmbed
            embedPath={charts.navamsa}
            title="นวางศ์จักร"
            size="small"
            bare={bare}
          />
          <MyhoraChartEmbed
            embedPath={charts.drekkana}
            title="ตรียางศ์จักร"
            size="small"
            bare={bare}
          />
        </div>
      ) : null}
    </div>
  )
}
