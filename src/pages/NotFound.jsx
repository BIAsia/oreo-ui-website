import { Link } from 'react-router-dom'
import { Dithering } from '@paper-design/shaders-react'
import Navbar from '../components/Navbar'
import OreoIcon from '../components/OreoIcon'
import styles from './NotFound.module.css'

export default function NotFound() {
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
            <h1 className={styles.title}>404</h1>
            <p className={styles.subtitle}>Page not found</p>
          </div>
          <Link to="/" className={styles.homeLink}>Back to home</Link>
        </div>
      </div>
    </div>
  )
}
