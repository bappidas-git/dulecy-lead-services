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
