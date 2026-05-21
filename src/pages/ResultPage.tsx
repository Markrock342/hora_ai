import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BirthInfoBanner } from '../components/BirthInfoBanner'
import { CalculationSettingsBadge } from '../components/CalculationSettingsBadge'
import { DivisionalChakraChart } from '../components/DivisionalChakraChart'
import { TransitDateControls } from '../components/TransitDateControls'
import { PrintButton } from '../components/PrintButton'
import { ReportHeader } from '../components/ReportHeader'
import { PLANET_SIGN_COLUMNS } from '../components/resultTableColumns'
import { MyhoraDetailPanel } from '../components/MyhoraDetailPanel'
import { MyhoraExactPanel } from '../components/MyhoraExactPanel'
import { MyhoraNatalPrintSummary } from '../components/MyhoraNatalPrintSummary'
import { MyhoraTaksaTriwaiRow } from '../components/MyhoraTaksaTriwaiRow'
import { RasiChakraChart } from '../components/RasiChakraChart'
import { ResultTable } from '../components/ResultTable'
import { useAstrology } from '../context/AstrologyContext'
import { resolvePlaceCoords } from '../data/placeCoordinates'
import { GlassCard } from '../components/ui/GlassCard'
import { PageAmbient } from '../components/ui/PageAmbient'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { defaultTransitInput } from '../types/transit'
import type { TransitInput } from '../types/transit'
import { buildLocalNatalDetail, buildLocalTransitDetail } from '../utils/formulas/buildDateDetail'
import { computeDivisionalRows } from '../utils/formulas/divisionalFromBirth'
import { isMyhoraScrapeAvailable } from '../utils/myhora/fetchMyhoraThai'

export function ResultPage() {
  const { result, refreshTransit, refreshingTransit } = useAstrology()

  if (!result) {
    return (
      <div className="mystic-page result-page-mystic result-page-mystic--empty relative">
        <PageAmbient variant="result" />
        <ScrollReveal variant="scale">
        <GlassCard mystic className="mystic-empty-card text-center">
          <div className="mystic-empty-mandala" aria-hidden />
          <p className="mystic-empty-moon text-5xl text-hora-gold/60">☽</p>
          <p className="mt-4 font-display text-lg text-hora-cream">ยังไม่มีผลคำนวณ</p>
          <p className="mt-2 text-sm text-hora-muted">กรอกวันเวลาและสถานที่เกิด</p>
          <Link to="/" className="btn-primary btn-primary-mystic mt-8 inline-block">
            กรอกข้อมูลเกิด
          </Link>
        </GlassCard>
        </ScrollReveal>
      </div>
    )
  }

  const { meta, planets, input } = result
  const isMyhora = meta.calculationSource === 'myhora-scrape' && result.myhora
  const transit = result.myhora?.transit ?? defaultTransitInput()

  const place = useMemo(
    () => resolvePlaceCoords(input.country, input.province, input.district),
    [input],
  )

  const d1ForDivisional = useMemo(
    () =>
      isMyhora
        ? {
            lagna: result.meta.lagna ?? result.chart?.lagna ?? 'เมษ',
            planets: result.planets,
          }
        : undefined,
    [isMyhora, result],
  )

  const navamsaLocal = useMemo(
    () => computeDivisionalRows(input, place, 'navamsa', d1ForDivisional),
    [input, place, d1ForDivisional],
  )
  const drekkanaLocal = useMemo(
    () => computeDivisionalRows(input, place, 'drekkana', d1ForDivisional),
    [input, place, d1ForDivisional],
  )

  const canRefreshTransit = isMyhoraScrapeAvailable() && isMyhora

  const dateDetails = useMemo(() => {
    if (result.myhora?.dateDetailNatal || result.myhora?.dateDetailTransit) {
      return {
        natal: result.myhora.dateDetailNatal ?? null,
        transit: result.myhora.dateDetailTransit ?? null,
        fromMyhora: true,
      }
    }
    return {
      natal: buildLocalNatalDetail(input, place, {
        lagna: result.meta.lagna ?? result.chart?.lagna,
        navamsaLagna: navamsaLocal.lagna,
        drekkanaLagna: drekkanaLocal.lagna,
      }),
      transit: isMyhora
        ? buildLocalTransitDetail(transit, input, place)
        : null,
      fromMyhora: false,
    }
  }, [result, input, place, isMyhora, transit, navamsaLocal.lagna, drekkanaLocal.lagna])

  const sourceLabel =
    meta.calculationSource === 'myhora-scrape'
      ? 'ดึงข้อมูลออนไลน์ — กราฟ · ตารางสมผุส · คำทำนาย · ทักษา · ตรีวัย'
      : meta.calculationSource === 'suryayat-100-reference' ||
          meta.calculationSource === 'suryayat-100-year'
        ? 'ปฏิทินร้อยปี สุริยยาตร์ (ตรง myhora)'
        : meta.calculationSource === 'suryayat-cached'
          ? 'แคชในเครื่อง (คำนวณ/นำเข้าแล้ว)'
          : meta.calculationSource === 'formula-pipeline'
            ? 'สูตร: อันโตนาที + ลาหิรี + ราหู 8 + ทักษา (เทียบ myhora ต่อ)'
            : meta.calculationSource === 'ephemeris-fallback'
              ? 'ประมาณ (ephemeris)'
              : null

  return (
    <div className="mystic-page result-page-mystic relative space-y-8 print:space-y-5">
      <PageAmbient variant="result" />
      <div className="relative z-[1] flex flex-wrap items-start justify-between gap-4 no-print">
        <header className="result-page-header">
          <p className="result-page-eyebrow font-display text-sm tracking-[0.15em] text-hora-gold uppercase">
            <span className="result-page-eyebrow-icon" aria-hidden>
              ✦
            </span>{' '}
            ผลการคำนวณ
          </p>
          <h2 className="result-page-title font-display text-4xl font-medium text-hora-cream">
            สถิตร<span className="text-gradient-gold">ราศี</span>
          </h2>
          <p className="mt-2 text-sm text-hora-muted">
            {new Date(result.calculatedAt).toLocaleString('th-TH')}
            {' · '}
            {planets.length} ดาว
          </p>
        </header>
        <PrintButton result={result} />
      </div>

      <article
        id="astrology-report"
        className="astrology-report relative z-[1] space-y-6 print:space-y-5"
        aria-label="ตารางดาวสถิตรราศี"
      >
        <ReportHeader result={result} />

        {dateDetails.natal ? <MyhoraNatalPrintSummary natal={dateDetails.natal} /> : null}

        <div className="result-info-stack no-print">
          <BirthInfoBanner birth={meta.birthDisplay} location={meta.locationDisplay} />
          <CalculationSettingsBadge />
          {sourceLabel ? (
            <p className="result-source-label text-xs text-hora-gold-dim">{sourceLabel}</p>
          ) : null}
        </div>

        {canRefreshTransit && (
          <TransitDateControls
            transit={transit}
            loading={refreshingTransit}
            onApply={(next: TransitInput) => void refreshTransit(next)}
          />
        )}

        <MyhoraDetailPanel
          natal={dateDetails.natal}
          transit={dateDetails.transit}
          fromMyhora={dateDetails.fromMyhora}
        />

        {isMyhora && result.myhora ? (
          <MyhoraExactPanel tables={result.myhora} />
        ) : (
          <>
            <div className="result-charts-block space-y-6">
              <div className="result-charts-grid result-charts-grid--local">
                <div className="result-rasi-chart-slot">
                  <RasiChakraChart
                    result={result}
                    animateOnEnter
                    subtitle={
                      isMyhora
                        ? 'ตำแหน่งดาวออนไลน์ · วงจรในเครื่อง (Whole Sign)'
                        : undefined
                    }
                  />
                </div>

                <DivisionalChakraChart
                  result={result}
                  title="นวางศ์จักร"
                  subtitle={`ลัคนา ${navamsaLocal.lagna} · ปรชายาจารี + ลาหิรี`}
                  printSectionId="navamsa-chakra"
                  planets={navamsaLocal.planets}
                  lagna={navamsaLocal.lagna}
                />

                <DivisionalChakraChart
                  result={result}
                  title="ตรียางศ์จักร"
                  subtitle={`ลัคนา ${drekkanaLocal.lagna} · ปรชายาจารี + ลาหิรี`}
                  printSectionId="drekkana-chakra"
                  planets={drekkanaLocal.planets}
                  lagna={drekkanaLocal.lagna}
                />
              </div>
            </div>

            {result.myhora ? <MyhoraTaksaTriwaiRow tables={result.myhora} /> : null}

            {meta.calculationSource !== 'myhora-scrape' && (
              <p className="text-xs text-hora-muted no-print">
                ผลดาวจากสูตรในเครื่อง — อาจไม่ตรงแหล่งออนไลน์จนกว่าจะดึงข้อมูลสำเร็จ (รัน{' '}
                <code className="text-hora-gold-dim">npm run dev</code> หรือ{' '}
                <code className="text-hora-gold-dim">npm run start</code> พร้อม proxy /api/myhora)
              </p>
            )}
          </>
        )}

        {!result.myhora && (
          <ResultTable
            title="ดาวสถิตรราศี"
            subtitle="สุริยยาตร์ · ลาหิรี · อันโตนาทีฯ · ราหู ๘ กุมภ์ · ทักษา (คงที่)"
            printSectionId="sidereal-table"
            columns={PLANET_SIGN_COLUMNS}
            rows={planets}
            variant="chart"
            staggerIndex={1}
          />
        )}

        <footer className="hidden border-t border-gray-300 pt-4 text-center text-xs text-gray-500 print:block">
          NewHora — {meta.birthDisplay} — {meta.locationDisplay}
        </footer>
      </article>

      <p className="relative z-[1] text-center no-print">
        <Link
          to="/"
          className="mystic-back-link text-sm text-hora-gold-dim transition hover:text-hora-gold-light"
        >
          ← แก้ข้อมูลเกิด
        </Link>
      </p>
    </div>
  )
}
