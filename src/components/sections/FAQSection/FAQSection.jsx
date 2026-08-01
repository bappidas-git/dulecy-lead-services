/* ============================================
   FAQSection — Frequently asked questions
   The seven faqData entries as a minimal accordion: thin
   hairline-separated rows, the question in ink, and a plus
   icon that rotates 45° (GSAP) as the answer expands with a
   height-auto tween. One row is open at a time, and the whole
   accordion is keyboard-accessible (button + aria-expanded +
   aria-controls). The same faqData feeds the FAQPage JSON-LD
   schema (prompt 12), so answers stay self-contained.

   Animation: GSAP + ScrollTrigger — `useReveal` fades the
   header up, `useStaggerReveal` staggers the rows, and each
   row tweens its own panel height + icon rotation. Everything
   renders in its final state instantly under
   `prefers-reduced-motion`.
   ============================================ */

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
  gsap,
  EASE,
  DURATION,
  useReveal,
  useStaggerReveal,
  prefersReducedMotion,
} from "../../../animations";
import { faqData } from "../../../data/faqData";
import styles from "./FAQSection.module.css";

// One accordion row. Owns its panel + icon refs and animates them whenever its
// open state flips. Height tweens to/from `auto`; the plus icon rotates to 45°.
const FAQItem = ({ faq, isOpen, onToggle }) => {
  const panelRef = useRef(null);
  const iconRef = useRef(null);
  const questionId = `faq-q-${faq.id}`;
  const panelId = `faq-a-${faq.id}`;

  useEffect(() => {
    const panel = panelRef.current;
    const icon = iconRef.current;
    if (!panel || !icon) return;

    if (prefersReducedMotion()) {
      gsap.set(panel, { height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 });
      gsap.set(icon, { rotate: isOpen ? 45 : 0 });
      return;
    }

    gsap.to(icon, { rotate: isOpen ? 45 : 0, duration: DURATION.fast, ease: EASE });
    gsap.to(panel, {
      height: isOpen ? "auto" : 0,
      opacity: isOpen ? 1 : 0,
      duration: isOpen ? DURATION.base : DURATION.fast,
      ease: EASE,
    });
  }, [isOpen]);

  return (
    <div className={styles.item}>
      <button
        type="button"
        id={questionId}
        className={styles.question}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={styles.questionText}>{faq.question}</span>
        <span ref={iconRef} className={styles.icon} aria-hidden="true">
          <Icon icon="mdi:plus" />
        </span>
      </button>
      <div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-labelledby={questionId}
        className={styles.panel}
        style={{ height: 0, opacity: 0, overflow: "hidden" }}
      >
        <p className={styles.answer}>{faq.answer}</p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openId, setOpenId] = useState(null);

  // Header fades up once on scroll-in; the rows stagger in. Each hook refreshes
  // ScrollTrigger so this lazy-mounted section measures correctly.
  const headerRef = useReveal();
  const listRef = useStaggerReveal();

  // One open at a time: toggling the open row closes it, otherwise it opens.
  const handleToggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <section className={styles.faqSection} id="faq">
      <div className={styles.container}>
        {/* Header */}
        <header ref={headerRef} className={styles.header}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowBar} aria-hidden="true" />
            Frequently Asked Questions
          </p>
          <h2 className={styles.headline}>Answers before you ask</h2>
        </header>

        {/* Accordion */}
        <div ref={listRef} className={styles.list}>
          {faqData.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
