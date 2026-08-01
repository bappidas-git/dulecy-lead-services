/* ============================================
   BrandsSection — Trusted brands we deal in
   The partner brands carried by North East Buildmart, laid
   out as a calm 6×2 grid (4×3 tablet, 2-col mobile). Each
   cell tries the brand logo from /images/brands/<slug>.png
   and, until that file loads, shows a styled text wordmark
   instead — so no broken images and no placeholders while
   the logo files are still being collected. Real logos are
   grayscale and colour on hover.

   Below the grid sits the page's single mid-page CTA moment:
   one line + a green "Request a Quote" button that opens the
   request-quote enquiry drawer.

   Animation: GSAP + ScrollTrigger via the shared hooks
   (src/animations) — `useReveal` fades the header up and
   `useStaggerReveal` staggers the brand cells; both no-op to
   their final state under `prefers-reduced-motion`.
   ============================================ */

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useReveal, useStaggerReveal } from "../../../animations";
import { brandsData } from "../../../data/brandsData";
import { useModal } from "../../../context/ModalContext";
import styles from "./BrandsSection.module.css";

// One brand cell. The <img> starts hidden and only reveals if it actually
// loads; until then (or if the file is missing) a text wordmark stands in, so
// a broken-image icon can never appear.
const BrandCell = ({ brand }) => {
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <div className={styles.cell}>
      <img
        src={brand.logoFile}
        alt={`${brand.name} logo`}
        loading="lazy"
        width="180"
        height="70"
        className={styles.logo}
        style={{ display: logoLoaded ? "block" : "none" }}
        onLoad={() => setLogoLoaded(true)}
        onError={() => setLogoLoaded(false)}
      />
      {!logoLoaded && <span className={styles.wordmark}>{brand.name}</span>}
    </div>
  );
};

const BrandsSection = () => {
  const { openLeadDrawer } = useModal();

  // Header fades up once on scroll-in; the brand cells stagger in. Each hook
  // refreshes ScrollTrigger so this lazy-mounted section measures correctly.
  const headerRef = useReveal();
  const gridRef = useStaggerReveal();

  return (
    <section className={styles.brandsSection} id="brands">
      <div className={styles.container}>
        {/* Header */}
        <header ref={headerRef} className={styles.header}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowBar} aria-hidden="true" />
            Trusted Brands We Deal In
          </p>
          <p className={styles.subtext}>
            We stock genuine, warranty-backed products from India's most trusted
            manufacturers — so you build with names you can rely on.
          </p>
        </header>

        {/* Brand grid */}
        <div ref={gridRef} className={styles.grid}>
          {brandsData.map((brand) => (
            <BrandCell key={brand.id} brand={brand} />
          ))}
        </div>

        {/* Single mid-page CTA moment */}
        <div className={styles.cta}>
          <p className={styles.ctaLine}>
            Looking for a specific brand or product?
          </p>
          <button
            type="button"
            className={styles.ctaBtn}
            onClick={() => openLeadDrawer("request-quote")}
          >
            <span>Request a Quote</span>
            <Icon icon="mdi:arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
