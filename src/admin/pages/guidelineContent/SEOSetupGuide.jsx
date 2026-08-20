import React from 'react';
import { siteConfig } from '../../../data/siteConfig';

const SEOSetupGuide = ({ styles }) => {
  return (
    <div>
      <div className={styles.guideNoteWarning}>
        <strong>Status:</strong> the SEO layer is rewritten for{' '}
        <code className={styles.guideInlineCode}>dulceyleadservices.com</code> in a later step of the rebuild.
        This page describes the setup as it will ship — the file paths, routes and rules below are
        final; only the copy inside them is still being filled in.
      </div>

      {/* Section 1: What is SEO? */}
      <h2 className={styles.guideTitle}>1. What SEO Means Here</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          SEO decides whether someone searching for HR support, business analytics, or leadership
          training finds {siteConfig.brandName} without you paying for the click. Three things
          carry most of that weight: an accurate title and description on each page, structured
          data (JSON-LD) that tells Google what the business is, and a sitemap Google can read.
        </p>
        <p className={styles.guideParagraph}>
          The site is a five-page React app, so every page needs its own title, description and
          canonical URL — not one shared set.
        </p>
      </div>

      {/* Section 2: The two layers */}
      <h2 className={styles.guideTitle}>2. The Two SEO Layers</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Search engines and social scrapers do not all run JavaScript, so the site ships its SEO
          twice:
        </p>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Layer</th>
              <th>Where</th>
              <th>What it does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><strong>Static</strong></td>
              <td className={styles.guideTableCell}>
                <code className={styles.guideInlineCode}>public/index.html</code>
              </td>
              <td className={styles.guideTableCell}>
                Meta tags, Open Graph / Twitter cards, and the JSON-LD blocks. This is what a
                crawler sees when it does not execute JavaScript — the fallback.
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><strong>Runtime</strong></td>
              <td className={styles.guideTableCell}>
                <code className={styles.guideInlineCode}>src/components/common/SEO/SEOHead.jsx</code> +{' '}
                <code className={styles.guideInlineCode}>src/utils/seo.js</code>
              </td>
              <td className={styles.guideTableCell}>
                Sets the title, description and canonical per route and re-injects the same-id
                JSON-LD blocks, so each of the five pages reports itself correctly.
              </td>
            </tr>
          </tbody>
        </table>
        <div className={styles.guideNote}>
          <strong>Rule:</strong> never hard-code business facts into a schema. Everything is
          generated from <code className={styles.guideInlineCode}>src/data/siteConfig.js</code>{' '}
          (company, phone, email, logos),{' '}
          <code className={styles.guideInlineCode}>src/data/expertiseData.js</code> (the ten
          service areas) and{' '}
          <code className={styles.guideInlineCode}>src/data/industriesData.js</code> (who we serve).
          Edit the data file and both layers follow.
        </div>
      </div>

      {/* Section 3: Per-route metadata */}
      <h2 className={styles.guideTitle}>3. Per-Route Titles &amp; Descriptions</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Each public route gets its own entry in{' '}
          <code className={styles.guideInlineCode}>src/config/seo.js</code>. Keep titles under 60
          characters and descriptions under 160.
        </p>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Route</th>
              <th>Page</th>
              <th>What the title should lead with</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>/</code></td>
              <td className={styles.guideTableCell}>Home</td>
              <td className={styles.guideTableCell}>Brand name + what the business does</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>/about</code></td>
              <td className={styles.guideTableCell}>About</td>
              <td className={styles.guideTableCell}>Who the firm is and the experience behind it</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>/expertise</code></td>
              <td className={styles.guideTableCell}>Expertise</td>
              <td className={styles.guideTableCell}>
                The service areas — the highest-intent page, so lead with the services themselves
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>/industries</code></td>
              <td className={styles.guideTableCell}>Who We Serve</td>
              <td className={styles.guideTableCell}>The sectors served</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>/contact</code></td>
              <td className={styles.guideTableCell}>Contact</td>
              <td className={styles.guideTableCell}>Contact + brand name</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.guideNote}>
          <strong>Not indexed:</strong> <code className={styles.guideInlineCode}>/admin</code> and
          everything under it are marked <code className={styles.guideInlineCode}>noindex</code>{' '}
          and blocked in <code className={styles.guideInlineCode}>robots.txt</code>. Leave that
          alone — the Admin Panel must never appear in search results.
        </div>
      </div>

      {/* Section 4: Structured data */}
      <h2 className={styles.guideTitle}>4. Structured Data (JSON-LD)</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Structured data is how Google understands that this is a professional-services firm
          rather than a blog. The site ships these blocks:
        </p>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Schema</th>
              <th>Built from</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>Organization</code></td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>siteConfig.js</code></td>
              <td className={styles.guideTableCell}>Name, logo, phone, email — the knowledge-panel basics</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>ProfessionalService</code></td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>siteConfig.js</code></td>
              <td className={styles.guideTableCell}>
                The business type. There is no public postal address, so no store-front{' '}
                <code className={styles.guideInlineCode}>LocalBusiness</code> address block is
                claimed — do not invent one.
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>ItemList</code> of <code className={styles.guideInlineCode}>Service</code></td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>expertiseData.js</code></td>
              <td className={styles.guideTableCell}>The ten expertise areas, injected on the Expertise page</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>BreadcrumbList</code> + <code className={styles.guideInlineCode}>WebPage</code></td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>seo.js</code></td>
              <td className={styles.guideTableCell}>Page hierarchy in the search snippet</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.guideNoteWarning}>
          <strong>Google guideline:</strong> only claim what the page actually shows. The site has
          no visible FAQ section, so it publishes no{' '}
          <code className={styles.guideInlineCode}>FAQPage</code> schema — and it claims no postal
          address, opening hours or ratings. A schema that promises content the page doesn't show
          can get the rich result revoked.
        </div>
        <p className={styles.guideParagraph}>
          Validate any change at{' '}
          <strong>https://search.google.com/test/rich-results</strong> before shipping.
        </p>
      </div>

      {/* Section 5: OG image */}
      <h2 className={styles.guideTitle}>5. The Share Image (Open Graph)</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          This is the picture that appears when the site is shared on WhatsApp, LinkedIn or Slack.
          It is generated from the logo by a committed script — you do not design it by hand:
        </p>
        <pre className={styles.guideCode}>
{`npm run generate:og      # writes public/og-image.png (1200x630)
npm run generate:icons   # writes the favicon / PWA icon set from the DLS mark`}
        </pre>
        <p className={styles.guideParagraph}>
          Re-run both after any logo change, then confirm the URLs in{' '}
          <code className={styles.guideInlineCode}>public/index.html</code> (
          <code className={styles.guideInlineCode}>og:image</code>,{' '}
          <code className={styles.guideInlineCode}>twitter:image</code>) and{' '}
          <code className={styles.guideInlineCode}>src/config/seo.js</code> point at the live
          domain. Social platforms cache aggressively — re-scrape the URL in the platform's own
          debugger to see a new image.
        </p>
      </div>

      {/* Section 6: Search Console */}
      <h2 className={styles.guideTitle}>6. Sitemap &amp; Google Search Console</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          <code className={styles.guideInlineCode}>public/sitemap.xml</code> lists the five public
          routes and <code className={styles.guideInlineCode}>public/robots.txt</code> points to
          it. Both must carry the live domain before launch.
        </p>
        <ol className={styles.guideStepList}>
          <li className={styles.guideStepItem}>
            Go to <strong>https://search.google.com/search-console</strong>
          </li>
          <li className={styles.guideStepItem}>
            <strong>Add Property</strong> → <strong>URL prefix</strong> → enter the live domain
          </li>
          <li className={styles.guideStepItem}>
            Verify ownership — easiest is to drop the HTML verification file into{' '}
            <code className={styles.guideInlineCode}>public/</code> and redeploy
          </li>
          <li className={styles.guideStepItem}>
            Open <strong>Sitemaps</strong>, submit{' '}
            <code className={styles.guideInlineCode}>sitemap.xml</code>
          </li>
          <li className={styles.guideStepItem}>
            Use <strong>URL Inspection</strong> on each of the five routes to request indexing
          </li>
        </ol>
        <div className={styles.guideNote}>
          <strong>Be patient:</strong> indexing takes days to weeks for a new domain. Check
          Search Console rather than searching for yourself — personalised results lie.
        </div>
      </div>

      {/* Section 7: already handled */}
      <h2 className={styles.guideTitle}>7. Performance (Already Handled)</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Page speed is a ranking factor and these are already in place — no action needed:
        </p>
        <ul className={styles.guideList}>
          <li className={styles.guideListItem}>Route-level code splitting (each page loads on demand)</li>
          <li className={styles.guideListItem}>Lazy-loaded below-the-fold sections and images</li>
          <li className={styles.guideListItem}>Font preloading and preconnect hints</li>
          <li className={styles.guideListItem}>Core Web Vitals monitoring</li>
          <li className={styles.guideListItem}>Animations that honour “reduce motion” system settings</li>
        </ul>
        <div className={styles.guideNote}>
          <strong>Note:</strong> after deploying, run Lighthouse (Chrome DevTools → Lighthouse) on
          the live URL, not localhost. Aim for 90+ on SEO.
        </div>
      </div>

      {/* Section 8: checklist */}
      <h2 className={styles.guideTitle}>8. Launch Checklist</h2>
      <div className={styles.guideSection}>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Item</th>
              <th>Where</th>
              <th>Done</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}>Title + description set for all five routes</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/config/seo.js</code></td>
              <td className={styles.guideTableCell}>☐</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Static fallback tags match the runtime ones</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>public/index.html</code></td>
              <td className={styles.guideTableCell}>☐</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Schemas claim nothing the page doesn't show</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/utils/seo.js</code></td>
              <td className={styles.guideTableCell}>☐</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>OG + favicon assets regenerated from the logo</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>npm run generate:og</code> / <code className={styles.guideInlineCode}>:icons</code></td>
              <td className={styles.guideTableCell}>☐</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Canonical URLs point at the live domain</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/config/seo.js</code></td>
              <td className={styles.guideTableCell}>☐</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Domain updated in robots + sitemap</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>public/robots.txt</code>, <code className={styles.guideInlineCode}>public/sitemap.xml</code></td>
              <td className={styles.guideTableCell}>☐</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>/admin</code> still noindex + disallowed</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>robots.txt</code> + <code className={styles.guideInlineCode}>SEOHead</code></td>
              <td className={styles.guideTableCell}>☐</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Rich Results test passes</td>
              <td className={styles.guideTableCell}>search.google.com/test/rich-results</td>
              <td className={styles.guideTableCell}>☐</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Sitemap submitted to Search Console</td>
              <td className={styles.guideTableCell}>Online</td>
              <td className={styles.guideTableCell}>☐</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Lighthouse SEO score &gt; 90</td>
              <td className={styles.guideTableCell}>Chrome DevTools, on the live URL</td>
              <td className={styles.guideTableCell}>☐</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SEOSetupGuide;
