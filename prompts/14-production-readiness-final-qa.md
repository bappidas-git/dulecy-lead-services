# Prompt 14 — Production Readiness & Final QA Sign-Off

## 1. Objective

Close out the rebuild: hosting/deployment configuration for an
Apache/PHP-style host (SPA rewrites that protect `/api`), a full end-to-end
lead test, the complete QA matrix against `/mockup`, the final
zero-Nilachal verification, and a written go-live checklist. This prompt
produces the evidence that the site is ready for `https://www.dulecy.com`.

## 2. Background

- The app is a CRA SPA with client-side routes (`/`, `/about`, `/expertise`,
  `/industries`, `/contact`, `/admin/*`) **plus a real server endpoint**
  `public/api/leads.php` and its runtime-created `public/api/data/` store
  (protected by a generated deny-all `.htaccess`; both `config.php` and
  `api/data/` are gitignored). Deep-linking any route on an Apache host
  requires a rewrite to `index.html` that must **never** swallow `/api/*`
  (rewriting it would silently break lead capture — the form would receive
  index.html instead of JSON).
- Key handshake at deploy time: if the live server has a
  `public/api/config.php`, its `ADMIN_API_KEY` **overrides** the committed
  fallback — a mismatch with the built `REACT_APP_LEADS_ADMIN_KEY` 401s every
  admin call while public submissions keep saving. This exact failure
  happened on a previous deploy of this codebase; the checklist below
  institutionalizes the fix.
- All prior prompts (01–13) are assumed merged. If any is missing, stop and
  report instead of papering over.

## 3. Files/Folders to Inspect First

- `public/` (confirm no `.htaccess` exists yet at build root), `.gitignore`,
  `public/api/leads.php` (health action), `.env` (final values),
  `package.json` (build scripts), `prompts/README.md` (conventions + QA
  expectations), `/mockup` (final visual reference), all five root docs
  (deployment sections must match what you configure here).

## 4. Exact Implementation Instructions

### 4.1 Hosting configuration

- Add `public/.htaccess` (CRA copies it into `build/`):
  1. `RewriteEngine On`; serve existing files/dirs as-is; **exclude
     `^api/` from rewriting**; rewrite everything else to `/index.html`.
  2. Long-lived immutable caching for `/static/**` (hashed) and
     `/images/**`; no-cache for `index.html`; (the API already sends
     `no-store` itself).
  3. Basic hardening: `Options -Indexes`; block dotfiles.
- Verify the generated `build/` locally with an Apache-equivalent: if PHP is
  available, `php -S localhost:8080 -t build` covers the API but not
  rewrites — additionally test rewrites with any static server that honors
  fallback (`npx serve -s build`) and document that `/api` passthrough was
  verified on the PHP server. State exactly what was and wasn't verifiable
  locally in the PR.

### 4.2 End-to-end lead test (the critical path)

Run against the local PHP server (point `REACT_APP_LEADS_API_URL` at it for
the test build):

1. Submit a lead from the contact page and one from the modal (different
   pages, one with a `?utm_source=qa` URL) → both return success UI.
2. Inspect `api/data/leads.json`: records carry `lead_id`, timestamps,
   `organization`, `service_interest`, `source`, UTM fields, seeded
   `activity`, `notes: []`.
3. Duplicate check: resubmit the same phone → duplicate response surfaced
   calmly.
4. Admin: login → both leads visible on Dashboard + LMS within 15 s; open
   detail; change status (label "Proposal Sent" persists key
   `consultation_booked` — verify in the JSON); add a note from a second
   browser tab and confirm both tabs converge (BroadcastChannel + poll);
   CSV export contains the new records with the Organization column; delete a
   test lead; `action=health` reports `keyMatches: true` for the admin build.
5. Negative test: temporarily wrong `admin_key` (curl `action=list`) → 401
   with no lead data leaked.

### 4.3 Full QA matrix (record results in the PR as a table)

- **Visual parity**: every page vs its mockup file at 1440 / 1024 / 768 /
  375 px — screenshot pairs attached or linked.
- **Interactions**: header nav + active states; burger menu open/close/lock;
  all enquiry entry points open the modal; accordion (default open, toggle,
  hash deep links from home rows and direct URL); all tel/mailto links; 404
  page; form validation matrix (empty, bad email, short phone, valid minimal,
  valid full).
- **Animations**: hero intros, reveals, marquee, parallax, reduced-motion
  static pass (per Prompt 09 spec).
- **Cross-browser**: latest Chrome, Firefox, Safari (or WebKit proxy);
  Android + iOS viewport emulation.
- **SEO spot check**: view-source meta on `/` (static layer), runtime head on
  the other four routes, sitemap/robots reachable in the served build,
  schema validator clean.
- **Console hygiene**: zero errors/warnings on all routes (build mode).

### 4.4 Final zero-trace verification

`grep -rniE "nilachal|infracon|buildmart|nagaon|8638543526|nilachalinfracon|nilachal-logo" . --exclude-dir={node_modules,.git,mockup,prompts,build}`
must return **zero** hits — including docs this time. Fix any straggler found.
Record the exact command + empty output in the PR. Note explicitly in the PR
that `/mockup` (design contract) and `/prompts` (rebuild record) are retained
by design; flag to the owner that they may be archived/removed later if
desired — do not remove them yourself.

### 4.5 Go-live checklist (append to the deployment doc/guide)

Rotate-and-verify list: set final `REACT_APP_ADMIN_PASSWORD` +
`REACT_APP_LEADS_ADMIN_KEY`, align server `config.php` `ADMIN_API_KEY` (or
delete config.php to use the committed fallback), `npm run build`, upload
`build/` + ensure `api/` executes PHP, hit `/api/leads.php?action=health`
on production and confirm `keySource`/`keyMatches`/`storeWritable`, submit a
real test lead + verify in admin + delete it, verify deep-link refresh on
`/expertise#e05`, verify `https` + `www` canonical host redirect at the
hosting level, submit `sitemap.xml` in Search Console.

## 5. Coding Standards

Configuration files commented (each `.htaccess` rule says why it exists —
especially the `/api` exclusion); QA evidence reproducible (commands
included); no drive-by refactors during QA — file follow-up issues instead,
unless the fix is a true blocker (then fix, test, and itemize it).

## 6. Validation Checklist

- [ ] `.htaccess` present; deep-link refresh works on every route in the
  served build; `/api/leads.php?action=health` returns JSON (not HTML) with
  the PHP server.
- [ ] E2E lead test (4.2) fully passed — evidence in PR.
- [ ] QA matrix (4.3) completed with pass/fail per cell; all fails fixed or
  filed with justification.
- [ ] Zero-trace grep (4.4) empty.
- [ ] `npm ci && npm run build` from a clean clone: green, no warnings;
  final bundle sizes recorded.
- [ ] Go-live checklist merged into the deployment documentation.

## 7. Expected Deliverables

`public/.htaccess`; any blocker fixes discovered by QA (itemized); updated
deployment doc section with the go-live checklist; a PR whose description is
the complete QA report (parity table, E2E evidence, grep proof, Lighthouse
numbers carried over from Prompt 12 or re-run).

## 8. Testing Requirements

Everything in sections 4.2–4.4 **is** the testing. Re-run the Prompt 12
Lighthouse pass on the final build if any code changed in this prompt.

## 9. Constraints

- No feature work, no redesign; blocker fixes only, each itemized.
- Do not delete `/mockup` or `/prompts`.
- Do not print production secrets in the PR — reference where they live.
- The rewrite rules must be provably safe for `/api/*` before merging.

## 10. Completion Criteria

The repository builds clean from scratch, deploys by checklist to an
Apache/PHP host, captures and manages leads end to end, matches `/mockup`
page-for-page, contains zero Nilachal traces outside the two reference
folders and git history, and the QA report documents all of it.

## 11. Report & PR (mandatory)

Branch `dulecy/14-production-qa`; commit, push, open a **draft PR** whose body
is the QA report. Finish with a concise summary (readiness verdict, open
follow-ups if any) and the **PR link** (or branch + commit SHAs if PR
creation is unavailable).
