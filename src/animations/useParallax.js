/* ============================================
   useParallax — subtle background / image parallax
   Shifts an element vertically (yPercent ±amount) as
   it travels through the viewport, scrubbed to scroll.
   Keep it subtle (default ±8%). Respects reduced motion
   (element stays put). Refreshes ScrollTrigger for lazy
   sections.
   ============================================ */

import { useRef } from 'react';
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  prefersReducedMotion,
} from './gsapSetup';

/**
 * @param {Object} [options]
 * @param {number} [options.amount=8]     Parallax magnitude (yPercent, ±amount).
 * @param {boolean|number} [options.scrub=true] ScrollTrigger scrub (true or seconds).
 * @param {string} [options.start]        ScrollTrigger start (default 'top bottom').
 * @param {string} [options.end]          ScrollTrigger end (default 'bottom top').
 * @returns {React.RefObject} ref to attach to the element to parallax.
 */
export default function useParallax(options = {}) {
  const ref = useRef(null);
  const {
    amount = 8,
    scrub = true,
    start = 'top bottom',
    end = 'bottom top',
  } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { yPercent: 0 });
        return;
      }

      gsap.fromTo(
        el,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: { trigger: el, start, end, scrub },
        }
      );

      ScrollTrigger.refresh();
    },
    { scope: ref }
  );

  return ref;
}
