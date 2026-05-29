import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { MyhoraChartEmbeds } from '../types/myhora'
import {
  buildNatalAnalysisEmbedPath,
  defaultNatalChartOptions,
  persistNatalChartOptions,
  type NatalChartDisplayOptions,
} from '../utils/myhora/natalChartOptions'
import { MYHORA_CHART_NATIVE } from '../utils/myhora/chartNativeSize'
import { resolveNatalChartPaths } from '../utils/myhora/patchMyhoraNatalEmbeds'
import { MyhoraChartDocumentFrame } from './MyhoraChartDocumentFrame'
import { MyhoraChartEmbed } from './MyhoraChartEmbed'
import { MyhoraChartFitHost } from './MyhoraChartFitHost'
import { MyhoraChartFrame } from './MyhoraChartFrame'
import { MyhoraChartHtml } from './MyhoraChartHtml'
import { MyhoraNatalChartControls } from './MyhoraNatalChartControls'

interface MyhoraChartsPanelProps {
  charts: MyhoraChartEmbeds
  /** สำรองจาก contentEmbeds เมื่อ chartEmbeds เก่าไม่มี natalAnalysis */
  natalAnalysisFallback?: string | null
  /** แสดงเฉพาะกราฟวงกลม ไม่มีหัวข้อการ์ด */
  bare?: boolean
}

const DIVISIONAL_DIMS = {
  large: { width: 500, height: 480 },
  small: MYHORA_CHART_NATIVE.divisional,
} as const

const NATAL_DIM = { width: 900, height: 900 }

interface ChartSlotProps {
  label: string
  embedPath: string | null
  preparedHtml?: string | null
  size: 'large' | 'small'
  bare?: boolean
  className?: string
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

function NatalChartSlot({
  analysisPath,
  fallbackPath,
  bare,
}: {
  analysisPath: string | null
  fallbackPath: string | null
  bare?: boolean
}) {
  const basePath = analysisPath ?? fallbackPath
  const [opts, setOpts] = useState<NatalChartDisplayOptions>(defaultNatalChartOptions)

  const embedPath = useMemo(() => {
    if (!basePath) return null
    if (analysisPath) return buildNatalAnalysisEmbedPath(analysisPath, opts)
    return basePath
  }, [analysisPath, basePath, opts])

  const chartReloadKey = useMemo(
    () =>
      embedPath
        ? `${embedPath}|${opts.showHouses}|${opts.houseMode}|${opts.showStd}|${opts.stdMode}|${opts.showOuter}|${opts.outerMode}|${opts.aspectLines}`
        : '',
    [embedPath, opts],
  )

  const onOptionsChange = useCallback((next: NatalChartDisplayOptions) => {
    persistNatalChartOptions(next)
    setOpts(next)
  }, [])

  if (!embedPath) return null

  return (
    <figure className={`myhora-charts-slot myhora-charts-slot--xlarge${bare ? ' myhora-charts-slot--bare' : ''}`}>
      {bare ? <figcaption className="myhora-charts-slot-label">ดวงจักรกำเนิด</figcaption> : null}
      <div className="myhora-natal-chart-wrap">
        <div className="myhora-charts-slot-body myhora-natal-wheel-host">
          <MyhoraChartFrame
            key={chartReloadKey}
            embedPath={embedPath}
            title="ดวงจักรกำเนิด"
            width={NATAL_DIM.width}
            height={NATAL_DIM.height}
            bare={bare}
            size="large"
            preferDirectIframe={false}
            natalDisplayOpts={analysisPath ? opts : undefined}
          />
        </div>
        <MyhoraNatalChartControls
          options={opts}
          onChange={onOptionsChange}
          hasAnalysisLayer={Boolean(analysisPath)}
        />
      </div>
    </figure>
  )
}

function DivisionalChartContent({
  label,
  embedPath,
  preparedHtml,
  dim,
  htmlSize,
  bare,
  className = '',
}: {
  label: string
  embedPath: string | null
  preparedHtml?: string | null
  dim: { width: number; height: number }
  htmlSize: 'large' | 'small'
  bare: boolean
  className?: string
}): ReactNode {
  const useHtml = Boolean(preparedHtml?.trim())
  const [useDocument, setUseDocument] = useState(false)

  if (useHtml) {
    return (
      <MyhoraChartHtml
        embedPath={embedPath}
        preparedHtml={preparedHtml}
        size={htmlSize}
        className={`myhora-chart-section--chart-only ${className}`.trim()}
      />
    )
  }

  if (!embedPath) return null

  if (useDocument) {
    return (
      <MyhoraChartDocumentFrame
        embedPath={embedPath}
        title={label}
        width={dim.width}
        height={dim.height}
        className={className}
      />
    )
  }

  return (
    <MyhoraChartEmbed
      embedPath={embedPath}
      title={label}
      size={htmlSize}
      bare={bare}
      width={dim.width}
      height={dim.height}
      className={className}
      onEmbedFailed={() => setUseDocument(true)}
    />
  )
}

function ChartSlot({ label, embedPath, preparedHtml, size, bare = false, className = '' }: ChartSlotProps) {
  if (!embedPath && !preparedHtml?.trim()) return null

  const dim = DIVISIONAL_DIMS[size]

  return (
    <figure
      className={`myhora-charts-slot myhora-charts-slot--${size}${bare ? ' myhora-charts-slot--bare' : ''}`}
    >
      {bare ? <ChartSlotHeader label={label} size={size} /> : null}
      <div className="myhora-charts-slot-body">
        <MyhoraChartFitHost nativeWidth={dim.width} nativeHeight={dim.height}>
          <DivisionalChartContent
            label={label}
            embedPath={embedPath}
            preparedHtml={preparedHtml}
            dim={dim}
            htmlSize={size}
            bare={bare}
            className={className}
          />
        </MyhoraChartFitHost>
      </div>
    </figure>
  )
}

/** ดวงจักรกำเนิดบน — ราศีจักรกลาง — นวางศ์/ตรียางศ์ล่างคู่กัน */
export function MyhoraChartsPanel({
  charts,
  natalAnalysisFallback = null,
  bare = false,
}: MyhoraChartsPanelProps) {
  const { analysis: natalAnalysis, svg: natalSvg } = resolveNatalChartPaths(
    charts,
    natalAnalysisFallback,
  )
  const hasNatal = Boolean(natalAnalysis ?? natalSvg)
  const hasRasi = Boolean(charts.rasi || charts.rasiHtml)
  const hasNavamsa = Boolean(charts.navamsa || charts.navamsaHtml)
  const hasDrekkana = Boolean(charts.drekkana || charts.drekkanaHtml)
  const hasBottom = hasNavamsa || hasDrekkana
  const hasDivisional = hasRasi || hasBottom

  return (
    <div className="myhora-charts-panel-root space-y-6">
      {hasNatal ? (
        <section className="myhora-natal-wheel-section" aria-label="กราฟดวงกำเนิดปฏิทินดาราศาสตร์ดั้งเดิม">
          {!bare ? (
            <header className="myhora-natal-wheel-header mb-3">
              <h3 className="font-display text-lg text-gradient-gold">ดวงจักรกำเนิด</h3>
              <p className="text-xs text-hora-muted">
                องศา · นวางศ์ · เส้นมุม (ปฏิทินดาราศาสตร์ดั้งเดิม)
              </p>
            </header>
          ) : null}
          <NatalChartSlot
            analysisPath={natalAnalysis}
            fallbackPath={natalSvg}
            bare={bare}
          />
        </section>
      ) : null}

      {hasDivisional ? (
        <div
          className={`myhora-charts-panel ${hasBottom ? 'myhora-charts-panel--triangle' : ''} ${bare ? 'myhora-charts-panel--bare' : ''}`.trim()}
          aria-label="กราฟราศีจักร"
        >
          {hasRasi ? (
            <div className="myhora-charts-triangle-top w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {/* ราศีจักรดวงกำเนิด (พื้นเดิม - เลขไทย) */}
                <div className="flex flex-col items-center">
                  <span className="text-center mb-2 font-display text-hora-gold text-sm font-semibold">
                    ราศีจักร (พื้นดวงเดิม - เลขไทย)
                  </span>
                  <ChartSlot
                    label="ราศีจักร"
                    embedPath={charts.rasi}
                    preparedHtml={null}
                    size="large"
                    bare={bare}
                    className="myhora-chart-rasi-stage--natal-only"
                  />
                </div>

                {/* ราศีจักรดาวจร (ดาวจร - เลขอารบิก) */}
                <div className="flex flex-col items-center">
                  <span className="text-center mb-2 font-display text-hora-gold text-sm font-semibold">
                    ราศีจักร (ตำแหน่งดาวจร - เลขอารบิก)
                  </span>
                  <ChartSlot
                    label="ราศีจักร"
                    embedPath={charts.rasi}
                    preparedHtml={null}
                    size="large"
                    bare={bare}
                    className="myhora-chart-rasi-stage--transit-only"
                  />
                </div>
              </div>
            </div>
          ) : null}

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
      ) : null}
    </div>
  )
}
