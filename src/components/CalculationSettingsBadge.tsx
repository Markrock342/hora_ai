import { CALCULATION_SETTINGS_LABELS } from '../data/calculationSettings'

export function CalculationSettingsBadge() {
  return (
    <div className="settings-capsule calculation-settings-mystic rounded-xl border border-hora-gold/15 bg-hora-bg/30 px-4 py-3 backdrop-blur-sm">
      <p className="text-[10px] font-medium tracking-[0.2em] text-hora-gold-dim uppercase">
        ระบบคำนวณ
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {CALCULATION_SETTINGS_LABELS.map(({ label }) => (
          <li
            key={label}
            className="mystic-chip rounded-full border border-hora-gold/15 bg-hora-panel/60 px-2.5 py-0.5 text-[11px] text-hora-muted"
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
