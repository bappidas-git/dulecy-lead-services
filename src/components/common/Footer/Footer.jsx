/* ============================================
   Footer — Dulecy Lead Services
   --------------------------------------------
   Dark footer ported 1:1 from `mockup/*.html` (.site-footer):
   CTA row → brand / Explore / Get-in-touch columns → giant DULECY
   outline watermark → legal row. Every contact value comes from
   `siteConfig`; the Explore column maps over the shared NAV_LINKS.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import { siteConfig, telHref, mailHref, logoAt } from '../../../data/siteConfig';
import { NAV_LINKS } from '../../../data/navigation';
import styles from './Footer.module.css';

// The mockup's icons8 glyphs, self-hosted since Prompt 12 (the footer sits on
// ink, so it uses the brighter red-hi variant). Refresh with
// `npm run generate:images`.
const ICON_PHONE = '/images/icons/phone-f0293e.png';
const ICON_MAIL = '/images/icons/new-post-f0293e.png';

const Footer = () => {
  const { openLeadModal } = useModal();

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.cta}>
          <h2>
            Ready to move{' '}
            <em className={styles.serif}>beyond business support?</em>
          </h2>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => openLeadModal('footer-cta')}
          >
            Start a Conversation <span aria-hidden="true">&rarr;</span>
          </button>
        </div>

        <div className={styles.cols}>
          <div className={styles.brand}>
            <Link to="/" aria-label={`${siteConfig.brandName} — Home`}>
              {/* Drawn 52px tall; requested at 2× for retina. */}
              <img
                src={logoAt(siteConfig.logoWhite, { h: 128 })}
                alt={siteConfig.brandName}
                width="485"
                height="128"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p>
              A professional business support and consulting organization —
              helping businesses, institutions, entrepreneurs, and professionals
              build for sustainable growth.
            </p>
            <p className={styles.tagline}>{siteConfig.taglineSecondary}</p>
          </div>

          <div className={styles.col}>
            <h3>Explore</h3>
            <nav className={styles.nav} aria-label="Footer">
              {NAV_LINKS.map((link) => (
                <Link key={link.to} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className={`${styles.col} ${styles.colWide}`}>
            <h3>Get in touch</h3>
            <div className={styles.contact}>
              <a href={telHref}>
                <i>
                  <img
                    src={ICON_PHONE}
                    alt=""
                    width="100"
                    height="100"
                    loading="lazy"
                    decoding="async"
                  />
                </i>
                <span>
                  <span className={styles.k}>Call us</span>
                  <span className={`${styles.v} ${styles.vPhone}`}>
                    {siteConfig.phoneDisplay}
                  </span>
                </span>
              </a>
              <a href={mailHref}>
                <i>
                  <img
                    src={ICON_MAIL}
                    alt=""
                    width="100"
                    height="100"
                    loading="lazy"
                    decoding="async"
                  />
                </i>
                <span>
                  <span className={styles.k}>Email us</span>
                  <span className={`${styles.v} ${styles.vMail}`}>
                    {siteConfig.email}
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.watermark} aria-hidden="true">
          DULECY
        </div>

        <div className={styles.legal}>
          <span>
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </span>
          <span className={styles.serif}>{siteConfig.tagline}.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
