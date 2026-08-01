/* ============================================
   Home / Closing CTA — ported 1:1 from `mockup/index.html`
   --------------------------------------------
   Centred sign-off: the enquiry drawer on the left button, a direct
   dial (from `siteConfig`) on the right.
   ============================================ */

import React from 'react';
import { useModal } from '../../../context/ModalContext';
import { siteConfig, telHref } from '../../../data/siteConfig';
import { useReveal, REVEAL_PRESET } from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './ClosingCtaSection.module.css';

const ClosingCtaSection = () => {
  const { openLeadDrawer } = useModal();
  const eyebrowRef = useReveal(REVEAL_PRESET);
  const headRef = useReveal({ ...REVEAL_PRESET, delay: 0.05 });
  const actionsRef = useReveal({ ...REVEAL_PRESET, delay: 0.12 });

  return (
    <section className={`${layout.section} ${styles.section}`}>
      <div className={layout.container}>
        <p className="eyebrow" ref={eyebrowRef}>
          Beyond business support
        </p>
        <h2 className={styles.head} ref={headRef}>
          Let&rsquo;s strengthen your organization for{' '}
          <em className="serif grad-text">what comes next.</em>
        </h2>
        <div className={styles.actions} ref={actionsRef}>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => openLeadDrawer('home-cta')}
          >
            Start a Conversation <span aria-hidden="true">&rarr;</span>
          </button>
          <a href={telHref} className="btn btn--outline">
            Call {siteConfig.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ClosingCtaSection;
