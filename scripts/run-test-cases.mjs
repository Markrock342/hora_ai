#!/usr/bin/env node
/**
 * เทียบผลคำนวณกับ docs/test-cases.json
 *   npx vite-node scripts/run-test-cases.mjs
 */
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { resolvePlaceCoords } from '../src/data/placeCoordinates.ts'
import { computeFullChartSync } from '../src/utils/formulas/pipeline.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const suite = JSON.parse(readFileSync(join(root, 'docs/test-cases.json'), 'utf8'))

let pass = 0
let fail = 0

for (const c of suite.cases) {
  const place = resolvePlaceCoords(
    c.input.country,
    c.input.province,
    c.input.district,
  )
  const chart = computeFullChartSync(c.input, place)
  const got = Object.fromEntries(chart.planets.map((p) => [p.planet, p.siderealSign]))
  const planetErrors = []
  for (const [planet, exp] of Object.entries(c.expectedPlanets)) {
    if (got[planet] !== exp) {
      planetErrors.push(`${planet}: got ${got[planet]} want ${exp}`)
    }
  }
  const lagnaOk = chart.lagna === c.expectedLagna
  const ok = planetErrors.length === 0 && lagnaOk
  if (ok) {
    pass++
    console.log('PASS', c.id)
  } else {
    fail++
    console.log('FAIL', c.id)
    if (c.note) console.log('     ', c.note)
    for (const e of planetErrors) console.log('     ', e)
    if (!lagnaOk) {
      console.log('      lagna: got', chart.lagna, 'want', c.expectedLagna)
    }
    console.log('      source:', chart.source)
  }
}

console.log('---')
console.log(`${pass} passed, ${fail} failed, ${suite.cases.length} total`)
process.exit(fail > 0 ? 1 : 0)
