# Jethro Liberation Ministries Intl - Church Website

A modern, responsive church website built for Jethro Liberation Ministries International. The site serves as a digital presence for the ministry, providing information about services, events, sermons, ministries, and ways to give.

## Tech Stack

- **Vite** - Build tool and dev server
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Lucide React** - Icon library

## Project Structure

```
app/frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images and media
│   ├── components/
│   │   ├── Footer.tsx       # Site-wide footer
│   │   ├── MobileMenu.tsx   # Mobile navigation menu
│   │   ├── Navbar.tsx       # Site-wide navigation bar
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── About.tsx        # Church history, vision, leadership
│   │   ├── AdminDashboard.tsx # Admin panel for content management
│   │   ├── Blog.tsx         # Blog page (coming soon)
│   │   ├── Books.tsx        # Books & resources page (coming soon)
│   │   ├── Contact.tsx      # Contact form, map, prayer requests
│   │   ├── Events.tsx       # Events with countdown timers
│   │   ├── Giving.tsx       # Online donation form
│   │   ├── Home.tsx         # Landing page with all sections
│   │   ├── Ministries.tsx   # Ministry descriptions
│   │   └── Sermons.tsx      # Sermon archive with search/filter
│   ├── App.tsx              # Router setup
│   ├── App.css              # App-level styles
│   ├── index.css            # Global styles & Tailwind theme
│   └── main.tsx             # Entry point
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
└── tsconfig.json            # TypeScript configuration
```

## Pages & Features

### Home Page

- Hero section with welcome message and CTA buttons
- Pastor welcome section
- "Why Join Us" highlights
- Service times display
- Testimonials from church members
- Ministries preview
- Latest sermons preview
- **Upcoming Events** - 4 closest event cards with live countdown timers (days, hours, minutes, seconds)
- Giving/donation CTA section

### About Page

- Church history and founding story
- Mission and vision statements
- Core values
- Leadership profiles

### Ministries Page

- Grid of ministry descriptions (Worship, Small Groups, Bible Study, Community Service, Youth, Counseling)
- Community section with imagery

### Sermons Page

- Sermon archive with search functionality
- Category filtering (Faith, Love, Purpose, Freedom)
- Speaker and date display

### Events Page

- Event cards with countdown timers
- Expandable details with description and register button
- Date, time, and location display

### Giving Page

- Category selection (General Fund, Missions, Community Outreach, Youth Ministry)
- Preset donation amounts ($10 - $500)
- Custom amount input
- Donation summary

### Contact Page

- Contact information (phone, email, address)
- Contact form with message type selection
- Embedded Google Maps location
- Prayer request section

### Books Page

- Placeholder page for future books & resources collection

### Blog Page

- Placeholder page for future blog posts and devotionals

### Admin Dashboard

- Password-protected login (demo: admin123)
- Content management tabs (Sermons, Events, Ministries, Testimonials)
- CRUD table with edit/delete actions
- Add new content button

## Design System

### Color Palette

| Color        | Hex       | Usage                         |
| ------------ | --------- | ----------------------------- |
| Dark Navy    | `#1a1a2e` | Primary backgrounds, headings |
| Deep Blue    | `#16213e` | Secondary backgrounds         |
| Royal Blue   | `#0f3460` | Accent sections               |
| Accent Coral | `#e94560` | CTAs, highlights, icons       |
| Light BG     | `#f8f9fa` | Section backgrounds           |
| Warm Gold    | `#d4a574` | Accent text, highlights       |
| Dark Text    | `#2d2d2d` | Body text                     |

### Typography

- **Headings:** Playfair Display (serif) - elegant, traditional feel
- **Body:** Inter (sans-serif) - clean, modern readability

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd app/frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the site in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Navigation

The site navigation includes:

- Home, About, Ministries, Sermons, Events, Books, Blog, Giving

Mobile navigation is handled via a hamburger menu with the same links.

## Animations

The site uses Framer Motion for:

- Fade-in-up animations on scroll
- Staggered children animations for grids
- Page load transitions
- Expandable event card details

## Notes

- The `@/` path alias points to the `src/` directory
- Images are stored in `src/assets/` and `public/images/`
- The backend directory (`app/backend/`) is reserved for future API development
