const API_BASE = 'https://api.resend.com'

// Newer Resend accounts use the top-level /contacts resource; older ones scope
// contacts under an audience. Setting RESEND_AUDIENCE_ID picks the legacy path.
export function contactsUrl(audienceId) {
  return audienceId
    ? `${API_BASE}/audiences/${audienceId}/contacts`
    : `${API_BASE}/contacts`
}

export async function createContact({ apiKey, audienceId, email, unsubscribed = false }) {
  const response = await fetch(contactsUrl(audienceId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ email, unsubscribed }),
  })

  if (response.ok) {
    return { ok: true, data: await response.json() }
  }

  const body = await response.json().catch(() => ({}))
  const message = body.message || body.error?.message || `HTTP ${response.status}`

  // A contact that is already on the list is a success for our purposes.
  if (response.status === 409 || /already exists/i.test(message)) {
    return { ok: true, duplicate: true }
  }

  return { ok: false, status: response.status, message }
}

export async function listContacts({ apiKey, audienceId }) {
  const response = await fetch(contactsUrl(audienceId), {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message || `Failed to list contacts: HTTP ${response.status}`)
  }

  const body = await response.json()
  return body.data || []
}
