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

`api/subscribe.js` saves each signup as a [Resend Contact](https://resend.com/docs/dashboard/contacts/introduction) and then sends a welcome email. Contacts are kept permanently; Resend's sent-email log is not, so the contact list is the record of subscribers.

| Variable | Notes |
| --- | --- |
| `RESEND_API_KEY` | Must be a **Full access** key. Sending-only keys can't read or write Contacts, and signups then fail with an error. |
| `RESEND_SEGMENT_ID` | Optional. Every subscriber is added to this segment. |

To recover subscribers from the welcome emails Resend still keeps (and any CSV of addresses), run a dry run first, then apply:

```bash
RESEND_API_KEY=re_... node scripts/backfill-subscribers.mjs --csv extra.csv
RESEND_API_KEY=re_... node scripts/backfill-subscribers.mjs --csv extra.csv --apply
```

The script writes a `subscribers-backfill-<date>.csv` report (gitignored, it contains addresses).
