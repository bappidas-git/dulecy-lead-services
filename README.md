# Nilachal Infracon Private Limited — Official Website

A minimal, mobile-first **one-page business website** for **Nilachal Infracon
Private Limited**, an infrastructure & building-materials company based in
Nagaon, Assam (Northeast India), whose flagship retail brand is **North East
Buildmart**. The page presents the company, its products and construction
services, and captures qualified enquiries through a lead form backed by a
server-side store and a lightweight admin panel.

Built and maintained by **Assam Digital**.

> The site was rebuilt from a previous landing page through the ordered prompt
> series in [`prompts/`](prompts/README.md), kept as the rebuild record. The
> series is complete — see [`CHANGELOG.md`](CHANGELOG.md) for everything it
> changed.

## Tech Stack

- **React 18** (CRA / `react-scripts` 5, concurrent features, lazy loading)
- **Material UI v5** + **Emotion**
- **CSS Modules** + CSS custom properties
- **GSAP + ScrollTrigger** for all public-page scroll animations
  (**Framer Motion** remains only for drawer/modal mechanics and small hover
  micro-interactions)
- **React Router v7**
- **Iconify** (`mdi:*` icons), **SweetAlert2**
- **PHP** server-side lead store (`public/api/leads.php`)
- **Web Vitals** monitoring

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment file
cp .env.example .env    # then fill in the values (see "Environment Variables" below)

# 3. Start the dev server
npm start               # http://localhost:3000

# 4. Production build
npm run build           # outputs to build/
```

Admin credentials are configured through `.env` (`REACT_APP_ADMIN_USERNAME` /
`REACT_APP_ADMIN_PASSWORD`) — they are intentionally **not** published here.

## Project Structure

```
├── public/
│   ├── api/                # Server-side endpoints (leads.php shared store, config)
│   ├── index.html          # HTML template (SEO meta, JSON-LD)
│   ├── manifest.json       # PWA manifest
│   ├── robots.txt          # Search-engine directives
│   └── sitemap.xml         # Sitemap
├── src/
│   ├── admin/              # Admin panel (components, pages, context, utils)
│   ├── animations/         # GSAP hooks: useReveal, useStaggerReveal, useCountUp, useParallax
│   ├── components/
│   │   ├── common/         # Header, Footer, UnifiedLeadForm, LeadFormDrawer, navigation, etc.
│   │   └── sections/       # Hero, About, Products, Services, Stats, Brands, WhyUs, FAQ, Contact
│   ├── config/             # Site / SEO configuration
│   ├── context/            # ModalContext (enquiry drawer), ThemeContext
│   ├── data/               # Content data files (edit these first; siteConfig.js = business truth)
│   ├── hooks/              # useMediaQuery
│   ├── pages/              # ThankYou page
│   ├── styles/             # Global CSS, variables, animations, responsive
│   ├── theme/              # MUI theme configuration
│   └── utils/              # webhookSubmit, validators, seo, swalHelper
├── prompts/                # The rebuild prompt series (run in order)
├── .env.example            # Environment variables template
├── CHANGELOG.md            # Changelog
└── CLAUDE.md               # Project instructions for AI-assisted work
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | One-page site (all public sections) |
| `/thank-you` | Post-submission thank-you page (requires a submission session flag) |
| `/admin/login` | Admin authentication |
| `/admin/*` | Protected admin panel — `dashboard`, `lms` (Lead Management + lead detail), `guideline` |

## Lead Storage Architecture

Leads are the product of this site, so they are stored **server-side** and treated
as a single source of truth:

- The public enquiry form POSTs each submission to `public/api/leads.php`
  (a shared JSON store) via `src/utils/webhookSubmit.js`.
- The admin panel reads and writes **only** the server, auto-refreshing every
  **15 seconds**, and broadcasts changes to other open tabs in the same browser
  via **BroadcastChannel**.
- There is **no `localStorage` copy of leads** — a lead submitted on one device
  appears in the admin panel on every other device.
- Duplicate prevention (by mobile number) is enforced server-side.

Configure the endpoint and its shared admin key with `REACT_APP_LEADS_API_URL`
and `REACT_APP_LEADS_ADMIN_KEY`. The committed fallback key inside `leads.php`
already matches the committed `.env`, so **no server-side setup is needed**. A
`public/api/config.php` (from `config.example.php`) or a `LEADS_ADMIN_KEY`
server env var **overrides** that fallback — if you create one, it must hold
the exact key the deployed build was compiled with, or every admin call
returns 401 while public submissions keep saving invisibly. Diagnose key
mismatches at `/api/leads.php?action=health` (public, no lead data).

## Environment Variables

`.env` is committed to the repository as part of the existing agency workflow,
so **every secret in it must be rotated before the site goes live**. The app
reads exactly four variables (company/contact facts live in
`src/data/siteConfig.js`, not `.env`):

| Variable | Purpose |
|----------|---------|
| `REACT_APP_ADMIN_USERNAME` | Admin panel username |
| `REACT_APP_ADMIN_PASSWORD` | Admin panel password (rotate before deploy) |
| `REACT_APP_LEADS_API_URL` | Leads API endpoint (default `/api/leads.php`) |
| `REACT_APP_LEADS_ADMIN_KEY` | Shared secret for admin lead operations — must match the server's key (the committed fallback in `leads.php`, or `ADMIN_API_KEY` in `public/api/config.php` if that override exists) |

## Documentation

- **[CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)** — Maintenance guide: editing content, branding, deploy steps
- **[SEO_GUIDE.md](SEO_GUIDE.md)** — SEO architecture + post-launch checklist
- **[CHANGELOG.md](CHANGELOG.md)** — What has changed
- **[CLAUDE.md](CLAUDE.md)** — Project instructions and non-negotiable contracts
- **[prompts/README.md](prompts/README.md)** — The rebuild prompt series (historical record)

## License

Proprietary — `UNLICENSED`. © Nilachal Infracon Private Limited. All rights reserved.
