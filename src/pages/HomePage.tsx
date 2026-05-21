import { BirthForm } from '../components/BirthForm'

export function HomePage() {
  return (
    <div className="space-y-8">
      <header className="relative max-w-2xl">
        <p className="mb-2 font-display text-sm tracking-[0.2em] text-hora-gold uppercase">
          คำนวณตำแหน่งดาว
        </p>
        <h2 className="font-display text-4xl font-medium leading-tight text-hora-cream md:text-5xl">
          ดวงชะตา
          <span className="text-gradient-gold"> สถิตรราศี</span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-hora-muted">
          กรอกวัน เดือน ปี เวลา และสถานที่เกิด — ผลลัพธ์เป็นตาราง{' '}
          <strong className="font-medium text-hora-gold-light">ดาว</strong> /{' '}
          <strong className="font-medium text-hora-gold-light">สถิตราศี</strong>
        </p>
      </header>
      <BirthForm />
    </div>
  )
}
