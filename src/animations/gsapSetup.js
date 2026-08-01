/* ============================================
   GSAP Animation Foundation — Nilachal Infracon
   Shared GSAP + ScrollTrigger setup used by every
   public page section (prompts 06–11).

   - Registers ScrollTrigger + useGSAP once (SSR-safe).
   - Exports shared easing / duration tokens.
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

// Shared easing token — every section reveal uses this for a consistent feel.
export const EASE = 'power3.out';

// Duration tokens (seconds).
export const DURATION = {
  fast: 0.4,
  base: 0.6,
  slow: 0.9,
};

// Default ScrollTrigger start position for scroll-in reveals.
export const REVEAL_START = 'top 80%';

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
export const REVEAL_PRESET = { y: 32, duration: 0.9, start: 'top 88%' };

/** `data-stagger` — children fade-up 0.09s apart, once, at 'top 86%'. */
export const STAGGER_PRESET = {
  y: 26,
  duration: 0.8,
  stagger: 0.09,
  start: 'top 86%',
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

export { gsap, ScrollTrigger, useGSAP };
