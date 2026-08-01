/* ============================================
   Home / Belief band — ported 1:1 from `mockup/index.html`
   --------------------------------------------
   Centred ink band with a red radial glow drifting behind it
   (`data-parallax="-10"`, scrubbed against the band). The statement
   closes on a serif-italic red sentence.
   ============================================ */

import React from 'react';
import {
  useReveal,
  useParallax,
  REVEAL_PRESET,
  parallaxPreset,
} from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './BeliefSection.module.css';

const BeliefSection = () => {
  const glowRef = useParallax(parallaxPreset(-10));
  const eyebrowRef = useReveal(REVEAL_PRESET);
  const statementRef = useReveal({ ...REVEAL_PRESET, delay: 0.06 });

  return (
    <section className={layout.sectionDark}>
      <div
        ref={glowRef}
        className={`glow ${styles.glow}`}
        aria-hidden="true"
      />
      <div className={`${layout.container} ${layout.section} ${styles.inner}`}>
        <p className={`eyebrow ${styles.eyebrow}`} ref={eyebrowRef}>
          Our approach is grounded in a simple belief
        </p>
        <p className={styles.statement} ref={statementRef}>
          The right professional partnership should do more than address
          today&rsquo;s requirement.{' '}
          <em className="serif">
            It should strengthen the organization for what comes next.
          </em>
        </p>
      </div>
    </section>
  );
};

export default BeliefSection;
