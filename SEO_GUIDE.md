# SEO Guide — Dulcey Lead Services

Target site: **`https://www.dulceyleadservices.com`** — five indexable routes plus a
`noindex` admin panel and 404.

## 1. Architecture

The system is **dual-layer**. Both layers describe the same page; the runtime
layer replaces the static one *in place*, by element id, so nothing is ever
duplicated.

```
src/data/siteConfig.js ──┐
src/data/expertiseData.js├──► src/config/seo.js ──► src/utils/seo.js ──► SEOHead
src/data/industriesData.js│      (page configs        (pure schema        (rewrites
src/data/navigation.js ──┘        + schema inputs)     generators +        <head> on
                                                       DOM writers)       every route
                                                                          change)
                                       │
                                       └──► public/index.html
                                            (the same tags + the same
                                             5 schema ids, hand-written,
                                             as the no-JS fallback)
```

| Layer | File | Role |
|---|---|---|
| Static | `public/index.html` | Meta, OG/Twitter, canonical, and five JSON-LD blocks for the **home page**. What a crawler or social scraper that never runs JS sees. |
| Runtime | `src/components/common/SEO/SEOHead.jsx` | Resolves `location.pathname` → a `seoConfig.pages` entry, rewrites title / description / keywords / robots / canonical / OG / Twitter, and re-injects the JSON-LD by the same ids. |
| Config | `src/config/seo.js` | Every page's title, description, keywords, canonical path, robots, breadcrumb name, and the Organization + Service schema inputs. |
| Generators | `src/utils/seo.js` | Pure `config in → schema object out` functions, plus `injectSchema` / `removeSchema` / `updatePageSEO`. |

**Golden rule:** edit the **data files**, not the schemas. `seo.js` derives
everything from `siteConfig` (facts), `expertiseData` (the `knowsAbout` list and
the ten `Service` items), `industriesData` (keywords) and `navigation`
(breadcrumb names). When a change affects the **home page**, mirror it into the
static blocks in `public/index.html` — that file is hand-written.

## 2. Per-page configuration

Every route's metadata is one entry in `seoConfig.pages`
(`src/config/seo.js`). Titles are the mockup `<title>` values verbatim;
descriptions are written from each page's own visible copy at ~150–160
characters.

| Route | `pages` key | Title | Notes |
|---|---|---|---|
| `/` | `home` | Dulcey Lead Services — Beyond Business Support | `services: true` |
| `/about` | `about` | About — Dulcey Lead Services | |
| `/expertise` | `expertise` | Our Expertise — Dulcey Lead Services | `services: true`; keywords derived from `expertiseTitles` |
| `/industries` | `industries` | Who We Serve — Dulcey Lead Services | keywords derived from `industries` |
| `/contact` | `contact` | Contact — Dulcey Lead Services | description includes `phoneDisplay` |
| `/admin*` | `admin` | Admin Panel — Dulcey Lead Services | `noindex, nofollow`; all public schemas stripped |
| anything else | `notFound` | Page Not Found — Dulcey Lead Services | `noindex, nofollow` |

Mechanics worth knowing:

- **Canonicals** are absolute and always the indexable path. `resolvePage()`
  normalises trailing slashes, so `/about/` and `/about` never emit competing
  canonicals.
- **`noindex` routes carry no URL tags.** `og:url`, `twitter:url` and the
  canonical `<link>` are *removed* (not just left stale) so `/admin` never
  inherits the previous route's URL.
- **Adding a route needs two edits**: a `pages` entry *and* a line in
  `ROUTE_MAP` inside `SEOHead.jsx`. Miss the second and the page silently falls
  through to the 404 config and is served `noindex`.

Site-level values — `siteName`, `defaultTitle`, `titleTemplate`,
`defaultDescription`, `defaultImage` (`/og-image.png`), `locale` (`en_IN`),
`language` (`en`) — sit at the top of the same file.

## 3. Meta, Open Graph & Twitter

The static home-page set lives in `public/index.html` under the
`SEO Meta Tags`, `Open Graph / Facebook`, `Twitter Card` and `Canonical URL`
comment blocks. It must match `seoConfig.pages.home`, so that a crawler which
never runs JS sees exactly what a browser does.

| Tag | Value |
|-----|-------|
| `<title>` | `Dulcey Lead Services — Beyond Business Support` |
| `meta description` | ≤160 chars, from `defaultDescription` |
| `meta keywords` | brand + the home keyword set |
| `meta author` | `Dulcey Lead Services` |
| `meta robots` / `googlebot` | `index, follow` |
| `canonical` / `og:url` / `twitter:url` | `https://www.dulceyleadservices.com/` |
| `og:type` | `website` |
| `og:title` / `og:description` | same as `<title>` / `meta description` |
| `og:image` | `https://www.dulceyleadservices.com/og-image.png` (absolute) |
| `og:image:width` / `:height` | `1200` / `630` |
| `og:site_name` | `Dulcey Lead Services` |
| `og:locale` | `en_IN` |
| `twitter:card` | `summary_large_image` |
| `theme-color` / `msapplication-TileColor` | `#0B0B0C` (`--ink`) |

**OG image requirements:** 1200×630, under ~300 KB, and an **absolute** URL —
social scrapers don't run JS or resolve relative paths.

There are deliberately **no geo tags** (`geo.region`, `geo.position`, `ICBM`):
the organization publishes no postal address, so there is no location to claim.

## 4. Schema markup (JSON-LD)

Five schemas, each existing twice — hand-written in `public/index.html` and
generated at runtime by `src/utils/seo.js` — sharing one element id:

| Element id | Schema | Generator | Emitted on |
|----|--------|-----------|------------|
| `schema-organization` | `Organization` | `generateOrganizationSchema()` | every public route |
| `schema-website` | `WebSite` | `generateWebSiteSchema()` | every public route |
| `schema-webpage` | `WebPage` | `generateWebPageSchema()` | every public route |
| `schema-breadcrumb` | `BreadcrumbList` | `generateBreadcrumbSchema()` | every public route |
| `schema-services` | `ItemList` of ten `Service` | `generateServiceSchema()` | `/` and `/expertise` only (`page.services`) |

- `Organization` carries `name`, `legalName`, `url`, `logo`, `description`,
  `slogan`, a `contactPoint` (phone + email) and `knowsAbout` (the ten expertise
  titles). `sameAs` is omitted while empty.
- `BreadcrumbList` is `Home` on `/`, and `Home → <nav label>` elsewhere — the
  crumb name comes from `navigation.js`, so it always matches the visible nav.
- Each `Service` deep-links to its accordion panel (`/expertise#e01` …`#e10`)
  and lists the organization as `provider`.
- `injectPageSchemas()` **removes** `schema-services` when navigating to a page
  that doesn't declare it, so a stale `ItemList` never lingers.
  `removePublicSchemas()` strips all five under `/admin`.

### The rule: no schema without a visible counterpart

The following are **deliberately absent**, and must stay absent:

| Not emitted | Why |
|---|---|
| `FAQPage` | The site has no visible FAQ section. Google requires the schema to mirror on-page Q&A exactly. |
| `LocalBusiness` / `PostalAddress` | There is no public postal address. Inventing one to qualify is a structured-data guidelines violation. |
| `geo` coordinates, `openingHours` | Same reason — no verifiable physical location. |
| `AggregateRating` / `Review` | No collected reviews. |

If the client later publishes a real address, hours, or profiles, add the
visible content **first**, then the schema.

### Editing schemas

Change the data files; the generators rebuild everything. Never hard-code a
`@type` in a component. Then mirror the home-page result into
`public/index.html` and re-validate:

- **Rich Results Test** — <https://search.google.com/test/rich-results>
- **Schema Markup Validator** — <https://validator.schema.org/>

Quick check that the two layers agree: load a page, then compare
`document.getElementById('schema-organization').textContent` against the block
in `public/index.html`.

## 5. Sitemap & robots

### `public/sitemap.xml`

Exactly the five indexable routes. Keep it in sync with the `<Route>` table in
`src/App.jsx` and `seoConfig.pages`; bump `lastmod` on meaningful content
changes.

| `<loc>` | `changefreq` | `priority` |
|---|---|---|
| `https://www.dulceyleadservices.com/` | monthly | 1.0 |
| `https://www.dulceyleadservices.com/expertise` | monthly | 0.9 |
| `https://www.dulceyleadservices.com/about` | yearly | 0.8 |
| `https://www.dulceyleadservices.com/industries` | yearly | 0.8 |
| `https://www.dulceyleadservices.com/contact` | yearly | 0.7 |

**Exclude** `/admin/*` and `/api/*`.

### `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://www.dulceyleadservices.com/sitemap.xml
```

## 6. Favicons, PWA icons & the OG image

Generated from the Dulcey brand marks by committed scripts (dev deps `sharp`
and `png-to-ico`). Re-run them whenever the artwork changes. `generate:icons`
reads its source from disk; `generate:og` still fetches from Cloudinary, so it
needs network access.

```bash
npm run generate:icons
```

```bash
npm run generate:og
```

- `scripts/generate-icons.js` flattens the **"DLS" mark**
  (`public/images/logo/dls-mark-860.png`) onto white and centres it on square
  canvases, writing `favicon.png` (32×32), `favicon.ico` (16/32/48),
  `apple-touch-icon.png` (180×180), the `purpose: "any"` `logo192.png` /
  `logo512.png`, and the `purpose: "maskable"` `maskable-192.png` /
  `maskable-512.png`. The mark is 1.87:1, so each size is driven by a **width**
  fraction (`WIDTH_PCT`) and letterboxes vertically; `any` and `maskable` are
  separate files because the safe circle caps a mark this wide at ~70% width.
  These filenames are fixed, so `public/.htaccess` caps them at a revalidated
  day rather than the year `/images/**` gets — otherwise a rebrand would not
  reach returning visitors.
- `scripts/generate-og.js` composes the color logo, an ink headline, a red
  accent rule, the secondary tagline and the site URL into
  `public/og-image.png` (1200×630).
- `public/manifest.json` lists those real files, with name **Dulcey Lead
  Services**, `short_name` **Dulcey**, `theme_color` `#0B0B0C`,
  `background_color` `#FFFFFF`.

Page photography is separate: `npm run generate:images` refreshes the
self-hosted hero/band images and sector icons in `public/images/`.

## 7. Performance SEO (already in place)

- Every route except `/` is code-split, and the whole `/admin` tree is behind
  its own `lazy()` boundary, so it never ships in the public bundle.
- Fonts are preconnected and preloaded with an async swap; the home hero image
  is preloaded for LCP (home route only, via the inline script in
  `index.html`).
- Hero/band photos are self-hosted WebP at 1920w/960w with a JPEG fallback;
  Cloudinary logos are requested at 2× their CSS box through `logoAt()`.
- One `<h1>` per page, `<h2>` per section, `<h3>` for cards — verified in the
  Prompt 12 accessibility sweep (axe: zero violations; Lighthouse
  Accessibility 100).
- Core Web Vitals are reported through `src/reportWebVitals.js`.

## 8. Post-launch checklist

Once the site is live on `https://www.dulceyleadservices.com`:

```
- [ ] Deploy: view-source and confirm the live <head> matches public/index.html
- [ ] Client-side nav: visit all five routes, confirm <title>, description and
        canonical change per route (and that /admin is noindex with no schemas)
- [ ] Google Search Console — add & verify the domain property
- [ ] GSC — submit https://www.dulceyleadservices.com/sitemap.xml
- [ ] GSC — URL Inspection on / and /expertise → Request Indexing
- [ ] Bing Webmaster Tools — add the site, submit the sitemap
- [ ] Rich Results Test on / and /expertise: Organization, WebSite, WebPage,
        BreadcrumbList and the Service ItemList all parse without errors
- [ ] Schema Markup Validator on all five routes
- [ ] Facebook Sharing Debugger + LinkedIn Post Inspector → OG image renders
- [ ] X/Twitter Card Validator → summary_large_image renders
- [ ] Lighthouse SEO ≥ 95 on every route
- [ ] Monitor Core Web Vitals (LCP / INP / CLS) in GSC and PageSpeed Insights
- [ ] Fill organization.sameAs in src/config/seo.js + siteConfig.social once the
        client provides real social profiles
- [ ] Do NOT add LocalBusiness/FAQPage unless the matching visible content ships
```
