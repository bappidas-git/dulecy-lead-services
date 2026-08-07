# Dulcey Lead Services — Official Website

## Overview

A **multi-page business-consulting website** for **Dulcey Lead Services** — a
professional business support and consulting organization working with
businesses, institutions, entrepreneurs, and professionals. Five public pages
(Home · About · Expertise · Who We Serve · Contact) share one shell, backed by
an enquiry modal that feeds a server-side lead store and an admin panel with a
**Dashboard** and **Lead Management**. Built with React 18 (CRA /
react-scripts 5), React Router v7, Material UI v5, CSS Modules, and GSAP +
ScrollTrigger.

**Two sources of truth for this codebase:**

| Question                                 | Source                                                                                                                                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What must the site look like / say / do? | `/mockup` — five static HTML pages + `styles.css` + `scripts.js`. Copy, colors, spacing, and interaction values are taken **verbatim** from these files. It is the design contract; never edit it. |
| How are leads stored, synced, displayed? | `public/api/leads.php` + `src/utils/webhookSubmit.js` + `src/admin/**`. Their contracts are reused, never rewritten — see **DO NOT MODIFY**.                                                       |

> **Rebuild complete.** This repository was converted from an unrelated legacy
> one-page site into the Dulcey Lead Services website via the ordered prompt
> series in `prompts/` (kept as the rebuild record — see `prompts/README.md`).
> Treat the codebase described below as the final state; do not edit `/prompts`.

## Business Facts

Single source of truth: **`src/data/siteConfig.js`**. Import from there —
never hard-code a contact or company fact in a component, script, or schema.

- **Brand / legal name**: Dulcey Lead Services
- **Tagline**: "Beyond Business Support"
- **Secondary tagline**: "Your Partner in Business Leadership"
- **Phone**: `+91 70990 02522` · `tel:+917099002522` (`telHref`)
- **Email**: `dulceyleadservices@gmail.com` (`mailHref`)
- **Site URL**: `https://www.dulceyleadservices.com`
- **Postal address**: none. The brand material publishes no address, and the
  site deliberately claims none — do not invent one (see **SEO**).
- **Social profiles**: none yet (`siteConfig.social` is `{}`,
  `seoConfig.organization.sameAs` is `[]`; empty entries are dropped/hidden).
- **Logos** — use these everywhere, never any older brand assets:
  - Ink (light backgrounds) — `siteConfig.logo`:
    `/images/logo/dulcey-wordmark-1351.png`
  - White (dark backgrounds) — `siteConfig.logoWhite`:
    `/images/logo/dulcey-wordmark-white-1351.png`
  - Icon / "D" mark — `siteConfig.logoIcon`:
    `https://res.cloudinary.com/dn9gyaiik/image/upload/v1785484838/Dulecy-Logo-Icon_hylrpw.png`
    > ⚠️ **Legacy public_id.** This one URL still reads `Dulecy-Logo-Icon`.
    > That string is Cloudinary's immutable delivery path for the asset, not a
    > brand string — "correcting" it to `Dulcey-` 404s the favicon source.
    > Leave it until the mark is re-uploaded under a new public_id.
    >
    > This is now a **favicon/PWA/splash asset only**. Nothing in `src/`
    > renders it: `scripts/generate-icons.js` and the `public/index.html`
    > splash each hard-code the same URL, and the Home hero's watermark — its
    > last consumer in the app — moved to `logoMark` below.
  - "DLS" mark — `siteConfig.logoMark`: `/images/logo/dls-mark-860.png`

**The wordmark is self-hosted and transparent.** Both PNGs are one 1351×200
master (6.76:1) with a real alpha channel — no white plate — so the same mark
sits on white, `--bg-grey`, and ink. They are **not** interchangeable with the
older 3.79:1 Cloudinary lockup: at a given height this one draws ~78% wider,
which is why the header steps down at 430px/360px and the footer uses
`clamp(38px, 8.5vw, 52px)`. Reuse `LOGO_SIZE` for the `width`/`height`
attributes rather than retyping the numbers, and keep `max-width: 100%` +
`object-fit: contain` on any new surface that draws it.

> ⚠️ **Re-cutting the artwork means a new filename.** `/images/**` answers
> `public, max-age=31536000, immutable` (see `public/.htaccess`), so overwriting
> a logo in place leaves every returning visitor on the previous render for a
> year. The `-1351` suffix is the width, matching the convention the rest of
> `/images/**` already uses (`hero-home-1920.webp`). Bump it — and update
> `LOGO_SIZE`, `LOGO_FILE` in `scripts/generate-og.js`, and the two absolute
> JSON-LD `logo` URLs in `public/index.html` — in the same pass.

> ⚠️ **Supplied logo artwork paints its interiors at partial alpha.** The
> client's files peak at alpha 222, which renders `#212121` on white and
> `#DFDFDF` on the ink footer instead of true ink and true white. The shipped
> masters are alpha-normalised (`×255/222`, clamped) so the solid body reaches
> full opacity while the antialiased edge ramp stays proportional. Re-apply that
> normalisation to any future drop rather than shipping the raw export — see
> `CHANGELOG.md` `[2.3.0]`.

**The "DLS" mark is self-hosted too, and trimmed to its own artwork.**
`dls-mark-860.png` is 860×460 (1.87:1), ~16 KB, full-alpha `#ED1C24` — the
supplied file already peaked at alpha 255, so the wordmark's normalisation pass
above does **not** apply to it. The transparent padding the client's export
carried was cropped away, so a CSS `width` maps straight onto the visible mark
with no dead margin to compensate for; keep that true of any re-cut. Reuse
`MARK_SIZE` for the `width`/`height` attributes. Its one surface is the Home
hero watermark, and it is **not** interchangeable with the "D" monogram it
replaced: the mockup's `26vw / 380px` ramp widens to `30vw / 430px` for the
1.87:1 aspect, and the opacity splits at the **same 920px breakpoint the
backdrop already switches on** — `0.07` below (small mark inside the photo
band, where less vanishes) and `0.04` above (2.3× wider over the lighter
full-bleed scrim, where 0.07 reads as a second headline). See the annotated
`.float` block in `HeroSection.module.css`. The `-860` suffix is the width and
`/images/**` is immutable, so re-cutting it means a new filename and a matching
`MARK_SIZE` bump.

`logoAt(url, { w, h })` returns a Cloudinary-resized display URL (`f_auto`,
`q_auto:best`) — pass **2× the CSS box**; it returns a non-Cloudinary URL
untouched. It currently has **no caller**: `logoIcon` was its only subject and
nothing in `src/` draws that asset any more. Kept because `logoIcon` is still
live in the icon/splash pipeline and this is the only way to size it. Wrap logo
paths in `absoluteUrl()` wherever a schema or meta tag needs a fully qualified
URL.

## Project Structure

- `src/pages/` — one folder per route, each with its own `sections/`:
  - `Home/` (`/`) — `HeroSection` · `MarqueeStrip` · `WhoWeAreSection` ·
    `BeliefSection` · `ExpertiseIndexSection` · `WhoWeServeSection` ·
    `ClosingCtaSection`
  - `About/` (`/about`) — `HeroSection` · `IntersectionSection` ·
    `PerspectiveSection` · `DifferenceSection` · `PrinciplesSection` ·
    `CommitmentSection`
  - `Expertise/` (`/expertise`) — `HeroSection` · `ExpertiseAccordion`
    (panels `#e01`–`#e10`) · `CtaSection`
  - `Industries/` (`/industries`, nav label "Who We Serve") — `HeroSection` ·
    `SectorsSection` · `CtaSection`
  - `Contact/` (`/contact`) — single page component hosting `UnifiedLeadForm`
  - `NotFound/` (`*`) — branded 404, rendered inside the public shell
- `src/components/layout/PublicLayout/` — the shared public shell (fixed
  header + `<main>` + footer + `<Outlet />`).
- `src/components/common/` — `Header`, `MobileMenu` (full-screen overlay),
  `Footer`, `LeadModal`, `UnifiedLeadForm`, `SEO/SEOHead`.
- `src/data/` — the content layer:
  - `siteConfig.js` — **business truth** + `telHref` / `mailHref` / `logoAt`
  - `navigation.js` — `NAV_LINKS`; the desktop nav, mobile menu, and footer
    "Explore" column all map over this one list
  - `expertiseData.js` — the ten areas (`expertiseAreas`, `expertiseTitles`,
    `homeTaglineFor`); drives the home index rows, the `/expertise` accordion,
    the enquiry form's options, and the Service schema
  - `industriesData.js` — the seven sectors (`industries`) + `marqueeItems`
- `src/config/seo.js` — every page title / description / keyword / schema input.
- `src/utils/` — `webhookSubmit` (lead POST), `seo` (schema generators + head
  writers), `validators`, `hashScroll` (`HEADER_OFFSET = 90`), `swalHelper`
  (lazy SweetAlert2).
- `src/animations/` — the GSAP foundation and its five hooks (barrel:
  `src/animations/index.js`).
- `src/context/` — `ModalContext` (enquiry modal state), `ThemeContext`.
- `src/hooks/` — `useMediaQuery`.
- `src/styles/` — `variables.css` (design tokens), `global.css`, `dulcey.css`
  (shared `.btn` / display-typography primitives), `animations.css`,
  `responsive.css`, `layout.module.css`.
- `src/theme/muiTheme.js` — the MUI mirror of the CSS tokens.
- `src/admin/` — the admin panel (components, pages, context, utils).
- `public/` — `index.html` (static SEO layer + splash), `manifest.json`,
  `robots.txt`, `sitemap.xml`, generated icons, `images/` (self-hosted photos
  and icons), `.htaccess`, and `api/`.
- `public/.htaccess` — the Apache config, copied into `build/` by the build. SPA
  rewrite **excluding `^api/`** (a blanket fallback would hand `index.html` to
  `/api/leads.php` and lose every enquiry silently), immutable caching for
  `/static/**` + `/images/**`, `no-cache` on `index.html`, `Options -Indexes`,
  and a dotfile block that spares `/.well-known/` so ACME renewal keeps working.
  Rule order matters: the `LONG_CACHE` tagging must precede the file-exists rule,
  which ends in `[L]`.
- `public/api/` — `leads.php` (the shared lead store) + `config.example.php`.
- `scripts/` — `generate-icons.js`, `generate-og.js`, `generate-images.js`.
- `mockup/` — the design contract. `prompts/` — the rebuild record. Neither is
  ever modified, and cleanup greps must exclude both.

## Lead Storage & Sync

Leads live server-side in `public/api/leads.php` — a single JSON store at
`public/api/data/leads.json` (created on first use with a "deny all"
`.htaccess`; both the folder and any real `config.php` are `.gitignore`d).
**This is the single source of truth. There is no localStorage copy of leads.**

**Action API** (everything on the one file):

| Action                     | Method | Auth   | Body / result                                                       |
| -------------------------- | ------ | ------ | ------------------------------------------------------------------- |
| `create`                   | POST   | public | `{ lead: {...} }` → `{ success }` or `{ success, duplicate: true }` |
| `list` (also the bare GET) | GET    | admin  | `{ success, leads: [...] }`                                         |
| `update`                   | POST   | admin  | `{ lead_id, patch }` → `{ success }`                                |
| `delete`                   | POST   | admin  | `{ lead_ids: [...] }` → `{ success, removed }`                      |
| `health`                   | GET    | public | Diagnostic — no lead data, no key material                          |

**Auth model.** Admin actions require a key sent as the `X-Admin-Key` header,
with an `admin_key` query-param **and** JSON-body fallback for proxies that
strip custom headers (a real failure mode on the first Cloudways-style deploy).
The key is compiled into the public admin bundle, so it is a sync handshake, not
a private secret. Resolution order on the server, first non-empty wins:

1. `ADMIN_API_KEY` defined in `public/api/config.php` (operator override)
2. `LEADS_ADMIN_KEY` / `ADMIN_API_KEY` environment variable
3. The committed fallback inside `leads.php`

The fallback matches `REACT_APP_LEADS_ADMIN_KEY` in the committed `.env`, so
sync works out of the box. **Rotation is coupled**: a `config.php` or env var
_overrides_ the fallback, and if it does not equal the key the deployed build
was compiled with, every admin call 401s while public submissions keep saving
invisibly. Change both sides together and rebuild.

**Other invariants:**

- Every response sends `Cache-Control: no-store` (+ `Pragma` / `Expires`) so a
  Varnish-style proxy can never serve stale — or unauthenticated — lead data,
  and can never pin a 401 in place after the key is fixed. Admin `fetch`es also
  pass `cache: 'no-store'`.
- `GET ?action=health` reports the active key source (`config` / `env` /
  `default`), an 8-char SHA-256 fingerprint, whether this request carried a key,
  whether it matched, and whether the store is writable. `leadService`'s
  `describeSyncFailure()` turns a bare 401 into an actionable message from it.
- **Dedupe on create**: by `lead_id` (idempotent re-submits) and by trimmed
  mobile number (cross-device duplicate prevention, only when a mobile is
  present — it is optional on the Dulcey form). A duplicate answers
  `{ success: true, duplicate: true }`, never an error.
- **Append-only merges**: `notes` and `activity` patches are union-merged
  (deduped by id/timestamp, sorted chronologically) so a stale array from one
  device cannot erase another device's entries. All other fields are
  last-write-wins.
- **Admin sync pattern**: an in-memory cache in `src/admin/utils/leadService.js`
  hydrated by `syncLeadsFromServer()` (warmed once by `AdminLayout`), a **15 s**
  poll while the tab is visible on Dashboard / Lead Management / Lead Detail,
  and **BroadcastChannel** `lp_leads_channel` (plus a `lp:leads-changed` window
  event) for same-browser tabs. Writes update the cache optimistically and
  mirror to the server.
  The two notification channels are **not** interchangeable, and `onLeadsChanged`
  handles them differently on purpose. The same-tab `lp:leads-changed` event
  follows a local write that already updated the cache, so it re-reads directly.
  A BroadcastChannel message comes from a _different_ JS context whose write
  this tab's cache knows nothing about, so it **re-syncs from the server before
  re-rendering** — calling the handler alone would only re-read a stale copy.
  That path is intentionally not visibility-gated (the pollers are), because a
  broadcast proves a sibling tab just wrote.

Client configuration: `REACT_APP_LEADS_API_URL` + `REACT_APP_LEADS_ADMIN_KEY`
in `.env` (committed — rotate before launch). CRA bakes them in at build time.

## Enquiry Form

`src/components/common/UnifiedLeadForm/` is the **only** enquiry form, used in
exactly two places: the Contact page's grey panel (`source="contact-page"`) and
the global `LeadModal`. There is no forked copy.

**Field → lead-record key** (record keys are never renamed):

| Visible field                  | Record key         | Required | Notes                                                                                                                        |
| ------------------------------ | ------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| FULL NAME                      | `name`             | ✅       | max 50 chars                                                                                                                 |
| EMAIL                          | `email`            | ✅       | required as of the Dulcey rebuild                                                                                            |
| PHONE                          | `mobile`           | —        | optional; normalized to 10 digits (a pasted `+91` or leading `0` is forgiven)                                                |
| ORGANIZATION                   | `organization`     | —        | **new optional key** (Prompt 07); the PHP store is schemaless, so no server change was needed                                |
| WHAT DO YOU NEED SUPPORT WITH? | `service_interest` | ✅       | the ten `expertiseData` titles + "Something else" — **legacy key, new values**                                               |
| MESSAGE                        | `message`          | —        | max 500 chars                                                                                                                |
| _(not collected)_              | `state`            | —        | **retired but reserved** — sent empty, never renamed or reused, so the record shape stays stable for the admin table and CSV |

`webhookSubmit.js` enriches every submission with `lead_id` (UUID v4),
`status: 'new'`, `submitted_at` / `updated_at`, `page_url`, `user_agent`, the
five `utm_*` params, an empty `notes[]`, and a seeded `activity[]`
("Lead created").

**Prefill flow.** CTAs open the modal through `ModalContext`:
`openLeadModal(sourceKey, extraData)` → `modalConfig` → `LeadModal`'s
`serviceInterest` prop → `UnifiedLeadForm`'s `prefill` prop, which preselects
the option **only if it matches a real one**. The `/expertise` accordion's
"Discuss this area" button passes `{ service_interest: area.title }`; the
`sourceKey` is stored as the lead's `source` (`header-cta`, `home-hero`,
`home-cta`, `about-cta`, `expertise-cta`, `expertise-e03`, `industries-cta`,
`industries-cta-2`, `footer-cta`, `mobile-menu-cta`, `contact-page`).

**Success is inline.** On success the form is replaced in place by a
`role="status"` block ("Thank you, {firstName}.") — the page never navigates.
`/thank-you` was retired in Prompt 07. A server-detected duplicate shows a calm
"Already received!" info dialog and leaves the form as-is.

## Admin Panel

`/admin/*` is **Dashboard + Lead Management + Guidelines**, styled with the
Dulcey design system via the `--admin-*` tokens in `variables.css`. Auth is
`AdminAuthContext` + `ProtectedRoute` against `REACT_APP_ADMIN_USERNAME` /
`REACT_APP_ADMIN_PASSWORD`, with a 24-hour session in `localStorage`.

- **Shell** — `AdminLayout` (lazy routes + a `syncLeadsFromServer()` warm-up)
  and `AdminTopbar` (Dulcey logo; nav = Dashboard · Leads · Guidelines; user
  chip + logout). `AdminLogin` is the centered Dulcey login card, mounted via
  `AdminLoginRoute`; `AdminProtectedShell` wraps the rest. The whole tree is
  lazy so it never enters the public bundle.
- **Dashboard** (`/admin/dashboard`) — stat tiles (Total Enquiries · New Today ·
  This Week · Conversion Rate), a hand-rolled 14-day SVG enquiry-trend
  sparkline, a status-breakdown row, and a recent-enquiries table (5 rows).
  Quick actions: View All Leads, Export CSV. All data comes from
  `getLeadStats()` / `getLeads()`.
- **Lead Management** (`/admin/lms`, detail at `/admin/lms/lead/:leadId`) —
  filterable/sortable table (Name · Mobile · Email · **Organization** ·
  Interested In · Source · Status · Date), stat cards, bulk actions, CSV
  export/import. `LeadDetail` shows Contact Details, Enquiry, Source, Notes,
  and an Activity timeline, with the status `Select`.
- **Guidelines** (`/admin/guideline`) — password-gated hub with four tabs
  (Lead Storage · SEO Setup · Deployment · For Developers). The gate password is
  a constant at the top of `src/admin/pages/Guideline.jsx` — change it there.

**Lead status taxonomy** — labels/colors are display-only; the persisted `value`
keys (in `src/admin/utils/leadStatus.js`) are **never renamed**. A lead counts
as converted once its status reaches the terminal `completed` key — that is what
the dashboard Conversion Rate measures.

| Persisted key         | Label          | Color  |
| --------------------- | -------------- | ------ |
| `new`                 | New            | blue   |
| `contacted`           | Contacted      | teal   |
| `consultation_booked` | Proposal Sent  | amber  |
| `procedure_scheduled` | Follow-Up      | violet |
| `completed`           | Converted      | green  |
| `not_interested`      | Not Interested | grey   |

`formatActivityAction()` re-maps any quoted raw key in an older activity entry
to its current label, so the timeline never shows an internal key.

## Design System

The Dulcey system is **editorial minimalism**: near-black ink on white, one
saturated red used only for CTAs and eyebrows, giant tight-tracked display
headlines, thin 1px rules, and generous vertical rhythm. Source of truth:
`src/styles/variables.css` (mirroring `mockup/styles.css`'s `:root`), mirrored
again in `src/theme/muiTheme.js`.

| Token         | Value                                             | Use                                              |
| ------------- | ------------------------------------------------- | ------------------------------------------------ |
| `--ink`       | `#0B0B0C`                                         | Headlines, header/footer, body text              |
| `--grey-1`    | `#2A2A2E`                                         | Large body copy                                  |
| `--grey-2`    | `#4A4A4F`                                         | Lede paragraphs, secondary text                  |
| `--grey-3`    | `#6B6B70`                                         | Small body copy                                  |
| `--grey-4`    | `#8B8B92`                                         | Muted / meta text                                |
| `--line`      | `#E7E7EA`                                         | Thin 1px borders and rules                       |
| `--bg-grey`   | `#F5F5F6`                                         | Alternating section background, form panel       |
| `--red`       | `#D5192E`                                         | Dulcey red — eyebrows, links, key highlights     |
| `--red-hi`    | `#F0293E`                                         | Brighter red for dark backgrounds (footer icons) |
| `--grad`      | `linear-gradient(135deg,#E8293E 0%,#A80E1E 100%)` | Primary pill button                              |
| `--grad-text` | `linear-gradient(180deg,#E8293E,#A80E1E)`         | Gradient headline words (vertical — see below)   |

Legacy alias names (`--color-primary`, `--color-accent`, `--accent-gold*`,
`--accent-amber*`, …) are kept in `variables.css` mapped onto the Dulcey values
so older `.module.css` references stay valid — prefer the master tokens above in
new code. Admin `--admin-*` tokens keep their own block (ink `--admin-primary`,
red `--admin-accent`, `#F5F5F6` app bg, white cards, `#E7E7EA` borders, the soft
`--admin-shadow`).

**Typography** — **Archivo** (400/500/600/700/800) for everything, **Instrument
Serif** (regular + italic) for the italic accent words, both from Google Fonts
(preloaded in `public/index.html`).

**The round full stop and the open ampersand.** Archivo draws its period as a
hard square, and its ampersand as a closed rotated-8 with no diagonal leg; both
read as rendering defects in the display headlines. The three sans stacks
therefore lead with **`'Inter'`**, loaded from a `text=.%26` Google Fonts
request that subsets it to two glyphs (~2.2 KB) whose `@font-face` rules carry
`unicode-range: U+26, U+2e`. Inter renders the full stop — a circle of the same
visual weight — and the conventional open `&`; every other character falls
through to Archivo untouched. Because an `@font-face` family shadows an
installed font of the same name, a visitor with Inter installed still gets
Archivo body text. It is declared in five places that must stay in step: the
`--font-primary` / `--font-heading` / `--font-body` tokens in `variables.css`,
`FONT_SANS` in `muiTheme.js`, the `@import` in `global.css`, the preload +
`<noscript>` links and the four splash `font-family` rules in
`public/index.html`, and the preload list in `src/index.js`. **`'Inter'` must
stay first in every sans stack** — reordering or removing it silently restores
both Archivo glyphs. In the URL the ampersand **must stay percent-encoded as
`%26`**: a bare `&` terminates the `text` param, and the ampersand quietly
falls back to Archivo while the period keeps working.

`--font-serif` is deliberately left alone: Instrument Serif's period is already
round, and its italic ampersand is a calligraphic form chosen on purpose. No
visible copy currently relies on that ampersand — `/expertise`'s hero line
"people, processes & performance" was the last one, and it now renders in the
headline sans (see below), so that `&` comes from the Inter subset. Any future
serif copy that needs an ampersand still gets Instrument Serif's form.

**Every hero sets its red accent line in the headline sans.** Home
("impact"), About ("Defined by trust"), `/expertise` ("people, processes &
performance"), `/industries` ("Your industry"), and `/contact` ("what comes
next") all drop the mockup's `.serif` italic from that `<em>` and keep only
the `.grad-text` fill, so the red text matches the black text it sits with in
family, weight, size, and tracking at every viewport — a local
`font-style: normal` rule in each hero's module (`.accent`, or `.impact` on
Home) undoes the `<em>` default italic. It is a deliberate, consistent
departure from `/mockup`.

**No hero headline ends on a full stop.** The mockup full-stops every hero
clause; all five pages drop that mark and close on the word instead, the way
Home's "impact" always has — About ("Built on experience" / "Defined by
trust"), `/expertise` ("… people, processes & performance"), `/industries`
("Our expertise" / "Your industry"), `/contact` ("Let's build what comes
next"). This is copy-level only: nothing about the type sizing changed, and on
the two-clause heroes the unconditional `<br />` — not the punctuation — is
what holds a clause per line at every width. Section heads and body copy inside
the pages keep their sentence punctuation; the rule is about the `<h1>` display
lines. Another deliberate departure from `/mockup`.

**About's closing commitment lines follow the same rule.** The four "The …
behind _the …_" phrases in `CommitmentSection` drop `.serif` too, so each red
fragment matches the black lead-in it shares a line with — here the fill is the
flat `--red`, not `.grad-text`, and dropping `.serif` also restores the `750`
weight it was overriding with `400`. Because the sans sets wider than
Instrument Serif italic, the longer phrases wrap to two lines below ~418px
(all four are single lines at 420px and up) where the serif kept them on one;
that is expected, never overflows the viewport, and must not be "fixed" by
overriding `.phrase`'s `clamp(22px, 3.6vw, 38px)`, which is mockup-verbatim.
The CTA sections, the Contact pull-quote, the footer accents, and the
remaining in-body `<em>`s still use `.serif`.

**About's "distinctive perspective" head is comma-joined and hard-broken.**
`mockup/about.html` sets "Depth in pharma. Breadth across sectors." as one
full-stopped run and lets `text-wrap: balance` pick the breaks (three ragged
lines at desktop). `PerspectiveSection` replaces the middle full stop with a
comma and an unconditional `<br />`, so each clause owns a line at every
width — the same device as the Home hero's "We don't just offer services,".
Holding that needs the type to fit the **column**, not the viewport: the
aside is only ~40% of the content width while the row is two-column, but
full width once it stacks, so `.aside` is declared
`container-type: inline-size` and `.head` reads
`min(clamp(28px, 4vw, 46px), 8.6cqi)`. The mockup clamp stays the ceiling
and the `cqi` term only ever shrinks it — "Breadth across sectors." sets at
11.3× its font-size, so 8.6cqi always lands inside the column with ~3% to
spare (verified 2 lines from a 240px column to 1100px, and at 320–1920px
viewports). The bare `clamp()` above it is the fallback for browsers without
container-query units. Do not re-tune either value in isolation.

**`--grad-text` runs down the line, not across it — that is what keeps a
wrapped accent even.** The mockup sets it to `120deg`; the site sets `180deg`,
a deliberate departure. `.grad-text` fills sit on inline `<em>`s inside display
headlines, so they fragment — one box per line the copy wraps to — and a CSS
gradient's ramp is exactly as long as the box it paints. With any horizontal
component each line therefore gets its own ramp length, and **neither
`box-decoration-break` value survives that**: under `slice` the ramp is painted
once across the unfragmented box and cut up, so each line shows only its share
(`/contact`'s "what comes next" breaks after "what", which took the first 30%,
still ≈`#E8293E`, while "comes next" took the rest down to `#A80E1E` — one
bright line stacked on one dark one); under `clone` each line gets the whole
ramp but over its own width, so on `/expertise` at 1440px "people," (280px) ran
it over 286px while "processes & performance" (958px) ran it over 873px —
**3× the rate**. "people," fell from `#E3273B` to `#AD1021` inside one
word, then "processes" directly beneath it snapped back to `#E6283D`.

Vertical removes the variable: the ramp length is the inline box height, which
is identical for every fragment of a given headline at every viewport. All 8
accents across the five routes were measured at 320 / 375 / 768 / 1440px —
including the 3-line `/expertise` wrap at 320px and the 2-line `/contact` wrap
— and every fragment of a headline now paints the same ramp with no variation
along the line (at 1440px both `/expertise` lines run `#E7283D` → `#A90F1F`
over 87px). It is also the one axis that renders identically under **both**
`box-decoration-break` values, so nothing depends on that property being
supported; `clone` stays only to keep a future padded or bordered accent
consistent, and keeps the `-webkit-` prefix (Safari, and Chrome before 130).
`--grad` stays diagonal at `135deg` — it fills buttons and cards, which never
fragment. Do not reintroduce a horizontal component to `--grad-text`.

**Layout** — 1280px max content width with `clamp(20px, 4vw, 44px)` side
padding; **fixed 68px header**; the desktop nav takes over at **920px** (below
that, the burger opens the full-screen `MobileMenu`); hash scrolling leaves
`HEADER_OFFSET = 90px`.

**Buttons** are the global primitives in `src/styles/dulcey.css` — `.btn` (999px
pill), `.btn--primary` (`--grad` fill, lifts 3px on hover), `.btn--outline`
(1.5px ink border, inverts on hover). Shared display classes live there too:
`.eyebrow`, `.serif`, `.grad-text`, `.display`, `.lede`, `.section-head`,
`.body-lg`, `.body-md`, `.link-more`, `.rule`, `.glow`.

## Animations

Every public section animates through the **GSAP + ScrollTrigger** foundation in
`src/animations/` — this is the mandatory pattern. Import from the barrel:
`import { useReveal } from '../../../animations'`.

`gsapSetup.js` registers `ScrollTrigger` + `useGSAP` once (SSR-safe) and exports
`EASE` (`power3.out`), `EASE_IN_OUT` (`power3.inOut`), `DURATION`, `START`,
`REVEAL_START`, the mockup-parity presets (`REVEAL_PRESET`, `STAGGER_PRESET`,
`parallaxPreset(amt)`), `scheduleRefresh()` (coalesces every
`ScrollTrigger.refresh()` in a frame into one, with a `setTimeout` fallback for
background tabs), and `prefersReducedMotion()`.

Mockup-exact parameters — these numbers come from `mockup/scripts.js` and must
not drift:

| Hook               | Mockup attribute        | Motion                                           | Duration / ease     | ScrollTrigger start         |
| ------------------ | ----------------------- | ------------------------------------------------ | ------------------- | --------------------------- |
| `useReveal`        | `data-reveal`           | `y 32 → 0`, opacity `0 → 1`                      | 0.9s `power3.out`   | `top 88%`, once             |
| `useStaggerReveal` | `data-stagger`          | children `y 26 → 0`, stagger `0.09`              | 0.8s `power3.out`   | `top 86%`, once             |
| `useLineReveal`    | `data-line`             | `scaleX 0 → 1` from the left edge                | 1.1s `power3.inOut` | `top 92%`, once             |
| `useParallax`      | `data-parallax="<amt>"` | `yPercent +amt/2 → −amt/2`                       | scrub `0.4`         | `top bottom` → `bottom top` |
| `useHeroIntro`     | `data-hero`             | children `y 36 → 0`, stagger `0.12`, delay `0.1` | 1s `power3.out`     | none — fires on mount       |

Each hook returns a `ref` to attach to its target, guards `window`, calls
`scheduleRefresh()` so lazy-mounted routes measure correctly, and **no-ops to
the final state instantly** under `prefers-reduced-motion`. The hooks' own
defaults (`useReveal` `y: 40` / `top 80%`, `useStaggerReveal` `stagger: 0.08`,
`useParallax` `amount: 8`) are fallbacks — sections spread the presets above.

Framer Motion is **not** a dependency; modal and menu mechanics are CSS
transitions.

## SEO

The system is **dual-layer** and generated from the data layer — never
hard-code a business fact in a schema:

- **Static layer** — `public/index.html` carries the meta tags, Open Graph /
  Twitter cards, and five JSON-LD blocks (`schema-organization`,
  `schema-website`, `schema-webpage`, `schema-breadcrumb`, `schema-services`).
  This is the fallback for crawlers and social scrapers that don't run JS.
- **Runtime layer** — `SEOHead` (`src/components/common/SEO/SEOHead.jsx`)
  resolves the route to a `seoConfig.pages` entry, rewrites title /
  description / keywords / canonical / robots / OG / Twitter, and re-injects
  the JSON-LD **by the same element ids** (replacing the static blocks, never
  duplicating them). `/admin*` and the 404 are `noindex` and have every public
  schema stripped.

`src/config/seo.js` derives from `siteConfig.js` (facts), `expertiseData.js`
(the `knowsAbout` list and the `ItemList` of `Service`, each deep-linked to
`/expertise#eNN`), `industriesData.js` (keywords), and `navigation.js`
(breadcrumb names).

**Rule: no schema without a visible counterpart.** `FAQPage` and
`LocalBusiness` are deliberately **not** emitted — the site has no visible FAQ,
and there is no public postal address, so claiming either would violate Google's
structured-data guidelines. Do not add them, and do not invent an address, geo
coordinates, opening hours, or ratings to qualify.

`public/sitemap.xml` lists exactly the five indexable routes; `robots.txt`
disallows `/admin`. Favicons / PWA icons / the OG image are generated from the
logo by `npm run generate:icons` and `npm run generate:og`. Full guide and the
post-launch checklist: `SEO_GUIDE.md`.

## Customization Guide

1. **Copy** — structured content lives in `src/data/`; page-specific prose is
   inline in the section components under `src/pages/<Page>/sections/`.
2. **Branding** — the header, mobile menu, footer, and admin topbar read the
   logo from `src/data/siteConfig.js`. The `public/index.html` splash logo and
   the two `scripts/generate-*.js` URLs are set separately.
3. **Contact facts** — `src/data/siteConfig.js` only (plus the static blocks in
   `public/index.html`).
4. **Design tokens** — `src/styles/variables.css` + `src/theme/muiTheme.js`
   (keep the palette alias keys — `palette.orange` / `accent` / `navy` are used
   via `sx`).
5. **SEO** — edit the data layer, then `src/config/seo.js`, then mirror into
   `public/index.html`; update `public/sitemap.xml`.
6. **Admin credentials / API key** — `.env` (rebuild required), paired with the
   server key per **Lead Storage & Sync**.

Step-by-step recipes: `CUSTOMIZATION_GUIDE.md`.

## Documentation

- `README.md` — Overview, quick start, routes, env reference
- `CUSTOMIZATION_GUIDE.md` — Maintenance recipes
- `SEO_GUIDE.md` — SEO architecture + post-launch checklist
- `CHANGELOG.md` — Release history (`[2.0.0]` = the Dulcey rebuild)
- `prompts/README.md` — The rebuild prompt series and its conventions
- `/admin/guideline` — The operator-facing guides (Lead Storage · SEO Setup ·
  Deployment · For Developers), including the deployment runbook

## DO NOT MODIFY

These contracts keep the enquiry form and the admin panel in sync across
devices. Change them only with a deliberate, coordinated update on both the
client and the PHP endpoint.

- **`public/api/leads.php` request/response contract and its auth model** — the
  action API (`create` / `list` / `update` / `delete` / `health`), its JSON
  response shapes, the admin-key gate (`REACT_APP_LEADS_ADMIN_KEY` ↔
  `ADMIN_API_KEY`) with its resolution order and header + query/body transports,
  `Cache-Control: no-store`, the append-only merge for `notes`/`activity`, and
  the `lead_id` + mobile dedupe.
- **The admin sync pattern** — server-hydrated in-memory cache, 15 s poll, and
  BroadcastChannel `lp_leads_channel` for same-browser tabs. **Never introduce a
  localStorage copy of lead data.**
- **Lead record field keys** — the admin panel and CSV export bind to these
  exact keys; change labels/options, never the keys:
  `lead_id`, `name`, `mobile`, `email`, `organization`, `service_interest`,
  `state`, `message`, `source`, `status`, `submitted_at`, `updated_at`,
  `notes[]`, `activity[]` (plus `page_url`, `user_agent`, `utm_*`).
  `organization` was **added** by the rebuild; `state` is retired but reserved —
  neither may be renamed or repurposed.
- **Lead status `value` keys** — `new`, `contacted`, `consultation_booked`,
  `procedure_scheduled`, `completed`, `not_interested`. Labels and colors are
  display-only.
- **`/mockup` and `/prompts`** — the design contract and the historical plan.
  Read them; never edit them. Cleanup greps must exclude both.
- **The `logoIcon` Cloudinary public_id** `Dulecy-Logo-Icon_hylrpw.png` — a
  live delivery path that predates the "Dulcey" spelling. See **Business
  Facts**; never fold it into a brand find-and-replace.
- **The admin username** `dulecyadmin` (`.env`, `.env.example`, and the
  `adminAuth.js` fallback) — deliberately left on the old spelling so the
  rebrand does not invalidate operator logins. Rotate it on purpose, not as a
  side effect.
