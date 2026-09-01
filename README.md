# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Email signups

`POST /api/subscribe` adds the address to the Resend contact list and then
sends the welcome email. Contact creation failures are logged but never block
the email.

Environment variables:

- `RESEND_API_KEY` — required.
- `RESEND_AUDIENCE_ID` — optional. Set it only if your Resend account scopes
  contacts under an audience (`/audiences/{id}/contacts`) instead of the
  top-level `/contacts` list.

### Backfilling older signups

Signups made before contact creation existed only received an email. To import
them into the contact list:

```bash
RESEND_API_KEY=re_xxx node scripts/backfill-contacts.mjs --dry-run   # preview
RESEND_API_KEY=re_xxx node scripts/backfill-contacts.mjs             # import
```

The script pages through the Resend email log, keeps recipients of the
"Welcome to Oreo Design" emails (skipping bounces and complaints), skips
anyone already on the list, and creates the rest. It is safe to re-run.

Pass `--file emails.csv` to import from an exported list instead of the API,
`--subject ""` to include every sent email, or `--include-bounced` to import
bounced addresses too.

No local Node setup? The same script runs as a manual GitHub Actions job:
**Actions → Backfill Resend contacts → Run workflow**, with `dry_run` checked
by default. It needs a `RESEND_API_KEY` repository secret (Settings → Secrets
and variables → Actions), plus `RESEND_AUDIENCE_ID` if your contacts are
scoped to an audience. The workflow only appears in the Actions tab once it is
on the default branch.
