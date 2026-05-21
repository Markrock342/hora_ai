interface MyhoraHtmlBlockProps {
  title: string
  subtitle?: string
  html: string | null
  className?: string
  minHeight?: number
}

export function MyhoraHtmlBlock({
  title,
  subtitle,
  html,
  className = '',
  minHeight = 120,
}: MyhoraHtmlBlockProps) {
  if (!html?.trim()) return null

  return (
    <section
      className={`myhora-html-block gold-glow rounded-2xl border border-hora-gold/25 bg-white text-gray-900 print:border-gray-300 ${className}`.trim()}
      aria-label={title}
    >
      <header className="border-b border-hora-gold/20 px-5 py-4 print:border-gray-300">
        <h3 className="font-display text-lg text-gradient-gold print:text-black">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-xs text-hora-muted print:text-gray-600">{subtitle}</p>
        ) : null}
      </header>
      <div
        className="myhora-html-body overflow-x-auto px-4 py-4 text-[13px] leading-relaxed print:text-black"
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  )
}
