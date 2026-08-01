/* ============================================
   SEO Configuration
   --------------------------------------------
   Central configuration for all SEO-related settings, schemas, and page
   metadata for the Nilachal Infracon website.

   Everything here is generated from the single sources of business truth so
   the schemas can never drift from the visible site:
     - contact / company facts  → src/data/siteConfig.js
     - the Northeast states served → src/data/locationData.js
     - the FAQ Q&As (must match the FAQ section exactly) → src/data/faqData.js

   The runtime SEO utilities (src/utils/seo.js) consume this config and inject
   matching JSON-LD at runtime, overriding the static fallbacks in
   public/index.html (which share the same element ids).
   ============================================ */

import { siteConfig, fullAddress } from "../data/siteConfig";
import { locationData } from "../data/locationData";
import { faqData } from "../data/faqData";

// The 8 Northeast states Nilachal Infracon serves — used for areaServed.
const areaServed = locationData.servingStates;

// PostalAddress parts, shaped for schema.org from the siteConfig address.
const address = {
  streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
  addressLocality: siteConfig.address.city,
  addressRegion: siteConfig.address.state,
  postalCode: siteConfig.address.pincode,
  addressCountry: "IN",
};

export const seoConfig = {
  // =========================================
  // Site-level Settings
  // =========================================
  siteName: "Nilachal Infracon",
  siteUrl: siteConfig.siteUrl, // https://www.nilachalinfracon.com
  defaultTitle:
    "Nilachal Infracon — Building Materials & Construction, Northeast India",
  titleTemplate: "%s | Nilachal Infracon",
  defaultDescription:
    "North East Buildmart by Nilachal Infracon: premium building materials & construction services in Nagaon, Assam & across Northeast India. Get a quote today.",
  defaultImage: `${siteConfig.siteUrl}/og-image.png`,
  locale: "en_IN",
  language: "en",

  // =========================================
  // Organization Details
  // =========================================
  organization: {
    // schema.org @type for the Organization JSON-LD block.
    schemaType: "Organization",
    name: siteConfig.legalName,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.flagshipBrand, // North East Buildmart
    url: siteConfig.siteUrl,
    logo: siteConfig.logo, // color logo for light backgrounds
    phone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    description:
      "Nilachal Infracon Private Limited is an infrastructure and building-materials company in Nagaon, Assam. Through its flagship retail brand North East Buildmart it supplies premium construction materials, and delivers residential, commercial and institutional construction projects across Northeast India.",
    address,
    sameAs: [], // fill when the client's social profiles exist
    foundingDate: "2026",
    areaServed,
  },

  // =========================================
  // Page-specific SEO Settings
  // (SEOHead reads pages.home / pages.thankYou / pages.admin)
  // =========================================
  pages: {
    home: {
      title:
        "Nilachal Infracon — Building Materials & Construction, Northeast India",
      description:
        "North East Buildmart by Nilachal Infracon: premium building materials & construction services in Nagaon, Assam & across Northeast India. Get a quote today.",
      keywords:
        "Nilachal Infracon, North East Buildmart, building materials Nagaon, construction materials Assam, building materials supplier Northeast India, construction company Nagaon Assam, TMT bars, cement, tiles, sanitaryware, UPVC doors Assam",
      robots: "index, follow",
    },
    thankYou: {
      title: "Thank You — Nilachal Infracon",
      description:
        "Thanks for reaching out to Nilachal Infracon. Our team will call or WhatsApp you within 24 hours with your quotation or consultation.",
      robots: "noindex, nofollow",
    },
    admin: {
      title: "Admin Panel — Nilachal Infracon",
      robots: "noindex, nofollow",
    },
  },

  // =========================================
  // FAQ Schema Data
  // --------------------------------------------
  // Derived from src/data/faqData.js so the FAQPage schema exactly matches the
  // visible FAQ section (a Google structured-data requirement). Only the
  // question/answer text is needed for the schema.
  // =========================================
  faqs: faqData.map(({ question, answer }) => ({ question, answer })),

  // =========================================
  // LocalBusiness / HomeAndConstructionBusiness Schema Settings
  // =========================================
  localBusiness: {
    type: ["LocalBusiness", "HomeAndConstructionBusiness"],
    // additionalType hint that this business supplies building materials.
    additionalType: "https://www.productontology.org/id/Building_material",
    priceRange: "₹₹",
    openingHours: {
      // TODO: confirm exact business hours with the client.
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
    geo: {
      // Approximate — Nagaon town / Lawkhowa Road area (town centre ≈
      // 26.3504, 92.6796). Refine with the exact store coordinates when known.
      latitude: "26.3489",
      longitude: "92.6820",
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      siteConfig.mapsQuery,
    )}`,
  },

  // Convenience: the full one-line postal address (from siteConfig helper).
  fullAddress,
};

export default seoConfig;
