# SEO Guide — Nilachal Infracon

## 1. Overview

The site's SEO is **dual-layer**:

1. **Static layer** — `public/index.html` carries the meta tags, Open Graph /
   Twitter cards, and five JSON-LD `<script>` blocks. These are the fallback
   that crawlers which don't execute JavaScript (and social scrapers) read.
2. **Runtime layer** — `src/components/common/SEO/SEOHead.jsx` calls the
   utilities in `src/utils/seo.js`, which read `src/config/seo.js` and inject
   JSON-LD using the **same element ids** as the static blocks, replacing them
   at runtime and updating the title / description / canonical per route.

Everything is generated from the **single sources of business truth** so the
schemas can never drift from the visible site:

| Source of truth | Feeds |
|-----------------|-------|
| `src/data/siteConfig.js` | company/contact facts, logo, site URL, maps query |
| `src/data/locationData.js` | the 8 Northeast states (`areaServed`) |
| `src/data/faqData.js` | the FAQ section **and** the FAQPage schema (must match) |
| `src/data/servicesData.js` | the Service ItemList schema |

**Golden rule:** update the data files, not the schemas. When you change a fact
in `siteConfig.js` or a Q&A in `faqData.js`, update the matching **static**
block in `public/index.html` too (the runtime layer picks it up automatically).

Target queries this site is built to rank for: *Nilachal Infracon*, *North East
Buildmart*, *building materials Nagaon*, *construction materials Assam*,
*building materials supplier Northeast India*, *construction company Nagaon
Assam*.

---

## 2. Meta Tags Checklist

All meta tags live in `public/index.html` under the `<!-- SEO Meta Tags -->`
section; the runtime values come from `src/config/seo.js`.

| Tag | Where | Value |
|-----|-------|-------|
| `<title>` | `index.html` + `seo.js` `pages.home.title` | `Nilachal Infracon — Building Materials & Construction, Northeast India` |
| `meta description` | `index.html` + `seo.js` `defaultDescription` | ≤160 chars, mentions North East Buildmart + Nagaon/Assam + CTA |
| `meta keywords` | `index.html` + `seo.js` `pages.home.keywords` | brand + category + geo terms |
| `meta author` | `index.html` | `Nilachal Infracon Private Limited` |
| `meta robots` | `index.html` | `index, follow` |
| `canonical` | `index.html` | `https://www.nilachalinfracon.com/` |

**Restricted pages:** `SEOHead` sets `noindex, nofollow` at runtime for
`/thank-you` and everything under `/admin` (`seo.js` → `pages.thankYou` /
`pages.admin`) and strips the public schemas from admin routes.

**Geo tags** (below the author meta):

```html
<meta name="geo.region" content="IN-AS" />
<meta name="geo.placename" content="Nagaon" />
<meta name="geo.position" content="26.3489;92.6820" />
<meta name="ICBM" content="26.3489, 92.6820" />
```

> The geo coordinates are approximate for the Nagaon / Lawkhowa Road area
> (town centre ≈ `26.3504, 92.6796`). Refine them — and the `openingHours` in
> `seo.js` `localBusiness` (currently a Mon–Sat 09:00–19:00 placeholder) — once
> the client confirms the exact store location and hours.

---

## 3. Open Graph & Twitter Cards

Located in `public/index.html` under `<!-- Open Graph / Facebook -->` and
`<!-- Twitter Card -->`. Keep the two consistent.

| Tag | Value |
|-----|-------|
| `og:type` | `website` |
| `og:url` / `canonical` | `https://www.nilachalinfracon.com/` |
| `og:title` | same as `<title>` |
| `og:description` | same as `meta description` |
| `og:image` | `https://www.nilachalinfracon.com/og-image.png` (absolute) |
| `og:image:width` / `:height` | `1200` / `630` |
| `og:image:alt` | `Nilachal Infracon — Building the Future of Northeast India` |
| `og:site_name` | `Nilachal Infracon` |
| `og:locale` | `en_IN` |
| `twitter:card` | `summary_large_image` |

The runtime layer keeps `og:image` / `twitter:image` in sync via
`seo.js` `defaultImage`. **OG image requirements:** 1200×630, < 300 KB, absolute
URL (social scrapers don't run JS or resolve relative paths).

---

## 4. Schema Markup (JSON-LD)

Five schemas, static (`public/index.html`) + runtime (`src/utils/seo.js`
generators reading `src/config/seo.js`), sharing element ids:

| id | Schema | Generator | Config |
|----|--------|-----------|--------|
| `schema-organization` | `Organization` | `generateOrganizationSchema()` | `organization` |
| `schema-localbusiness` | `["LocalBusiness","HomeAndConstructionBusiness"]` | `generateLocalBusinessSchema()` | `localBusiness` |
| `schema-faq` | `FAQPage` | `generateFAQSchema()` | `faqs` (← `faqData`) |
| `schema-breadcrumb` | `BreadcrumbList` | `generateBreadcrumbSchema()` | — (single Home crumb) |
| `schema-webpage` | `WebPage` / `WebSite` | `generateWebPageSchema()` | `pages.home` |

A sixth, `schema-services` (`ItemList` of `Service`), is injected by
`ServicesSection` from `servicesData` — provider is the organization,
`areaServed` is the 8 NE states.

### FAQPage must mirror the visible FAQ

Google requires the FAQPage schema to match the on-page FAQ **exactly**. Both
the FAQ section and the schema read `src/data/faqData.js`, so they stay in sync
automatically — but the **static** block in `public/index.html` is hand-written:
if you edit `faqData.js`, mirror the change in `#schema-faq`. (Quick check:
paste both into the Rich Results Test and confirm the questions line up.)

### Editing schemas

Change the **data files** (`siteConfig.js`, `faqData.js`, `servicesData.js`,
`locationData.js`); the runtime generators regenerate everything. The generators
take schema types and catalog names **from config** — never hard-code a
`@type`. `localBusiness.type` is an array and `additionalType` points at a
building-materials type hint (productontology.org).

---

## 5. Sitemap & Robots

### `public/sitemap.xml`

Single-page site — one URL. Bump `lastmod` on meaningful content changes:

```xml
<url>
  <loc>https://www.nilachalinfracon.com/</loc>
  <lastmod>2026-07-26</lastmod>
  <changefreq>monthly</changefreq>
  <priority>1.0</priority>
</url>
```

**Exclude** `/admin/*`, `/thank-you`, `/api/*` from the sitemap.

### `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /thank-you

Sitemap: https://www.nilachalinfracon.com/sitemap.xml
```

---

## 6. Favicons, PWA Icons & OG Image

These assets are generated from the Nilachal logo by committed scripts (dev
deps: `sharp`, `png-to-ico`). Re-run them if the logo changes.

```bash
npm run generate:icons   # → public/favicon.ico, favicon.png,
                         #   apple-touch-icon.png, logo192.png, logo512.png
npm run generate:og      # → public/og-image.png (1200×630)
```

- `scripts/generate-icons.js` crops the logo's **emblem** (the illustration
  above the wordmark, which stays legible at small sizes), then renders the
  favicon set and maskable-safe 192/512 PWA icons on white.
- `scripts/generate-og.js` composes the white logo + headline on the navy
  brand background into the social share image.
- `public/manifest.json` lists the real icon files (`favicon.ico`,
  `logo192.png`, `logo512.png` — `any maskable`), name **Nilachal Infracon**,
  `theme_color #16324F`, `background_color #FFFFFF`.

---

## 7. Performance SEO (already handled)

- Lazy-loaded, code-split sections (`React.lazy()`), skeleton loaders (low CLS).
- Inter font preloaded with async swap; preconnect to font + Iconify hosts.
- Images always declare `width`/`height`/`alt` and `loading="lazy"`.
- Core Web Vitals tracked via `src/reportWebVitals.js`.
- Single `<h1>` (hero), `<h2>` per section, `<h3>` for card/pillar titles.

---

## 8. Post-Launch Checklist

Once the site is live on `https://www.nilachalinfracon.com`:

```
- [ ] Deploy: confirm the live head matches public/index.html (view-source)
- [ ] Google Search Console — add & verify the domain property
- [ ] GSC — submit https://www.nilachalinfracon.com/sitemap.xml
- [ ] GSC — "URL Inspection" on / → Request Indexing
- [ ] Bing Webmaster Tools — add the site, submit the sitemap
- [ ] Rich Results Test (https://search.google.com/test/rich-results) on /:
        confirms Organization, LocalBusiness, FAQPage, Breadcrumb parse
- [ ] Schema Markup Validator (https://validator.schema.org/) on /
- [ ] Facebook Sharing Debugger + LinkedIn Post Inspector → OG image renders
- [ ] X/Twitter Card Validator → summary_large_image renders
- [ ] Lighthouse SEO audit ≥ 95; verify title/description/canonical/robots
- [ ] Confirm FAQPage questions == the visible FAQ section (Google guideline)
- [ ] Google Business Profile — create/claim the Nagaon listing (NAP must match
        siteConfig: name, address, phone) and link the website
- [ ] Fill organization.sameAs in seo.js + the OG tags once social profiles exist
- [ ] Confirm real business hours + exact store geo; update seo.js localBusiness
```
