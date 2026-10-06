# Jethro Liberation Ministries International — website

The public website for **Jethro Liberation Ministries Intl**: home page, about, ministries, sermons,
events, giving, contact, plus an admin dashboard for managing content. React 19 frontend on Vite,
with an Express 5 + Supabase API alongside it in the same repository.

| | |
| --- | --- |
| **Live site** | https://jethro-sable.vercel.app |
| **API** | https://jethro.onrender.com/api (`/api/health` for a liveness check) |
| **Stack** | React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Framer Motion · React Router 7 · Express 5 · Supabase (Postgres) · Paystack |
| **Node** | 24.x recommended (Vite 8 needs `^20.19 \|\| >=22.12`; ESLint 10 needs `^20.19 \|\| ^22.13 \|\| >=24`) |
| **Repo** | https://github.com/Owen5e/jethro |

## What it is

A single-page React site with client-side routing for the whole public face of the ministry —
service times, upcoming events with live countdowns, a searchable sermon archive, ministry
descriptions, leadership, an online giving form, and a contact page with prayer requests. Content is
served by the Express API in `app/backend/`, which reads and writes Supabase tables for events,
sermons, books, blog posts and payments, and accepts image uploads.

```
app/
├── frontend/    React 19 + Vite SPA  (port 5173)
└── backend/     Express 5 + TypeScript API against Supabase  (port 3001)
```

There is **no root `package.json`** — the two packages are independent, so every install and every
command happens inside the package you want. CI cds into each one the same way.

## Why it exists

The ministry needed a real digital presence: one place for service times, sermons, events and
giving, that a non-technical admin could keep current without a developer. The admin dashboard
(`/admin`, demo password `admin123`) is that concession — a password-gated CRUD surface over the
same records the public pages read, so the site stays alive between visits.

## Pages

| Route | What is there |
| --- | --- |
| `/` | Hero, pastor's welcome, "why join us", service times, testimonials, ministries preview, latest sermons, the four nearest upcoming events with live countdowns, giving CTA |
| `/about` | Church history and founding story, mission and vision, core values, leadership profiles |
| `/ministries` | Ministry grid (worship, small groups, Bible study, community service, youth, counselling) |
| `/sermons` | Sermon archive with search and category filters (Faith, Love, Purpose, Freedom) |
| `/events` | Event cards with countdown timers and expandable details |
| `/giving` | Donation form — category, preset amounts ($10–$500) or a custom amount, summary, Paystack checkout |
| `/contact` | Phone, email, address, message form with type selection, embedded map, prayer request |
| `/admin` | Password-protected dashboard: CRUD tabs for sermons, events, ministries and testimonials |
| `/books`, `/blog` | Placeholder pages for the resources and devotionals still to come |

## Design system

| Colour | Hex | Used for |
| --- | --- | --- |
| Dark navy | `#1a1a2e` | Primary backgrounds, headings |
| Deep blue | `#16213e` | Secondary backgrounds |
| Royal blue | `#0f3460` | Accent sections |
| Accent coral | `#e94560` | CTAs, highlights, icons |
| Light background | `#f8f9fa` | Section backgrounds |
| Warm gold | `#d4a574` | Accent text |
| Dark text | `#2d2d2d` | Body copy |

Headings are **Playfair Display**, body copy is **Inter**. Animations are Framer Motion: fade-in-up
on scroll, staggered grids, page transitions, expanding event cards.

## Getting started

### Prerequisites

- Node 20.19+ (24.x recommended) and npm.
- A Supabase project, for the backend only. The frontend runs without one.

### Frontend

```bash
cd app/frontend
npm ci
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc -b && vite build` → `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint |

`app/frontend/src/lib/api.ts` picks its base URL from the build mode: `http://localhost:3001/api`
in development, `https://jethro.onrender.com/api` in production. Oversight the frontend makes:
the `@/` alias points at `src/`; images live in `src/assets/` and `public/images/`.

### Backend

```bash
cd app/backend
npm ci
npm run dev        # tsx watch src/index.ts → http://localhost:3001
```

Create `app/backend/.env`:

```dotenv
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_KEY=<service-role-key>
PORT=3001          # optional; defaults to 3001
```

`src/config/supabase.ts` throws on startup if either Supabase variable is missing, so the process
fails loudly rather than serving 500s later. `SUPABASE_SERVICE_KEY` is the service-role key: it
bypasses row-level security, so it belongs in the server environment only — never in the frontend.

| Script | What it does |
| --- | --- |
| `npm run dev` | `tsx watch src/index.ts` |
| `npm run build` | `tsc` → `dist/` |
| `npm start` | `node dist/index.js` |

Endpoints: `/api/events`, `/api/sermons`, `/api/books`, `/api/blog`, `/api/payments`,
`/api/upload`, `/api/health`, and `/` (name and version).

## Environment variables

| Package | Variable | Purpose |
| --- | --- | --- |
| frontend | `VITE_PAYSTACK_PUBLIC_KEY` | Paystack public key for the giving form. Publishable by design — it is inlined into the bundle — but it should still come from the environment, not the file |
| backend | `SUPABASE_URL` | Supabase project URL |
| backend | `SUPABASE_SERVICE_KEY` | Service-role key (**server-only secret**) |
| backend | `PORT` | Optional API port, default 3001 |

## Deploy

- **Frontend → Vercel.** `vercel.json` at the repo root rewrites every path to `/index.html`, which
  a client-side-routed SPA needs so deep links and refreshes do not 404.
- **Backend → Render.** A separate web service: build `npm ci && npm run build`, start
  `npm start`, with `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` set in the service environment.
- The production API host is compiled into the frontend (`https://jethro.onrender.com/api` in
  `src/lib/api.ts`), so **a change of backend host is a frontend change and a redeploy**, at least
  until that URL moves into an environment variable.

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main`, every PR, and on demand: frontend
(`npm ci` → ESLint → `tsc -b && vite build`) and backend (`npm ci` → `npm run build`, whose `tsc`
gate is the compiler itself). Node 24, concurrency-guarded, npm cache keyed per package.

## Known gaps

- `/blog` and `/books` are placeholder pages; the API routes behind them already exist.
- The admin dashboard's login is a hard-coded demo password (`admin123`) — it is not a real auth
  boundary and must not be treated as one.
- Giving posts to `/api/payments`; treat the Paystack flow as test-mode until it has been run
  end to end with live keys.
- No automated tests yet (the backend's `npm test` is still the npm placeholder).
- `app/frontend/README.md` is the unedited Vite template — this file is the one to read.
