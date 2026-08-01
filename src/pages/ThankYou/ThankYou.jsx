/* ============================================
   ThankYou Page — Nilachal Infracon
   Post-enquiry confirmation. Minimal navy-on-white,
   consistent with the site. A GSAP checkmark-draw with a
   soft green burst replaces the old confetti. Access is
   gated by the sessionStorage flag the enquiry form sets;
   the flag expires after 5 minutes.
   ============================================ */

import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { gsap, prefersReducedMotion } from "../../animations";
import { siteConfig, telHref, waHref } from "../../data/siteConfig";
import styles from "./ThankYou.module.css";
import { updatePageSEO } from "../../utils/seo";
import { seoConfig } from "../../config/seo";

// What happens after an enquiry lands.
const nextSteps = [
  "Our team reviews your enquiry",
  "We call or WhatsApp you within 24 hours",
  "You get a quotation / consultation",
];

const ThankYou = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const scopeRef = useRef(null);
  const ringRef = useRef(null);
  const checkRef = useRef(null);
  const burstRef = useRef(null);

  // Gate access to the page and set the noindex meta.
  useEffect(() => {
    const leadSubmitted = sessionStorage.getItem("lead_submitted");
    const name = sessionStorage.getItem("lead_name");

    if (!leadSubmitted) {
      // Redirect to home if accessed directly (no recent submission).
      navigate("/", { replace: true });
      return;
    }

    setIsAuthorized(true);
    setUserName(name || "");

    updatePageSEO({
      title: seoConfig.pages.thankYou.title,
      description: seoConfig.pages.thankYou.description,
      url: seoConfig.siteUrl + "/thank-you",
      robots: "noindex, nofollow",
    });

    // Clear the session flag after 5 minutes to prevent re-access.
    const timeout = setTimeout(() => {
      sessionStorage.removeItem("lead_submitted");
      sessionStorage.removeItem("lead_name");
    }, 300000); // 5 minutes

    return () => clearTimeout(timeout);
  }, [navigate]);

  // GSAP entrance: draw the checkmark ring + tick, pulse a soft green burst,
  // then stagger the content up. Runs before paint (useLayoutEffect) so there
  // is no flash, and no-ops to the final state under prefers-reduced-motion.
  useLayoutEffect(() => {
    if (!isAuthorized) return;
    const scope = scopeRef.current;
    // Default DOM state IS the final state (checkmark drawn, content visible),
    // so under reduced motion we simply leave everything as-is.
    if (!scope || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const ring = ringRef.current;
      const check = checkRef.current;
      const burst = burstRef.current;
      const reveals = scope.querySelectorAll("[data-reveal]");

      const ringLen = ring?.getTotalLength?.() || 360;
      const checkLen = check?.getTotalLength?.() || 90;

      gsap.set(ring, { strokeDasharray: ringLen, strokeDashoffset: ringLen });
      gsap.set(check, { strokeDasharray: checkLen, strokeDashoffset: checkLen });
      gsap.set(burst, { scale: 0.4, opacity: 0 });
      gsap.set(reveals, { opacity: 0, y: 24 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(ring, { strokeDashoffset: 0, duration: 0.55 })
        .to(burst, { scale: 1.6, opacity: 0.45, duration: 0.4 }, "-=0.35")
        .to(check, { strokeDashoffset: 0, duration: 0.4 }, "-=0.3")
        .to(burst, { scale: 2.1, opacity: 0, duration: 0.7 }, "-=0.2")
        .to(
          reveals,
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          "-=0.55"
        );
    }, scopeRef);

    return () => ctx.revert();
  }, [isAuthorized]);

  if (!isAuthorized) {
    return null;
  }

  const firstName = userName ? userName.split(" ")[0] : "";
  const greeting = firstName
    ? `Hi ${firstName}, thanks for reaching out to ${siteConfig.brandName}. Our team will get in touch within 24 hours.`
    : `Thanks for reaching out to ${siteConfig.brandName}. Our team will get in touch within 24 hours.`;

  return (
    <div className={styles.thankYouPage} ref={scopeRef}>
      <Container maxWidth="sm">
        <div className={styles.content}>
          {/* Animated checkmark */}
          <div className={styles.successIcon}>
            <span className={styles.burst} ref={burstRef} aria-hidden="true" />
            <svg
              className={styles.checkSvg}
              viewBox="0 0 120 120"
              role="img"
              aria-label="Enquiry received"
            >
              <circle
                ref={ringRef}
                className={styles.checkRing}
                cx="60"
                cy="60"
                r="54"
              />
              <path
                ref={checkRef}
                className={styles.checkMark}
                d="M40 62 L54 77 L82 43"
              />
            </svg>
          </div>

          {/* Heading + greeting */}
          <div data-reveal>
            <Typography variant="h1" className={styles.title}>
              Thank you! Your enquiry is received.
            </Typography>
            <Typography className={styles.subtitle}>{greeting}</Typography>
          </div>

          {/* Next steps */}
          <div className={styles.stepsCard} data-reveal>
            <p className={styles.stepsHeading}>What happens next</p>
            <ol className={styles.stepsList}>
              {nextSteps.map((step, index) => (
                <li key={step} className={styles.stepItem}>
                  <span className={styles.stepNum}>{index + 1}</span>
                  <span className={styles.stepText}>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* CTAs */}
          <div className={styles.ctaSection} data-reveal>
            <a href={telHref} className={styles.callBtn}>
              <Icon icon="mdi:phone" />
              <span>Call {siteConfig.phoneDisplay}</span>
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              <Icon icon="mdi:whatsapp" />
              <span>WhatsApp</span>
            </a>
            <a href="/" className={styles.homeBtn}>
              <Icon icon="mdi:arrow-left" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ThankYou;
