import { getPlanetTheme } from '../data/planetTheme'

export function PlanetDisplay({ planet }: { planet: string }) {
  const theme = getPlanetTheme(planet)
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base font-medium"
        style={{
          color: theme.color,
          backgroundColor: theme.glow,
          boxShadow: `0 0 12px ${theme.glow}`,
        }}
      >
        {theme.symbol}
      </span>
      <span className="font-medium text-hora-cream">{planet}</span>
    </span>
  )
}
