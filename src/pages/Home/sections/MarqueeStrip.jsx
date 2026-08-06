/* ============================================
   Home / Marquee — ported 1:1 from `mockup/index.html`
   --------------------------------------------
   Slightly rotated ink band of the sectors we serve. The group is
   rendered twice and the track slides from −50% to 0 over 36s, so the
   band travels left-to-right and the loop stays seamless. The two
   groups must stay identical for that to hold.
   Purely decorative — the same names are readable content in
   the "Who we serve" cards below, so the whole strip is aria-hidden.
   ============================================ */

import React from 'react';
import { marqueeItems } from '../../../data/industriesData';
import styles from './MarqueeStrip.module.css';

const GROUPS = ['a', 'b'];

const MarqueeStrip = () => (
  <section className={styles.marquee} aria-hidden="true">
    <div className={styles.track}>
      {GROUPS.map((group) => (
        <div className={styles.group} key={group}>
          {marqueeItems.map((item) => (
            <React.Fragment key={`${group}-${item}`}>
              <span>{item}</span>
              <i>&#9670;</i>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  </section>
);

export default MarqueeStrip;
