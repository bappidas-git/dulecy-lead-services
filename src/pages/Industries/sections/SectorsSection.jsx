/* ============================================
   Who We Serve / Sector grid — ported 1:1 from
   `mockup/industries.html`
   --------------------------------------------
   The seven sectors from `industriesData` (icon tile + number, name,
   description), closed by the red gradient card that opens the enquiry
   drawer for anyone whose sector isn't listed. The grid staggers in as
   it scrolls into view.
   ============================================ */

import React from 'react';
import { useModal } from '../../../context/ModalContext';
import { industries } from '../../../data/industriesData';
import { useStaggerReveal, STAGGER_PRESET } from '../../../animations';
import layout from '../../../styles/layout.module.css';
import styles from './SectorsSection.module.css';

const SectorsSection = () => {
  const { openLeadDrawer } = useModal();
  const gridRef = useStaggerReveal(STAGGER_PRESET);

  return (
    <section className={`${layout.container} ${styles.section}`}>
      <div className={styles.sectors} ref={gridRef}>
        {industries.map((industry) => (
          <div className={styles.sector} key={industry.num}>
            <div className={styles.top}>
              <span
                className={styles.icon}
                aria-hidden="true"
                style={{ backgroundImage: `url('${industry.icon}')` }}
              />
              <span className={styles.num}>{industry.num}</span>
            </div>
            <span className={styles.name}>{industry.name}</span>
            <span className={styles.desc}>{industry.description}</span>
          </div>
        ))}

        <button
          type="button"
          className={styles.sectorRed}
          onClick={() => openLeadDrawer('industries-cta')}
        >
          <span className={`${styles.name} ${styles.nameRed}`}>
            Don&rsquo;t see your sector? Our approach begins with your context.
          </span>
          <span className={styles.go}>
            Tell us about it <i aria-hidden="true">&rarr;</i>
          </span>
        </button>
      </div>
    </section>
  );
};

export default SectorsSection;
