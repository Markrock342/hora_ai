import type { MyhoraTables } from '../types/myhora'
import { myhoraTaksaBg } from '../utils/myhora/assetUrls'
import { MyhoraStarIcon } from './MyhoraStarIcon'

interface MyhoraTaksaTableProps {
  tables: MyhoraTables
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
        <table className="myhora-taksa-grid myhora-taksa-grid--native">
          <tbody>
            {grid.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  const bg = cell && !cell.isCenter ? myhoraTaksaBg(cell.highlighted) : null
                  return (
                    <td
                      key={ci}
                      className={
                        cell?.isCenter
                          ? 'myhora-taksa-cell myhora-taksa-cell--center'
                          : cell?.highlighted
                            ? 'myhora-taksa-cell myhora-taksa-cell--active'
                            : 'myhora-taksa-cell'
                      }
                      style={bg ? { backgroundImage: `url('${bg}')` } : undefined}
                    >
                      {cell?.isCenter ? (
                        <MyhoraStarIcon planetNum={9} className="myhora-taksa-ketu" size={16} />
                      ) : cell ? (
                        <>
                          {cell.label ? (
                            <span className="myhora-taksa-label">{cell.label}</span>
                          ) : null}
                          {cell.planetNum != null ? (
                            <MyhoraStarIcon
                              planetNum={cell.planetNum}
                              className="myhora-taksa-star"
                            />
                          ) : null}
                          {cell.transitLabel ? (
                            <span className="myhora-taksa-transit">{cell.transitLabel}</span>
                          ) : null}
                        </>
                      ) : null}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
