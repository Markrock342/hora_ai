import type { MyhoraTables } from '../types/myhora'

interface MyhoraSummaryBannerProps {
  tables: MyhoraTables
}

export function MyhoraSummaryBanner({ tables }: MyhoraSummaryBannerProps) {
  if (!tables.summaryNatal && !tables.summaryTransit) return null

  return (
    <div className="myhora-summary rounded-xl border border-hora-gold/20 bg-hora-panel/60 px-4 py-3 text-sm text-hora-cream print:border-gray-300 print:bg-gray-50 print:text-black">
      {tables.summaryNatal ? (
        <p>
          <span className="text-hora-gold-dim print:text-gray-600">ดวงกำเนิด: </span>
          {tables.summaryNatal}
        </p>
      ) : null}
      {tables.summaryTransit ? (
        <p className="mt-2">
          <span className="text-hora-gold-dim print:text-gray-600">วันจร: </span>
          {tables.summaryTransit}
        </p>
      ) : null}
    </div>
  )
}
