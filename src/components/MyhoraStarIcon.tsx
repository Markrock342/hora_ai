import { useState } from 'react'
import { MYHORA_PLANET_NUM } from '../data/myhoraSignCodes'
import { getPlanetTheme } from '../data/planetTheme'
import { myhoraStarImage } from '../utils/myhora/assetUrls'

interface MyhoraStarIconProps {
  planetNum: number
  className?: string
  size?: number
}

export function MyhoraStarIcon({ planetNum, className = '', size = 15 }: MyhoraStarIconProps) {
  const [broken, setBroken] = useState(false)
  const planet = MYHORA_PLANET_NUM[planetNum]
  const theme = planet ? getPlanetTheme(planet) : getPlanetTheme('อาทิตย์')

  if (broken) {
    return (
      <span
        className={`myhora-star-symbol ${className}`.trim()}
        style={{ color: theme.color, fontSize: size * 0.95 }}
        aria-hidden
      >
        {theme.symbol}
      </span>
    )
  }

  return (
    <img
      src={myhoraStarImage(planetNum)}
      alt=""
      width={size}
      height={size}
      className={`myhora-star-img ${className}`.trim()}
      onError={() => setBroken(true)}
    />
  )
}
