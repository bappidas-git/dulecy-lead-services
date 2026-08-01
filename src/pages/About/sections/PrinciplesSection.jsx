/* ============================================
   About / The principles behind our work — ported 1:1 from
   `mockup/about.html`
   --------------------------------------------
   Second dark band: the five principles as cards that lift on hover,
   staggered in as the row scrolls into view.
   ============================================ */

import React from 'react';
import {
  useReveal,
  useStaggerReveal,
  REVEAL_PRESET,
  STAGGER_PRESET,
} from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './PrinciplesSection.module.css';

const PRINCIPLES = [
  {
    num: '01',
    name: 'Trust',
    desc: 'Professional relationships built on integrity, accountability, and consistency.',
  },
  {
    num: '02',
    name: 'Security',
    desc: 'Responsible systems and processes that support stronger organizational control.',
  },
  {
    num: '03',
    name: 'Compliance',
    desc: 'A disciplined approach to documentation, processes, and responsible business practices.',
  },
  {
    num: '04',
    name: 'Confidentiality',
    desc: 'Sensitive business and organizational information deserves discretion, care, and responsible handling.',
  },
  {
    num: '05',
    name: 'Professionalism',
    desc: 'Every engagement is approached with respect, discipline, and a commitment to quality.',
  },
];

const PrinciplesSection = () => {
  const eyebrowRef = useReveal(REVEAL_PRESET);
  const headRef = useReveal({ ...REVEAL_PRESET, delay: 0.05 });
  const cardsRef = useStaggerReveal(STAGGER_PRESET);

  return (
    <section className={layout.sectionDark}>
      <div className={`${layout.container} ${layout.section}`}>
        <p className="eyebrow" ref={eyebrowRef}>
          The principles behind our work
        </p>
        <h2 className={styles.head} ref={headRef}>
          Trust. Security. Compliance. Confidentiality. Professionalism.
        </h2>

        <div className={styles.principles} ref={cardsRef}>
          {PRINCIPLES.map((principle) => (
            <div className={styles.principle} key={principle.num}>
              <span className={styles.top}>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.num}>{principle.num}</span>
              </span>
              <span className={styles.name}>{principle.name}</span>
              <span className={styles.desc}>{principle.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrinciplesSection;
