import React from 'react';

const LeadStorageGuide = ({ styles }) => {
  return (
    <div>
      {/* Section 1: How leads are stored */}
      <h2 className={styles.guideTitle}>How Leads Are Stored &amp; Synced</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Every enquiry submitted on the website is saved to a{' '}
          <strong>single shared store on your server</strong> —{' '}
          <code className={styles.guideInlineCode}>/api/leads.php</code>, which keeps all
          leads in one JSON file (<code className={styles.guideInlineCode}>api/data/leads.json</code>).
          That server store is the <strong>single source of truth</strong>.
        </p>
        <p className={styles.guideParagraph}>
          Because the data lives on the server (not in any one browser), the Admin Panel shows
          the <strong>same leads on every device and every browser</strong> — your phone, your
          laptop, and a colleague's computer all read from the same place.
        </p>
        <div className={styles.guideNote}>
          <strong>How it works:</strong> the enquiry form (<code className={styles.guideInlineCode}>UnifiedLeadForm</code>,
          shown on the Contact page and in the site-wide enquiry modal) →{' '}
          <code className={styles.guideInlineCode}>webhookSubmit.js</code> →{' '}
          <code className={styles.guideInlineCode}>POST /api/leads.php?action=create</code> →
          shared JSON store → Admin Panel reads it on every device.
        </div>
        <div className={styles.guideNoteWarning}>
          <strong>Never add a localStorage copy of leads.</strong> An earlier build cached leads
          in the browser and cross-device data never matched. The in-memory cache in{' '}
          <code className={styles.guideInlineCode}>leadService.js</code> is hydrated from the
          server on every load and poll — nothing about leads is persisted client-side.
        </div>
      </div>

      {/* The flow */}
      <h2 className={styles.guideTitle}>The Big Picture</h2>
      <div className={styles.guideSection}>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Step</th>
              <th>What happens</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><strong>1. Visitor submits</strong></td>
              <td className={styles.guideTableCell}>
                The form POSTs the lead (with UTM attribution) to{' '}
                <code className={styles.guideInlineCode}>/api/leads.php?action=create</code>.
                Email is required; phone is optional. When a phone number <em>is</em> given, the
                server dedupes on it so the same person can't create two leads.
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><strong>2. Server stores it</strong></td>
              <td className={styles.guideTableCell}>
                The lead is appended to the shared JSON file. This is the only copy that matters.
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><strong>3. Admin reads it</strong></td>
              <td className={styles.guideTableCell}>
                The Admin Panel pulls the full list from the server on load, then auto-refreshes
                every 15 seconds while the tab is visible (and when you click Refresh), so new
                leads appear on every device.
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><strong>4. Admin edits sync back</strong></td>
              <td className={styles.guideTableCell}>
                Status changes, notes, and deletions are written straight back to the server, so
                an edit made on one device shows up on all the others. Two admin tabs in the{' '}
                <em>same</em> browser update each other instantly over a BroadcastChannel, without
                waiting for the next poll.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* What a lead record holds */}
      <h2 className={styles.guideTitle}>What a Lead Record Holds</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          These field keys are a contract between the form, the server, the Admin Panel and the
          CSV export. <strong>Labels and options may change; the keys never do.</strong>
        </p>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Key</th>
              <th>Shown as</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>name</code></td>
              <td className={styles.guideTableCell}>Name</td>
              <td className={styles.guideTableCell}>Required</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>email</code></td>
              <td className={styles.guideTableCell}>Email</td>
              <td className={styles.guideTableCell}>Required</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>mobile</code></td>
              <td className={styles.guideTableCell}>Mobile</td>
              <td className={styles.guideTableCell}>Optional — blank shows as “—”</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>organization</code></td>
              <td className={styles.guideTableCell}>Organization</td>
              <td className={styles.guideTableCell}>
                Optional company / institution. Leads captured before this field existed simply
                show “—”.
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>service_interest</code></td>
              <td className={styles.guideTableCell}>Interested In</td>
              <td className={styles.guideTableCell}>
                One of the ten expertise areas, or “Something else”. The key keeps its original
                name so existing records and exports stay readable.
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>message</code></td>
              <td className={styles.guideTableCell}>Message</td>
              <td className={styles.guideTableCell}>Optional free text</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>source</code>, <code className={styles.guideInlineCode}>page_url</code>, <code className={styles.guideInlineCode}>utm_*</code></td>
              <td className={styles.guideTableCell}>Source card</td>
              <td className={styles.guideTableCell}>Which CTA and which campaign produced the lead</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>status</code>, <code className={styles.guideInlineCode}>notes[]</code>, <code className={styles.guideInlineCode}>activity[]</code></td>
              <td className={styles.guideTableCell}>Status / Notes / Timeline</td>
              <td className={styles.guideTableCell}>Written by the Admin Panel, appended never replaced</td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>state</code></td>
              <td className={styles.guideTableCell}>—</td>
              <td className={styles.guideTableCell}>
                Retired: no longer collected and no longer shown. The key is kept (never reused)
                so old records import and export unchanged.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Status pipeline */}
      <h2 className={styles.guideTitle}>The Status Pipeline</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          A lead moves through six stages. The Dashboard's <strong>Conversion Rate</strong> counts
          leads that reached <strong>Converted</strong>.
        </p>
        <p className={styles.guideParagraph}>
          New → Contacted → Proposal Sent → Follow-Up → Converted, with{' '}
          <strong>Not Interested</strong> as the other exit. Change a status from the dropdown in
          the leads table or on the lead's detail page; every change is stamped into the Activity
          Timeline with a time, so you can see the history of a conversation at a glance.
        </p>
      </div>

      {/* Configuration */}
      <h2 className={styles.guideTitle}>Configuration (Required)</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          Three settings keep the website, the server, and the Admin Panel in sync:
        </p>
        <table className={styles.guideTable}>
          <thead className={styles.guideTableHead}>
            <tr>
              <th>Setting</th>
              <th>Where</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.guideTableCell}>
                <code className={styles.guideInlineCode}>REACT_APP_LEADS_API_URL</code>
              </td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>.env</code></td>
              <td className={styles.guideTableCell}>
                URL of the leads endpoint. Default <code className={styles.guideInlineCode}>/api/leads.php</code>.
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>
                <code className={styles.guideInlineCode}>REACT_APP_LEADS_ADMIN_KEY</code>
              </td>
              <td className={styles.guideTableCell}><code className={styles.guideInlineCode}>.env</code></td>
              <td className={styles.guideTableCell}>
                Shared key the Admin Panel uses to list/update/delete leads. Must match{' '}
                <code className={styles.guideInlineCode}>ADMIN_API_KEY</code> on the server.
                It is baked into the build, so changing it means rebuilding.
              </td>
            </tr>
            <tr>
              <td className={styles.guideTableCell}>
                <code className={styles.guideInlineCode}>ADMIN_API_KEY</code>
              </td>
              <td className={styles.guideTableCell}>
                <code className={styles.guideInlineCode}>public/api/config.php</code>
              </td>
              <td className={styles.guideTableCell}>
                Optional server-side <strong>override</strong> of the built-in key. If the file
                exists it wins — so it must hold the exact key the deployed build was compiled
                with, or every admin call fails with 401 (public submissions keep saving either
                way). Check{' '}
                <code className={styles.guideInlineCode}>/api/leads.php?action=health</code> to see
                which key source is active.
              </td>
            </tr>
          </tbody>
        </table>
        <div className={styles.guideNote}>
          <strong>Key resolution order:</strong>{' '}
          <code className={styles.guideInlineCode}>api/config.php</code> →
          server environment variable → the committed fallback inside{' '}
          <code className={styles.guideInlineCode}>leads.php</code>. The health check names the
          active source and fingerprints the key, so the Admin Panel can tell you exactly what to
          fix instead of showing a bare 401.
        </div>
        <div className={styles.guideNote}>
          <strong>Hosting note:</strong> <code className={styles.guideInlineCode}>leads.php</code>{' '}
          needs PHP. Your build's <code className={styles.guideInlineCode}>public/api/</code> folder
          is deployed alongside the React app, and the <code className={styles.guideInlineCode}>api/data/</code>{' '}
          folder is created automatically and protected with a deny-all rule.
        </div>
      </div>

      {/* CSV */}
      <h2 className={styles.guideTitle}>CSV Export &amp; Import</h2>
      <div className={styles.guideSection}>
        <p className={styles.guideParagraph}>
          <strong>Export</strong> (Dashboard or Leads page) writes one row per lead with Lead ID,
          Name, Mobile, Email, Organization, Interested In, Source, Status, Submitted At, page URL,
          the five UTM columns, and notes joined with “|”. Selecting rows first exports only those.
        </p>
        <p className={styles.guideParagraph}>
          <strong>Import</strong> accepts that same file back, and also older exports that still
          carry a State column. Imported rows are created on the server like any other lead, and
          rows whose mobile number already exists are skipped as duplicates.
        </p>
      </div>
    </div>
  );
};

export default LeadStorageGuide;
