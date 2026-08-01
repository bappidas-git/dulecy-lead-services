/* ============================================
   Home / Who we serve — ported 1:1 from `mockup/index.html`
   --------------------------------------------
   The seven sectors as short cards (the home-page copy carried by
   `industriesData`), closed by a red gradient card into /industries.
   The grid staggers in as it scrolls into view.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { industries } from '../../../data/industriesData';
import {
  useReveal,
  useStaggerReveal,
  REVEAL_PRESET,
  STAGGER_PRESET,
} from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './WhoWeServeSection.module.css';

const WhoWeServeSection = () => {
  const eyebrowRef = useReveal(REVEAL_PRESET);
  const headRef = useReveal({ ...REVEAL_PRESET, delay: 0.05 });
  const cardsRef = useStaggerReveal(STAGGER_PRESET);

  return (
    <section className={`${layout.section} ${layout.sectionGrey}`}>
      <div className={layout.container}>
        <p className="eyebrow" ref={eyebrowRef}>
          Who we serve
        </p>
        <h2 className={`section-head ${styles.head}`} ref={headRef}>
          Our expertise. <em className="serif">Your industry.</em>
        </h2>

        <div className={styles.cards} ref={cardsRef}>
          {industries.map((industry) => (
            <Link className={styles.card} to="/industries" key={industry.num}>
              <span className={styles.title}>{industry.homeTitle}</span>
              <span className={styles.desc}>{industry.homeDesc}</span>
            </Link>
          ))}

          <Link
            className={`${styles.card} ${styles.cardRed}`}
            to="/industries"
          >
            <span className={`${styles.title} ${styles.titleRed}`}>
              See how we adapt to your sector
            </span>
            <i aria-hidden="true">&rarr;</i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhoWeServeSection;
