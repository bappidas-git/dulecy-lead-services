/* ============================================
   siteConfig — Single source of business truth
   --------------------------------------------
   Every contact/company fact used across the site, SEO, and docs lives
   here. Components MUST import from this file rather than hard-coding
   phone numbers, emails, addresses, or logo URLs.
   ============================================ */

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dn9gyaiik/image/upload';

export const siteConfig = {
  legalName: 'Dulecy Lead Services',
  brandName: 'Dulecy Lead Services',
  tagline: 'Beyond Business Support',
  taglineSecondary: 'Your Partner in Business Leadership',
  phone: '+917099002522',
  phoneDisplay: '+91 70990 02522',
  // Intentional spelling — this is the client's real mailbox.
  email: 'dulceyleadservices@gmail.com',
  // No postal address: the brand material publishes none, and the site
  // deliberately claims none in its schemas either.
  siteUrl: 'https://www.dulecy.com',
  logo: `${CLOUDINARY_BASE}/v1785484838/Dulecy-Logo_qr2ka7.png`,
  logoWhite: `${CLOUDINARY_BASE}/v1785484839/Dulecy-Logo-White_uxpsb6.png`,
  logoIcon: `${CLOUDINARY_BASE}/v1785484838/Dulecy-Logo-Icon_hylrpw.png`,
  social: {}, // fill when the client provides profiles; components must hide empty entries
};

// =========================================
// Derived helpers
// =========================================

/** `tel:` href for the primary phone number. */
export const telHref = `tel:${siteConfig.phone}`;

/** `mailto:` href for the company email. */
export const mailHref = `mailto:${siteConfig.email}`;

/**
 * Display URL for a Cloudinary logo, capped to the size that surface
 * actually renders (Prompt 12).
 *
 * The originals are 1800×475 / 1000×1001 PNGs — 500 KB across the three of
 * them — while the header draws the logo 40px tall. `f_auto` negotiates
 * WebP/AVIF, `q_auto:best` keeps a brand mark's edges clean, and `w`/`h`
 * should be passed at **2× the CSS box** so it stays crisp on retina.
 *
 * The logos stay on Cloudinary; this only asks for fewer pixels. Pass the
 * untransformed `siteConfig.logo*` values to SEO schemas — crawlers should
 * keep seeing the full-resolution originals.
 *
 * @example logoAt(siteConfig.logo, { h: 96 })  // header, 40px tall
 */
export const logoAt = (url, { w, h } = {}) => {
  const size = [w && `w_${w}`, h && `h_${h}`].filter(Boolean).join(',');
  const transform = ['f_auto', 'q_auto:best', size].filter(Boolean).join(',');
  return url.replace('/image/upload/', `/image/upload/${transform}/`);
};

export default siteConfig;
