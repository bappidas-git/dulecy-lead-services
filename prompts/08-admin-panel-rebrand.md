# Prompt 08 — Admin Panel: Dulcey Identity, Columns, Statuses & Guides

## 1. Objective

Convert the admin panel (`/admin/*`) into a professional **Dulcey** back
office: Dulcey branding on login/topbar, lead tables and detail views that
reflect the new field shape (`organization` in, `state` out; 10 expertise
interest options), Dulcey-appropriate status labels, updated CSV
export/import, and fully rewritten Guidelines content — **without touching the
sync architecture**.

## 2. Background

- The admin panel lives in `src/admin/` (components `AdminLayout`,
  `AdminTopbar`, `AdminLogin`, `ProtectedRoute`; pages `Dashboard` at
  `/admin/dashboard`, `LeadManagement` at `/admin/lms`, `LeadDetail` at
  `/admin/lms/lead/:leadId`, `Guideline` at `/admin/guideline` with four tab
  components under `pages/guidelineContent/`). Styling uses the `--admin-*`
  tokens (already re-pointed to ink/red in Prompt 01) via `.module.css`.
- **Untouchable architecture:** `src/admin/utils/leadService.js` — server
  hydration (`syncLeadsFromServer`), in-memory cache, optimistic updates,
  15 s polls (`POLL_MS = 15000` in each page), BroadcastChannel
  `lp_leads_channel`, `X-Admin-Key` auth with query/body fallback, health-based
  sync-error explanations. No localStorage for leads, ever.
- **Status taxonomy** (`src/admin/utils/leadStatus.js`): the persisted `value`
  keys are frozen: `new`, `contacted`, `consultation_booked`,
  `procedure_scheduled`, `completed`, `not_interested`. Labels/colors are
  display-only. Dashboard "Conversion Rate" counts terminal `completed`.
- Prompt 07 changed the lead payload: `organization` added, `state` no longer
  populated, `mobile` optional, `email` required, `service_interest` now holds
  one of the 10 Dulcey expertise titles (or `Something else`).
- `Guideline.jsx` contains a hardcoded gate password (`Nilachal@Guide2026`)
  that must be rotated; guideline tab content is Nilachal-specific prose that
  must be rewritten for Dulcey.

## 3. Files/Folders to Inspect First

- Everything under `src/admin/` (components, pages, `guidelineContent/`,
  `context/AdminAuthContext.jsx`, `utils/adminAuth.js`, `utils/leadService.js`
  — read `exportLeadsCSV` / `importLeadsCSV` closely), `src/admin/**/*.module.css`.
- `src/data/siteConfig.js` (logos), `src/data/expertiseData.js` (interest
  options for filters), `src/styles/variables.css` (`--admin-*` block).
- A sample lead in `public/api/data/leads.json` if present (shape check).

## 4. Exact Implementation Instructions

### 4.1 Identity & chrome

- `AdminLogin`: Dulcey logo, title "Dulcey Lead Services — Admin", Dulcey
  copy; keep env-driven auth (`REACT_APP_ADMIN_USERNAME`/`_PASSWORD`)
  untouched.
- `AdminTopbar`: Dulcey color logo, nav Dashboard · Leads · Guidelines, user
  chip + logout — restyle details to the admin tokens (ink text, red accents,
  white surfaces, `#E7E7EA` borders). Typography Archivo.
- Sweep all admin `.module.css` files for leftover literal navy/green hex
  values; replace with `--admin-*`/Dulcey tokens.

### 4.2 Lead data surfaces — `organization` in, `state` out

- `LeadManagement` table: columns Name · Mobile · Email · **Organization** ·
  Interested In · Status · Submitted · actions (match the existing column set,
  substituting Organization where State was). Render `lead.organization || '—'`;
  old test records without the key must not crash (defensive access
  everywhere).
- Filters: "Interested In" filter options = 10 expertise titles + `Something
  else` + `General Enquiry` legacy value if present in data (derive the option
  list from the loaded leads ∪ `expertiseData` titles so nothing is
  unfilterable). Replace the State filter with an Organization free-text
  search (or fold organization into the existing search box — pick one,
  document it in the PR).
- `LeadDetail`: Contact Details card shows Name, Mobile (or "—"), Email,
  **Organization**; Enquiry card shows Interested In, Message, Source,
  page/UTM metadata as today; Notes + Activity timeline + status `Select`
  untouched functionally.
- `Dashboard`: stat tiles, 14-day sparkline, status breakdown, recent table
  (swap State column for Organization). Labels may say "Enquiries" as today.
- `normalizeLead` in `leadService.js`: add `organization: lead.organization ??
  ''` so the cache shape is stable. This is an additive change — nothing else
  in the service moves.

### 4.3 CSV export/import

- `exportLeadsCSV`: replace the State column with `Organization`
  (key `organization`); keep every other column and the exact existing
  escaping/format. `importLeadsCSV`: accept both new-format files and old
  exports (map a legacy `State` column into `state` as before if present;
  absence is fine) — additive, do not break the existing round-trip.

### 4.4 Status labels (keys frozen)

In `leadStatus.js` update **labels only**, mapped for a consulting pipeline:
`new` → New · `contacted` → Contacted · `consultation_booked` → **Proposal
Sent** · `procedure_scheduled` → Follow-Up · `completed` → Converted ·
`not_interested` → Not Interested. Adjust chip colors if needed to fit the
Dulcey palette (status colors are functional and may keep their hues).
`describeStatusChange`/activity strings keep using labels, so old activity
entries still render.

### 4.5 Guidelines hub

- Rotate the gate password constant to a new Dulcey value (e.g.
  `Dulcey@Guide2026` or stronger) and note it in the PR summary.
- Rewrite the four tabs for this project's reality:
  1. **Lead Storage** — the shared PHP JSON store, key handshake
     (`REACT_APP_LEADS_ADMIN_KEY` ↔ `ADMIN_API_KEY`, config.php override →
     env → committed fallback), health diagnostic, 15 s poll +
     BroadcastChannel, duplicate rules, the new `organization` field, "no
     localStorage" rule.
  2. **SEO Setup** — dulceyleadservices.com specifics (placeholder until Prompt 10 lands;
     write it against the planned five-route SEO so it doesn't need a second
     rewrite).
  3. **Deployment** — build + upload flow, `config.php` key alignment
     (mismatch ⇒ admin 401s while public submits keep saving — preserve this
     warning, it reflects a real incident), SPA rewrites note.
  4. **For Developers** — architecture map (pages, data layer, animations,
     contracts, tokens), pointing at `/prompts` as the rebuild record.
  All Nilachal wording, examples, URLs, and credentials removed.

## 5. Coding Standards

Keep the existing component patterns and file layout; additive changes to
`leadService.js` only (`normalizeLead`, CSV columns); defensive field access;
labels/colors via tokens; no new dependencies; keep every `.module.css` class
name stable unless the element disappears.

## 6. Validation Checklist

- [ ] Login with new creds → Dulcey-branded panel; zero Nilachal strings
  anywhere in `/admin/*` UI (`grep -ri nilachal src/admin` → 0).
- [ ] Submit a fresh lead from the site: appears in Dashboard recent +
  `/admin/lms` within 15 s with Organization populated; a second browser tab
  updates via BroadcastChannel without reload.
- [ ] Status changes/notes from two tabs merge (append-only) — no lost
  entries; activity timeline renders old + new entries.
- [ ] CSV export opens in a spreadsheet with the Organization column; import
  of that same file round-trips; import of a pre-change CSV still works.
- [ ] Filters: each of the 10 expertise titles filters correctly;
  organization search matches.
- [ ] Leads with no `organization`/`state` (legacy) render with "—", no
  crashes.

## 7. Expected Deliverables

Updated admin components/pages/styles, `leadStatus.js` labels, minimal
additive `leadService.js` changes, rewritten `guidelineContent/*` and
`Guideline.jsx` password.

## 8. Testing Requirements

`npm run build` green. If PHP is available locally (`php -S localhost:8080 -t
public`), run the full loop: submit → list → status change → note → delete →
CSV. Otherwise seed `public/api/data/leads.json` shape via the service's
expectations and state the limitation in the PR.

## 9. Constraints

- **Do not modify:** `public/api/leads.php`, the poll/BroadcastChannel/cache
  pattern, status keys, lead keys, auth flow.
- No localStorage for lead data.
- `/mockup`, `/prompts` untouched.

## 10. Completion Criteria

The admin panel is fully Dulcey-branded, reflects the new lead shape end to
end (tables, detail, filters, CSV), keeps perfect sync behavior, and contains
no Nilachal content or credentials.

## 11. Report & PR (mandatory)

Branch `dulcey/08-admin-panel`; commit, push, open a **draft PR**. Report a
concise summary (columns/labels changed, password rotation, sync verification
results) and the **PR link** (or branch + commit SHAs if PR creation is
unavailable).
