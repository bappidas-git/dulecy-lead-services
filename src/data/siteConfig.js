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
  // retired in Prompt 11 — kept so existing consumers keep compiling.
  flagshipBrand: 'Dulecy Lead Services',
  tagline: 'Beyond Business Support',
  taglineSecondary: 'Your Partner in Business Leadership',
  phone: '+917099002522',
  phoneDisplay: '+91 70990 02522',
  // retired in Prompt 11 — the WhatsApp UI is removed in Prompt 02.
  whatsapp: '+917099002522',
  whatsappMessage:
    'Hello Dulecy Lead Services, I would like to enquire about your services.',
  // Intentional spelling — this is the client's real mailbox.
  email: 'dulceyleadservices@gmail.com',
  // No public postal address in the brand material; `fullAddress` skips empties.
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  },
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

/** wa.me deep link with the default enquiry message pre-filled. */
export const waHref = `https://wa.me/${siteConfig.whatsapp.replace(
  /[^\d]/g,
  '',
)}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

/** `mailto:` href for the company email. */
export const mailHref = `mailto:${siteConfig.email}`;

/** Single-line, comma-joined postal address (skips any empty parts). */
export const fullAddress = [
  siteConfig.address.line1,
  siteConfig.address.line2,
  siteConfig.address.city,
  siteConfig.address.state,
  siteConfig.address.pincode,
]
  .filter(Boolean)
  .join(', ');

export default siteConfig;
