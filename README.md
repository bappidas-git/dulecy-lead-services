# Dulcey Lead Services — Official Website

A multi-page **business-consulting website** for **Dulcey Lead Services** —
"Beyond Business Support" — a professional business support and consulting
organization working with businesses, institutions, entrepreneurs, and
professionals. Five public pages present the organization, its ten areas of
experience, and the sectors it serves, and capture qualified enquiries through
a lead form backed by a server-side store and a lightweight admin panel.

Built and maintained by **Assam Digital**.

> The site was rebuilt from a previous (unrelated) landing page through the
> ordered prompt series in [`prompts/`](prompts/README.md), kept as the rebuild
> record. The static design source of truth is [`mockup/`](mockup) — five HTML
> pages plus `styles.css` / `scripts.js` that the React build matches. See
> [`CHANGELOG.md`](CHANGELOG.md) for what the rebuild changed.

## Tech Stack

- **React 18** (CRA / `react-scripts` 5, concurrent features, lazy routes)
- **React Router v7** — five public routes + `/admin/*` + a catch-all 404
- **Material UI v5** + **Emotion** (admin panel, form controls, theming)
- **CSS Modules** + CSS custom properties (the Dulcey design tokens)
- **GSAP + ScrollTrigger** (`@gsap/react`) for every public scroll animation
- **Iconify** (`mdi:*` icons), **SweetAlert2** (lazy-loaded dialogs)
- **PHP** server-side lead store (`public/api/leads.php`)
- **Web Vitals** monitoring (`src/reportWebVitals.js`)

## Quick Start

```bash
npm ci
```

```bash
npm start
```

`npm start` serves the site at <http://localhost:3000>. `.env` is committed in
this repository, so a fresh clone runs without extra setup — but see
[Environment Variables](#environment-variables) before deploying.

| Script | What it does |
|--------|--------------|
| `npm start` | CRA dev server on port 3000 |
| `npm run build` | Production build into `build/` |
| `npm test` | CRA test runner (no test suites are committed yet) |
| `npm run generate:icons` | Rebuild favicons + PWA icons from the "DLS" mark |
| `npm run generate:og` | Rebuild `public/og-image.png` (1200×630) |
| `npm run generate:images` | Re-download and re-optimize `public/images/` |
| `npm run analyze` | Bundle treemap — needs `npx source-map-explorer` (not a committed dependency) |

The three `generate:*` scripts fetch from Cloudinary / Unsplash / icons8 at run
time, so they need network access. They use the `sharp` and `png-to-ico` dev
dependencies; their outputs are committed, so you only re-run them when the
logo or the source imagery changes.

## Routes

| Route | Page | Notes |
|-------|------|-------|
| `/` | Home | Eager-loaded (critical path) |
| `/about` | About | Lazy |
| `/expertise` | Our Expertise | Lazy; accordion deep links `#e01`–`#e10` |
| `/industries` | Who We Serve | Lazy; nav label is "Who We Serve" |
| `/contact` | Contact | Lazy; hosts the enquiry form inline |
| `*` | Not Found | Lazy; `noindex`, rendered inside the public shell |
| `/admin/login` | Admin login | Lazy; separate chunk from the public bundle |
| `/admin` | → `/admin/dashboard` | Redirect |
| `/admin/dashboard` | Dashboard | Protected |
| `/admin/lms` | Lead Management | Protected |
| `/admin/lms/lead/:leadId` | Lead detail | Protected |
| `/admin/guideline` | Guidelines hub | Protected + its own password gate |

Every route except `/` is code-split. The whole `/admin` tree (auth context, MUI
tables, Iconify) lives behind its own Suspense boundary so it never ships in the
public bundle.

## Project Structure

```
├── mockup/                 # Design source of truth (5 static HTML pages)
├── prompts/                # The rebuild prompt series (historical record)
├── public/
│   ├── api/                # leads.php (shared lead store) + config.example.php
│   ├── images/             # Self-hosted hero/band photos (webp + jpg) & icons
│   ├── index.html          # HTML template: meta, OG, 5 JSON-LD blocks, splash
│   ├── manifest.json       # PWA manifest
│   ├── robots.txt          # Crawl directives
│   └── sitemap.xml         # The five indexable URLs
├── scripts/                # generate-icons.js, generate-og.js, generate-images.js
├── src/
│   ├── admin/              # Admin panel (components, pages, context, utils)
│   ├── animations/         # GSAP foundation + useReveal/useStaggerReveal/
│   │                       #   useParallax/useHeroIntro/useLineReveal
│   ├── components/
│   │   ├── common/         # Header, Footer, MobileMenu, LeadModal,
│   │   │                   #   UnifiedLeadForm, SEO/SEOHead
│   │   └── layout/         # PublicLayout (the shared public shell)
│   ├── config/             # seo.js — every page title/description/schema input
│   ├── context/            # ModalContext (enquiry modal), ThemeContext
│   ├── data/               # siteConfig · navigation · expertiseData · industriesData
│   ├── hooks/              # useMediaQuery
│   ├── pages/              # Home · About · Expertise · Industries · Contact · NotFound
│   ├── styles/             # variables.css (tokens), global, dulcey, responsive
│   ├── theme/              # MUI theme (mirrors the CSS tokens)
│   └── utils/              # webhookSubmit, seo, validators, hashScroll, swalHelper
├── .env / .env.example     # Environment variables (`.env` IS committed)
├── CLAUDE.md               # Project instructions + non-negotiable contracts
├── CUSTOMIZATION_GUIDE.md  # How to change copy, tokens, pages, credentials
├── SEO_GUIDE.md            # SEO architecture + post-launch checklist
└── CHANGELOG.md            # Release history
```

`src/data/siteConfig.js` is the **single source of business truth** (brand name,
tagline, phone, email, site URL, logo URLs). Never hard-code a contact fact in a
component — import it from there.

## Lead Storage

Leads are the product of this site, so they are stored **server-side** and
treated as the single source of truth:

- The enquiry form (`UnifiedLeadForm`, used by the Contact page and the global
  `LeadModal`) POSTs each submission to `public/api/leads.php` via
  `src/utils/webhookSubmit.js`.
- The admin panel reads and writes **only** the server, re-syncing every
  **15 seconds** while the tab is visible, and broadcasts changes to other tabs
  of the same browser over **BroadcastChannel** (`lp_leads_channel`).
- There is **no `localStorage` copy of leads** — a lead submitted on one device
  shows up in the admin panel on every other device.
- The server dedupes on `lead_id` and on mobile number, so a repeat submission
  is answered with `{ duplicate: true }` instead of a second record.

The store itself is a JSON file the endpoint creates on first use
(`public/api/data/leads.json`, protected by a generated `.htaccess`), and both
that folder and any real `public/api/config.php` are `.gitignore`d.

### Testing the lead store locally

CRA's dev server does not run PHP, so point the client at a small PHP server
(any PHP 7.4+ binary will do):

```bash
php -S localhost:8080 -t public
```

Then set `REACT_APP_LEADS_API_URL="http://localhost:8080/api/leads.php"` in
`.env` and restart `npm start`. `leads.php` sends permissive CORS headers, so
the cross-origin call works. Revert the variable to `/api/leads.php` before
building for production.

## Environment Variables

`.env` is **committed** to this repository as part of the existing agency
workflow, so treat every value in it as published and **rotate the secrets
before go-live**. CRA bakes these in at build time — changing one requires a
rebuild. The app reads exactly four variables; company and contact facts are
*not* among them (they live in `src/data/siteConfig.js`).

| Variable | Purpose |
|----------|---------|
| `REACT_APP_ADMIN_USERNAME` | Admin panel username |
| `REACT_APP_ADMIN_PASSWORD` | Admin panel password — set 16+ chars and rotate before deploy |
| `REACT_APP_LEADS_API_URL` | Leads API endpoint (default `/api/leads.php`) |
| `REACT_APP_LEADS_ADMIN_KEY` | Shared handshake for admin lead operations — must equal the server's key |

**`REACT_APP_LEADS_ADMIN_KEY` ↔ `ADMIN_API_KEY` pairing.** The server resolves
its key in this order: `ADMIN_API_KEY` defined in `public/api/config.php` → a
`LEADS_ADMIN_KEY` / `ADMIN_API_KEY` environment variable → the committed
fallback inside `leads.php`. That fallback already matches the committed `.env`,
so cross-device sync works with no server-side setup. If you *do* create a
`config.php` (or set the env var), it **overrides** the fallback — and if it
does not hold the exact key the deployed build was compiled with, every admin
call returns 401 while public submissions keep saving invisibly. Rotate both
sides together and rebuild. Diagnose mismatches at
`https://yourdomain/api/leads.php?action=health`, a public endpoint that reports
the active key source and whether the caller's key matches, and exposes no lead
data.

Rotation runbook: [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md#8-rotating-admin-credentials--the-leads-api-key).

## Documentation

- **[CLAUDE.md](CLAUDE.md)** — Project instructions for AI-assisted work, plus
  the contracts that must never change
- **[CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)** — Maintenance guide:
  copy, expertise areas, industries, tokens, logo, adding a page, credentials
- **[SEO_GUIDE.md](SEO_GUIDE.md)** — SEO architecture + post-launch checklist
- **[CHANGELOG.md](CHANGELOG.md)** — What has changed
- **[prompts/README.md](prompts/README.md)** — The rebuild prompt series and its
  series-wide conventions (historical record — do not edit)

Deployment steps (hosting requirements, SPA rewrite rules, asset caching,
post-deploy checks and the **first-launch go-live checklist**) live in the admin
panel's own **Guidelines → Deployment** tab (`/admin/guideline`), which is the
copy the site operator sees.

The Apache configuration is committed as **`public/.htaccess`** and copied into
`build/` by `npm run build`, so a normal upload installs it — there is nothing to
hand-write on the server. It carries the SPA rewrite (with the `^api/` exclusion
that keeps `/api/leads.php` reachable), long-lived immutable caching for
`/static/**` and `/images/**`, `no-cache` for `index.html`, and basic hardening.
Two things to watch when uploading: many FTP clients hide dotfiles and will skip
it silently, and hosts that ignore `.htaccess` need the same rules pasted into
the vhost config instead.

## License

Proprietary — `UNLICENSED`. © Dulcey Lead Services. All rights reserved.
