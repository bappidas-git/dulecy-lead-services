/* ============================================
   Modal Context — enquiry drawer state
   --------------------------------------------
   Drives the global enquiry drawer (LeadFormDrawer): which copy to
   show and any prefill (e.g. a product/service `service_interest`)
   passed by section tiles/rows. The legacy real-estate modal system
   (MODAL_TYPES + openModal + a stack of shorthand openers) was removed
   in prompt 11 — nothing rendered it after the rebuild.
   ============================================ */

import React, { createContext, useContext, useState, useCallback } from 'react';

// Create context
const ModalContext = createContext(null);

// Drawer title/subtitle copy, keyed by the context that opened the drawer.
// Section CTAs pass one of these keys to `openLeadDrawer`.
const REQUEST_QUOTE = {
  title: 'Request a Quote',
  subtitle: 'Tell us what you need and our team will get back within 24 hours.',
};
const PRODUCT_ENQUIRY = {
  title: 'Product Enquiry',
  subtitle: 'Ask about availability, brands and pricing.',
};
const SERVICE_ENQUIRY = {
  title: 'Service Enquiry',
  subtitle: 'Discuss your construction or renovation project with us.',
};
const CALLBACK = {
  title: 'Request a Callback',
  subtitle: "Share your details and we'll call you back.",
};
const DEFAULT_ENQUIRY = {
  title: 'Send an Enquiry',
  subtitle: 'We usually respond within 24 hours.',
};

export const DRAWER_TITLES = {
  'request-quote': REQUEST_QUOTE,
  'product-enquiry': PRODUCT_ENQUIRY,
  'service-enquiry': SERVICE_ENQUIRY,
  'callback': CALLBACK,
  'default': DEFAULT_ENQUIRY,
};

// Provider component
export const ModalProvider = ({ children }) => {
  // Lead Form Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerConfig, setDrawerConfig] = useState({
    title: DRAWER_TITLES.default.title,
    subtitle: DRAWER_TITLES.default.subtitle,
    source: 'general',
  });

  // Open lead form drawer with specific title based on context
  const openLeadDrawer = useCallback((titleKey = 'default', extraData = {}) => {
    const titleConfig = DRAWER_TITLES[titleKey] || DRAWER_TITLES.default;
    setDrawerConfig({
      title: extraData.title || titleConfig.title,
      subtitle: extraData.subtitle || titleConfig.subtitle,
      source: titleKey,
      ...extraData,
    });
    setIsDrawerOpen(true);
    // Save current scroll position before locking body
    const scrollY = window.scrollY;
    document.body.dataset.scrollY = scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('drawer-open');
  }, []);

  // Close lead form drawer
  const closeLeadDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    document.body.classList.remove('drawer-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    // Restore scroll position after unlocking body
    const scrollY = document.body.dataset.scrollY;
    document.body.style.top = '';
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY, 10));
      delete document.body.dataset.scrollY;
    }
  }, []);

  const value = {
    // Drawer State
    isDrawerOpen,
    drawerConfig,
    // Drawer Actions
    openLeadDrawer,
    closeLeadDrawer,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook to use modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export default ModalContext;
