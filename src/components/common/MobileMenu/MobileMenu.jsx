/* ============================================
   MobileMenu — Dulecy Lead Services
   --------------------------------------------
   Full-screen overlay menu ported from `mockup/*.html` (.mobile-menu):
   numbered 01–05 links over the same NAV_LINKS the desktop nav uses,
   with a pinned foot holding the primary "Let's Talk" button and the
   tel/mailto meta row.

   Open state is owned by PublicLayout. This component closes on link
   click, locks body scroll while open and closes on Escape.

   Keyboard behaviour (Prompt 12) mirrors `LeadModal`: opening moves focus
   to the first menu link, Tab cycles inside the overlay instead of walking
   onto the page hidden behind it, and closing hands focus back to the
   burger that opened it. When closed the overlay is `display: none`, so
   its links are already out of the tab order.
   ============================================ */

import React, { useCallback, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import { siteConfig, telHref, mailHref } from '../../../data/siteConfig';
import { NAV_LINKS } from '../../../data/navigation';
import styles from './MobileMenu.module.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const MobileMenu = ({ isOpen, onClose, id = 'mobile-menu' }) => {
  const { openLeadModal } = useModal();
  const menuRef = useRef(null);
  // Whatever had focus when the menu opened — in practice the burger.
  const openerRef = useRef(null);

  const focusableItems = useCallback(
    () => Array.from(menuRef.current?.querySelectorAll(FOCUSABLE) || []),
    []
  );

  // Escape closes the menu; Tab cycles inside it; body scroll stays locked
  // while it is open.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = focusableItems();
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !menuRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose, focusableItems]);

  // Move focus into the menu on open, and hand it back to the burger on
  // close. The opener is skipped if it has since been hidden — crossing the
  // 920px breakpoint closes the menu and removes the burger, and focusing a
  // `display: none` element would silently drop focus onto <body>.
  useEffect(() => {
    if (!isOpen) return undefined;

    openerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    focusableItems()[0]?.focus();

    return () => {
      const opener = openerRef.current;
      if (opener?.isConnected && opener.offsetParent !== null) opener.focus();
    };
  }, [isOpen, focusableItems]);

  const handleTalkClick = () => {
    onClose();
    openLeadModal('mobile-menu-cta');
  };

  return (
    /* One `nav` landmark wraps the whole panel so the foot (CTA + tel/mail
       row) is inside a landmark too — as a `div` it was orphaned content.
       The links keep their own grouping element, now a plain `div`. */
    <nav
      id={id}
      ref={menuRef}
      className={`${styles.menu} ${isOpen ? styles.open : ''}`}
      aria-label="Mobile"
      aria-hidden={!isOpen}
    >
      <div className={styles.links}>
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
      </div>

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
    </nav>
  );
};

export default MobileMenu;
