/* ============================================
   About / Our difference — ported 1:1 from `mockup/about.html`
   --------------------------------------------
   Grey band: the positioning statement over six numbered white cards
   (the perspectives we work across), closed by the bold one-liner.
   ============================================ */

import React from 'react';
import {
  useReveal,
  useStaggerReveal,
  REVEAL_PRESET,
  STAGGER_PRESET,
} from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './DifferenceSection.module.css';

const PERSPECTIVES = [
  { num: '01', title: 'Industry Understanding' },
  { num: '02', title: 'Business Intelligence' },
  { num: '03', title: 'People Expertise' },
  { num: '04', title: 'Leadership Capability' },
  { num: '05', title: 'Corporate Structure' },
  { num: '06', title: 'Professional Development' },
];

const DifferenceSection = () => {
  const eyebrowRef = useReveal(REVEAL_PRESET);
  const headRef = useReveal({ ...REVEAL_PRESET, delay: 0.05 });
  const introRef = useReveal({ ...REVEAL_PRESET, delay: 0.1 });
  const cardsRef = useStaggerReveal(STAGGER_PRESET);
  const closingRef = useReveal(REVEAL_PRESET);

  return (
    <section className={`${layout.section} ${layout.sectionGrey}`}>
      <div className={layout.container}>
        <p className="eyebrow" ref={eyebrowRef}>
          Our difference
        </p>
        <h2 className={`section-head ${styles.head}`} ref={headRef}>
          Specialized where experience matters.{' '}
          <em className="serif">Broad enough to see the bigger picture.</em>
        </h2>
        <p className={`body-md ${styles.intro}`} ref={introRef}>
          We do not believe every business challenge fits into a predefined
          service. Our approach begins with understanding the context. Together,
          this creates a distinctive perspective across:
        </p>

        <div className={styles.cards} ref={cardsRef}>
          {PERSPECTIVES.map((item) => (
            <div className={styles.card} key={item.num}>
              <span className={styles.num}>{item.num}</span>
              <span className={styles.title}>{item.title}</span>
            </div>
          ))}
        </div>

        <p className={styles.closing} ref={closingRef}>
          We believe the greatest value is created when these perspectives work
          together.
        </p>
      </div>
    </section>
  );
};

export default DifferenceSection;
