# Prompt 01 — Brand Foundation & Configuration (Nilachal → Dulcey)

## 1. Objective

Re-point the repository's **identity layer** from Nilachal Infracon to Dulcey Lead
Services: business facts (`siteConfig`), package metadata, environment variables
and secrets (rotated), design tokens, MUI theme, fonts, and the `index.html`
splash — **without changing page structure yet**. After this prompt the app still
renders the old Nilachal layout, but every color, font, logo, and business fact
already belongs to Dulcey, and all later prompts can build on the tokens.

## 2. Background

- The repo is a CRA (react-scripts 5) React 18 app, previously the Nilachal
  Infracon one-pager. The final Dulcey site is defined by the static mockup in
  `/mockup` (5 pages, single `styles.css`).
- `src/data/siteConfig.js` is the single source of business truth; components
  import contact facts from it. `src/styles/variables.css` +
  `src/theme/muiTheme.js` define the design system. `.env` is **committed** in
  this repo (agency workflow) — secrets in it are treated as versioned and must
  be rotated now for the new brand.
- The lead API (`public/api/leads.php`) resolves its admin key as:
  `config.php` override → environment variable → **committed fallback constant**
  which must equal `REACT_APP_LEADS_ADMIN_KEY` in `.env`. Rotating the key means
  changing **both together**.
- Dulcey canonical facts (from the mockup — copy exactly):
  - Brand/legal name: **Dulcey Lead Services**
  - Tagline: **Beyond Business Support** · secondary: **Your Partner in Business Leadership**
  - Phone: **+91 70990 02522** (`tel:+917099002522`)
  - Email: **dulceyleadservices@gmail.com**
  - Site URL: **https://www.dulceyleadservices.com**
  - Logos (Cloudinary): color `.../v1785682949/Dulcey-Logo_tmkfku.png`, white
    `.../v1785682948/Dulcey-Logo-White_pthxu2.png`, icon
    `.../v1785484838/Dulecy-Logo-Icon_hylrpw.png` — the icon's public_id keeps
    the old spelling because it is the asset's live delivery path (base
    `https://res.cloudinary.com/dn9gyaiik/image/upload`)
  - No physical address, no WhatsApp, and no CIN appear anywhere in the mockup.

## 3. Files/Folders to Inspect First

- `mockup/styles.css` (lines 1–20: the `:root` token block — the design system)
- `mockup/index.html` (head: font links; footer: brand copy)
- `src/data/siteConfig.js` · `src/styles/variables.css` · `src/theme/muiTheme.js`
- `src/styles/global.css` · `src/App.css` · `src/index.js`
- `.env` · `.env.example` · `public/api/leads.php` (key fallback ~line 121) ·
  `public/api/config.example.php`
- `package.json` · `public/manifest.json` · `public/index.html` (font links,
  splash loader, theme-color)
- Grep `waHref\|whatsapp` in `src/` to see which consumers still rely on
  WhatsApp fields (they must keep compiling until Prompt 02 removes the UI).

## 4. Exact Implementation Instructions

### 4.1 `src/data/siteConfig.js`

Rewrite values, **keeping the module's export shape** (`siteConfig`, `telHref`,
`waHref`, `mailHref`, `fullAddress`) so existing imports keep compiling:

- `legalName` & `brandName`: `'Dulcey Lead Services'`; remove `flagshipBrand`
  only if no file imports it (otherwise set it to `'Dulcey Lead Services'` and
  leave a `// retired in Prompt 11` note).
- `tagline: 'Beyond Business Support'`; add
  `taglineSecondary: 'Your Partner in Business Leadership'`.
- `phone: '+917099002522'`, `phoneDisplay: '+91 70990 02522'`,
  `email: 'dulceyleadservices@gmail.com'`.
- `siteUrl: 'https://www.dulceyleadservices.com'`; `logo`/`logoWhite` → the Dulcey
  Cloudinary URLs above; add `logoIcon` for the icon mark.
- Remove `cin` and `mapsQuery`; set `address` fields to empty strings (helper
  `fullAddress` already skips empties). Set `whatsapp` to the Dulcey phone and
  keep `whatsappMessage` generic — the WhatsApp UI is deleted in Prompt 02 and
  these fields in Prompt 11; for now they only need to compile.

### 4.2 Secrets & env (rotate everything)

- `.env` and `.env.example`: `REACT_APP_ADMIN_USERNAME="dulecyadmin"`;
  `REACT_APP_ADMIN_PASSWORD` → generate a fresh 16+ char value in `.env`, keep
  it blank in `.env.example`. Keep `REACT_APP_LEADS_API_URL="/api/leads.php"`.
- Generate a **new** 48-char random `REACT_APP_LEADS_ADMIN_KEY` and set it in
  `.env`; update the committed fallback string in `public/api/leads.php`
  (`$adminKey = '...'` around line 121) to the **identical** value. Update the
  header comments in both files and in `public/api/config.example.php` to say
  "Dulcey Lead Services" instead of Nilachal. Do not change any other logic in
  `leads.php`.

### 4.3 `package.json` & `public/manifest.json`

- `name: "dulcey-lead-services-website"`, description "Dulcey Lead Services —
  multi-page business-consulting website (React 18 + MUI + GSAP) with lead
  management admin panel.", keywords (dulcey, lead-services,
  business-consulting, hr, business-analytics, admin-panel, lead-generation),
  author unchanged unless instructed. Do not touch dependencies/scripts.
- Manifest: `short_name: "Dulcey"`, `name: "Dulcey Lead Services"`,
  `theme_color: "#0B0B0C"`, `background_color: "#FFFFFF"` (icon files are
  regenerated in Prompt 10).

### 4.4 Design tokens — `src/styles/variables.css`

Make the mockup's system canonical while keeping legacy variable names alive as
aliases (existing `.module.css` files reference them until their components are
rebuilt/deleted):

- Add the Dulcey set exactly: `--ink:#0B0B0C; --grey-1:#2A2A2E;
  --grey-2:#4A4A4F; --grey-3:#6B6B70; --grey-4:#8B8B92; --line:#E7E7EA;
  --bg-grey:#F5F5F6; --red:#D5192E; --red-hi:#F0293E;
  --grad:linear-gradient(135deg,#E8293E 0%,#A80E1E 100%);
  --grad-text:linear-gradient(120deg,#E8293E,#A80E1E);`
- Re-point the legacy tokens to Dulcey values: `--color-primary`/`-dark`/
  `-light` → ink shades (`#0B0B0C`/`#0B0B0C`/`#2A2A2E`), `--color-accent` →
  `#D5192E`, `--color-accent-dark` → `#A80E1E`, `--color-accent-tint` →
  `#FDECEE` (light red wash), `--color-ink` → `#0B0B0C`, `--color-slate` →
  `#4A4A4F`, `--color-bg-subtle` → `#F5F5F6`, `--color-border` → `#E7E7EA`.
  Update every other alias family (gold/orange/amber legacy names) to the
  corresponding Dulcey value so nothing renders navy/green anymore.
- Update the `--admin-*` block: `--admin-primary:#0B0B0C`,
  `--admin-accent:#D5192E`, bg `#F5F5F6`, cards white with `#E7E7EA` borders;
  keep the existing soft shadow token.
- Update font-family variables to `'Archivo', system-ui, sans-serif` and add
  `--font-serif: 'Instrument Serif', serif`.

### 4.5 MUI theme — `src/theme/muiTheme.js`

Mirror the tokens: `palette.primary.main #0B0B0C`, `palette.secondary/accent
#D5192E`, error/success unchanged, text primary `#0B0B0C` secondary `#4A4A4F`,
divider `#E7E7EA`. Keep the existing custom palette keys (`orange`, `accent`,
`navy`, …) as aliases mapped to Dulcey values because `sx` props reference
them. Typography: `fontFamily: "'Archivo', system-ui, sans-serif"`; keep the
type scale, letter-spacing `-0.02em`–`-0.035em` on headings per the mockup.
Buttons: pill radius `999px`, no text-transform.

### 4.6 Fonts & splash — `public/index.html`, `src/styles/global.css`, `src/App.css`

- Replace the Inter Google-Fonts links (both the preload pattern and the
  fallback `<link>`) with the mockup's:
  `https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap`
  (keep preconnects to `fonts.googleapis.com`/`fonts.gstatic.com`).
- Update every `font-family` in `index.html` inline styles, `global.css`,
  `App.css` from Inter/Poppins to Archivo; `::selection` → background
  `var(--red)`, color `#fff`; body color `var(--ink)`.
- Splash loader: swap the logo `src` to the Dulcey **icon** logo, keep the
  hide-on-mount mechanism (`#initial-loader`) intact; spinner/accent colors →
  red.
- `<title>` → `Dulcey Lead Services — Beyond Business Support`;
  `<meta name="theme-color">` → `#0B0B0C`. (Full head/SEO rewrite is
  Prompt 10 — here just stop the old brand from flashing.)

## 5. Coding Standards

- Never hard-code hex brand colors in JS/JSX — reference tokens or theme keys.
- Keep comments in rewritten files accurate (no leftover "Nilachal" wording in
  the files you touch).
- Preserve existing file structure and export names; this prompt is a values
  swap, not a refactor.

## 6. Validation Checklist

- [ ] `grep -ri "nilachal" src/data/siteConfig.js src/styles/variables.css src/theme/muiTheme.js public/manifest.json package.json .env .env.example public/api/config.example.php public/index.html` returns nothing.
- [ ] `.env` `REACT_APP_LEADS_ADMIN_KEY` === the fallback constant in `public/api/leads.php` (string-compare them).
- [ ] `waHref`, `telHref`, `mailHref`, `fullAddress` still export and compile.
- [ ] Legacy CSS variable names still resolve (spot-check a section `.module.css` in DevTools — colors are now red/ink, not green/navy).
- [ ] Fonts panel in DevTools shows Archivo rendering body text; no Inter/Poppins requests.

## 7. Expected Deliverables

Modified: `src/data/siteConfig.js`, `.env`, `.env.example`,
`public/api/leads.php` (fallback key + comments only),
`public/api/config.example.php`, `package.json`, `public/manifest.json`,
`src/styles/variables.css`, `src/theme/muiTheme.js`, `src/styles/global.css`,
`src/App.css`, `public/index.html` (fonts/splash/title/theme-color only).
No files created or deleted.

## 8. Testing Requirements

- `npm ci` (if needed) then `npm run build` — must pass with zero new warnings.
- `npm start`: home page renders (still Nilachal layout) with Dulcey logo in
  header/splash, Archivo type, red CTAs; `/admin/login` accepts the **new**
  credentials and rejects the old ones.
- With the dev server running, `curl -s "http://localhost:3000/api/leads.php?action=health"`
  is not servable under CRA (PHP doesn't execute) — instead verify the key pair
  by string comparison per checklist above and note this limitation in the PR.

## 9. Constraints

- Do NOT restructure pages, routes, or components in this prompt.
- Do NOT touch: `public/api/leads.php` logic (only the fallback constant +
  comments), lead record keys, status keys, admin sync code, `/mockup`,
  `/prompts`.
- Do NOT remove the WhatsApp fields/helpers yet (consumers still compile
  against them until Prompt 02/11).

## 10. Completion Criteria

App builds and runs with Dulcey identity (facts, tokens, fonts, logos,
credentials) everywhere the old identity was configured, old admin credentials
and admin key no longer work, and no Nilachal string remains in the files this
prompt owns.

## 11. Report & PR (mandatory)

Work on branch `dulcey/01-brand-foundation`, commit with clear messages, push,
and open a **draft PR**. End your run with: (a) a concise implementation
summary (what changed, key rotation confirmation, any deviations), and (b) the
**PR link** — or the branch + commit SHAs if PR creation is unavailable.
