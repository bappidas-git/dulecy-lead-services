/* ============================================
   ContactPage — `/contact`, ported 1:1 from `mockup/contact.html`
   --------------------------------------------
   One hero-padded two-column block: the intro column (badge → headline
   → lede → the two contact cards → the serif pull-quote) beside the
   grey form panel, everything staggered in on load by `useHeroIntro`
   (the mockup's `data-hero` elements, marked with the same attribute
   here).

   The panel hosts the shared `UnifiedLeadForm` — the enquiry pipeline
   is untouched, only the panel chrome is the mockup's. The form's own
   field styling is rebuilt in Prompt 07.

   Every contact value comes from `siteConfig` (the single source of
   business truth), never hardcoded here.
   ============================================ */

import React from 'react';
import UnifiedLeadForm from '../../components/common/UnifiedLeadForm/UnifiedLeadForm';
import { siteConfig, telHref, mailHref } from '../../data/siteConfig';
import { useHeroIntro } from '../../animations';
import layout from '../../styles/layout.module.css';
import styles from './ContactPage.module.css';

// Icons8 CDN glyphs, as in the mockup — self-hosted in Prompt 12.
const ICON_PHONE = 'https://img.icons8.com/ios-filled/100/D5192E/phone.png';
const ICON_MAIL = 'https://img.icons8.com/ios-filled/100/D5192E/new-post.png';

const ContactPage = () => {
  const heroRef = useHeroIntro();

  return (
    <div className={styles.page}>
      <section className={`${layout.container} ${styles.inner}`}>
        <div className={styles.grid} ref={heroRef}>
          {/* ========== Intro column ========== */}
          <div className={styles.intro}>
            <div className={styles.badge} data-hero>
              <span className={styles.dot} aria-hidden="true" /> We usually
              reply within a day
            </div>

            <h1 className={`display ${styles.head}`} data-hero>
              Let&rsquo;s build{' '}
              <em className="serif grad-text">what comes next.</em>
            </h1>

            <p className={`lede ${styles.lede}`} data-hero>
              Whether you are strengthening HR systems, analysing performance,
              protecting a brand, developing leaders, or setting up something
              new — it starts with one conversation.
            </p>

            <div className={styles.cards} data-hero>
              <a href={telHref} className={styles.card}>
                <i aria-hidden="true">
                  <img src={ICON_PHONE} alt="" />
                </i>
                <span>
                  <span className={styles.cardKey}>Call us</span>
                  <span className={`${styles.cardValue} ${styles.valuePhone}`}>
                    {siteConfig.phoneDisplay}
                  </span>
                </span>
              </a>

              <a href={mailHref} className={styles.card}>
                <i aria-hidden="true">
                  <img src={ICON_MAIL} alt="" />
                </i>
                <span className={styles.cardText}>
                  <span className={styles.cardKey}>Email us</span>
                  <span className={`${styles.cardValue} ${styles.valueMail}`}>
                    {siteConfig.email}
                  </span>
                </span>
              </a>
            </div>

            <div className={styles.quote} data-hero>
              <p className={`serif ${styles.quoteText}`}>
                &ldquo;Your partner in business leadership.&rdquo;
              </p>
            </div>
          </div>

          {/* ========== Form panel ========== */}
          <div className={styles.formPanel} data-hero>
            <h2 className={styles.formHead}>Send us an enquiry</h2>
            <p className={styles.formSub}>
              One unified form for every requirement — we&rsquo;ll route it to
              the right expertise.
            </p>

            <UnifiedLeadForm
              variant="default"
              source="contact-page"
              formId="contact-page"
              showTitle={false}
              showSubtitle={false}
              showTrustBadges={true}
              showConsent={true}
              submitButtonText="Send Enquiry"
              className={styles.formInner}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
