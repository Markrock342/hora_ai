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

  useEffect(() => {
    if (!interactive || !html?.trim() || !bodyRef.current) return
    wireShowMoreLinks(bodyRef.current)
  }, [html, interactive])

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
        ref={bodyRef}
        className="myhora-html-body overflow-x-auto px-4 py-4 text-[13px] leading-relaxed print:text-black"
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  )
}
