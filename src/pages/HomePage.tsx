import { BirthForm } from '../components/BirthForm'
import heroImage from '../assets/cosmic-bg-16x9.png'

export function HomePage() {
  return (
    <div className="home-page mystic-page home-page-mystic">
      <section className="home-hero-cinematic home-hero-mystic" aria-labelledby="home-title">
        <div className="home-hero-orbit-ring" aria-hidden />
        <div className="home-hero-cinematic-bg" aria-hidden>
          <img
            src={heroImage}
            alt=""
            className="home-hero-image"
            loading="eager"
            decoding="async"
          />
          <div className="home-hero-scrim" />
          <div className="home-hero-stars" />
          <div className="home-hero-light-ray" />
        </div>

        <div className="home-hero-content">
          <p className="home-hero-badge">
            <span className="home-hero-badge-star" aria-hidden>
              ✦
            </span>
            โหราศาสตร์ไทย · สถิตรราศี
          </p>
          <h1 id="home-title" className="home-hero-title">
            <span className="home-hero-title-line">คำนวณ</span>
            <span className="home-hero-title-gold text-gradient-gold"> ดวงชะตา</span>
          </h1>
          <p className="home-hero-lead">
            กรอกวัน เดือน ปี เวลา และสถานที่เกิด — ผลลัพธ์ตาราง ดาว | สถิตราศี
          </p>
          <ul className="home-hero-features">
            {['สุริยยาตร์', 'ลาหิรี', 'อันโตนาทีฯ', 'ราหู ๘ กุมภ์'].map((item, i) => (
              <li key={item} style={{ animationDelay: `${400 + i * 100}ms` }}>
                <span className="home-hero-feature-dot" aria-hidden>
                  ✦
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="home-scroll-cue no-print" aria-hidden>
            <span>เลื่อนลงกรอกข้อมูล</span>
            <span className="home-scroll-cue-line" />
          </div>
        </div>
      </section>

      <BirthForm />
    </div>
  )
}
