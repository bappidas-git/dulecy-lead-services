import React from 'react';

const DeveloperGuide = ({ styles }) => {
  return (
    <div>
      {/* Section 1: Tech Stack */}
      <h2 className={styles.guideTitle}>1. Tech Stack</h2>
      <div className={styles.guideSection}>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Technology</th>
              <th>Version</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}>React (CRA / react-scripts)</td>
              <td className={styles.guideTableCell}>18.2 / 5.0</td>
              <td className={styles.guideTableCell}>UI framework and build tooling</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>React Router</td>
              <td className={styles.guideTableCell}>v7</td>
              <td className={styles.guideTableCell}>Client-side routing (five public routes + <code className={styles.guideInlineCode}>/admin/*</code>)</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Material UI (MUI)</td>
              <td className={styles.guideTableCell}>v5.15</td>
              <td className={styles.guideTableCell}>Component library — form controls, tables, dialogs (mostly in the Admin Panel)</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>CSS Modules</td>
              <td className={styles.guideTableCell}>—</td>
              <td className={styles.guideTableCell}>Scoped component styles; the public pages are hand-written CSS, not MUI</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>GSAP + ScrollTrigger</td>
              <td className={styles.guideTableCell}>v3.15</td>
              <td className={styles.guideTableCell}>The mandatory animation foundation for public page sections</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Framer Motion</td>
              <td className={styles.guideTableCell}>v11</td>
              <td className={styles.guideTableCell}>Retained only for modal/drawer mechanics and small hover micro-interactions</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Iconify (MDI)</td>
              <td className={styles.guideTableCell}>v4</td>
              <td className={styles.guideTableCell}>Icon system</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>SweetAlert2</td>
              <td className={styles.guideTableCell}>v11</td>
              <td className={styles.guideTableCell}>Duplicate / error dialogs on enquiry submit</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>PHP</td>
              <td className={styles.guideTableCell}>—</td>
              <td className={styles.guideTableCell}>The lead store (<code className={styles.guideInlineCode}>public/api/leads.php</code>). No database.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 2: Structure */}
      <h2 className={styles.guideTitle}>2. Project Structure</h2>
      <div className={styles.guideSection}>
        <pre className={styles.guideCode}>
{`├── public/
│   ├── api/                  # PHP lead store: leads.php + config.example.php
│   ├── index.html            # Static SEO layer: meta, OG, JSON-LD fallbacks
│   ├── robots.txt            # /admin disallowed
│   └── sitemap.xml           # The five public routes
├── mockup/                   # The reference HTML the build is matched against
├── prompts/                  # The ordered rebuild record — read this first
├── src/
│   ├── admin/                # === ADMIN PANEL ===
│   │   ├── components/       # AdminLayout, AdminTopbar, AdminLogin, ProtectedRoute
│   │   ├── context/          # AdminAuthContext (login state)
│   │   ├── pages/            # Dashboard, LeadManagement, LeadDetail, Guideline
│   │   │   └── guidelineContent/  # These four guide tabs
│   │   └── utils/            # adminAuth, leadService, leadStatus
│   ├── animations/           # GSAP hooks — see section 5
│   ├── components/
│   │   └── common/           # Header, Footer, MobileMenu, LeadModal,
│   │                         # UnifiedLeadForm, SEO/SEOHead
│   ├── config/               # seo.js
│   ├── context/              # ModalContext (enquiry modal), ThemeContext
│   ├── data/                 # === CONTENT LAYER — edit here, not in JSX ===
│   ├── hooks/                # useMediaQuery
│   ├── pages/                # Home, About, Expertise, Industries, Contact,
│   │                         # NotFound — each with its own sections/ folder
│   ├── styles/               # variables.css (tokens), global, dulcey, responsive
│   ├── theme/                # muiTheme.js — mirrors the CSS tokens for MUI
│   └── utils/                # webhookSubmit, validators, seo, swalHelper, hashScroll
├── .env                      # Build-time config (admin creds, leads API + key)
└── CLAUDE.md                 # Project conventions`}
        </pre>
        <div className={styles.guideNote}>
          <strong>Start with <code className={styles.guideInlineCode}>/prompts</code>.</strong>{' '}
          The site was rebuilt through an ordered prompt series and each prompt states its own
          scope, constraints and “do not modify” list. It is the fastest way to understand why the
          code is shaped the way it is.
        </div>
      </div>

      {/* Section 3: Data layer */}
      <h2 className={styles.guideTitle}>3. The Data Layer</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Content lives in <code className={styles.guideInlineCode}>src/data/</code>, never
          hard-coded in components. One edit there updates the page, the enquiry form's options
          and the SEO schemas at once.
        </p>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>File</th>
              <th>Feeds</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>siteConfig.js</code></td>
              <td className={styles.guideTableCell}>
                <strong>Single source of business truth</strong> — company name, tagline, phone,
                email, logos, site URL, plus the <code className={styles.guideInlineCode}>telHref</code> /{' '}
                <code className={styles.guideInlineCode}>mailHref</code> helpers. Header, Footer,
                Admin Panel chrome and every schema read from here.
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>expertiseData.js</code></td>
              <td className={styles.guideTableCell}>
                The ten expertise areas — the home-page index, the Expertise accordion, the
                enquiry form's options, and the Admin Panel's “Interested In” filter
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>industriesData.js</code></td>
              <td className={styles.guideTableCell}>The Who We Serve page</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>navigation.js</code></td>
              <td className={styles.guideTableCell}>
                The nav list, used by the desktop header, the mobile menu and the footer — add a
                route in exactly one place
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 4: Design tokens */}
      <h2 className={styles.guideTitle}>4. Design Tokens</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Colors, type and spacing are CSS custom properties in{' '}
          <code className={styles.guideInlineCode}>src/styles/variables.css</code>, mirrored in{' '}
          <code className={styles.guideInlineCode}>src/theme/muiTheme.js</code> so MUI components
          match. Typography is <strong>Archivo</strong> throughout, with a two-glyph{' '}
          <strong>Inter</strong> subset layered in front of it so the full stop renders round
          instead of square and the ampersand renders as an open{' '}
          <code className={styles.guideInlineCode}>&amp;</code> instead of Archivo&rsquo;s closed
          rotated-8.
        </p>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Token</th>
              <th>Value</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>--ink</code></td>
              <td className={styles.guideTableCell}>#0B0B0C</td>
              <td className={styles.guideTableCell}>Headings, header, footer — the site's near-black</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>--red</code></td>
              <td className={styles.guideTableCell}>#D5192E — Dulcey red</td>
              <td className={styles.guideTableCell}>Primary CTAs and key highlights only — used sparingly</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>--grad</code></td>
              <td className={styles.guideTableCell}>#E8293E → #A80E1E</td>
              <td className={styles.guideTableCell}>The red CTA gradient (and <code className={styles.guideInlineCode}>--grad-text</code> for gradient headlines)</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>--grey-2</code> / <code className={styles.guideInlineCode}>--grey-3</code></td>
              <td className={styles.guideTableCell}>#4A4A4F / #6B6B70</td>
              <td className={styles.guideTableCell}>Secondary and muted text</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>--bg-grey</code></td>
              <td className={styles.guideTableCell}>#F5F5F6</td>
              <td className={styles.guideTableCell}>Alternating section background</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>--line</code></td>
              <td className={styles.guideTableCell}>#E7E7EA</td>
              <td className={styles.guideTableCell}>Thin 1px borders — used instead of heavy shadows</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>--admin-*</code></td>
              <td className={styles.guideTableCell}>Same palette</td>
              <td className={styles.guideTableCell}>
                The Admin Panel's own block in the same file — ink text, red accents, white cards,{' '}
                <code className={styles.guideInlineCode}>#E7E7EA</code> borders. Style admin
                components with these, never with raw hex.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 5: Animations */}
      <h2 className={styles.guideTitle}>5. Animations</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Every public section animates through the GSAP + ScrollTrigger hooks in{' '}
          <code className={styles.guideInlineCode}>src/animations/</code>. Import from the barrel
          (<code className={styles.guideInlineCode}>import {'{ useReveal }'} from '../../animations'</code>)
          rather than writing bespoke GSAP timelines.
        </p>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Hook</th>
              <th>Does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>useReveal</code></td>
              <td className={styles.guideTableCell}>Fade-up reveal for a section</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>useStaggerReveal</code></td>
              <td className={styles.guideTableCell}>Staggered reveal for card/grid children</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>useLineReveal</code></td>
              <td className={styles.guideTableCell}>Line-by-line headline reveal</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>useHeroIntro</code></td>
              <td className={styles.guideTableCell}>The hero's entrance timeline</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>useParallax</code></td>
              <td className={styles.guideTableCell}>Subtle scrubbed background parallax</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.guideNote}>
          Each hook returns a ref, guards <code className={styles.guideInlineCode}>window</code>,
          refreshes ScrollTrigger so lazy-mounted sections measure correctly, and{' '}
          <strong>jumps straight to the final state when the visitor has “reduce motion”
          enabled</strong>. Keep that behaviour in anything new.
        </div>
      </div>

      {/* Section 6: Enquiry flow */}
      <h2 className={styles.guideTitle}>6. The Enquiry Flow</h2>
      <div className={styles.guideSection}>
        <pre className={styles.guideCode}>
{`UnifiedLeadForm  (Contact page panel + the site-wide LeadModal)
  ↓  validators.js — name, email required; mobile optional but validated when filled
  ↓  webhookSubmit.js — adds lead_id, timestamps, page URL, UTM params, status "new"
  ↓  POST /api/leads.php?action=create      ← single source of truth
  ↓  duplicate response → calm "already received" dialog, form left intact
  ↓  success → inline success block (the page never navigates away)`}
        </pre>
        <p className={styles.guideParagraph}>
          There is <strong>one</strong> form component. CTAs across the site open the modal and
          pass a pre-selected expertise area through{' '}
          <code className={styles.guideInlineCode}>ModalContext</code> →{' '}
          <code className={styles.guideInlineCode}>prefill</code>; they never fork the form.
        </p>
      </div>

      {/* Section 7: Admin architecture */}
      <h2 className={styles.guideTitle}>7. Admin Panel Architecture</h2>
      <div className={styles.guideSection}>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Piece</th>
              <th>How it works</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><strong>Auth</strong></td>
              <td className={styles.guideTableCell}>
                <code className={styles.guideInlineCode}>AdminAuthContext</code> +{' '}
                <code className={styles.guideInlineCode}>ProtectedRoute</code>; credentials from{' '}
                <code className={styles.guideInlineCode}>.env</code>, 24-hour session
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><strong>Routing</strong></td>
              <td className={styles.guideTableCell}>
                Lazy routes under <code className={styles.guideInlineCode}>/admin/*</code> via{' '}
                <code className={styles.guideInlineCode}>AdminLayout</code>, which also warms the
                lead cache on mount
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><strong>Data</strong></td>
              <td className={styles.guideTableCell}>
                <code className={styles.guideInlineCode}>leadService.js</code> — an in-memory
                cache hydrated from the server, optimistic local updates mirrored straight back
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><strong>Sync</strong></td>
              <td className={styles.guideTableCell}>
                15-second poll while the tab is visible, plus a BroadcastChannel that updates
                other tabs of the same browser instantly
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><strong>Statuses</strong></td>
              <td className={styles.guideTableCell}>
                <code className={styles.guideInlineCode}>leadStatus.js</code> is the only place
                labels and colors live; the timeline re-maps old entries to current labels
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 8: env */}
      <h2 className={styles.guideTitle}>8. Environment Variables</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          The complete list. Company and contact facts are <em>not</em> here — they live in{' '}
          <code className={styles.guideInlineCode}>src/data/siteConfig.js</code>.
        </p>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Variable</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>REACT_APP_ADMIN_USERNAME</code></td>
              <td className={styles.guideTableCell}>Yes</td>
              <td className={styles.guideTableCell}>Admin login username</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>REACT_APP_ADMIN_PASSWORD</code></td>
              <td className={styles.guideTableCell}>Yes</td>
              <td className={styles.guideTableCell}>Admin login password — set a long one, never paste a real one into docs</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>REACT_APP_LEADS_API_URL</code></td>
              <td className={styles.guideTableCell}>Yes</td>
              <td className={styles.guideTableCell}>Lead endpoint; default <code className={styles.guideInlineCode}>/api/leads.php</code></td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>REACT_APP_LEADS_ADMIN_KEY</code></td>
              <td className={styles.guideTableCell}>Yes</td>
              <td className={styles.guideTableCell}>
                Shared secret for list/update/delete. Must match the server's{' '}
                <code className={styles.guideInlineCode}>ADMIN_API_KEY</code> — see the Deployment tab.
              </td>
            </tr>
          </tbody>
        </table>
        <div className={styles.guideNoteWarning}>
          These values are compiled into the public JavaScript bundle. That is inherent to a
          client-side admin panel: the key gates casual access to the lead API, it is not a
          server-grade secret. Treat <code className={styles.guideInlineCode}>.env</code> as
          versioned, and rotate the values if the repository is ever shared.
        </div>
      </div>

      {/* Section 9: DO NOT MODIFY */}
      <h2 className={styles.guideTitle}>9. Do Not Modify</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          These are contracts. Changing one side without the other silently breaks the enquiry
          form, the Admin Panel, or the sync between them.
        </p>
        <ul className={styles.guideList}>
          <li className={styles.guideListItem}>
            <strong>The lead API contract</strong> —{' '}
            <code className={styles.guideInlineCode}>public/api/leads.php</code>: its
            action-based endpoints (create / list / update / delete / health), its JSON response
            shape, and the admin-key gate
          </li>
          <li className={styles.guideListItem}>
            <strong>The sync pattern</strong> — in-memory cache, 15s poll, BroadcastChannel.{' '}
            Never introduce a localStorage copy of lead data.
          </li>
          <li className={styles.guideListItem}>
            <strong>Lead record field keys</strong> —{' '}
            <code className={styles.guideInlineCode}>lead_id</code>,{' '}
            <code className={styles.guideInlineCode}>name</code>,{' '}
            <code className={styles.guideInlineCode}>mobile</code>,{' '}
            <code className={styles.guideInlineCode}>email</code>,{' '}
            <code className={styles.guideInlineCode}>organization</code>,{' '}
            <code className={styles.guideInlineCode}>service_interest</code>,{' '}
            <code className={styles.guideInlineCode}>state</code>,{' '}
            <code className={styles.guideInlineCode}>message</code>,{' '}
            <code className={styles.guideInlineCode}>source</code>,{' '}
            <code className={styles.guideInlineCode}>status</code>,{' '}
            <code className={styles.guideInlineCode}>submitted_at</code>,{' '}
            <code className={styles.guideInlineCode}>updated_at</code>,{' '}
            <code className={styles.guideInlineCode}>notes[]</code>,{' '}
            <code className={styles.guideInlineCode}>activity[]</code>. Change labels and options;
            never the keys.
          </li>
          <li className={styles.guideListItem}>
            <strong>Persisted status keys</strong> in{' '}
            <code className={styles.guideInlineCode}>leadStatus.js</code> — the labels are
            display-only and safe to reword; the <code className={styles.guideInlineCode}>value</code>{' '}
            keys are written into every stored lead
          </li>
          <li className={styles.guideListItem}>
            The animation hooks' reduced-motion behaviour, and the single-form rule (no forked
            copies of <code className={styles.guideInlineCode}>UnifiedLeadForm</code>)
          </li>
        </ul>
      </div>

      {/* Section 10: commands */}
      <h2 className={styles.guideTitle}>10. Commands</h2>
      <div className={styles.guideSection}>
        <pre className={styles.guideCode}>
{`npm install              # install dependencies
npm start                # dev server at localhost:3000
npm run build            # production build → build/
npm run analyze          # bundle size breakdown (after a build)
npm run generate:icons   # favicon / PWA icons from the logo
npm run generate:og      # 1200x630 share image from the logo

# Optional: serve the PHP lead API locally so the admin panel has real data
php -S localhost:8080 -t public`}
        </pre>
        <div className={styles.guideNote}>
          <strong>Local admin:</strong> <code className={styles.guideInlineCode}>npm start</code>{' '}
          then <code className={styles.guideInlineCode}>http://localhost:3000/admin</code>, using
          the <code className={styles.guideInlineCode}>.env</code> credentials. The CRA dev server
          does not run PHP, so point{' '}
          <code className={styles.guideInlineCode}>REACT_APP_LEADS_API_URL</code> at the{' '}
          <code className={styles.guideInlineCode}>php -S</code> instance (or a staging server) if
          you need live leads while developing.
        </div>
      </div>
    </div>
  );
};

export default DeveloperGuide;
