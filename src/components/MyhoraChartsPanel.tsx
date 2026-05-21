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

function ChartSlotHeader({ label, size }: { label: string; size: 'large' | 'small' }) {
  return (
    <header className="myhora-embed-header border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-4 py-3 text-center">
      <h3
        className={`font-display font-medium text-gradient-gold ${size === 'large' ? 'text-xl' : 'text-lg'}`}
      >
        {label}
      </h3>
    </header>
  )
}

function ChartSlot({ label, embedPath, preparedHtml, size, bare = false }: ChartSlotProps) {
  if (!embedPath && !preparedHtml) return null

  const useHtml = Boolean(preparedHtml?.trim())

  return (
    <figure
      className={`myhora-charts-slot myhora-charts-slot--${size}${bare ? ' myhora-charts-slot--bare' : ''}`}
    >
      {bare ? <ChartSlotHeader label={label} size={size} /> : null}
      <div className="myhora-charts-slot-body">
        {useHtml ? (
          <MyhoraChartHtml
            embedPath={embedPath}
            preparedHtml={preparedHtml}
            size={size}
            className="myhora-chart-section--chart-only"
          />
        ) : (
          <MyhoraChartEmbed embedPath={embedPath} title={label} size={size} bare={bare} />
        )}
      </div>
    </figure>
  )
}

/** ราศีจักรบน — นวางศ์/ตรียางศ์ล่างคู่กัน (จัดสามเหลี่ยม) */
export function MyhoraChartsPanel({ charts, bare = false }: MyhoraChartsPanelProps) {
  const hasNavamsa = Boolean(charts.navamsa || charts.navamsaHtml)
  const hasDrekkana = Boolean(charts.drekkana || charts.drekkanaHtml)
  const hasBottom = hasNavamsa || hasDrekkana

  return (
    <div
      className={`myhora-charts-panel ${hasBottom ? 'myhora-charts-panel--triangle' : ''} ${bare ? 'myhora-charts-panel--bare' : ''}`.trim()}
      aria-label="กราฟราศีจักร"
    >
      <div className="myhora-charts-triangle-top">
        <ChartSlot
          label="ราศีจักร"
          embedPath={charts.rasi}
          preparedHtml={charts.rasiHtml}
          size="large"
          bare={bare}
        />
      </div>

      {hasBottom ? (
        <div className="myhora-charts-triangle-bottom">
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
