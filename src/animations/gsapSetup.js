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
