# Prompt 09 — Animation & Interaction Parity Sweep

## 1. Objective

Audit every public page against the mockup's motion and interaction design and
fix every deviation, so the React site *feels* identical to `/mockup` — same
timings, easings, triggers, hovers, and reduced-motion behavior. This is a
verification-and-fix pass over work from Prompts 02–07, not a rebuild.

## 2. Background — the canonical motion spec

From `mockup/scripts.js` (GSAP) — these numbers are the acceptance criteria:

| Pattern | Tween | Trigger |
|---|---|---|
| Hero intro (`data-hero` sets) | `y:36→0, opacity 0→1, dur 1, power3.out, stagger 0.12, delay 0.1` | page load |
| Reveal (`data-reveal[=delay]`) | `y:32→0, opacity, dur 0.9, power3.out, + per-element delay` | `top 88%`, once |
| Stagger group (`data-stagger`) | children `y:26→0, opacity, dur 0.8, stagger 0.09` | `top 86%`, once |
| Rule line (`data-line`) | `scaleX 0→1, origin left, dur 1.1, power3.inOut` | `top 92%`, once |
| Parallax (`data-parallax=amt`) | `yPercent +amt/2 → −amt/2, no ease, scrub 0.4` | parent `top bottom`→`bottom top` |

From `mockup/styles.css` (CSS keyframes/transitions):

- `marquee` 36s linear infinite (translateX −50%); `floaty` 9s ease-in-out
  (hero logo, y −16px + rotate 2°); `pulseDot` 2.2s (badge dot); `modalIn`
  .35s `cubic-bezier(.22,1,.36,1)` (+ overlay `fadeIn` .25s); `expandIn` .4s
  same curve (accordion body).
- Hovers: `.btn--primary` lift −3px + `0 14px 34px rgba(213,25,46,.38)`;
  `.btn--nav` lift −2px; `.btn--outline` fills ink; `.card`/`.sector` lift
  −4/−5px + shadow + red border; `.card--red`/`.sector--red`/`.action--red`
  lift + red shadow; `.rows a` bg `#F7F7F8` + padding-left 20px; `.acc__head`
  bg on hover/open; `.contact-card` red border + lift −2px; footer contact
  cards red border + `rgba(213,25,46,.08)` bg; link hovers → red; nav link
  hover → red. All transitions ≈ .25–.3s ease.
- `prefers-reduced-motion: reduce` ⇒ mockup skips **all** GSAP animations
  (content shown in final state); CSS `scroll-behavior:smooth` on html.

Known risk areas from the React port: ScrollTrigger measuring lazy-loaded
routes/sections (must `refresh()` after mount and after accordion toggles),
reveals re-firing on client-side navigation (they must behave `once` per
mount), and cleanup on unmount (the `useGSAP`-based hooks handle this — verify
every component uses them rather than raw `gsap` calls).

## 3. Files/Folders to Inspect First

- `mockup/scripts.js` + `mockup/styles.css` (authoritative values above).
- `src/animations/` (all hooks — confirm parameters match the table exactly).
- Every section component under `src/pages/**` and the shell components
  (`Header`, `MobileMenu`, `Footer`, `LeadModal`).
- `src/styles/` global css (keyframes, `scroll-behavior`, selection).

## 4. Exact Implementation Instructions

1. **Hook audit** — diff each hook's numbers against the table; fix any
   mismatch (start offsets 88/86/92%, durations, staggers, delay handling,
   `once: true`). Ensure `useParallax` maps the mockup's `data-parallax`
   amounts used per element: hero images −16, About band image −22, glows −10.
2. **Page-by-page sweep** (Home, About, Expertise, Industries, Contact + shell
   + modal): for every element the mockup animates (grep its HTML for
   `data-hero|data-reveal|data-stagger|data-line|data-parallax`), confirm the
   React counterpart animates with the same pattern and the same per-element
   delay values (e.g. `data-reveal="0.05"`, `"0.08"`, `"0.1"`, `"0.12"`,
   `"0.14"`, `"0.15"` appear in the mockups — carry them over exactly).
   Produce a checklist table in the PR body: element → pattern → status.
3. **CSS motion** — verify all six keyframes exist once (shared stylesheet)
   with exact durations/curves; verify every hover transition listed above,
   including transition property lists (`transform .25s ease, box-shadow .25s
   ease, …` as per mockup).
4. **Route transitions** — on client-side navigation: new page starts at top,
   hero intro plays, ScrollTriggers of the previous page are killed (no
   zombie triggers — check `ScrollTrigger.getAll()` length in dev tools
   before/after navigating), and `ScrollTrigger.refresh()` runs after the new
   page's lazy content mounts. Accordion toggle and modal open/close must not
   desync trigger positions (refresh after both).
5. **Reduced motion** — with the OS/emulated setting on: zero GSAP tweens run,
   content is fully visible, marquee/floaty/pulse may be disabled via a
   `@media (prefers-reduced-motion: reduce)` block (mockup leaves CSS
   animations running — improve on it: pause marquee/floaty/pulse too, and
   note this single intentional deviation in the PR).
6. **Performance guard** — animations must only use transform/opacity (they
   do in the spec); confirm no layout-thrashing scroll listeners were added;
   `will-change` only where the mockup uses it (`.hero__bg`).

## 5. Coding Standards

All motion through `src/animations` hooks or shared CSS keyframes — no inline
one-off `gsap.to` in components; numbers referenced from the shared
`DURATION`/`EASE` constants where the foundation defines them (extend the
constants if a mockup value is missing rather than inlining magic numbers
twice).

## 6. Validation Checklist

- [ ] Side-by-side scroll-through of each page vs its mockup file — reveals
  fire at the same scroll depths, same speeds, same order.
- [ ] Hero intros play once per page visit including revisits via client-side
  nav.
- [ ] Marquee loops seamlessly (no jump at −50%); floaty + pulse dots subtle
  and continuous; modal/accordion curves feel identical.
- [ ] Parallax scrubs smoothly on hero/band images and glows; no jank at
  120 Hz or on a throttled CPU (DevTools 6× slowdown stays usable).
- [ ] `ScrollTrigger.getAll()` count returns to the new page's expected set
  after navigation (no leaks).
- [ ] Reduced-motion: everything static and visible; no opacity-0 stranded
  content anywhere (scroll the full site).
- [ ] Every hover state from the Background list matches the mockup.

## 7. Expected Deliverables

Fixed/parameter-tuned animation hooks, corrected component usages, shared
keyframes/hover polish, and a parity-audit table (in the PR description)
covering every animated element per page.

## 8. Testing Requirements

`npm run build` green; manual audit on Chrome + one WebKit/Firefox engine;
mobile emulation (375px) — touch has no hover, so verify nothing *requires*
hover to be usable; reduced-motion emulation pass.

## 9. Constraints

- No visual redesign — timing/behavior corrections only.
- No changes to admin, API, or form logic.
- The single allowed deviation from the mockup is the reduced-motion
  improvement noted above. `/mockup`, `/prompts` untouched.

## 10. Completion Criteria

Every animated/interactive behavior on the five public pages, shell, and
modal is indistinguishable from the mockup (or intentionally better under
reduced motion), with no ScrollTrigger leaks and a green build.

## 11. Report & PR (mandatory)

Branch `dulcey/09-animation-parity`; commit, push, open a **draft PR**. Report
a concise summary (deviations found → fixed, audit table) and the **PR link**
(or branch + commit SHAs if PR creation is unavailable).
