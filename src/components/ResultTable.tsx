import type { ReactNode } from 'react'
import { PlanetDisplay } from './PlanetDisplay'
import { SignBadge } from './SignBadge'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T, index: number) => ReactNode
  className?: string
}

interface ResultTableProps<T extends object> {
  title: string
  subtitle?: string
  columns: Column<T>[]
  rows: T[]
  emptyMessage?: string
  printSection?: boolean
  variant?: 'default' | 'chart'
}

export function ResultTable<T extends object>({
  title,
  subtitle,
  columns,
  rows,
  emptyMessage = 'ไม่มีข้อมูล',
  printSection = true,
  variant = 'default',
}: ResultTableProps<T>) {
  const isChart = variant === 'chart'

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md print:rounded-none print:border print:border-gray-300 print:bg-white ${
        printSection ? 'print:break-inside-avoid' : ''
      } ${isChart ? 'gold-glow' : ''}`}
    >
      {isChart && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-hora-gold/10 opacity-40 md:h-64 md:w-64"
          aria-hidden
        />
      )}

      <header className="relative border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-5 py-4 print:border-gray-300 print:bg-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-hora-gold-light">✦</span>
          <div>
            <h3 className="font-display text-xl font-medium text-gradient-gold print:text-base print:font-bold print:text-black">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-hora-muted print:hidden">{subtitle}</p>
            )}
          </div>
        </div>
      </header>

      <div className="relative overflow-x-auto print:overflow-visible">
        <table
          className={`report-table w-full border-collapse text-sm ${
            isChart ? 'chart-table' : ''
          } ${isChart ? 'min-w-0' : 'min-w-[400px]'}`}
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-5 text-left print:border print:border-gray-300 print:px-2 print:py-1.5 print:text-black ${col.className ?? ''}`}
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
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-hora-muted print:text-black"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-5 print:border print:border-gray-300 print:px-2 print:py-1.5 print:text-black ${col.className ?? ''}`}
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

/** คอลัมน์มาตรฐาน ดาว / สถิตราศี */
export const PLANET_SIGN_COLUMNS = [
  {
    key: 'planet',
    header: 'ดาว',
    render: (row: { planet: string }) => <PlanetDisplay planet={row.planet} />,
  },
  {
    key: 'siderealSign',
    header: 'สถิตราศี',
    render: (row: { siderealSign: string }) => <SignBadge sign={row.siderealSign} />,
  },
]
