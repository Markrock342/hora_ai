import { useEffect, useRef } from 'react'

interface MyhoraHtmlBlockProps {
  title: string
  subtitle?: string
  html: string | null
  className?: string
  minHeight?: number
  /** เปิดลิงก์ javascript "แสดงทั้งหมด" ใน DOM */
  interactive?: boolean
}

/** สำหรับ samrap: ไม่ strip styles ของ myhora เอาต้นฉบับมาแสดงเลย */
function normalizeSamrapTableTheme(root: HTMLElement) {
  const tables = [...root.querySelectorAll<HTMLTableElement>('table')]
  tables.forEach((table, index) => {
    const colCount = table.rows[0]?.cells.length ?? 0
    const isPlanets = index === 0 && colCount <= 6

    table.classList.add('myhora-samrap-table')
    table.classList.add(isPlanets ? 'myhora-samrap-table--planets' : 'myhora-samrap-table--grid')
  })
}

function wireShowMoreLinks(root: HTMLElement) {
  const links = root.querySelectorAll<HTMLAnchorElement>('a[href^="javascript"]')
  for (const link of links) {
    const label = (link.textContent ?? '').replace(/\s+/g, ' ')
    if (!/แสดง/.test(label)) continue

    link.addEventListener('click', (e) => {
      e.preventDefault()
      const panel = link.closest('.myhora-html-body') ?? root
      let target: HTMLElement | null = null

      const row = link.closest('tr')
      if (row?.nextElementSibling instanceof HTMLElement) {
        target = row.nextElementSibling
      }

      if (!target) {
        let sib: Element | null = link.nextElementSibling
        while (sib) {
          if (sib instanceof HTMLElement) {
            const style = sib.getAttribute('style') ?? ''
            const hidden = /display\s*:\s*none/i.test(style)
            const textLen = (sib.textContent ?? '').trim().length
            if (hidden || textLen > 40) {
              target = sib
              break
            }
          }
          sib = sib.nextElementSibling
        }
      }

      if (!target) {
        const hiddenBlocks = panel.querySelectorAll<HTMLElement>('[style*="display:none"], [style*="display: none"]')
        for (const el of hiddenBlocks) {
          if ((el.textContent ?? '').trim().length > 60) {
            target = el
            break
          }
        }
      }

      if (target) {
        target.style.display = 'block'
        target.style.visibility = 'visible'
        target.style.overflow = 'visible'
        target.style.maxHeight = 'none'
        target.style.height = 'auto'
      }

      const hideParent = link.closest('[style*="overflow:hidden"], [style*="overflow: hidden"]')
      if (hideParent instanceof HTMLElement) {
        hideParent.style.overflow = 'visible'
        hideParent.style.maxHeight = 'none'
        hideParent.style.height = 'auto'
      }

      link.style.display = 'none'
    })
  }
}

export function MyhoraHtmlBlock({
  title,
  subtitle,
  html,
  className = '',
  minHeight = 120,
  interactive = true,
}: MyhoraHtmlBlockProps) {
  const bodyRef = useRef<HTMLDivElement>(null)

  const isSamrap = className.includes('samrap')

  useEffect(() => {
    if (!html?.trim() || !bodyRef.current) return
    if (isSamrap) normalizeSamrapTableTheme(bodyRef.current)
    if (interactive) wireShowMoreLinks(bodyRef.current)
  }, [html, interactive, isSamrap])

  if (!html?.trim()) return null

  return (
    <section
      className={`myhora-html-block gold-glow rounded-2xl border border-hora-gold/25 bg-hora-panel/80 backdrop-blur-md print:border-gray-300 print:bg-white ${isSamrap ? 'myhora-html-block--samrap-outer' : 'overflow-hidden'} ${className}`.trim()}
      aria-label={title}
    >
      <header className="border-b border-hora-gold/20 bg-gradient-to-r from-hora-panel-light/90 to-hora-panel/60 px-5 py-4 print:border-gray-300 print:bg-gray-100">
        <h3 className="font-display text-xl font-medium text-gradient-gold print:text-black">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-xs text-hora-muted print:text-gray-600">{subtitle}</p>
        ) : null}
      </header>
      <div
        ref={bodyRef}
        className={`myhora-html-body text-[13px] leading-relaxed print:text-black${
          isSamrap
            ? ' myhora-html-body--samrap bg-white px-3 py-3'
            : ' overflow-x-auto px-4 py-4 text-hora-cream'
        }`}
        style={{ minHeight }}
      >
        {isSamrap ? (
          <div className="flex flex-nowrap items-start w-max mx-auto" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </div>
    </section>
  )
}
