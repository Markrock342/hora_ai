/**
 * Orchestrator คำนวณ — อย่าใส่สูตรยาวในไฟล์นี้
 * ตอนนี้: mock จาก data/mockAstrologyResult.ts
 * อนาคต: เรียก utils/formulas/* แล้ว map เป็น AstrologyResult เดิม
 * @see docs/FORMULA_SOURCES.md
 */

import type { AstrologyResult, BirthInput } from '../types/astrology'
import { buildMockAstrologyResult } from '../data/mockAstrologyResult'

export function calculateAstrology(input: BirthInput): AstrologyResult {
  // TODO: if (useRealFormulas) return buildRealAstrologyResult(input)
  return buildMockAstrologyResult(input)
}
