import { useEffect, useId, useRef, useState } from 'react'
import styles from './EmailForm.module.css'

// The API's `status` says what actually happened; the line under the form reports it.
const RESULT_MESSAGE = {
  subscribed: "Subscribed! We'll let you know when we launch.",
  already_subscribed: "You're already subscribed.",
  previously_unsubscribed: 'This email unsubscribed earlier.',
}
const ERROR_MESSAGE = 'Something went wrong. Please try again.'
// The server is stricter than the browser's email check (e.g. it rejects "me@gmail").
const INVALID_MESSAGE = 'Please enter a valid email address.'

export default function EmailForm() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState(null) // { text, error }
  const inputRef = useRef(null)
  const messageId = useId()

  // Disabling the input while sending drops focus; give it back after an error
  // so the address can be fixed straight away.
  useEffect(() => {
    if (message?.error) inputRef.current?.focus()
  }, [message])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || sending) return

    setSending(true)
    setMessage(null)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.status === 400) {
        setMessage({ text: INVALID_MESSAGE, error: true })
        return
      }
      if (!res.ok) throw new Error()
      const data = await res.json().catch(() => null)

      setEmail('')
      setMessage({ text: RESULT_MESSAGE[data?.status] ?? RESULT_MESSAGE.subscribed, error: false })
    } catch {
      setMessage({ text: ERROR_MESSAGE, error: true })
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        ref={inputRef}
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          // Typing a new address clears the previous result.
          if (message) setMessage(null)
        }}
        required
        disabled={sending}
        aria-describedby={messageId}
        aria-invalid={message?.error || undefined}
        className={styles.input}
      />
      <button type="submit" disabled={sending} className={styles.btn}>
        Get Access
      </button>
      <p id={messageId} role="status" className={message?.error ? `${styles.message} ${styles.error}` : styles.message}>
        {sending ? 'Sending...' : message?.text}
      </p>
    </form>
  )
}
