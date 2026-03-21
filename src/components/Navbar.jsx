import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>Oreo Design</Link>
    </nav>
  )
}
