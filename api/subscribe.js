const RESEND_BASE = 'https://api.resend.com'

async function getOrCreateAudience(apiKey) {
  const res = await fetch(`${RESEND_BASE}/audiences`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  const { data } = await res.json()

  if (data && data.length > 0) return data[0].id

  const create = await fetch(`${RESEND_BASE}/audiences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ name: 'Oreo Design Subscribers' }),
  })
  const audience = await create.json()
  return audience.id
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const audienceId = await getOrCreateAudience(apiKey)

    const response = await fetch(`${RESEND_BASE}/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      return res.status(response.status).json({ error: error.message })
    }

    return res.status(200).json({ success: true })
  } catch {
    return res.status(500).json({ error: 'Failed to subscribe' })
  }
}
