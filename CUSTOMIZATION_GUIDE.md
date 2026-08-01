# Nilachal Infracon — Maintenance Guide

How to keep the Nilachal Infracon website up to date: changing copy, branding,
credentials, and deploying. Written for whoever maintains the site after
launch.

> **Golden rule:** business facts (name, phone, email, address, logos, CIN,
> site URL) live in **`src/data/siteConfig.js`** — the single source of truth.
> Components, the footer, the contact section, and the SEO layer all read from
> it. Never hardcode a phone number or address in a component.

## 1. Changing Site Copy & Content

All structured content lives in `src/data/`. Edit the file, run `npm start` to
check, then rebuild and redeploy.

| File | Drives | Notes |
|------|--------|-------|
| `siteConfig.js` | Company facts, contact details, logo URLs, maps query | Also feeds SEO schemas + helpers `telHref`/`waHref`/`mailHref`/`fullAddress` |
| `productsData.js` | North East Buildmart product categories (`#products`) | Category labels also populate the enquiry form's "Interested In" options |
| `servicesData.js` | Construction & infrastructure services (`#services`) | Service names also populate "Interested In" + the `schema-services` JSON-LD |
| `statsData.js` | Dark metrics band (counters) | Numbers animate via `useCountUp` |
| `brandsData.js` | Partner-brand strip (`#brands`) | Logo files are optional — see `public/images/brands/README.md` |
| `featuresData.js` | Why-choose-us points (`#why-us`) | |
| `aboutData.js` | Welcome + Mission/Vision/Values/Commitment (`#about`) | |
| `faqData.js` | FAQ accordion (`#faq`) | **Must stay in sync** with the static `#schema-faq` block in `public/index.html` (Google requires the FAQPage schema to match the visible FAQs) |
| `locationData.js` | Office + serving states (contact section pills, State dropdown) | Derives contact facts from `siteConfig` |

Section headlines and short paragraphs that aren't data-driven are hardcoded in
the section components under `src/components/sections/`.

**After editing content that appears in schemas** (`siteConfig`, `faqData`,
`servicesData`): mirror the change in the static JSON-LD blocks in
`public/index.html` (see `SEO_GUIDE.md`).

## 2. Brand Colors & Typography

Design tokens live in **`src/styles/variables.css`** and are mirrored in
**`src/theme/muiTheme.js`** (keep the two in sync):

| Token | Value | Use |
|-------|-------|-----|
| `--color-primary` | `#16324F` | Deep steel navy — headings, header, footer |
| `--color-primary-dark` | `#0F2438` | Darkest navy — footer bg, hero scrim |
| `--color-accent` | `#1E7B45` | Nilachal green — CTAs, highlights, links |
| `--color-accent-dark` | `#176437` | CTA hover |
| `--color-accent-tint` | `#E8F5EE` | Light green wash for chips/backgrounds |
| `--color-ink` | `#101C29` | Body headings text |
| `--color-slate` | `#4A5A6A` | Secondary text |
| `--color-bg-subtle` | `#F5F7FA` | Alternating section background |
| `--color-border` | `#E5EAF0` | Thin 1px borders |

Notes:

- Green is used **sparingly** (primary CTAs and key highlights only) — that
  restraint is the design system.
- Legacy alias names (`--accent-gold*` → navy, `--accent-orange*` /
  `--accent-amber*` → green) are kept so older `.module.css` references stay
  valid. Don't delete them.
- Admin panel colors are the separate `--admin-*` block in `variables.css`.
- Typography is **Inter** everywhere (weights 300–800), loaded in
  `public/index.html`.

## 3. Swapping the Logo

1. Upload the new logo (color + white variants) to your CDN/Cloudinary.
2. Update `logo` (light backgrounds) and `logoWhite` (dark backgrounds) in
   `src/data/siteConfig.js` — the header, footer, mobile drawer, and admin
   login all read from there.
3. Update the splash-loader `<img>` and the JSON-LD `logo` URLs in
   `public/index.html` (they are static and set separately).
4. Regenerate favicons/PWA icons and the OG image from the new logo:
   ```bash
   npm run generate:icons   # favicon.ico/png, logo192/512, apple-touch-icon
   npm run generate:og      # og-image.png (1200×630)
   ```
5. Rebuild and redeploy.

## 4. Admin Panel Credentials

Set in `.env` (baked in at build time — rebuild after changing):

```env
REACT_APP_ADMIN_USERNAME="..."
REACT_APP_ADMIN_PASSWORD="..."   # 16+ chars, unique
```

> `.env` is committed in this repo (agency workflow), so treat anything in it
> as exposed: use strong values and **rotate them before/after go-live**.

## 5. Lead Storage (the part that must not break)

Every enquiry is stored server-side by `public/api/leads.php` in a JSON file
(`public/api/data/leads.json` on the server). The admin panel reads/writes only
the server (15-second poll + BroadcastChannel between same-browser tabs), so
every device sees the same leads. There is **no localStorage copy**.

Client configuration (in `.env`):

```env
REACT_APP_LEADS_API_URL="/api/leads.php"
REACT_APP_LEADS_ADMIN_KEY="<long random string>"
```

Server configuration: `REACT_APP_LEADS_ADMIN_KEY` must exactly match the
server's `ADMIN_API_KEY`. The committed fallback key inside `leads.php` already
matches the committed `.env`, so it works out of the box — but for production
you should set your **own private pair**:

1. On the server, copy `public/api/config.example.php` → `public/api/config.php`
   and set:
   ```php
   define('ADMIN_API_KEY', '<long random string>');
   ```
   (Alternatively set a `LEADS_ADMIN_KEY` environment variable in your hosting
   panel — no file needed.)
2. Put the **same value** in `.env` as `REACT_APP_LEADS_ADMIN_KEY`.
3. `npm run build` and redeploy (env values are baked in at build time).

> **Warning — do steps 1–3 together or not at all.** A `config.php` (or server
> env var) **overrides** the built-in key. Creating it without rebuilding the
> client with the matching `REACT_APP_LEADS_ADMIN_KEY` locks the admin panel
> out: every list/update/delete returns **401** ("Refresh failed: Server
> returned 401") on every device, while public submissions keep saving
> invisibly to `api/data/leads.json`. To diagnose, open
> `https://yourdomain/api/leads.php?action=health` — it reports which key
> source the server is using (`config` / `env` / `default`) and whether the
> panel's key matches, without exposing any lead data.

**Do not modify** the `leads.php` request/response contract, the lead record
field keys (`lead_id`, `name`, `mobile`, `email`, `service_interest`, `state`,
`message`, `source`, `status`, `submitted_at`, `updated_at`, `notes[]`,
`activity[]`), or the persisted status keys in `leadStatus.js` — the admin
panel and CSV export bind to them. Labels can change; keys cannot.

## 6. Deploying

### Requirements

- Any **PHP-capable** host (Cloudways, Hostinger, cPanel shared hosting…) —
  PHP 7.4+ with file write permission. Static-only hosts (Netlify/Vercel) can
  serve the site, but then `leads.php` must be hosted separately on a PHP host
  and `REACT_APP_LEADS_API_URL` pointed at its full URL.

### Steps

```bash
npm install
npm run build        # outputs to build/
```

1. Upload the **contents of `build/`** to the web root (e.g. `public_html/`).
   The build already contains `api/leads.php` + `api/config.example.php`
   (copied from `public/`).
2. *(Optional)* Create `api/config.php` on the server with your own private
   `ADMIN_API_KEY` — **only** together with the matching rebuild (section 5).
   Skipping this step is fine: the built-in key pair works out of the box.
   Never commit a real private key to git.
3. Verify `api/data/` is **writable** by PHP — `leads.php` creates it on first
   run (with an `.htaccess` deny) — and that
   `https://yourdomain/api/data/leads.json` is **not** downloadable
   (should return 403). On Nginx, deny the location yourself:
   `location ^~ /api/data/ { deny all; }`.
4. Submit a test enquiry, confirm it appears in `/admin`, then delete it.

### SPA redirect rules (required for `/thank-you` and `/admin`)

Client-side routes 404 on direct access unless all paths serve `index.html`:

- **Apache/cPanel** — `.htaccess` in the web root:
  ```apache
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
  ```
  (The `!-f` condition keeps `/api/leads.php` reachable.)
- **Nginx** — `try_files $uri /index.html;` (plus the `/api/` PHP location block).
- **Netlify** — `_redirects` file: `/*  /index.html  200` (API hosted elsewhere).
- **Vercel** — automatic for CRA (API hosted elsewhere).

### Post-deploy checklist

- [ ] Site loads at the domain; all sections render
- [ ] Enquiry form submits → lead visible in `/admin` from another device
- [ ] Status change in admin persists after refresh
- [ ] `/thank-you` and `/admin` load on direct URL access (SPA redirect works)
- [ ] `api/data/leads.json` not publicly downloadable
- [ ] Run the **post-launch SEO checklist** in `SEO_GUIDE.md` (Search Console
      verification + sitemap submission)

## 7. Quick Reference

| What to change | Where |
|----------------|-------|
| Company/contact facts, logos | `src/data/siteConfig.js` (+ static blocks in `public/index.html`) |
| Products / services / FAQs / stats / brands | `src/data/*.js` |
| Brand colors | `src/styles/variables.css` + `src/theme/muiTheme.js` |
| Admin credentials | `.env` (rebuild required) |
| Leads API endpoint + key | `.env` ↔ `public/api/config.php` |
| SEO meta/schemas | `src/config/seo.js` + `public/index.html` (see `SEO_GUIDE.md`) |
| Sitemap/robots | `public/sitemap.xml`, `public/robots.txt` |
| Favicons / OG image | `npm run generate:icons` / `npm run generate:og` |
