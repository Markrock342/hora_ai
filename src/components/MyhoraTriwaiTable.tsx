import type { MyhoraTriwaiCell } from '../types/myhora'
import { myhoraTriwaiBg } from '../utils/myhora/assetUrls'
import { MyhoraStarIcon } from './MyhoraStarIcon'

interface MyhoraTriwaiTableProps {
  title: string
  subtitle?: string
  grid: (MyhoraTriwaiCell | null)[][]
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
        <table className="myhora-triwai-grid myhora-triwai-grid--native">
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
                    style={
                      cell
                        ? { backgroundImage: `url('${myhoraTriwaiBg(cell.highlighted)}')` }
                        : undefined
                    }
                  >
                    {cell ? (
                      <>
                        <span className="myhora-triwai-house">{cell.house}</span>
                        <MyhoraStarIcon planetNum={cell.planetNum} className="myhora-triwai-star" />
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
