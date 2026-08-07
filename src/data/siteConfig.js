/* ============================================
   siteConfig — Single source of business truth
   --------------------------------------------
   Every contact/company fact used across the site, SEO, and docs lives
   here. Components MUST import from this file rather than hard-coding
   phone numbers, emails, addresses, or logo URLs.
   ============================================ */

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dn9gyaiik/image/upload';

export const siteConfig = {
  legalName: 'Dulcey Lead Services',
  brandName: 'Dulcey Lead Services',
  tagline: 'Beyond Business Support',
  taglineSecondary: 'Your Partner in Business Leadership',
  phone: '+917099002522',
  phoneDisplay: '+91 70990 02522',
  email: 'dulceyleadservices@gmail.com',
  // No postal address: the brand material publishes none, and the site
  // deliberately claims none in its schemas either.
  siteUrl: 'https://www.dulceyleadservices.com',
  // The wordmark lockup, self-hosted under `public/images/logo/`. Both PNGs
  // carry a real alpha channel — the background is transparent, so the mark
  // sits on white, grey, and ink surfaces without a plate behind it. They are
  // one 1351x200 master each rather than a per-surface render; at 21 KB with
  // `/images/**` served immutable, that is cheaper than the round trips.
  // Site-root paths, so they resolve from any route — wrap in `absoluteUrl()`
  // wherever a schema or meta tag needs a fully qualified URL.
  //
  // The `-1351` suffix is the width, matching the convention the rest of
  // `/images/**` uses (`hero-home-1920.webp`). Those files answer `immutable`
  // for a year, so re-cutting the artwork means a NEW filename — overwriting
  // in place would leave every returning visitor on the previous render.
  logo: '/images/logo/dulcey-wordmark-1351.png',
  logoWhite: '/images/logo/dulcey-wordmark-white-1351.png',
  // The "D" mark. Its Cloudinary public_id still carries the old spelling —
  // that is the asset's immutable delivery path, not a brand string.
  // Favicon / PWA-icon / splash lineage only — `scripts/generate-icons.js` and
  // the `public/index.html` splash both hard-code this same URL.
  logoIcon: `${CLOUDINARY_BASE}/v1785484838/Dulecy-Logo-Icon_hylrpw.png`,
  // The "DLS" initialism mark, self-hosted alongside the wordmark and carrying
  // the same real alpha channel (peak 255 as supplied — the wordmark's
  // alpha-normalisation pass does not apply). Trimmed to the artwork's own
  // bounding box, so a CSS `width` maps straight onto the visible mark with no
  // dead padding to compensate for. Drawn by the Home hero's floating
  // watermark; the `-860` suffix is the width, and `/images/**` answers
  // `immutable`, so re-cutting the artwork means a NEW filename.
  logoMark: '/images/logo/dls-mark-860.png',
  social: {}, // fill when the client provides profiles; components must hide empty entries
  // Studio credit rendered in the footer's legal row. External site, so the
  // footer opens it in a new tab.
  developer: {
    name: 'Assam Digital',
    url: 'https://assamdigital.com',
  },
};

// =========================================
// Derived helpers
// =========================================

/** `tel:` href for the primary phone number. */
export const telHref = `tel:${siteConfig.phone}`;

/** `mailto:` href for the company email. */
export const mailHref = `mailto:${siteConfig.email}`;

/**
 * Intrinsic pixel size of the two wordmark PNGs.
 *
 * Every `<img>` that draws the lockup sets these as its `width`/`height`
 * attributes so the browser reserves the right 6.76:1 box before the file
 * lands. CSS then sets the rendered height and leaves `width: auto`.
 */
export const LOGO_SIZE = { width: 1351, height: 200 };

/**
 * Intrinsic pixel size of the "DLS" mark PNG.
 *
 * Same contract as `LOGO_SIZE`: the `<img>` sets these as its `width`/`height`
 * attributes so the browser reserves the right 1.87:1 box before the file
 * lands, and CSS sets the rendered width with `height: auto`.
 */
export const MARK_SIZE = { width: 860, height: 460 };

/**
 * Absolute URL for a site-root path, left alone if it is already absolute.
 *
 * The logos moved from Cloudinary to `public/images/`, so the values in
 * `siteConfig` are now root-relative. Schemas, Open Graph tags, and anything
 * else a crawler reads need the fully qualified form.
 *
 * @example absoluteUrl(siteConfig.logo)  // https://www.dulceyleadservices.com/images/logo/…
 */
export const absoluteUrl = (pathOrUrl) =>
  /^https?:\/\//i.test(pathOrUrl)
    ? pathOrUrl
    : `${siteConfig.siteUrl}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;

/**
 * Display URL for a Cloudinary asset, capped to the size that surface
 * actually renders (Prompt 12).
 *
 * `f_auto` negotiates WebP/AVIF, `q_auto:best` keeps a brand mark's edges
 * clean, and `w`/`h` should be passed at **2× the CSS box** so it stays crisp
 * on retina.
 *
 * Only `logoIcon` still lives on Cloudinary — the wordmark and the "DLS" mark
 * are self-hosted and ship at one size each — so a non-Cloudinary URL is
 * returned untouched rather than silently no-op'ing through a `.replace()`
 * that never matches.
 *
 * **Currently has no caller.** Its one consumer was the Home hero watermark,
 * which now draws the self-hosted `logoMark` instead. Kept because `logoIcon`
 * is still live (the favicon/PWA pipeline and the `index.html` splash both
 * hard-code that same Cloudinary URL) and this is the only way to size it.
 *
 * @example logoAt(siteConfig.logoIcon, { w: 760 })
 */
export const logoAt = (url, { w, h } = {}) => {
  if (!url.includes('/image/upload/')) return url;
  const size = [w && `w_${w}`, h && `h_${h}`].filter(Boolean).join(',');
  const transform = ['f_auto', 'q_auto:best', size].filter(Boolean).join(',');
  return url.replace('/image/upload/', `/image/upload/${transform}/`);
};

export default siteConfig;
