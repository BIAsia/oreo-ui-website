import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const navLinks = [
  { label: 'Components', to: '/components' },
  { label: 'Blocks', to: '/blocks' },
  { label: 'illustrations', to: '/illustrations' },
  { label: 'Icons', to: '/icons' },
  { label: 'Design Lab', to: '/design-lab' },
  { label: 'About', to: '/about' },
]

export default function Navbar() {
  const location = useLocation()
  const isAbout = location.pathname === '/about'
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link to="/" className={styles.brand}>Oreo Design</Link>
        <div className={styles.links}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={styles.link}
              style={{
                opacity: location.pathname === link.to ? 1 : 0.4,
                fontWeight: location.pathname === link.to ? 600 : 400,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile hamburger */}
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
        <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
      </button>

      <Link to={isAbout ? '/' : '/#get-access'} className={styles.cta}>
        {isAbout ? 'Sign in' : 'Get Access'}
      </Link>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
              style={{
                opacity: location.pathname === link.to ? 1 : 0.5,
                fontWeight: location.pathname === link.to ? 600 : 400,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
