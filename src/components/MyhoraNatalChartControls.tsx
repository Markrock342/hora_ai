import {
  NATAL_HOUSE_OPTIONS,
  NATAL_OUTER_OPTIONS,
  NATAL_STD_OPTIONS,
  type NatalChartDisplayOptions,
  type NatalHouseMode,
  type NatalOuterMode,
} from '../utils/myhora/natalChartOptions'

interface MyhoraNatalChartControlsProps {
  options: NatalChartDisplayOptions
  onChange: (next: NatalChartDisplayOptions) => void
  /** มี HTML analysis (cn-chart) — ถ้าไม่มี ซ่อนเรือน/เกษตร */
  hasAnalysisLayer?: boolean
}

function ControlRow({
  checked,
  onCheckedChange,
  selectValue,
  onSelectChange,
  options,
  selectDisabled,
  checkboxDisabled,
  checkboxTitle,
}: {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  selectValue: string
  onSelectChange: (v: string) => void
  options: { value: string; label: string }[]
  selectDisabled?: boolean
  checkboxDisabled?: boolean
  checkboxTitle?: string
}) {
  return (
    <div className="myhora-natal-control-row">
      <label className="myhora-natal-control-check">
        <input
          type="checkbox"
          checked={checked}
          disabled={checkboxDisabled}
          title={checkboxTitle}
          onChange={(e) => onCheckedChange(e.target.checked)}
        />
      </label>
      <select
        className="myhora-natal-control-select"
        value={selectValue}
        disabled={selectDisabled || !checked}
        onChange={(e) => onSelectChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function MyhoraNatalChartControls({
  options,
  onChange,
  hasAnalysisLayer = true,
}: MyhoraNatalChartControlsProps) {
  const patch = (partial: Partial<NatalChartDisplayOptions>) => onChange({ ...options, ...partial })

  return (
    <aside className="myhora-natal-chart-controls" aria-label="ตัวเลือกกราฟดวงกำเนิด">
      {hasAnalysisLayer ? (
        <>
          <ControlRow
            checked={options.showHouses}
            onCheckedChange={(showHouses) => patch({ showHouses })}
            selectValue={options.houseMode}
            onSelectChange={(houseMode) => patch({ houseMode: houseMode as NatalHouseMode })}
            options={NATAL_HOUSE_OPTIONS}
            checkboxTitle="แสดงเรือนชะตา"
          />
          <ControlRow
            checked={options.showStd}
            onCheckedChange={(showStd) => patch({ showStd })}
            selectValue={options.stdMode}
            onSelectChange={(stdMode) => patch({ stdMode })}
            options={NATAL_STD_OPTIONS}
            checkboxTitle="แสดงดาวมาตรฐาน"
          />
        </>
      ) : null}

      <ControlRow
        checked={options.showOuter}
        onCheckedChange={(showOuter) => patch({ showOuter })}
        selectValue={options.outerMode}
        onSelectChange={(outerMode) => patch({ outerMode: outerMode as NatalOuterMode })}
        options={NATAL_OUTER_OPTIONS}
        checkboxDisabled
        checkboxTitle="นวางศ์/ตรียางศ์กำเนิด (เปิดตลอดบน myhora)"
      />

      <label className="myhora-natal-control-aspect">
        <input
          type="checkbox"
          checked={options.aspectLines}
          onChange={(e) => patch({ aspectLines: e.target.checked })}
        />
        <span>เส้นมุมสัมพันธ์</span>
      </label>
    </aside>
  )
}
