/* ============================================
   SEO Utility Functions — Dulecy Lead Services
   --------------------------------------------
   The runtime half of the dual-layer SEO system: pure schema generators
   plus the DOM helpers that rewrite the head on client-side navigation.

   Injection is *by element id*, so each generator replaces the matching
   static block in public/index.html rather than duplicating it. The ids
   below MUST match the `<script type="application/ld+json" id="…">`
   blocks in that file:

     schema-organization · schema-website · schema-webpage
     schema-breadcrumb   · schema-services

   Generators are pure (config in → plain object out) so they can be unit
   tested without a DOM.
   ============================================ */

import { seoConfig } from '../config/seo';

// The public schema ids this module owns — used to clear them on /admin.
export const PUBLIC_SCHEMA_IDS = [
  'schema-organization',
  'schema-website',
  'schema-webpage',
  'schema-breadcrumb',
  'schema-services',
];

// =========================================
// Page SEO — Update document title & meta tags
// =========================================

/**
 * Set or create a meta tag, matched on its identifying attribute so tags
 * are updated in place instead of accumulating duplicates.
 * @param {'name'|'property'} attr - Identifying attribute
 * @param {string} key - Attribute value (e.g. 'description', 'og:title')
 * @param {string} value - The content to set
 */
function setMeta(attr, key, value) {
  if (!value) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

/**
 * Set a meta tag, or remove it when the route has no value for it — so a
 * noindex route never inherits the previous route's URL or keywords.
 * @param {'name'|'property'} attr - Identifying attribute
 * @param {string} key - Attribute value
 * @param {string} [value] - The content to set, or falsy to remove the tag
 */
function setOrRemoveMeta(attr, key, value) {
  if (value) {
    setMeta(attr, key, value);
    return;
  }
  const el = document.querySelector(`meta[${attr}="${key}"]`);
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

/**
 * Set the canonical <link>, creating it once and reusing it thereafter.
 * Passing no URL removes the tag — noindex routes (/admin, 404) must not
 * inherit the previous route's canonical.
 * @param {string} [url] - Absolute canonical URL (no trailing-slash variants)
 */
function setCanonical(url) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!url) {
    if (canonical && canonical.parentNode) {
      canonical.parentNode.removeChild(canonical);
    }
    return;
  }
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

/**
 * Update title, description, canonical, robots, Open Graph and Twitter
 * tags for the current route. Exactly one of each ends up in the DOM.
 * @param {Object} pageConfig - Resolved page metadata
 * @param {string} [pageConfig.title] - Page title
 * @param {string} [pageConfig.description] - Meta description (~150–160 chars)
 * @param {string} [pageConfig.keywords] - Comma-joined keywords (optional)
 * @param {string} [pageConfig.image] - OG/Twitter image URL
 * @param {string} [pageConfig.url] - Absolute canonical URL for this page
 * @param {string} [pageConfig.robots] - Robots directive
 * @param {string} [pageConfig.type] - OG type (default: 'website')
 */
export function updatePageSEO(pageConfig = {}) {
  const {
    title = seoConfig.defaultTitle,
    description = seoConfig.defaultDescription,
    keywords,
    image = seoConfig.defaultImage,
    url,
    robots = 'index, follow',
    type = 'website',
  } = pageConfig;

  document.title = title;

  // Standard meta
  setMeta('name', 'description', description);
  setOrRemoveMeta('name', 'keywords', keywords);
  setMeta('name', 'robots', robots);
  setMeta('name', 'googlebot', robots);

  // Open Graph
  setMeta('property', 'og:type', type);
  setMeta('property', 'og:site_name', seoConfig.siteName);
  setMeta('property', 'og:locale', seoConfig.locale);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:image', image);

  // Twitter Card
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);

  // URL-bearing tags travel together with the canonical.
  setOrRemoveMeta('property', 'og:url', url);
  setOrRemoveMeta('name', 'twitter:url', url);
  setCanonical(url);
}

// =========================================
// JSON-LD Schema Injection / Removal
// =========================================

/**
 * Inject a JSON-LD schema into <head>. If a script with the given id
 * already exists (i.e. the static fallback), its content is replaced.
 * `JSON.stringify` escapes the payload safely for a JS string, and
 * `textContent` never parses HTML — so no markup can break out.
 * @param {string} id - Script element id (e.g. 'schema-organization')
 * @param {Object} schemaObject - The JSON-LD object to inject
 */
export function injectSchema(id, schemaObject) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', id);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaObject);
}

/**
 * Remove a JSON-LD schema by its script element id.
 * @param {string} id - The id of the script element to remove
 */
export function removeSchema(id) {
  const script = document.getElementById(id);
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }
}

// =========================================
// Schema Generators (pure)
// =========================================

/**
 * Generate Organization schema from seoConfig.
 * No address/geo/hours — see the note in src/config/seo.js.
 * @param {Object} [config] - Override seoConfig.organization
 * @returns {Object} JSON-LD Organization schema
 */
export function generateOrganizationSchema(config) {
  const org = config || seoConfig.organization;

  const schema = {
    '@context': 'https://schema.org',
    '@type': org.schemaType || 'Organization',
    name: org.name,
    ...(org.legalName && { legalName: org.legalName }),
    url: org.url,
    logo: org.logo,
    description: org.description,
    ...(org.slogan && { slogan: org.slogan }),
  };

  if (org.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      telephone: org.contactPoint.telephone,
      contactType: org.contactPoint.contactType,
      ...(org.contactPoint.email && { email: org.contactPoint.email }),
    };
  }

  if (org.knowsAbout && org.knowsAbout.length > 0) {
    schema.knowsAbout = org.knowsAbout;
  }

  // Omit an empty sameAs — an empty array is noise for validators.
  if (org.sameAs && org.sameAs.length > 0) {
    schema.sameAs = org.sameAs;
  }

  return schema;
}

/**
 * Generate WebSite schema (site-level identity, emitted on every route).
 * @returns {Object} JSON-LD WebSite schema
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    inLanguage: seoConfig.language,
    publisher: {
      '@type': 'Organization',
      name: seoConfig.organization.name,
      url: seoConfig.organization.url,
    },
  };
}

/**
 * Generate WebPage schema for the current route.
 * @param {Object} config - Page configuration
 * @param {string} config.name - Page name/title
 * @param {string} config.description - Page description
 * @param {string} config.url - Absolute page URL
 * @returns {Object} JSON-LD WebPage schema
 */
export function generateWebPageSchema(config = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: config.name || seoConfig.defaultTitle,
    description: config.description || seoConfig.defaultDescription,
    url: config.url || `${seoConfig.siteUrl}/`,
    inLanguage: seoConfig.language,
    isPartOf: {
      '@type': 'WebSite',
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.organization.name,
      logo: {
        '@type': 'ImageObject',
        url: seoConfig.organization.logo,
      },
    },
  };
}

/**
 * Generate BreadcrumbList schema.
 * @param {Array<{name: string, url: string}>} items - Crumbs, in order
 * @returns {Object} JSON-LD BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Build the crumb trail for a page: Home on `/`, Home → page elsewhere.
 * @param {Object} page - A seoConfig.pages entry
 * @returns {Array<{name: string, url: string}>} Breadcrumb items
 */
export function breadcrumbItemsFor(page = {}) {
  const home = { name: 'Home', url: `${seoConfig.siteUrl}/` };
  if (!page.path || page.path === '/') return [home];
  return [
    home,
    {
      name: page.breadcrumb || page.title,
      url: `${seoConfig.siteUrl}${page.path}`,
    },
  ];
}

/**
 * Generate the ItemList of Service entries from the expertise data layer.
 * @param {Object} [config] - Override seoConfig.services
 * @returns {Object} JSON-LD ItemList schema
 */
export function generateServiceSchema(config) {
  const services = config || seoConfig.services;
  const org = seoConfig.organization;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: services.name,
    itemListElement: services.items.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        serviceType: service.name,
        ...(service.url && { url: service.url }),
        provider: {
          '@type': 'Organization',
          name: org.name,
          url: org.url,
        },
      },
    })),
  };
}

// =========================================
// Route-level orchestration
// =========================================

/**
 * Inject every schema a public route needs, and clear the ones it does not
 * (so a stale ItemList never lingers after navigating away from /expertise).
 * @param {Object} page - A seoConfig.pages entry
 */
export function injectPageSchemas(page = {}) {
  const url = `${seoConfig.siteUrl}${page.path === '/' ? '/' : page.path}`;

  injectSchema('schema-organization', generateOrganizationSchema());
  injectSchema('schema-website', generateWebSiteSchema());
  injectSchema(
    'schema-webpage',
    generateWebPageSchema({
      name: page.title,
      description: page.description,
      url,
    }),
  );
  injectSchema('schema-breadcrumb', generateBreadcrumbSchema(breadcrumbItemsFor(page)));

  if (page.services) {
    injectSchema('schema-services', generateServiceSchema());
  } else {
    removeSchema('schema-services');
  }
}

/**
 * Strip every public schema — used on noindex routes (/admin/*) so the
 * admin panel carries no marketing structured data.
 */
export function removePublicSchemas() {
  PUBLIC_SCHEMA_IDS.forEach(removeSchema);
}
