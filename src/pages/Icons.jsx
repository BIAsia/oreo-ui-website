import { Dithering } from '@paper-design/shaders-react'
import Navbar from '../components/Navbar'
import OreoIcon from '../components/OreoIcon'
import EmailForm from '../components/EmailForm'
import styles from './Icons.module.css'

export default function Icons() {
  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <div className={styles.hero}>
        <Dithering
          speed={1}
          shape="swirl"
          type="8x8"
          size={5.8}
          scale={2.63}
          colorBack="#00000000"
          colorFront="#E2E2E2"
          style={{ width: '100%', height: '100%' }}
        />
        <div className={styles.heroContent}>
          <OreoIcon size={48} />
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>1700 Icons for Agents</h1>
            <p className={styles.subtitle}>Coming soon</p>
          </div>
          <EmailForm />
        </div>
      </div>

      {/* Card */}
      <div className={styles.cardContainer}>
        <div className={styles.bigCard}>
          <div
            className={styles.bgImg}
            style={{
              backgroundImage: 'url(/images/icons-preview.png)',
              width: 1302, height: 804,
              left: -73, top: -56,
            }}
          />
          {/* Fade bottom */}
          <div className={styles.fadeBottom} />
          <div className={styles.cardLabel}>
            <span className={styles.cardName}>Icons</span>
            <span className={styles.cardBadge}>1700+</span>
          </div>
        </div>
      </div>
    </div>
  )
}
