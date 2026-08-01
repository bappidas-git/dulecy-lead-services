/* ============================================
   WhyUsSection — Why choose us
   The five value props from featuresData as a single clean
   row of five (green icon, title, short description) on a
   white background with generous padding. Tablet wraps to
   3 + 2; mobile to a 2-col grid with the fifth prop spanning
   the full width.

   Animation: GSAP + ScrollTrigger via the shared hooks
   (src/animations) — `useReveal` fades the header up and
   `useStaggerReveal` staggers the value props; both no-op to
   their final state under `prefers-reduced-motion`.
   ============================================ */

import { Icon } from "@iconify/react";
import { useReveal, useStaggerReveal } from "../../../animations";
import { featuresData } from "../../../data/featuresData";
import styles from "./WhyUsSection.module.css";

const WhyUsSection = () => {
  // Header fades up once on scroll-in; the value props stagger in. Each hook
  // refreshes ScrollTrigger so this lazy-mounted section measures correctly.
  const headerRef = useReveal();
  const rowRef = useStaggerReveal();

  return (
    <section className={styles.whyUsSection} id="why-us">
      <div className={styles.container}>
        {/* Header */}
        <header ref={headerRef} className={styles.header}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowBar} aria-hidden="true" />
            Why Choose Us
          </p>
          <h2 className={styles.headline}>
            Built on trust, priced with honesty
          </h2>
        </header>

        {/* Value props */}
        <div ref={rowRef} className={styles.row}>
          {featuresData.map((feature) => (
            <div key={feature.id} className={styles.prop}>
              <span className={styles.propIcon}>
                <Icon icon={feature.icon} aria-hidden="true" />
              </span>
              <h3 className={styles.propTitle}>{feature.title}</h3>
              <p className={styles.propDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
