import React from 'react';

const DeploymentGuide = ({ styles }) => {
  return (
    <div>
      {/* Section 1: Build */}
      <h2 className={styles.guideTitle}>1. Build the Site</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Deploying means uploading a <em>build</em> — a compiled copy of the site. The source
          code in <code className={styles.guideInlineCode}>src/</code> is never uploaded.
        </p>
        <pre className={styles.guideCode}>
{`# In the project folder
npm install        # first time only
npm run build      # creates build/`}
        </pre>
        <div className={styles.guideNoteWarning}>
          <strong>Environment values are baked in at build time.</strong> Everything in{' '}
          <code className={styles.guideInlineCode}>.env</code> — admin username, admin password,
          the leads API URL and the leads admin key — is compiled into the JavaScript when you run{' '}
          <code className={styles.guideInlineCode}>npm run build</code>. Changing{' '}
          <code className={styles.guideInlineCode}>.env</code> on its own changes nothing on the
          server; you must rebuild and re-upload.
        </div>
      </div>

      {/* Section 2: what to upload */}
      <h2 className={styles.guideTitle}>2. What to Upload</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Upload the <strong>contents</strong> of{' '}
          <code className={styles.guideInlineCode}>build/</code> — not the folder itself — into
          your web root (<code className={styles.guideInlineCode}>public_html</code> on most
          hosts). The web root should directly contain{' '}
          <code className={styles.guideInlineCode}>index.html</code>,{' '}
          <code className={styles.guideInlineCode}>static/</code> and{' '}
          <code className={styles.guideInlineCode}>api/</code>.
        </p>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>What</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>index.html</code> + <code className={styles.guideInlineCode}>static/</code></td>
              <td className={styles.guideTableCell}>The site itself</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>api/</code></td>
              <td className={styles.guideTableCell}>
                The lead store. Without it the enquiry form has nowhere to save and the Admin
                Panel stays empty.
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>api/data/</code></td>
              <td className={styles.guideTableCell}>
                Created automatically on first submission and must be writable by PHP. It holds{' '}
                <code className={styles.guideInlineCode}>leads.json</code> — <strong>never
                overwrite it on a redeploy</strong>, that is your live lead data.
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>robots.txt</code>, <code className={styles.guideInlineCode}>sitemap.xml</code>, icons, <code className={styles.guideInlineCode}>og-image.png</code></td>
              <td className={styles.guideTableCell}>SEO and share previews</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.guideNote}>
          <strong>PHP is required.</strong> Any normal shared host, cPanel, Hostinger, Cloudways
          or VPS works. Purely static hosts (Netlify, Vercel, S3) cannot run{' '}
          <code className={styles.guideInlineCode}>leads.php</code> — if you use one, host the{' '}
          <code className={styles.guideInlineCode}>api/</code> folder on a small PHP server and
          point <code className={styles.guideInlineCode}>REACT_APP_LEADS_API_URL</code> at its
          full URL, then rebuild.
        </div>
      </div>

      {/* Section 3: SPA routing */}
      <h2 className={styles.guideTitle}>3. SPA Rewrites (Required)</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          The site is a single-page app: <code className={styles.guideInlineCode}>/about</code>,{' '}
          <code className={styles.guideInlineCode}>/expertise</code> and{' '}
          <code className={styles.guideInlineCode}>/admin/dashboard</code> are handled by
          JavaScript, not by real files on disk. Without a rewrite rule, opening one of those URLs
          directly (or refreshing the page) returns a 404. The fix is to serve{' '}
          <code className={styles.guideInlineCode}>index.html</code> for anything that is not a
          real file, and let the router take it from there.
        </p>
        <h3 className={styles.guideSubtitle}>Apache (cPanel, Hostinger, Cloudways)</h3>
        <p className={styles.guideParagraph}>
          Create <code className={styles.guideInlineCode}>.htaccess</code> in the web root:
        </p>
        <pre className={styles.guideCode}>
{`Options -MultiViews
RewriteEngine On

# Never rewrite the PHP lead API or real files
RewriteCond %{REQUEST_URI} ^/api/ [OR]
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

RewriteRule ^ index.html [QSA,L]`}
        </pre>
        <div className={styles.guideNoteWarning}>
          <strong>Exclude <code className={styles.guideInlineCode}>/api/</code> from the rewrite.</strong>{' '}
          A blanket “send everything to index.html” rule swallows{' '}
          <code className={styles.guideInlineCode}>/api/leads.php</code>, and every enquiry then
          fails silently while the site looks perfectly fine.
        </div>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Platform</th>
              <th>Rewrite</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}>Apache (cPanel / Cloudways)</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>.htaccess</code> as above</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Nginx</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>try_files $uri /index.html;</code> (with a separate PHP location block for <code className={styles.guideInlineCode}>/api/</code>)</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Netlify</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>public/_redirects</code> containing <code className={styles.guideInlineCode}>{'/* /index.html 200'}</code> — static only, so the API must live elsewhere</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>CloudFront</td>
              <td className={styles.guideTableCell}>Custom error response: 404 → <code className={styles.guideInlineCode}>/index.html</code> with status 200</td>
            </tr>
          </tbody>
        </table>

        <h3 className={styles.guideSubtitle}>Caching &amp; compression for static assets</h3>
        <p className={styles.guideParagraph}>
          Everything under <code className={styles.guideInlineCode}>/static/</code> and{' '}
          <code className={styles.guideInlineCode}>/images/</code> is content-addressed or
          version-stable, so it can be cached for a year. Text assets should also be
          compressed — the JavaScript bundle is roughly a third of its size gzipped. Add
          this alongside the rewrite rules:
        </p>
        <pre className={styles.guideCode}>
{`# Long-cache fingerprinted bundles and page imagery
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png  "access plus 1 year"
  ExpiresByType text/css   "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\\.(webp|jpg|jpeg|png|svg|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  # index.html must stay fresh — it points at the hashed bundles
  <FilesMatch "\\.(html)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>`}
        </pre>
        <div className={styles.guideNoteWarning}>
          <strong>Never long-cache{' '}
          <code className={styles.guideInlineCode}>index.html</code>.</strong> It carries the
          hashed bundle filenames, so a cached copy pins visitors to an old deploy. The API
          responses under <code className={styles.guideInlineCode}>/api/</code> already send{' '}
          <code className={styles.guideInlineCode}>Cache-Control: no-store</code> and must
          stay that way.
        </div>
      </div>

      {/* Section 4: key alignment */}
      <h2 className={styles.guideTitle}>4. Admin Key Alignment (the one that bites)</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          The Admin Panel authenticates to the lead API with a shared key. The build carries{' '}
          <code className={styles.guideInlineCode}>REACT_APP_LEADS_ADMIN_KEY</code>; the server
          resolves its key in this order:
        </p>
        <ol className={styles.guideStepList}>
          <li className={styles.guideStepItem}>
            <code className={styles.guideInlineCode}>ADMIN_API_KEY</code> defined in{' '}
            <code className={styles.guideInlineCode}>api/config.php</code> — <strong>wins over
            everything else</strong>
          </li>
          <li className={styles.guideStepItem}>
            a <code className={styles.guideInlineCode}>LEADS_ADMIN_KEY</code> /{' '}
            <code className={styles.guideInlineCode}>ADMIN_API_KEY</code> server environment variable
          </li>
          <li className={styles.guideStepItem}>
            the committed fallback inside{' '}
            <code className={styles.guideInlineCode}>api/leads.php</code>, which already matches
            the <code className={styles.guideInlineCode}>.env</code> in this repo
          </li>
        </ol>
        <div className={styles.guideNote}>
          <strong>It works out of the box.</strong> You do <strong>not</strong> need to create{' '}
          <code className={styles.guideInlineCode}>config.php</code>. Create it only to replace
          the shipped key with your own private one — and if you do, put the same value in{' '}
          <code className={styles.guideInlineCode}>.env</code> and rebuild:
        </div>
        <pre className={styles.guideCode}>
{`# On the server: api/config.php
define('ADMIN_API_KEY', 'a-long-random-string-you-generated');

# Locally: .env  (same value, then npm run build and re-upload)
REACT_APP_LEADS_API_URL="/api/leads.php"
REACT_APP_LEADS_ADMIN_KEY="a-long-random-string-you-generated"`}
        </pre>
        <div className={styles.guideNoteWarning}>
          <strong>Seeing “Refresh failed: Server returned 401”?</strong> The server's key and the
          key baked into the build do not match — nearly always because{' '}
          <code className={styles.guideInlineCode}>api/config.php</code> was created (or left
          behind from an earlier deploy) with a different{' '}
          <code className={styles.guideInlineCode}>ADMIN_API_KEY</code>. This exact mismatch broke
          the first live deploy of the previous build, so check it first.
          <p style={{ marginTop: '8px' }}>
            The tell-tale symptom: <strong>the public form keeps saving leads normally</strong>{' '}
            (creating a lead needs no key) while every Admin Panel call 401s. No data is lost —
            the leads are safe in <code className={styles.guideInlineCode}>api/data/leads.json</code>{' '}
            and appear the moment the keys line up. Fix by editing{' '}
            <code className={styles.guideInlineCode}>api/config.php</code> to the build's key, or
            deleting the file to fall back to the shipped key, or rebuilding with the server's
            value.
          </p>
          <p style={{ marginTop: '8px' }}>
            Open <code className={styles.guideInlineCode}>/api/leads.php?action=health</code> on
            your domain — it reports which key source is active, a fingerprint of that key, and
            whether the caller's key matches. No lead data is exposed.
          </p>
        </div>
      </div>

      {/* Section 5: first deploy */}
      <h2 className={styles.guideTitle}>5. First Deploy — Order of Operations</h2>
      <div className={styles.guideSection}>
        <ol className={styles.guideStepList}>
          <li className={styles.guideStepItem}>
            Set a strong <code className={styles.guideInlineCode}>REACT_APP_ADMIN_USERNAME</code>{' '}
            and <code className={styles.guideInlineCode}>REACT_APP_ADMIN_PASSWORD</code> in{' '}
            <code className={styles.guideInlineCode}>.env</code>
          </li>
          <li className={styles.guideStepItem}>
            <code className={styles.guideInlineCode}>npm run build</code>
          </li>
          <li className={styles.guideStepItem}>
            Upload the contents of <code className={styles.guideInlineCode}>build/</code> to the
            web root
          </li>
          <li className={styles.guideStepItem}>
            Add the <code className={styles.guideInlineCode}>.htaccess</code> rewrite rules
          </li>
          <li className={styles.guideStepItem}>
            Make sure <code className={styles.guideInlineCode}>api/data/</code> is writable by PHP
            (<code className={styles.guideInlineCode}>chmod 755</code> on a VPS; automatic on most
            shared hosts)
          </li>
          <li className={styles.guideStepItem}>
            Enable SSL (free Let's Encrypt on nearly every host) and force HTTPS
          </li>
          <li className={styles.guideStepItem}>
            Submit a test enquiry, then open{' '}
            <code className={styles.guideInlineCode}>/admin/lms</code> — it should appear within
            15 seconds
          </li>
        </ol>
      </div>

      {/* Section 6: redeploys */}
      <h2 className={styles.guideTitle}>6. Redeploying Later</h2>
      <div className={styles.guideSection}>
        <ol className={styles.guideStepList}>
          <li className={styles.guideStepItem}>
            <code className={styles.guideInlineCode}>npm run build</code> and upload{' '}
            <code className={styles.guideInlineCode}>build/</code> over the old files
          </li>
          <li className={styles.guideStepItem}>
            <strong>Leave <code className={styles.guideInlineCode}>api/data/</code> alone</strong> —
            it holds every lead ever submitted. Take a copy of{' '}
            <code className={styles.guideInlineCode}>leads.json</code> (or an Admin Panel CSV
            export) before any risky deploy.
          </li>
          <li className={styles.guideStepItem}>
            If you keep a custom <code className={styles.guideInlineCode}>api/config.php</code>,
            leave that alone too, and make sure the new build was compiled with the matching key
          </li>
          <li className={styles.guideStepItem}>
            Hard-refresh once (Ctrl/Cmd + Shift + R) so the browser drops the old JavaScript
          </li>
        </ol>
      </div>

      {/* Section 7: checklist */}
      <h2 className={styles.guideTitle}>7. Post-Deployment Checklist</h2>
      <div className={styles.guideSection}>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>How to verify</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}>1</td>
              <td className={styles.guideTableCell}>Home page loads over HTTPS</td>
              <td className={styles.guideTableCell}>Visit the domain, look for the padlock</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>2</td>
              <td className={styles.guideTableCell}>All five pages render</td>
              <td className={styles.guideTableCell}>Home, About, Expertise, Who We Serve, Contact</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>3</td>
              <td className={styles.guideTableCell}>Deep links and refresh work</td>
              <td className={styles.guideTableCell}>
                Open <code className={styles.guideInlineCode}>/expertise</code> directly and press
                refresh — a 404 means the rewrite rule is missing
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>4</td>
              <td className={styles.guideTableCell}>The enquiry form submits</td>
              <td className={styles.guideTableCell}>Send a test enquiry; the success state appears in place</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>5</td>
              <td className={styles.guideTableCell}>Admin login works</td>
              <td className={styles.guideTableCell}>
                <code className={styles.guideInlineCode}>/admin</code> with the{' '}
                <code className={styles.guideInlineCode}>.env</code> credentials
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>6</td>
              <td className={styles.guideTableCell}>The test lead is in the Admin Panel</td>
              <td className={styles.guideTableCell}>
                Dashboard “Recent Enquiries” and{' '}
                <code className={styles.guideInlineCode}>/admin/lms</code>, within 15s
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>7</td>
              <td className={styles.guideTableCell}>Cross-device sync works</td>
              <td className={styles.guideTableCell}>
                Submit from a phone, watch it appear on the desktop Admin Panel. A 401 here means
                the key mismatch in section 4.
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>8</td>
              <td className={styles.guideTableCell}>Status change and note stick</td>
              <td className={styles.guideTableCell}>Change a status, reload — it should persist</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>9</td>
              <td className={styles.guideTableCell}>CSV export opens correctly</td>
              <td className={styles.guideTableCell}>Export from the Leads page, open in a spreadsheet</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>10</td>
              <td className={styles.guideTableCell}>Mobile layout is clean</td>
              <td className={styles.guideTableCell}>Test on a real phone, not just a narrow window</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>11</td>
              <td className={styles.guideTableCell}>Share preview shows the right image</td>
              <td className={styles.guideTableCell}>Paste the URL into WhatsApp or Slack</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>12</td>
              <td className={styles.guideTableCell}>Delete the test lead</td>
              <td className={styles.guideTableCell}>So the client's first real number is honest</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeploymentGuide;
