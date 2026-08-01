/* ============================================
   AboutSection — "Welcome to Nilachal Infracon"
   The one-pager's about moment: an intro split (copy + image)
   followed by the four Mission / Vision / Values / Commitment
   pillars. Apple-minimal — white background, generous whitespace,
   thin hairlines, green used only for the eyebrow bar and icons.

   Animation: GSAP + ScrollTrigger via the shared hooks
   (src/animations) — `useReveal` fades Part A up, `useStaggerReveal`
   staggers the pillar cards, and `useParallax` gives the image a
   subtle scrubbed drift. All no-op to their final state under
   `prefers-reduced-motion`.
   ============================================ */

import { Icon } from "@iconify/react";
import { useReveal, useStaggerReveal, useParallax } from "../../../animations";
import { aboutData } from "../../../data/aboutData";
import { siteConfig } from "../../../data/siteConfig";
import styles from "./AboutSection.module.css";

// Architectural detail (modern building facade) — Unsplash, verified 200.
const aboutImage = {
  src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&h=1400&q=80",
  alt: "Modern architectural facade — building materials and infrastructure",
  width: 1200,
  height: 1400,
};

// Render the welcome paragraph with the flagship brand name emphasised inline,
// splitting on the single source of truth rather than hard-coding the string.
const renderWelcome = (text, brand) => {
  const parts = text.split(brand);
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 && <strong>{brand}</strong>}
    </span>
  ));
};

const AboutSection = () => {
  // Part A fades up once as it enters the viewport; the pillar row staggers its
  // cards; the image drifts subtly on scroll (desktop parallax, reduced-motion
  // aware). Each hook refreshes ScrollTrigger for correct lazy-mount measuring.
  const introRef = useReveal();
  const pillarsRef = useStaggerReveal();
  const imageRef = useParallax({ amount: 6 });

  return (
    <section className={styles.aboutSection} id="about">
      <div className={styles.container}>
        {/* Part A — intro split */}
        <div ref={introRef} className={styles.intro}>
          <div className={styles.introText}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowBar} aria-hidden="true" />
              Welcome to Nilachal Infracon
            </p>

            <h2 className={styles.headline}>
              One of Northeast India&apos;s emerging infrastructure &amp;
              building materials companies
            </h2>

            <p className={styles.paragraph}>
              {renderWelcome(aboutData.welcome, siteConfig.flagshipBrand)}
            </p>

            <a href="#services" className={styles.textLink}>
              Explore our services
              <Icon
                icon="mdi:arrow-right"
                className={styles.textLinkIcon}
                aria-hidden="true"
              />
            </a>
          </div>

          <div className={styles.introMedia}>
            <div className={styles.imageWrapper}>
              <img
                ref={imageRef}
                src={aboutImage.src}
                alt={aboutImage.alt}
                width={aboutImage.width}
                height={aboutImage.height}
                className={styles.image}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Part B — four pillars */}
        <div ref={pillarsRef} className={styles.pillars}>
          {aboutData.pillars.map((pillar) => (
            <article key={pillar.id} className={styles.pillar}>
              <span className={styles.pillarRule} aria-hidden="true" />
              <span className={styles.pillarIcon}>
                <Icon icon={pillar.icon} aria-hidden="true" />
              </span>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarText}>{pillar.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
