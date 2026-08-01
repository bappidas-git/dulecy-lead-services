/* ============================================
   About / A distinctive perspective — ported 1:1 from
   `mockup/about.html`
   --------------------------------------------
   Split section: heading + wiped-in rule on the left, the positioning
   paragraph and the three grey qualifier tiles on the right.
   ============================================ */

import React from 'react';
import {
  useReveal,
  useStaggerReveal,
  useLineReveal,
  REVEAL_PRESET,
  STAGGER_PRESET,
} from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './PerspectiveSection.module.css';

const TILES = [
  { title: 'Practical', desc: 'enough to implement.' },
  { title: 'Structured', desc: 'enough to endure.' },
  { title: 'Thoughtful', desc: 'enough to create lasting value.' },
];

const PerspectiveSection = () => {
  const eyebrowRef = useReveal(REVEAL_PRESET);
  const headRef = useReveal({ ...REVEAL_PRESET, delay: 0.05 });
  const ruleRef = useLineReveal();
  const leadRef = useReveal(REVEAL_PRESET);
  const tilesRef = useStaggerReveal(STAGGER_PRESET);

  return (
    <section className={layout.section}>
      <div className={`${layout.container} ${layout.split}`}>
        <div className={layout.splitAside}>
          <p className="eyebrow" ref={eyebrowRef}>
            A distinctive perspective
          </p>
          <h2 className={`section-head ${styles.head}`} ref={headRef}>
            Depth in pharma. Breadth across sectors.
          </h2>
          <div className="rule" ref={ruleRef} />
        </div>

        <div className={layout.splitMain}>
          <p className={`body-lg ${styles.lead}`} ref={leadRef}>
            Our experience in pharmaceutical business and healthcare operations
            gives us a distinctive understanding of complex business
            environments. Our wider expertise in HR, analytics, leadership,
            corporate services, and professional development allows us to bring
            that perspective to organizations across sectors.
          </p>

          <div className={styles.tiles} ref={tilesRef}>
            {TILES.map((tile) => (
              <div className={styles.tile} key={tile.title}>
                <p className={styles.tileTitle}>{tile.title}</p>
                <p className={styles.tileDesc}>{tile.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerspectiveSection;
