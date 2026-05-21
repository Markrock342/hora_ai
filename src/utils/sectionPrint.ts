/** พิมพ์เฉพาะส่วนที่มี data-print-section ตรงกับ sectionId */
export function printSection(sectionId: string, documentTitle?: string): void {
  const target = document.querySelector<HTMLElement>(
    `[data-print-section="${sectionId}"]`,
  )
  if (!target) return

  document.querySelectorAll('.print-section-target').forEach((el) => {
    el.classList.remove('print-section-target')
  })
  target.classList.add('print-section-target')
  document.body.classList.add('is-section-print')
  document.body.setAttribute('data-print-section', sectionId)

  const prevTitle = document.title
  if (documentTitle) document.title = documentTitle

  const cleanup = () => {
    target.classList.remove('print-section-target')
    document.body.classList.remove('is-section-print')
    document.body.removeAttribute('data-print-section')
    document.title = prevTitle
    window.removeEventListener('afterprint', cleanup)
  }

  window.addEventListener('afterprint', cleanup)
  window.print()
}
