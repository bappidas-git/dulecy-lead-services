/* ============================================
   Who We Serve / One partner. Many dimensions. — ported 1:1 from
   `mockup/industries.html`
   --------------------------------------------
   Grey split sign-off: the pitch on the left, three stacked action
   cards on the right — the enquiry modal, a direct dial read from
   `siteConfig`, and a route into /expertise.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import { siteConfig, telHref } from '../../../data/siteConfig';
import {
  useReveal,
  useStaggerReveal,
  REVEAL_PRESET,
  STAGGER_PRESET,
} from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './CtaSection.module.css';

// Icons8 CDN glyph, as in the mockup — self-hosted in Prompt 12.
const ICON_PHONE = 'https://img.icons8.com/ios-filled/100/D5192E/phone.png';

const CtaSection = () => {
  const { openLeadModal } = useModal();
  const eyebrowRef = useReveal(REVEAL_PRESET);
  const headRef = useReveal({ ...REVEAL_PRESET, delay: 0.05 });
  const bodyRef = useReveal({ ...REVEAL_PRESET, delay: 0.1 });
  const actionsRef = useStaggerReveal(STAGGER_PRESET);

  return (
    <section className={`${layout.section} ${layout.sectionGrey}`}>
      <div className={`${layout.container} ${styles.split}`}>
        <div className={styles.text}>
          <p className="eyebrow" ref={eyebrowRef}>
            One partner. Many dimensions.
          </p>
          <h2 className={`section-head ${styles.head}`} ref={headRef}>
            Specialized where experience matters.{' '}
            <em className="serif grad-text">
              Flexible where business needs evolve.
            </em>
          </h2>
          <p className={`body-md ${styles.body}`} ref={bodyRef}>
            Whatever your sector or stage of growth, our approach begins with
            your context — not a predefined service.
          </p>
        </div>

        <div className={styles.actions} ref={actionsRef}>
          <button
            type="button"
            className={`${styles.action} ${styles.actionRed}`}
            onClick={() => openLeadModal('industries-cta-2')}
          >
            <span className={styles.actionBody}>
              <span className={styles.actionTitle}>Start a conversation</span>
              <span className={styles.actionSub}>
                Tell us about your organization
              </span>
            </span>
            <i aria-hidden="true">&rarr;</i>
          </button>

          <a href={telHref} className={`${styles.action} ${styles.actionWhite}`}>
            <span className={styles.actionBody}>
              <span className={`${styles.actionTitle} ${styles.titlePhone}`}>
                {siteConfig.phoneDisplay}
              </span>
              <span className={styles.actionSub}>Talk to us directly</span>
            </span>
            <i aria-hidden="true">
              <img src={ICON_PHONE} alt="" />
            </i>
          </a>

          <Link
            to="/expertise"
            className={`${styles.action} ${styles.actionWhite}`}
          >
            <span className={styles.actionBody}>
              <span className={styles.actionTitle}>Explore our expertise</span>
              <span className={styles.actionSub}>
                Ten connected areas of experience
              </span>
            </span>
            <i aria-hidden="true">&#8599;</i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
