import { Dithering } from '@paper-design/shaders-react'
import Navbar from '../components/Navbar'
import OreoIcon from '../components/OreoIcon'
import EmailForm from '../components/EmailForm'
import styles from './Blocks.module.css'

const smallCards = [
  {
    name: 'Prompt Composer', instances: '21 instances',
    image: '/images/prompt-composer.png',
    imgStyle: { width: 792, height: 164, left: 24, top: 58 },
  },
  {
    name: 'Attachment Bar', instances: '60 instances',
    image: '/images/attachment-bar.png',
    imgStyle: { width: 434, height: 176, left: 56, top: 56 },
  },
  {
    name: 'Config Menu', instances: '11 instances',
    image: '/images/config-menu.png',
    imgStyle: { width: 333, height: 304, left: 22, top: 34 },
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
            <h1 className={styles.title}>120+ Bloks for Agents</h1>
            <p className={styles.subtitle}>Coming soon</p>
          </div>
          <EmailForm />
        </div>
      </div>

      {/* Cards */}
      <div className={styles.cardContainer}>
        {/* Big card */}
        <div className={styles.bigCard}>
          <div
            className={styles.bgImg}
            style={{
              backgroundImage: 'url(/images/landing-page-2.png)',
              width: 720, height: 463, left: -142, top: -133,
              borderRadius: 24,
            }}
          />
          <div
            className={styles.bgImg}
            style={{
              backgroundImage: 'url(/images/landing-page-3.png)',
              width: 720, height: 463, left: 139, top: 82,
              borderRadius: 24,
            }}
          />
          <div
            className={styles.bgImg}
            style={{
              backgroundImage: 'url(/images/landing-page-1.png)',
              width: 720, height: 463,
              left: '50%', top: 71,
              translate: '-50%',
              borderRadius: 24,
            }}
          />
          <div className={styles.cardLabel}>
            <span className={styles.cardName}>Landing Page</span>
            <span className={styles.cardBadge}>3 styles</span>
          </div>
        </div>

        {/* Small cards row */}
        <div className={styles.smallRow}>
          {smallCards.map((card) => (
            <div key={card.name} className={styles.smallCard}>
              <div
                className={styles.bgImg}
                style={{
                  backgroundImage: `url(${card.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  ...card.imgStyle,
                }}
              />
              <div className={styles.fadeRight} />
              <div className={styles.cardLabel}>
                <span className={styles.cardName}>{card.name}</span>
                <span className={styles.cardBadge}>{card.instances}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
