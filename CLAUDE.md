# Nilachal Infracon Private Limited — Official Website

## Overview

A one-page business website for **Nilachal Infracon Private Limited** — an
infrastructure & building-materials company based in Nagaon, Assam (Northeast
India), whose flagship retail brand is **North East Buildmart**. The site is a
minimal, Apple-like single page (generous whitespace, restrained color, large
tight-tracked headlines) with GSAP + ScrollTrigger animations, an enquiry form
that feeds a server-side lead store, and an admin panel with a **Dashboard** and
**Lead Management**. Built with React 18 (CRA / react-scripts 5), Material UI v5,
and CSS Modules.

> **Rebuild complete.** This repository was converted from its previous life
> as an unrelated legacy landing page into the Nilachal Infracon site via the
> ordered prompt series in `prompts/` (kept as the rebuild record — see
> `prompts/README.md`). All fourteen prompts have run; treat the codebase
> described below as the final state.

## Business Facts

Single source of truth for identity details used across the site, SEO, and docs:

- **Company**: Nilachal Infracon Private Limited
- **Tagline**: "Building Tomorrow, Together."
- **Flagship brand**: North East Buildmart (building-materials retail brand)
- **Registered office**: Lawkhowa Road, Near Aditya Multispeciality Hospital, Nagaon, Assam – 782003
- **Phone**: +91 86385 43526 · tel/WhatsApp: `+918638543526`
- **Email**: info@nilachalinfracon.com
- **CIN**: U46630AS2026PTC030754
- **Site URL**: `https://www.nilachalinfracon.com`
- **Logos** (use everywhere — never any older brand assets):
  - Color (light backgrounds): `https://res.cloudinary.com/dn9gyaiik/image/upload/v1784965863/nilachal-logo_v2lolq.png`
  - White (dark backgrounds): `https://res.cloudinary.com/dn9gyaiik/image/upload/v1784965863/nilachal-logo-white_hus13s.png`

## Project Structure

_(Paths evolve across the rebuild series; update this list as later prompts move things.)_

- `src/components/sections/` — Page sections, in final one-pager order (anchor
  ids in parentheses):
  `HeroSection` (`#home`), `AboutSection` (`#about` — Welcome +
  Mission/Vision/Values/Commitment), `ProductsSection` (`#products` — North East
  Buildmart product categories), `ServicesSection` (`#services` — construction &
  infrastructure services), `StatsSection` (dark metrics band, no anchor),
  `BrandsSection` (`#brands` — partner-brand strip + mid-page CTA),
  `WhyUsSection` (`#why-us` — why-choose-us value props),
  `FAQSection` (`#faq` — FAQ accordion), `ContactSection` (`#contact` — Get in
  Touch: contact rows + lazy Google-Maps embed + serving-state pills, and the
  embedded `UnifiedLeadForm`). Header scroll offset is 80px.
- `src/components/common/` — Reusable components (Header, Footer,
  UnifiedLeadForm, LeadFormDrawer, etc.)
- `src/data/` — Centralized content layer. `siteConfig.js` is the **single
  source of business truth** (company/contact facts + `telHref` / `waHref` /
  `mailHref` / `fullAddress` helpers) — never hardcode contact/company facts in
  components; import them from here. Content files: `productsData.js` (North East
  Buildmart categories), `servicesData.js` (construction services), `statsData.js`,
  `brandsData.js` (partner brands), `featuresData.js` (why-choose-us points),
  `aboutData.js` (welcome + Mission/Vision/Values/Commitment), `faqData.js`,
  `locationData.js` (office + states served, derived from `siteConfig`).
- `src/config/` — Site/SEO configuration
- `src/context/` — React context providers (`ModalContext` drives the enquiry
  drawer; `ThemeContext`)
- `src/hooks/` — Custom hooks (useMediaQuery)
- `src/utils/` — Utility functions (webhook submit, validators, etc.)
- `src/admin/` — Admin panel (components, pages, context, utils)
- `src/pages/` — Full pages (ThankYou)
- `public/` — Static assets, index.html, manifest, robots.txt, sitemap.xml
- `public/api/` — Server-side endpoints (`leads.php` shared lead store)

## Lead Storage & Sync

Leads are stored server-side in `public/api/leads.php` (a shared JSON store) —
this is the **single source of truth**. The public enquiry form POSTs each
submission there, and the admin panel reads/writes only the server
(auto-refreshing every 15s, with a **BroadcastChannel** keeping same-browser
tabs in sync), so every browser and device sees the same leads.
**There is no localStorage copy of leads.** Configure with
`REACT_APP_LEADS_API_URL` + `REACT_APP_LEADS_ADMIN_KEY` in `.env` (the key must
match `ADMIN_API_KEY` in `public/api/config.php`, or the committed fallback in
`public/api/leads.php`). The admin key was **rotated during the rebuild**
(prompt 10) — when deploying, any live `public/api/config.php` must set the
same `ADMIN_API_KEY` value as `.env`: `config.php` **overrides** the fallback,
and a mismatched override 401s every admin call while public submissions keep
saving (this exact failure happened on the first Cloudways deploy). Admin calls
carry the key via the `X-Admin-Key` header plus an `admin_key` query-param/body
fallback (for header-stripping proxies); all API responses are
`Cache-Control: no-store` (Varnish-safe); and the public
`GET /api/leads.php?action=health` diagnostic reports the active key source +
fingerprint and whether the caller's key matches, which the admin panel uses to
show actionable sync-error messages instead of a bare 401.

## Enquiry Form

The single enquiry form is `src/components/common/UnifiedLeadForm/` (used by
`LeadFormDrawer`, and by the Contact section from prompt 11). Its **"Interested
In"** field is a grouped MUI `Select` built from the data layer — **Products**
(the `productsData` categories) and **Services** (the `servicesData` names) plus
a "General Enquiry" option — so the value stored under `service_interest` is the
product/service label. Section tiles/rows open the drawer pre-filled: they pass
`service_interest` through `openLeadDrawer(titleKey, extraData)` →
`drawerConfig` → `LeadFormDrawer`'s `serviceInterest` prop →
`UnifiedLeadForm`'s `prefill` prop, which preselects the matching option. The
**State** field lists `locationData.servingStates` + "Other". Never rename the
lead record keys — only labels/options change.

## Admin Panel

The admin panel (`/admin/*`) is **Dashboard + Lead Management only** — clean,
professional, and styled with the Nilachal design system via the `--admin-*`
tokens in `variables.css`. Auth is `AdminAuthContext` + `ProtectedRoute`
(`REACT_APP_ADMIN_USERNAME` / `REACT_APP_ADMIN_PASSWORD`).

- **Shell** — `AdminLayout` (lazy routes + server warm-up) and `AdminTopbar`
  (Nilachal logo, nav = Dashboard · Leads · Guidelines, user chip + logout).
  `AdminLogin` is the centered Nilachal login card.
- **Dashboard** (`/admin/dashboard`) — stat tiles (Total Enquiries · New Today ·
  This Week · Conversion Rate), a hand-rolled 14-day SVG enquiry-trend sparkline,
  a status-breakdown row, and a recent-enquiries table (5 rows). Quick actions:
  View All Leads, Export CSV. All data comes from `getLeadStats()` /
  `getLeads()`; the 15s poll + BroadcastChannel sync is untouched.
- **Lead Management** (`/admin/lms`, detail at `/admin/lms/lead/:leadId`) —
  filterable/sortable enquiry table, stat cards, bulk actions, and CSV
  export/import. `LeadDetail` shows Contact Details, Enquiry, Source, Notes, and
  an Activity timeline, with the status `Select`.
- **Guidelines** (`/admin/guideline`) — password-gated hub with four tabs (Lead
  Storage · SEO Setup · Deployment · For Developers).

**Lead status taxonomy** — labels/colors are display-only; the persisted `value`
keys (in `leadStatus.js`) are **never renamed**. A lead is "converted" when its
status reaches the terminal `completed` key (this is what the dashboard
Conversion Rate counts):

| Persisted key | Label | Color |
|---|---|---|
| `new` | New | blue |
| `contacted` | Contacted | teal |
| `consultation_booked` | Quote Sent | amber |
| `procedure_scheduled` | Follow-Up | violet |
| `completed` | Converted | green |
| `not_interested` | Not Interested | grey |

## Brand Color System

The Nilachal design system is **Apple-like minimalism**: vast whitespace, a
1200px max content width, large headlines with `letter-spacing: -0.02em`, thin
1px borders instead of heavy shadows (one soft elevation token
`0 8px 30px rgba(16,28,41,.06)`), 16–20px card radii, and **green used sparingly**
(primary CTAs + key highlights only). Typography is **Inter** everywhere
(weights 300–800; Poppins is removed).

Authoritative tokens (source of truth in `src/styles/variables.css`, mirrored in
`src/theme/muiTheme.js`):

| Token | Value | Use |
|-------|-------|-----|
| `--color-primary` | `#16324F` | Deep steel navy — headings, header, footer |
| `--color-primary-dark` | `#0F2438` | Darkest navy — footer bg, hero scrim |
| `--color-primary-light` | `#274B6E` | Lighter navy |
| `--color-accent` | `#1E7B45` | Nilachal green — CTAs, highlights, links |
| `--color-accent-dark` | `#176437` | CTA hover |
| `--color-accent-tint` | `#E8F5EE` | Light green wash for chips/backgrounds |
| `--color-ink` | `#101C29` | Body headings text |
| `--color-slate` | `#4A5A6A` | Secondary text |
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-bg-subtle` | `#F5F7FA` | Alternating section background |
| `--color-border` | `#E5EAF0` | Thin 1px borders |

To customize colors, update `src/styles/variables.css`, `src/theme/muiTheme.js`
(keep the palette keys — `palette.orange`/`palette.accent`/`palette.navy` aliases
are used via `sx`), and the CSS variables in `.module.css` files. The legacy
alias names (`--accent-gold*` → navy, `--accent-orange*`/`--accent-amber*` →
green) are kept so existing `.module.css` references stay valid. Admin `--admin-*`
tokens keep their own block, aligned with the Nilachal system (navy `--admin-primary`,
green `--admin-accent`, `#F5F7FA` bg, white cards with `#E5EAF0` borders + the
soft `--admin-shadow` token).

## Animations

All public page sections use the **GSAP + ScrollTrigger** foundation in
`src/animations/` — this is the mandatory pattern (Framer Motion is retained only
for existing drawer/modal mechanics and small hover micro-interactions).

- `gsapSetup.js` — registers `ScrollTrigger` + `useGSAP`, exports `EASE`
  (`power3.out`), `DURATION` tokens, `REVEAL_START`, and `prefersReducedMotion()`.
- `useReveal` — fade-up reveal for a section (`y: 40 → 0` + opacity, once,
  `start: 'top 80%'`).
- `useStaggerReveal` — staggered children reveal for card/grid items
  (`stagger: 0.08`).
- `useCountUp` — ScrollTrigger-driven number counter with prefix/suffix
  (e.g. `10+`, `100%`).
- `useParallax` — subtle scrubbed background/image parallax (`yPercent` ±8).

Each hook returns a `ref` to attach to the target element, is SSR-safe (guards
`window`), calls `ScrollTrigger.refresh()` so lazy-mounted sections measure
correctly, and **no-ops to the final state instantly** when
`prefers-reduced-motion` is set. Import from the barrel:
`import { useReveal } from '../../../animations'`.

## SEO

The SEO system is **dual-layer** and generated from the data layer (never
hard-code business facts in schemas):

- **Static layer** — `public/index.html` holds the meta tags, Open Graph /
  Twitter cards, geo tags, and five JSON-LD blocks (`schema-organization`,
  `schema-localbusiness` = `["LocalBusiness","HomeAndConstructionBusiness"]`,
  `schema-faq`, `schema-breadcrumb`, `schema-webpage`). This is the fallback for
  crawlers/scrapers that don't run JS.
- **Runtime layer** — `SEOHead` (`src/components/common/SEO/`) calls
  `src/utils/seo.js` generators, which read `src/config/seo.js` and re-inject the
  same-id schemas at runtime, plus set title/description/canonical per route and
  `noindex` `/thank-you` + `/admin*`. `ServicesSection` injects a sixth schema,
  `schema-services` (`ItemList` of `Service`), from `servicesData`.

`src/config/seo.js` derives from the single sources of truth —
`siteConfig.js` (company/contact facts), `locationData.js` (`areaServed` = 8 NE
states), and `faqData.js`. The **FAQPage schema must match the visible FAQ
section exactly** (Google guideline); both read `faqData.js`, so edit that file
and mirror the change into the static `#schema-faq` block. Coordinates/hours in
`localBusiness` are Nagaon placeholders — confirm with the client.

**Favicons / PWA icons / OG image** are generated from the logo by committed
scripts (dev deps `sharp` + `png-to-ico`): `npm run generate:icons` and
`npm run generate:og` write into `public/` (see `SEO_GUIDE.md`). `robots.txt`
and `sitemap.xml` cover the single `/` URL; full guide + post-launch checklist
in `SEO_GUIDE.md`.

## Customization Guide

1. **Content**: Update data files in `src/data/` and hard-coded text in section components
2. **Branding**: The header, footer, and mobile drawer read the logo from `src/data/siteConfig.js` (`logo` for light backgrounds, `logoWhite` for dark) — update it there. The `public/index.html` splash logo is set separately.
3. **Contact Info**: Update `src/data/siteConfig.js` (the single source of truth — `locationData.js` derives from it) and the matching values in `.env`
4. **SEO**: Edit the data layer (`siteConfig.js` / `faqData.js` / `servicesData.js`), then `src/config/seo.js` and the matching static blocks in `public/index.html`; update `public/sitemap.xml`. See the SEO section above and `SEO_GUIDE.md`
5. **Forms**: Leads POST to the server store (`/api/leads.php`) via `src/utils/webhookSubmit.js` — usually leave the default endpoint
6. **Admin**: Update `REACT_APP_ADMIN_USERNAME` and `REACT_APP_ADMIN_PASSWORD` in `.env`

## Documentation

- `prompts/README.md` — The rebuild prompt series and series-wide conventions
- `CHANGELOG.md` — Changelog (rebuild entries accumulate under `[1.0.0]`)
- `README.md` — Project overview, quick start, routes, and env reference

## DO NOT MODIFY

These contracts keep the enquiry form and admin panel in sync across devices.
Change them only with a deliberate, coordinated update on both the client and
the PHP endpoint.

- **`public/api/leads.php` request/response contract and its auth model** — the
  action-based API (`create` / list / update / delete), its JSON response shape,
  and the admin-key gate (`REACT_APP_LEADS_ADMIN_KEY` ↔ `ADMIN_API_KEY`).
- **The admin sync pattern** — in-memory cache hydrated from the server, 15s
  poll, and BroadcastChannel for same-browser tabs. Never introduce a
  localStorage copy of lead data.
- **Lead record field keys** — the admin panel and CSV export bind to these
  exact keys; change labels/options, never the keys:
  `lead_id`, `name`, `mobile`, `email`, `service_interest`, `state`, `message`,
  `source`, `status`, `submitted_at`, `updated_at`, `notes[]`, `activity[]`.
