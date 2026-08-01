/* ============================================
   ContactSection — Get in Touch (id="contact")
   --------------------------------------------
   The final public-site section. Two columns on desktop, stacked on
   mobile:
     • Left — "Get in Touch": eyebrow + headline, quiet hairline-
       separated contact rows (office / phone / email / WhatsApp), a
       lazy Google-Maps embed, and the eight Northeast serving states
       as quiet text pills.
     • Right — enquiry card: the shared UnifiedLeadForm (variant
       'default', formId 'contact-form') under a "Send us an Enquiry"
       heading, wrapped in a white 1px-bordered soft-shadow card.

   All contact facts come from siteConfig / locationData (the single
   source of business truth) — nothing is hardcoded here. Both columns
   reveal once on scroll via GSAP `useReveal`; the reveal no-ops to the
   final state under `prefers-reduced-motion`.
   ============================================ */

import { Icon } from "@iconify/react";
import { useReveal } from "../../../animations";
import UnifiedLeadForm from "../../common/UnifiedLeadForm/UnifiedLeadForm";
import {
  siteConfig,
  telHref,
  mailHref,
  waHref,
  fullAddress,
} from "../../../data/siteConfig";
import { locationData } from "../../../data/locationData";
import styles from "./ContactSection.module.css";

// Google Maps embed — no API key needed with the `output=embed` endpoint.
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  siteConfig.mapsQuery,
)}&output=embed`;

// Quiet contact rows: icon + label + value, hairline-separated. Values that
// are actionable (phone / email) render as links; the address is plain text
// (the map below handles wayfinding), and WhatsApp is a small green chip.
const contactRows = [
  {
    icon: "mdi:map-marker-outline",
    label: "Registered Office",
    value: fullAddress,
  },
  {
    icon: "mdi:phone-outline",
    label: "Phone",
    value: siteConfig.phoneDisplay,
    href: telHref,
    ariaLabel: `Call ${siteConfig.brandName} on ${siteConfig.phoneDisplay}`,
  },
  {
    icon: "mdi:email-outline",
    label: "Email",
    value: siteConfig.email,
    href: mailHref,
    ariaLabel: `Email ${siteConfig.brandName} at ${siteConfig.email}`,
  },
];

const ContactSection = () => {
  const leftRef = useReveal();
  const rightRef = useReveal();

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* ============ Left — Get in Touch ============ */}
          <div ref={leftRef} className={styles.left}>
            <header className={styles.header}>
              <p className={styles.eyebrow}>
                <span className={styles.eyebrowBar} aria-hidden="true" />
                Contact Us
              </p>
              <h2 className={styles.headline}>
                Let&apos;s build it together
              </h2>
              <p className={styles.subtext}>
                Reach us at our Nagaon office, or send an enquiry — our team
                usually responds within 24 hours.
              </p>
            </header>

            {/* Quiet contact rows */}
            <ul className={styles.rows}>
              {contactRows.map((row) => (
                <li key={row.label} className={styles.row}>
                  <span className={styles.rowIcon} aria-hidden="true">
                    <Icon icon={row.icon} />
                  </span>
                  <span className={styles.rowBody}>
                    <span className={styles.rowLabel}>{row.label}</span>
                    {row.href ? (
                      <a
                        href={row.href}
                        className={styles.rowValueLink}
                        aria-label={row.ariaLabel}
                      >
                        {row.value}
                      </a>
                    ) : (
                      <span className={styles.rowValue}>{row.value}</span>
                    )}
                  </span>
                </li>
              ))}

              {/* WhatsApp row — small green chip */}
              <li className={styles.row}>
                <span className={styles.rowIcon} aria-hidden="true">
                  <Icon icon="mdi:whatsapp" />
                </span>
                <span className={styles.rowBody}>
                  <span className={styles.rowLabel}>WhatsApp</span>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.waChip}
                    aria-label={`Chat with ${siteConfig.brandName} on WhatsApp`}
                  >
                    <Icon
                      icon="mdi:whatsapp"
                      className={styles.waChipIcon}
                      aria-hidden="true"
                    />
                    Chat on WhatsApp
                  </a>
                </span>
              </li>
            </ul>

            {/* Map embed */}
            <div className={styles.mapWrap}>
              <iframe
                src={mapSrc}
                title="Nilachal Infracon location"
                className={styles.map}
                width="100%"
                height="300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Serving states */}
            <div className={styles.serving}>
              <p className={styles.servingLabel}>
                Serving all of Northeast India
              </p>
              <ul className={styles.pills}>
                {locationData.servingStates.map((state) => (
                  <li key={state} className={styles.pill}>
                    {state}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ============ Right — Enquiry card ============ */}
          <div ref={rightRef} className={styles.right}>
            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <h3 className={styles.formTitle}>Send us an Enquiry</h3>
                <p className={styles.formSubtitle}>
                  Tell us what you need and we&apos;ll get back to you shortly.
                </p>
              </div>
              <UnifiedLeadForm
                variant="default"
                source="contact"
                formId="contact-form"
                showTitle={false}
                showSubtitle={false}
                showTrustBadges={true}
                showConsent={true}
                submitButtonText="Send Enquiry"
                className={styles.formInner}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
