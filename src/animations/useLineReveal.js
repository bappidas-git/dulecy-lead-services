/* ============================================
   useLineReveal — rule / underline wipe
   Scales a decorative bar out from its left edge
   when it scrolls into view. Values match
   `mockup/scripts.js` `data-line`: scaleX 0 → 1,
   1.1s power3.inOut, once, at 'top 92%'. Respects
   reduced motion (bar shown at full width).
   ============================================ */

import { useRef } from 'react';
import {
  gsap,
  useGSAP,
  DURATION,
  EASE_IN_OUT,
  START,
  scheduleRefresh,
  prefersReducedMotion,
} from './gsapSetup';

/**
 * @param {Object} [options]
 * @param {number} [options.duration=1.1] Tween duration (s).
 * @param {string} [options.ease='power3.inOut'] Easing.
 * @param {string} [options.start='top 92%'] ScrollTrigger start.
 * @param {boolean} [options.once=true]   Wipe only once.
 * @returns {React.RefObject} ref to attach to the bar element.
 */
export default function useLineReveal(options = {}) {
  const ref = useRef(null);
  const {
    duration = DURATION.line,
    ease = EASE_IN_OUT,
    start = START.line,
    once = true,
  } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { scaleX: 1 });
        return;
      }

      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration,
          ease,
          scrollTrigger: { trigger: el, start, once },
        }
      );

      scheduleRefresh();
    },
    { scope: ref }
  );

  return ref;
}
