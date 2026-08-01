/* ============================================
   AboutPage — stub
   --------------------------------------------
   Placeholder carrying only the mockup's hero headline
   (`mockup/about.html`). The full page lands in Prompt 04.
   ============================================ */

import React from 'react';
import styles from './AboutPage.module.css';

const AboutPage = () => (
  <section className={styles.hero}>
    <p className="eyebrow">About us</p>
    <h1 className="display display--md">
      Built on experience.
      <br />
      <em className="serif grad-text">Defined by trust.</em>
    </h1>
  </section>
);

export default AboutPage;
