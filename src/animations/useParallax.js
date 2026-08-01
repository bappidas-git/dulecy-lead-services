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
  useGSAP,
  START,
  scheduleRefresh,
  prefersReducedMotion,
} from './gsapSetup';

/**
 * @param {Object} [options]
 * @param {number} [options.amount=8]     Parallax magnitude (yPercent, ±amount).
 * @param {boolean|number} [options.scrub=true] ScrollTrigger scrub (true or seconds).
 * @param {string} [options.start]        ScrollTrigger start (default 'top bottom').
 * @param {string} [options.end]          ScrollTrigger end (default 'bottom top').
 * @param {'self'|'parent'} [options.trigger='self'] Which element drives the
 *   scrub. Absolutely-positioned layers (hero backgrounds, glows) must use
 *   'parent' — their own box does not travel with the section.
 * @param {boolean} [options.invert=false] Travel +amount → −amount (the
 *   mockup's direction) instead of −amount → +amount.
 * @returns {React.RefObject} ref to attach to the element to parallax.
 */
export default function useParallax(options = {}) {
  const ref = useRef(null);
  const {
    amount = 8,
    scrub = true,
    start = START.parallax,
    end = 'bottom top',
    trigger = 'self',
    invert = false,
  } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { yPercent: 0 });
        return;
      }

      const triggerEl =
        trigger === 'parent' ? el.parentElement || el : el;

      gsap.fromTo(
        el,
        { yPercent: invert ? amount : -amount },
        {
          yPercent: invert ? -amount : amount,
          ease: 'none',
          force3D: true,
          scrollTrigger: { trigger: triggerEl, start, end, scrub },
        }
      );

      scheduleRefresh();
    },
    { scope: ref }
  );

  return ref;
}
