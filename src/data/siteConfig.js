/* ============================================
   siteConfig — Single source of business truth
   --------------------------------------------
   Every contact/company fact used across the site, SEO, and docs lives
   here. Components MUST import from this file rather than hard-coding
   phone numbers, emails, addresses, or logo URLs.
   ============================================ */

export const siteConfig = {
  legalName: 'Nilachal Infracon Private Limited',
  brandName: 'Nilachal Infracon',
  flagshipBrand: 'North East Buildmart',
  tagline: 'Building Tomorrow, Together.',
  cin: 'U46630AS2026PTC030754',
  phone: '+918638543526',
  phoneDisplay: '+91 86385 43526',
  whatsapp: '+918638543526',
  whatsappMessage:
    'Hello Nilachal Infracon, I would like to enquire about your products/services.',
  email: 'info@nilachalinfracon.com',
  address: {
    line1: 'Lawkhowa Road',
    line2: 'Near Aditya Multispeciality Hospital',
    city: 'Nagaon',
    state: 'Assam',
    pincode: '782003',
  },
  siteUrl: 'https://www.nilachalinfracon.com',
  logo: 'https://res.cloudinary.com/dn9gyaiik/image/upload/v1784965863/nilachal-logo_v2lolq.png',
  logoWhite:
    'https://res.cloudinary.com/dn9gyaiik/image/upload/v1784965863/nilachal-logo-white_hus13s.png',
  mapsQuery:
    'Nilachal Infracon Private Limited, Lawkhowa Road, Nagaon, Assam 782003',
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
