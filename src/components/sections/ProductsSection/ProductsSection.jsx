/* ============================================
   ProductsSection — North East Buildmart
   The flagship-brand moment: a centered header, a wide
   feature-image strip of premium materials, and a 10-tile
   category grid (green icon on a tint circle). Every tile is
   a button that opens the product-enquiry drawer pre-filled
   with the category, plus a single green pricing CTA.

   Apple-minimal — white background, generous whitespace,
   thin hairlines, green used only for icons and the CTA.

   Animation: GSAP + ScrollTrigger via the shared hooks
   (src/animations) — `useReveal` fades the header up and
   `useStaggerReveal` staggers the tile grid; both no-op to
   their final state under `prefers-reduced-motion`.
   ============================================ */

import { Icon } from "@iconify/react";
import { useReveal, useStaggerReveal } from "../../../animations";
import { productsData } from "../../../data/productsData";
import { useModal } from "../../../context/ModalContext";
import styles from "./ProductsSection.module.css";

// Wide premium-materials strip — Unsplash, verified 200.
const featureImage = {
  src: "https://res.cloudinary.com/dn9gyaiik/image/upload/v1785042294/products-image_bimffn.png",
  alt: "Premium building materials supplied under the North East Buildmart brand",
  width: 2000,
  height: 600,
};

const ProductsSection = () => {
  const { openLeadDrawer } = useModal();

  // Header fades up once on scroll-in; the tile grid staggers its cards. Each
  // hook refreshes ScrollTrigger so this lazy-mounted section measures correctly.
  const headerRef = useReveal();
  const gridRef = useStaggerReveal();

  // Whole tile opens the enquiry drawer pre-filled with the category, so the
  // form arrives with the right context (prompt 10 wires the prefill in).
  const handleTileEnquiry = (product) =>
    openLeadDrawer("product-enquiry", {
      subtitle: product.name,
      service_interest: product.name,
    });

  return (
    <section className={styles.productsSection} id="products">
      <div className={styles.container}>
        {/* Header */}
        <header ref={headerRef} className={styles.header}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowBar} aria-hidden="true" />
            Our Flagship Brand
          </p>
          <h2 className={styles.headline}>North East Buildmart</h2>
          <p className={styles.subtext}>
            A brand of Nilachal Infracon Pvt. Ltd. — premium building materials
            under one roof.
          </p>
        </header>

        {/* Wide feature-image strip */}
        <div className={styles.featureStrip}>
          <img
            src={featureImage.src}
            alt={featureImage.alt}
            width={featureImage.width}
            height={featureImage.height}
            className={styles.featureImage}
            loading="lazy"
          />
        </div>

        {/* 10-category tile grid */}
        <div ref={gridRef} className={styles.grid}>
          {productsData.map((product) => (
            <button
              key={product.id}
              type="button"
              className={styles.tile}
              onClick={() => handleTileEnquiry(product)}
              aria-label={`Enquire about ${product.name}`}
            >
              <span className={styles.tileIcon}>
                <Icon icon={product.icon} aria-hidden="true" />
              </span>
              <span className={styles.tileName}>{product.name}</span>
              <span className={styles.tileBlurb}>{product.blurb}</span>
            </button>
          ))}
        </div>

        {/* Section CTA */}
        <div className={styles.cta}>
          <button
            type="button"
            className={styles.ctaBtn}
            onClick={() => openLeadDrawer("product-enquiry")}
          >
            <span>Request Product Pricing</span>
            <Icon icon="mdi:arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
