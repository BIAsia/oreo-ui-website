import { Dithering } from '@paper-design/shaders-react'
import Navbar from '../components/Navbar'
import OreoIcon from '../components/OreoIcon'
import EmailForm from '../components/EmailForm'
import FadeIn from '../components/FadeIn'
import styles from './Home.module.css'

const stats = [
  { value: '900+', label: 'Global styles and variables' },
  { value: '10,000+', label: 'Components and variants' },
  { value: '420+', label: 'Page templates' },
]

const componentCards = [
  // Row 1
  {
    name: 'Prompt Composer', instances: '21 instances',
    image: '/images/prompt-composer.png',
    imgStyle: { width: 792, height: 164, left: 24, top: 58 },
    fadeRight: true,
  },
  {
    name: 'Attachment Bar', instances: '60 instances',
    image: '/images/attachment-bar.png',
    imgStyle: { width: 434, height: 176, left: 56, top: 56 },
    fadeRight: true, fadeBottom: true,
  },
  {
    name: 'Config Menu', instances: '11 instances',
    image: '/images/config-menu.png',
    imgStyle: { width: 333, height: 304, left: 22, top: 34 },
    fadeBottom: true,
  },
  // Row 2
  {
    name: 'Keyword Tag', instances: '18 instances',
    image: '/images/keyword-tag.png',
    imgStyle: { width: 314, height: 159, left: 41, top: 58 },
    fadeRight: true,
  },
  {
    name: 'Thinking', instances: '14 instances',
    image: '/images/thinking.png',
    imgStyle: { width: 380, height: 240, left: 10, top: 30 },
    fadeRight: true, fadeBottom: true,
  },
  {
    name: 'Context Assembly', instances: '24 instances',
    image: '/images/context-assembly.png',
    imgStyle: { width: 380, height: 260, left: 20, top: 30 },
    fadeBottom: true, fadeRightAlt: true,
  },
  // Row 3
  {
    name: 'Tool Bar', instances: '24 instances',
    image: '/images/toolbar.png',
    imgStyle: { width: 380, height: 150, left: 6, top: 60 },
    fadeRight: true,
  },
  {
    name: 'Task Planner', instances: '16 instances',
    image: '/images/task-planner.png',
    imgStyle: { width: 380, height: 260, left: 12, top: 30 },
    fadeBottom: true,
  },
  {
    name: 'Button', instances: '32 instances',
    image: '/images/button.png',
    imgStyle: { width: 380, height: 96, left: 30, top: 88 },
    fadeBottom: true, fadeRightAlt: true,
  },
]

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero with Dithering shader */}
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
          <div className={styles.logoWrap}>
            <OreoIcon size={48} />
          </div>
          <h1 className={styles.title}>
            {'UI library that\nBuild AI Agent'}
          </h1>
          <p className={styles.subtitle}>5x Faster</p>
          <div className={styles.heroForm}>
            <EmailForm />
          </div>
        </div>
      </div>

      {/* Stats */}
      <FadeIn className={styles.stats}>
        {stats.map((stat, i) => (
          <FadeIn key={stat.value} delay={i * 0.1} className={styles.statItem}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </FadeIn>
        ))}
      </FadeIn>

      {/* Component Grid */}
      <FadeIn className={styles.gridContainer}>
        {[0, 1, 2].map((row) => (
          <div key={row} className={styles.gridRow}>
            {componentCards.slice(row * 3, row * 3 + 3).map((card) => (
              <ComponentCard key={card.name} card={card} />
            ))}
          </div>
        ))}
      </FadeIn>

      {/* Bottom CTA */}
      <FadeIn className={styles.bottomSection}>
        <span className={styles.comingSoon}>Coming Soon</span>
        <span className={styles.comingSoonSub}>Be the first one to get the library!</span>
        <EmailForm />
      </FadeIn>
    </div>
  )
}

function ComponentCard({ card }) {
  return (
    <div className={styles.card}>
      <div
        className={styles.cardImage}
        style={{
          backgroundImage: `url(${card.image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          width: card.imgStyle.width,
          height: card.imgStyle.height,
          left: card.imgStyle.left,
          top: card.imgStyle.top,
        }}
      />
      {card.fadeRight && <div className={styles.fadeRight} />}
      {card.fadeRightAlt && <div className={styles.fadeRightAlt} />}
      {card.fadeBottom && <div className={styles.fadeBottom} />}
      <div className={styles.cardLabel}>
        <span className={styles.cardName}>{card.name}</span>
        <span className={styles.cardBadge}>{card.instances}</span>
      </div>
    </div>
  )
}
