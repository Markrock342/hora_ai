import {
  districtsForProvince,
  THAI_PROVINCES,
} from '../data/locationData'
import type { BirthFormErrors, BirthInput } from '../types/astrology'
import { InputField } from './InputField'

interface LocationSelectProps {
  province: string
  district: string
  errors: Pick<BirthFormErrors, 'province' | 'district'>
  onChange: (patch: Partial<Pick<BirthInput, 'province' | 'district'>>) => void
}

export function LocationSelect({
  province,
  district,
  errors,
  onChange,
}: LocationSelectProps) {
  const districtSuggestions = districtsForProvince(province)
  const districtListId = province ? `district-list-${province.replace(/\s/g, '-')}` : undefined
  const locationFilled = Boolean(province.trim() && district.trim())

  return (
    <div className="location-panel">
      <div className="location-layout">
        <div className="location-address-grid">
          <InputField
            id="province"
            label="จังหวัด"
            required
            filled={Boolean(province.trim())}
            error={errors.province}
            hint="เลือกจากรายการจังหวัดไทย"
            control="select"
          >
            <select
              id="province"
              className="hora-input hora-input-3d hora-select"
              value={province}
              onChange={(e) => onChange({ province: e.target.value, district: '' })}
            >
              <option value="">เลือกจังหวัด</option>
              {THAI_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </InputField>

          <InputField
            id="district"
            label="อำเภอ / เมือง"
            required
            filled={Boolean(district.trim())}
            error={errors.district}
            hint={
              districtSuggestions.length > 0
                ? 'เลือกจากรายการหรือพิมพ์เอง'
                : 'ชื่ออำเภอ เขต หรือเมือง'
            }
          >
            <input
              id="district"
              type="text"
              className="hora-input hora-input-3d"
              placeholder="เช่น เมือง / เขต"
              value={district}
              onChange={(e) => onChange({ district: e.target.value })}
              list={districtListId}
              autoComplete="address-level2"
            />
            {districtListId && districtSuggestions.length > 0 && (
              <datalist id={districtListId}>
                {districtSuggestions.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            )}
          </InputField>
        </div>
      </div>

      {locationFilled && !errors.province && !errors.district && (
        <p className="location-ready-badge">
          <span className="location-ready-sparkle" aria-hidden>
            ✦
          </span>
          พร้อมระบุพิกัดสถานที่เมื่อคำนวณ
        </p>
      )}
    </div>
  )
}
