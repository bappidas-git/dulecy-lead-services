# Prompt 04 — About Page (`/about`) Pixel-Match Build

## 1. Objective

Replace the About stub with a full React port of `mockup/about.html`: six
sections with exact copy, styling, and animations, including the signature dark
"intersection" band with outline-stroke stacked words.

## 2. Background

- Shell, tokens, typography utilities, and animation hooks (`useHeroIntro`,
  `useReveal`, `useStaggerReveal`, `useLineReveal`, `useParallax`) exist from
  Prompts 01–03.
- `mockup/about.html` is the sole source of truth for structure and copy. Its
  distinctive pieces, with the `styles.css` classes to replicate:
  - `.stack-words` — stacked display words (`clamp(32px,7vw,88px)`, 800,
    −.03em) where alternating words are **outline text**
    (`color:transparent; -webkit-text-stroke:1.5px rgba(255,255,255,.8)`) and
    trailing punctuation `<i>` is solid red with no stroke.
  - `.numlist` — dark numbered list, rows bordered
    `rgba(255,255,255,.14)`, red-hi numbers, `#C9C9CE` text.
  - `.principles` / `.principle` — dark cards `#111113`, border
    `rgba(255,255,255,.09)`, radius 20px, hover bg `#17171A` + red border +
    lift −4px; each has a gradient dot + grey num, name 17px/700, desc 13.5px
    grey-4.

## 3. Files/Folders to Inspect First

- `mockup/about.html` (entire file) and `mockup/styles.css` (`.stack-words`,
  `.numlist`, `.principles`, `.principle*`, `.split*`, `.section--dark`,
  `.glow`, `.rule`).
- `src/pages/About/` (stub), `src/pages/Home/` (patterns to mirror),
  `src/animations/`, `src/styles/` typography utilities.

## 4. Exact Implementation Instructions

Build `src/pages/About/` as one page component with per-section subcomponents.
Sections, in order (all copy verbatim from the mockup):

1. **Hero (light)** — eyebrow `About us`; h1 `.display--md`
   (`clamp(34px,7vw,88px)`, line-height 1.05): `Built on experience.` <br>
   `*Defined by trust.*` (serif italic + gradient text); lede paragraph
   ("Business success is rarely determined by one function alone…"); bold
   closing line `Dulcey Lead Services brings these dimensions together.`
   (`clamp(19px,2.2vw,24px)`, 700). Hero-intro animation; reduced hero bottom
   padding per the mockup's inline style (`clamp(60px,8vw,90px)`).
2. **Intersection band (dark)** — full-bleed `.section--dark` with:
   background Unsplash image
   `https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2400&auto=format&fit=crop`
   (absolute, `height:136%`, `top:-18%`, opacity .38, parallax −22) under the
   mockup's dual dark-gradient overlay; red glow bottom-left (parallax −10).
   Left column: kicker `We work at the intersection of` (13px/600 uppercase,
   tracking .18em, `#A6A6AD`, preceded by a 26×1.5px red dash) then
   `.stack-words` (stagger-reveal): `People,` / `Processes,` (outline) /
   `Performance,` / `& Priorities.` (outline) — commas/period as red `<i>`.
   Right column (reveal, delay .15): intro paragraph `Helping organizations
   create greater structure, clarity, and control.` + 4-item `.numlist`
   (quality of people / strength of processes / visibility of information /
   discipline of leadership decisions).
3. **Distinctive perspective (light split)** — aside: eyebrow `A distinctive
   perspective`, head `Depth in pharma. Breadth across sectors.`
   (custom size `clamp(28px,4vw,46px)`), gradient rule (line reveal); main:
   body-lg paragraph ("Our experience in pharmaceutical business and
   healthcare operations…") + 3 grey tiles (`#F5F5F6`, radius 18px, padding
   24px, stagger): **Practical** "enough to implement." / **Structured**
   "enough to endure." / **Thoughtful** "enough to create lasting value."
4. **Our difference (grey)** — eyebrow `Our difference`; head `Specialized
   where experience matters. *Broad enough to see the bigger picture.*`
   (serif em); body-md paragraph ("We do not believe every business
   challenge…"); 6 numbered white cards in an auto-fit grid (min 200px,
   border `--line`, radius 18px, red 12px num, 16.5px/700 title):
   01 Industry Understanding · 02 Business Intelligence · 03 People Expertise ·
   04 Leadership Capability · 05 Corporate Structure · 06 Professional
   Development (stagger); closing bold line "We believe the greatest value is
   created when these perspectives work together."
5. **Principles (dark)** — eyebrow `The principles behind our work`; head
   `Trust. Security. Compliance. Confidentiality. Professionalism.`; 5
   `.principle` cards (stagger) with names Trust / Security / Compliance /
   Confidentiality / Professionalism and their exact descriptions from the
   mockup.
6. **Commitment + CTA (light, centered)** — eyebrow `Our commitment`; intro
   paragraph ("We believe meaningful professional partnerships…"); 4 stacked
   phrases (`clamp(22px,3.6vw,38px)`, 750, −.025em) with red serif italic
   ends: `The business behind *the brief.*` / `The people behind *the
   organization.*` / `The challenge behind *the numbers.*` / `The opportunity
   behind *the problem.*` (stagger); buttons: primary `Work With Us →`
   (enquiry, source `about-cta`) + outline `Explore Our Expertise`
   (`/expertise`).

Store this page's one-off copy inline in the components (it is not shared);
anything also used elsewhere (principles are About-only) stays local — do not
create a new data file for this page.

## 5. Coding Standards

Same as the series: CSS Modules + tokens, verbatim copy with typographic
characters, decorative images `alt="" aria-hidden`, animation hooks from
`src/animations` only, no raw brand hex. The outline-text effect must include
the `-webkit-text-stroke` prefix exactly as the mockup (it is the working
implementation in Chromium/WebKit/Firefox).

## 6. Validation Checklist

- [ ] Side-by-side vs `mockup/about.html` at 1440/1024/768/375px — all six
  sections match (dark band image crop, glow position, stack-word stroke,
  card grids, spacing rhythm).
- [ ] Copy extraction diff vs the mockup = identical.
- [ ] Animations: hero stagger on load; stack-words stagger in; rule line
  scales; parallax on the band image and glow; all `once`; reduced-motion
  static.
- [ ] `Work With Us` opens the enquiry drawer; `Explore Our Expertise` routes.
- [ ] No horizontal overflow; dark band text stays readable at all widths.

## 7. Expected Deliverables

`src/pages/About/` complete (page + section components + modules); no other
app areas touched.

## 8. Testing Requirements

`npm run build` green; direct load of `/about` (hard refresh) renders
correctly; keyboard navigation and focus visible on both CTAs; Lighthouse spot
check — the Unsplash band image must not cause CLS (reserve space via
aspect-ratio or absolute positioning as in the mockup).

## 9. Constraints

- Touch only `src/pages/About/` (plus barrel exports if needed).
- External image/icon URLs stay as in the mockup until Prompt 12.
- No changes to admin, form, API, or other pages. `/mockup`, `/prompts`
  untouched.

## 10. Completion Criteria

`/about` is pixel- and copy-faithful to `mockup/about.html`, responsive,
animated per spec, with a green build.

## 11. Report & PR (mandatory)

Branch `dulcey/04-about-page`; commit, push, open a **draft PR**. Report a
concise summary and the **PR link** (or branch + commit SHAs if PR creation is
unavailable).
