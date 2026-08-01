/* ============================================
   Expertise / Hero — ported 1:1 from `mockup/expertise.html`
   --------------------------------------------
   Light, type-only hero with reduced bottom padding (the accordion
   follows immediately): eyebrow → headline with the serif-italic
   gradient close → lede → the dashed "Tap any area to expand" helper.
   The mockup's `data-hero` elements stagger in on load via
   `useHeroIntro`, and carry the same attribute here.
   ============================================ */

import React from 'react';
import { useHeroIntro } from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const heroRef = useHeroIntro();

  return (
    <section className={styles.hero}>
      <div ref={heroRef} className={`${layout.container} ${styles.inner}`}>
        <p className="eyebrow" data-hero>
          Our expertise
        </p>

        <h1 className={`display display--sm ${styles.head}`} data-hero>
          Experience that connects{' '}
          <em className="serif grad-text">
            people, processes &amp; performance.
          </em>
        </h1>

        <p className={`lede ${styles.lede}`} data-hero>
          Ten connected areas of experience — the perspective organizations
          value when building stronger foundations, improving performance, and
          moving forward with confidence.
        </p>

        <p className={styles.helper} data-hero>
          <span aria-hidden="true" className={styles.dash} />
          Tap any area to expand
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
