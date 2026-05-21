/**
 * แคชผลคำนวณใน IndexedDB — ใช้ได้ทุกวันหลังคำนวณครั้งแรก
 */

import type { BirthInput } from '../types/astrology'
import type { PlaceCoords } from '../data/placeCoordinates'
import { suryayatCalendarKey } from './formulas/suryayat/calendarKey'
import type { SuryayatPlanetSigns } from '../data/suryayat100/types'

const DB_NAME = 'newhora-suryayat'
const STORE = 'charts'
const VERSION = 1

export interface CachedChartEntry {
  planets: SuryayatPlanetSigns
  lagna: string
  source: string
  savedAt: string
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve(req.result)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
  })
}

export async function getCachedChart(
  input: BirthInput,
  place: PlaceCoords,
): Promise<CachedChartEntry | null> {
  if (typeof indexedDB === 'undefined') return null
  try {
    const db = await openDb()
    const key = suryayatCalendarKey(input, place)
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(key)
      req.onsuccess = () => resolve((req.result as CachedChartEntry) ?? null)
      req.onerror = () => reject(req.error)
    })
  } catch {
    return null
  }
}

export async function setCachedChart(
  input: BirthInput,
  place: PlaceCoords,
  entry: Omit<CachedChartEntry, 'savedAt'>,
): Promise<void> {
  if (typeof indexedDB === 'undefined') return
  try {
    const db = await openDb()
    const key = suryayatCalendarKey(input, place)
    const payload: CachedChartEntry = { ...entry, savedAt: new Date().toISOString() }
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(payload, key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    /* ignore quota / private mode */
  }
}
