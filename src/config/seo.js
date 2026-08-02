/* ============================================
   SEO Configuration — Dulcey Lead Services
   --------------------------------------------
   Central configuration for every SEO setting, page title/description and
   schema input used by the five-route Dulcey site.

   Everything here is generated from the single sources of truth so the
   metadata can never drift from the visible site:
     - company / contact facts   → src/data/siteConfig.js
     - the ten expertise areas   → src/data/expertiseData.js
     - the seven sectors served  → src/data/industriesData.js
     - the nav labels (used for breadcrumb names) → src/data/navigation.js

   Two layers consume this file and MUST stay in sync with each other:
     1. runtime  — src/utils/seo.js generators + SEOHead inject JSON-LD by
        element id and rewrite the head on every client-side navigation.
     2. static   — public/index.html carries the same tags and the same
        schema element ids as a no-JS fallback for crawlers. When a schema
        id or the home-page copy changes here, mirror it there.

   Deliberately NOT modelled (no fabricated facts — Google structured-data
   guidelines): LocalBusiness, PostalAddress, geo coordinates, opening
   hours, aggregate ratings, and FAQPage (the site has no visible FAQ).
   ============================================ */

import { siteConfig } from '../data/siteConfig';
import { expertiseAreas, expertiseTitles } from '../data/expertiseData';
import { industries } from '../data/industriesData';
import { NAV_LINKS } from '../data/navigation';

const SITE_URL = siteConfig.siteUrl; // https://www.dulceyleadservices.com

/** Absolute URL for a route path ('/' → siteUrl + '/'). */
const absolute = (path) => `${SITE_URL}${path}`;

/** The nav label for a route — breadcrumb names match the visible nav. */
const navLabel = (path) =>
  (NAV_LINKS.find((link) => link.to === path) || {}).label;

/** Comma-joined keyword string, brand-prefixed. */
const keywords = (...terms) => [siteConfig.brandName, ...terms].join(', ');

const industryNames = industries.map((industry) => industry.name);

export const seoConfig = {
  // =========================================
  // Site-level Settings
  // =========================================
  siteName: siteConfig.brandName,
  siteUrl: SITE_URL,
  defaultTitle: `${siteConfig.brandName} — ${siteConfig.tagline}`,
  titleTemplate: `%s — ${siteConfig.brandName}`,
  defaultDescription:
    'Dulcey Lead Services works with businesses, institutions and entrepreneurs to navigate complexity, strengthen organizational capability and grow sustainably.',
  defaultImage: `${SITE_URL}/og-image.png`,
  locale: 'en_IN',
  language: 'en',

  // =========================================
  // Organization Details
  // --------------------------------------------
  // Emitted as a plain `Organization` — there is no public postal address,
  // and inventing one to qualify for LocalBusiness would be a guidelines
  // violation. Contact reachability is expressed via `contactPoint`.
  // =========================================
  organization: {
    schemaType: 'Organization',
    name: siteConfig.brandName,
    legalName: siteConfig.legalName,
    url: SITE_URL,
    logo: siteConfig.logo, // color logo (light backgrounds)
    // The footer brand paragraph, verbatim.
    description:
      'A professional business support and consulting organization — helping businesses, institutions, entrepreneurs, and professionals build for sustainable growth.',
    slogan: siteConfig.tagline, // Beyond Business Support
    contactPoint: {
      // schema.org prefers a hyphenated E.164-ish string.
      telephone: siteConfig.phoneDisplay.replace(/\s+/g, '-'),
      contactType: 'customer service',
      email: siteConfig.email,
    },
    // Fill when the client provides real profiles; empty arrays are dropped.
    sameAs: [],
    // The ten areas of experience — what this organization has expertise in.
    knowsAbout: expertiseTitles,
  },

  // =========================================
  // Service list (ItemList of Service)
  // --------------------------------------------
  // Generated from expertiseData so the schema and the /expertise accordion
  // can never disagree. Each item deep-links to its accordion panel.
  // =========================================
  services: {
    name: 'Areas of Experience',
    items: expertiseAreas.map((area) => ({
      name: area.title,
      description: area.description,
      url: `${SITE_URL}/expertise#${area.id}`,
    })),
  },

  // =========================================
  // Page-specific SEO Settings
  // --------------------------------------------
  // Titles are the mockup <title> values verbatim. Descriptions are written
  // from each page's own visible copy and kept to ~150–160 characters.
  // `path` drives the canonical URL; `breadcrumb` is the nav label.
  // =========================================
  pages: {
    home: {
      path: '/',
      title: `${siteConfig.brandName} — ${siteConfig.tagline}`,
      description:
        'Dulcey Lead Services works with businesses, institutions and entrepreneurs to navigate complexity, strengthen organizational capability and grow sustainably.',
      keywords: keywords(
        siteConfig.tagline,
        'business solutions',
        'people & organization',
        'corporate services',
        'leadership & capability building',
      ),
      robots: 'index, follow',
      // The service list is relevant to the home index and /expertise only.
      services: true,
    },
    about: {
      path: '/about',
      breadcrumb: navLabel('/about'),
      title: `About — ${siteConfig.brandName}`,
      description:
        'Built on experience, defined by trust — Dulcey Lead Services brings people, processes, information, operations and leadership together, with depth in pharma.',
      keywords: keywords(
        'about Dulcey',
        'business consulting India',
        'organizational capability',
        'pharmaceutical business experience',
      ),
      robots: 'index, follow',
    },
    expertise: {
      path: '/expertise',
      breadcrumb: navLabel('/expertise'),
      title: `Our Expertise — ${siteConfig.brandName}`,
      description:
        'Ten connected areas of experience — HR, administration, analytics, pharma, corporate and legal, leadership, soft skills, academics, coaching and branding.',
      keywords: keywords(...expertiseTitles),
      robots: 'index, follow',
      services: true,
    },
    industries: {
      path: '/industries',
      breadcrumb: navLabel('/industries'),
      title: `Who We Serve — ${siteConfig.brandName}`,
      description:
        'Our expertise, your industry — pharma and healthcare, hospitals, corporates, marketing and sales teams, business schools, startups, entrepreneurs, investors.',
      keywords: keywords(...industryNames),
      robots: 'index, follow',
    },
    contact: {
      path: '/contact',
      breadcrumb: navLabel('/contact'),
      title: `Contact — ${siteConfig.brandName}`,
      description: `Let's build what comes next. Call ${siteConfig.phoneDisplay}, email us, or send an enquiry — we usually reply within a day. One conversation is where it starts.`,
      keywords: keywords(
        'contact',
        'business enquiry',
        'business consulting enquiry',
        siteConfig.phoneDisplay,
      ),
      robots: 'index, follow',
    },

    // ---- Non-indexable routes ----
    admin: {
      path: '/admin',
      // The admin panel's browser-tab title.
      title: `Admin Panel — ${siteConfig.brandName}`,
      description: '',
      robots: 'noindex, nofollow',
      noindex: true,
    },
    notFound: {
      path: '/404',
      title: `Page Not Found — ${siteConfig.brandName}`,
      description:
        'The page you are looking for does not exist. Return to Dulcey Lead Services to explore our expertise, the sectors we serve, or start a conversation.',
      robots: 'noindex, nofollow',
      noindex: true,
    },
  },

  // Convenience: absolute-URL helper shared with the runtime generators.
  absolute,
};

export default seoConfig;
