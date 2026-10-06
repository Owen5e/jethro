# jethro — frontend

The React 19 + Vite single-page app for the Jethro Liberation Ministries Intl website.

**Start with the repository README** — [`../../README.md`](../../README.md) — which covers both
packages, the environment variables, the API hosts and the deploy targets.

```bash
npm ci
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build → dist/
npm run lint
```

Notes specific to this package:

- The API base URL comes from the build mode in `src/lib/api.ts`: `http://localhost:3001/api` in
  development, `https://jethro.onrender.com/api` in production.
- `VITE_PAYSTACK_PUBLIC_KEY` is required for the giving form. It is a publishable key, but keep it
  in the environment rather than in the source.
- The `@/` alias points at `src/`.
