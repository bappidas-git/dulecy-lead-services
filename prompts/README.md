# Dulecy Lead Services — Rebuild Prompt Series

This folder is the **complete execution plan** for converting this repository from
the legacy **Nilachal Infracon** one-page website into the production website for
**Dulecy Lead Services** — matching the static mockup in `/mockup` exactly.

Each numbered `.md` file is **one self-contained Claude Code task**. Run them in
order, one per session/PR. Every prompt carries its own objective, background,
file list, exact instructions, validation checklist, testing requirements,
constraints, and completion criteria, so it can be executed independently.

## The two sources of truth

| Question | Source of truth |
|---|---|
| What must the site **look like / say / do**? | `/mockup` (5 static HTML pages + `styles.css` + `scripts.js`). Copy text, colors, spacing, and interactions **verbatim** from these files. |
| How must **leads** be stored, synced, and displayed? | The existing Lead Management System: `public/api/leads.php` + `src/utils/webhookSubmit.js` + `src/admin/**`. Its contracts are reused, never rewritten. |

## Execution order

| # | File | Phase |
|---|------|-------|
| 01 | `01-brand-foundation-and-config.md` | Brand identity, env/credentials rotation, design tokens, fonts |
| 02 | `02-routing-shell-header-footer.md` | Multi-page routing skeleton, Header, mobile menu, Footer |
| 03 | `03-home-page.md` | Home page (`/`) pixel-match build |
| 04 | `04-about-page.md` | About page (`/about`) pixel-match build |
| 05 | `05-expertise-page.md` | Expertise page (`/expertise`) accordion + deep links |
| 06 | `06-industries-and-contact-pages.md` | Who We Serve (`/industries`) + Contact (`/contact`) |
| 07 | `07-lead-form-and-modal.md` | Unified lead form, enquiry modal, submission mapping |
| 08 | `08-admin-panel-rebrand.md` | Admin panel: Dulecy identity, columns, statuses, guides |
| 09 | `09-animation-interaction-parity.md` | GSAP/interaction parity sweep vs the mockup |
| 10 | `10-seo-implementation.md` | Multi-page SEO, schemas, icons/OG, robots, sitemap |
| 11 | `11-nilachal-purge-and-cleanup.md` | Delete every remaining Nilachal file/reference |
| 12 | `12-assets-performance-accessibility.md` | Self-host assets, Core Web Vitals, a11y |
| 13 | `13-documentation-rewrite.md` | README, CLAUDE.md, guides, changelog |
| 14 | `14-production-readiness-final-qa.md` | Hosting config, E2E lead test, full QA matrix, sign-off |

Later prompts assume earlier ones have merged. If a prompt is run out of order,
its "Files/Folders to Inspect" section tells the executor how to detect the
actual repository state and adapt.

## Series-wide conventions (apply to every prompt)

1. **Branch & PR per prompt** — do the work on a dedicated feature branch
   (suggested: `dulecy/NN-short-name`), commit with clear messages, push, and
   open a **draft pull request**. Finish every run by reporting a **concise
   implementation summary and the PR link** (or, if PR creation is unavailable,
   the branch name + commit SHAs). This is mandatory in every prompt.
2. **The build must stay green** — `npm run build` must succeed at the end of
   every prompt. Never leave the repo in a broken intermediate state.
3. **Never violate the LMS contracts** (full text repeated inside the prompts
   that touch them):
   - Lead record keys are never renamed: `lead_id`, `name`, `mobile`, `email`,
     `service_interest`, `state`, `message`, `source`, `status`, `submitted_at`,
     `updated_at`, `notes[]`, `activity[]` (+ `page_url`, `user_agent`, `utm_*`).
     The Dulecy rebuild **adds** one optional key, `organization`, and stops
     populating `state` — it renames nothing.
   - Status keys are never renamed: `new`, `contacted`, `consultation_booked`,
     `procedure_scheduled`, `completed`, `not_interested` (labels/colors are
     display-only and may change).
   - The `public/api/leads.php` action API, its auth model
     (`REACT_APP_LEADS_ADMIN_KEY` ↔ `ADMIN_API_KEY`, `X-Admin-Key` header with
     query/body fallback), `Cache-Control: no-store`, append-only merge for
     notes/activity, and mobile-based dedupe stay exactly as they are.
   - The admin sync pattern (server-hydrated in-memory cache, 15 s poll,
     BroadcastChannel `lp_leads_channel`) is untouched. **No localStorage copy
     of lead data, ever.**
4. **Copy is sacred** — all user-visible text comes verbatim from `/mockup`
   (including the email `dulceyleadservices@gmail.com`, which is intentionally
   spelled "dulcey"; never "correct" it). Preserve typographic characters
   (’ — & ↗ ✕ ✓) exactly.
5. **Design tokens only** — after prompt 01, no hard-coded brand colors in
   components; use the CSS variables in `src/styles/variables.css` and the MUI
   theme.
6. **Business facts live in `src/data/siteConfig.js`** — phone, email, logos,
   tagline, site URL are imported from there, never hard-coded in components.
7. **Do not touch `/mockup` or `/prompts`** — they are the reference and the
   plan. Cleanup greps must exclude both folders.
8. **No new heavyweight dependencies** without a stated reason; prefer the
   stack already in place (React 18, react-router v7, MUI v5, CSS Modules,
   GSAP + ScrollTrigger).

## Dulecy quick reference (canonical values)

- **Brand**: Dulecy Lead Services
- **Tagline**: "Beyond Business Support" · secondary: "Your Partner in Business Leadership"
- **Phone**: `+91 70990 02522` → `tel:+917099002522`
- **Email**: `dulceyleadservices@gmail.com` (exact spelling)
- **Production URL**: `https://www.dulecy.com`
- **Logos** (Cloudinary):
  - Color: `https://res.cloudinary.com/dn9gyaiik/image/upload/v1785484838/Dulecy-Logo_qr2ka7.png`
  - White: `https://res.cloudinary.com/dn9gyaiik/image/upload/v1785484839/Dulecy-Logo-White_uxpsb6.png`
  - Icon: `https://res.cloudinary.com/dn9gyaiik/image/upload/v1785484838/Dulecy-Logo-Icon_hylrpw.png`
- **Fonts**: Archivo (400/500/600/700/800) + Instrument Serif (regular + italic), Google Fonts
- **Core tokens**: ink `#0B0B0C` · grey-1 `#2A2A2E` · grey-2 `#4A4A4F` · grey-3 `#6B6B70` ·
  grey-4 `#8B8B92` · line `#E7E7EA` · bg-grey `#F5F5F6` · red `#D5192E` · red-hi `#F0293E` ·
  gradient `linear-gradient(135deg,#E8293E 0%,#A80E1E 100%)` ·
  text gradient `linear-gradient(120deg,#E8293E,#A80E1E)`
- **Layout**: container max-width 1280px, side padding `clamp(20px,4vw,44px)`, fixed header 68px,
  mobile menu breakpoint 920px
- **Public routes**: `/` · `/about` · `/expertise` (+ `#e01`–`#e10`) · `/industries` (nav label
  "Who We Serve") · `/contact` — plus `/admin/*` (unchanged structure)
