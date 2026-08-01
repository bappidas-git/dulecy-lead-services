# Prompt 02 — Multi-Page Routing Skeleton, Header, Mobile Menu & Footer

## 1. Objective

Convert the app from a one-pager into the mockup's **five-page site** and build
the three shell components every page shares — the fixed glass **Header** with
desktop nav, the **full-screen mobile menu**, and the dark **Footer** — as exact
React ports of `mockup/*.html`. Pages themselves are stubbed here and built in
Prompts 03–06.

## 2. Background

- Prompt 01 installed the Dulecy tokens (`--ink`, `--red`, `--grad`, Archivo,
  etc.) — use them, never raw hex.
- The current `src/App.jsx` renders one `HomePageContent` composed of 9 Nilachal
  sections with hash-anchor scrolling, plus `/thank-you` and `/admin/*` routes,
  a mobile bottom nav (`MobileNavigation`), a swipe drawer (`MobileDrawer`), a
  WhatsApp FAB, a scroll-progress bar, and a back-to-top button. **None of those
  mobile/floating extras exist in the Dulecy mockup** — the mockup uses a burger
  → full-screen overlay menu and nothing else floating.
- Mockup shell anatomy (source of truth: any page in `/mockup`, e.g.
  `mockup/index.html` lines 16–42 and 134–171, with classes in
  `mockup/styles.css`):
  - **Header** `.site-header`: fixed top, z-90, `backdrop-filter: saturate(180%)
    blur(16px)`, background `rgba(255,255,255,.78)`, 1px bottom border
    `rgba(11,11,12,.07)`; inner row height **68px**; logo img height 40px.
    Desktop nav ≥920px: links Home · About · Expertise · Who We Serve · Contact,
    font 14.5px/500 color `#3D3D42`, hover red; **active** link 700 ink with a
    2px gradient underline pseudo-element; then a "Let's Talk →" pill button
    (`.btn--nav`: gradient bg, white, 14px/600, padding 11px 22px, radius 999px,
    hover lift −2px + red shadow).
  - **Burger** <920px: 3 spans 24×2px, `.open` morphs to an X (translate ±7px,
    rotate ±45°, middle fades).
  - **Mobile menu** `.mobile-menu`: fixed inset-0 overlay z-85,
    `rgba(255,255,255,.97)` + blur(10px), padding-top 110px; links stacked,
    `clamp(30px,8vw,44px)`/700, tracking −.02em, numbered `<b>01</b>`–`05` in
    12px red; bottom border on each; foot pinned to bottom: full-width primary
    "Let's Talk →" button + meta row with `tel:` and `mailto:` links (13px,
    grey-3). Any link click closes the menu.
  - **Footer** `.site-footer`: ink background, text `#A6A6AD`, radial red
    `.footer-glow` top-right; CTA row — h2 `Ready to move *beyond business
    support?*` (serif italic em in `#F0293E`) + primary "Start a Conversation →"
    button, bottom-bordered; columns — brand (white logo h52, description
    paragraph, uppercase red-hi tagline "Your Partner in Business Leadership"),
    "Explore" nav column (links prefixed by a 14×1.5px red dash), "Get in
    touch" column with two bordered contact cards (Call us / Email us, icon
    tiles `rgba(213,25,46,.15)`); giant outline watermark **DULECY**
    (`-webkit-text-stroke:1px rgba(255,255,255,.09)`, transparent fill,
    `clamp(48px,14vw,190px)`); legal row `© 2026 Dulecy Lead Services. All
    rights reserved.` + serif "Beyond Business Support."
- The header CTA and footer CTAs open the enquiry UI. Until Prompt 07 replaces
  it, they call the **existing** `openLeadDrawer` from `src/context/ModalContext.jsx`
  (the old drawer keeps leads flowing mid-series).

## 3. Files/Folders to Inspect First

- `mockup/index.html` (header/menu/footer markup) and `mockup/styles.css`
  (`.site-header`, `.burger`, `.mobile-menu`, `.btn`, `.site-footer`,
  `.footer-*` blocks) — replicate values exactly.
- `src/App.jsx` (current routing, hash-scroll effect, splash-hide effect),
  `src/components/common/Header/`, `src/components/common/Footer/`,
  `src/context/ModalContext.jsx`, `src/styles/variables.css`.
- `src/components/common/MobileNavigation/`, `MobileDrawer/` (to be
  unmounted), `src/hooks/useMediaQuery.js`.

## 4. Exact Implementation Instructions

### 4.1 Routing — rewrite `src/App.jsx`

- Routes: `/` → `HomePage`, `/about` → `AboutPage`, `/expertise` →
  `ExpertisePage`, `/industries` → `IndustriesPage` (nav label **"Who We
  Serve"**), `/contact` → `ContactPage`; keep `/thank-you` and all `/admin/*`
  routes exactly as they are (thank-you is retired in Prompt 07); add a `*`
  catch-all rendering a minimal branded NotFound (display headline "Page not
  found", primary button "Back to Home") using the shell.
- Create `src/pages/{Home,About,Expertise,Industries,Contact}/` each with
  `XPage.jsx` + `XPage.module.css` + `index.js`. For now each renders the
  shared shell (Header/Footer) around a placeholder `<main>` with the page's h1
  from the mockup. Lazy-load all pages except Home; keep the existing
  ErrorBoundary + SectionLoader pattern and the `#initial-loader` hide effect.
- Public pages render inside a `PublicLayout` component (Header + `<main
  id="main-content">` + Footer + skip-link) so the shell is defined once.
- **Scroll behavior**: on route change scroll to top (`window.scrollTo(0,0)`,
  no smooth) unless a `location.hash` is present; keep the existing
  poll-until-element-exists hash-scroll helper but scope it to work on any
  page (Expertise deep links `#e01`–`#e10` land in Prompt 05).
- **Remove from the tree** (do not delete files yet — Prompt 11 deletes):
  `MobileNavigation`, `MobileDrawer`, `WhatsAppFab`, `ScrollProgressIndicator`,
  `BackToTopButton`, the `useIdlePreload` list of old sections. Keep
  `LeadFormDrawerWrapper` mounted globally so enquiry CTAs still work.

### 4.2 Header — rebuild `src/components/common/Header/`

Port the mockup exactly (see anatomy above). Requirements: React Router
`NavLink` for active state (gradient underline via `::after`); logo =
`siteConfig.logo`, links to `/`; CTA button label `Let's Talk →` (use `’`)
calling `openLeadDrawer('header-cta')`; burger toggles the mobile menu and
morphs to X; header stays fixed (no hide-on-scroll — the mockup has none).
Breakpoint: desktop nav hidden below **920px**, burger hidden at ≥920px.

### 4.3 Mobile menu — new `src/components/common/MobileMenu/`

Full-screen overlay per anatomy above; own the open state in the Header (or
lift to `PublicLayout`); close on link click, on route change, and on Escape;
lock body scroll while open; numbered items map over the same nav config as the
desktop nav (define `NAV_LINKS` once — suggested `src/data/navigation.js`
with `{ to, label, num }`).

### 4.4 Footer — rebuild `src/components/common/Footer/`

Port per anatomy above. All contact values from `siteConfig`
(`phoneDisplay`, `telHref`, `mailHref`, `email`); brand paragraph verbatim from
the mockup: "A professional business support and consulting organization —
helping businesses, institutions, entrepreneurs, and professionals build for
sustainable growth."; Explore column reuses `NAV_LINKS`; watermark text
`DULECY`; icon images in contact cards may temporarily use the mockup's
icons8 URLs (Prompt 12 self-hosts them).

### 4.5 Buttons

Create/normalize a shared button style matching the mockup: `.btn` inline-flex,
gap 10px, 16px/600, radius 999px; `.btn--primary` gradient bg, white, padding
16px 32px, hover translateY(−3px) + `0 14px 34px rgba(213,25,46,.38)`;
`.btn--outline` 1.5px ink border, padding 15px 30px, hover fills ink/white.
Either extend `src/components/common/Button/` or replicate the classes in the
shell modules — but keep it one implementation used everywhere.

## 5. Coding Standards

CSS Modules per component (BEM-ish class names fine); tokens via
`var(--ink)`/`var(--red)`/`var(--grad)` etc.; copy text verbatim (curly
apostrophes, `→` arrows as `<span aria-hidden="true">→</span>` per mockup);
keep `aria-label`s from the mockup (`aria-label="Main"`, `"Mobile"`, `"Menu"`,
`"Dulecy Lead Services — Home"`); functional components + hooks; no new deps.

## 6. Validation Checklist

- [ ] All 5 routes + `/admin/login` + an unknown URL render without console errors.
- [ ] Header matches mockup at 1440px and 375px (side-by-side vs the opened
  static file): heights, blur, active underline, CTA pill.
- [ ] Burger → overlay menu behaves: opens, numbers 01–05, link closes it, body
  scroll locked, Escape closes.
- [ ] Footer matches mockup: CTA row, 3 columns, watermark, legal row; phone
  and email are Dulecy's and clickable.
- [ ] No bottom mobile nav, WhatsApp FAB, scroll-progress bar, or back-to-top
  button renders on any page.
- [ ] "Let's Talk" (header, menu foot, footer CTA) opens the existing enquiry
  drawer.

## 7. Expected Deliverables

Rewritten `App.jsx`, `Header`, `Footer`; new `MobileMenu`, `PublicLayout`,
`src/data/navigation.js`, five stub page folders, NotFound; updated `App.css`
for removed floating widgets.

## 8. Testing Requirements

`npm run build` green. Manual: resize across 320/375/768/919/920/1440px —
burger appears exactly below 920px; keyboard-tab through header (visible focus,
skip-link works); refresh directly on `/about` (dev server) renders that page.

## 9. Constraints

- Do not delete old section/component files yet (Prompt 11) — only unmount.
- Do not modify the enquiry drawer, form, or any `src/admin/**` or
  `public/api/**` code.
- No content beyond stubs on the five pages.
- `/mockup`, `/prompts` untouched.

## 10. Completion Criteria

The app is a five-route site sharing one pixel-faithful Dulecy shell
(header/menu/footer) with working enquiry CTAs, green build, and no orphaned
floating UI from the Nilachal era rendering anywhere.

## 11. Report & PR (mandatory)

Branch `dulecy/02-routing-shell`; commit, push, open a **draft PR**. Report a
concise summary (routes added, shell parity notes, anything deferred) and the
**PR link** (or branch + commit SHAs if PR creation is unavailable).
