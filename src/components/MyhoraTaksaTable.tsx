import { MYHORA_PLANET_NUM } from '../data/myhoraSignCodes'
import type { MyhoraTables } from '../types/myhora'

interface MyhoraTaksaTableProps {
  tables: MyhoraTables
}

function planetLabel(num: number | null): string {
  if (num == null) return ''
  return MYHORA_PLANET_NUM[num] ?? String(num)
}

export function MyhoraTaksaTable({ tables }: MyhoraTaksaTableProps) {
  const grid = tables.taksa
  if (!grid.length) return null

  return (
    <section className="myhora-grid-section" aria-label="ตารางทักษา">
      <header className="myhora-grid-header">
        <h3 className="font-display text-lg text-gradient-gold print:text-black">ทักษา</h3>
        <p className="text-xs text-hora-muted print:text-gray-600">แบบ myhora · นับตากลาง</p>
      </header>
      <div className="myhora-taksa-wrap">
        <table className="myhora-taksa-grid">
          <tbody>
            {grid.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={
                      cell?.highlighted
                        ? 'myhora-taksa-cell myhora-taksa-cell--active'
                        : 'myhora-taksa-cell'
                    }
                  >
                    {cell ? (
                      <>
                        {cell.label ? (
                          <span className="myhora-taksa-label">{cell.label}</span>
                        ) : null}
                        {cell.planetNum != null ? (
                          <span className="myhora-taksa-planet">{planetLabel(cell.planetNum)}</span>
                        ) : null}
                        {cell.transitLabel ? (
                          <span className="myhora-taksa-transit">{cell.transitLabel}</span>
                        ) : null}
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
