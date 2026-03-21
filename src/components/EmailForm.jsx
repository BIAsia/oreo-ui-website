import { useState } from 'react'

const inputStyle = {
  width: 300,
  padding: '12px',
  backgroundColor: '#FFFFFF',
  border: '0.5px solid rgba(0,0,0,0.1)',
  borderRadius: 12,
  boxShadow: '0px 0px 1px rgba(0,0,0,0.16), 0px 4px 12px rgba(0,0,0,0.04)',
  fontFamily: '"Geist Mono", system-ui, sans-serif',
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '18px',
  color: '#000000',
  outline: 'none',
}

const btnStyle = {
  padding: '12px 32px',
  backgroundColor: '#000000',
  border: '0.5px solid rgba(0,0,0,0.1)',
  borderRadius: 12,
  boxShadow: '0px 0px 1px rgba(0,0,0,0.16), 0px 4px 12px rgba(0,0,0,0.04)',
  fontFamily: '"Geist Mono", system-ui, sans-serif',
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '18px',
  color: '#FFFFFF',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'opacity 0.15s',
}

export default function EmailForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
    setEmail('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', alignItems: 'start', gap: 16 }}
    >
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={inputStyle}
      />
      <button
        type="submit"
        style={btnStyle}
        onMouseEnter={(e) => e.target.style.opacity = 0.85}
        onMouseLeave={(e) => e.target.style.opacity = 1}
      >
        {submitted ? 'Sent!' : 'Get Access'}
      </button>
    </form>
  )
}
