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

export default siteConfig;
