/* ============================================
   hashScroll — the shared "#hash → scroll" helper
   --------------------------------------------
   One implementation of "bring `#target` into view under the fixed
   header", shared by:

   - `App`'s ScrollManager — every route/hash change, and
   - the `/expertise` accordion — `#e01`–`#e10` deep links, which open
     their item first and then land on it.

   Routes and sections are lazy, so the target often is not in the DOM
   on the first attempt: `scrollToHash` keeps retrying on a short
   schedule and hands back a cancel function for effect cleanup.
   ============================================ */

// Fixed header height (68px) + breathing room. Matches the mockup's
// `scroll-margin-top:90px` on deep-linked elements.
export const HEADER_OFFSET = 90;

// Retry schedule (ms) — long enough for a lazy route chunk to mount.
export const HASH_RETRY_DELAYS = [100, 300, 600, 1000, 2000];

/**
 * `location.hash` → the bare (decoded) element id.
 * @param {string} [hash] e.g. `#e07`.
 * @returns {string} the id, or '' when there is no hash.
 */
export const hashToId = (hash) =>
  hash ? decodeURIComponent(hash.replace(/^#/, '')) : '';

/**
 * Scroll an element into view, clearing the fixed header.
 * @param {string} targetId Element id (no leading `#`).
 * @param {Object} [options]
 * @param {number} [options.offset=HEADER_OFFSET] Space to leave on top (px).
 * @param {ScrollBehavior} [options.behavior='smooth'] Scroll behavior.
 * @returns {boolean} false when the element is not (yet) in the DOM.
 */
export const scrollToId = (targetId, options = {}) => {
  const { offset = HEADER_OFFSET, behavior = 'smooth' } = options;
  if (!targetId || typeof document === 'undefined') return false;

  const target = document.getElementById(targetId);
  if (!target) return false;

  const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior });
  return true;
};

/**
 * `scrollToId`, but polls until the target has rendered.
 * @param {string} targetId Element id (no leading `#`).
 * @param {Object} [options] `offset` / `behavior` (see `scrollToId`), plus
 *   `delays` — the retry schedule in ms.
 * @returns {Function} cancel — clears pending retries (use as effect cleanup).
 */
export const scrollToHash = (targetId, options = {}) => {
  const { delays = HASH_RETRY_DELAYS, ...scrollOptions } = options;
  const noop = () => {};
  if (!targetId) return noop;

  // Already rendered — nothing to poll for.
  if (scrollToId(targetId, scrollOptions)) return noop;

  let cancelled = false;
  const timers = delays.map((delay) =>
    setTimeout(() => {
      if (!cancelled) scrollToId(targetId, scrollOptions);
    }, delay)
  );

  return () => {
    cancelled = true;
    timers.forEach(clearTimeout);
  };
};

export default scrollToHash;
