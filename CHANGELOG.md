# Changelog

All notable changes to the **Nilachal Infracon Private Limited** website. This
project was rebuilt through the prompt series in `prompts/`; the entries below
accumulate per prompt under the 1.0.0 release.

Historical note: sections 01–13 describe removing the previous site's identity
and tracking. They intentionally name what was removed and are kept verbatim as
the rebuild record.

## [1.0.0] — 2026-07-26 — Nilachal Infracon rebuild

### 01 — Project reset & new identity

**Changed**
- Reset the project identity to Nilachal Infracon Private Limited across
  `package.json` (name, version, description, keywords), `README.md`,
  `CHANGELOG.md`, and `CLAUDE.md`.
- Rewrote `CLAUDE.md` for the new site: minimal one-page business website,
  server-side lead store, admin Dashboard + Lead Management. Added a business
  facts block and a focused "DO NOT MODIFY" list (leads API contract, admin sync
  pattern, lead record field keys).
- Updated `.env` / `.env.example` identity, contact, and admin-credential values;
  added a header note that `.env` is committed and all secrets must be rotated
  during the rebuild.
- Replaced the development console banner in `src/index.js` and refreshed the
  hard-coded admin fallback credentials in `src/admin/utils/adminAuth.js`.

**Removed**
- Deleted the `resources/` directory (scanned brochures from the previous build).
- Pruned environment variables that no code reads (build metadata, unused feature
  flags, social/map/CDN placeholders, dead API-endpoint and location vars).

### 02 — Remove ads / analytics / conversion tracking

**Removed**
- Deleted all ad/analytics tracking modules and their consumers: Google Tag
  Manager, Google Ads, Meta Pixel, Meta Conversions API, Google Consent Mode,
  enhanced conversions, event dedup, the GCLID manager, the `EngagementTracker`
  component, the `useGTMTracking` hook, and the admin Google Ads CSV export.
- Deleted the server-side tracking endpoints `public/api/meta-capi.php` and
  `public/api/google-offline-conversions.php`, and the Meta CAPI constants from
  `public/api/config.example.php` (kept `ADMIN_API_KEY`).
- Removed the admin "Record Conversion" feature (Meta CAPI + Google Ads offline
  conversions) from Lead Detail, along with the four ad/tracking setup guides
  (Google Ads, Meta Ads, GTM Setup, Conversion Tracking) and `GTM_GUIDE.md`. The
  status dropdown (including the "completed" state) and the funnel stat tiles
  remain as the business workflow.
- Removed `gclid` capture end-to-end (public form payload and admin CSV export)
  and dropped all tracking env vars from `.env` / `.env.example` and the docs.
- Removed the hard-coded GTM container from `public/index.html` (head snippet and
  `<noscript>` iframe) and the GTM/Meta Pixel/Google Ads disclosures from the
  Footer and enquiry-form privacy copy.

**Kept**
- The entire SEO system (`SEOHead`, `src/config/seo.js`, `src/utils/seo.js`,
  JSON-LD in `index.html`), UTM capture, the `source` field, and the admin CSV
  UTM columns — these are generic link attribution, not ad-platform tracking.

### 03 — Design system & GSAP animation foundation

**Added**
- Installed the Nilachal brand tokens in `src/styles/variables.css` and
  `src/theme/muiTheme.js`: steel navy (`#16324F` / `#0F2438` / `#274B6E`),
  Nilachal green (`#1E7B45` / `#176437`, tint `#E8F5EE`), ink `#101C29`, slate
  `#4A5A6A`, subtle bg `#F5F7FA`, border `#E5EAF0`, plus a soft elevation token
  `0 8px 30px rgba(16,28,41,.06)`. Kept every existing variable/palette **name**
  (including legacy `--accent-gold*` → navy and `--accent-orange*`/`--accent-amber*`
  → green aliases) so `.module.css` references stay valid.
- Added the GSAP + ScrollTrigger animation foundation in `src/animations/`
  (`gsapSetup.js`, `useReveal`, `useStaggerReveal`, `useCountUp`, `useParallax`,
  barrel `index.js`) — SSR-safe hooks that refresh ScrollTrigger for lazy sections
  and no-op to the final state under `prefers-reduced-motion`. Installed `gsap`
  and `@gsap/react`.
- Documented the Brand Color System and Animations patterns in `CLAUDE.md`.

**Changed**
- Set typography to **Inter everywhere** (headings included; heading weights
  600–700, `letter-spacing: -0.02em` on h1–h3) and removed Poppins from the MUI
  theme, `public/index.html`, `src/index.js`, and `src/styles/global.css` font
  URLs/preloads.
- Reworked the `index.html` splash loader for Nilachal: white logo on a navy
  (`#0F2438`) background, progress bar gradient navy→green, tagline
  "Building Tomorrow, Together." Updated `theme-color` / `msapplication-TileColor`
  / mask-icon and `manifest.json` `theme_color` to `#16324F`, and the noscript
  fallback colors.
- Swept every hardcoded CIT hex (`#0C2D48`, `#081F33`, `#1A5276`, `#D82618`,
  `#E0301E`, `#B71F12`) and their `rgba()` equivalents out of `src/` and `public/`,
  plus `global.css`/`App.css` fallbacks, `swalHelper.js`/`Modal.jsx` confirm
  colors, and the `ThemeContext` meta theme-color — replaced with navy/green
  tokens. Admin `--admin-*` tokens moved off the retired CIT hexes onto navy/green
  (+ semantic amber/red); full admin restyle is deferred to prompt 13.
- Wired `useReveal` into `AboutSection` as a proof-of-life smoke test (GSAP now
  drives its scroll reveal; Framer Motion retained only for the image hover).

### 04 — Content & data layer

**Added**
- Added `src/data/siteConfig.js` as the single source of business truth
  (legal/brand names, tagline, CIN, phone/WhatsApp, email, address, site URL,
  logos, maps query, social) plus derived helpers `telHref`, `waHref`,
  `mailHref`, and `fullAddress`.
- Added content data files: `productsData.js` (10 North East Buildmart
  categories with `mdi:*` icons + blurbs), `brandsData.js` (12 partner brands
  → `/images/brands/<slug>.png`, with text-wordmark fallback), `aboutData.js`
  (welcome copy + Mission/Vision/Values/Commitment pillars), and `faqData.js`
  (7 FAQs feeding both the FAQ section and FAQPage schema).
- Created `public/images/brands/` with a `README.md` listing the expected logo
  filenames and recommended format (transparent PNG, ~360×140).

**Changed**
- Rewrote `servicesData.js` from the 7 B.E. courses to the 5 Nilachal services
  (Residential, Commercial, Institutional, Renovation & Maintenance, Project
  Management); kept the object shape, renaming `duration` → `scope` and marking
  only Residential as "Most Popular". Updated `generateServiceSchema` to read
  `scope` (with a `duration` fallback).
- Rewrote `statsData.js` to 5 Nilachal metrics (10+ years, 5000+ products,
  5000+ customers, 7+ states, 100% quality) — each `stat` still starts with a
  number for the counter parser.
- Rewrote `featuresData.js` as a flat 5-point "why choose us" array
  (`{id, icon, title, description}`), with a temporary `featuresCategories`
  export mirroring the old 3-tab shape so `FeaturesSection` still builds
  (marked `// TODO remove in prompt 09`); repointed its import to the mirror.
- Rewrote `locationData.js` to the Nagaon office, deriving contact/address from
  `siteConfig`; removed `warehouses`, the CIT map image, `nearbyAreas`, and
  `audienceNote`. Guarded the now-removed map image in `LocationSection`.

**Removed**
- Deleted `src/data/serviceDetailsData.js` (verified dead — no imports).

### 05 — Header, footer & mobile navigation

**Changed**
- Rebuilt the **Header** for Nilachal: color/white logo swap from `siteConfig`
  (white over the hero, color once scrolled), the six one-pager anchors
  (About / Products / Services / Brands / Why Us / Contact), a quiet phone text
  link and a green **"Request a Quote"** CTA (`openLeadDrawer('request-quote')`).
  Restyled the transparent→solid-white scroll state with a subtle border + blur
  using design tokens, and replaced the Framer-Motion entrance with a subtle
  GSAP fade-down (logo + nav, once, reduced-motion aware). Removed the CIT
  accreditation strip. Scroll-spy and the 80px offset logic are unchanged.
- Rebuilt the **Footer** as a clean four-column layout on `--color-primary-dark`:
  white logo + legal name + tagline + one-line about + "North East Buildmart — A
  Brand of Nilachal Infracon Pvt. Ltd."; Quick Links (six anchors); Contact
  (full address, `tel:`, `mailto:`, WhatsApp chip); and Registered Office + CIN.
  Bottom bar shows the 2026 copyright, the Privacy Policy link, and the
  "Developed by Assam Digital" credit. Rewrote the privacy-policy modal for
  Nilachal (name/phone/email/enquiry details, used only to respond, stored on
  the site's own server, never sold, no ad-platform tracking, removal by email);
  the modal mechanics are unchanged.
- Rebuilt the **MobileDrawer** (bottom sheet) with the Nilachal logo, Home + the
  six anchors, Call / WhatsApp contact actions, and a "Request a Quote" CTA.
  SwipeableDrawer mechanics, scroll-lock, Escape handling and the 80px offset are
  unchanged.
- Rebuilt the **MobileNavigation** bottom bar actions — Call, WhatsApp,
  **Enquire** (primary green, opens the `request-quote` drawer,
  `mdi:file-document-edit-outline`), Menu. Show/hide-on-scroll mechanics are
  unchanged.
- Rewrote `ModalContext` `DRAWER_TITLES` with Nilachal copy (`request-quote`,
  `product-enquiry`, `service-enquiry`, `callback`, `default`); kept the legacy
  CIT keys as aliases pointing at the new copy so not-yet-rebuilt sections keep
  compiling (pruned in prompt 11). Drawer open/close/scroll-lock mechanics are
  unchanged.
- Updated `LeadFormDrawer` defaults: header icon `mdi:office-building-outline`
  and the `request-quote` title/subtitle; neutralised the leftover submit label
  to "Send Enquiry" (the rest of the form is prompt 10). Pointed
  `App.jsx`'s enquiry handler at the `request-quote` drawer.
- All contact facts in these components now come from `src/data/siteConfig.js`
  (no hardcoded phones/emails/addresses). Swept the remaining CIT branding,
  phone (`+91 8069645014`), logo and "Assam Digital campaign" comments out of the
  four components. Updated the `CLAUDE.md` branding pointer to note logos come
  from `siteConfig`.

**Note**
- `#products`, `#brands` and `#why-us` do not exist in the DOM until prompts
  08–09, so those nav items temporarily dead-end; the existing hash-scroll retry
  logic tolerates the missing targets.

### 06 — Hero section (Apple-style, GSAP)

**Changed**
- Rebuilt the **HeroSection** as a cinematic, minimal full-viewport hero
  (`min-height: 100svh`, `id="home"`): a single `<h1>` "Building the Future of
  Northeast India", the "Nilachal Infracon Private Limited" eyebrow, the
  "Building Tomorrow, Together." tagline, a supporting paragraph, and two CTAs —
  primary green **"Explore Our Products"** (smooth-scrolls to `#products`,
  tolerates the still-missing target) and a ghost/white **"Request a Quote"**
  (opens the `request-quote` drawer). A quiet trust strip
  (`10+ Years · 5000+ Customers · 7+ NE States · 100% Genuine Products`) runs
  along the bottom, separated by hairlines and wrapping to a 2×2 grid on mobile.
- Replaced the CIT campus image with cinematic construction imagery from Unsplash
  (dusk tower-crane cluster, with a verified building-under-construction
  fallback), served at `w=2400` on desktop and `w=1200` on mobile. Kept the JS
  image-preload fallback chain (5s timeout → gradient fallback).
- Reworked the background stack to gradient → image → navy scrim → content:
  a `rgba(15,36,56,.85) → .45` navy scrim (plus a left assist for the bottom-left
  copy and a short top assist so the transparent header stays legible). Dropped
  the busy dot-pattern layer and deleted the unused hero-video CSS layers.
- Added a **GSAP intro timeline** on mount (≤1.6s, `power3.out`): scrim settles →
  eyebrow fades in → `<h1>` reveals with a hand-rolled masked split-line slide-up
  (overflow-hidden line wrappers, no paid SplitText) → paragraph + CTAs fade up
  staggered → trust strip fades in. Added a minimal "Scroll" chevron affordance
  that fades out on first scroll (ScrollTrigger), and a subtle background image
  parallax (`useParallax`, desktop only). Everything appears instantly under
  `prefers-reduced-motion`.

**Removed**
- Removed the embedded desktop lead form from the hero (one of the three
  `UnifiedLeadForm` instances — noted for prompt 10); conversion now happens via
  the CTA → quote drawer and the Contact section. Dropped the Framer-Motion
  variants, MUI `Grid`/`Chip`/`Button` scaffolding and the CIT badge/copy from
  the hero, and cleaned the stylesheet of the dead form/video/pattern styles.

### 07 — Page recomposition & About section

**Removed**
- Deleted the five leftover CIT sections that have no successor in the Nilachal
  one-pager, folders and all `App.jsx` references (lazy import, `useIdlePreload`
  entry, and JSX/ErrorBoundary/Suspense block): `WhyChooseCIT` (role covered by
  Why-Us in prompt 09), `HighlightsSection` (campus labs grid), `LocationSection`
  (its content folds into Contact in prompt 11), and the two urgency bands
  `CTASection` / `SecondaryCTASection` (off-brand for the minimal design; the page
  keeps a single mid-page CTA moment, added with Brands in prompt 09).

**Changed**
- Rebuilt **AboutSection** (`id="about"`) as the "Welcome to Nilachal Infracon"
  moment on a white background. **Part A** is an intro split: an eyebrow
  (`WELCOME TO NILACHAL INFRACON`, mirroring the Hero eyebrow's bar + tracked
  uppercase), the headline "One of Northeast India's emerging infrastructure &
  building materials companies", the `aboutData.welcome` paragraph (flagship brand
  **North East Buildmart** emphasised inline, split on `siteConfig.flagshipBrand`),
  a quiet "Explore our services →" text link to `#services`, and one Unsplash
  architectural image (verified 200, `w=1200`, rounded 20px) with a subtle
  `useParallax` drift over an overscanned frame. **Part B** renders the four
  `aboutData.pillars` (Mission / Vision / Values / Commitment) as borderless cards
  — thin top hairline, green Iconify icon, title, text — 4-up on desktop, 2×2 on
  tablet, stacked (hairline-divided) on mobile. `useReveal` fades Part A up;
  `useStaggerReveal` staggers the pillar row; both respect `prefers-reduced-motion`.
- Recomposed `App.jsx`'s `HomePageContent` to the slimmer set — Hero → About →
  Services → Stats → Features → Contact — with the hash-scroll retry logic
  untouched. `ServicesSection`, `StatsSection`, `FeaturesSection` and
  `ContactSection` stay mounted (rebuilt in prompts 08–11).
- Updated the `CLAUDE.md` project-structure section list to the currently mounted
  sections.

### 08 — Products & construction-services sections

**Added**
- Added **ProductsSection** (`id="products"`) — the North East Buildmart flagship
  moment on white: a centered eyebrow (`OUR FLAGSHIP BRAND`), the headline
  "North East Buildmart", the "A brand of Nilachal Infracon Pvt. Ltd. — premium
  building materials under one roof." subtext, one wide Unsplash feature-image
  strip (verified 200, `w=2000`, rounded 20px), and the 10 `productsData`
  categories as minimal tiles (green Iconify icon on a `--color-accent-tint`
  circle, name, two-line-clamped blurb) laid out 5×2 on desktop, 3-col on tablet,
  2-col on mobile. Each tile is a button that opens the `product-enquiry` drawer
  pre-filled (`subtitle` + `service_interest` = category name; prompt 10 wires the
  prefill into the form), with a green "Request Product Pricing" CTA opening the
  same drawer. `useReveal` fades the header up; `useStaggerReveal` staggers the
  grid; the icon micro-scales on hover — all reduced-motion aware.
- Wired `ProductsSection` into `App.jsx` between About and Services (lazy import
  + `ErrorBoundary`/`Suspense` wrapper + `useIdlePreload` entry), so the header
  "Products" anchor (`#products`) now resolves.

**Changed**
- Rebuilt **ServicesSection** (`id="services"`) on `--color-bg-subtle` to
  alternate with the white Products section: a left-aligned eyebrow (`WHAT WE DO`)
  and the headline "Construction & Infrastructure Services", then the 5
  `servicesData` services as a minimal, Apple-style vertical list — large index
  numeral, service name, description, up to three feature tags, and a
  hover-revealed arrow — divided by thin hairlines (no cards). Each row is a
  button that opens the `service-enquiry` drawer pre-filled (`subtitle` +
  `service_interest` = service name). Kept the Service JSON-LD injection
  (`injectSchema('schema-services', generateServiceSchema(servicesData))`).
  `useReveal` fades the header up; `useStaggerReveal` staggers the rows; both
  respect `prefers-reduced-motion`.

**Removed**
- Removed **Swiper** from `ServicesSection` (imports + `swiper/css` +
  `swiper/css/pagination` + the mobile carousel and its pagination styles); the
  five rows now stack naturally on mobile. `swiper` becomes an unused dependency,
  pruned in prompt 14. Dropped the Framer-Motion card variants and the leftover
  course-flavored markup/CSS class names (`.courseCard` → service-row naming).

### 09 — Stats band, Brands strip, Why-Choose-Us & FAQ

**Added**
- Added **BrandsSection** (`id="brands"`) — a calm partner-brands strip on white:
  a centered eyebrow (`TRUSTED BRANDS WE DEAL IN`) + one quiet subtitle, then the
  12 `brandsData` brands as a 6×2 grid (4×3 tablet, 2-col mobile) of hairline
  cells. Each cell tries the brand logo from `/images/brands/<slug>.png` and, until
  that file loads (via `onLoad`/`onError`), shows a styled text wordmark instead —
  so no broken images or placeholders appear while the logo files are still being
  collected; real logos are grayscale and colour on hover. Below the grid sits the
  page's single mid-page CTA moment — "Looking for a specific brand or product?" +
  a green **"Request a Quote"** button (`request-quote` drawer). `useReveal` fades
  the header up; `useStaggerReveal` staggers the cells.
- Added **WhyUsSection** (`id="why-us"`) — replacing the tabbed `FeaturesSection`:
  a centered eyebrow (`WHY CHOOSE US`) + headline, then the 5 `featuresData` value
  props as a single clean row (green Iconify icon on a `--color-accent-tint`
  circle, title, short description) on white with generous padding. Tablet wraps to
  3 + 2, mobile to a 2-col grid with the fifth prop full-width. `useReveal` +
  `useStaggerReveal`, reduced-motion aware.
- Added **FAQSection** (`id="faq"`) — a minimal accordion on `--color-bg-subtle`,
  ~800px centered: eyebrow (`FREQUENTLY ASKED QUESTIONS`) + headline, then the 7
  `faqData` entries as hairline-separated rows. Each question is a full-width
  `button` with `aria-expanded` + `aria-controls`; a plus icon rotates 45° (GSAP)
  and the answer panel tweens its height to/from `auto` with GSAP. One row is open
  at a time; fully keyboard-accessible. The same `faqData` will feed the FAQPage
  JSON-LD in prompt 12.
- Wired `BrandsSection`, `WhyUsSection`, and `FAQSection` into `App.jsx` in order
  after Services (Stats → Brands → Why-Us → FAQ → Contact) with lazy imports +
  `ErrorBoundary`/`Suspense` wrappers + `useIdlePreload` entries, so the header
  `#brands`, `#why-us`, and `#faq` anchors now resolve.

**Changed**
- Rebuilt **StatsSection** as a minimal, full-width deep-navy metrics band (no
  section id — it is not a nav target): all 5 `statsData` metrics in one row with a
  big white number (Inter 700, 56–72px) driven by **GSAP `useCountUp`** (honouring
  the `10+` / `5000+` / `100%` prefix/suffix format, firing once on scroll into
  view), a slate-on-dark label below, and thin vertical hairlines between items.
  Wraps to a centered 2×2 + 1 grid on mobile. `useStaggerReveal` fades the items
  up; counters render their final value instantly under `prefers-reduced-motion`.

**Removed**
- Deleted the tabbed **FeaturesSection** (folder + `App.jsx` lazy import,
  `useIdlePreload` entry, and JSX/ErrorBoundary/Suspense block) — the category-tab
  UI, awards timeline, and 3-category data model are all gone, replaced by
  `WhyUsSection`.
- Removed the recruiter logo wall (`placehold.co` URLs), the Apply CTA, the
  `HEADLINE_STAT_IDS` filtering, and the CIT copy from `StatsSection`; it now uses
  GSAP `useCountUp` instead of `AnimatedCounter` (the `AnimatedCounter` component
  itself stays for now — prompt 14 deletes it if it is left unused).
- Removed the temporary `featuresCategories` compatibility export from
  `featuresData.js` (the 3-tab mirror added in prompt 04).

### 10 — Enquiry form, lead pipeline & thank-you page

**Changed**
- Re-contented **`UnifiedLeadForm`** for Nilachal without touching the submit
  pipeline. Replaced the B.E.-course list with a grouped **"Interested In"**
  `Select` (MUI `ListSubheader` groups) sourced from the data layer —
  **Products** (`productsData`), **Services** (`servicesData`) and a
  "General Enquiry" option; the **State** select now lists
  `locationData.servingStates` + "Other". Added **prefill** support: the drawer
  tiles/rows pass `service_interest` through to the form, which preselects the
  matching option. Rewrote every user-facing string — placeholders/help text,
  the consent line ("I agree to be contacted by Nilachal Infracon regarding my
  enquiry."), the privacy-policy modal (aligned with the Footer's policy), and
  the success / duplicate / error SweetAlert copy.
- Restyled the form minimal: 12px-radius outlined fields with a **green focus
  ring**, a solid Nilachal-green **"Send Enquiry"** button (was a teal
  gradient), and green links. Removed the CIT trust-badge row, replacing it with
  one quiet reassurance line — "We respond within 24 hours. Your details stay
  private." Renamed the internal `showCourseFields` prop to `showInterestFields`.
- Wired the drawer prefill end-to-end: `ModalContext.openLeadDrawer` →
  `drawerConfig.service_interest` → `App` `LeadFormDrawerWrapper`
  (`serviceInterest`) → `LeadFormDrawer` (`prefill`) → `UnifiedLeadForm`.
- `webhookSubmit.js`: swapped the old CIT phone in the three user-facing error
  messages for `siteConfig.phoneDisplay`, and refreshed the `service_interest`
  JSDoc (product/service label, not a B.E. course). No logic change.
- **Rebuilt the `/thank-you` page** as a minimal navy-on-white confirmation
  (was a dark CIT treatment). A **GSAP** checkmark-draw with a soft green burst
  replaces `canvas-confetti`; the sessionStorage access gate, greeting-by-name,
  and 5-minute flag expiry are unchanged. New Nilachal next-steps ("Our team
  reviews your enquiry" → "We call or WhatsApp you within 24 hours" → "You get a
  quotation / consultation") and Call / WhatsApp / Back-to-Home CTAs from
  `siteConfig`. Reduced-motion no-ops to the final state.

**Security**
- **Rotated the lead-store admin key** off the old committed default. Set a new
  48-character key in `.env` (`REACT_APP_LEADS_ADMIN_KEY`) and updated the
  committed fallback constant in both `public/api/leads.php` and
  `public/api/telecalls.php`, plus the guidance in `config.example.php`. Any
  live `public/api/config.php` must set the same `ADMIN_API_KEY` on deploy.

### 11 — Contact section, map & final page assembly

**Changed**
- **Rebuilt `ContactSection`** (`#contact`) as an Apple-minimal two-column
  "Get in Touch": left = eyebrow + headline, quiet hairline-separated contact
  rows (Registered Office / Phone `tel:` / Email `mailto:` / a WhatsApp chip),
  a **lazy Google-Maps embed** (`output=embed`, no API key,
  `title="Nilachal Infracon location"`, 20px radius, ~300px tall) and the eight
  Northeast serving states as quiet pills; right = the shared `UnifiedLeadForm`
  (`variant='default'`, `formId='contact-form'`) under a "Send us an Enquiry"
  heading in a white 1px-bordered soft-shadow card. Both columns reveal once via
  GSAP `useReveal`. Every fact comes from `siteConfig` / `locationData`.
- Finalized the one-pager assembly in `App.jsx` (order Hero → About → Products →
  Services → Stats → Brands → WhyUs → FAQ → Contact; `useIdlePreload` list
  matches). **Restyled the back-to-top button to design tokens** and added a
  **desktop-only floating WhatsApp FAB** (green, bottom-right, `wa.me` from
  `siteConfig`, GSAP fade-in past the hero, `aria-label`; mobile keeps WhatsApp
  in the bottom nav).
- Polish pass: added `text-wrap: balance` to the section headlines to avoid
  orphan widows, keeping the shared eyebrow / headline / 6–7rem (desktop) /
  4rem (mobile) padding rhythm and the white / `--color-bg-subtle` alternation
  with Stats as the intentional dark break.

**Removed**
- **Pruned the legacy CIT drawer-key aliases** (`apply-now`, `get-details`,
  `request-callback`, `book-meeting`, `download-brochure`, `fees-scholarship`)
  from `DRAWER_TITLES`; no callers remained.
- Removed the dormant real-estate **modal system** — `MODAL_TYPES`, `openModal`
  and its shorthand openers, and the modal state — from `ModalContext.jsx`
  (nothing used `openModal`), and deleted the now-orphaned
  `components/common/Modal/` and the legacy `components/common/LeadForm/`
  wrapper. `ModalContext` now drives only the enquiry drawer.

### 12 — SEO overhaul (index.html, schemas, sitemap, favicons, OG)

**Changed**
- **Rewrote `src/config/seo.js`** for Nilachal Infracon, generated from the
  single sources of truth: `siteConfig.js` (name/contact/logo/site URL),
  `locationData.js` (`areaServed` = the 8 Northeast states), and `faqData.js`
  (so the FAQPage schema matches the visible FAQ exactly). New site
  name/URL/`en_IN` locale, trimmed title, ~155-char description mentioning North
  East Buildmart, `organization` (legalName, color logo, Nagaon address,
  `foundingDate 2026`, areaServed, empty `sameAs`), `localBusiness`
  (`["LocalBusiness","HomeAndConstructionBusiness"]` + building-material
  `additionalType`, `₹₹`, Nagaon geo, Mon–Sat 09:00–19:00 **TODO** hours,
  `hasMap`), and `pages` (home index,follow; thankYou/admin noindex).
- **De-CIT'd `src/utils/seo.js`** — removed the hard-coded `CollegeOrUniversity`
  types and the `B.E. Engineering Programs` / `Course` offer-catalog blocks.
  Organization/LocalBusiness `@type` and `areaServed` now come from config;
  `generateServiceSchema` emits an `ItemList` of `Service` (provider =
  organization, `areaServed` NE states, no bogus `₹0` offers). `updatePageSEO` /
  `injectSchema` / `removeSchema` mechanics untouched.
- **Rewrote the `public/index.html` head** (static fallback layer): new
  title/description/keywords/author, `robots index,follow`, Open Graph + Twitter
  cards (absolute `og:image` → `/og-image.png`, 1200×630 + alt), geo tags
  (`IN-AS`, Nagaon, `26.3489;92.6820`), and the five JSON-LD blocks rewritten
  with the same element ids (Organization, LocalBusiness/HomeAndConstruction,
  FAQPage with all 7 Q&As, single-crumb BreadcrumbList, WebPage/WebSite — no
  SearchAction). Removed the broken icon links (`apple-touch-icon-152/167/180`,
  `safari-pinned-tab.svg`); kept the Inter preloads, Iconify preconnect, inline
  critical CSS, and Nilachal splash loader.
- **`public/manifest.json`**: name "Nilachal Infracon" / short_name "Nilachal",
  new description, `theme_color #16324F`, `background_color #FFFFFF`, categories
  `["business","shopping"]`, icons `favicon.ico` + `logo192`/`logo512`
  (`any maskable`).
- **`public/robots.txt`**: allow all, disallow `/admin/` + `/thank-you`, correct
  `Sitemap:` URL, dropped the non-standard `Host:` line.
- **`public/sitemap.xml`**: single `https://www.nilachalinfracon.com/` URL,
  `lastmod 2026-07-26`, `changefreq monthly`, `priority 1.0`.

**Added**
- **Favicons + PWA icons** generated from the Nilachal color logo (cropped to
  the emblem for small-size legibility): `favicon.png` (32), `favicon.ico`
  (16/32/48), `apple-touch-icon.png` (180, padded on white), and maskable-safe
  `logo192.png` / `logo512.png` — replacing the old CIT shield files.
- **`public/og-image.png`** (1200×630, ~70 KB): navy `#0F2438`, white logo,
  green accent, headline "Building the Future of Northeast India", tagline +
  site URL.
- **`scripts/generate-icons.js`** and **`scripts/generate-og.js`** (committed,
  reproducible) with `npm run generate:icons` / `generate:og`; added `sharp` +
  `png-to-ico` dev deps.
- Rewrote **`SEO_GUIDE.md`** for Nilachal (purged the earlier Monjoven client)
  with a post-launch checklist (GSC verify + submit sitemap + request indexing,
  Bing Webmaster, Rich Results / schema validators). Added a **SEO** section to
  `CLAUDE.md`.

**Semantics**
- Verified on-page hierarchy: single `<h1>` (hero), `<h2>` per section, `<h3>`
  for card/pillar titles; all public images carry meaningful `alt`; anchor nav
  uses real `<a href="#…">`; `SEOHead` still noindexes `/thank-you` and
  `/admin*`. No violations found. (Admin panel still shows CIT logos/labels —
  that rebrand is prompt 13.)

### 13 — Admin panel rebuild (Dashboard + Lead Management)

**Fixed**
- **Conversion Rate is finally non-zero.** `getLeadStats` counted the
  non-existent status `'converted'`, so the dashboard rate was always 0%. It now
  counts `status === 'completed'` — the terminal status the convert flow actually
  sets (labelled "Converted").

**Changed**
- **Rebranded the admin shell to Nilachal.** `AdminLogin` (color logo, title
  "Nilachal Infracon", subtitle "Admin Panel"), `AdminTopbar` (Nilachal logo,
  nav = Dashboard · Leads · Guidelines, "Admin Panel" wordmark, no "Admissions"
  badge). Aligned the `--admin-*` tokens in `variables.css` with the Nilachal
  system (bg `#F5F7FA`, borders `#E5EAF0`, added the soft `--admin-shadow` token)
  and removed the obsolete comment.
- **Relabelled the lead status taxonomy for the construction funnel** (display
  labels/colors only — persisted keys unchanged): New · Contacted · Quote Sent ·
  Follow-Up · Converted · Not Interested.
- **Redesigned the Dashboard**: stat tiles (Total Enquiries · New Today · This
  Week · Conversion Rate), a hand-rolled 14-day SVG enquiry-trend sparkline
  (no chart library), a status-breakdown row, a recent-enquiries table with
  time-ago, and quick actions (View All Leads, Export CSV). Header reads
  "Nilachal Infracon — Lead Management". `getLeadStats` now also returns `trend`
  and `statusBreakdown`. 15s sync/BroadcastChannel mechanics untouched.
- **Vocabulary sweep** across the admin: "Admission Leads" → "Enquiry Leads",
  "Course Interested" → "Interested In" (table column + CSV header),
  "Applicant Details" → "Contact Details", "Admission Interest" → "Enquiry"
  (now also shows the Message field); LeadDetail Source card gained Page URL.
- **Rebranded the Guideline hub** (Lead Storage · SEO Setup · Deployment · For
  Developers) to Nilachal — purged `cittumkur.org`/CIT/Tumakuru examples and the
  "Assam Digital" admin-color claims, switched the Developer palette table to
  `#16324F`/`#1E7B45`, replaced printed default credentials with "set in `.env`",
  and dropped the stale Google-Sheets/email post-deploy checklist rows. Changed
  the hardcoded guideline password to a new value (shared with the owner in the PR).

**Removed**
- **Deleted the Tele-Calling module entirely** (a legacy feature with a
  hardcoded roster of real staff names): `TeleCalling.jsx`, `TeleCallDetail.jsx`,
  `TelecallFormDialog.jsx`, `telecallService.js`, `telecallStatus.js`, and
  `public/api/telecalls.php`. Removed its routes and warm-up sync from
  `AdminLayout`, its topbar nav item, `REACT_APP_TELECALLS_API_URL` from
  `.env`/`.env.example`, `TELECALLS_API_URL` from `getConfig()` in
  `webhookSubmit.js`, and its documentation from `CLAUDE.md`/`README.md`. Any
  deployed `api/data/telecalls.json` can be archived/deleted server-side.

### 14 — Final cleanup, zero-trace audit & QA

**Removed**
- Dead files left over from the migration (all grep-verified unimported before
  deletion): the empty `src/hooks/useLocalStorage.js` and `src/utils/helpers.js`,
  the superseded `src/hooks/useInView.js` and `src/hooks/useScrollPosition.js`,
  `src/utils/formatters.js`, and the unused components
  `src/components/common/AnimatedCounter/`, `Card/`, and `SectionTitle/`
  (GSAP hooks and section-local markup replaced them all). `Button/` stays —
  `UnifiedLeadForm` renders it.
- Six unused dependencies: `swiper`, `canvas-confetti`,
  `react-intersection-observer`, `sweetalert2-react-content`, `@mui/lab`, and
  `@mui/icons-material` (icons are Iconify `mdi:*`; alerts use plain
  `sweetalert2`). `framer-motion` and `web-vitals` stay — both are still used.
- Dead env plumbing: `REACT_APP_NAME`, `REACT_APP_SALES_PHONE`,
  `REACT_APP_WHATSAPP_NUMBER`, `REACT_APP_SALES_EMAIL`, and
  `REACT_APP_HERO_VIDEO_URL` from `.env`/`.env.example` and the docs — no code
  reads them (business facts live in `src/data/siteConfig.js`). The app reads
  exactly four env vars: admin username/password + leads API URL/key.

**Changed**
- Zero-trace pass: reworded the two English-word grep false-positives
  ("explicit" in `responsive.css` / `SEO_GUIDE.md`), swept the remaining
  "Landing Page Boilerplate" file headers, and updated the admin Developer &
  SEO guides (tech-stack table now lists GSAP; boilerplate clone URL, stale
  Swiper/Confetti/video rows, and unused env rows removed; structure listing
  matches the final tree).
- Docs final pass: `CUSTOMIZATION_GUIDE.md` rewritten as the Nilachal
  maintenance guide (content editing via `src/data/*`, brand tokens, logo swap,
  admin credentials, PHP deploy steps with the `config.php` `ADMIN_API_KEY`
  pairing, SPA redirect rules per host, post-deploy checklist);
  `README.md`/`CLAUDE.md` updated to the final codebase (rebuild banners
  retired, env reference corrected); this changelog dated for release.

### 15 — Fix: admin panel 401 / leads invisible after deploy (key-override mismatch)

**Fixed**
- Diagnosed the live Cloudways deployment where the admin panel showed zero
  leads on every device and the refresh button reported *"Refresh failed:
  Server returned 401"*: a `public_html/api/config.php` created on the server
  (per the deployment guide) defines an `ADMIN_API_KEY` that differs from the
  `REACT_APP_LEADS_ADMIN_KEY` the deployed bundle was built with. `config.php`
  overrides the committed fallback key, so every admin `list`/`update`/`delete`
  was rejected while public submissions kept saving invisibly to
  `api/data/leads.json`.
- `public/api/leads.php` now accepts the admin key via the `X-Admin-Key`
  header **or** an `admin_key` query param / JSON body field (fallbacks for
  proxies that strip custom headers, scanning `getallheaders()`
  case-insensitively as well), and sends
  `Cache-Control: no-store` / `Pragma: no-cache` / `Expires: 0` on every
  response so a proxy cache (e.g. Cloudways Varnish) can never serve stale or
  unauthenticated lead data — or replay a cached 401 after the key is fixed.
- New public `GET /api/leads.php?action=health` diagnostic (no lead data, no
  key material): reports the active key source (`config` / `env` / `default`),
  an 8-char SHA-256 fingerprint of the expected key, whether the request's key
  arrived and matched, and whether the data store is writable.
- `leadService.js` sends the key on both vectors, fetches with
  `cache: "no-store"`, and on sync failure queries the health action to turn
  the bare "Server returned 401" into an actionable message that names the
  exact mismatch (e.g. *"api/config.php on the server defines a different
  ADMIN_API_KEY than the key this admin build was compiled with"*) in the
  Dashboard and Lead Management snackbars.

**Changed**
- Deployment guide (admin Guidelines → Deployment 8b), `README.md`,
  `CUSTOMIZATION_GUIDE.md`, Lead Storage & Developer guides: `config.php` is
  now documented as an **optional override** that must be created together
  with a matching rebuild — with a troubleshooting note pointing at
  `?action=health` — instead of a required setup step whose example invited a
  mismatched key.
