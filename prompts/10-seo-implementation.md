# Prompt 10 — SEO Implementation for `https://www.dulceyleadservices.com`

## 1. Objective

Rebuild the dual-layer SEO system for the five-route Dulcey site: per-route
titles/descriptions/canonicals/robots, Open Graph + Twitter cards, JSON-LD
structured data generated from the data layer, static `public/index.html`
fallback, `robots.txt`, `sitemap.xml`, and regenerated favicons/PWA
icons/OG image from the Dulcey logo.

## 2. Background

- The existing system is dual-layer and must stay that way:
  **static layer** — `public/index.html` meta + JSON-LD `<script>` blocks with
  stable element ids; **runtime layer** — `SEOHead`
  (`src/components/common/SEO/SEOHead.jsx`) calls generators in
  `src/utils/seo.js`, which read `src/config/seo.js` and re-inject same-id
  schemas per route, set title/description/canonical, and `noindex` admin
  routes. Everything derives from `siteConfig.js` and the data files — never
  hard-code business facts in schemas.
- The old site was a one-pager with Nilachal schemas
  (`schema-organization`, `schema-localbusiness`, `schema-faq`,
  `schema-breadcrumb`, `schema-webpage`, plus `schema-services` injected by a
  section). The Dulcey site is **five indexable routes** and has **no FAQ
  section and no postal address** — the schema set changes accordingly.
- Icon/OG generation scripts exist (`scripts/generate-icons.js`,
  `scripts/generate-og.js`, dev deps `sharp` + `png-to-ico`) and download a
  source logo URL, writing into `public/`.
- Canonical Dulcey facts: name Dulcey Lead Services; tagline Beyond Business
  Support; url `https://www.dulceyleadservices.com`; phone `+91 70990 02522`; email
  `dulceyleadservices@gmail.com`; logos on Cloudinary (color / white / icon —
  see `src/data/siteConfig.js` after Prompt 01). `/thank-you` no longer
  exists (Prompt 07).

## 3. Files/Folders to Inspect First

- `src/config/seo.js`, `src/utils/seo.js`, `src/components/common/SEO/SEOHead.jsx`
  (current generator/injection pattern), `src/data/siteConfig.js`,
  `src/data/expertiseData.js`, `src/data/industriesData.js`.
- `public/index.html` (all meta + five JSON-LD blocks), `public/robots.txt`,
  `public/sitemap.xml`, `public/manifest.json`, `scripts/generate-icons.js`,
  `scripts/generate-og.js`, `SEO_GUIDE.md` (structure only — rewritten in
  Prompt 13).
- Mockup `<title>` values (use as the title-pattern reference):
  `Dulcey Lead Services — Beyond Business Support` / `About — Dulcey Lead
  Services` / `Our Expertise — Dulcey Lead Services` / `Who We Serve — Dulcey
  Lead Services` / `Contact — Dulcey Lead Services`.

## 4. Exact Implementation Instructions

### 4.1 `src/config/seo.js` rewrite

- Site level: `siteName: 'Dulcey Lead Services'`, `siteUrl` from siteConfig,
  `titleTemplate: '%s — Dulcey Lead Services'`, default title
  `Dulcey Lead Services — Beyond Business Support`, locale `en_IN`, default
  image `${siteUrl}/og-image.png`.
- `pages` map for `home`, `about`, `expertise`, `industries`, `contact`
  (+ `admin`, `notFound` noindex): each with title (mockup titles above),
  a unique ~150–160-char description written from that page's actual copy,
  canonical path, and `robots: 'index, follow'` (admin/404:
  `'noindex, nofollow'`). Keywords fields are optional; if kept, derive from
  expertise/industry terms.
- `organization`: schemaType `Organization` (do **not** emit LocalBusiness —
  there is no public postal address; fabricating one violates structured-data
  guidelines): name, legalName, url, logo, description (from the footer brand
  paragraph), `contactPoint` `{ telephone: '+91-70990-02522', contactType:
  'customer service', email }`, `sameAs: []` placeholder, `slogan: 'Beyond
  Business Support'`. Add a `knowsAbout` array from the 10 expertise titles.
- Remove: FAQ config, geo/coordinates, openingHours, areaServed states,
  `localBusiness` block. Keep the file's "derive from data layer" comment
  discipline.

### 4.2 Runtime layer — `src/utils/seo.js` + `SEOHead`

- Generators (same-id injection pattern) now produce:
  `schema-organization`; `schema-website` (`WebSite` with name + url);
  `schema-webpage` (per-route `WebPage` name/description/url);
  `schema-breadcrumb` (`BreadcrumbList` — Home → current page for the four
  subpages; just Home on `/`); `schema-services` (`ItemList` of 10 `Service`
  items generated from `expertiseData`, each with name, description from its
  `description` field, provider = the Organization, url
  `${siteUrl}/expertise#eNN`) emitted on `/` and `/expertise`.
- `SEOHead` resolves the page config from `useLocation()` for the five routes
  + admin + fallback; sets `document.title`, meta description, canonical
  `<link>` (absolute, no trailing-slash variants), `robots`, OG (`og:type
  website`, `og:site_name`, per-page `og:title/description/url/image`) and
  Twitter card (`summary_large_image`) tags, updating existing tags by
  id/name rather than duplicating. Remove FAQ/geo handling and any
  `/thank-you` branch.

### 4.3 Static layer — `public/index.html`

Rewrite the head for Dulcey: title/description/keywords/author; OG + Twitter
tags for the home page; canonical `https://www.dulceyleadservices.com/`; remove all geo.*
meta and Nilachal comments; replace the five JSON-LD blocks with the new set
(`schema-organization`, `schema-website`, `schema-webpage` for home,
`schema-breadcrumb` home-only, `schema-services` with the 10 services) — ids
must match the runtime generators exactly so re-injection replaces them.
Keep: font links, splash loader, `#root`, noscript. Set
`<html lang="en">`.

### 4.4 Crawl files

- `public/robots.txt`: allow all, `Disallow: /admin`, `Sitemap:
  https://www.dulceyleadservices.com/sitemap.xml`.
- `public/sitemap.xml`: exactly five URLs (`/`, `/about`, `/expertise`,
  `/industries`, `/contact`) with sensible `changefreq`/`priority` and a
  current `lastmod`.

### 4.5 Icons, PWA, OG image

- Update both scripts' source URL(s): favicon/PWA icons from the Dulcey
  **icon** logo; OG image composition from the Dulcey color logo with brand
  colors — ink `#0B0B0C` / white background per the script's existing design,
  updated text to "Dulcey Lead Services — Beyond Business Support".
- Run `npm run generate:icons` and `npm run generate:og`; commit the
  regenerated `favicon.ico`, `favicon.png`, `apple-touch-icon.png`,
  `logo192.png`, `logo512.png`, `og-image.png`. Verify `manifest.json` icon
  entries + theme colors are consistent (theme `#0B0B0C`).

## 5. Coding Standards

Schemas generated from `siteConfig`/`expertiseData` only; escape JSON-LD
safely (existing pattern); one `<title>`/description/canonical per route (no
duplicates in DOM); keep generator functions pure and unit-testable; comments
explain *what must stay in sync with what*.

## 6. Validation Checklist

- [ ] For each of the 5 routes: DevTools shows correct title, description,
  canonical, robots, OG/Twitter tags; admin routes are noindex.
- [ ] Paste each route's rendered JSON-LD into the Schema.org validator
  (or `npx structured-data-testing-tool` if offline) — zero errors; **no**
  FAQPage, **no** LocalBusiness, **no** invented address/coordinates.
- [ ] View-source of the built `index.html` (static layer) already carries
  valid Dulcey meta + schemas for crawlers without JS.
- [ ] `robots.txt` + `sitemap.xml` valid; sitemap URLs all 200 in the built
  app (serve `build/` with rewrites).
- [ ] New icons render (browser tab, `apple-touch-icon`, manifest icons); OG
  image looks correct at 1200×630; no Nilachal pixel/text anywhere.
- [ ] `grep -ri "nilachal\|buildmart\|infracon\|nagaon" src/config src/utils/seo.js public/index.html public/robots.txt public/sitemap.xml public/manifest.json scripts/` → 0 hits.

## 7. Expected Deliverables

Rewritten `src/config/seo.js`, `src/utils/seo.js`, `SEOHead.jsx`,
`public/index.html`, `robots.txt`, `sitemap.xml`, updated generator scripts,
regenerated icon/OG binaries, consistent `manifest.json`.

## 8. Testing Requirements

`npm run build` green; `npx serve -s build` (or equivalent) and click through
all routes checking head tags update on client-side navigation (no stale
titles); Lighthouse SEO category ≥ 95 on `/` and one subpage.

## 9. Constraints

- Keep the dual-layer same-id injection architecture — do not introduce
  react-helmet or another head library.
- No fabricated facts (address, hours, geo, ratings). No FAQ schema without a
  visible FAQ.
- Do not touch lead/admin logic. `/mockup`, `/prompts` untouched.

## 10. Completion Criteria

Every public route ships accurate, validated, Dulcey-branded metadata and
schemas from both layers; crawl files and icons are correct for
`https://www.dulceyleadservices.com`; build green.

## 11. Report & PR (mandatory)

Branch `dulcey/10-seo`; commit, push, open a **draft PR**. Report a concise
summary (schema set, validator results, generated assets) and the **PR link**
(or branch + commit SHAs if PR creation is unavailable).
