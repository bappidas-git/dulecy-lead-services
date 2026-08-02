# Prompt 11 — Nilachal Purge & Repository Cleanup

## 1. Objective

Delete every file, component, data module, asset, dependency, and string that
belonged to the Nilachal Infracon site and is no longer used by the Dulcey
build — leaving `src/` and `public/` clean, with **zero** Nilachal references
outside `/mockup`, `/prompts`, and git history.

## 2. Background

Prompts 02–10 rebuilt the app but deliberately left retired files on disk so
each phase stayed green. This prompt is the sweep. Files known to be retired
(verify each is truly unreferenced before deleting — the import graph is the
authority, not this list):

- **Old one-pager sections** — `src/components/sections/` entirely
  (`HeroSection`, `AboutSection`, `ProductsSection`, `ServicesSection`,
  `StatsSection`, `BrandsSection`, `WhyUsSection`, `FAQSection`,
  `ContactSection`).
- **Old mobile/floating UI** — `src/components/common/MobileNavigation/`,
  `src/components/common/MobileDrawer/`, plus any WhatsApp FAB /
  scroll-progress / back-to-top leftovers in `App.css`.
- **Old enquiry UI** — `src/components/common/LeadFormDrawer/` (replaced by
  `LeadModal` in Prompt 07).
- **Old pages** — `src/pages/ThankYou/` (route removed in Prompt 07).
- **Old data files** — `productsData.js`, `servicesData.js`, `statsData.js`,
  `brandsData.js`, `featuresData.js`, `aboutData.js`, `faqData.js`,
  `locationData.js` (Dulcey uses `siteConfig`, `navigation`, `expertiseData`,
  `industriesData`).
- **Old assets** — `public/images/brands/` (partner-brand strip images/README).
- **siteConfig leftovers** — `whatsapp`, `whatsappMessage`, `waHref`,
  `flagshipBrand`, empty `address`/`fullAddress` if now unused (keep helpers
  that still have consumers).
- **Legacy CSS aliases** — the navy/green alias variable families in
  `variables.css` kept alive for old modules; once those modules are gone,
  collapse to the clean Dulcey token set (update any straggler references).
- **Docs are NOT in scope** — `README.md`, `CLAUDE.md`, `CHANGELOG.md`,
  `CUSTOMIZATION_GUIDE.md`, `SEO_GUIDE.md` still mention Nilachal and are
  rewritten in Prompt 13. Exclude them from this prompt's grep gate.

## 3. Files/Folders to Inspect First

- Build the reference graph before deleting: for each candidate, `grep -rn
  "<ModuleName>\|<file-basename>" src/ public/ scripts/ package.json` and
  confirm zero imports/usages (excluding the candidate itself).
- `src/utils/swalHelper.js` and deps `sweetalert2`, `@iconify/react`,
  `framer-motion` — grep usage; admin may still legitimately use some
  (see 4.3).
- `src/hooks/useMediaQuery.js`, `src/context/ThemeContext.jsx` — keep only if
  still imported.
- `.env`, `.env.example`, `public/api/config.example.php` — comment sweeps.

## 4. Exact Implementation Instructions

1. **Verify-then-delete** each candidate group above with `git rm`. If
   something is still imported, either the import is a leftover to remove with
   it (e.g. an unused re-export) or the file is genuinely still needed — in
   that case keep it and record why in the PR.
2. **Dependency prune** — for each of `framer-motion`, `@iconify/react`,
   `sweetalert2`: if zero imports remain after the file deletions, remove from
   `package.json` and run an install to update the lockfile. If admin
   confirmation dialogs still use sweetalert2 (via `swalHelper`), keep both
   and restyle check only. Never remove `sharp`/`png-to-ico` (icon scripts) or
   anything the build still needs.
3. **CSS collapse** — remove dead legacy alias variables and any
   `.module.css` rules that referenced deleted components; re-check every
   remaining `var(--…)` resolves.
4. **String sweep** — fix stragglers in comments/labels/aria/test ids across
   `src/`, `public/`, `scripts/`: run
   `grep -rniE "nilachal|infracon|buildmart|nagaon|assam|8638543526|nilachalinfracon" src public scripts package.json .env .env.example`
   and drive it to **zero hits** (docs excluded per Background; `assam` may
   appear only if a legitimate Dulcey string contains it — it should not).
   Also grep the old logo slugs (`nilachal-logo`) and the old admin username.
5. **Dead-code pass** — remove now-unused exports from `validators.js`,
   `webhookSubmit.js` comments referring to Pabbly/old flows, unused
   animation hooks (`useCountUp` if nothing counts up on Dulcey pages — check
   first), and any `SectionLoader` variants no longer referenced.
6. **Sanity build & route walk** — after deletions: `npm run build`, then load
   every route (5 public + NotFound + `/admin/*` incl. login, dashboard, lms,
   lead detail, guideline) and exercise the enquiry modal + a submission.

## 5. Coding Standards

Deletions via `git rm` (history preserves everything — no `_old` copies, no
commented-out blocks); one logical commit per group (sections / data / deps /
css / strings) so review is tractable; lockfile updated in the same commit as
`package.json`.

## 6. Validation Checklist

- [ ] The grep gate in 4.4 returns zero hits (excluding `/mockup`, `/prompts`,
  the five root docs, and `package-lock.json` history noise — after the
  dependency prune the lockfile must also be free of removed packages).
- [ ] `npm run build` green with **no** "unused" warnings introduced; bundle
  size dropped (report before/after from the build output).
- [ ] All routes render; enquiry modal opens from every entry point; a test
  lead submits; admin lists it.
- [ ] No image/network request on any page fetches a Nilachal asset
  (DevTools network audit: filter `nilachal`, `buildmart`).
- [ ] `src/components/sections/`, `MobileNavigation`, `MobileDrawer`,
  `LeadFormDrawer`, `ThankYou`, retired data files, `public/images/brands/`
  no longer exist.

## 7. Expected Deliverables

Deletions + pruned `package.json`/lockfile + collapsed `variables.css` +
string fixes; a PR body listing every deleted path and every dependency
removed/kept (with the keep-reason).

## 8. Testing Requirements

Full manual route/interaction walk (list in 4.6); `npm run build` before/after
size comparison; fresh `npm ci && npm run build` from a clean clone of the
branch to prove no phantom dependency.

## 9. Constraints

- **Never delete or edit:** `public/api/leads.php` (beyond earlier prompts'
  state), `public/api/config.example.php` (comment fixes only), `.gitignore`
  entries for `config.php`/`api/data/`, anything under `src/admin/` that
  functions, `/mockup`, `/prompts`.
- Do not rewrite the five root docs (Prompt 13).
- If uncertain whether something is used — keep it and flag it in the PR
  rather than breaking the build.

## 10. Completion Criteria

The repository contains only code the Dulcey site uses; the grep gate is
zero; the build is green and every user-facing flow still works.

## 11. Report & PR (mandatory)

Branch `dulcey/11-purge-cleanup`; commit, push, open a **draft PR**. Report a
concise summary (deleted paths, pruned deps, bundle delta, grep-gate proof)
and the **PR link** (or branch + commit SHAs if PR creation is unavailable).
