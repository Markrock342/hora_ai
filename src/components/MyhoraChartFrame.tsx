import { useRef, useState } from 'react'
import type { NatalChartDisplayOptions } from '../utils/myhora/natalChartOptions'
import { MyhoraChartDocumentFrame } from './MyhoraChartDocumentFrame'
import { MyhoraChartEmbed } from './MyhoraChartEmbed'

interface MyhoraChartFrameProps {
  embedPath: string | null
  title: string
  width: number
  height: number
  bare?: boolean
  size?: 'large' | 'small'
  preferDirectIframe?: boolean
  natalDisplayOpts?: NatalChartDisplayOptions
}

export function MyhoraChartFrame({
  embedPath,
  title,
  width,
  height,
  bare = false,
  size = 'large',
  preferDirectIframe = false,
  natalDisplayOpts,
}: MyhoraChartFrameProps) {
  const triedEmbed = useRef(false)
  const [mode, setMode] = useState<'embed' | 'document'>(
    preferDirectIframe ? 'embed' : 'document',
  )

  if (!embedPath) return null

  if (mode === 'embed') {
    return (
      <MyhoraChartEmbed
        embedPath={embedPath}
        title={title}
        size={size}
        bare={bare}
        width={width}
        height={height}
        onEmbedFailed={() => {
          triedEmbed.current = true
          setMode('document')
        }}
      />
    )
  }

  return (
    <MyhoraChartDocumentFrame
      embedPath={embedPath}
      title={title}
      width={width}
      height={height}
      natalDisplayOpts={natalDisplayOpts}
      onFailed={() => {
        if (!triedEmbed.current) {
          triedEmbed.current = true
          setMode('embed')
        }
      }}
    />
  )
}
