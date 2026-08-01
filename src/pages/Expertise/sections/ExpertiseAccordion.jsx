/* ============================================
   Expertise / Accordion — ported 1:1 from `mockup/expertise.html`
   --------------------------------------------
   The ten areas of experience as a single-open disclosure list, driven
   by `expertiseData`. Semantics match `mockup/scripts.js` exactly:

   - item 01 is open on load, unless the URL carries a matching
     `#e01`–`#e10` hash (deep links from the home-page index rows, the
     footer of another page, or an external link);
   - clicking a header closes every item and opens the clicked one —
     clicking the open one closes it, so all-closed is a legal state;
   - every toggle refreshes ScrollTrigger, so the reveals further down
     the page keep their measured start positions.

   Each header is a real <button> with `aria-expanded` / `aria-controls`
   (so Enter/Space come for free) and its body is a labelled region.
   ============================================ */

import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { expertiseAreas } from '../../../data/expertiseData';
import { useModal } from '../../../context/ModalContext';
import { scheduleRefresh } from '../../../animations';
import { hashToId, scrollToHash } from '../../../utils/hashScroll';
import layout from '../../../styles/layout.module.css';
import styles from './ExpertiseAccordion.module.css';

// The mockup ships with the first item open.
const DEFAULT_OPEN_ID = expertiseAreas[0].id;

/** The area a `#hash` points at — '' when it points anywhere else. */
const areaIdFromHash = (hash) => {
  const id = hashToId(hash);
  return expertiseAreas.some((area) => area.id === id) ? id : '';
};

const ExpertiseAccordion = () => {
  const { openLeadModal } = useModal();
  const location = useLocation();
  const hashId = areaIdFromHash(location.hash);

  // Single-open: one item id, or null once the open one is collapsed.
  const [openId, setOpenId] = useState(() => hashId || DEFAULT_OPEN_ID);
  // The deep link still waiting to be scrolled to, if any.
  const [pendingScroll, setPendingScroll] = useState(null);

  const toggle = useCallback((id) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  // Deep links — `/expertise#e07` on load, and home-page rows clicked
  // while already here. `location.key` changes on every navigation, so
  // the same row can be clicked twice and still re-open its item.
  useEffect(() => {
    if (!hashId) return;
    setOpenId(hashId);
    setPendingScroll({ id: hashId, key: location.key });
  }, [hashId, location.key]);

  // Toggling changes the page height — every ScrollTrigger below has to
  // re-measure, exactly as the mockup refreshed after each toggle. Deferred
  // by a frame so the newly rendered body is already laid out when we
  // measure (the effect itself runs before paint).
  useEffect(() => {
    scheduleRefresh();
  }, [openId]);

  // …then land on the deep-linked item, now that its open state has
  // rendered (an expanded body changes what sits above it).
  useEffect(() => {
    if (!pendingScroll) return undefined;
    return scrollToHash(pendingScroll.id);
  }, [pendingScroll]);

  return (
    <section className={`${layout.container} ${styles.section}`}>
      <div className={styles.acc}>
        {expertiseAreas.map((area) => {
          const isOpen = openId === area.id;
          const panelId = `${area.id}-panel`;
          const headId = `${area.id}-head`;

          return (
            <div
              key={area.id}
              id={area.id}
              className={`${styles.item} ${isOpen ? styles.open : ''}`}
            >
              <button
                type="button"
                id={headId}
                className={styles.head}
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
                onClick={() => toggle(area.id)}
              >
                <span className={styles.num}>{area.num}</span>
                <span className={styles.titles}>
                  <span className={styles.title}>{area.title}</span>
                  <span className={styles.tagline}>{area.tagline}</span>
                </span>
                <i className={styles.icon} aria-hidden="true">
                  +
                </i>
              </button>

              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headId}
                  className={styles.body}
                >
                  <div className={styles.cols}>
                    <div className={styles.text}>
                      <p className={styles.desc}>{area.description}</p>
                      <p className={styles.note}>{area.note}</p>
                      <p className={styles.closing}>{area.closing}</p>
                    </div>

                    <div className={styles.side}>
                      <p className={styles.sideLabel}>Our experience spans</p>
                      <div className={styles.tags}>
                        {area.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <button
                        type="button"
                        className={styles.cta}
                        onClick={() =>
                          openLeadModal(`expertise-${area.id}`, {
                            service_interest: area.title,
                          })
                        }
                      >
                        Discuss this area <span aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExpertiseAccordion;
