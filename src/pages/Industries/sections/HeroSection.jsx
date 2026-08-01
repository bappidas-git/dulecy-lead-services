/* ============================================
   Who We Serve / Hero — ported 1:1 from `mockup/industries.html`
   --------------------------------------------
   Parallaxed Unsplash backdrop under the page's own double white
   scrim, then eyebrow → headline with the serif-italic gradient line →
   lede. The mockup's `data-hero` elements stagger in on load via
   `useHeroIntro`, and carry the same attribute here. Bottom padding is
   shorter than the default hero — the sector grid opens right below.
   ============================================ */

import React from 'react';
import { useHeroIntro, useParallax, parallaxPreset } from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './HeroSection.module.css';

// Mockup asset — self-hosted in Prompt 12.
const HERO_BG =
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2400&auto=format&fit=crop';

const HeroSection = () => {
  const heroRef = useHeroIntro();
  const bgRef = useParallax(parallaxPreset(-16));

  return (
    <section className={styles.hero}>
      <img
        ref={bgRef}
        className={styles.bg}
        src={HERO_BG}
        alt=""
        aria-hidden="true"
        width="2400"
        height="1600"
        decoding="async"
      />
      <div className={styles.scrim} aria-hidden="true" />

      <div ref={heroRef} className={`${layout.container} ${styles.inner}`}>
        <p className="eyebrow" data-hero>
          Who we serve
        </p>

        <h1 className={`display display--md ${styles.head}`} data-hero>
          Our expertise.
          <br />
          <em className="serif grad-text">Your industry.</em>
        </h1>

        <p className={`lede ${styles.lede}`} data-hero>
          Our experience and professional perspective are adaptable to different
          sectors, organizational environments, and stages of growth.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
