import React from 'react';

const DeploymentGuide = ({ styles }) => {
  return (
    <div>
      {/* Section 1: Build the Project */}
      <h2 className={styles.guideTitle}>1. Build the Project</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Before deploying, you need to create a production build of your landing page.
        </p>

        <ol className={styles.guideStepList}>
          <li className={styles.guideStepItem}>Open terminal in the project folder</li>
          <li className={styles.guideStepItem}>
            Run: <code className={styles.guideInlineCode}>npm run build</code>
          </li>
          <li className={styles.guideStepItem}>
            This creates a <code className={styles.guideInlineCode}>build/</code> folder containing your production-ready landing page
          </li>
        </ol>

        <pre className={styles.guideCode}>
{`# Navigate to project folder
cd your-project-folder

# Build for production
npm run build`}
        </pre>

        <div className={styles.guideNote}>
          <strong>Note:</strong> The <code className={styles.guideInlineCode}>build/</code> folder is what you upload to your hosting. It contains optimized HTML, CSS, JS, and all assets. The source code (<code className={styles.guideInlineCode}>src/</code> folder) is NOT uploaded.
        </div>
      </div>

      {/* Section 2: Deploy to Netlify (Easiest) */}
      <h2 className={styles.guideTitle}>2. Deploy to Netlify (Easiest)</h2>
      <div className={styles.guideSection}>
        <ol className={styles.guideStepList}>
          <li className={styles.guideStepItem}>
            Go to <strong>https://app.netlify.com</strong>
          </li>
          <li className={styles.guideStepItem}>
            Sign up with GitHub, GitLab, or email
          </li>
          <li className={styles.guideStepItem}>
            <strong>Option A (Drag & Drop):</strong> Click "Add new site" → "Deploy manually" → Drag your <code className={styles.guideInlineCode}>build/</code> folder into the upload area
          </li>
          <li className={styles.guideStepItem}>
            <strong>Option B (Git):</strong> Click "Add new site" → "Import an existing project" → Connect your GitHub repo → Build command: <code className={styles.guideInlineCode}>npm run build</code>, Publish directory: <code className={styles.guideInlineCode}>build/</code>
          </li>
          <li className={styles.guideStepItem}>
            Netlify gives you a URL like <code className={styles.guideInlineCode}>your-site.netlify.app</code> — your landing page is live!
          </li>
        </ol>

        <div className={styles.guideNoteWarning}>
          <strong>IMPORTANT — SPA Routing Fix for Netlify:</strong>
          <p style={{ marginTop: '8px' }}>
            Create a file <code className={styles.guideInlineCode}>public/_redirects</code> (no extension) with this content:
          </p>
          <pre className={styles.guideCode}>
{`/*    /index.html   200`}
          </pre>
          <p>
            This ensures <code className={styles.guideInlineCode}>/thank-you</code> and <code className={styles.guideInlineCode}>/admin</code> routes work when accessed directly.
          </p>
        </div>
      </div>

      {/* Section 3: Deploy to Vercel */}
      <h2 className={styles.guideTitle}>3. Deploy to Vercel</h2>
      <div className={styles.guideSection}>
        <ol className={styles.guideStepList}>
          <li className={styles.guideStepItem}>
            Go to <strong>https://vercel.com</strong>
          </li>
          <li className={styles.guideStepItem}>
            Sign up and import your Git repository
          </li>
          <li className={styles.guideStepItem}>
            Framework Preset: <strong>"Create React App"</strong>
          </li>
          <li className={styles.guideStepItem}>
            Click <strong>"Deploy"</strong> — Vercel handles everything automatically
          </li>
        </ol>

        <div className={styles.guideNote}>
          <strong>Note:</strong> Vercel automatically handles SPA routing, so no <code className={styles.guideInlineCode}>_redirects</code> file is needed.
        </div>
      </div>

      {/* Section 4: Deploy to cPanel (Shared Hosting) */}
      <h2 className={styles.guideTitle}>4. Deploy to cPanel (Shared Hosting)</h2>
      <div className={styles.guideSection}>
        <ol className={styles.guideStepList}>
          <li className={styles.guideStepItem}>
            Build the project: <code className={styles.guideInlineCode}>npm run build</code>
          </li>
          <li className={styles.guideStepItem}>
            Open cPanel → File Manager → Navigate to <code className={styles.guideInlineCode}>public_html</code> (or your domain's folder)
          </li>
          <li className={styles.guideStepItem}>
            Upload ALL contents of the <code className={styles.guideInlineCode}>build/</code> folder (not the folder itself — the files inside it)
          </li>
          <li className={styles.guideStepItem}>
            Create a <code className={styles.guideInlineCode}>.htaccess</code> file in <code className={styles.guideInlineCode}>public_html</code> with SPA routing rules (see below)
          </li>
          <li className={styles.guideStepItem}>
            Visit your domain — the landing page should be live
          </li>
        </ol>

        <h3 className={styles.guideSubtitle}>.htaccess File Content</h3>
        <pre className={styles.guideCode}>
{`Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]`}
        </pre>

        <div className={styles.guideNoteWarning}>
          <strong>Warning:</strong> Upload the CONTENTS of the <code className={styles.guideInlineCode}>build/</code> folder, not the folder itself. Your <code className={styles.guideInlineCode}>public_html</code> should directly contain <code className={styles.guideInlineCode}>index.html</code>, <code className={styles.guideInlineCode}>static/</code>, etc.
        </div>
      </div>

      {/* Section 5: Deploy to Cloudways */}
      <h2 className={styles.guideTitle}>5. Deploy to Cloudways</h2>
      <div className={styles.guideSection}>
        <ol className={styles.guideStepList}>
          <li className={styles.guideStepItem}>
            SSH into your Cloudways server: <code className={styles.guideInlineCode}>ssh master@your-server-ip</code>
          </li>
          <li className={styles.guideStepItem}>
            Navigate to your application folder: <code className={styles.guideInlineCode}>cd applications/your-app/public_html</code>
          </li>
          <li className={styles.guideStepItem}>
            <strong>Option A (Manual):</strong> Upload <code className={styles.guideInlineCode}>build/</code> contents via SFTP (use FileZilla or WinSCP)
          </li>
          <li className={styles.guideStepItem}>
            <strong>Option B (Git Deploy):</strong> Clone your repo, run <code className={styles.guideInlineCode}>npm install && npm run build</code>, then copy <code className={styles.guideInlineCode}>build/*</code> to <code className={styles.guideInlineCode}>public_html/</code>
          </li>
          <li className={styles.guideStepItem}>
            Create <code className={styles.guideInlineCode}>.htaccess</code> with the SPA routing rules (same as cPanel above)
          </li>
          <li className={styles.guideStepItem}>
            Set up SSL (Cloudways dashboard → SSL Certificate → Let's Encrypt)
          </li>
        </ol>

        <h3 className={styles.guideSubtitle}>Git-Based Deployment</h3>
        <pre className={styles.guideCode}>
{`# On Cloudways server
cd /tmp
git clone https://github.com/your-repo.git
cd your-repo
npm install
npm run build
cp -r build/* /home/master/applications/your-app/public_html/`}
        </pre>
      </div>

      {/* Section 6: Deploy to AWS S3 + CloudFront */}
      <h2 className={styles.guideTitle}>6. Deploy to AWS S3 + CloudFront</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          For advanced users who want maximum scalability and performance:
        </p>

        <ol className={styles.guideStepList}>
          <li className={styles.guideStepItem}>
            Create an S3 bucket with static website hosting enabled
          </li>
          <li className={styles.guideStepItem}>
            Upload <code className={styles.guideInlineCode}>build/</code> contents to the bucket
          </li>
          <li className={styles.guideStepItem}>
            Set bucket policy to allow public read access
          </li>
          <li className={styles.guideStepItem}>
            Create a CloudFront distribution pointing to the S3 bucket
          </li>
          <li className={styles.guideStepItem}>
            Set custom error responses: 404 → <code className={styles.guideInlineCode}>/index.html</code> (response code 200) — this handles SPA routing
          </li>
          <li className={styles.guideStepItem}>
            Point your domain's DNS to CloudFront
          </li>
        </ol>
      </div>

      {/* Section 7: SPA Routing — Why It Matters */}
      <h2 className={styles.guideTitle}>7. SPA Routing — Why It Matters</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Your landing page is a Single Page Application (SPA) — all routes (<code className={styles.guideInlineCode}>/thank-you</code>, <code className={styles.guideInlineCode}>/admin/dashboard</code>) are handled by JavaScript, not by separate HTML files.
        </p>
        <p className={styles.guideParagraph}>
          When someone directly visits <code className={styles.guideInlineCode}>www.nilachalinfracon.com/admin/login</code>, the server looks for a file at <code className={styles.guideInlineCode}>/admin/login</code> — which doesn't exist. The solution is to tell the server to always serve <code className={styles.guideInlineCode}>index.html</code> for any URL, and let React Router handle the routing.
        </p>

        <h3 className={styles.guideSubtitle}>Routing Fixes by Platform</h3>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Platform</th>
              <th>Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}>Netlify</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>public/_redirects</code> with <code className={styles.guideInlineCode}>{"/* /index.html 200"}</code></td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Vercel</td>
              <td className={styles.guideTableCell}>Automatic (no fix needed)</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Apache (cPanel/Cloudways)</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>.htaccess</code> with RewriteRule</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>Nginx</td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>try_files $uri /index.html;</code> in server config</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>AWS CloudFront</td>
              <td className={styles.guideTableCell}>Custom error response: 404 → <code className={styles.guideInlineCode}>/index.html</code> (200)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 8: Custom Domain Setup */}
      <h2 className={styles.guideTitle}>8. Custom Domain Setup</h2>
      <div className={styles.guideSection}>
        <ol className={styles.guideStepList}>
          <li className={styles.guideStepItem}>
            Buy a domain from GoDaddy, Namecheap, Google Domains, etc.
          </li>
          <li className={styles.guideStepItem}>
            Point your domain's DNS to your hosting:
            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '4px' }}><strong>Netlify:</strong> Add custom domain in site settings, update DNS records</li>
              <li style={{ marginBottom: '4px' }}><strong>Vercel:</strong> Add domain in project settings, update DNS</li>
              <li><strong>cPanel/Cloudways:</strong> Point A record to server IP</li>
            </ul>
          </li>
          <li className={styles.guideStepItem}>
            Enable SSL (HTTPS) — most platforms offer free Let's Encrypt SSL
          </li>
          <li className={styles.guideStepItem}>
            Update your <code className={styles.guideInlineCode}>.env</code> and configuration files with the final domain URL
          </li>
        </ol>
      </div>

      {/* Lead Management Server Setup */}
      <h2 className={styles.guideTitle}>8b. Lead Management Server Setup (one-time)</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          After your site is uploaded, you need to enable the shared lead storage so the Admin
          Panel can display leads from every device. Do this <strong>once</strong> after the first
          deploy.
        </p>
        <div className={styles.guideNote}>
          <strong>Requires PHP hosting.</strong> cPanel, Hostinger, Cloudways, VPS — all work.
          Netlify/Vercel (static only) do not — host <code className={styles.guideInlineCode}>leads.php</code>{' '}
          on any cheap PHP server and set <code className={styles.guideInlineCode}>REACT_APP_LEADS_API_URL</code>{' '}
          to its full URL.
        </div>
        <div className={styles.guideNote}>
          <strong>It works out of the box.</strong>{' '}
          <code className={styles.guideInlineCode}>leads.php</code> ships a built-in admin key
          that already matches the <code className={styles.guideInlineCode}>REACT_APP_LEADS_ADMIN_KEY</code>{' '}
          committed in <code className={styles.guideInlineCode}>.env</code> — you do{' '}
          <strong>not</strong> need to create <code className={styles.guideInlineCode}>config.php</code>.
          Only follow the steps below if you want to replace that pair with your own private key.
        </div>
        <ol className={styles.guideStepList}>
          <li className={styles.guideStepItem}>
            <em>(Optional — private key.)</em> On the server, open the deployed{' '}
            <code className={styles.guideInlineCode}>api/</code> folder, copy{' '}
            <code className={styles.guideInlineCode}>config.example.php</code> →{' '}
            <code className={styles.guideInlineCode}>config.php</code>, and set{' '}
            <code className={styles.guideInlineCode}>ADMIN_API_KEY</code> to a long random string:
            <pre className={styles.guideCode}>{`define('ADMIN_API_KEY', 'Zk8pQ3mX9yL2wN7bV5rT1jH6cD4fG0aE');`}</pre>
          </li>
          <li className={styles.guideStepItem}>
            In your local project, put <strong>the same value</strong> in{' '}
            <code className={styles.guideInlineCode}>.env</code>:
            <pre className={styles.guideCode}>
{`REACT_APP_LEADS_API_URL="/api/leads.php"
REACT_APP_LEADS_ADMIN_KEY="Zk8pQ3mX9yL2wN7bV5rT1jH6cD4fG0aE"`}
            </pre>
            then run <code className={styles.guideInlineCode}>npm run build</code> and re-upload{' '}
            <code className={styles.guideInlineCode}>build/</code> (env values are baked in at
            build time). A <code className={styles.guideInlineCode}>config.php</code>{' '}
            <strong>overrides</strong> the built-in key, so creating it without rebuilding locks
            your own admin panel out.
          </li>
          <li className={styles.guideStepItem}>
            Make sure <code className={styles.guideInlineCode}>api/data/</code> is writable by PHP
            (<code className={styles.guideInlineCode}>chmod 755</code> on VPS; automatic on most
            cPanel hosts).
          </li>
          <li className={styles.guideStepItem}>
            Submit a test lead from any device, then refresh{' '}
            <code className={styles.guideInlineCode}>/admin/lms</code> — it should appear.
          </li>
        </ol>
        <div className={styles.guideNoteWarning}>
          <strong>Seeing “Refresh failed: Server returned 401”?</strong> The key on the server and
          the key baked into your build don't match — usually because{' '}
          <code className={styles.guideInlineCode}>api/config.php</code> was created with a
          different <code className={styles.guideInlineCode}>ADMIN_API_KEY</code> than the build's{' '}
          <code className={styles.guideInlineCode}>REACT_APP_LEADS_ADMIN_KEY</code>. Fix it by
          editing <code className={styles.guideInlineCode}>api/config.php</code> to the build's key
          (or deleting the file to use the built-in key), or by rebuilding with the matching value.
          Open <code className={styles.guideInlineCode}>/api/leads.php?action=health</code> on your
          domain to see which key source the server is using — leads submitted meanwhile are safe
          in <code className={styles.guideInlineCode}>api/data/leads.json</code> and appear as soon
          as the keys match.
        </div>
        <div className={styles.guideTip}>
          <strong>Sync:</strong> All leads and admin actions (status changes, notes, deletions)
          flow through <code className={styles.guideInlineCode}>/api/leads.php</code>, so every
          browser and device shows the same data. See the Lead Storage tab for details.
        </div>
      </div>

      {/* Section 9: Post-Deployment Checklist */}
      <h2 className={styles.guideTitle}>9. Post-Deployment Checklist</h2>
      <div className={styles.guideSection}>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>How to Verify</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}>1</td>
              <td className={styles.guideTableCell}>Landing page loads at your domain</td>
              <td className={styles.guideTableCell}>Visit the URL</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>2</td>
              <td className={styles.guideTableCell}>All sections render correctly</td>
              <td className={styles.guideTableCell}>Scroll through the page</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>3</td>
              <td className={styles.guideTableCell}>Forms submit successfully</td>
              <td className={styles.guideTableCell}>Fill and submit a test form</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>4</td>
              <td className={styles.guideTableCell}>Thank You page appears after submission</td>
              <td className={styles.guideTableCell}>Submit form → should redirect</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>5</td>
              <td className={styles.guideTableCell}>Admin panel accessible at <code className={styles.guideInlineCode}>/admin</code></td>
              <td className={styles.guideTableCell}>Visit <code className={styles.guideInlineCode}>www.nilachalinfracon.com/admin</code></td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>6</td>
              <td className={styles.guideTableCell}>Admin login works</td>
              <td className={styles.guideTableCell}>Enter credentials</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>7</td>
              <td className={styles.guideTableCell}>Server receives form data</td>
              <td className={styles.guideTableCell}>Check <code className={styles.guideInlineCode}>api/data/leads.json</code> / Admin Panel</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>7b</td>
              <td className={styles.guideTableCell}>
                Admin panel shows leads from other devices
              </td>
              <td className={styles.guideTableCell}>
                Submit a lead from your phone, then open <code className={styles.guideInlineCode}>/admin/lms</code> on desktop — the lead should appear. If not (or refresh shows a 401), open{' '}
                <code className={styles.guideInlineCode}>/api/leads.php?action=health</code> and make{' '}
                <code className={styles.guideInlineCode}>config.php</code> /{' '}
                <code className={styles.guideInlineCode}>REACT_APP_LEADS_ADMIN_KEY</code> match (see 8b).
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>8</td>
              <td className={styles.guideTableCell}>Mobile layout works</td>
              <td className={styles.guideTableCell}>Test on a real phone</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>9</td>
              <td className={styles.guideTableCell}>SSL certificate active</td>
              <td className={styles.guideTableCell}>Look for lock icon in browser URL bar</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>10</td>
              <td className={styles.guideTableCell}>OG image shows on sharing</td>
              <td className={styles.guideTableCell}>Share URL on WhatsApp/Slack → check preview</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>11</td>
              <td className={styles.guideTableCell}>Page speed score &gt; 80</td>
              <td className={styles.guideTableCell}>Run Lighthouse in Chrome DevTools</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeploymentGuide;
