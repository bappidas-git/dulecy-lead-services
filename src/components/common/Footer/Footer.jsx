/* ============================================
   Footer Component — Nilachal Infracon
   Four-column footer on deep navy with quick links,
   contact info, registered-office details and the
   privacy-policy modal.
   ============================================ */

import React, { useState } from "react";
import { Container, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import {
  siteConfig,
  telHref,
  mailHref,
  waHref,
  fullAddress,
} from "../../../data/siteConfig";
import styles from "./Footer.module.css";

// Privacy Policy Content — Nilachal Infracon enquiry data policy
const PrivacyPolicyContent = () => (
  <div className={styles.legalContent}>
    <section className={styles.legalSection}>
      <h3>Introduction</h3>
      <p>
        {siteConfig.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your
        privacy. This policy explains what information we collect when you send
        an enquiry through this website, how we use it, and how you can ask us to
        remove it.
      </p>
    </section>

    <section className={styles.legalSection}>
      <h3>Information We Collect</h3>
      <p>
        When you submit an enquiry or request a callback, we collect only the
        details you choose to share with us:
      </p>
      <ul>
        <li>
          <strong>Your name</strong> — so we know who to address.
        </li>
        <li>
          <strong>Your phone number</strong> — so our team can call or message
          you back.
        </li>
        <li>
          <strong>Your email address</strong> — an optional way for us to reach
          you.
        </li>
        <li>
          <strong>Your enquiry details</strong> — the products, services, brands
          or project you would like to discuss.
        </li>
      </ul>
    </section>

    <section className={styles.legalSection}>
      <h3>How We Use Your Information</h3>
      <ul>
        <li>
          To respond to your enquiry and help you with the products and services
          offered by North East Buildmart.
        </li>
        <li>
          To share availability, brands, pricing and project guidance you have
          asked about.
        </li>
      </ul>
      <p>
        Your details are used <strong>only to respond to your enquiry</strong>.
        We do not use them for anything else.
      </p>
    </section>

    <section className={styles.legalSection}>
      <h3>Storage &amp; Sharing</h3>
      <p>
        Enquiries are stored on this website&apos;s own server so our team can
        follow up with you. We <strong>never sell or rent</strong> your
        information, and we do not share it with advertising platforms or data
        brokers.
      </p>
    </section>

    <section className={styles.legalSection}>
      <h3>No Ad-Platform Tracking</h3>
      <p>
        This site does not run advertising pixels, ad-network trackers or
        cross-site profiling. Only the essential cookies needed for the site to
        function are used.
      </p>
    </section>

    <section className={styles.legalSection}>
      <h3>Removing Your Data</h3>
      <p>
        You can ask us to delete the details you submitted at any time. Email us
        at{" "}
        <a href={mailHref} className={styles.legalLinkInline}>
          {siteConfig.email}
        </a>{" "}
        and we will remove your enquiry from our records.
      </p>
    </section>

    <section className={styles.legalSection}>
      <h3>Contact</h3>
      <p>
        <strong>{siteConfig.legalName}</strong>
        <br />
        {fullAddress}
        <br />
        Phone: {siteConfig.phoneDisplay}
        <br />
        Email: {siteConfig.email}
      </p>
    </section>
  </div>
);

// Legal Modal Component
const LegalModal = ({ isOpen, onClose, title, children }) => {
  if (typeof window === "undefined") return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } },
  };

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={styles.modalBackdrop}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className={styles.legalModal}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <IconButton
                className={styles.modalCloseBtn}
                onClick={onClose}
                aria-label="Close modal"
              >
                <Icon icon="mdi:close" />
              </IconButton>
            </div>
            <div className={styles.modalBody}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

// Quick Links — match the one-pager section anchors
const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Services", href: "#services" },
  { label: "Brands", href: "#brands" },
  { label: "Why Us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
];

const Footer = () => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  return (
    <>
      <footer className={styles.footer}>
        {/* Main Footer Content */}
        <div className={styles.mainFooter}>
          <Container maxWidth="xl">
            <div className={styles.footerGrid}>
              {/* Column 1: Brand */}
              <div className={styles.footerBrand}>
                <div className={styles.logoWrapper}>
                  <img
                    src={siteConfig.logoWhite}
                    alt={siteConfig.legalName}
                    className={styles.brandLogo}
                  />
                </div>
                <p className={styles.legalName}>{siteConfig.legalName}</p>
                <p className={styles.tagline}>{siteConfig.tagline}</p>
                <p className={styles.about}>
                  Infrastructure &amp; building-materials, delivered with care
                  across Northeast India.
                </p>
                <p className={styles.brandLine}>
                  {siteConfig.flagshipBrand} — A Brand of Nilachal Infracon Pvt.
                  Ltd.
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div className={styles.footerColumn}>
                <h4 className={styles.columnTitle}>Quick Links</h4>
                <ul className={styles.footerLinks}>
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className={styles.footerLink}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Contact */}
              <div className={styles.footerColumn}>
                <h4 className={styles.columnTitle}>Contact</h4>
                <ul className={styles.contactList}>
                  <li className={styles.contactItem}>
                    <Icon
                      icon="mdi:map-marker-outline"
                      className={styles.contactIcon}
                    />
                    <span className={styles.contactValue}>{fullAddress}</span>
                  </li>
                  <li className={styles.contactItem}>
                    <Icon
                      icon="mdi:phone-outline"
                      className={styles.contactIcon}
                    />
                    <a href={telHref} className={styles.contactLink}>
                      {siteConfig.phoneDisplay}
                    </a>
                  </li>
                  <li className={styles.contactItem}>
                    <Icon
                      icon="mdi:email-outline"
                      className={styles.contactIcon}
                    />
                    <a href={mailHref} className={styles.contactLink}>
                      {siteConfig.email}
                    </a>
                  </li>
                </ul>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappChip}
                  aria-label={`WhatsApp Us — chat with ${siteConfig.brandName}`}
                >
                  <Icon icon="mdi:whatsapp" />
                  <span>WhatsApp Us</span>
                </a>
              </div>

              {/* Column 4: Registered Office */}
              <div className={styles.footerColumn}>
                <h4 className={styles.columnTitle}>Registered Office</h4>
                <p className={styles.officeAddress}>{fullAddress}</p>
                <p className={styles.cin}>
                  <span className={styles.cinLabel}>CIN</span>
                  <span className={styles.cinValue}>{siteConfig.cin}</span>
                </p>
              </div>
            </div>
          </Container>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <Container maxWidth="xl">
            <div className={styles.bottomContent}>
              <p className={styles.copyright}>
                &copy; 2026 {siteConfig.legalName}. All Rights Reserved.
              </p>
              <div className={styles.bottomRight}>
                <button
                  className={styles.legalLink}
                  onClick={() => setPrivacyModalOpen(true)}
                >
                  Privacy Policy
                </button>
                <span className={styles.linkDivider}>·</span>
                <span className={styles.developerText}>
                  Developed by{" "}
                  <a
                    href="https://www.assamdigital.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.developerLink}
                  >
                    Assam Digital
                  </a>
                </span>
              </div>
            </div>
          </Container>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <LegalModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </LegalModal>
    </>
  );
};

export default Footer;
