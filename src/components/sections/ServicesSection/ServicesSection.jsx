/* ============================================
   ServicesSection — Construction & Infrastructure
   The five Nilachal Infracon services as a minimal,
   Apple-style vertical list: a large index numeral, the
   service name, a one-line description, a few feature tags,
   and a hover-revealed arrow. Each row is a button that
   opens the service-enquiry drawer pre-filled with the
   service. Hairline separators, no cards, no carousel.

   Animation: GSAP + ScrollTrigger via the shared hooks
   (src/animations) — `useReveal` fades the header up and
   `useStaggerReveal` staggers the rows; both no-op to their
   final state under `prefers-reduced-motion`.
   ============================================ */

import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useReveal, useStaggerReveal } from "../../../animations";
import { servicesData } from "../../../data/servicesData";
import { useModal } from "../../../context/ModalContext";
import {
  injectSchema,
  removeSchema,
  generateServiceSchema,
} from "../../../utils/seo";
import styles from "./ServicesSection.module.css";

const ServicesSection = () => {
  const { openLeadDrawer } = useModal();

  // Header fades up once on scroll-in; the rows stagger in. Each hook refreshes
  // ScrollTrigger so this lazy-mounted section measures correctly.
  const headerRef = useReveal();
  const listRef = useStaggerReveal();

  // Inject the Service JSON-LD for structured data (generator wording is made
  // construction-correct in prompt 12; the wiring stays as-is).
  useEffect(() => {
    injectSchema("schema-services", generateServiceSchema(servicesData));
    return () => removeSchema("schema-services");
  }, []);

  // Whole row opens the enquiry drawer pre-filled with the service, so the form
  // arrives with the right context (prompt 10 wires the prefill in).
  const handleRowEnquiry = (service) =>
    openLeadDrawer("service-enquiry", {
      subtitle: service.name,
      service_interest: service.name,
    });

  return (
    <section className={styles.servicesSection} id="services">
      <div className={styles.container}>
        {/* Header */}
        <header ref={headerRef} className={styles.header}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowBar} aria-hidden="true" />
            What We Do
          </p>
          <h2 className={styles.headline}>
            Construction &amp; Infrastructure Services
          </h2>
          <p className={styles.subtext}>
            End-to-end construction expertise — from homes and commercial
            spaces to institutional projects and full project management across
            Northeast India.
          </p>
        </header>

        {/* Service list */}
        <div ref={listRef} className={styles.list}>
          {servicesData.map((service, index) => (
            <button
              key={service.id}
              type="button"
              className={styles.row}
              onClick={() => handleRowEnquiry(service)}
              aria-label={`Enquire about ${service.name}`}
            >
              <span className={styles.rowIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className={styles.rowBody}>
                <span className={styles.rowName}>{service.name}</span>
                <span className={styles.rowDesc}>{service.description}</span>
                <span className={styles.rowTags}>
                  {service.features.slice(0, 3).map((feature) => (
                    <span key={feature} className={styles.rowTag}>
                      {feature}
                    </span>
                  ))}
                </span>
              </span>

              <span className={styles.rowArrow} aria-hidden="true">
                <Icon icon="mdi:arrow-right" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
