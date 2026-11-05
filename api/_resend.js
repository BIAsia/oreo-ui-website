// Small Resend REST helper shared by the subscribe endpoint and the backfill script.
// Files starting with "_" under api/ are not exposed as Vercel functions.

const RESEND_API = 'https://api.resend.com'
const MAX_RETRIES = 2

export const WELCOME_SUBJECT = 'Welcome to Oreo Design'

const EMAIL_RE = /^[^\s@"<>(),;]+@[^\s@"<>(),;]+\.[^\s@"<>(),;]+$/

export function normalizeEmail(value) {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  return email.length <= 254 && EMAIL_RE.test(email) ? email : null
}

// Rate limits, outages and network errors (status 0) may pass on a retry.
export const isTransient = (status) => status === 0 || status === 429 || status >= 500

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Never throws: failures come back as { ok: false, status, data }.
// A 429 means Resend did nothing, so it is always retried. Other transient
// failures are only retried when repeating the request is harmless.
export async function resendRequest(key, path, { method = 'GET', body, headers } = {}) {
  const canRepeat = method === 'GET' || Boolean(headers?.['Idempotency-Key'])

  for (let attempt = 0; ; attempt++) {
    let res
    try {
      const response = await fetch(RESEND_API + path, {
        method,
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(10_000),
      })
      const data = await response.json().catch(() => ({}))
      res = { ok: response.ok, status: response.status, data, retryAfter: response.headers?.get?.('retry-after') }
    } catch (error) {
      res = { ok: false, status: 0, data: { message: error.message } }
    }

    const retry = res.status === 429 || (canRepeat && isTransient(res.status))
    if (res.ok || !retry || attempt >= MAX_RETRIES) return res
    const waitSeconds = Number(res.retryAfter)
    await sleep(Number.isFinite(waitSeconds) && waitSeconds > 0 ? Math.min(waitSeconds, 2) * 1000 : 1000)
  }
}

// Returns { contact } when found, { contact: null } when missing,
// or { error } when Resend could not answer (bad key scope, outage…).
export async function findContact(key, email) {
  const res = await resendRequest(key, `/contacts/${encodeURIComponent(email)}`)
  if (res.ok) return { contact: res.data }
  if (res.status === 404) return { contact: null }
  return { error: res }
}

export function createContact(key, email, segmentId) {
  return resendRequest(key, '/contacts', {
    method: 'POST',
    body: {
      email,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    },
  })
}

export function addContactToSegment(key, email, segmentId) {
  return resendRequest(key, `/contacts/${encodeURIComponent(email)}/segments/${segmentId}`, {
    method: 'POST',
  })
}
