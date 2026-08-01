# Prompt 03 — Home Page (`/`) Pixel-Match Build

## 1. Objective

Replace the Home stub with a full React port of `mockup/index.html`: seven
sections, exact copy, exact styling, and the mockup's GSAP entrance/scroll
animations. Also create the shared data files (`expertiseData`,
`industriesData`) and the two animation hooks (`useHeroIntro`, `useLineReveal`)
that Prompts 04–06 will reuse.

## 2. Background

- Shell (Header/MobileMenu/Footer, routes) exists from Prompt 02. Design tokens
  and Archivo/Instrument Serif fonts exist from Prompt 01.
- The repo already has a GSAP foundation in `src/animations/` (`gsapSetup.js`
  registers ScrollTrigger + `useGSAP`; hooks `useReveal`, `useStaggerReveal`,
  `useCountUp`, `useParallax`; all SSR-safe, reduced-motion-aware, refresh
  ScrollTrigger). Extend this foundation — do not hand-roll ad-hoc GSAP calls
  in components.
- Mockup animation semantics (from `mockup/scripts.js` — replicate values
  exactly):
  - `data-hero` elements: one `fromTo` per page load — `y:36→0, opacity:0→1,
    duration:1, ease:'power3.out', stagger:0.12, delay:0.1`.
  - `data-reveal` (optional numeric value = extra delay): `y:32→0, opacity,
    duration:0.9, power3.out`, ScrollTrigger `start:'top 88%', once:true`.
  - `data-stagger`: children `y:26→0, opacity, duration:0.8, stagger:0.09,
    start:'top 86%', once:true`.
  - `data-line`: `scaleX:0→1, transformOrigin:'left center', duration:1.1,
    ease:'power3.inOut', start:'top 92%', once:true`.
  - `data-parallax="<amt>"`: `yPercent: +|amt|/2 → −|amt|/2, ease:'none',
    scrub:0.4`, trigger = parent, `start:'top bottom', end:'bottom top'`.
  - All skipped entirely under `prefers-reduced-motion` (final state shown).

## 3. Files/Folders to Inspect First

- `mockup/index.html` (entire file — the copy + structure source of truth) and
  `mockup/styles.css` (`.hero*`, `.marquee*`, `.section*`, `.split*`, `.rows*`,
  `.cards`/`.card*`, `.eyebrow`, `.display`, `.lede`, `.link-more`, `.rule`,
  `.glow`, keyframes `marquee`/`floaty`/`pulseDot`).
- `src/animations/` (all files), `src/pages/Home/`, `src/data/`,
  `src/context/ModalContext.jsx` (CTA wiring), `src/data/siteConfig.js`.

## 4. Exact Implementation Instructions

### 4.1 New animation hooks in `src/animations/`

- `useHeroIntro()` — targets all `[data-hero]`-equivalent children (accept a
  selector or ref list) with the exact hero tween above; runs on mount (no
  ScrollTrigger); export from the barrel.
- `useLineReveal()` — the `data-line` scaleX tween.
- Extend `useReveal`/`useStaggerReveal` with an options arg to match the
  mockup's values (`start`, `delay`, `y`, `stagger`) without breaking existing
  call signatures. Follow the house pattern: return refs, SSR-safe,
  reduced-motion no-op to final state, `ScrollTrigger.refresh()` after mount.

### 4.2 Data files in `src/data/`

- `expertiseData.js` — array of **10** areas, in mockup order, each:
  `{ id: 'e01'…'e10', num: '01'…'10', title, tagline, description, note,
  closing, tags: [...] }`. Copy every string **verbatim** from
  `mockup/expertise.html` (titles/taglines also appear in `index.html` rows —
  they must match). Example item 01: title `HR & People Management`, tagline
  `Building organizations through people`, 11 tags starting `HR Management`,
  `HR Policies & Procedures`, …
- `industriesData.js` — array of **7** sectors from `mockup/industries.html`:
  `{ num, name, description, icon }` (icon = the icons8 URL used in the mockup
  for now) **plus** the short-card variants used on the home page
  (`homeTitle`, `homeDesc` from `mockup/index.html` cards — e.g. name
  `Pharmaceutical & Healthcare Organizations` vs home card title
  `Pharmaceutical & Healthcare` with desc `Specialized business expertise with
  real industry depth.`). Keep one file; the two pages read different fields.
- Marquee items (7 strings: `Pharmaceutical & Healthcare`, `Hospitals`,
  `Corporates`, `Marketing & Sales Teams`, `Business Schools`, `Startups`,
  `Entrepreneurs & Investors`) — put in `industriesData.js` as
  `marqueeItems`.

### 4.3 Home sections — `src/pages/Home/` (one component per section, CSS Modules)

Build in this order, copy from `mockup/index.html`:

1. **Hero** — background Unsplash image
   (`https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2400&auto=format&fit=crop`,
   `object-position:center 30%`, opacity .5, parallax −16) under a double
   white-gradient scrim; floating Dulecy icon logo top-right (`opacity:.07`,
   `floaty` 9s keyframe); badge pill with red `pulse-dot` + text `Beyond
   Business Support`; h1 `.display` (`clamp(36px,8.4vw,104px)`, weight 800,
   tracking −.035em, line-height 1.04): `We don't just offer services.` line
   break `We deliver *impact*.` with `impact` in Instrument Serif italic +
   `--grad-text` clipped gradient; lede paragraph (max-width 640px); CTA row:
   primary `Start a Conversation →` (opens enquiry) + outline `Explore Our
   Expertise` (links `/expertise`); pillars row: 4 numbered items (01 Business
   Solutions · 02 People & Organization · 03 Corporate Services · 04 Leadership
   & Capability) above a 1px top border. Hero children animate via
   `useHeroIntro`.
2. **Marquee** — ink band rotated `rotate(-1deg) scale(1.02)`, uppercase white
   14px/600 items separated by red `◆`, duplicated group, CSS keyframe
   translateX −50% over **36s** linear infinite. `aria-hidden="true"`.
3. **Who we are** — `.split` layout: aside eyebrow `Who we are`, section-head
   `Built on experience. Defined by trust.`, gradient `.rule` bar
   (useLineReveal); main: two paragraphs (verbatim) + `link-more` `More about
   Dulecy →` to `/about` (circled-arrow icon style).
4. **Belief band (dark)** — `.section--dark` centered, red radial glow
   top-right (parallax −10); eyebrow `Our approach is grounded in a simple
   belief`; large statement (`clamp(26px,4.4vw,48px)`, 600, −.025em) ending
   with serif italic red `#F0293E` sentence `It should strengthen the
   organization for what comes next.`
5. **Expertise index** — header row: eyebrow `Our expertise`, section-head
   `Experience that connects people, processes & performance.`, right-aligned
   `link-more` `View all in detail →` to `/expertise`; then `.rows`: 10 rows
   from `expertiseData`, each a `Link` to `/expertise#eNN` with red 13px num,
   title (`clamp(17px,2.4vw,23px)`/700), grey tag line, and a 38px circled ↗;
   hover: bg `#F7F7F8`, padding-left 20px. Stagger-reveal the rows.
6. **Who we serve (grey)** — eyebrow `Who we serve`, head `Our expertise.
   *Your industry.*` (serif em); `.cards` auto-fit grid (min 230px): 7 white
   cards (homeTitle/homeDesc, hover lift −4px + red border) + final
   `.card--red` gradient card `See how we adapt to your sector` with circled →;
   all link to `/industries`. Stagger-reveal.
7. **Closing CTA** — centered: eyebrow `Beyond business support`, huge
   headline `Let's strengthen your organization for *what comes next.*`
   (serif gradient em, `clamp(32px,5.6vw,64px)`/800/−.035em); buttons: primary
   `Start a Conversation →` (enquiry) + outline `Call +91 70990 02522`
   (`telHref` from siteConfig).

### 4.4 Wiring

- Enquiry CTAs call `openLeadDrawer('<source-id>')` with distinct sources
  (`home-hero`, `home-cta`, `footer-cta` already from Prompt 02).
- All internal navigation uses React Router `Link`; expertise rows include the
  hash (`/expertise#e04`).
- Typography utilities (`.eyebrow`, `.display`, `.lede`, `.section-head`,
  `.serif`, `.grad-text`, `.body-lg`, `.body-md`, `.link-more`) — implement
  once as shared classes (suggested `src/styles/typography.css` imported
  globally, or a shared module) with the mockup's exact values; don't
  re-declare per component.

## 5. Coding Standards

Copy verbatim (curly quotes `’`, em dashes, `&`); tokens only, no raw hex
except inside gradient token definitions; arrows/symbols wrapped
`aria-hidden` as in the mockup; images that are decorative get `alt=""
aria-hidden="true"`; each section its own component + module; hooks from
`src/animations` only.

## 6. Validation Checklist

- [ ] Open `mockup/index.html` in a browser next to `localhost:3000/` at
  1440/1024/768/375px — section-by-section visual match (spacing, type sizes,
  colors, hover states, border radii).
- [ ] Hero intro staggers on load; reveals fire once on scroll; marquee loops
  seamlessly; parallax scrubs; `prefers-reduced-motion` shows everything
  static with no motion.
- [ ] All 10 expertise rows navigate to `/expertise#eNN`; cards navigate to
  `/industries`; both CTAs open the enquiry drawer; phone CTA is
  `tel:+917099002522`.
- [ ] Copy diff: extract visible text from the built page and from
  `mockup/index.html` — identical (including `We don't just offer services.`
  apostrophe form).
- [ ] No horizontal scrollbar at any width (marquee rotation is clipped).

## 7. Expected Deliverables

`src/pages/Home/` fully built (page + section components + modules); new
`src/data/expertiseData.js`, `src/data/industriesData.js`; new
`useHeroIntro`, `useLineReveal` hooks exported from `src/animations`; shared
typography utilities.

## 8. Testing Requirements

`npm run build` green; Lighthouse quick pass on `/` (no CLS from the hero
image — set explicit dimensions/aspect-ratio); keyboard: all interactive
elements reachable and visibly focused; test hash navigation from a home row
to `/expertise#e05` (will scroll once Prompt 05 builds the accordion — for now
must not error).

## 9. Constraints

- Old Nilachal section files stay on disk untouched (deleted in Prompt 11).
- No edits to admin, lead form, or API code.
- Keep external mockup asset URLs (Unsplash, icons8) as-is for pixel parity —
  self-hosting happens in Prompt 12.
- `/mockup`, `/prompts` untouched.

## 10. Completion Criteria

`/` is visually and behaviorally indistinguishable from `mockup/index.html`
(within browser-rendering tolerance), fully responsive, animated per spec,
with data-driven expertise/industry lists shared for later pages.

## 11. Report & PR (mandatory)

Branch `dulecy/03-home-page`; commit, push, open a **draft PR**. Report a
concise summary (sections built, hooks/data added, parity notes) and the
**PR link** (or branch + commit SHAs if PR creation is unavailable).
