/* ============================================
   Expertise / Start with a conversation — ported 1:1 from
   `mockup/expertise.html`
   --------------------------------------------
   Grey split sign-off: the pitch on the left, three stacked action
   cards on the right — the enquiry drawer, then a direct dial and a
   mailto, both read from `siteConfig`.
   ============================================ */

import React from 'react';
import { useModal } from '../../../context/ModalContext';
import { siteConfig, telHref, mailHref } from '../../../data/siteConfig';
import {
  useReveal,
  useStaggerReveal,
  REVEAL_PRESET,
  STAGGER_PRESET,
} from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './CtaSection.module.css';

// Icons8 CDN glyphs, as in the mockup — self-hosted in Prompt 12.
const ICON_PHONE = 'https://img.icons8.com/ios-filled/100/D5192E/phone.png';
const ICON_MAIL = 'https://img.icons8.com/ios-filled/100/D5192E/new-post.png';

const CtaSection = () => {
  const { openLeadDrawer } = useModal();
  const eyebrowRef = useReveal(REVEAL_PRESET);
  const headRef = useReveal({ ...REVEAL_PRESET, delay: 0.05 });
  const bodyRef = useReveal({ ...REVEAL_PRESET, delay: 0.1 });
  const actionsRef = useStaggerReveal(STAGGER_PRESET);

  return (
    <section className={`${layout.section} ${layout.sectionGrey}`}>
      <div className={`${layout.container} ${styles.split}`}>
        <div className={styles.text}>
          <p className="eyebrow" ref={eyebrowRef}>
            Not sure where to start?
          </p>
          <h2 className={`section-head ${styles.head}`} ref={headRef}>
            Start with <em className="serif grad-text">a conversation.</em>
          </h2>
          <p className={`body-md ${styles.body}`} ref={bodyRef}>
            We don&rsquo;t believe every business challenge fits into a
            predefined service. Tell us your context — we&rsquo;ll bring the
            perspective.
          </p>
        </div>

        <div className={styles.actions} ref={actionsRef}>
          <button
            type="button"
            className={`${styles.action} ${styles.actionRed}`}
            onClick={() => openLeadDrawer('expertise-cta')}
          >
            <span className={styles.actionBody}>
              <span className={styles.actionTitle}>Send us an enquiry</span>
              <span className={styles.actionSub}>
                One form, routed to the right expertise
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

          <a
            href={mailHref}
            className={`${styles.action} ${styles.actionWhite}`}
          >
            <span className={styles.actionBody}>
              <span className={`${styles.actionTitle} ${styles.titleMail}`}>
                {siteConfig.email}
              </span>
              <span className={styles.actionSub}>Write to us anytime</span>
            </span>
            <i aria-hidden="true">
              <img src={ICON_MAIL} alt="" />
            </i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
