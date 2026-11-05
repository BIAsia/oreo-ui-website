#!/usr/bin/env node
// Recovers subscribers from the welcome emails Resend still keeps, plus any
// extra addresses you supply, and saves them as permanent Resend Contacts.
//
//   RESEND_API_KEY=re_full_access_key node scripts/backfill-subscribers.mjs
//   RESEND_API_KEY=... node scripts/backfill-subscribers.mjs --csv extra.csv --apply
//
// Without --apply it only looks up each address and writes the CSV report.
// Optional RESEND_SEGMENT_ID adds every subscriber to that segment.

import { readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'
import { parseArgs } from 'node:util'
import {
  WELCOME_SUBJECT,
  addContactToSegment,
  createContact,
  findContact,
  normalizeEmail,
  resendRequest,
} from '../api/_resend.js'

const SKIP_EVENTS = new Set(['bounced', 'complained', 'failed', 'suppressed'])
// Keeps the script well under Resend's per-second rate limit.
const pace = () => new Promise((resolve) => setTimeout(resolve, 550))

const { values: args } = parseArgs({
  options: {
    apply: { type: 'boolean', default: false },
    csv: { type: 'string', multiple: true, default: [] },
    out: { type: 'string', default: `subscribers-backfill-${new Date().toISOString().slice(0, 10)}.csv` },
  },
})

const key = process.env.RESEND_API_KEY
const segmentId = process.env.RESEND_SEGMENT_ID
if (!key) {
  console.error('Set RESEND_API_KEY to a Full access key.')
  process.exit(1)
}

async function listWelcomeEmails() {
  const found = []
  let after
  for (;;) {
    const res = await resendRequest(key, `/emails?limit=100${after ? `&after=${after}` : ''}`)
    await pace()
    if (!res.ok) {
      throw new Error(`List emails failed (${res.status}): ${res.data?.message}`)
    }
    const page = res.data.data ?? []
    found.push(...page.filter((e) => e.subject === WELCOME_SUBJECT))
    if (!res.data.has_more || page.length === 0) return found
    after = page[page.length - 1].id
  }
}

// One email address per line, or the first column that looks like one.
// Surrounding quotes and <> are stripped, as many exports quote every field.
function readCsvEmails(path) {
  return readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .map((line) =>
      line
        .split(',')
        .map((cell) => normalizeEmail(cell.trim().replace(/^["'<]+|["'>]+$/g, '')))
        .find(Boolean),
    )
    .filter(Boolean)
}

const subscribers = new Map() // email -> { first_seen, latest, last_event, complained, source }

for (const email of await listWelcomeEmails()) {
  for (const to of [email.to].flat()) {
    const address = normalizeEmail(to)
    if (!address) continue
    const info = subscribers.get(address) ?? { first_seen: email.created_at, latest: '', source: 'resend-log' }
    if (email.created_at < info.first_seen) info.first_seen = email.created_at
    // A spam complaint on any welcome email rules the address out; otherwise the newest status counts.
    if (email.last_event === 'complained') info.complained = true
    if (email.created_at > info.latest) {
      info.latest = email.created_at
      info.last_event = email.last_event
    }
    subscribers.set(address, info)
  }
}
for (const path of args.csv) {
  for (const address of readCsvEmails(path)) {
    if (!subscribers.has(address)) subscribers.set(address, { first_seen: '', source: basename(path), last_event: '' })
  }
}

// Oldest first; addresses without a date (from --csv) go last.
const sortKey = (info) => info.first_seen || '\uffff'
const rows = [...subscribers].sort(([, a], [, b]) => (sortKey(a) < sortKey(b) ? -1 : sortKey(a) > sortKey(b) ? 1 : 0))

// Lookups are read-only, so a dry run reports what --apply would do.
async function backfill(email, info) {
  if (info.complained || SKIP_EVENTS.has(info.last_event)) return 'skipped'
  const found = await findContact(key, email)
  await pace()
  if (found.error) return `error ${found.error.status}`
  if (!args.apply) return found.contact ? 'existing' : 'would-create'

  let res = { ok: true }
  if (!found.contact) res = await createContact(key, email, segmentId)
  else if (segmentId) res = await addContactToSegment(key, email, segmentId)
  await pace()
  if (!res.ok) return `error ${res.status}`
  return found.contact ? 'existing' : 'created'
}

const csvField = (value = '') => (/[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value)

function writeReport() {
  const lines = ['email,first_seen,source,last_event,result'].concat(
    rows.map(([email, i]) =>
      [email, i.first_seen, i.source, i.complained ? 'complained' : i.last_event, i.result].map(csvField).join(','),
    ),
  )
  writeFileSync(args.out, lines.join('\n') + '\n')
}

const counts = {}
try {
  for (const [email, info] of rows) {
    info.result = await backfill(email, info)
    counts[info.result] = (counts[info.result] ?? 0) + 1
  }
} finally {
  writeReport()
}

console.log(`Found ${rows.length} subscribers; report written to ${args.out}`)
console.log(counts)
if (!args.apply) console.log('Dry run. Re-run with --apply to save contacts.')
