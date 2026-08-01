/* ============================================
   ExpertisePage — stub
   --------------------------------------------
   Placeholder carrying only the mockup's hero headline
   (`mockup/expertise.html`). The ten-item accordion and its
   `#e01`–`#e10` deep links land in Prompt 05.
   ============================================ */

import React from 'react';
import styles from './ExpertisePage.module.css';

const ExpertisePage = () => (
  <section className={styles.hero}>
    <p className="eyebrow">Our expertise</p>
    <h1 className="display display--sm">
      Experience that connects{' '}
      <em className="serif grad-text">people, processes &amp; performance.</em>
    </h1>
  </section>
);

export default ExpertisePage;
