# Prompt 12 — Asset Migration, Performance & Accessibility

## 1. Objective

Make the pixel-faithful site production-grade: self-host the mockup's external
images/icons, optimize loading (Core Web Vitals), verify code-splitting, and
raise accessibility to a professional standard — **without changing how
anything looks**.

## 2. Background

- Prompts 03–06 intentionally used the mockup's external asset URLs for exact
  parity. Current externals:
  - **Unsplash photos** (3): home hero `photo-1486406146926-c627a92ad1ab`
    (opacity .5, `center 30%`), About dark band `photo-1522071820081-009f0129c71c`
    (opacity .38), Industries hero `photo-1449824913935-59a10b8d2000`
    (opacity .65, `center 40%`) — all `?q=80&w=2400&auto=format&fit=crop`.
  - **icons8 PNGs**: `phone`, `new-post` (in red `D5192E` and red-hi `F0293E`
    variants) used in footer/contact/action cards; sector glyphs `pill`,
    `hospital-3`, `company`, `commercial`, `graduation-cap`, `rocket`,
    `briefcase` (red) on `/industries`.
  - **Cloudinary logos** — these STAY remote (the established pattern for this
    codebase; logos are referenced from `siteConfig` and also by SEO schemas).
  - **Google Fonts** (Archivo + Instrument Serif) — stays on the CDN with
    preconnect, matching the mockup.
- The app already code-splits routes (verify) and hides a splash loader on
  mount. GSAP animations are transform/opacity-only per Prompt 09.

## 3. Files/Folders to Inspect First

- `grep -rn "images.unsplash\|img.icons8" src/` — the exact usage inventory.
- `src/pages/**` image usages, `src/data/industriesData.js` (icon URLs),
  `Footer`, contact/action card components.
- `src/App.jsx` (lazy boundaries), `build/` output after a fresh build
  (chunk map), `public/index.html` (preloads), `public/manifest.json`.
- Lighthouse reports for `/`, `/about`, `/expertise`, `/industries`,
  `/contact` (run before changes to get a baseline).

## 4. Exact Implementation Instructions

### 4.1 Self-host images

- Download the 3 Unsplash photos once at width 2400, generate optimized
  variants (e.g. via a one-off script with the repo's `sharp` dev dep):
  WebP at ~1920w and ~960w plus a JPEG fallback, target ≤ 250 KB each at the
  large size. Store under `public/images/` with descriptive names
  (`hero-home.jpg/webp`, `about-band.jpg/webp`, `hero-industries.jpg/webp`).
- Replace the Unsplash URLs with the local assets via `<picture>`/`srcSet`
  (or `image-set()` where used as CSS background), preserving
  `object-position`, opacity, scrim stacking, and parallax attributes exactly.
- Download the icons8 glyphs actually used, at 100px, into
  `public/images/icons/` (keep the color variants the mockup uses — or store
  single-color SVG/PNG and tint via CSS filter ONLY if the rendered result is
  visually identical; when in doubt keep the exact PNGs). Update
  `industriesData.js` and the components to local paths.
- Remove any remaining hotlinks: `grep -rn "images.unsplash\|img.icons8" src/`
  must return zero after this.

### 4.2 Loading & Core Web Vitals

- **LCP**: preload the home hero image (`<link rel="preload" as="image">`
  with `imagesrcset` for the responsive pair) in `public/index.html`; hero
  `<img>` gets `fetchpriority="high"`, explicit `width`/`height` (or
  aspect-ratio via CSS) — zero CLS from images anywhere (audit every `<img>`
  for dimensions).
- Below-the-fold images: `loading="lazy" decoding="async"`.
- Fonts: confirm `display=swap` (already in the URL) and preconnects; do not
  self-host fonts in this prompt (parity + simplicity), but note the option
  in the PR.
- **Bundles**: verify each route is its own chunk (network tab on cold
  navigation); ensure GSAP/MUI aren't duplicated across chunks (single
  vendor); remove any accidental eager imports of admin code from public
  pages (admin must not load until `/admin`). Report main-bundle gzip size
  before/after.
- Cache/serve hints: add long-cache guidance for `/images/**` to the
  deployment guideline (implementation itself lands with Prompt 14's
  `.htaccess`).

### 4.3 Accessibility (WCAG 2.1 AA sweep)

- **Structure**: one `<h1>` per page; logical h2/h3 order; landmarks
  `header/nav/main/footer` present (from the shell); skip-link functional.
- **Modal**: focus trap, `aria-modal`, labelled dialog, Escape/backdrop
  close, focus restore (built in Prompt 07 — verify and fix gaps).
- **Accordion**: `aria-expanded`/`aria-controls`, keyboard operability
  (verify from Prompt 05).
- **Mobile menu**: `aria-expanded` on the burger, focus moves into the menu,
  Escape closes, focus returns to the burger.
- **Forms**: every input labelled (the mockup wraps inputs in `<label>` —
  keep), errors announced via `aria-describedby` + `aria-invalid`, submit
  feedback announced (`role="status"` on the success block).
- **Contrast**: audit token pairs — `--grey-4 #8B8B92` on white is < 3:1;
  where it carries meaning (form helper text, card descriptions) keep the
  visual design but ensure the same information is available accessibly
  (larger text sizes pass at 3:1 for 18.66px+ bold/24px+ regular — document
  which usages pass and darken only those that fail AND are body-size;
  list every change in the PR since it slightly deviates from the mockup).
- **Motion**: reduced-motion already handled (Prompt 09) — re-verify.
- **Decorative elements** (marquee, watermark, glows, floating logo, arrows):
  `aria-hidden="true"` everywhere the mockup marks them — audit for misses.
- Run `axe` (browser extension or `@axe-core/cli` against the served build)
  on all 5 routes + modal open state; fix every critical/serious issue.

## 5. Coding Standards

No visual regressions — every optimization must be pixel-neutral (compare
before/after screenshots); asset filenames descriptive and lowercase-hyphen;
one-off asset scripts (if written) live in `scripts/` and are committed;
alt text: meaningful images get real alt, decorative get `alt=""`.

## 6. Validation Checklist

- [ ] Zero external image requests except Cloudinary logos + Google Fonts
  (network audit per page).
- [ ] Lighthouse (mobile, throttled, on served `build/`): Performance ≥ 90,
  Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on all five routes —
  attach the numbers to the PR.
- [ ] CLS = 0 on all routes; LCP element is the hero image/headline and
  improves vs the baseline; before/after metrics reported.
- [ ] axe: no critical/serious violations on any route or in the open modal.
- [ ] Keyboard-only full-site walkthrough succeeds (nav → menu → accordion →
  form submit → modal).
- [ ] Visual diff vs pre-prompt screenshots: no perceptible change at
  1440/768/375px.

## 7. Expected Deliverables

Local optimized assets under `public/images/`, updated components/data to use
them, preload/lazy-load/dimension attributes, a11y fixes, any helper script
in `scripts/`, and a PR body with Lighthouse + bundle before/after tables.

## 8. Testing Requirements

Fresh `npm ci && npm run build`; serve `build/` for all audits (dev server
numbers don't count); test on a throttled "Slow 4G + 4× CPU" profile; verify
offline-ish resilience (fonts blocked ⇒ layout still stable via swap).

## 9. Constraints

- No visual redesign; contrast fixes are the only sanctioned pixel deviations
  and must be itemized.
- Logos stay on Cloudinary; fonts stay on Google Fonts.
- No new runtime dependencies (build-time helpers using existing dev deps are
  fine). No changes to lead/admin logic. `/mockup`, `/prompts` untouched.

## 10. Completion Criteria

All page assets are first-party and optimized, Core Web Vitals targets met
with evidence, accessibility audit clean, and the site remains visually
identical to the mockup.

## 11. Report & PR (mandatory)

Branch `dulcey/12-assets-performance`; commit, push, open a **draft PR**.
Report a concise summary (assets migrated, metric tables, a11y fixes,
sanctioned deviations) and the **PR link** (or branch + commit SHAs if PR
creation is unavailable).
