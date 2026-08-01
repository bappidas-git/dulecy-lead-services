/* ============================================
   useReveal — fade-up reveal for a section
   Animates a single element from (y: 40, opacity: 0)
   to its natural position when it scrolls into view.
   Fires once. Respects reduced motion (instant final
   state). Refreshes ScrollTrigger so lazy-mounted
   sections are measured correctly.
   ============================================ */

import { useRef } from 'react';
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE,
  DURATION,
  REVEAL_START,
  prefersReducedMotion,
} from './gsapSetup';

/**
 * @param {Object} [options]
 * @param {number} [options.y=40]         Starting vertical offset (px).
 * @param {number} [options.duration]     Tween duration (s).
 * @param {number} [options.delay=0]      Start delay (s).
 * @param {string} [options.start]        ScrollTrigger start (default 'top 80%').
 * @param {boolean} [options.once=true]   Reveal only once.
 * @returns {React.RefObject} ref to attach to the element to reveal.
 */
export default function useReveal(options = {}) {
  const ref = useRef(null);
  const {
    y = 40,
    duration = DURATION.base,
    delay = 0,
    start = REVEAL_START,
    once = true,
  } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // Reduced motion → skip the animation, show final state instantly.
      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        el,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          ease: EASE,
          scrollTrigger: { trigger: el, start, once },
        }
      );

      // Lazy-loaded sections shift page layout as they mount — recompute
      // every ScrollTrigger so start/end positions stay accurate.
      ScrollTrigger.refresh();
    },
    { scope: ref }
  );

  return ref;
}
