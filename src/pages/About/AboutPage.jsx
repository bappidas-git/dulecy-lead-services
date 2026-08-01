/* ============================================
   AboutPage — `/about`
   --------------------------------------------
   The six sections of `mockup/about.html`, in order. Each is its own
   component + module; the shared header, footer and enquiry drawer come
   from `PublicLayout` / `App`.
   ============================================ */

import React from 'react';
import HeroSection from './sections/HeroSection';
import IntersectionSection from './sections/IntersectionSection';
import PerspectiveSection from './sections/PerspectiveSection';
import DifferenceSection from './sections/DifferenceSection';
import PrinciplesSection from './sections/PrinciplesSection';
import CommitmentSection from './sections/CommitmentSection';
import styles from './AboutPage.module.css';

const AboutPage = () => (
  <div className={styles.page}>
    <HeroSection />
    <IntersectionSection />
    <PerspectiveSection />
    <DifferenceSection />
    <PrinciplesSection />
    <CommitmentSection />
  </div>
);

export default AboutPage;
