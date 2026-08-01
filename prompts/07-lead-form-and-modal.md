# Prompt 07 — Unified Lead Form, Enquiry Modal & Submission Mapping

## 1. Objective

Rebuild the enquiry experience to the Dulecy mockup: the **form fields/styling**
(`.lead-form`), the **centered modal** that replaces the old side drawer, and
the **inline success state** — while keeping the entire server lead pipeline
(`webhookSubmit` → `public/api/leads.php` → admin panel) contract-compatible.
This is the most contract-sensitive prompt in the series; read the Background
fully before coding.

## 2. Background — the contracts and the field mapping

**Lead record keys (NEVER renamed):** `lead_id`, `name`, `mobile`, `email`,
`service_interest`, `state`, `message`, `source`, `status`, `submitted_at`,
`updated_at`, `notes[]`, `activity[]`, plus enrichment `page_url`,
`user_agent`, `utm_source|medium|campaign|term|content`.

**Server behavior (`public/api/leads.php` — do not edit it):** `action=create`
stores the posted `lead` object **as-is** (no schema), dedupes by exact
`lead_id` and by non-empty `mobile` match, returns `{success, duplicate?}`.
Because the store is schemaless, **adding a new field requires zero PHP
changes**.

**Mockup form (identical on all pages/modal — `mockup/contact.html`):**

| Mockup field | Required | Maps to lead key | Notes |
|---|---|---|---|
| FULL NAME | yes | `name` | placeholder `Your name` |
| EMAIL | **yes** | `email` | placeholder `you@company.com` — required now (was optional) |
| PHONE | no | `mobile` | placeholder `+91 ...` — optional now (was required); validate Indian format only when non-empty |
| ORGANIZATION | no | **`organization` (NEW key)** | placeholder `Company / institution` |
| WHAT DO YOU NEED SUPPORT WITH? | yes | `service_interest` | flat select: the 10 expertise titles + `Something else`; store the visible label |
| MESSAGE | no | `message` | placeholder `Tell us briefly about your requirement...` |

**Decisions locked by this plan (do not re-litigate):**
- Add optional `organization` (empty string default) to the submitted payload —
  a coordinated, additive contract update. Admin panel learns to display it in
  Prompt 08.
- Stop populating `state` (Dulecy has no state field). The key is **not**
  renamed or reused; new leads simply omit it / send `""`.
- `mobile` optional: server-side duplicate prevention still applies whenever a
  phone is provided (the PHP already skips empty mobiles); duplicate email is
  **not** blocked server-side — acceptable, note it in the PR.
- Success is **inline** (mockup `form-success`), not a redirect: the
  `/thank-you` route is retired in this prompt.

**Mockup UI spec:** `.lead-form` — column flex gap 16px; `row2` grid
`repeat(auto-fit,minmax(min(200px,100%),1fr))` for name/email and phone/org;
labels 12.5px/600 uppercase-ish tracking .04em `#3D3D42`; inputs/select/
textarea: 1px `#DEDEE2` border, radius 12px, padding 13px 15px, 15px text,
white bg; focus: red border + `0 0 0 3px rgba(213,25,46,.12)` ring; select
uses the inline-SVG chevron `background-image` (copy the data-URI from
`mockup/styles.css`); textarea min-height 96px; submit = full-width
`.btn--primary` `Send Enquiry →`; footer line `Prefer email? Write to us at
dulceyleadservices@gmail.com` (12.5px grey-4, red link). Success block
(`.form-success`): 64px gradient circle ✓, `Thank you, <first name>.` 22px/700,
body "Your enquiry has been noted. Our team will get back to you within one
business day.", red email link. **Modal** (`.modal`/`.modal__box`): overlay
`rgba(10,10,12,.55)` + blur(8px), z-200; box white, radius 24px, max-width
640px, max-height `calc(100vh - 48px)` scrollable, shadow
`0 30px 80px rgba(0,0,0,.35)`, `modalIn` .35s `cubic-bezier(.22,1,.36,1)`;
38px circular ✕ close top-right; heading block: eyebrow `Start a
conversation`, h2 `Tell us what you're building.`, sub "One form, one
conversation — we'll route your enquiry to the right expertise."

## 3. Files/Folders to Inspect First

- `mockup/contact.html` (form + success markup), any mockup page (modal
  markup), `mockup/styles.css` (`.lead-form`, `.form-success`, `.modal*`),
  `mockup/scripts.js` (open/close/Escape/backdrop semantics, first-name
  extraction).
- `src/components/common/UnifiedLeadForm/UnifiedLeadForm.jsx` (current fields,
  validation flow, `submitLeadToWebhook` call, `/thank-you` navigation),
  `src/utils/webhookSubmit.js`, `src/utils/validators.js`,
  `src/context/ModalContext.jsx`, `src/components/common/LeadFormDrawer/`,
  `src/App.jsx` (drawer wrapper + `/thank-you` route), `src/pages/ThankYou/`,
  and every `openLeadDrawer(` call site (grep).

## 4. Exact Implementation Instructions

### 4.1 `UnifiedLeadForm` rewrite

- Fields, order, labels, placeholders, required flags exactly per the table
  above. Interest options come from `expertiseData` titles (map over it) +
  literal `Something else` — never a hardcoded copy of the list.
- Validation (extend `src/utils/validators.js`, keep existing exports):
  name required (existing rules); email **required** + format; mobile optional
  — when non-empty, digits-only input handling and Indian mobile validation
  (existing `INDIAN_MOBILE_REGEX`); service required; organization/message
  free-text (sanitized, length-capped per existing `sanitizeInput`).
  Inline error messages under fields, first-invalid-field focus — keep the
  current UX pattern.
- Submission payload:
  `{ name, mobile, email, organization, service_interest, message, source }` —
  then `submitLeadToWebhook` enriches as today (UUID `lead_id`, `status:'new'`,
  timestamps, page/user-agent/UTM, `notes:[]`, seeded `activity`). Update its
  JSDoc for the new field; **do not** change endpoint, enrichment keys, or
  response handling. Keep the duplicate response path ("An enquiry with these
  details was already submitted." — surface as a calm success-style notice per
  current behavior).
- On success: hide the form, show the inline `.form-success` with the first
  word of `name`; no navigation. On failure: keep the current honest error
  messaging (with `siteConfig.phoneDisplay`).
- Styling: replace the MUI-styled internals with the mockup's exact input
  styling (plain inputs/select/textarea + CSS Modules are fine and preferred
  for pixel parity; if MUI components are kept, they must be restyled to be
  visually indistinguishable — including the select chevron).
- Keep the `prefill`/`serviceInterest` mechanism: when opened with
  `{ service_interest: '<expertise title>' }`, preselect that option.

### 4.2 Modal replaces drawer

- New `src/components/common/LeadModal/` implementing the mockup modal spec
  (portal, backdrop click closes, ✕ closes, Escape closes, body scroll lock,
  focus trap, focus returns to the opener, `role="dialog" aria-modal="true"
  aria-label="Enquiry form"`). It renders the heading block + `UnifiedLeadForm`
  (`source` from the modal config).
- `src/context/ModalContext.jsx`: rename the API to `openLeadModal(sourceKey,
  extraData)` / `closeLeadModal` (state `isModalOpen`, `modalConfig`) and
  update **every** call site (Header, MobileMenu, Footer, Home, About,
  Expertise, Industries, Contact, and the global wrapper in `App.jsx` — grep
  `openLeadDrawer` until zero hits). Preserve the `service_interest`
  pass-through.
- Stop rendering `LeadFormDrawer`; leave its files on disk for Prompt 11.

### 4.3 Retire `/thank-you`

Remove the route from `App.jsx` and the form's `navigate('/thank-you')`;
leave `src/pages/ThankYou/` files for Prompt 11's sweep. (SEO noindex list is
updated in Prompt 10.)

## 5. Coding Standards

Series standards. The form must remain a single shared component used by both
the Contact page (inline) and the modal — no forked copies. No localStorage
anywhere in the lead path. Keep `keepalive: true` on the create fetch.

## 6. Validation Checklist

- [ ] Form fields/labels/placeholders/required-marks match the mockup exactly
  in both contexts (contact panel + modal), desktop and 375px.
- [ ] Client validation: empty name/email/service block submit with inline
  errors; bad email blocked; 5-digit phone blocked; empty phone + empty org
  accepted.
- [ ] Successful submit shows the inline success with the first name; the
  page does **not** navigate; modal variant keeps the success visible until
  closed.
- [ ] Payload inspected in DevTools: contains `organization`, omits/empties
  `state`, all contract keys intact, UTM fields captured from a
  `?utm_source=test` URL.
- [ ] Re-submitting the same phone number surfaces the duplicate message.
- [ ] Modal: backdrop/✕/Escape close; focus trapped and restored; body scroll
  locked; `modalIn` animation plays; reduced-motion skips it.
- [ ] `/thank-you` returns the NotFound page; no `openLeadDrawer` references
  remain.

## 7. Expected Deliverables

Rewritten `UnifiedLeadForm` (+ module); new `LeadModal`; updated
`ModalContext` + all call sites; updated `validators.js`, `webhookSubmit.js`
(JSDoc/comments only), `App.jsx`.

## 8. Testing Requirements

`npm run build` green. Manual E2E against a PHP-capable environment if
available (`php -S localhost:8080 -t public` serves `api/leads.php`; point
`REACT_APP_LEADS_API_URL` at it): create a lead, verify it lands in
`public/api/data/leads.json` with `organization`; then verify it appears in
`/admin/lms` (admin still shows old columns until Prompt 08 — the record
itself must be present). If PHP isn't available, mock the fetch and state so
in the PR.

## 9. Constraints

- **Do not edit `public/api/leads.php`** (no schema exists to change).
- Never rename existing lead keys or reuse `state` for organization data.
- Admin UI changes are Prompt 08 — out of scope here.
- `/mockup`, `/prompts` untouched.

## 10. Completion Criteria

Every enquiry entry point (header, menu, footer, all page CTAs, contact
panel, expertise prefill) uses the pixel-faithful Dulecy form; submissions
store the new field shape on the server with duplicates handled; the modal
fully replaces the drawer; build green.

## 11. Report & PR (mandatory)

Branch `dulecy/07-lead-form-modal`; commit, push, open a **draft PR**. Report
a concise summary (field mapping recap, contract confirmation, E2E result)
and the **PR link** (or branch + commit SHAs if PR creation is unavailable).
