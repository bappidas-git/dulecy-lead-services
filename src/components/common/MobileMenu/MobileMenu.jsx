/* ============================================
   MobileMenu — Dulecy Lead Services
   --------------------------------------------
   Full-screen overlay menu ported from `mockup/*.html` (.mobile-menu):
   numbered 01–05 links over the same NAV_LINKS the desktop nav uses,
   with a pinned foot holding the primary "Let's Talk" button and the
   tel/mailto meta row.

   Open state is owned by PublicLayout. This component closes on link
   click, locks body scroll while open and closes on Escape.
   ============================================ */

import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import { siteConfig, telHref, mailHref } from '../../../data/siteConfig';
import { NAV_LINKS } from '../../../data/navigation';
import styles from './MobileMenu.module.css';

const MobileMenu = ({ isOpen, onClose, id = 'mobile-menu' }) => {
  const { openLeadDrawer } = useModal();

  // Escape closes the menu; body scroll stays locked while it is open.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  const handleTalkClick = () => {
    onClose();
    openLeadDrawer('mobile-menu-cta');
  };

  return (
    <div
      id={id}
      className={`${styles.menu} ${isOpen ? styles.open : ''}`}
      aria-hidden={!isOpen}
    >
      <nav aria-label="Mobile">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <b>{link.num}</b>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.foot}>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleTalkClick}
        >
          Let&rsquo;s Talk <span aria-hidden="true">&rarr;</span>
        </button>
        <div className={styles.meta}>
          <a href={telHref} onClick={onClose}>
            {siteConfig.phoneDisplay}
          </a>
          <a href={mailHref} onClick={onClose}>
            {siteConfig.email}
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
