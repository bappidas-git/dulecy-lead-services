/* ============================================
   About / Our commitment — ported 1:1 from `mockup/about.html`
   --------------------------------------------
   Centred sign-off: the four "behind the …" phrases stacked and
   staggered in, then the enquiry modal on the left button and
   /expertise on the right.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import {
  useReveal,
  useStaggerReveal,
  REVEAL_PRESET,
  STAGGER_PRESET,
} from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './CommitmentSection.module.css';

// Each phrase closes on a red serif-italic fragment.
const PHRASES = [
  { lead: 'The business behind', accent: 'the brief.' },
  { lead: 'The people behind', accent: 'the organization.' },
  { lead: 'The challenge behind', accent: 'the numbers.' },
  { lead: 'The opportunity behind', accent: 'the problem.' },
];

const CommitmentSection = () => {
  const { openLeadModal } = useModal();
  const eyebrowRef = useReveal(REVEAL_PRESET);
  const introRef = useReveal({ ...REVEAL_PRESET, delay: 0.05 });
  const phrasesRef = useStaggerReveal(STAGGER_PRESET);
  const actionsRef = useReveal(REVEAL_PRESET);

  return (
    <section className={`${layout.section} ${styles.section}`}>
      <div className={`${layout.container} ${styles.inner}`}>
        <p className="eyebrow" ref={eyebrowRef}>
          Our commitment
        </p>
        <p className={styles.intro} ref={introRef}>
          We believe meaningful professional partnerships begin with
          understanding what lies behind the requirement.
        </p>

        <div className={styles.phrases} ref={phrasesRef}>
          {PHRASES.map((phrase) => (
            <span className={styles.phrase} key={phrase.accent}>
              {phrase.lead}{' '}
              <em className={`serif ${styles.accent}`}>{phrase.accent}</em>
            </span>
          ))}
        </div>

        <div className={styles.actions} ref={actionsRef}>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => openLeadModal('about-cta')}
          >
            Work With Us <span aria-hidden="true">&rarr;</span>
          </button>
          <Link to="/expertise" className="btn btn--outline">
            Explore Our Expertise
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CommitmentSection;
