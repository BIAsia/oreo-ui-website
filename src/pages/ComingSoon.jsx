import { Dithering } from '@paper-design/shaders-react'
import Navbar from '../components/Navbar'
import OreoIcon from '../components/OreoIcon'
import EmailForm from '../components/EmailForm'
import styles from './ComingSoon.module.css'

export default function ComingSoon({ title = 'Coming Soon' }) {
  return (
    <div className={styles.page}>
      <Navbar />
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
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>Coming soon</p>
          </div>
          <EmailForm />
        </div>
      </div>
    </div>
  )
}
