/**
 * Orchestrator คำนวณ — เรียก utils/formulas/*
 * @see docs/FORMULA_SOURCES.md
 */

import type { AstrologyResult, BirthInput } from '../types/astrology'
import { buildMockAstrologyResult } from '../data/mockAstrologyResult'
import {
  buildRealAstrologyResult,
  buildRealAstrologyResultAsync,
} from './formulas/buildRealAstrologyResult'

/** false = mock (debug UI) */
const USE_REAL_FORMULAS = true

export function calculateAstrology(input: BirthInput): AstrologyResult {
  if (!USE_REAL_FORMULAS) {
    return buildMockAstrologyResult(input)
  }
  try {
    return buildRealAstrologyResult(input)
  } catch (err) {
    console.error('[newhora] real calculation failed, using mock', err)
    return buildMockAstrologyResult(input)
  }
}

export async function calculateAstrologyAsync(
  input: BirthInput,
): Promise<AstrologyResult> {
  if (!USE_REAL_FORMULAS) {
    return buildMockAstrologyResult(input)
  }
  try {
    return await buildRealAstrologyResultAsync(input)
  } catch (err) {
    console.error('[newhora] real calculation failed, using mock', err)
    return buildMockAstrologyResult(input)
  }
}
