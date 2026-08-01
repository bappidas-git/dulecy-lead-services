/* ============================================
   HomePage — stub
   --------------------------------------------
   Placeholder carrying only the mockup's hero headline
   (`mockup/index.html`). The full page lands in Prompt 03.
   ============================================ */

import React from 'react';
import { siteConfig } from '../../data/siteConfig';
import styles from './HomePage.module.css';

const HomePage = () => (
  <section className={styles.hero}>
    <p className="eyebrow">{siteConfig.tagline}</p>
    <h1 className="display">
      We don&rsquo;t just offer services.
      <br />
      We deliver <em className="serif grad-text">impact</em>.
    </h1>
  </section>
);

export default HomePage;
