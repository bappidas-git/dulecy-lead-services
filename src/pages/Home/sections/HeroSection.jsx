/* ============================================
   Home / Hero — ported 1:1 from `mockup/index.html`
   --------------------------------------------
   Parallaxed Unsplash backdrop under a double white scrim, a floating
   Dulecy icon, then the badge → headline → lede → CTAs → four pillars,
   all staggered in on load by `useHeroIntro` (the mockup's `data-hero`
   elements, marked with the same attribute here).
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import { siteConfig } from '../../../data/siteConfig';
import { useHeroIntro, useParallax, parallaxPreset } from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './HeroSection.module.css';

// Mockup asset — self-hosted in Prompt 12.
const HERO_BG =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2400&auto=format&fit=crop';

const PILLARS = [
  { num: '01', label: 'Business Solutions' },
  { num: '02', label: 'People & Organization' },
  { num: '03', label: 'Corporate Services' },
  { num: '04', label: 'Leadership & Capability' },
];

const HeroSection = () => {
  const { openLeadModal } = useModal();
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
        <img
          className={styles.float}
          src={siteConfig.logoIcon}
          alt=""
          aria-hidden="true"
        />

        <div className={styles.badge} data-hero>
          <span className={styles.dot} aria-hidden="true" /> {siteConfig.tagline}
        </div>

        <h1 className="display" data-hero>
          We don&rsquo;t just offer services.
          <br />
          We deliver <em className="serif grad-text">impact</em>.
        </h1>

        <p className={`lede ${styles.lede}`} data-hero>
          {siteConfig.brandName} works with businesses, institutions,
          entrepreneurs, and professionals to navigate complexity, strengthen
          organizational capability, and build for sustainable growth.
        </p>

        <div className={styles.cta} data-hero>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => openLeadModal('home-hero')}
          >
            Start a Conversation <span aria-hidden="true">&rarr;</span>
          </button>
          <Link to="/expertise" className="btn btn--outline">
            Explore Our Expertise
          </Link>
        </div>

        <div className={styles.pillars} data-hero>
          {PILLARS.map((pillar) => (
            <div key={pillar.num}>
              <b>{pillar.num}</b>
              <span>{pillar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
