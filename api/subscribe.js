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
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Oreo Design <hello@oreoui.com>',
        to: email,
        subject: 'Welcome to Oreo Design',
        html: [
          '<div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">',
          '<p style="font-size: 18px; line-height: 1.6; color: #000;">Thanks for signing up for Oreo Design.</p>',
          '<p style="font-size: 18px; line-height: 1.6; color: #000;">We\'ll let you know when we\'re ready to launch.</p>',
          '<p style="margin-top: 32px; font-size: 14px; color: #999;">— Oreo Design Team</p>',
          '</div>',
        ].join(''),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return res.status(response.status).json({ error: error.message })
    }

    const data = await response.json()
    return res.status(200).json({ success: true, id: data.id })
  } catch {
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
