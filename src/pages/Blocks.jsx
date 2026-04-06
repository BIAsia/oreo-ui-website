import { Dithering } from '@paper-design/shaders-react'
import Navbar from '../components/Navbar'
import OreoIcon from '../components/OreoIcon'
import EmailForm from '../components/EmailForm'
import FadeIn from '../components/FadeIn'
import styles from './Blocks.module.css'

const blockCards = [
  {
    name: 'Landing Page',
    badge: '3 styles \u00b7 6 variants',
    image: '/images/block-landing-page.png',
    lightLabel: true,
  },
  {
    name: 'Application',
    badge: '10+ Scenario',
    image: '/images/block-application.png',
    lightLabel: false,
  },
  {
    name: 'Canvas',
    badge: '3 styles',
    image: '/images/block-canvas.png',
    lightLabel: false,
  },
]

export default function Blocks() {
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
            <h1 className={styles.title}>20+ Blocks for Agents</h1>
            <p className={styles.subtitle}>Coming soon</p>
          </div>
          <EmailForm />
        </div>
      </div>

      {/* Cards */}
      <FadeIn className={styles.cardContainer}>
        {blockCards.map((card) => (
          <div key={card.name} className={styles.blockCard}>
            <div
              className={styles.cardImage}
              style={{ backgroundImage: `url(${card.image})` }}
            />
            <div className={styles.fadeBottom} />
            <div className={styles.cardLabel}>
              <span
                className={styles.cardName}
                style={card.lightLabel ? { color: '#FFFFFF' } : undefined}
              >
                {card.name}
              </span>
              <span
                className={styles.cardBadge}
                style={card.lightLabel ? { color: '#315038' } : undefined}
              >
                {card.badge}
              </span>
            </div>
          </div>
        ))}
      </FadeIn>

      {/* Bottom CTA */}
      <FadeIn className={styles.bottomSection}>
        <span className={styles.comingSoon}>Coming Soon</span>
        <span className={styles.comingSoonSub}>Be the first to build with Oreo UI.</span>
        <EmailForm />
      </FadeIn>
    </div>
  )
}
