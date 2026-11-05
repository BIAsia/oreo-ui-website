import { useEffect, useRef, useState } from 'react'
import styles from './EmailForm.module.css'

// Maps the API's `status` to the button state, so the label reports what actually happened.
const RESULT_STATUS = {
  subscribed: 'subscribed',
  already_subscribed: 'already',
  previously_unsubscribed: 'unsubscribed',
}

const BUTTON_TEXT = {
  idle: 'Get Access',
  sending: 'Sending...',
  subscribed: 'Subscribed!',
  already: 'Already subscribed',
  unsubscribed: 'Previously unsubscribed',
  error: 'Failed',
}

export default function EmailForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | subscribed | already | unsubscribed | error
  const resetTimer = useRef(null)

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  // Shows a result for a moment, then returns to the idle label. A newer
  // submit cancels the pending reset so it can't cut that submit short.
  const showResult = (result) => {
    setStatus(result)
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setStatus('idle'), 2500)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || status === 'sending') return

    clearTimeout(resetTimer.current)
    setStatus('sending')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) throw new Error()
      const data = await res.json().catch(() => null)

      setEmail('')
      showResult(RESULT_STATUS[data?.status] ?? 'subscribed')
    } catch {
      showResult('error')
    }
  }

  const isResult = status !== 'idle' && status !== 'sending'

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
        {BUTTON_TEXT[status]}
      </button>
      {/* Announces the result to screen readers; the button label changes silently. */}
      <span role="status" className={styles.srOnly}>
        {isResult ? BUTTON_TEXT[status] : ''}
      </span>
    </form>
  )
}
