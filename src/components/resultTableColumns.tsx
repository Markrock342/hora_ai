import type { Column } from './ResultTable'
import { PlanetDisplay } from './PlanetDisplay'
import { SignBadge } from './SignBadge'
import type { PlanetSignRow } from '../types/astrology'

/** ตารางเดียว — ดาว | สถิตราศี */
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
