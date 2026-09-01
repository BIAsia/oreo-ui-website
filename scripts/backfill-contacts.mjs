#!/usr/bin/env node
/**
 * Backfill Resend contacts from previously sent emails.
 *
 * The subscribe endpoint used to only call POST /emails, so every early
 * signup got a welcome email but was never added to the contact list. This
 * script walks the Resend email log (or a file of addresses) and creates the
 * missing contacts.
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx node scripts/backfill-contacts.mjs --dry-run
 *   RESEND_API_KEY=re_xxx node scripts/backfill-contacts.mjs
 *   RESEND_API_KEY=re_xxx node scripts/backfill-contacts.mjs --file emails.csv
 *
 * Options:
 *   --dry-run           Show what would be created, without writing anything.
 *   --file <path>       Read addresses from a CSV/TXT file instead of the API.
 *   --subject <text>    Only use emails whose subject contains this text.
 *                       Defaults to "Welcome to Oreo Design"; pass "" for all.
 *   --include-bounced   Also import addresses whose last event was a bounce
 *                       or complaint (skipped by default).
 *
 * Env:
 *   RESEND_API_KEY      Required.
 *   RESEND_AUDIENCE_ID  Optional; set it if your account scopes contacts
 *                       under an audience instead of the top-level list.
 */
import { readFileSync } from 'node:fs'
import { createContact, listContacts } from '../api/_contacts.js'

const args = process.argv.slice(2)
const hasFlag = (name) => args.includes(name)
const getOption = (name, fallback) => {
  const i = args.indexOf(name)
  return i === -1 ? fallback : args[i + 1]
}

const apiKey = process.env.RESEND_API_KEY
const audienceId = process.env.RESEND_AUDIENCE_ID
const dryRun = hasFlag('--dry-run')
const file = getOption('--file')
const subjectFilter = getOption('--subject', 'Welcome to Oreo Design')
const includeBounced = hasFlag('--include-bounced')

const EMAIL_RE = /[^\s,;<>"']+@[^\s,;<>"']+\.[^\s,;<>"']+/g
const BAD_EVENTS = new Set(['bounced', 'complained'])

if (!apiKey) {
  console.error('RESEND_API_KEY is not set.')
  process.exit(1)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function listSentEmails() {
  const emails = []
  let after

  for (;;) {
    const url = new URL('https://api.resend.com/emails')
    url.searchParams.set('limit', '100')
    if (after) url.searchParams.set('after', after)

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    if (response.status === 429) {
      await sleep(1000)
      continue
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(
        `Failed to list emails (HTTP ${response.status}): ${body.message || 'unknown error'}. ` +
          'If your account has no email log access, re-run with --file <path>.',
      )
    }

    const body = await response.json()
    const page = body.data || []
    emails.push(...page)
    process.stdout.write(`\rFetched ${emails.length} sent emails...`)

    if (!body.has_more || page.length === 0) break
    after = page[page.length - 1].id
    await sleep(250)
  }

  process.stdout.write('\n')
  return emails
}

function recipientsFromEmails(emails) {
  const found = new Map()

  for (const email of emails) {
    if (subjectFilter && !(email.subject || '').includes(subjectFilter)) continue
    if (!includeBounced && BAD_EVENTS.has(email.last_event)) continue

    for (const to of [].concat(email.to || [])) {
      for (const address of String(to).match(EMAIL_RE) || []) {
        const normalized = address.toLowerCase()
        if (!found.has(normalized)) found.set(normalized, email.created_at)
      }
    }
  }

  return [...found.keys()]
}

function recipientsFromFile(path) {
  const text = readFileSync(path, 'utf8')
  return [...new Set((text.match(EMAIL_RE) || []).map((a) => a.toLowerCase()))]
}

async function main() {
  const candidates = file
    ? recipientsFromFile(file)
    : recipientsFromEmails(await listSentEmails())

  if (candidates.length === 0) {
    console.log('No addresses found. Nothing to import.')
    return
  }

  let existing = new Set()
  try {
    existing = new Set(
      (await listContacts({ apiKey, audienceId }))
        .map((c) => (c.email || '').toLowerCase())
        .filter(Boolean),
    )
  } catch (err) {
    console.warn(`Could not read existing contacts (${err.message}); relying on duplicate detection.`)
  }

  const missing = candidates.filter((email) => !existing.has(email))
  console.log(
    `${candidates.length} address(es) found, ${existing.size} already a contact, ${missing.length} to import.`,
  )

  if (dryRun) {
    missing.forEach((email) => console.log(`  would add ${email}`))
    console.log('\nDry run — nothing was written.')
    return
  }

  let added = 0
  let duplicates = 0
  const failures = []

  for (const email of missing) {
    let result = await createContact({ apiKey, audienceId, email })

    if (!result.ok && result.status === 429) {
      await sleep(1500)
      result = await createContact({ apiKey, audienceId, email })
    }

    if (result.ok) {
      result.duplicate ? duplicates++ : added++
      console.log(`  ${result.duplicate ? 'exists' : 'added '} ${email}`)
    } else {
      failures.push({ email, message: result.message })
      console.error(`  failed ${email}: ${result.message}`)
    }

    await sleep(600) // stay under Resend's default 2 req/s limit
  }

  console.log(`\nDone. ${added} added, ${duplicates} already existed, ${failures.length} failed.`)
  if (failures.length > 0) process.exitCode = 1
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
