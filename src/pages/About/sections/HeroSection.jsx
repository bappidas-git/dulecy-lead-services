/* ============================================
   About / Hero — ported 1:1 from `mockup/about.html`
   --------------------------------------------
   Type-only hero (no backdrop on this page): eyebrow → headline with
   the serif-italic gradient line → lede → the bold closing statement,
   staggered in on load by `useHeroIntro` (the mockup's `data-hero`
   elements, marked with the same attribute here).
   ============================================ */

import React from 'react';
import { siteConfig } from '../../../data/siteConfig';
import { useHeroIntro } from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const heroRef = useHeroIntro();

  return (
    <section className={styles.hero}>
      <div ref={heroRef} className={`${layout.container} ${styles.inner}`}>
        <p className="eyebrow" data-hero>
          About us
        </p>

        <h1 className={`display display--md ${styles.head}`} data-hero>
          Built on experience.
          <br />
          <em className="serif grad-text">Defined by trust.</em>
        </h1>

        <p className={`lede ${styles.lede}`} data-hero>
          Business success is rarely determined by one function alone. It is
          shaped by the quality of its people, the strength of its processes,
          the visibility of its information, the discipline of its operations,
          and the ability of its leadership to make informed decisions.
        </p>

        <p className={styles.closing} data-hero>
          <b className="brand">{siteConfig.brandName}</b> brings these dimensions
          together.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
