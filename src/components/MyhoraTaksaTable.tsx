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
    <section className="myhora-grid-section myhora-grid-section--taksa" aria-label="ตารางทักษา">
      <header className="myhora-grid-header border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-4 py-3">
        <h3 className="font-display text-lg font-medium text-gradient-gold print:text-black">ทักษา</h3>
        <p className="text-xs text-hora-muted print:text-gray-600">นับตากลาง</p>
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
                        <div className="myhora-grid-cell-inner myhora-grid-cell-inner--solo">
                          <MyhoraStarIcon planetNum={9} className="myhora-taksa-ketu" size={18} />
                        </div>
                      ) : cell ? (
                        <div className="myhora-grid-cell-inner">
                          <span className="myhora-taksa-label myhora-grid-cell-top">
                            {cell.label || '\u00a0'}
                          </span>
                          <span className="myhora-grid-cell-mid">
                            {cell.planetNum != null ? (
                              <MyhoraStarIcon
                                planetNum={cell.planetNum}
                                className="myhora-taksa-star"
                                size={17}
                              />
                            ) : null}
                          </span>
                          <span className="myhora-taksa-transit myhora-grid-cell-bottom">
                            {cell.transitLabel || '\u00a0'}
                          </span>
                        </div>
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
