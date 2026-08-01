/* ============================================
   StatsSection — Nilachal headline metrics band
   A quiet, full-width dark-navy band showing the five
   statsData metrics in one row: a big white number that
   counts up on scroll-in (GSAP useCountUp) and a
   slate-on-dark label below, divided by thin vertical
   hairlines. No section id (it is not a nav target).

   Animation: GSAP + ScrollTrigger via the shared hooks
   (src/animations) — `useStaggerReveal` fades the items up
   and `useCountUp` drives each counter (honouring the
   `10+` / `5000+` / `100%` prefix/suffix format, firing
   once on scroll into view). Both no-op to their final
   state under `prefers-reduced-motion`.
   ============================================ */

import { useCountUp, useStaggerReveal } from "../../../animations";
import { statsData } from "../../../data/statsData";
import styles from "./StatsSection.module.css";

/**
 * Split a stat string that starts with a number into the value the counter
 * animates to and the trailing prefix/suffix + decimal places, e.g.
 *   "10+"    -> { value: 10,   suffix: "+", decimals: 0 }
 *   "5000+"  -> { value: 5000, suffix: "+", decimals: 0 }
 *   "100%"   -> { value: 100,  suffix: "%", decimals: 0 }
 */
const parseStatValue = (stat) => {
  const raw = String(stat).trim();
  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return { value: 0, suffix: raw, decimals: 0 };

  const numStr = match[1];
  const suffix = match[2] || "";
  const value = parseFloat(numStr);
  const decimals = numStr.includes(".") ? (numStr.split(".")[1] || "").length : 0;

  return { value, suffix, decimals };
};

// One stat: a GSAP-driven count-up number + its label. Its own hook keeps the
// counter scoped to this element so each number animates independently.
const StatItem = ({ stat }) => {
  const { value, suffix, decimals } = parseStatValue(stat.stat);
  const numberRef = useCountUp(value, { suffix, decimals });

  return (
    <div className={styles.item}>
      {/* Initial text is the final value so it is meaningful before/without JS;
          useCountUp overwrites it (starting at 0) and counts up on scroll-in. */}
      <span ref={numberRef} className={styles.number}>
        {stat.stat}
      </span>
      <span className={styles.label}>{stat.statLabel}</span>
    </div>
  );
};

const StatsSection = () => {
  // The five items stagger up once on scroll-in; the hook refreshes
  // ScrollTrigger so this lazy-mounted band measures correctly.
  const rowRef = useStaggerReveal();

  return (
    <section className={styles.statsBand}>
      <div className={styles.container}>
        <div ref={rowRef} className={styles.row}>
          {statsData.map((stat) => (
            <StatItem key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
