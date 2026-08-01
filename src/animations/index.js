/* ============================================
   Animation foundation — barrel export
   The mandatory GSAP + ScrollTrigger pattern for all
   public page sections. Import hooks from here:

     import { useReveal, useStaggerReveal } from '../../../animations';
   ============================================ */

export {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE,
  EASE_IN_OUT,
  DURATION,
  REVEAL_START,
  START,
  REVEAL_PRESET,
  STAGGER_PRESET,
  parallaxPreset,
  scheduleRefresh,
  prefersReducedMotion,
} from './gsapSetup';

export { default as useReveal } from './useReveal';
export { default as useStaggerReveal } from './useStaggerReveal';
export { default as useCountUp } from './useCountUp';
export { default as useParallax } from './useParallax';
export { default as useHeroIntro } from './useHeroIntro';
export { default as useLineReveal } from './useLineReveal';
