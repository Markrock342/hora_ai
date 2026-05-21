import type { MyhoraTables } from '../types/myhora'
import { MyhoraTaksaTable } from './MyhoraTaksaTable'
import { MyhoraTriwaiTable } from './MyhoraTriwaiTable'

interface MyhoraTaksaTriwaiRowProps {
  tables: MyhoraTables
}

/** ทักษา + ตรีวัย ซ้าย–ขวา (ตารางในแอป — ไม่ใช้ iframe เพื่อไม่ให้รูปพัง) */
export function MyhoraTaksaTriwaiRow({ tables }: MyhoraTaksaTriwaiRowProps) {
  const { taksa, triwaiNatal, triwaiTransit } = tables
  if (!taksa.length && !triwaiNatal.length) return null

  return (
    <div className="myhora-taksa-triwai-row">
      {taksa.length > 0 ? <MyhoraTaksaTable tables={tables} /> : null}
      <div className="myhora-triwai-column">
        {triwaiNatal.length > 0 ? (
          <MyhoraTriwaiTable title="ตรีวัย" subtitle="ดวงกำเนิด" grid={triwaiNatal} />
        ) : null}
        {triwaiTransit.length > 0 ? (
          <MyhoraTriwaiTable
            title="ตรีวัย"
            subtitle="ดวงจร (วันจร)"
            grid={triwaiTransit}
          />
        ) : null}
      </div>
    </div>
  )
}
