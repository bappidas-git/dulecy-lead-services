/* ============================================
   Header — Dulcey Lead Services
   --------------------------------------------
   Fixed glass header ported 1:1 from `mockup/*.html` (.site-header):
   68px row, logo → desktop nav (≥920px) with a gradient active
   underline → "Let's Talk" pill, and a burger below 920px that morphs
   to an X. The mobile menu's open state is owned by PublicLayout and
   passed in, so the header stays a presentational shell.
   ============================================ */

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import { siteConfig, LOGO_SIZE } from '../../../data/siteConfig';
import { NAV_LINKS } from '../../../data/navigation';
import styles from './Header.module.css';

const Header = ({ isMenuOpen = false, onToggleMenu, menuId = 'mobile-menu' }) => {
  const { openLeadModal } = useModal();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          to="/"
          className={styles.logo}
          aria-label={`${siteConfig.brandName} — Home`}
        >
          {/* Drawn 40px tall (34px/29px on narrow phones — see the module CSS);
              the intrinsic size reserves the 6.76:1 box against layout shift. */}
          <img
            src={siteConfig.logo}
            alt={siteConfig.brandName}
            width={LOGO_SIZE.width}
            height={LOGO_SIZE.height}
            decoding="async"
          />
        </Link>

        <nav className={styles.nav} aria-label="Main">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            className={styles.navCta}
            onClick={() => openLeadModal('header-cta')}
          >
            Let&rsquo;s Talk <span aria-hidden="true">&rarr;</span>
          </button>
        </nav>

        <button
          type="button"
          className={`${styles.burger} ${isMenuOpen ? styles.open : ''}`}
          aria-label="Menu"
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          onClick={onToggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Header;
