/* ============================================
   HomePage — `/`
   --------------------------------------------
   The seven sections of `mockup/index.html`, in order. Each is its own
   component + module; the shared header, footer and enquiry modal come
   from `PublicLayout` / `App`.
   ============================================ */

import React from 'react';
import HeroSection from './sections/HeroSection';
import MarqueeStrip from './sections/MarqueeStrip';
import WhoWeAreSection from './sections/WhoWeAreSection';
import BeliefSection from './sections/BeliefSection';
import ExpertiseIndexSection from './sections/ExpertiseIndexSection';
import WhoWeServeSection from './sections/WhoWeServeSection';
import ClosingCtaSection from './sections/ClosingCtaSection';
import styles from './HomePage.module.css';

const HomePage = () => (
  <div className={styles.page}>
    <HeroSection />
    <MarqueeStrip />
    <WhoWeAreSection />
    <BeliefSection />
    <ExpertiseIndexSection />
    <WhoWeServeSection />
    <ClosingCtaSection />
  </div>
);

export default HomePage;
