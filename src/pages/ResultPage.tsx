import { Link } from 'react-router-dom'
import { ResultDashboard } from '../components/ResultDashboard'
import { useAstrology } from '../context/AstrologyContext'
import { GlassCard } from '../components/ui/GlassCard'
import { PageAmbient } from '../components/ui/PageAmbient'
import { ScrollReveal } from '../components/ui/ScrollReveal'

export function ResultPage() {
  const { result } = useAstrology()

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

  return (
    <div className="mystic-page result-page-mystic relative space-y-8 print:space-y-5">
      <PageAmbient variant="result" />
      <ResultDashboard result={result} />
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
