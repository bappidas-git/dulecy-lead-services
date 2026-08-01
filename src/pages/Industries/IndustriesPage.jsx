/* ============================================
   IndustriesPage — `/industries`  (nav label "Who We Serve")
   --------------------------------------------
   The three blocks of `mockup/industries.html`, in order: the
   parallaxed hero, the seven-sector grid closed by the red enquiry
   card, and the grey "One partner. Many dimensions." sign-off. The
   shared header, footer and enquiry drawer come from `PublicLayout` /
   `App`.
   ============================================ */

import React from 'react';
import HeroSection from './sections/HeroSection';
import SectorsSection from './sections/SectorsSection';
import CtaSection from './sections/CtaSection';
import styles from './IndustriesPage.module.css';

const IndustriesPage = () => (
  <div className={styles.page}>
    <HeroSection />
    <SectorsSection />
    <CtaSection />
  </div>
);

export default IndustriesPage;
