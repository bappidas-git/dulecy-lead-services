/* ============================================
   IndustriesPage — stub  (nav label "Who We Serve")
   --------------------------------------------
   Placeholder carrying only the mockup's hero headline
   (`mockup/industries.html`). The full page lands in Prompt 06.
   ============================================ */

import React from 'react';
import styles from './IndustriesPage.module.css';

const IndustriesPage = () => (
  <section className={styles.hero}>
    <p className="eyebrow">Who we serve</p>
    <h1 className="display display--md">
      Our expertise.
      <br />
      <em className="serif grad-text">Your industry.</em>
    </h1>
  </section>
);

export default IndustriesPage;
