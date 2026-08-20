# Dulcey Lead Services — Maintenance Guide

How to change the site after launch: copy, expertise areas, sectors, contact
facts, design tokens, the logo, pages, and credentials. Written for whoever
maintains the site — each section is a complete recipe, in the order you'd
actually touch the files.

> **Golden rule:** business facts (brand name, tagline, phone, email, site URL,
> logo URLs) live in **`src/data/siteConfig.js`** — the single source of truth.
> Components, the footer, the enquiry form and the SEO layer all read from it.
> Never hardcode a phone number or an email address in a component.
>
> **Second rule:** the brand is spelled **Dulcey** everywhere — except
> `siteConfig.logoIcon`, whose Cloudinary path still reads
> `Dulecy-Logo-Icon_hylrpw.png`. That is the asset's immutable public_id, not a
> brand string; rewriting it 404s the favicon source. The admin username
> `dulecyadmin` is likewise left alone so the rebrand doesn't lock anyone out.

Every change below needs `npm run build` and a redeploy to reach the live site.

## 1. Where things live

| You want to change… | Edit |
|---|---|
| A contact fact, the tagline, a logo URL | `src/data/siteConfig.js` |
| Nav labels / order | `src/data/navigation.js` |
| The ten expertise areas | `src/data/expertiseData.js` |
| The seven sectors + the marquee strip | `src/data/industriesData.js` |
| Page headlines and prose | the section component under `src/pages/<Page>/sections/` |
| Colors, type scale, spacing | `src/styles/variables.css` (+ `src/theme/muiTheme.js`) |
| Shared button / display classes | `src/styles/dulcey.css` |
| Page titles, descriptions, schemas | `src/config/seo.js` (+ `public/index.html`) |
| Admin credentials, leads API key | `.env` |

`/mockup` is the design contract and `/prompts` is the rebuild record — read
them, never edit them.

## 2. Changing site copy

Structured, repeated content lives in `src/data/`:

| File | Drives |
|------|--------|
| `siteConfig.js` | Header/footer brand, contact rows, form fallback messages, every SEO schema |
| `navigation.js` | Desktop nav, mobile menu (with its `01`–`05` numbering), footer "Explore" column |
| `expertiseData.js` | Home expertise index, the `/expertise` accordion, the enquiry form's options, the `Service` schema |
| `industriesData.js` | Home sector cards, the `/industries` grid, the home marquee strip |

Everything else — headlines, ledes, statements, CTA labels — is inline in the
section components, one component + one `.module.css` per section under
`src/pages/<Page>/sections/`. Find the string with a grep and edit it in place;
copy is taken verbatim from `/mockup`, so check there before rewording.

## 3. Adding or editing an expertise area

One entry in `src/data/expertiseData.js` feeds four surfaces. Add the object,
and the accordion, the home index, the form and the schema all pick it up.

```js
{
  id: 'e11',                       // accordion DOM id → /expertise#e11
  num: '11',
  title: 'Your New Area',          // ALSO becomes an enquiry-form option
  tagline: 'Short line for the accordion',
  homeTagline: 'Shorter line',     // optional — home row only, if it differs
  description: '…',                // the schema's `description`
  note: '…',
  closing: '…',
  tags: ['Tag one', 'Tag two'],
}
```

Then work down this list:

1. **Accordion** (`/expertise`) — automatic. `ExpertiseAccordion` maps
   `expertiseAreas`; item 01 stays open by default and a matching `#id` in the
   URL wins on load.
2. **Home index rows** — automatic. `ExpertiseIndexSection` maps the same array
   and reads the tagline through `homeTaglineFor(area)`, so it shows
   `homeTagline` when present and `tagline` otherwise.
3. **Enquiry form options** — automatic. `UnifiedLeadForm` builds its list from
   `expertiseAreas.map(a => a.title)` plus "Something else". ⚠️ The **title is
   the value stored** in each lead's `service_interest`. Renaming a title does
   not migrate existing leads: old leads keep the old string, and the admin
   "Interested In" filter unions the stored values with the current titles so
   both remain selectable. Prefer adding over renaming.
4. **Service schema (runtime)** — automatic. `seoConfig.services` maps
   `expertiseAreas` into the `ItemList`, and `knowsAbout` from
   `expertiseTitles`.
5. **Service schema (static)** — **manual**. Mirror the new item into the
   `#schema-services` block in `public/index.html`, and add the title to
   `#schema-organization`'s `knowsAbout`. That block is the no-JS fallback and
   is hand-written.
6. **Keywords** — `seoConfig.pages.expertise.keywords` is derived from
   `expertiseTitles`, so it updates itself.

Deleting an area is the same list in reverse. Check for hardcoded deep links
(`grep -rn "expertise#e" src/`) before removing an `id`.

## 4. Adding or editing a sector card

Add an entry to `industries` in `src/data/industriesData.js`:

```js
{
  num: '08',
  name: 'Full Name For The /industries Card',
  description: 'One sentence, shown on the /industries card.',
  icon: '/images/icons/your-icon-d5192e.png',
  homeTitle: 'Short Name',                  // home card
  homeDesc: 'Short line for the home card.',// home card
}
```

- The icon is a **self-hosted** PNG in `public/images/icons/`. The committed set
  are the mockup's icons8 glyphs in Dulcey red (`d5192e` on light backgrounds,
  `f0293e` for the footer's ink background). To add one, drop the file in that
  folder — or add its source to the `ICONS` list in
  `scripts/generate-images.js` and run `npm run generate:images`.
- `/industries` and the home page render from the same entry with different
  copy (`name`/`description` vs `homeTitle`/`homeDesc`) — fill in all four.
- The marquee strip under the home hero is the **separate** `marqueeItems`
  array in the same file; add the sector there too if it should scroll past.
- `seoConfig.pages.industries.keywords` derives from `industries`, so it follows
  automatically.

## 5. Changing contact facts

1. Edit `src/data/siteConfig.js` — `phone` (E.164, no spaces), `phoneDisplay`
   (what users see), `email`, `siteUrl`. The derived `telHref` / `mailHref`
   update with them, and every component, the enquiry form's fallback messages,
   and the runtime Organization schema follow.
2. Mirror the change into the **static** blocks in `public/index.html`:
   `#schema-organization` → `contactPoint.telephone` (hyphenated, e.g.
   `+91-70990-02522`) and `contactPoint.email`.
3. If `siteUrl` changes, also update `public/sitemap.xml` (all five `<loc>`s),
   `public/robots.txt` (the `Sitemap:` line), and the absolute `og:url` /
   `canonical` in `public/index.html`. See `SEO_GUIDE.md`.
4. Social profiles: fill `siteConfig.social` **and**
   `seoConfig.organization.sameAs` when the client provides them — both are
   deliberately empty today, and empty entries are dropped rather than rendered.

There is intentionally **no postal address**: the brand publishes none, so the
site claims none. Don't add one to a schema (see `SEO_GUIDE.md` §4).

## 6. Design tokens & theme

Tokens live in **`src/styles/variables.css`** and are mirrored in
**`src/theme/muiTheme.js`** — change both together.

| Token | Value | Use |
|-------|-------|-----|
| `--ink` | `#0B0B0C` | Headlines, header/footer, body text |
| `--grey-1` … `--grey-4` | `#2A2A2E` · `#4A4A4F` · `#6B6B70` · `#8B8B92` | Body copy ramp, from strongest to muted |
| `--line` | `#E7E7EA` | Thin 1px borders and rules |
| `--bg-grey` | `#F5F5F6` | Alternating sections, the enquiry panel |
| `--red` | `#D5192E` | Dulcey red — eyebrows, links, highlights |
| `--red-hi` | `#F0293E` | Brighter red on dark backgrounds |
| `--grad` | `linear-gradient(135deg,#E8293E 0%,#A80E1E 100%)` | Primary pill button |
| `--grad-text` | `linear-gradient(120deg,#E8293E,#A80E1E)` | Gradient headline words |

Notes:

- **Red is used sparingly** — CTAs, eyebrows, and key highlights only. That
  restraint *is* the design system.
- Legacy alias names (`--color-primary`, `--color-accent`, `--accent-gold*`,
  `--accent-amber*`, the `--icon-*` / `--card-*` swatches) are kept mapped onto
  the Dulcey values so older `.module.css` references stay valid. Don't delete
  them; don't use them in new code.
- Keep the MUI palette **alias keys** (`palette.orange`, `palette.accent`,
  `palette.navy`) — components reference them through `sx`.
- Admin colors are the separate `--admin-*` block at the bottom of
  `variables.css`.
- Typography is **Archivo** (400/500/600/700/800) with **Instrument Serif** for
  italic accent words; both are loaded in `public/index.html`. Changing fonts
  means editing that `<link>`, `--font-*` in `variables.css`, and `FONT_SANS` /
  `FONT_SERIF` in `muiTheme.js`.
- The sans stacks lead with **`'Inter'`**, which is _not_ a second typeface: a
  `text=.%26` Google Fonts request subsets it to two glyphs carrying
  `unicode-range: U+26, U+2e`, so it overrides Archivo's square full stop with a
  round one and Archivo's closed rotated-8 ampersand with a conventional open
  `&` — and nothing else. Keep it first in `--font-primary` / `--font-heading` /
  `--font-body` and in `FONT_SANS`; dropping it or reordering the stack brings
  both Archivo glyphs back. Keep the `%26` percent-encoded in the URL: a bare
  `&` ends the `text` param and silently drops the ampersand from the subset.
- Shared button and display classes (`.btn`, `.btn--primary`, `.btn--outline`,
  `.eyebrow`, `.display`, `.lede`, `.section-head`, `.rule`, …) are global, in
  `src/styles/dulcey.css` — edit there, not per component.

## 7. Swapping the logo

1. Drop the new wordmark files into `public/images/logo/` — an ink version and
   a white one, both with a transparent background. **Use a new filename**:
   `/images/**` is served `immutable`, so overwriting in place leaves returning
   visitors on the old file for a year. The "DLS" mark lives beside them
   (`dls-mark-860.png`) and feeds the favicons; the old "D" monogram still
   lives on Cloudinary and now only feeds the splash screen.
2. Update `logo` / `logoWhite` / `logoIcon` in `src/data/siteConfig.js` — the
   header, mobile menu, footer, admin topbar and admin login all read from
   there. Set `LOGO_SIZE` to the new file's intrinsic pixel size in the same
   pass; every `<img>` uses it for `width`/`height`.
3. If the aspect ratio changed, re-check the rendered width at 320px. The
   current lockup is 6.76:1, which is why the header steps down at 430px/360px
   (`Header.module.css`), the footer clamps its height (`Footer.module.css`),
   and the admin login draws it at 40px (`AdminLogin.module.css`).
   Check the alpha, too: supplied artwork has arrived painted at ~87% opacity,
   which renders grey rather than `--ink` / white. Normalise the alpha channel
   so the solid interior hits 255 before shipping it.
4. Swapping the **"DLS" mark** is its own pass: new file into
   `public/images/logo/` (new filename again), then `logoMark` and `MARK_SIZE`
   in `siteConfig.js` **and `MARK_FILE` in `scripts/generate-icons.js`**, then
   re-run `npm run generate:icons`. Trim the artwork to its own bounding box
   first — the client's exports arrive with transparent padding, and the icon
   generator's width fractions are written against the visible mark, not the
   canvas. Its only surface is the favicon / PWA icon set: nothing in `src/`
   draws it. If the new mark's aspect ratio differs from this one's 1.87:1,
   re-check `WIDTH_PCT` in the generator — the `maskable` value in particular
   is derived from that ratio against Android's 80%-diameter safe circle.
5. Update the hardcoded URLs outside the data layer:
   - the splash-loader `<img>` (the Cloudinary "D" mark) and the JSON-LD
     `logo` values (absolute URLs) in `public/index.html`
   - `MARK_FILE` in `scripts/generate-icons.js`
   - `LOGO_FILE` in `scripts/generate-og.js`, then re-run `npm run generate:og`
6. Regenerate the derived assets:

```bash
npm run generate:icons
```

```bash
npm run generate:og
```

   (`generate:icons` writes `favicon.ico`, `favicon.png`, `apple-touch-icon.png`,
   `logo192.png`, `logo512.png`, `maskable-192.png`, `maskable-512.png` — it
   reads its source from disk; `generate:og` writes `og-image.png` at 1200×630
   and fetches its logo over the network. If you add or drop an icon file, keep
   `public/manifest.json` and the `<FilesMatch>` icon-cache rule in
   `public/.htaccess` in step with it.)
7. If the brand color changed, update `theme_color` in `public/manifest.json`
   and the `INK` / `RED` constants in `scripts/generate-og.js`.
8. Rebuild and redeploy.

## 8. Rotating Admin Credentials & the Leads API Key

All four variables live in `.env`, which is **committed** to this repository —
treat every value in it as published. CRA bakes them in at build time, so any
change needs a rebuild.

### Admin login

```env
REACT_APP_ADMIN_USERNAME="..."
REACT_APP_ADMIN_PASSWORD="..."   # 16+ chars, unique
```

Rebuild, redeploy, and log in again — existing sessions live in `localStorage`
for 24 hours and are not invalidated by the change.

### Leads API key

`REACT_APP_LEADS_ADMIN_KEY` (client) must exactly equal the key the server
resolves. The server checks, in order:

1. `ADMIN_API_KEY` defined in `public/api/config.php`
2. a `LEADS_ADMIN_KEY` / `ADMIN_API_KEY` environment variable
3. the committed fallback inside `public/api/leads.php`

The fallback already matches the committed `.env`, so sync works out of the box
with **no server-side setup**. To move to your own private pair:

1. On the server, copy `public/api/config.example.php` → `public/api/config.php`
   and set `define('ADMIN_API_KEY', '<long random string>');`
   (or set a `LEADS_ADMIN_KEY` env var in the hosting panel — no file needed).
2. Put the **same value** in `.env` as `REACT_APP_LEADS_ADMIN_KEY`.
3. `npm run build` and redeploy.

> **Warning — do steps 1–3 together or not at all.** `config.php` (or the env
> var) *overrides* the built-in key. Creating one without rebuilding the client
> with the matching value locks the admin panel out: every list/update/delete
> returns **401** on every device, while public submissions keep saving
> invisibly into `api/data/leads.json`. Diagnose at
> `https://yourdomain/api/leads.php?action=health` — it reports which source the
> server's key comes from (`config` / `env` / `default`), a short fingerprint,
> and whether the caller's key matched, without exposing any lead data. The
> admin panel already surfaces that as an actionable message instead of a bare
> 401.

`public/api/config.php` and `public/api/data/` are `.gitignore`d — never commit
a real private key.

### Guidelines tab password

The `/admin/guideline` gate is a constant at the top of
`src/admin/pages/Guideline.jsx` (`GUIDELINE_PASSWORD`). Change it there and
rebuild.

## 9. Adding a page

Say you're adding `/insights`. Five files, in this order:

1. **The page** — `src/pages/Insights/InsightsPage.jsx` (+ `index.js`,
   `InsightsPage.module.css`, and a `sections/` folder if it needs one). Use the
   animation hooks from `src/animations` for anything that moves.
2. **The route** — `src/App.jsx`: add a lazy import and a
   `<Route path="/insights" element={lazyRoute(<InsightsPage />)} />` **inside**
   the `PublicLayout` route, above the `*` catch-all.
3. **The nav** — `src/data/navigation.js`: append
   `{ to: '/insights', label: 'Insights', num: '06' }`. The desktop nav, the
   mobile menu and the footer "Explore" column all pick it up.
4. **SEO** — `src/config/seo.js`: add a `pages.insights` entry (`path`,
   `breadcrumb: navLabel('/insights')`, `title`, `description`, `keywords`,
   `robots`, and `services: true` only if the page lists the expertise areas).
   Then add `'/insights': pages.insights` to `ROUTE_MAP` in
   `src/components/common/SEO/SEOHead.jsx` — **without this the page falls
   through to the 404 config and is served `noindex`.**
5. **The sitemap** — `public/sitemap.xml`: add a `<url>` block with the new
   `<loc>`, a current `<lastmod>` and a sensible `<priority>`.

Then confirm the deep-link behaviour you need: `ScrollManager` in `App.jsx`
handles top-of-page on navigation and `#hash` targets (90px header offset)
automatically.

## 10. Quick reference

| What to change | Where |
|----------------|-------|
| Contact facts, tagline, logos | `src/data/siteConfig.js` (+ static blocks in `public/index.html`) |
| Nav labels / order | `src/data/navigation.js` |
| Expertise areas / sectors | `src/data/expertiseData.js`, `src/data/industriesData.js` |
| Page prose | `src/pages/<Page>/sections/*.jsx` |
| Brand colors, type, spacing | `src/styles/variables.css` + `src/theme/muiTheme.js` |
| Buttons / display classes | `src/styles/dulcey.css` |
| Animation parameters | `src/animations/gsapSetup.js` (presets) — see `CLAUDE.md` |
| Admin credentials | `.env` (rebuild required) |
| Leads API endpoint + key | `.env` ↔ `public/api/config.php` |
| Guidelines tab password | `src/admin/pages/Guideline.jsx` |
| Lead status labels | `src/admin/utils/leadStatus.js` (labels only — never the `value` keys) |
| SEO meta / schemas | `src/config/seo.js` + `public/index.html` (see `SEO_GUIDE.md`) |
| Sitemap / robots | `public/sitemap.xml`, `public/robots.txt` |
| Favicons / OG image / photos | `npm run generate:icons` / `:og` / `:images` |

**Deployment** — hosting requirements, the SPA rewrite rules, caching headers
and the post-deploy checks live in the admin panel's own **Guidelines →
Deployment** tab (`/admin/guideline`), which is the copy the site operator sees.
