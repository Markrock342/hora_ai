import type { Column } from './ResultTable'
import { PlanetDisplay } from './PlanetDisplay'
import { SignBadge } from './SignBadge'
import type { HouseTableRow, PlanetTableRow, TaksaTableRow } from './dashboardTableTypes'
import type { PlanetSignRow } from '../types/astrology'

export const PLANET_TABLE_COLUMNS: Column<PlanetTableRow>[] = [
  { key: 'rowNo', header: 'ลำดับ', className: 'w-14 text-hora-muted' },
  {
    key: 'label',
    header: 'ดาว / รายการ',
    render: (row) => <PlanetDisplay planet={row.label} />,
  },
  {
    key: 'siderealSign',
    header: 'สถิตราศี',
    render: (row) => <SignBadge sign={row.siderealSign} />,
  },
  { key: 'house', header: 'เรือน' },
  { key: 'degree', header: 'องศา' },
]

export const TAKSA_TABLE_COLUMNS: Column<TaksaTableRow>[] = [
  { key: 'rowNo', header: 'ลำดับ', className: 'w-14 text-hora-muted' },
  { key: 'taksa', header: 'ทักษา' },
  { key: 'lord', header: 'เจ้าทักษา' },
  {
    key: 'sign',
    header: 'สถิตราศี',
    render: (row) => <SignBadge sign={row.sign} />,
  },
  { key: 'count', header: 'นับ' },
]

export const HOUSE_TABLE_COLUMNS: Column<HouseTableRow>[] = [
  { key: 'rowNo', header: 'ลำดับ', className: 'w-14 text-hora-muted' },
  { key: 'bhava', header: 'ภพ / เรือน' },
  {
    key: 'sign',
    header: 'ราศี',
    render: (row) => <SignBadge sign={row.sign} />,
  },
  {
    key: 'planetsIn',
    header: 'ดาวในภพ',
    render: (row) => <PlanetDisplay planet={row.planetsIn} />,
  },
]

export const PLANET_SIGN_COLUMNS: Column<PlanetSignRow>[] = [
  {
    key: 'planet',
    header: 'ดาว',
    render: (row) => <PlanetDisplay planet={row.planet} />,
  },
  {
    key: 'siderealSign',
    header: 'สถิตราศี',
    render: (row) => <SignBadge sign={row.siderealSign} />,
  },
]
