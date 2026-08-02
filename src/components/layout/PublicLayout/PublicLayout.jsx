/* ============================================
   PublicLayout — the shared Dulcey shell
   --------------------------------------------
   Every public route renders inside this layout (skip link → fixed
   Header → full-screen MobileMenu → <main id="main-content"> → dark
   Footer), so the shell is defined exactly once and stays mounted
   across navigations.

   It also owns the mobile menu's open state: the burger toggles it,
   any route change closes it, and crossing the 920px breakpoint
   closes it so the body scroll lock can never outlive the overlay.
   ============================================ */

import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../common/Header/Header';
import MobileMenu from '../../common/MobileMenu/MobileMenu';
import Footer from '../../common/Footer/Footer';
import styles from './PublicLayout.module.css';

const MENU_ID = 'mobile-menu';
const DESKTOP_QUERY = '(min-width: 920px)';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((open) => !open), []);

  // Any navigation closes the overlay.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  // The desktop nav takes over at 920px — the overlay must not survive it.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const mql = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (event) => {
      if (event.matches) setIsMenuOpen(false);
    };

    handleChange(mql);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={styles.shell}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header
        isMenuOpen={isMenuOpen}
        onToggleMenu={toggleMenu}
        menuId={MENU_ID}
      />
      <MobileMenu id={MENU_ID} isOpen={isMenuOpen} onClose={closeMenu} />

      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
