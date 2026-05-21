import { type CSSProperties } from 'react'
import { BirthForm } from '../components/BirthForm'
import { useEnterMotion } from '../hooks/useEnterMotion'
import heroImage from '../assets/hero-wheel.png'

export function HomePage() {
  const motionReady = useEnterMotion(40)

  return (
    <div
      className={`home-page mystic-page home-page-mystic home-page--pro page-stagger-root${motionReady ? ' is-motion-ready' : ''}`}
    >
      <section
        className={`home-hero-split home-hero-split--clean home-hero-split--refined home-hero-split--lux motion-block${motionReady ? ' is-revealed' : ''}`}
        aria-labelledby="home-title"
      >
        <div className="home-hero-split__visual" aria-hidden>
          <img
            src={heroImage}
            alt=""
            className="home-hero-split__img"
            loading="eager"
            decoding="async"
          />
          <div className="home-hero-visual-glow" />
          <div className="home-hero-visual-vignette" />
          <div className="home-hero-visual-frame" />
        </div>

        <div className="home-hero-split__content home-hero-content">
          <p className="home-hero-badge motion-item" style={{ '--motion-i': 0 } as CSSProperties}>
            <span className="home-hero-badge-star" aria-hidden>
              ✦
            </span>
            โหราศาสตร์ไทย · สถิตราศี
          </p>
          <h1 id="home-title" className="home-hero-title">
            <span
              className="home-hero-title-line motion-item"
              style={{ '--motion-i': 1 } as CSSProperties}
            >
              คำนวณ
            </span>
            <span
              className="home-hero-title-gold text-gradient-gold motion-item"
              style={{ '--motion-i': 2 } as CSSProperties}
            >
              ดวงชะตา
            </span>
          </h1>
          <p className="home-hero-lead motion-item" style={{ '--motion-i': 3 } as CSSProperties}>
            กรอกวัน เดือน ปี เวลา และสถานที่เกิด — ผลลัพธ์ตาราง ดาว | สถิตราศี
          </p>
          <ul className="home-hero-features">
            {['สุริยยาตร์', 'ลาหิรี', 'อันโตนาทีฯ', 'ราหู ๘ กุมภ์'].map((item, i) => (
              <li
                key={item}
                className="motion-item"
                style={{ '--motion-i': 4 + i } as CSSProperties}
              >
                <span className="home-hero-feature-dot" aria-hidden>
                  ✦
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="home-scroll-cue motion-item" style={{ '--motion-i': 8 } as CSSProperties} aria-hidden>
            <span>กรอกข้อมูลด้านล่าง</span>
            <span className="home-scroll-cue-line" />
          </div>
        </div>
      </section>

      <BirthForm />
    </div>
  )
}
