# Prompt 13 — Documentation Rewrite (README, CLAUDE.md, Guides, Changelog)

## 1. Objective

Replace every project document written for Nilachal Infracon with accurate
Dulcey Lead Services documentation that reflects the rebuilt codebase — so a
new developer (or a future Claude Code session) can work from the docs alone.

## 2. Background

- The five root docs are still Nilachal-era: `README.md` (overview/quick
  start/routes/env), `CLAUDE.md` (project instructions for Claude Code —
  the most important file to get right), `CHANGELOG.md` (old rebuild
  history), `CUSTOMIZATION_GUIDE.md`, `SEO_GUIDE.md`. Prompt 11 deliberately
  excluded them from the purge.
- By now the codebase is: five public routes + admin, Dulcey design tokens,
  data layer (`siteConfig`, `navigation`, `expertiseData`, `industriesData`),
  GSAP animation foundation (+ `useHeroIntro`, `useLineReveal`), lead modal +
  unified form with the `organization` field, PHP JSON lead store with
  rotated keys, rebuilt SEO (Organization/WebSite/WebPage/Breadcrumb/Services
  schemas, five-URL sitemap), self-hosted assets, admin panel with
  Organization column and "Proposal Sent" label. Verify each fact against the
  code while writing — the code is the truth, not this summary.
- `/prompts` (this folder) is the rebuild record and must be referenced as
  such; `/mockup` is the design source of truth and stays.

## 3. Files/Folders to Inspect First

- All five root docs (structure to mirror), `prompts/README.md` (series
  conventions to cite), `package.json` (scripts to document), `.env` /
  `.env.example`, `public/api/leads.php` + `config.example.php`,
  `src/` tree (routes, data files, animations, admin), the Guideline tab
  content from Prompt 08 (keep docs consistent with it).

## 4. Exact Implementation Instructions

### 4.1 `README.md`

Rewrite for Dulcey: what the site is (multi-page business-consulting site for
Dulcey Lead Services matching `/mockup`); tech stack; quick start (`npm ci`,
`npm start`, `npm run build`, icon/OG scripts); **route table** (5 public +
admin routes + NotFound); project structure tree (post-purge reality); env
variable reference table (`REACT_APP_ADMIN_USERNAME`, `REACT_APP_ADMIN_PASSWORD`,
`REACT_APP_LEADS_API_URL`, `REACT_APP_LEADS_ADMIN_KEY` — with the
"committed .env, rotate before launch" caveat and the `ADMIN_API_KEY`
pairing); lead-store overview + local PHP testing tip
(`php -S localhost:8080 -t public`); links to the other guides and to
`/prompts`.

### 4.2 `CLAUDE.md` (project instructions — highest care)

Mirror the old file's proven structure, fully re-grounded in Dulcey:

- **Overview** — Dulcey Lead Services, five-page site, mockup provenance
  (`/mockup` = design contract; `/prompts` = rebuild record; "rebuild
  complete" note).
- **Business Facts** (single source of truth block): brand name, tagline +
  secondary tagline, phone `+91 70990 02522`, email
  `dulceyleadservices@gmail.com`, site URL `https://www.dulceyleadservices.com`,
  the three Cloudinary logo URLs.
- **Project Structure** — accurate current tree with one-line purposes.
- **Lead Storage & Sync** — the full contract prose (action API, key
  resolution order and rotation coupling, header + fallback auth,
  `no-store`, health diagnostic, dedupe rules, append-only merges,
  15 s poll + BroadcastChannel, no-localStorage rule).
- **Enquiry Form** — field → key mapping table including `organization`
  (new, optional) and the retired-but-reserved `state` key; prefill flow
  (`openLeadModal(source, { service_interest })`); inline success behavior.
- **Admin Panel** — shell/pages, the frozen status-key table with current
  Dulcey labels, guideline hub + its password's location.
- **Design System** — Dulcey token table (ink/greys/line/bg-grey/red/red-hi/
  gradients), Archivo + Instrument Serif, 1280px container, 68px header,
  920px menu breakpoint, pill buttons.
- **Animations** — foundation + hooks with the mockup-exact parameter table
  from Prompt 09.
- **SEO** — dual-layer system, schema inventory, "no FAQ/LocalBusiness
  without visible counterpart" rule, sitemap scope.
- **Customization Guide** pointers and a **DO NOT MODIFY** section carrying
  forward: leads.php contract + auth model, admin sync pattern, lead record
  field keys (now including `organization` in the protected list), status
  value keys.

### 4.3 `CHANGELOG.md`

Start fresh: `[2.0.0]` — "Dulcey Lead Services rebuild" with a dated summary
of the migration (one bullet block per prompt phase 01–14, concise). Remove
the Nilachal `[1.0.0]` narrative (git history preserves it); state that
explicitly at the top ("history prior to 2.0.0 lives in git").

### 4.4 `CUSTOMIZATION_GUIDE.md`

Rewrite: how to change copy (data files vs page components), add/edit an
expertise area end-to-end (data → accordion → home rows → form options →
schema), add an industry card, change contact facts (siteConfig + .env
touchpoints), tokens/theme changes, logo swap, adding a page (route + nav +
SEO config + sitemap), admin credential/key rotation runbook.

### 4.5 `SEO_GUIDE.md`

Rewrite for the Prompt 10 system: layer diagram, per-page config location,
schema list + validators, icon/OG regeneration steps, robots/sitemap
maintenance, post-launch checklist (Search Console, submit sitemap, verify
canonicals/OG, monitor CWV) targeted at `https://www.dulceyleadservices.com`.

## 5. Coding Standards

Docs must describe the code as it **is** (verify every path, script, env name,
route, and table against the repo before writing); consistent Markdown style
(headings, tables like the existing docs); no marketing fluff; keep each doc
focused (no duplication — link between them); wrap at a consistent width
matching the existing docs.

## 6. Validation Checklist

- [ ] Every file path, route, script name, env var, and token value mentioned
  in any doc exists and is spelled correctly (spot-check by grep).
- [ ] `grep -riE "nilachal|infracon|buildmart|nagaon" *.md` (repo root) → 0
  hits — this completes the doc side of the purge.
- [ ] A fresh reader can: run the app, submit a test lead, log into admin,
  find where to change the phone number, and rotate the admin key — using
  docs alone (walk each flow yourself against the docs).
- [ ] CLAUDE.md "DO NOT MODIFY" contracts match the actual code contracts.
- [ ] Changelog `[2.0.0]` entries correspond to the actual merged prompt PRs.

## 7. Expected Deliverables

Rewritten `README.md`, `CLAUDE.md`, `CHANGELOG.md`, `CUSTOMIZATION_GUIDE.md`,
`SEO_GUIDE.md`. No code changes (except fixing a doc-revealed typo-level bug,
which must be called out separately in the PR if it happens).

## 8. Testing Requirements

`npm run build` still green (guards against accidental code edits); markdown
renders correctly on GitHub (preview each file); all intra-repo doc links
resolve.

## 9. Constraints

- Documentation only — no application/source changes.
- Do not modify `/prompts` (beyond nothing — it is the historical plan) or
  `/mockup`.
- Do not print real secret values in docs — reference variable names and
  where they live instead (`.env` is committed, but docs shouldn't
  double-publish credentials).

## 10. Completion Criteria

All five root documents accurately describe the Dulcey codebase, contain no
Nilachal references, and are sufficient to onboard a developer or a future
Claude Code session without reading the git history.

## 11. Report & PR (mandatory)

Branch `dulcey/13-documentation`; commit, push, open a **draft PR**. Report a
concise summary (docs rewritten, discrepancies found while verifying against
code) and the **PR link** (or branch + commit SHAs if PR creation is
unavailable).
