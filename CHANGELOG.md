# Changelog

All notable changes to the **Dulcey Lead Services** website. The site was built
through the ordered prompt series in [`prompts/`](prompts/README.md) — one
prompt per branch/PR — and the entries below summarise each phase under the
`2.0.0` release.

> **History prior to `2.0.0` lives in git.** This repository previously held an
> unrelated one-page site for a different company. Its changelog narrative has
> been removed rather than carried forward; `git log` (and the merged PRs) keep
> the full record if you need it.

The format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [2.4.0] — 2026-08-08 — DLS hero watermark

The Home hero floated the old "D" monogram — the same Cloudinary asset the
favicon pipeline eats. The client supplied the "DLS" initialism mark, so that
watermark now draws it, self-hosted alongside the wordmark.

### Added

- **`public/images/logo/dls-mark-860.png`** — 860×460 (1.87:1), 16.3 KB PNG-8,
  flat `#ED1C24` on a real alpha channel. Cut from the client's 3646×2045
  export by trimming its uniform ~104px transparent padding down to the artwork
  bounding box, then resampling to 860w (lanczos3). Trimming is what lets a CSS
  `width` map straight onto the visible mark instead of onto padding.
- **`siteConfig.logoMark` + `MARK_SIZE`** — the same contract the wordmark uses:
  a root-relative path plus the intrinsic size, so the `<img>` reserves the
  right box before the file lands and CSS drives only the width.
- The supplied artwork already peaked at **alpha 255**, so `[2.3.0]`'s
  `×255/222` normalisation pass does not apply here. Verified before shipping
  rather than assumed.

### Changed

- **The hero watermark's width ramp: `26vw / 380px` → `30vw / 430px`.** The
  monogram is square; this lockup is 1.87:1, so at the mockup's width it would
  draw 203px tall — about half the monogram's height — and read as a stray line
  rather than a mark. 430px is also the ceiling the 860px master supports at 2×,
  so it never upscales: measured 0.5 at 1440px and 1920px, 0.27 at 768px, 0.22
  at 375px.
- **Its opacity now splits at the existing 920px breakpoint: `0.07` below,
  `0.04` above.** The monogram is a thin outlined D on a white disc, most of
  which is invisible against the page; DLS is three solid slab glyphs at 59% ink
  coverage — so the same alpha does very different things to the two marks, and
  the right value moves with the mark's size and with what sits behind it.
  Above 920px the mark is 2.3× wider over the lighter full-bleed scrim, and 0.07
  laid down ~4.7× the monogram's integrated darkening: it stopped reading as a
  watermark and read as a second headline behind the first. 0.04 brings that to
  ~2.7× with a peak darkening of 7/255 against the monogram's 18/255. Below
  920px the mark is at its 190px floor inside the photo band, where the backdrop
  re-crops and the scrim thins — 0.04 disappeared into the handshake entirely,
  so the mockup's 0.07 stays. Both values were picked off rendered ladders
  composited over the hero's real photo-plus-scrim stack at 1440px and 375px,
  not off the numbers alone. The split lands on the same breakpoint the backdrop
  already switches on, because it is that switch it is compensating for.
- **`siteConfig.logoIcon` is now a favicon/PWA/splash asset only.** It keeps its
  legacy `Dulecy-Logo-Icon_hylrpw.png` public_id and both hard-coded copies
  (`scripts/generate-icons.js`, the `public/index.html` splash) are untouched —
  but nothing in `src/` renders it any more.
- **`logoAt()` is kept with no caller**, and says so in its own doc comment. Its
  one consumer was this watermark. `logoIcon` is still live in the icon
  pipeline and this remains the only way to size it, so removing the helper
  would cost more than the six lines it saves.

### Verified

Geometry measured from the live DOM at 320 / 375 / 768 / 919 / 920 / 1440 /
1920px: no horizontal overflow at any width, no upscaling past 1:1, aspect held
at 1.870, the opacity flipping on exactly the intended side of the breakpoint
(0.07 at 919px, 0.04 at 920px), and the mark overlapping the badge pill at
375px exactly as the monogram already did — at a lower alpha than before above
920px, and the same 0.07 below it. `npm run build` with `CI=true` compiles with
no warnings. The `floaty` keyframes and the `prefers-reduced-motion` stop are
unchanged.

## [2.3.1] — 2026-08-08 — Even gradient accents

`[2.3.0]`'s companion PR (#44) set `box-decoration-break: clone` on
`.grad-text` so a wrapped red accent stopped showing one bright line above one
dark one. It fixed the banding but not the cause: the ramp was still
horizontal, so it was still as long as whatever line fragment it painted.

### Changed

- **`--grad-text` is now `linear-gradient(180deg, …)`** — vertical, where
  `mockup/styles.css` sets `120deg`. A deliberate departure, mirrored in
  `muiTheme.js`'s `gradients.text`. `--grad` (buttons, cards) stays at `135deg`;
  those boxes never fragment, so they were never affected.
- **Why the axis and not the `box-decoration-break` value.** `.grad-text` sits
  on inline `<em>`s inside display headlines, so it fragments — one box per
  wrapped line — and a CSS gradient's ramp is exactly as long as the box it
  paints. With a horizontal component, neither value works: `slice` splits one
  ramp across the lines by share, and `clone` gives each line the whole ramp but
  over its own width. On `/expertise` at 1440px that meant "people," (280px) ran
  the ramp over 286px while "processes & performance" (958px) ran it over 873px
  — **3× the rate**. "people," fell from `#E3273B` to `#AD1021` inside a single
  word, then "processes" directly beneath it snapped back to `#E6283D`.
- **Vertical removes the width term entirely.** The ramp length becomes the
  inline box height, identical for every fragment of a headline at every
  viewport. Measured on all 8 accents across `/`, `/about`, `/expertise`,
  `/industries` and `/contact` at 320 / 375 / 768 / 1440px — including the
  3-line `/expertise` wrap at 320px and the 2-line `/contact` wrap — every
  fragment of a headline now paints the same ramp with no variation along the
  line (at 1440px both `/expertise` lines run `#E7283D` → `#A90F1F` over 87px).
- **`box-decoration-break: clone` is kept but demoted.** A vertical ramp renders
  identically under both values, so the fix no longer depends on that property
  being supported anywhere; the declaration stays only to keep a future padded
  or bordered accent consistent.

## [2.3.0] — 2026-08-07 — Sharp wordmark

`[2.2.0]` shipped the wordmark from the only artwork then available — a blurred
raster lifted out of a PDF — and recorded the soft "Beyond Business Support"
line as a known limitation. The client has now supplied the real files
(3750×906 PNGs with a true alpha channel), so that limitation is resolved: the
tagline and the ™ are crisp at every size the site draws them.

### Changed

- **New masters, new filenames.** `dulcey-wordmark-1351.png` (ink `#0B0B0C`)
  and `dulcey-wordmark-white-1351.png`, 1351×200 / 6.76:1, ~21 KB each, PNG-8
  with a 128-colour palette. The `-1351` suffix is the width, matching the
  convention the rest of `/images/**` uses (`hero-home-1920.webp`).
  The 2.2.0 files are **deleted rather than overwritten**: they had already
  merged to `main` and `/images/**` answers `immutable, max-age=31536000`, so
  reusing the path would have pinned returning visitors to the blurred render
  for a year.
- **Alpha normalised to full opacity.** The supplied art paints its letterform
  interiors at alpha 222, which composites to `#212121` on white and `#DFDFDF`
  on the ink footer — a visible wash against the site's real ink. Both masters
  are rescaled `×255/222` and clamped, so the solid body reaches 255 while the
  antialiased edge ramp stays proportional. RGB is pinned to `--ink` `#0B0B0C`
  / pure white on every pixel, transparent ones included, so the downscale
  cannot pull a stray colour into the edges.
- **Cut from the shared alpha bounding box** `x179 y248 3419×506` — identical in
  both source files, so the ink and white variants stay pixel-interchangeable.
  Trimming the transparent padding takes the lockup from the raw 4.14:1 to
  6.76:1, within 4% of the 2.2.0 aspect, so the responsive sizing tuned for it
  still holds. Downscaled to height 200 with lanczos3.
- **Aspect-dependent values updated** for 6.49:1 → 6.76:1: `LOGO_SIZE` is now
  `{ width: 1351, height: 200 }`, and the rendered-width figures in the
  `Header` / `Footer` / `AdminLogin` comments (270px at 40px tall, 351px at
  52px, 230px at 34px, 196px at 29px).
- **`.mobileMenuLogo` in the admin topbar** gained the `max-width: 100%` +
  `object-fit: contain` floor every other logo surface already carried.
- **References repointed** — `siteConfig.logo` / `logoWhite`, `LOGO_FILE` in
  `scripts/generate-og.js`, and the two absolute JSON-LD `logo` URLs in
  `public/index.html`. `public/og-image.png` regenerated.

### Verified

- No horizontal overflow and the header row holds 68px at 280 / 361 / 431 /
  1280 px; the logo steps 29 → 34 → 40px across the 360px/430px breakpoints
  with 16px minimum clearance to the burger at the tightest width.
- Footer draws the white variant on `rgb(11,11,12)` and fits its 391px brand
  column; admin login draws the ink variant on white and letterboxes cleanly
  inside a 240px content box at 320px wide.

### Unchanged

- **`logoIcon` is still the old "D" monogram on Cloudinary**, so the splash
  screen and the generated favicons still do not match the wordmark. That needs
  new icon artwork from the client; `npm run generate:icons` regenerates them
  once it lands.

## [2.2.0] — 2026-08-07 — New wordmark

The brand mark changed. The old lockup — a "D" monogram with a bar-chart arrow
beside a serif "DULCEY / LEAD SERVICES" — is replaced by the supplied
sans-serif wordmark, "Dulcey Lead Services™" over "Beyond Business Support".
Both versions are self-hosted with a transparent background.

### Changed

- **`siteConfig.logo` / `logoWhite` now point at `public/images/logo/`** rather
  than Cloudinary: `dulcey-wordmark.png` (ink `#0B0B0C`) and
  `dulcey-wordmark-white.png`. One 1298×200 master each, 22 KB, PNG-8 with a
  128-colour palette — a quarter the size of the full-depth encoding and
  visually identical, since the mark is one colour at varying alpha.
- **Real alpha, no white plate.** The background is genuinely transparent, so
  the same file sits on white, `--bg-grey`, and ink. The footer draws the white
  variant on the dark panel.
- **`logoIcon` still lives on Cloudinary** and is unchanged — it drives the
  splash screen and the generated favicons. It is the *old* "D" monogram, so
  the splash and the favicon no longer match the new wordmark; regenerate them
  once the client supplies the new icon artwork.
- **Responsive sizing, because the lockup is much wider.** At 6.49:1 it draws
  ~71% wider than the old 3.79:1 mark at the same height. The header steps
  40px → 34px → 29px at 430px / 360px; the footer uses
  `clamp(38px, 8.5vw, 52px)`; the admin login card drops 48px → 40px. Every
  surface also carries `max-width: 100%` + `object-fit: contain`, so the mark
  letterboxes rather than distorting if a column ever gets narrower still.
  Verified with no horizontal overflow at 280 / 320 / 360 / 431 / 768 / 1280 px.
- **`LOGO_SIZE`** (`{ width: 1298, height: 200 }`) is exported from
  `siteConfig` and used for every `width`/`height` attribute, so the 6.49:1 box
  is reserved before the file lands.
- **`absoluteUrl()`** added to `siteConfig`. The logo values are root-relative
  now, and `seoConfig.organization.logo` — which a crawler reads — has to be
  fully qualified. The two static JSON-LD blocks in `public/index.html` were
  updated to the same absolute URL.
- **`logoAt()` returns non-Cloudinary URLs untouched** instead of silently
  no-op'ing through a `.replace()` that can never match. The wordmark call
  sites now reference `siteConfig.logo*` directly.
- **`npm run generate:og` reads the wordmark off disk** rather than fetching it,
  so it no longer needs the network; `public/og-image.png` regenerated.

### Known limitation — resolved in [2.3.0]

- **The "Beyond Business Support" line in the lockup is soft.** The only
  artwork supplied was a blurred raster embedded in a PDF (a 1945×356 ink map
  whose peak ink varies with stroke size — 242 on the wordmark, 167 on the
  tagline, 94 on the ™). In that source the tagline's letterforms have already
  merged: a horizontal profile across its x-height never dips between letters,
  only at the word spaces. That is unrecoverable by processing — local-max
  normalisation just blooms the merged letters into blobs. The large wordmark
  itself resamples cleanly. Replace with a vector original when one is
  available; **ship it under a new filename**, since `/images/**` is served
  `immutable`.

## [2.1.2] — 2026-08-06 — Open ampersand

Archivo draws its ampersand as a closed, rotated-8 form with no diagonal leg. It
reads as a stylistic tic rather than an `&` — most visibly in "Schools **&**
Colleges", "HR **&** People Management", and the stroke-only "**&** Priorities"
word in the About band. Fixed site-wide by widening the existing Inter subset by
one glyph, without changing the typeface.

### Changed

- **Ampersand is now the conventional open `&` everywhere.** The Google Fonts
  request that already carried the round full stop is now subset with
  `text=.%26`, so Google ships a 2.2 KB Inter file (up from 1.6 KB) whose
  `@font-face` rules carry `unicode-range: U+26, U+2e`. `'Inter'` was already at
  the head of the sans stacks, so no stack, class, or markup changed — every
  other character still falls through to Archivo. Verified at 375 / 760 /
  1280 px.
- Updated in the same five places the full stop is declared: the `@import` in
  `src/styles/global.css`, the preload + `<noscript>` links in
  `public/index.html`, and the preload list in `src/index.js` (URLs), plus the
  explanatory comments on `--font-primary` (`src/styles/variables.css`) and
  `FONT_SANS` (`src/theme/muiTheme.js`).
- The `%26` must stay percent-encoded — a bare `&` terminates the `text` query
  param, which silently drops the ampersand from the subset while leaving the
  period working.
- `--font-serif` left untouched. Instrument Serif's italic ampersand is a
  deliberate calligraphic form, so `/expertise`'s serif-italic hero line
  ("people, processes & performance.") keeps it.

## [2.1.1] — 2026-08-06 — Round full stop

Archivo draws its period as a hard square. At display sizes — "offer services**.**
We deliver _impact_**.**" in the home hero — it reads as a rendering defect
rather than a typographic choice. Fixed site-wide without changing the typeface.

### Changed

- **Full stop is now round everywhere.** A Google Fonts request subset with
  `text=.` ships a single 1.6 KB Inter glyph whose `@font-face` rules carry
  `unicode-range: U+2e`. Putting `'Inter'` at the head of the sans stacks
  overrides Archivo's square period and nothing else — every other character
  still falls through to Archivo, so headline, body, and admin type are
  pixel-identical apart from the dot. Verified at 375 / 760 / 1280 px.
- Declared in `--font-primary` / `--font-heading` / `--font-body`
  (`src/styles/variables.css`), `FONT_SANS` (`src/theme/muiTheme.js`), the
  `@import` in `src/styles/global.css`, the preload + `<noscript>` links and the
  four splash-screen `font-family` rules in `public/index.html`, and the preload
  list in `src/index.js`.
- `--font-serif` left untouched — Instrument Serif's period is already round.

## [2.1.0] — 2026-08-02 — Brand spelling correction: Dulecy → Dulcey

The client's brand name is **Dulcey**, not "Dulecy" — the rebuild had carried
the wrong spelling throughout. Corrected everywhere, and the site URL moved to
the brand's actual domain.

### Changed

- **Brand name** — every occurrence of `Dulecy` / `dulecy` / `DULECY` rewritten
  to `Dulcey` / `dulcey` / `DULCEY` across `src/`, `public/`, `scripts/`,
  `/mockup`, `/prompts`, and all documentation (80 files). This includes
  `siteConfig.legalName` / `brandName`, page titles, meta descriptions, the
  five JSON-LD blocks in `public/index.html`, `manifest.json`, the footer
  watermark, and the admin panel.
- **Site URL** — `https://www.dulecy.com` → `https://www.dulceyleadservices.com`
  in `siteConfig.siteUrl`, and therefore in every canonical, OG/Twitter URL and
  schema `url` derived from it, plus `public/sitemap.xml`, `public/robots.txt`
  and the static head in `public/index.html`.
- **Logo assets** — `siteConfig.logo` and `siteConfig.logoWhite` re-pointed to
  the new Dulcey-spelled artwork (`v1785682949/Dulcey-Logo_tmkfku.png` and
  `v1785682948/Dulcey-Logo-White_pthxu2.png`). The previous commit had updated
  `/mockup` and the generator scripts but left `siteConfig.js` on the superseded
  `_qr2ka7` / `_uxpsb6` uploads, so the header, footer, admin topbar and login
  card were still serving the old logos.
- **`src/styles/dulecy.css` → `src/styles/dulcey.css`** (import in
  `src/index.js` and the module comments that reference it updated).
- **`public/og-image.png`** regenerated — the wordmark, headline and site URL
  are drawn into the PNG, so the old spelling was baked in.
- **`package.json`** `name` → `dulcey-lead-services-website`, description and
  the `dulecy` keyword.

### Unchanged (deliberately)

- **`siteConfig.logoIcon`** keeps the public_id `Dulecy-Logo-Icon_hylrpw.png`.
  That string is Cloudinary's immutable delivery path for the "D" mark, not a
  brand string — rewriting it would 404 the favicon/PWA icon source. The
  generated icons in `public/` are unaffected and were not regenerated.
- **Admin credentials** — `dulecyadmin` and the `Dulecy@Admin2026` fallback in
  `src/admin/utils/adminAuth.js` are left as-is so the rebrand does not
  invalidate operator logins. Rotate them deliberately, not as a side effect.
- **Lead record field keys, status `value` keys, and the `leads.php` contract**
  — untouched; only comments in those files changed.
- **`dulceyleadservices@gmail.com`** — already the correct spelling, so the
  "intentional misspelling" caveat that used to guard it has been removed from
  `CLAUDE.md`, `CUSTOMIZATION_GUIDE.md` and the prompt docs.

## [2.0.0] — 2026-08-02 — Dulcey Lead Services rebuild

Converted the repository into the production website for **Dulcey Lead
Services**, matching the static design source in `/mockup` — five public pages,
a new enquiry flow, and a rebranded admin panel — while reusing the existing
lead-storage pipeline unchanged.

### 01 — Brand foundation & configuration

**Changed**
- `src/data/siteConfig.js` re-pointed to Dulcey: brand/legal name, tagline
  "Beyond Business Support" + `taglineSecondary`, phone `+91 70990 02522`,
  `dulceyleadservices@gmail.com`, `https://www.dulceyleadservices.com`,
  and the three Cloudinary logos (adds `logoIcon`).
- `src/styles/variables.css` gained the mockup's Dulcey token block (ink, the
  grey ramp, `--line`, `--bg-grey`, `--red`, `--red-hi`, the two gradients) and
  re-pointed every legacy alias family — including `--admin-*` — onto it;
  `src/theme/muiTheme.js` mirrors it.
- Typography switched to **Archivo** + **Instrument Serif**.
- Rotated the admin credentials and the 48-char `REACT_APP_LEADS_ADMIN_KEY`,
  mirrored byte-for-byte into the committed fallback in `public/api/leads.php`.

### 02 — Routing shell, header, mobile menu & footer

**Added**
- Five public routes — `/`, `/about`, `/expertise`, `/industries` (nav label
  "Who We Serve"), `/contact` — plus a branded `*` NotFound, all inside one
  `PublicLayout` so the shell mounts once. Home is eager; the rest are lazy.
- `Header` (fixed 68px, 920px nav breakpoint), the full-screen `MobileMenu`,
  and the dark `Footer`, all mapping over the new `src/data/navigation.js`.
- `ScrollManager`: top on route change, or a poll-until-mounted hash scroll
  (90px header offset) for the `/expertise` deep links.

### 03 — Home page

**Added**
- Seven sections ported 1:1 from `mockup/index.html`: hero (parallax backdrop,
  staggered intro), the rotated marquee strip, Who We Are, the dark Belief band,
  the ten-row expertise index (deep-linking to `/expertise#e01`–`#e10`), the
  seven sector cards, and the closing CTA.
- The shared data layer (`expertiseData.js`, `industriesData.js`) and the GSAP
  hooks that Prompts 04–06 reuse.

### 04 — About page

**Added**
- Six sections ported from `mockup/about.html`: type-only hero, the dark
  Intersection band, Perspective, Difference, Principles, and the Commitment
  CTA — verbatim copy and the mockup's exact motion.

### 05 — Expertise page

**Added**
- Hero, the ten-area single-open accordion with working `#e01`–`#e10` deep
  links (matching-hash-wins on load, `ScrollTrigger.refresh()` on every toggle),
  and the grey "Start with a conversation" CTA.

### 06 — Who We Serve & Contact pages

**Added**
- `/industries`: hero, the seven sector cards plus the red gradient CTA card,
  and the split CTA section.
- `/contact`: the reply-time badge and headline, the phone/email cards, the
  pull quote, and the grey enquiry panel — from `mockup/contact.html`.

### 07 — Unified lead form & enquiry modal

**Changed**
- `UnifiedLeadForm` rewritten as a 1:1 port of the mockup's `.lead-form` (plain
  inputs + CSS Modules, no MUI). Fields: name\*, email\*, phone, organization,
  "what do you need support with?"\*, message — options come from
  `expertiseData` titles + "Something else". Success renders inline.
- Lead contract: adds the optional `organization` key, makes `email` required
  and `mobile` optional, and sends `state` empty. No other key changed and
  `public/api/leads.php` needed no edit (the store is schemaless).
- `ModalContext`: `openLeadDrawer`/`closeLeadDrawer` → `openLeadModal`/
  `closeLeadModal`; scroll lock moved into the new component.

**Added**
- `LeadModal` — a centered modal (portal, backdrop/✕/Escape close, focus trap +
  restore, reduced-motion aware) replacing the side drawer.
- `getOptionalMobileErrorMessage()` in `src/utils/validators.js`.

**Removed**
- The `/thank-you` route — the form now confirms in place.

### 08 — Admin panel

**Changed**
- Login, topbar, dashboard and the guideline gate read the logo and brand name
  from `siteConfig`; admin `.module.css` files swept onto the Dulcey tokens.
- Lead surfaces reshaped around the Prompt 07 payload: an **Organization**
  column replaces State in Lead Management, Lead Detail and the dashboard
  tables, with a new "Interested In" filter and organization folded into search.
- Status **labels** re-mapped onto the consulting pipeline — notably
  `consultation_booked` → "Proposal Sent" and `procedure_scheduled` →
  "Follow-Up". The persisted `value` keys are unchanged.
- The four Guidelines tabs rewritten for Dulcey.

### 09 — Animation & interaction parity

**Fixed**
- `scheduleRefresh()` coalesces a burst of `ScrollTrigger.refresh()` calls into
  one per frame (a Home commit was running 20 full re-measures).
- Refresh on modal open/close (the scroll lock collapses the document) and once
  on window `load`.
- `.link-more` no longer inherits the legacy global 150ms link transition.
- Remaining motion that ignored `prefers-reduced-motion`.

### 10 — SEO

**Changed**
- `src/config/seo.js` rebuilt around `siteConfig` / `expertiseData` /
  `industriesData` / `navigation`: per-route title, description, canonical,
  robots and derived keywords for the five pages, plus `noindex` admin and 404
  entries.
- `src/utils/seo.js` now emits Organization, WebSite, WebPage, BreadcrumbList
  and an `ItemList` of ten `Service` items (each deep-linked to
  `/expertise#eNN`), keeping the same-id injection contract with the static
  blocks in `public/index.html`.
- `robots.txt` and a five-URL `sitemap.xml`; regenerated favicons, PWA icons and
  the OG image from the Dulcey logo.

**Removed**
- `FAQPage`, `LocalBusiness`, `PostalAddress`, geo coordinates, opening hours
  and `areaServed` — the site has no visible FAQ and no public postal address,
  so emitting them would be fabricated.

### 11 — Legacy purge & cleanup

**Removed**
- The previous site's section components, floating UI (mobile drawer, WhatsApp
  FAB, scroll progress, back-to-top), the retired `/thank-you` page and the
  `LeadFormDrawer`.
- Eight orphaned `src/data/*.js` content modules, `useCountUp`, `DURATION.fast`,
  an unused `SectionLoader` variant, **framer-motion**, and 41 dead CSS aliases.
- The last legacy brand strings — comments included — bringing the repo-wide
  count to zero outside `/mockup` and `/prompts`.

### 12 — Assets, performance & accessibility

**Changed**
- Every Unsplash and icons8 hotlink replaced with a first-party asset:
  `npm run generate:images` emits WebP at 1920w/960w plus a JPEG fallback into
  `public/images/` (heaviest photo 229 KB).
- `logoAt()` requests right-sized Cloudinary logos (`f_auto,q_auto:best` at 2×
  the CSS box) — the colour logo went 282 KB → 7 KB — and the home hero is
  preloaded for LCP.
- SweetAlert2 is loaded on first use, and the whole `/admin` tree moved behind a
  single `lazy()` boundary via `AdminLoginRoute` / `AdminProtectedShell`, so
  neither ships in the public bundle.

**Fixed**
- WCAG 2.1 AA sweep: contrast, heading order and focus management. axe-core
  reports zero violations across all five routes, the open modal and the mobile
  menu; Lighthouse Accessibility 100 on every route.

**Added**
- A "Caching & compression" block in the admin Deployment guide (the `.htaccess`
  itself lands with Prompt 14).

### 13 — Documentation

**Changed**
- Rewrote `README.md`, `CLAUDE.md`, `CHANGELOG.md`, `CUSTOMIZATION_GUIDE.md` and
  `SEO_GUIDE.md` for the Dulcey codebase — routes, data layer, animation
  parameters, the lead-storage contract, the design tokens and the SEO system
  all verified against the code rather than carried over. No source changes.

### 14 — Production readiness & final QA

**Added**
- `public/.htaccess` — the Apache configuration, copied into `build/` by
  `npm run build` so a normal upload installs it. Carries the SPA rewrite with
  an `^api/` exclusion (a blanket fallback would serve `index.html` to
  `/api/leads.php` and lose every enquiry silently), immutable caching for
  `/static/**` and `/images/**`, `no-cache` for `index.html`, `Options -Indexes`
  and a dotfile block that deliberately spares `/.well-known/` so Let's Encrypt
  renewal keeps working. Every rule is commented with the reason it exists.
- A first-launch **go-live checklist** in the admin Deployment guide: rotate the
  admin password and leads key, align or delete `api/config.php`, rebuild,
  upload, confirm `action=health` returns JSON, run a real test lead, verify
  deep-link refresh, force the `https` + `www` canonical host, submit the
  sitemap.

**Changed**
- The Deployment guide no longer tells operators to hand-write `.htaccess`; it
  now documents the shipped file and warns that FTP clients routinely skip
  dotfiles. `README.md` gained the matching pointer.

**Fixed**
- **Cross-tab admin sync never actually converged.** Two bugs stacked on top of
  each other, both surfaced by the Prompt 14 QA pass:
  1. `onLeadsChanged` treated the same-tab event and the BroadcastChannel
     message identically, calling the handler straight away. But `_cache` is
     per-JS-context, so a tab receiving a broadcast just re-read its own stale
     copy and rendered the same thing. The broadcast path now re-syncs from the
     server first, and is deliberately not visibility-gated.
  2. `notifyLeadsChanged()` fired *before* `callLeadsApi()` sent the write, so
     even a correct listener fetched a server snapshot that predated the change
     — and, the broadcast already consumed, stayed stale until its next poll.
     Notification is now split: `notifyLeadsChanged()` for this tab (the cache
     is already updated optimistically) and `broadcastLeadsChanged()` for
     siblings, fired only once the server write resolves.

  A note or status change made in one tab now appears in another within one
  request, verified with both tabs hidden and never focused so neither the 15 s
  poll nor the focus sync could mask the result. No localStorage copy of leads
  was introduced; the server remains the single source of truth.
- Ordering bug in the first draft of `public/.htaccess`: the `LONG_CACHE`
  tagging rules sat *after* the "serve real files" rule, which ends in `[L]` and
  stops rewrite processing — so `/static/**` and `/images/**` would never have
  been tagged and the immutable `Cache-Control` header would never have applied.
  Caught by QA before merge; the tagging now runs first.
