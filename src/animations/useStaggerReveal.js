/* ============================================
   useStaggerReveal — staggered children reveal
   Reveals the direct children (cards / grid items)
   of a container one after another as the container
   scrolls into view. Fires once. Respects reduced
   motion. Refreshes ScrollTrigger for lazy sections.
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
 * @param {string} [options.childSelector] Selector for the items to stagger
 *   (default: direct children via ':scope > *').
 * @param {number} [options.y=40]          Starting vertical offset (px).
 * @param {number} [options.stagger=0.08]  Delay between items (s).
 * @param {number} [options.duration]      Per-item duration (s).
 * @param {string} [options.start]         ScrollTrigger start (default 'top 80%').
 * @param {boolean} [options.once=true]    Reveal only once.
 * @returns {React.RefObject} ref to attach to the container element.
 */
export default function useStaggerReveal(options = {}) {
  const ref = useRef(null);
  const {
    childSelector = ':scope > *',
    y = 40,
    stagger = 0.08,
    duration = DURATION.base,
    start = REVEAL_START,
    once = true,
  } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets = el.querySelectorAll(childSelector);
      if (!targets.length) return;

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          ease: EASE,
          stagger,
          scrollTrigger: { trigger: el, start, once },
        }
      );

      ScrollTrigger.refresh();
    },
    { scope: ref }
  );

  return ref;
}
