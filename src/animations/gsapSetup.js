/* ============================================
   GSAP Animation Foundation — Dulecy Lead Services
   Shared GSAP + ScrollTrigger setup used by every
   public page section (prompts 02–09).

   - Registers ScrollTrigger + useGSAP once (SSR-safe).
   - Exports shared easing / duration / start tokens, all
     carrying `mockup/scripts.js` values.
   - scheduleRefresh(): coalesced ScrollTrigger.refresh().
   - prefersReducedMotion(): when true, all reveal
     helpers no-op and set elements to their final
     state instantly.
   ============================================ */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins once. Guarded so this module is safe to import in any
// (including non-browser / SSR) context — registration is a no-op there.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Shared easing tokens — `mockup/scripts.js` uses exactly these two.
export const EASE = 'power3.out';
export const EASE_IN_OUT = 'power3.inOut';

// Duration tokens (seconds). `hero` / `slow` / `stagger` / `line` carry the
// mockup's four tween durations; `base` is the fallback default for hooks
// called without a preset.
export const DURATION = {
  base: 0.6,
  stagger: 0.8, // data-stagger children
  slow: 0.9, // data-reveal
  hero: 1, // data-hero
  line: 1.1, // data-line
};

// ScrollTrigger start positions. `REVEAL_START` predates the port and is the
// fallback default; `START` carries the mockup's three exact offsets.
export const REVEAL_START = 'top 80%';
export const START = {
  reveal: 'top 88%', // data-reveal
  stagger: 'top 86%', // data-stagger
  line: 'top 92%', // data-line
  parallax: 'top bottom', // data-parallax (end: 'bottom top')
};

/* ============================================
   Mockup-parity presets
   --------------------------------------------
   The Dulecy pages animate with the exact values `mockup/scripts.js` used
   for its `data-*` attributes, so those numbers live here once instead of
   being re-typed in every section. Spread a preset into the matching hook
   and override only what differs (usually `delay`, the mockup's optional
   `data-reveal="0.05"` value).
   ============================================ */

/** `data-reveal` — fade-up, once, at 'top 88%'. */
export const REVEAL_PRESET = {
  y: 32,
  duration: DURATION.slow,
  start: START.reveal,
};

/** `data-stagger` — children fade-up 0.09s apart, once, at 'top 86%'. */
export const STAGGER_PRESET = {
  y: 26,
  duration: DURATION.stagger,
  stagger: 0.09,
  start: START.stagger,
};

/**
 * `data-parallax="<amt>"` — the element travels yPercent +amt/2 → −amt/2,
 * scrubbed against its PARENT as that parent crosses the viewport.
 * @param {number} [amt=14] The mockup's raw attribute value (sign ignored).
 * @returns {Object} options for `useParallax`.
 */
export const parallaxPreset = (amt = 14) => ({
  amount: Math.abs(Number(amt) || 14) / 2,
  invert: true,
  trigger: 'parent',
  scrub: 0.4,
});

/**
 * True when the user (or their OS) has requested reduced motion.
 * SSR-safe: returns false when `window` / matchMedia is unavailable.
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/* ============================================
   Coalesced ScrollTrigger.refresh()
   --------------------------------------------
   `ScrollTrigger.refresh()` re-measures EVERY registered trigger, so it is
   the one expensive call in this foundation. A page mounts a dozen-plus
   hooks at once (Home alone: 20), and each one used to refresh
   synchronously — twenty full re-measures, each forcing layout, in a single
   commit. `scheduleRefresh()` collapses any number of calls in the same
   frame into ONE refresh on the next animation frame, by which time React
   has committed the whole tree and the measurements are the ones we want.

   The mockup got this for free: it built its triggers from a finished
   document and refreshed once, on `load`.
   ============================================ */

let refreshQueued = false;

/** Queue a single ScrollTrigger.refresh() for the next frame. */
export const scheduleRefresh = () => {
  if (typeof window === 'undefined' || refreshQueued) return;
  refreshQueued = true;

  const run = () => {
    // Whichever timer gets here first does the work; the other no-ops.
    if (!refreshQueued) return;
    refreshQueued = false;
    ScrollTrigger.refresh();
  };

  window.requestAnimationFrame(run);
  // rAF is paused outright while a tab is hidden. Without this fallback the
  // queued flag would stay latched for the life of the document and every
  // later scheduleRefresh() would be swallowed — a page mounted in a
  // background tab would come back with stale trigger positions.
  window.setTimeout(run, 120);
};

// `mockup/scripts.js` refreshes on window `load`, once images have settled
// and stopped moving the triggers below them. Registered here (not per hook)
// so it happens exactly once per document.
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    scheduleRefresh();
  } else {
    window.addEventListener('load', scheduleRefresh, { once: true });
  }

  // Dev-only handle for the parity audit: `ScrollTrigger.getAll().length`
  // before/after a client-side navigation must return to the new page's own
  // set (no zombie triggers). Never shipped — CRA strips this in production.
  if (process.env.NODE_ENV === 'development') {
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;
  }
}

export { gsap, ScrollTrigger, useGSAP };
