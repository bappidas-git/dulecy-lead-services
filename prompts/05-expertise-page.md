# Prompt 05 — Expertise Page (`/expertise`) — Accordion & Deep Links

## 1. Objective

Replace the Expertise stub with a full React port of `mockup/expertise.html`:
hero, a **single-open accordion of the 10 expertise areas** driven by
`expertiseData`, working `#e01`–`#e10` deep links (from the home page rows and
external URLs), and the grey "Start with a conversation" CTA section.

## 2. Background

- `src/data/expertiseData.js` (Prompt 03) already holds all 10 areas with
  `id ('e01'…'e10'), num, title, tagline, description, note, closing, tags[]`
  copied verbatim from the mockup. If any field is missing or truncated,
  complete it from `mockup/expertise.html` first — that file wins.
- Mockup accordion behavior (`mockup/scripts.js`): clicking a header closes all
  items and opens the clicked one (or closes it if it was open — all-closed is
  a legal state); after every toggle call `ScrollTrigger.refresh()`; on load
  with a `location.hash` matching an item id, open that item (only item 01 is
  open by default otherwise); items have `scroll-margin-top:90px` so hash
  scrolling clears the fixed header.
- Key styles (`mockup/styles.css` `.acc*`): items bordered by `--line`; header
  is a full-width transparent button, padding `clamp(20px,3vw,30px)
  clamp(8px,1.5vw,18px)`, hover/open bg `#F7F7F8`; red num (min-width 34px);
  title `clamp(19px,2.8vw,28px)`/750/−.02em; tagline uppercase 12–13.5px
  grey-4 tracking .12em; right icon = 42px circle, 1.5px `#DEDEE2` border,
  `+` glyph — open state rotates 45° and fills with the gradient, white, no
  border; body two columns (`.acc__cols`, left-margin `clamp(0px,3vw,66px)`):
  text column (description `clamp(16px,1.8vw,18.5px)` grey-1 → note 14.5px
  grey-3 → closing line 14px/700 uppercase red) and side column (label `Our
  experience spans` 11px/700 uppercase grey-4; pill tags `#FAFAFB` bg,
  `--line` border, radius 999px, 13px; CTA `Discuss this area →` red
  14px/700); body opening animates `expandIn .4s cubic-bezier(.22,1,.36,1)`
  (opacity 0 / y −8 → shown).

## 3. Files/Folders to Inspect First

- `mockup/expertise.html` (entire file — all 10 items' body copy and tag
  lists) and `mockup/styles.css` (`.acc*`, `.cta-split*`, `.action*`).
- `mockup/scripts.js` (accordion + hash logic to replicate).
- `src/data/expertiseData.js`, `src/pages/Expertise/` (stub),
  `src/context/ModalContext.jsx` (prefill signature:
  `openLeadDrawer(titleKey, extraData)` passes `service_interest` through to
  the form), `src/App.jsx` (hash-scroll helper from Prompt 02).

## 4. Exact Implementation Instructions

### 4.1 Hero

Light hero, reduced bottom padding (`clamp(50px,7vw,80px)`): eyebrow `Our
expertise`; h1 `.display--sm` (`clamp(32px,6.4vw,80px)`): `Experience that
connects *people, processes & performance.*` (serif italic gradient em); lede
("Ten connected areas of experience…" — verbatim); helper line `Tap any area
to expand` (13px `#8B8B92`, preceded by a 22×1.5px red dash). Hero-intro
animation.

### 4.2 Accordion — new `ExpertiseAccordion` component

- Render the 10 items from `expertiseData` inside a plain section container
  with bottom padding `clamp(80px,10vw,130px)` (the mockup places the
  accordion directly in `.container`, not inside `.section`).
- State: `openId` (string | null), initialized to `'e01'`, overridden by a
  valid `location.hash` on mount. Clicking a header sets `openId` to the item
  (or `null` if it was already open). Exactly the mockup semantics — **not**
  a multi-open accordion.
- Each item root carries `id={item.id}` and `scroll-margin-top:90px`. On mount
  with a hash: open the item, then scroll it into view (reuse the shared
  poll-until-rendered hash helper so lazy loading can't miss it). Also handle
  in-app hash changes (user clicks a home row while already on `/expertise`).
- Header button: `aria-expanded`, `aria-controls`; body region with matching
  `id` and `role="region"`. Keyboard: Enter/Space toggles (native button).
- Body mount/unmount with the `expandIn` animation (CSS keyframe is enough —
  match duration/curve; GSAP optional). After each toggle call
  `ScrollTrigger.refresh()` (import from `src/animations`).
- Side column CTA `Discuss this area →` calls
  `openLeadDrawer('expertise-<id>', { service_interest: item.title })` so the
  enquiry form preselects that area (the current drawer already supports the
  prefill; Prompt 07 preserves it).

### 4.3 CTA section — `.cta-split` (grey)

Left: eyebrow `Not sure where to start?`, head `Start with *a conversation.*`
(serif gradient em), body-md ("We don't believe every business challenge fits
into a predefined service…"). Right, stacked action cards (stagger):

1. `.action--red` (gradient): title `Send us an enquiry`, sub `One form,
   routed to the right expertise`, circled → — opens the enquiry drawer
   (source `expertise-cta`).
2. `.action--white`: title `+91 70990 02522` (nowrap), sub `Talk to us
   directly`, icon tile with phone glyph — `telHref`.
3. `.action--white`: title `dulceyleadservices@gmail.com` (15px,
   break-all), sub `Write to us anytime`, icon tile with mail glyph —
   `mailHref`.

Action-card styles per `mockup/styles.css` (`.action`, `.action--red`,
`.action--white`): radius 18px, padding 20px 22px, hover lift −3px with the
respective shadows; white icon tiles 40px, radius 12px, faint red gradient
background. Contact values from `siteConfig` — never hard-coded.

## 5. Coding Standards

Series standards (CSS Modules + tokens, verbatim copy, hooks from
`src/animations`, `aria-hidden` decorative glyphs). The accordion must be a
controlled, accessible disclosure implemented with semantic `<button>`s — do
not pull in MUI Accordion (its styling fights the pixel spec).

## 6. Validation Checklist

- [ ] Side-by-side vs `mockup/expertise.html` at 1440/1024/768/375px — header
  rows, open-body layout, tag pills, CTA section all match.
- [ ] Item 01 open by default; opening 03 closes 01; clicking 03 again closes
  it; icon rotates 45° and fills gradient when open.
- [ ] `/expertise#e07` direct load opens item 07 scrolled under the header;
  clicking a home-page row (`/expertise#e04`) while on `/` navigates and opens
  04; clicking another row while already on `/expertise` switches items.
- [ ] `Discuss this area` opens the enquiry drawer with that area preselected
  in the interest field.
- [ ] All 10 items' copy + tags diff-identical to the mockup.
- [ ] Reveals/stagger/reduced-motion behave per series spec; ScrollTrigger
  positions stay correct after toggling (scroll after opening a tall item —
  later reveals still fire at the right offsets).

## 7. Expected Deliverables

`src/pages/Expertise/` complete (hero, `ExpertiseAccordion`, CTA split,
modules); `expertiseData.js` completed/corrected if needed; shared hash-scroll
helper reused (extended only if required).

## 8. Testing Requirements

`npm run build` green; keyboard-only run-through (tab to headers, toggle,
reach tag-column CTA); screen-reader sanity: headers announce expanded state;
no layout shift of the page when toggling (content below moves, but no
re-flow glitches).

## 9. Constraints

- Touch only `src/pages/Expertise/`, `src/data/expertiseData.js`, and (if
  needed) the shared hash helper + animation barrel.
- Do not modify the drawer/form beyond calling its existing API.
- External icon URLs stay (Prompt 12 self-hosts). `/mockup`, `/prompts`
  untouched.

## 10. Completion Criteria

`/expertise` matches the mockup pixel-for-pixel, the accordion behaves exactly
like the static version (including hash deep links from other pages), the
prefilled enquiry flow works, and the build is green.

## 11. Report & PR (mandatory)

Branch `dulcey/05-expertise-page`; commit, push, open a **draft PR**. Report a
concise summary and the **PR link** (or branch + commit SHAs if PR creation is
unavailable).
