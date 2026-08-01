# Prompt 06 — Who We Serve (`/industries`) & Contact (`/contact`) Pages

## 1. Objective

Replace the last two stubs with full React ports of `mockup/industries.html`
and `mockup/contact.html`. The Contact page embeds the **existing**
`UnifiedLeadForm` (still Nilachal-styled) inside the mockup's form panel so
lead capture keeps working; Prompt 07 then rebuilds the form itself to the
Dulecy spec.

## 2. Background

- Shell, tokens, typography utilities, animation hooks, and
  `industriesData.js` (7 sectors with `num`, `name`, `description`, `icon`)
  exist from Prompts 01–03.
- Key mockup styles:
  - `.sectors` grid: auto-fit `minmax(min(290px,100%),1fr)`, gap 16px.
    `.sector` card: `--line` border, radius 22px, padding
    `clamp(26px,3vw,34px)`, min-height 230px, hover lift −5px + shadow
    `0 20px 44px rgba(11,11,12,.09)` + red border. Top row: 56px icon tile
    (radius 16px, bg `rgba(232,41,62,.07)`, 30px centered glyph) + pale grey
    num; name `clamp(18px,2vw,21px)`/750; desc 14.5px grey-3.
    `.sector--red`: gradient card, white, `justify-content:space-between`,
    name `clamp(19px,2.2vw,23px)`, `.sector__go` link row with circled →.
  - `.contact-card`: bordered row (radius 18px, padding 18px 20px), 44px icon
    tile (radius 14px, faint red gradient), uppercase 11px grey-4 `k` label +
    16.5px/700 `v` value; hover red border + lift −2px.
  - `.form-panel`: `flex:1.1 1 380px`, bg `#F7F7F8`, border `#ECECEF`, radius
    28px, padding `clamp(26px,3.6vw,44px)`, `align-self:flex-start`.

## 3. Files/Folders to Inspect First

- `mockup/industries.html` + `mockup/contact.html` (entire files) and
  `mockup/styles.css` (`.sectors`, `.sector*`, `.cta-split*`, `.action*`,
  `.contact-card`, `.form-panel`, `.hero*`).
- `src/data/industriesData.js`, `src/data/siteConfig.js`.
- `src/components/common/UnifiedLeadForm/` (embedding API: props
  `source`, `prefill`; the Contact section of the old site already embedded
  it — check `src/components/sections/ContactSection/ContactSection.jsx` for
  the working usage pattern).
- `src/pages/Industries/`, `src/pages/Contact/` (stubs).

## 4. Exact Implementation Instructions

### 4.1 `/industries` — Who We Serve

1. **Hero** — background Unsplash image
   `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2400&auto=format&fit=crop`
   (`object-position:center 40%`, opacity .65, parallax −16) under the
   mockup's dual white-gradient scrim; eyebrow `Who we serve`; h1
   `.display--md`: `Our expertise.` <br> `*Your industry.*` (serif gradient
   em); lede "Our experience and professional perspective are adaptable…"
   (verbatim). Hero-intro animation; bottom padding `clamp(50px,7vw,80px)`.
2. **Sectors grid** — in `.container` with bottom padding
   `clamp(80px,10vw,130px)`: 7 `.sector` cards from `industriesData`
   (icon tile uses each item's icons8 URL as a background-image, exactly the
   mockup glyphs: pill, hospital-3, company, commercial, graduation-cap,
   rocket, briefcase — red `#D5192E` variants) + the 8th `.sector--red`
   card: name `Don't see your sector? Our approach begins with your
   context.`, go-link `Tell us about it →` — opens the enquiry drawer
   (source `industries-cta`). Stagger-reveal the grid.
3. **CTA split (grey)** — left: eyebrow `One partner. Many dimensions.`,
   head `Specialized where experience matters. *Flexible where business needs
   evolve.*` (serif gradient em), body-md "Whatever your sector or stage of
   growth…" (verbatim). Right (stagger): `.action--red` `Start a
   conversation` / `Tell us about your organization` (enquiry, source
   `industries-cta-2`); `.action--white` phone card (`telHref`); third
   `.action--white`: title `Explore our expertise`, sub `Ten connected areas
   of experience`, icon `↗` — links `/expertise`.

### 4.2 `/contact` — Contact

Two-column layout inside a hero-padded container (`.hero__inner` paddings:
top `clamp(140px,18vh,190px)`), flex-wrap gap `56px clamp(48px,7vw,110px)`:

- **Left column** (`flex:1 1 340px`), all hero-intro animated:
  - Badge pill with pulse-dot: `We usually reply within a day`.
  - h1 (display, `clamp(34px,6.4vw,76px)`): `Let's build *what comes
    next.*` (serif gradient em).
  - Lede (max-width 480px): "Whether you are strengthening HR systems,
    analysing performance, protecting a brand, developing leaders, or setting
    up something new — it starts with one conversation."
  - Two stacked `.contact-card`s (max-width 420px): Call us /
    `+91 70990 02522` (`telHref`, nowrap) and Email us /
    `dulceyleadservices@gmail.com` (`mailHref`, 15.5px, break-all).
  - Quote block: 20px left padding, 2px red left border, serif italic 18px
    grey-3: `"Your partner in business leadership."` (curly quotes).
- **Right column** — `.form-panel`: h2 `Send us an enquiry`
  (`clamp(20px,2.4vw,26px)`/750), sub "One unified form for every requirement
  — we'll route it to the right expertise." (14px grey-3), then the
  **existing** `UnifiedLeadForm` mounted inline (variant/props per the old
  ContactSection usage; `source="contact-page"`). Do not restyle the form
  internals in this prompt — wrap it so the panel chrome matches the mockup;
  perfect field styling arrives with Prompt 07.

Both pages end with the shared Footer (already global via `PublicLayout`).

## 5. Coding Standards

Series standards. Icon tiles: `background-image` + `background-size:30px
30px` exactly like the mockup (the URLs live in `industriesData`, not inline
in JSX). All contact values via `siteConfig` helpers. Verbatim copy including
`Don't` / `we'll` curly apostrophes and the quoted serif line.

## 6. Validation Checklist

- [ ] Side-by-side vs both mockup pages at 1440/1024/768/375px — hero scrims,
  card grids, icon tiles, action cards, form panel chrome all match.
- [ ] `/industries`: 7 sector cards + red card render from data; red card and
  action card open the enquiry drawer; phone/email links correct.
- [ ] `/contact`: form panel contains the working lead form; submitting a
  valid test enquiry succeeds end-to-end (existing drawer/form logic);
  contact cards clickable.
- [ ] Copy extraction diff vs both mockup files = identical (excluding the
  form internals, which are Prompt 07's spec).
- [ ] Animations per series spec incl. hero parallax on `/industries`;
  reduced-motion static; no horizontal overflow.

## 7. Expected Deliverables

`src/pages/Industries/` and `src/pages/Contact/` complete;
`industriesData.js` corrected/completed if any sector copy differs from
`mockup/industries.html`.

## 8. Testing Requirements

`npm run build` green; direct hard-refresh loads of both routes; keyboard
navigation through cards and into the form; mobile check at 375px (form panel
full-width below the intro column, per flex-wrap).

## 9. Constraints

- Do not modify `UnifiedLeadForm` internals, `webhookSubmit`, or any admin/API
  code — embedding only.
- External image/icon URLs stay until Prompt 12. `/mockup`, `/prompts`
  untouched.

## 10. Completion Criteria

Both routes match their mockup pages (form internals excepted, pending
Prompt 07), lead submission from `/contact` works, and the build is green.

## 11. Report & PR (mandatory)

Branch `dulecy/06-industries-contact`; commit, push, open a **draft PR**.
Report a concise summary and the **PR link** (or branch + commit SHAs if PR
creation is unavailable).
