/* ============================================
   Home / Who we are — ported 1:1 from `mockup/index.html`
   --------------------------------------------
   Split section: the heading + wiped-in rule on the left, two
   paragraphs and the "More about Dulcey" link on the right. Every
   class it needs is already a shared primitive (layout module +
   `dulcey.css` typography), so this section carries no module of its
   own — only the mockup's per-element reveal delays.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { useReveal, useLineReveal, REVEAL_PRESET } from '../../../animations';
import layout from '../../../styles/layout.module.css';

const WhoWeAreSection = () => {
  const eyebrowRef = useReveal(REVEAL_PRESET);
  const headRef = useReveal({ ...REVEAL_PRESET, delay: 0.05 });
  const ruleRef = useLineReveal();
  const leadRef = useReveal(REVEAL_PRESET);
  const noteRef = useReveal({ ...REVEAL_PRESET, delay: 0.08 });
  const linkRef = useReveal({ ...REVEAL_PRESET, delay: 0.14 });

  return (
    <section className={layout.section}>
      <div className={`${layout.container} ${layout.split}`}>
        <div className={layout.splitAside}>
          <p className="eyebrow" ref={eyebrowRef}>
            Who we are
          </p>
          <h2 className="section-head" ref={headRef}>
            Built on experience. Defined by trust.
          </h2>
          <div className="rule" ref={ruleRef} />
        </div>

        <div className={layout.splitMain}>
          <p className="body-lg" ref={leadRef}>
            Our experience spans HR and people management, business
            administration, analytics, business management, corporate legal
            services, intellectual property and brand protection, leadership
            development, professional training, and organizational capability
            building.
          </p>
          <p className="body-md" ref={noteRef}>
            With specialized experience in the pharmaceutical and healthcare
            business, we bring a depth of industry understanding to one of the
            most dynamic and demanding business environments &mdash; while our
            broader expertise enables us to work across diverse sectors and
            professional environments.
          </p>
          <Link className="link-more" to="/about" ref={linkRef}>
            More about Dulcey <i aria-hidden="true">&rarr;</i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
