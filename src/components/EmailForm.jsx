import { useState } from 'react'
import styles from './EmailForm.module.css'

export default function EmailForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || status === 'sending') return

    setStatus('sending')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) throw new Error()

      setStatus('sent')
      setEmail('')
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2500)
    }
  }

  const btnText = {
    idle: 'Get Access',
    sending: 'Sending...',
    sent: 'Sent!',
    error: 'Failed',
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === 'sending'}
        className={styles.input}
      />
      <button type="submit" disabled={status === 'sending'} className={styles.btn}>
        {btnText[status]}
      </button>
    </form>
  )
}
