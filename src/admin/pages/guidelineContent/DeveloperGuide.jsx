import React from 'react';

const DeveloperGuide = ({ styles }) => {
  return (
    <div>
      {/* Section 1: Tech Stack Overview */}
      <h2 className={styles.guideTitle}>1. Tech Stack Overview</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          This project uses the following technologies:
        </p>

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
              <td className={styles.guideTableCell}>React</td>
              <td className={styles.guideTableCell}>18.2</td>
              <td className={styles.guideTableCell}>UI framework with concurrent features</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Material UI (MUI)</td>
              <td className={styles.guideTableCell}>v5.15</td>
              <td className={styles.guideTableCell}>Component library</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>GSAP + ScrollTrigger</td>
              <td className={styles.guideTableCell}>v3.15</td>
              <td className={styles.guideTableCell}>Page-section animations (reveals, counters, parallax)</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Framer Motion</td>
              <td className={styles.guideTableCell}>v11</td>
              <td className={styles.guideTableCell}>Drawer/modal mechanics + hover micro-interactions</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>React Router</td>
              <td className={styles.guideTableCell}>v7</td>
              <td className={styles.guideTableCell}>Client-side routing</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>CSS Modules</td>
              <td className={styles.guideTableCell}>—</td>
              <td className={styles.guideTableCell}>Scoped component styles</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Iconify (MDI)</td>
              <td className={styles.guideTableCell}>v4</td>
              <td className={styles.guideTableCell}>Icon system (Material Design Icons)</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>SweetAlert2</td>
              <td className={styles.guideTableCell}>v11</td>
              <td className={styles.guideTableCell}>Success/error alert modals</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Web Vitals</td>
              <td className={styles.guideTableCell}>v3.5</td>
              <td className={styles.guideTableCell}>Performance monitoring</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 2: Project Structure */}
      <h2 className={styles.guideTitle}>2. Project Structure</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          The complete folder structure with descriptions:
        </p>

        <pre className={styles.guideCode}>
{`├── public/
│   ├── api/                  # Server-side PHP endpoints (shared lead store)
│   ├── index.html            # Main HTML with SEO meta tags, JSON-LD schemas
│   ├── manifest.json         # PWA manifest
│   ├── robots.txt            # Search engine crawl directives
│   └── sitemap.xml           # Sitemap for Google
├── src/
│   ├── admin/                # === ADMIN PANEL ===
│   │   ├── components/       # AdminLayout, AdminTopbar, AdminLogin, ProtectedRoute
│   │   ├── context/          # AdminAuthContext (login state management)
│   │   ├── pages/            # Dashboard, LeadManagement, LeadDetail, Guideline
│   │   │   └── guidelineContent/  # Tab content components for Guideline page
│   │   └── utils/            # adminAuth, leadService, leadStatus
│   ├── animations/           # GSAP + ScrollTrigger hooks: useReveal, useStaggerReveal, useCountUp, useParallax
│   ├── components/
│   │   ├── common/           # Reusable: Header, Footer, UnifiedLeadForm, LeadFormDrawer, Button, etc.
│   │   └── sections/         # Page sections: Hero, About, Products, Services, Stats, Brands, WhyUs, FAQ, Contact
│   ├── config/               # seo.js (SEO configuration)
│   ├── context/              # ModalContext (enquiry drawer state), ThemeContext
│   ├── data/                 # Content data: siteConfig, products, services, stats, brands, features, about, faq, location
│   ├── hooks/                # Custom hooks: useMediaQuery
│   ├── pages/                # Full pages: ThankYou
│   ├── styles/               # Global CSS: variables.css, global.css, animations.css, responsive.css
│   ├── theme/                # MUI theme configuration (muiTheme.js)
│   └── utils/                # Utilities: webhookSubmit, validators, etc.
├── .env                      # Environment variables (not committed to git)
├── .env.example              # Environment variable template
├── CLAUDE.md                 # AI assistant instructions
├── CUSTOMIZATION_GUIDE.md    # Step-by-step setup guide
├── SEO_GUIDE.md              # SEO configuration guide
└── CHANGELOG.md              # Version history`}
        </pre>
      </div>

      {/* Section 3: Local Development Setup */}
      <h2 className={styles.guideTitle}>3. Local Development Setup</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Follow these steps to get the project running locally:
        </p>

        <pre className={styles.guideCode}>
{`# 1. Clone the repository
git clone https://github.com/bappidas-git/nilachal-infracon-buildmart.git
cd nilachal-infracon-buildmart

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Start development server
npm start
# Opens at http://localhost:3000

# 5. Access admin panel
# Go to http://localhost:3000/admin
# Credentials: set REACT_APP_ADMIN_USERNAME / REACT_APP_ADMIN_PASSWORD in .env`}
        </pre>

        <div className={styles.guideNote}>
          <strong>Note:</strong> Make sure you have Node.js (v16+) and npm installed before starting. Set the admin credentials and leads admin key in <code className={styles.guideInlineCode}>.env</code> before deploying.
        </div>
      </div>

      {/* Section 4: Key Files to Modify */}
      <h2 className={styles.guideTitle}>4. Key Files to Modify</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          When updating site content or branding, these are the files to touch:
        </p>

        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>File</th>
              <th>What to Change</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>.env</code></td>
              <td className={styles.guideTableCell}>Admin credentials + leads API URL/key</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>REACT_APP_ADMIN_USERNAME</code></td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/data/servicesData.js</code></td>
              <td className={styles.guideTableCell}>Construction &amp; infrastructure service cards</td>
              <td className={styles.guideTableCell}>Service name, badge, description, features</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/data/productsData.js</code></td>
              <td className={styles.guideTableCell}>North East Buildmart product categories</td>
              <td className={styles.guideTableCell}>Category name, description, items</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/data/featuresData.js</code></td>
              <td className={styles.guideTableCell}>Why-choose-us highlight items</td>
              <td className={styles.guideTableCell}>Quality, delivery, expertise points</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/data/statsData.js</code></td>
              <td className={styles.guideTableCell}>Company metrics band</td>
              <td className={styles.guideTableCell}>Years, projects, states served</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/data/locationData.js</code></td>
              <td className={styles.guideTableCell}>Office address, phone, WhatsApp, states served</td>
              <td className={styles.guideTableCell}>Nagaon office + serving states</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/styles/variables.css</code></td>
              <td className={styles.guideTableCell}>Brand colors (landing page only)</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>--color-primary: #16324F</code></td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/theme/muiTheme.js</code></td>
              <td className={styles.guideTableCell}>MUI component colors</td>
              <td className={styles.guideTableCell}>Match with CSS variables</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/utils/webhookSubmit.js</code></td>
              <td className={styles.guideTableCell}>Leads API endpoint (server store)</td>
              <td className={styles.guideTableCell}>Usually leave default</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/config/seo.js</code></td>
              <td className={styles.guideTableCell}>SEO metadata, schemas, FAQs</td>
              <td className={styles.guideTableCell}>Your business details</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>public/index.html</code></td>
              <td className={styles.guideTableCell}>Title, meta tags, JSON-LD</td>
              <td className={styles.guideTableCell}>Your SEO content</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/components/sections/*</code></td>
              <td className={styles.guideTableCell}>Section content text (hardcoded in JSX)</td>
              <td className={styles.guideTableCell}>Your headlines, descriptions</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>src/data/siteConfig.js</code></td>
              <td className={styles.guideTableCell}>Company facts, contact details, logo URLs</td>
              <td className={styles.guideTableCell}>Header/Footer/drawer read logo + contacts from here</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 5: Color System */}
      <h2 className={styles.guideTitle}>5. Color System</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          This project uses a dual color system — one for the landing page (customizable per brand) and one for the admin panel (constant).
        </p>

        <h3 className={styles.guideSubtitle}>Landing Page Colors (in src/styles/variables.css)</h3>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Variable</th>
              <th>Default</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>--color-primary</code></td>
              <td className={styles.guideTableCell}>#16324F (Steel Navy)</td>
              <td className={styles.guideTableCell}>Headers, primary surfaces</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>--color-secondary</code></td>
              <td className={styles.guideTableCell}>#1E7B45 (Nilachal Green)</td>
              <td className={styles.guideTableCell}>Accents, section labels, badges</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>--color-accent</code></td>
              <td className={styles.guideTableCell}>#1E7B45 (Nilachal Green)</td>
              <td className={styles.guideTableCell}>Primary CTA buttons only</td>
            </tr>
          </tbody>
        </table>
        <p className={styles.guideParagraph}>
          Change these for each landing page's brand.
        </p>

        <h3 className={styles.guideSubtitle}>Admin Panel Colors (also in variables.css, under --admin-*)</h3>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Variable</th>
              <th>Default</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>--admin-primary</code></td>
              <td className={styles.guideTableCell}>#16324F (Steel Navy)</td>
              <td className={styles.guideTableCell}>Admin panel primary</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>--admin-accent</code></td>
              <td className={styles.guideTableCell}>#1E7B45 (Nilachal Green)</td>
              <td className={styles.guideTableCell}>Admin panel accent</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.guideNote}>
          <strong>Note:</strong> The admin panel shares the Nilachal design system — deep steel navy, Nilachal green, off-white background, and white cards with thin borders. Keep the <code className={styles.guideInlineCode}>--admin-*</code> tokens in <code className={styles.guideInlineCode}>variables.css</code> aligned with the landing-page palette.
        </div>
      </div>

      {/* Section 6: Form Submission Flow */}
      <h2 className={styles.guideTitle}>6. Form Submission Flow</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          The complete flow from user form submission to redirect:
        </p>

        <pre className={styles.guideCode}>
{`Visitor fills UnifiedLeadForm → handleSubmit()
  ↓
Form validation (validators.js)
  Fields: name, mobile, email, service_interest (product/service), state, message
  ↓
submitLeadToWebhook() in webhookSubmit.js
  └── POST /api/leads.php?action=create  (shared server store = single source of truth)
       Server dedupes by mobile → duplicate response shown as "Already Submitted"
  ↓
sessionStorage.setItem('lead_submitted', 'true')
  ↓
SweetAlert success message
  ↓
Navigate to /thank-you`}
        </pre>

        <div className={styles.guideNote}>
          <strong>Key files:</strong>{' '}
          <code className={styles.guideInlineCode}>src/components/common/UnifiedLeadForm/UnifiedLeadForm.jsx</code>,{' '}
          <code className={styles.guideInlineCode}>src/utils/webhookSubmit.js</code>,{' '}
          <code className={styles.guideInlineCode}>src/utils/validators.js</code>
        </div>
      </div>

      {/* Section 7: Admin Panel Architecture */}
      <h2 className={styles.guideTitle}>7. Admin Panel Architecture</h2>
      <div className={styles.guideSection}>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Component</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><strong>Authentication</strong></td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>AdminAuthContext</code> with localStorage session (24hr expiry)</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><strong>Routing</strong></td>
              <td className={styles.guideTableCell}>Nested routes under <code className={styles.guideInlineCode}>/admin/*</code> via <code className={styles.guideInlineCode}>AdminLayout</code></td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><strong>Data Layer</strong></td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>leadService.js</code> — reads/writes the shared server store (<code className={styles.guideInlineCode}>/api/leads.php</code>); in-memory cache hydrated by a 15s poll</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><strong>Cross-device Sync</strong></td>
              <td className={styles.guideTableCell}>All CRUD goes to the server, so status changes, notes and deletes made on one device appear on every other device</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><strong>Guideline Page</strong></td>
              <td className={styles.guideTableCell}>Password-protected with <code className={styles.guideInlineCode}>sessionStorage</code> flag</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 8: Environment Variables Reference */}
      <h2 className={styles.guideTitle}>8. Environment Variables Reference</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Complete list of the <code className={styles.guideInlineCode}>.env</code> variables the app reads (company/contact facts live in <code className={styles.guideInlineCode}>src/data/siteConfig.js</code>, not <code className={styles.guideInlineCode}>.env</code>):
        </p>

        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Variable</th>
              <th>Required</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>REACT_APP_ADMIN_USERNAME</code></td>
              <td className={styles.guideTableCell}>Yes</td>
              <td className={styles.guideTableCell}>Set in <code className={styles.guideInlineCode}>.env</code></td>
              <td className={styles.guideTableCell}>Admin login username</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>REACT_APP_ADMIN_PASSWORD</code></td>
              <td className={styles.guideTableCell}>Yes</td>
              <td className={styles.guideTableCell}>Set in <code className={styles.guideInlineCode}>.env</code></td>
              <td className={styles.guideTableCell}>Admin login password (never commit a real one to docs)</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>REACT_APP_LEADS_API_URL</code></td>
              <td className={styles.guideTableCell}>Yes (for Admin Panel)</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>/api/leads.php</code></td>
              <td className={styles.guideTableCell}>Path/URL to the shared leads storage endpoint</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>REACT_APP_LEADS_ADMIN_KEY</code></td>
              <td className={styles.guideTableCell}>Yes (for Admin Panel)</td>
              <td className={styles.guideTableCell}>—</td>
              <td className={styles.guideTableCell}>
                Shared secret protecting list/update/delete endpoints. Must match the server's admin key — the built-in fallback in <code className={styles.guideInlineCode}>leads.php</code> by default, or <code className={styles.guideInlineCode}>ADMIN_API_KEY</code> in <code className={styles.guideInlineCode}>api/config.php</code> when that override file exists.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 9: DO NOT MODIFY List */}
      <h2 className={styles.guideTitle}>9. DO NOT MODIFY List</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          These files and features should not be changed when maintaining the site:
        </p>

        <ul className={styles.guideList}>
          <li className={styles.guideListItem}>Component structure and layout patterns</li>
          <li className={styles.guideListItem}>Animation system (GSAP + ScrollTrigger hooks in <code className={styles.guideInlineCode}>src/animations/</code>)</li>
          <li className={styles.guideListItem}>Form validation logic (<code className={styles.guideInlineCode}>validators.js</code>)</li>
          <li className={styles.guideListItem}>Lead submission flow (<code className={styles.guideInlineCode}>webhookSubmit.js</code> — posts to the server store; usually leave as-is)</li>
          <li className={styles.guideListItem}>SweetAlert configuration (<code className={styles.guideInlineCode}>swalHelper.js</code>)</li>
          <li className={styles.guideListItem}>Mobile navigation mechanics (<code className={styles.guideInlineCode}>MobileNavigation</code>, <code className={styles.guideInlineCode}>MobileDrawer</code>)</li>
          <li className={styles.guideListItem}>Drawer/modal behavior (<code className={styles.guideInlineCode}>ModalContext</code>)</li>
          <li className={styles.guideListItem}>Lead API contract and admin sync mechanics (cache/poll/BroadcastChannel)</li>
          <li className={styles.guideListItem}>Persisted lead status keys and lead record field keys</li>
        </ul>

        <div className={styles.guideNoteWarning}>
          <strong>Warning:</strong> Modifying these core files may break the enquiry form, the admin panel, or the sync between them. If changes are needed, create new components instead of modifying existing ones.
        </div>
      </div>

      {/* Section 10: Useful Commands */}
      <h2 className={styles.guideTitle}>10. Useful Commands</h2>
      <div className={styles.guideSection}>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Command</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>npm start</code></td>
              <td className={styles.guideTableCell}>Start dev server (localhost:3000)</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>npm run build</code></td>
              <td className={styles.guideTableCell}>Production build → build/ folder</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>npm run test</code></td>
              <td className={styles.guideTableCell}>Run tests</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>npm run analyze</code></td>
              <td className={styles.guideTableCell}>Bundle size analysis (run after build)</td>
            </tr>
          </tbody>
        </table>

        <pre className={styles.guideCode}>
{`npm start          # Start dev server (localhost:3000)
npm run build      # Production build → build/ folder
npm run test       # Run tests
npm run analyze    # Bundle size analysis (run after build)`}
        </pre>
      </div>
    </div>
  );
};

export default DeveloperGuide;
