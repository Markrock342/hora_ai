import { printSection } from '../utils/sectionPrint'

interface SectionPrintButtonProps {
  sectionId: string
  /** ข้อความ aria-label เช่น "พิมพ์ ราศีจักร" */
  label: string
  documentTitle?: string
}

/** ไอคอนเครื่องพิมพ์สีทอง (ไม่ใช้อีโมจีระบบที่เป็นสีม่วง) */
function PrinterIconGold() {
  return (
    <svg
      className="section-print-btn-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M7 8V4h10v4M7 16v4h10v-4M5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 12h.01M17 12h.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SectionPrintButton({
  sectionId,
  label,
  documentTitle,
}: SectionPrintButtonProps) {
  return (
    <button
      type="button"
      className="section-print-btn no-print"
      aria-label={label}
      title={label}
      onClick={() => printSection(sectionId, documentTitle)}
    >
      <PrinterIconGold />
    </button>
  )
}
