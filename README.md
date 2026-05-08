This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Shadcn-UI Template Usage Instructions

## technology stack

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

All shadcn/ui components have been downloaded under `@/components/ui`.

## File Structure

- `index.html` - HTML entry point
- `vite.config.ts` - Vite configuration file
- `tailwind.config.ts` - Tailwind CSS configuration file
- `package.json` - NPM dependencies and scripts
- `src/main.tsx` - Project entry point
- `src/App.tsx` - Router shell (imports pages and sets up routes)
- `src/pages/Index.tsx` - Main page entry point for `/` by default; replace the placeholder page here unless you explicitly reroute `/` elsewhere
- `src/index.css` - Existing CSS configuration

## Components

- All shadcn/ui components are pre-downloaded and available at `@/components/ui`

## Styling

- Add global styles to `src/index.css` or create new CSS files as needed
- Use Tailwind classes for styling components

## Development

- Import components from `@/components/ui` in your React components
- Customize the UI by modifying the Tailwind configuration
- Do not stop after editing isolated components or only `src/App.tsx`. The default template homepage lives in `src/pages/Index.tsx`, and leaving `Welcome to Atoms` there means the app is still unfinished.
- Completion check: either replace `src/pages/Index.tsx` with your real homepage, or update the `/` route in `src/App.tsx` so the live homepage no longer renders the default placeholder page.

## Note

- The `@/` path alias points to the `src/` directory
- Do NOT modify `index.html` — the title, description, and logo use environment variable placeholders (`%VITE_APP_TITLE%`, etc.) that are configured at deployment time.

# Church Website - MVP Development Plan

## Design References

- Modern church/ministry websites with clean layouts
- Color Palette: #1a1a2e (dark navy), #16213e (deep blue), #0f3460 (royal blue), #e94560 (accent coral), #f8f9fa (light bg), #ffffff (white), #d4a574 (warm gold), #2d2d2d (dark text)
- Typography: Inter for body, Playfair Display for headings (elegant serif)
- Key Styles: Large hero sections, card-based layouts, subtle animations, warm and welcoming feel

## Images to Generate

1. hero-church-worship.jpg - Wide shot of a beautiful modern church interior with warm lighting during worship (1024x576)
2. pastor-welcome.jpg - Professional portrait of a pastor in a warm, welcoming setting (1024x1024)
3. church-community.jpg - Diverse group of church members gathered together in fellowship (1024x576)
4. church-exterior.jpg - Beautiful modern church building exterior with landscaping (1024x576)

## Development Tasks

- [x] Generate images for the website
- [x] Set up project dependencies (framer-motion, etc.) and configure Tailwind theme
- [x] Create shared components (Navbar, Footer, MobileMenu)
- [x] Build Home Page (Hero, Welcome, Services, Ministries, Sermons, Events, Testimonials, Donation CTA)
- [x] Build About Page (History, Vision, Leadership, Values)
- [x] Build Ministries Page (Card layout with details)
- [x] Build Sermons Page (Archive with search/filter)
- [x] Build Events Page (Event list, detail, countdown)
- [x] Build Giving Page (Donation form with categories)
- [x] Build Contact Page (Contact form, prayer request, map)
- [x] Build Admin Dashboard (Login, CRUD for sermons/events/ministries/testimonials)
- [x] Add Framer Motion animations and polish
- [x] Run lint and build checks
