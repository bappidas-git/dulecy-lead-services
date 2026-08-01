/* ============================================
   Header Component
   Fixed header with scroll behavior and navigation
   ============================================ */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { Icon } from "@iconify/react";
import { useModal } from "../../../context/ModalContext";
import { useGSAP, gsap, prefersReducedMotion } from "../../../animations";
import { siteConfig, telHref } from "../../../data/siteConfig";
import styles from "./Header.module.css";

// One-pager anchors. Sections marked (*) are added in later prompts (08–09);
// their nav items may temporarily dead-end until then — the hash-scroll retry
// logic tolerates missing targets.
const navItems = [
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" }, // *
  { label: "Services", href: "#services" },
  { label: "Brands", href: "#brands" }, // *
  { label: "Why Us", href: "#why-us" }, // *
  { label: "Contact", href: "#contact" },
];

const Header = ({ forceCloseMenu = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openLeadDrawer } = useModal();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const headerRef = useRef(null);

  // Close mobile menu when bottom drawer opens
  useEffect(() => {
    if (forceCloseMenu && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [forceCloseMenu, isMobileMenuOpen]);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > 50);

    // Determine active section. When scrolled back above the first section
    // (e.g. the hero), no section is in range and we reset to none so the
    // previously clicked nav item doesn't stay highlighted.
    const sections = navItems.map((item) => item.href.substring(1));
    let currentSection = "";
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150) {
          currentSection = sections[i];
          break;
        }
      }
    }
    setActiveSection(currentSection);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Subtle entrance on first paint — logo + nav fade-down once. Skips to the
  // final state instantly when the user prefers reduced motion.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const targets = headerRef.current?.querySelectorAll("[data-reveal]");
      if (!targets || !targets.length) return;
      gsap.from(targets, {
        y: -12,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
      });
    },
    { scope: headerRef },
  );

  // Smooth scroll to section (for desktop navigation)
  const scrollToSection = (e, href) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else if (targetId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setIsMobileMenuOpen(false);
  };

  // Handle mobile menu item click (close menu first, then scroll with delay)
  const handleMobileMenuClick = (e, href) => {
    e.preventDefault();
    e.stopPropagation();

    // Store the target href before closing
    const targetHref = href;

    // Close menu first
    setIsMobileMenuOpen(false);

    // Scroll after a brief delay to allow menu close animation to start
    setTimeout(() => {
      const targetId = targetHref.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 50);
  };

  const handleQuoteClick = () => {
    openLeadDrawer("request-quote");
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
    >
      <Container maxWidth="xl" className={styles.headerContainer}>
        {/* Logo Section */}
        <div className={styles.logoSection} data-reveal>
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, "#home")}
            className={styles.logoLink}
            aria-label={`${siteConfig.legalName} — scroll to top`}
          >
            {/* White logo over the dark hero; color logo once the header
                turns solid white on scroll. */}
            <img
              src={isScrolled ? siteConfig.logo : siteConfig.logoWhite}
              alt={siteConfig.legalName}
              className={styles.mainLogo}
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className={styles.desktopNav} aria-label="Primary" data-reveal>
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      scrollToSection(e, item.href);
                    }}
                    className={`${styles.navLink} ${activeSection === item.href.substring(1) ? styles.active : ""}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Right Section - Phone + Request a Quote CTA */}
        <div className={styles.rightSection} data-reveal>
          {!isMobile && (
            <>
              <a
                href={telHref}
                className={styles.phoneLink}
                aria-label={`Call ${siteConfig.brandName} on ${siteConfig.phoneDisplay}`}
              >
                <Icon icon="mdi:phone-outline" className={styles.phoneIcon} />
                {siteConfig.phoneDisplay}
              </a>
              <button
                type="button"
                onClick={handleQuoteClick}
                className={styles.quoteButton}
                aria-label="Request a quote"
              >
                Request a Quote
              </button>
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              className={styles.menuButton}
              onClick={() => {
                const newState = !isMobileMenuOpen;
                setIsMobileMenuOpen(newState);
              }}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon
                icon={isMobileMenuOpen ? "mdi:close" : "mdi:menu"}
                className={styles.menuIcon}
              />
            </IconButton>
          )}
        </div>
      </Container>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            className={styles.mobileNav}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className={styles.mobileNavContent} aria-label="Mobile primary">
              <ul className={styles.mobileNavList}>
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleMobileMenuClick(e, item.href)}
                      className={`${styles.mobileNavLink} ${activeSection === item.href.substring(1) ? styles.active : ""}`}
                    >
                      <Icon
                        icon={getNavIcon(item.label)}
                        className={styles.mobileNavIcon}
                      />
                      {item.label}
                    </button>
                  </motion.li>
                ))}
              </ul>
              <div className={styles.mobileNavCTA}>
                <button
                  type="button"
                  onClick={handleQuoteClick}
                  className={styles.mobileQuoteButton}
                  aria-label="Request a quote"
                >
                  <Icon
                    icon="mdi:office-building-outline"
                    className={styles.phoneIcon}
                  />
                  Request a Quote
                </button>
                <a
                  href={telHref}
                  className={styles.mobilePhoneLink}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Icon icon="mdi:phone-outline" className={styles.phoneIcon} />
                  {siteConfig.phoneDisplay}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Helper function to get navigation icons for the mobile menu
const getNavIcon = (label) => {
  const icons = {
    About: "mdi:information-outline",
    Products: "mdi:package-variant-closed",
    Services: "mdi:hammer-wrench",
    Brands: "mdi:tag-multiple-outline",
    "Why Us": "mdi:star-outline",
    Contact: "mdi:phone-outline",
  };
  return icons[label] || "mdi:circle-outline";
};

export default Header;
