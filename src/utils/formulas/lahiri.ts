/** อายนางศา ลาหิรี (ใกล้เคียง Swiss Ephemeris SE_SIDM_LAHIRI) */

export function lahiriAyanamsaDegrees(julianUt: number): number {
  const t = (julianUt - 2451545.0) / 36525.0
  const arcsec =
    5028.796195 * t +
    1.1124348 * t * t +
    (t * t * t) / 467410 -
    (t * t * t * t) / 60616000
  return (22.460148 + arcsec / 3600) % 360
}

export function tropicalToSidereal(tropicalLon: number, julianUt: number): number {
  let sid = tropicalLon - lahiriAyanamsaDegrees(julianUt)
  sid = ((sid % 360) + 360) % 360
  return sid
}
