/* ============================================
   ExpertisePage — `/expertise`
   --------------------------------------------
   The three blocks of `mockup/expertise.html`, in order: the hero, the
   ten-item accordion (with its `#e01`–`#e10` deep links), and the grey
   "Start with a conversation" sign-off. The shared header, footer and
   enquiry drawer come from `PublicLayout` / `App`.
   ============================================ */

import React from 'react';
import HeroSection from './sections/HeroSection';
import ExpertiseAccordion from './sections/ExpertiseAccordion';
import CtaSection from './sections/CtaSection';
import styles from './ExpertisePage.module.css';

const ExpertisePage = () => (
  <div className={styles.page}>
    <HeroSection />
    <ExpertiseAccordion />
    <CtaSection />
  </div>
);

export default ExpertisePage;
