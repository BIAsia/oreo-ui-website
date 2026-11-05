import { createHash } from 'node:crypto'
import {
  WELCOME_SUBJECT,
  addContactToSegment,
  createContact,
  findContact,
  isTransient,
  normalizeEmail,
  resendRequest,
} from './_resend.js'

// The subscriber list lives in Resend Contacts, which is kept permanently.
// Sent-email logs are only kept for a limited window, so they must not be the record.
//
// Env:
//   RESEND_API_KEY     Full access key. The Contacts API rejects "sending access" keys,
//                      and signups then fail loudly instead of silently going unsaved.
//   RESEND_SEGMENT_ID  Optional segment that every subscriber is added to

const WELCOME_HTML = [
  '<div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">',
  '<p style="font-size: 18px; line-height: 1.6; color: #000;">Thanks for signing up for Oreo Design.</p>',
  '<p style="font-size: 18px; line-height: 1.6; color: #000;">We\'ll let you know when we\'re ready to launch.</p>',
  '<p style="margin-top: 32px; font-size: 14px; color: #999;">— Oreo Design Team</p>',
  '</div>',
].join('')

// Saves the subscriber. Returns "created", "existing", "unavailable" (Resend is
// down or rate limited) or "misconfigured" (bad key scope, segment id…).
// An existing contact's subscription status is left alone: anyone can post any
// address, so a signup must never undo someone's unsubscribe.
async function saveContact(key, email, segmentId) {
  const found = await findContact(key, email)
  if (found.contact) {
    if (segmentId) {
      const added = await addContactToSegment(key, email, segmentId)
      if (!added.ok) console.error('[subscribe] segment add failed', added.status, added.data?.message)
    }
    return 'existing'
  }

  const res = found.error ?? (await createContact(key, email, segmentId))
  if (res.ok) return 'created'
  console.error('[subscribe] contact not saved', res.status, res.data?.message)
  return isTransient(res.status) ? 'unavailable' : 'misconfigured'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = normalizeEmail(req.body?.email)
  if (!email) {
    return res.status(400).json({ error: 'A valid email is required' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const saved = await saveContact(apiKey, email, process.env.RESEND_SEGMENT_ID)

  // People who are already on the list don't get a second welcome email.
  if (saved === 'existing') {
    return res.status(200).json({ success: true })
  }
  // Fail visibly so a wrong key or segment is noticed on the first signup.
  if (saved === 'misconfigured') {
    return res.status(500).json({ error: 'Failed to subscribe' })
  }

  const sent = await resendRequest(apiKey, '/emails', {
    method: 'POST',
    // Double submits within 24h reuse the first send instead of mailing twice.
    // Hashed so the header stays short and doesn't carry the address.
    headers: { 'Idempotency-Key': `welcome-${createHash('sha256').update(email).digest('hex')}` },
    body: {
      from: 'Oreo Design <hello@oreoui.com>',
      to: email,
      subject: WELCOME_SUBJECT,
      html: WELCOME_HTML,
    },
  })

  // 409: the same welcome email is already being sent.
  if (sent.ok || sent.status === 409) {
    return res.status(200).json({ success: true })
  }
  console.error('[subscribe] welcome email failed', sent.status, sent.data?.message)

  // Once the contact is stored the signup has succeeded, welcome email or not.
  // If Resend was unavailable for both, nothing was kept, so the visitor should retry.
  return saved === 'created'
    ? res.status(200).json({ success: true })
    : res.status(502).json({ error: 'Failed to subscribe' })
}
