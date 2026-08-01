/* ============================================
   HeroSection — Nilachal Infracon
   Cinematic, Apple-minimal full-viewport hero. Dark construction
   image + navy scrim, a single <h1>, two CTAs and a quiet trust
   strip. Animated with a GSAP intro timeline on mount and a subtle
   scroll parallax on the background image.
   ============================================ */

import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useModal } from "../../../context/ModalContext";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE,
  prefersReducedMotion,
  useParallax,
} from "../../../animations";
import styles from "./HeroSection.module.css";

// Cinematic construction imagery (Unsplash, verified 200). The first URL is the
// primary; the second is a verified fallback used by the preload chain below if
// the primary fails. A `w=1200` variant is served on mobile.
const HERO_IMAGES = {
  desktop: [
    "https://images.unsplash.com/photo-1621715743917-10dcaa815da6?auto=format&fit=crop&w=2400&q=80",
    "https://images.unsplash.com/photo-1684497404598-6e844dff9cde?auto=format&fit=crop&w=2400&q=80",
  ],
  mobile: [
    "https://images.unsplash.com/photo-1621715743917-10dcaa815da6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1684497404598-6e844dff9cde?auto=format&fit=crop&w=1200&q=80",
  ],
};

// Quiet trust strip along the hero bottom.
const TRUST_STATS = [
  { value: "10+", label: "Years" },
  { value: "5000+", label: "Customers" },
  { value: "7+", label: "NE States" },
  { value: "100%", label: "Genuine Products" },
];

const HeroSection = () => {
  const theme = useTheme();
  // `noSsr` so the value is correct on first paint — the parallax ref then
  // attaches only on desktop instead of flickering across the breakpoint.
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });
  const { openLeadDrawer } = useModal();

  const sectionRef = useRef(null);
  // Subtle background parallax on scroll (desktop only; the hook itself skips
  // under reduced motion).
  const parallaxRef = useParallax({ amount: 8 });

  // Background image preload with fallback chain (5s timeout → gradient).
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const images = isMobile ? HERO_IMAGES.mobile : HERO_IMAGES.desktop;
    let cancelled = false;

    const tryLoadImage = async () => {
      for (const url of images) {
        if (cancelled) return;
        const loaded = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
          setTimeout(() => resolve(false), 5000);
        });
        if (loaded && !cancelled) {
          setHeroImageUrl(url);
          setImageLoaded(true);
          return;
        }
      }
      if (!cancelled) {
        console.warn("All hero images failed to load, using gradient fallback");
      }
    };

    tryLoadImage();
    return () => {
      cancelled = true;
    };
  }, [isMobile]);

  // ===== GSAP intro timeline (on mount) + scroll affordance =====
  useGSAP(
    () => {
      const scope = sectionRef.current;
      if (!scope) return;

      const q = (sel) => scope.querySelector(sel);
      const overlay = q(`.${styles.heroOverlay}`);
      const eyebrow = q(`.${styles.eyebrow}`);
      const titleLines = scope.querySelectorAll(`.${styles.titleLineInner}`);
      const subline = q(`.${styles.subline}`);
      const paragraph = q(`.${styles.paragraph}`);
      const ctaRow = q(`.${styles.ctaRow}`);
      const trustStrip = q(`.${styles.trustStrip}`);
      const hint = q(`.${styles.scrollHint}`);

      // Reduced motion → everything at its final state instantly.
      if (prefersReducedMotion()) {
        gsap.set([eyebrow, subline, paragraph, ctaRow, trustStrip], {
          autoAlpha: 1,
          y: 0,
        });
        gsap.set(titleLines, { yPercent: 0 });
        if (overlay) gsap.set(overlay, { opacity: 1 });
        if (hint) {
          ScrollTrigger.create({
            start: 1,
            end: "max",
            onEnter: () => gsap.set(hint, { autoAlpha: 0 }),
            onLeaveBack: () => gsap.set(hint, { autoAlpha: 1 }),
          });
        }
        return;
      }

      // Initial hidden states (set pre-paint by useGSAP's layout effect).
      gsap.set([eyebrow, subline, paragraph, ctaRow, trustStrip], {
        autoAlpha: 0,
        y: 16,
      });
      gsap.set(titleLines, { yPercent: 115 });

      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.fromTo(overlay, { opacity: 0.4 }, { opacity: 1, duration: 0.6 }, 0)
        .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.15)
        .to(titleLines, { yPercent: 0, duration: 0.75, stagger: 0.1 }, 0.3)
        .to(subline, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.6)
        .to(
          [paragraph, ctaRow],
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12 },
          0.8,
        )
        .to(trustStrip, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.05);

      // Scroll hint fades out over the first bit of scroll.
      if (hint) {
        gsap.to(hint, {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top top", end: "+=200", scrub: true },
        });
      }

      ScrollTrigger.refresh();
    },
    { scope: sectionRef },
  );

  // Smooth-scroll to the products section. Tolerates a missing target
  // (#products is added in a later prompt) — must never throw.
  const scrollToProducts = (e) => {
    e.preventDefault();
    const target = document.getElementById("products");
    if (!target) return;
    const headerOffset = 80;
    const top =
      target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className={styles.heroSection}
      aria-label="Nilachal Infracon — Building the Future of Northeast India"
    >
      {/* Layer 1: gradient fallback (always present) */}
      <div className={styles.heroBgGradient} aria-hidden="true" />

      {/* Layer 2: cinematic image (parallax on desktop) */}
      <div
        ref={isMobile ? null : parallaxRef}
        className={`${styles.heroBgImage}${
          imageLoaded ? "" : ` ${styles.heroBgImageHidden}`
        }`}
        style={
          heroImageUrl ? { backgroundImage: `url('${heroImageUrl}')` } : undefined
        }
        aria-hidden="true"
      />

      {/* Layer 3: navy scrim */}
      <div className={styles.heroOverlay} aria-hidden="true" />

      {/* Content */}
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowBar} aria-hidden="true" />
            Nilachal Infracon Private Limited
          </p>

          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine}>
              <span className={styles.titleLineInner}>Building the Future</span>
            </span>
            <span className={styles.titleLine}>
              <span className={styles.titleLineInner}>of Northeast India</span>
            </span>
          </h1>

          <p className={styles.subline}>Building Tomorrow, Together.</p>

          <p className={styles.paragraph}>
            A trusted infrastructure and building materials company delivering
            premium construction products and professional construction services
            across Northeast India.
          </p>

          <div className={styles.ctaRow}>
            <a
              href="#products"
              onClick={scrollToProducts}
              className={`${styles.ctaBase} ${styles.ctaPrimary}`}
            >
              Explore Our Products
              <Icon icon="mdi:arrow-right" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => openLeadDrawer("request-quote")}
              className={`${styles.ctaBase} ${styles.ctaSecondary}`}
            >
              Request a Quote
            </button>
          </div>

          <div className={styles.trustStrip}>
            {TRUST_STATS.map((stat) => (
              <div className={styles.trustItem} key={stat.label}>
                <span className={styles.trustValue}>{stat.value}</span>
                <span className={styles.trustLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll affordance */}
      <div className={styles.scrollHint} aria-hidden="true">
        <span>Scroll</span>
        <Icon icon="mdi:chevron-down" className={styles.scrollChevron} />
      </div>
    </section>
  );
};

export default HeroSection;
