/* ============================================
   SEOHead — per-route head management
   --------------------------------------------
   The runtime layer of the dual-layer SEO system. On every client-side
   navigation it resolves the current route to a `seoConfig.pages` entry,
   rewrites title / description / canonical / robots / OG / Twitter, and
   re-injects the JSON-LD blocks by element id — replacing the static
   fallbacks in public/index.html rather than duplicating them.

   Direct DOM manipulation is deliberate: this is a CRA SPA with no
   react-helmet, and the same-id injection contract depends on writing
   into the existing head tags.

   Renders nothing.
   ============================================ */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoConfig } from '../../../config/seo';
import {
  updatePageSEO,
  injectPageSchemas,
  removePublicSchemas,
} from '../../../utils/seo';

const { pages } = seoConfig;

// Route path → page config. Keep in sync with the <Route> table in App.jsx.
const ROUTE_MAP = {
  '/': pages.home,
  '/about': pages.about,
  '/expertise': pages.expertise,
  '/industries': pages.industries,
  '/contact': pages.contact,
};

/**
 * Resolve a pathname to its page config. Trailing slashes are normalised
 * so `/about/` and `/about` never emit competing canonicals.
 * @param {string} pathname - location.pathname
 * @returns {Object} A seoConfig.pages entry
 */
export function resolvePage(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (path.startsWith('/admin')) return pages.admin;
  return ROUTE_MAP[path] || pages.notFound;
}

const SEOHead = () => {
  const location = useLocation();

  useEffect(() => {
    const page = resolvePage(location.pathname);

    updatePageSEO({
      title: page.title,
      description: page.description || seoConfig.defaultDescription,
      keywords: page.keywords,
      robots: page.robots,
      // Canonical: absolute, and always the indexable path — never the
      // trailing-slash or hash variant the user may have arrived on.
      url: page.noindex ? undefined : `${seoConfig.siteUrl}${page.path === '/' ? '/' : page.path}`,
    });

    // Admin (and the 404) carry no marketing structured data.
    if (page.noindex) {
      removePublicSchemas();
    } else {
      injectPageSchemas(page);
    }
  }, [location.pathname]);

  return null;
};

export default SEOHead;
