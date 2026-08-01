/* ============================================
   useHeroIntro — page-load hero entrance
   Staggers a hero's children up into place once,
   on mount (no ScrollTrigger — the hero is already
   in view). Values match `mockup/scripts.js`:
   y 36 → 0, opacity 0 → 1, 1s power3.out, 0.12
   stagger after a 0.1s delay. Respects reduced
   motion (instant final state).
   ============================================ */

import { useRef } from 'react';
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE,
  prefersReducedMotion,
} from './gsapSetup';

/**
 * @param {Object} [options]
 * @param {string} [options.selector='[data-hero]'] Children to stagger in.
 * @param {number} [options.y=36]        Starting vertical offset (px).
 * @param {number} [options.duration=1]  Per-item duration (s).
 * @param {number} [options.stagger=0.12] Delay between items (s).
 * @param {number} [options.delay=0.1]   Delay before the first item (s).
 * @returns {React.RefObject} ref to attach to the hero container.
 */
export default function useHeroIntro(options = {}) {
  const ref = useRef(null);
  const {
    selector = '[data-hero]',
    y = 36,
    duration = 1,
    stagger = 0.12,
    delay = 0.1,
  } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets = el.querySelectorAll(selector);
      if (!targets.length) return;

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        { y: 0, opacity: 1, duration, ease: EASE, stagger, delay }
      );

      // The hero sets the page's top offset — every scroll trigger below it
      // must re-measure once it has mounted.
      ScrollTrigger.refresh();
    },
    { scope: ref }
  );

  return ref;
}
