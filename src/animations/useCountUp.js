/* ============================================
   useCountUp — GSAP number counter
   Counts a number up (from → end) when the element
   scrolls into view, driven by ScrollTrigger. Writes
   the formatted value into the element's textContent.
   Supports prefix / suffix (e.g. '10+', '100%',
   '₹50,000'). Respects reduced motion (jumps to final
   value).
   ============================================ */

import { useRef } from 'react';
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE,
  DURATION,
  prefersReducedMotion,
} from './gsapSetup';

/**
 * @param {number} end                    Target value to count up to.
 * @param {Object} [options]
 * @param {number} [options.from=0]       Starting value.
 * @param {number} [options.duration]     Count duration (s).
 * @param {string} [options.prefix='']    Text before the number (e.g. '₹').
 * @param {string} [options.suffix='']    Text after the number (e.g. '+', '%').
 * @param {number} [options.decimals=0]   Decimal places.
 * @param {string} [options.separator=','] Thousands separator.
 * @param {string} [options.start]        ScrollTrigger start (default 'top 85%').
 * @param {boolean} [options.once=true]   Count only once.
 * @returns {React.RefObject} ref to attach to the number element.
 */
export default function useCountUp(end, options = {}) {
  const ref = useRef(null);
  const {
    from = 0,
    duration = DURATION.slow,
    prefix = '',
    suffix = '',
    decimals = 0,
    separator = ',',
    start = 'top 85%',
    once = true,
  } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const target = Number(end) || 0;

      const format = (value) => {
        const fixed = Number(value).toFixed(decimals);
        const [intPart, decPart] = fixed.split('.');
        const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        const num = decPart ? `${withSep}.${decPart}` : withSep;
        return `${prefix}${num}${suffix}`;
      };

      if (prefersReducedMotion()) {
        el.textContent = format(target);
        return;
      }

      const counter = { value: from };
      el.textContent = format(from);

      gsap.to(counter, {
        value: target,
        duration,
        ease: EASE,
        onUpdate: () => {
          el.textContent = format(counter.value);
        },
        scrollTrigger: { trigger: el, start, once },
      });

      ScrollTrigger.refresh();
    },
    { scope: ref, dependencies: [end] }
  );

  return ref;
}
