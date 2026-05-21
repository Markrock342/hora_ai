import { useEffect } from 'react'

import {

  COUNTRIES,

  districtsForProvince,

  THAI_PROVINCES,

} from '../data/locationData'

import type { BirthFormErrors, BirthInput } from '../types/astrology'

import { useErrorFlash } from '../hooks/useErrorFlash'
import { InputField } from './InputField'



interface LocationSelectProps {

  country: string

  province: string

  district: string

  errors: Pick<BirthFormErrors, 'country' | 'province' | 'district'>

  errorFlashKey?: number

  onChange: (patch: Partial<Pick<BirthInput, 'country' | 'province' | 'district'>>) => void

}



const COUNTRY_META: Record<string, { flag: string; label: string }> = {

  ไทย: { flag: '🇹🇭', label: 'ไทย' },

  ลาว: { flag: '🇱🇦', label: 'ลาว' },

  มาเลเซีย: { flag: '🇲🇾', label: 'มาเลเซีย' },

  อื่นๆ: { flag: '🌏', label: 'อื่นๆ' },

}



export function LocationSelect({

  country,

  province,

  district,

  errors,

  errorFlashKey = 0,

  onChange,

}: LocationSelectProps) {

  const countryErrorFlash = useErrorFlash(Boolean(errors.country), errorFlashKey)

  const isThailand = country === 'ไทย'

  const districtSuggestions = isThailand ? districtsForProvince(province) : []

  const districtListId = province ? `district-list-${province.replace(/\s/g, '-')}` : undefined

  const locationFilled = Boolean(country && province.trim() && district.trim())

  const safeCountry = COUNTRIES.includes(country as (typeof COUNTRIES)[number])

    ? country

    : 'ไทย'



  useEffect(() => {

    if (country !== safeCountry) {

      onChange({ country: safeCountry, province: '', district: '' })

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [])



  return (

    <div className="location-panel">

      <div className="location-layout">

        <div

          className={`location-block location-block--country ${errors.country ? 'location-block--error' : ''}${countryErrorFlash ? ' location-block--error-flash' : ''}`}

        >

          <div className="location-block-head">

            <span className="location-block-icon" aria-hidden>
              ◉
            </span>

            <div>

              <p className="location-block-label">

                ประเทศ <span className="location-required">*</span>

              </p>

              <p className="location-block-hint">เลือกประเทศที่เกิด</p>

            </div>

          </div>



          <div className="country-pill-grid" role="radiogroup" aria-label="เลือกประเทศ">

            {COUNTRIES.map((c, i) => {

              const meta = COUNTRY_META[c]

              const active = safeCountry === c

              return (

                <button

                  key={c}

                  type="button"

                  role="radio"

                  aria-checked={active}

                  className={`country-pill ${active ? 'country-pill--active' : ''}`}

                  style={{ animationDelay: `${i * 60}ms` }}

                  onClick={() => onChange({ country: c, province: '', district: '' })}

                >

                  <span className="country-pill-glow" aria-hidden />

                  <span className="country-pill-flag" aria-hidden>

                    {meta.flag}

                  </span>

                  <span className="country-pill-label">{meta.label}</span>

                  {active && (

                    <span className="country-pill-check" aria-hidden>

                      ✓

                    </span>

                  )}

                </button>

              )

            })}

          </div>



          {errors.country && (

            <p className="location-block-error" role="alert">

              {errors.country}

            </p>

          )}

        </div>



        <div className="location-address-grid">

          <InputField

            id="province"

            label="จังหวัด / รัฐ"

            required

            filled={Boolean(province.trim())}

            error={errors.province}

            errorFlashKey={errorFlashKey}

            hint={isThailand ? 'เลือกจากรายการจังหวัดไทย' : 'พิมพ์ชื่อจังหวัดหรือรัฐ'}

            control={isThailand ? 'select' : 'default'}

          >

            {isThailand ? (

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

            ) : (

              <input

                id="province"

                type="text"

                className="hora-input hora-input-3d"

                placeholder="เช่น California"

                value={province}

                onChange={(e) => onChange({ province: e.target.value })}

                autoComplete="address-level1"

              />

            )}

          </InputField>



          <InputField

            id="district"

            label="อำเภอ / เมือง"

            required

            filled={Boolean(district.trim())}

            error={errors.district}

            errorFlashKey={errorFlashKey}

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

              placeholder={isThailand ? 'เช่น เมือง / เขต' : 'เช่น เมือง'}

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



      {locationFilled && !errors.country && !errors.province && !errors.district && (

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


