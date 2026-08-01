/* ============================================
   Home / Expertise index — ported 1:1 from `mockup/index.html`
   --------------------------------------------
   The ten areas as an index of rows, driven by `expertiseData`. Each
   row deep-links to its accordion item on /expertise (#e01 … #e10);
   the rows stagger in together as the list scrolls into view.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  expertiseAreas,
  homeTaglineFor,
} from '../../../data/expertiseData';
import {
  useReveal,
  useStaggerReveal,
  REVEAL_PRESET,
  STAGGER_PRESET,
} from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './ExpertiseIndexSection.module.css';

const ExpertiseIndexSection = () => {
  const eyebrowRef = useReveal(REVEAL_PRESET);
  const headRef = useReveal({ ...REVEAL_PRESET, delay: 0.05 });
  const linkRef = useReveal({ ...REVEAL_PRESET, delay: 0.1 });
  const rowsRef = useStaggerReveal(STAGGER_PRESET);

  return (
    <section className={layout.section}>
      <div className={layout.container}>
        <div className={styles.head}>
          <div className={styles.headText}>
            <p className="eyebrow" ref={eyebrowRef}>
              Our expertise
            </p>
            <h2 className="section-head" ref={headRef}>
              Experience that connects people, processes &amp; performance.
            </h2>
          </div>
          <Link className="link-more" to="/expertise" ref={linkRef}>
            View all in detail <i aria-hidden="true">&rarr;</i>
          </Link>
        </div>

        <div className={styles.rows} ref={rowsRef}>
          {expertiseAreas.map((area) => (
            <Link key={area.id} to={`/expertise#${area.id}`}>
              <b>{area.num}</b>
              <span className={styles.body}>
                <span className={styles.title}>{area.title}</span>
                <span className={styles.tag}>{homeTaglineFor(area)}</span>
              </span>
              <i aria-hidden="true">&#8599;</i>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseIndexSection;
