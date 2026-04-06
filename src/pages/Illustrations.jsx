import { Dithering } from '@paper-design/shaders-react'
import Navbar from '../components/Navbar'
import OreoIcon from '../components/OreoIcon'
import EmailForm from '../components/EmailForm'
import FadeIn from '../components/FadeIn'
import styles from './Illustrations.module.css'

/**
 * Each card holds one or more images positioned inside a 380×330 container.
 * Images are absolutely positioned to match the Paper design.
 */
const illustrationCards = [
  // Row 1
  {
    id: 'team-function',
    images: [
      { src: '/images/illust-01.png', w: 240, h: 278, left: '50%', top: 25, translateX: '-50%' },
    ],
  },
  {
    id: 'itinerary',
    images: [
      { src: '/images/illust-02b.png', w: 269, h: 274, left: 54, top: 30 },
    ],
    fadeBottom: true,
  },
  {
    id: 'notice',
    images: [
      { src: '/images/illust-03.png', w: 312, h: 156, left: 33, top: '50%', translateY: '-50%' },
    ],
  },
  // Row 2
  {
    id: 'full-picture',
    images: [
      { src: '/images/illust-04.png', w: 274, h: 253, left: 52, top: 37 },
    ],
  },
  {
    id: 'avatars-icons',
    halfSplit: true,
    topImage: { src: '/images/illust-05a.png', w: 223, h: 104, left: 77, top: 23 },
    bottomImage: { src: '/images/illust-05b.png', w: 172, h: 108, left: 103, top: 25 },
  },
  {
    id: 'chat-input',
    images: [
      { src: '/images/illust-06.png', w: 262, h: 139, left: 58, top: 94 },
    ],
  },
  // Row 3
  {
    id: 'generate-code',
    images: [
      { src: '/images/illust-07.png', w: 575, h: 121, left: 41, top: 103 },
    ],
  },
  {
    id: 'verify-identity',
    images: [
      { src: '/images/illust-08.png', w: 298, h: 203, left: 40, top: 62 },
    ],
  },
  {
    id: 'customer-context',
    images: [
      { src: '/images/illust-09.png', w: 281, h: 143, left: 48, top: 92 },
    ],
  },
  // Row 4 (faded)
  {
    id: 'notification',
    images: [
      { src: '/images/illust-10.png', w: 286, h: 144, left: 46, top: 92 },
    ],
  },
  {
    id: 'task-completion',
    images: [
      { src: '/images/illust-11.png', w: 292, h: 160, left: 43, top: 84 },
    ],
  },
  {
    id: 'icons-badges',
    images: [
      { src: '/images/illust-12a.png', w: 126, h: 126, left: 58, top: 101, blend: 'multiply' },
      { src: '/images/illust-12b.png', w: 126, h: 126, left: 194, top: 101, blend: 'multiply' },
    ],
    fadeRight: true,
  },
]

function IllustCard({ card }) {
  if (card.halfSplit) {
    return (
      <div className={styles.card}>
        <div className={styles.halfTop}>
          <div
            className={styles.cardImg}
            style={{
              backgroundImage: `url(${card.topImage.src})`,
              width: card.topImage.w, height: card.topImage.h,
              left: card.topImage.left, top: card.topImage.top,
            }}
          />
        </div>
        <div className={styles.halfBottom}>
          <div
            className={styles.cardImg}
            style={{
              backgroundImage: `url(${card.bottomImage.src})`,
              width: card.bottomImage.w, height: card.bottomImage.h,
              left: card.bottomImage.left, top: card.bottomImage.top,
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      {card.images.map((img, i) => (
        <div
          key={i}
          className={styles.cardImg}
          style={{
            backgroundImage: `url(${img.src})`,
            width: img.w, height: img.h,
            left: img.left, top: img.top,
            ...(img.translateX && { translate: `${img.translateX}` }),
            ...(img.translateY && { translate: `0 ${img.translateY}` }),
            ...(img.blend && { mixBlendMode: img.blend }),
          }}
        />
      ))}
      {card.fadeBottom && <div className={styles.cardFadeBottom} />}
      {card.fadeRight && <div className={styles.cardFadeRight} />}
    </div>
  )
}

export default function Illustrations() {
  const rows = [
    illustrationCards.slice(0, 3),
    illustrationCards.slice(3, 6),
    illustrationCards.slice(6, 9),
    illustrationCards.slice(9, 12),
  ]

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
            <h1 className={styles.title}>50+ Illustrations for Agents</h1>
            <p className={styles.subtitle}>Coming soon</p>
          </div>
          <EmailForm />
        </div>
      </div>

      {/* Illustration Grid */}
      <FadeIn className={styles.gridWrapper}>
        <div className={styles.gridContainer}>
          {rows.map((row, ri) => (
            <div key={ri} className={styles.gridRow}>
              {row.map((card) => (
                <IllustCard key={card.id} card={card} />
              ))}
            </div>
          ))}
        </div>
        {/* Fade overlay on last row */}
        <div className={styles.gridFadeOverlay} />
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
