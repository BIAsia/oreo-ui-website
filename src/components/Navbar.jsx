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
      <Link to={isAbout ? '/' : '/#get-access'} className={styles.cta}>
        {isAbout ? 'Sign in' : 'Get Access'}
      </Link>
    </nav>
  )
}
