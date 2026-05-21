import { getSignTheme } from '../data/planetTheme'

export function SignBadge({ sign }: { sign: string }) {
  const theme = getSignTheme(sign)
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold tracking-wide"
      style={{
        color: theme.hue,
        borderColor: `${theme.hue}55`,
        backgroundColor: theme.bg,
      }}
    >
      {sign}
    </span>
  )
}
