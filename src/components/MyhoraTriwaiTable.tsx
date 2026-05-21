import { MYHORA_PLANET_NUM } from '../data/myhoraSignCodes'
import type { MyhoraTriwaiCell } from '../types/myhora'

interface MyhoraTriwaiTableProps {
  title: string
  subtitle?: string
  grid: (MyhoraTriwaiCell | null)[][]
}

function planetLabel(num: number): string {
  return MYHORA_PLANET_NUM[num] ?? String(num)
}

export function MyhoraTriwaiTable({ title, subtitle, grid }: MyhoraTriwaiTableProps) {
  if (!grid.length) return null

  return (
    <section className="myhora-grid-section" aria-label={title}>
      <header className="myhora-grid-header">
        <h3 className="font-display text-lg text-gradient-gold print:text-black">{title}</h3>
        {subtitle ? (
          <p className="text-xs text-hora-muted print:text-gray-600">{subtitle}</p>
        ) : null}
      </header>
      <div className="myhora-triwai-wrap">
        <table className="myhora-triwai-grid">
          <tbody>
            {grid.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={
                      cell?.highlighted
                        ? 'myhora-triwai-cell myhora-triwai-cell--active'
                        : 'myhora-triwai-cell'
                    }
                  >
                    {cell ? (
                      <>
                        <span className="myhora-triwai-house">{cell.house}</span>
                        <span className="myhora-triwai-planet">{planetLabel(cell.planetNum)}</span>
                        <span className="myhora-triwai-age">{cell.ageRange}</span>
                      </>
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
