/* ============================================
   Modal Context — enquiry modal state
   --------------------------------------------
   Drives the global enquiry modal (`LeadModal`): whether it is open,
   which CTA opened it (stored on the lead as `source`), and any prefill
   — e.g. an expertise `service_interest` passed by the accordion's
   "Discuss this area" button.

   The modal's heading copy is fixed in the mockup, so this context no
   longer carries per-CTA titles; it is pure state. Scroll lock and
   focus handling belong to `LeadModal` itself.
   ============================================ */

import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ source: 'general' });

  /**
   * Open the enquiry modal.
   * @param {string} sourceKey - CTA identifier, stored as the lead's `source`
   *   (e.g. 'header-cta', 'expertise-e03').
   * @param {Object} [extraData] - Optional extras, e.g. `{ service_interest }`.
   */
  const openLeadModal = useCallback((sourceKey = 'general', extraData = {}) => {
    setModalConfig({ source: sourceKey, ...extraData });
    setIsModalOpen(true);
  }, []);

  const closeLeadModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const value = {
    isModalOpen,
    modalConfig,
    openLeadModal,
    closeLeadModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export default ModalContext;
