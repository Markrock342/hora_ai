import type { MyhoraChartEmbeds } from '../types/myhora'
import { MyhoraChartEmbed } from './MyhoraChartEmbed'
import { MyhoraChartHtml } from './MyhoraChartHtml'

interface MyhoraChartsPanelProps {
  charts: MyhoraChartEmbeds
  /** แสดงเฉพาะกราฟวงกลม ไม่มีหัวข้อการ์ด */
  bare?: boolean
}

interface ChartSlotProps {
  label: string
  embedPath: string | null
  preparedHtml?: string | null
  size: 'large' | 'small'
  bare?: boolean
}

function ChartSlot({ label, embedPath, preparedHtml, size, bare = false }: ChartSlotProps) {
  if (!embedPath && !preparedHtml) return null

  const useHtml = Boolean(preparedHtml?.trim())

  return (
    <figure
      className={`myhora-charts-slot myhora-charts-slot--${size}${bare ? ' myhora-charts-slot--bare' : ''}`}
    >
      {bare ? <figcaption className="myhora-charts-slot-label">{label}</figcaption> : null}
      <div className="myhora-charts-slot-body">
        {useHtml ? (
          <MyhoraChartHtml
            embedPath={embedPath}
            preparedHtml={preparedHtml}
            size={size}
            className="myhora-chart-section--chart-only"
          />
        ) : (
          <MyhoraChartEmbed
            embedPath={embedPath}
            title={label}
            size={size}
            bare={bare}
          />
        )}
      </div>
    </figure>
  )
}

export function MyhoraChartsPanel({ charts, bare = false }: MyhoraChartsPanelProps) {
  const hasNavamsa = Boolean(charts.navamsa || charts.navamsaHtml)
  const hasDrekkana = Boolean(charts.drekkana || charts.drekkanaHtml)
  const hasSide = hasNavamsa || hasDrekkana

  return (
    <div
      className={`myhora-charts-panel ${hasSide ? 'myhora-charts-panel--with-side' : ''} ${bare ? 'myhora-charts-panel--bare' : ''}`.trim()}
      aria-label="กราฟราศีจักร"
    >
      <div className="myhora-charts-main">
        <ChartSlot
          label="ราศีจักร"
          embedPath={charts.rasi}
          preparedHtml={charts.rasiHtml}
          size="large"
          bare={bare}
        />
      </div>

      {hasSide ? (
        <div className="myhora-charts-side">
          {hasNavamsa ? (
            <ChartSlot
              label="นวางศ์จักร"
              embedPath={charts.navamsa}
              preparedHtml={charts.navamsaHtml}
              size="small"
              bare={bare}
            />
          ) : null}
          {hasDrekkana ? (
            <ChartSlot
              label="ตรียางศ์จักร"
              embedPath={charts.drekkana}
              preparedHtml={charts.drekkanaHtml}
              size="small"
              bare={bare}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
