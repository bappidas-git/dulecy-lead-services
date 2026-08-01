/* ============================================
   LeadModal — the global enquiry modal
   --------------------------------------------
   Replaces the Nilachal-era side drawer. Ported from the `.modal`
   block that every `mockup/*.html` page carries: a blurred overlay, a
   centered white box with the ✕ close button, the fixed heading block,
   and the shared `UnifiedLeadForm`.

   Behaviour matches `mockup/scripts.js` (backdrop click, ✕ and Escape
   all close) plus the accessibility the static mockup lacks: a focus
   trap, focus restored to whatever opened the modal, and a body scroll
   lock that preserves the page's scroll position.
   ============================================ */

import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import UnifiedLeadForm from '../UnifiedLeadForm/UnifiedLeadForm';
import styles from './LeadModal.module.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const LeadModal = ({ isOpen, onClose, source = 'general', serviceInterest = '' }) => {
  const boxRef = useRef(null);
  const closeRef = useRef(null);
  // Whatever had focus when the modal opened — focus returns there on close.
  const openerRef = useRef(null);

  const focusableItems = useCallback(
    () => Array.from(boxRef.current?.querySelectorAll(FOCUSABLE) || []),
    []
  );

  // Escape closes; Tab cycles inside the box.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = focusableItems();
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !boxRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, focusableItems]);

  // Body scroll lock — fix the body at the current offset so the page
  // doesn't jump, and restore both the styles and the scroll position.
  useEffect(() => {
    if (!isOpen) return undefined;

    const { body } = document;
    const scrollY = window.scrollY;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Move focus into the modal on open, and hand it back on close.
  useEffect(() => {
    if (!isOpen) return undefined;

    openerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();

    return () => {
      openerRef.current?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Enquiry form"
      onClick={handleOverlayClick}
    >
      <div className={styles.box} ref={boxRef}>
        <button
          type="button"
          ref={closeRef}
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          &#10005;
        </button>

        <p className={`eyebrow ${styles.eyebrow}`}>Start a conversation</p>
        <h2 className={styles.head}>Tell us what you&rsquo;re building.</h2>
        <p className={styles.sub}>
          One form, one conversation — we&rsquo;ll route your enquiry to the
          right expertise.
        </p>

        <UnifiedLeadForm
          source={source}
          formId={`modal-${source}`}
          prefill={{ service_interest: serviceInterest }}
        />
      </div>
    </div>,
    document.body
  );
};

export default LeadModal;
