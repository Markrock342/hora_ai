import type { CSSProperties, ReactNode } from 'react'
import { SignBadge } from './SignBadge'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T, index: number) => ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

interface ResultTableProps<T extends object> {
  title: string
  subtitle?: string
  columns: Column<T>[]
  rows: T[]
  emptyMessage?: string
  printSection?: boolean
  variant?: 'default' | 'chart'
  rowNumber?: boolean
  /** หน่วง animation เข้าทีละตาราง */
  staggerIndex?: number
}

export function ResultTable<T extends object>({
  title,
  subtitle,
  columns,
  rows,
  emptyMessage = 'ไม่มีข้อมูล',
  printSection = true,
  variant = 'default',
  rowNumber = false,
  staggerIndex = 0,
}: ResultTableProps<T>) {
  const isChart = variant === 'chart'
  const allColumns: Column<T>[] = rowNumber
    ? [
        {
          key: '_row',
          header: 'ลำดับ',
          align: 'center',
          className: 'w-14 tabular-nums text-hora-muted print:text-black',
          render: (_row, index) => (
            <span className="font-mono text-xs text-hora-gold-dim print:text-black">
              {index + 1}
            </span>
          ),
        },
        ...columns,
      ]
    : columns

  return (
    <section
      className={`result-table-section result-table-mystic result-table-stagger relative overflow-hidden rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md print:rounded-none print:border print:border-gray-300 print:bg-white ${
        printSection ? 'print:break-inside-avoid' : ''
      } ${isChart ? 'gold-glow result-table-mystic--chart' : ''}`}
      style={{ '--stagger-i': staggerIndex } as CSSProperties}
    >
      <div className="result-table-border-glow" aria-hidden />
      {isChart && (
        <>
          <div
            className="result-table-mandala pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-hora-gold/10 opacity-40 md:h-64 md:w-64"
            aria-hidden
          />
          <div className="result-table-mandala result-table-mandala--inner" aria-hidden />
        </>
      )}

      <header className="result-table-header relative border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-5 py-4 print:border-gray-300 print:bg-gray-100">
        <div className="result-table-header-shine" aria-hidden />
        <div className="flex items-center gap-3">
          <span className="result-table-header-icon text-hora-gold-light" aria-hidden>
            ✦
          </span>
          <div>
            <h3 className="font-display text-xl font-medium text-gradient-gold print:text-base print:font-bold print:text-black">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-hora-muted print:text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
      </header>

      <div className="relative overflow-x-auto print:overflow-visible">
        <table
          className={`report-table w-full border-collapse text-sm ${
            isChart ? 'chart-table' : ''
          } ${isChart ? 'min-w-0' : 'min-w-[480px]'}`}
        >
          <thead>
            <tr>
              {allColumns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-4 text-left md:px-5 print:border print:border-gray-300 print:px-2 print:py-1.5 print:text-black ${
                    col.align === 'center' ? 'text-center' : ''
                  } ${col.align === 'right' ? 'text-right' : ''} ${col.className ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={allColumns.length}
                  className="px-5 py-12 text-center text-hora-muted print:text-black"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="result-table-row"
                  style={{ '--row-i': rowIndex } as React.CSSProperties}
                >
                  {allColumns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-4 md:px-5 print:border print:border-gray-300 print:px-2 print:py-1.5 print:text-black ${
                        col.align === 'center' ? 'text-center' : ''
                      } ${col.align === 'right' ? 'text-right' : ''} ${col.className ?? ''}`}
                    >
                      {col.render
                        ? col.render(row, rowIndex)
                        : String(
                            (row as Record<string, unknown>)[col.key as string] ?? '—',
                          )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/** ตารางดาว — ดาว / สถิตราศี */
export { PLANET_SIGN_COLUMNS } from './resultTableColumns'

/** ตารางทักษา */
export const TAKSA_COLUMNS = [
  { key: 'taksa', header: 'ทักษา' },
  { key: 'countFrom', header: 'นับจาก' },
  { key: 'position', header: 'ตำแหน่ง' },
  {
    key: 'sign',
    header: 'ราศี',
    render: (row: { sign: string }) => <SignBadge sign={row.sign} />,
  },
] as const

/** ตารางราศี / ภพ / เรือน */
export const RASHI_BHAVA_COLUMNS = [
  { key: 'bhava', header: 'ภพ', className: 'w-16 text-center tabular-nums', align: 'center' as const },
  {
    key: 'sign',
    header: 'ราศี',
    render: (row: { sign: string }) => <SignBadge sign={row.sign} />,
  },
  { key: 'house', header: 'เรือน' },
  { key: 'lord', header: 'เจ้าเรือน' },
] as const

export type PlanetSignRow = { planet: string; siderealSign: string }
export type TaksaRow = { taksa: string; countFrom: string; position: string; sign: string }
export type RashiBhavaRow = { bhava: string; sign: string; house: string; lord: string }