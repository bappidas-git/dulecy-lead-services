/* ============================================
   Lead Service Utility
   The shared server-side store (public/api/leads.php)
   is the SINGLE SOURCE OF TRUTH for leads. This module
   keeps an in-memory cache that is hydrated from the
   server and refreshed on a poll interval, so every
   admin browser/device shows the same data.

   There is NO localStorage copy of leads — that was the
   cause of cross-device data never matching. All reads
   come from the server-backed cache and all writes are
   mirrored to the server immediately.
   ============================================ */

import { getConfig } from "../../utils/webhookSubmit";
import { describeStatusChange, STATUS_OPTIONS } from "./leadStatus";

// Shared secret used to authenticate against /api/leads.php admin actions.
// Must match ADMIN_API_KEY in public/api/config.php (or the committed default
// in leads.php) on the server.
const LEADS_ADMIN_KEY = process.env.REACT_APP_LEADS_ADMIN_KEY || "";

// In-memory cache of all leads, hydrated from the server by
// syncLeadsFromServer(). Lives for the lifetime of the admin SPA session.
// Reads filter this cache; writes update it optimistically AND mirror to the
// server so the change is durable and visible to every other device.
let _cache = [];

// BroadcastChannel notifies every admin tab/window in the SAME browser that a
// lead changed, so a mutation made in one window refreshes the others
// instantly (cross-device sync is handled by the server poll).
const LEADS_CHANNEL = "lp_leads_channel";

let leadsChannel = null;
const getLeadsChannel = () => {
  if (leadsChannel) return leadsChannel;
  if (typeof BroadcastChannel === "undefined") return null;
  try {
    leadsChannel = new BroadcastChannel(LEADS_CHANNEL);
  } catch (err) {
    leadsChannel = null;
  }
  return leadsChannel;
};

/**
 * Notify every admin view (this tab and other tabs/windows of the same
 * browser) that the lead store changed, so they reload without waiting for the
 * next server poll.
 */
const notifyLeadsChanged = () => {
  const channel = getLeadsChannel();
  if (channel) {
    try {
      channel.postMessage({ type: "leads-changed", at: Date.now() });
    } catch (err) {
      /* ignore — fall back to the DOM event below */
    }
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("lp:leads-changed"));
  }
};

/**
 * Subscribe an admin page to lead-store changes: a mutation in this tab
 * (`lp:leads-changed`) or a BroadcastChannel message from another window of the
 * same browser. Returns an unsubscribe function.
 */
export const onLeadsChanged = (handler) => {
  if (typeof window === "undefined") return () => {};

  const channel = getLeadsChannel();
  const onMessage = (e) => {
    if (e?.data?.type === "leads-changed") handler();
  };

  if (channel) channel.addEventListener("message", onMessage);
  window.addEventListener("lp:leads-changed", handler);

  return () => {
    if (channel) channel.removeEventListener("message", onMessage);
    window.removeEventListener("lp:leads-changed", handler);
  };
};

/**
 * Build the URL for the leads API. Returns empty string when disabled.
 */
const getLeadsApiUrl = () => {
  const { LEADS_API_URL } = getConfig();
  return LEADS_API_URL || "";
};

/**
 * Compose the URL for an admin action. The admin key rides in an admin_key
 * query param IN ADDITION to the X-Admin-Key header: some hosting stacks put a
 * proxy/cache/security layer in front of PHP that strips custom request
 * headers, which used to turn every admin call into an unexplainable 401. The
 * key is compiled into this public bundle, so the URL copy exposes nothing new.
 */
const adminActionUrl = (url, action) =>
  `${url}?action=${action}&admin_key=${encodeURIComponent(LEADS_ADMIN_KEY)}`;

/**
 * Fire-and-forget admin call to the leads API. Re-syncs from the server once
 * the write completes so the cache reflects the server's merged copy.
 */
const callLeadsApi = (action, body) => {
  const url = getLeadsApiUrl();
  if (!url || !LEADS_ADMIN_KEY) return Promise.resolve();
  return fetch(adminActionUrl(url, action), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Key": LEADS_ADMIN_KEY,
    },
    // admin_key in the body mirrors the header for header-stripping proxies;
    // the server reads it as an auth fallback and never stores it.
    body: JSON.stringify({ ...body, admin_key: LEADS_ADMIN_KEY }),
    keepalive: true,
  }).catch((err) => console.error(`[LeadsAPI] ${action} failed:`, err));
};

/**
 * Query the API's public health action (no auth, no lead data). Returns the
 * parsed diagnostic object, or null when the deployed leads.php predates the
 * health action (it answers 400 "Unknown action") or the call fails outright.
 */
const fetchLeadsHealth = async (url) => {
  try {
    const res = await fetch(adminActionUrl(url, "health"), {
      method: "GET",
      headers: { "X-Admin-Key": LEADS_ADMIN_KEY },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.success ? data : null;
  } catch (err) {
    return null;
  }
};

/**
 * Turn a failed list call into an error message the operator can act on.
 * A bare "Server returned 401" (all the UI used to show) gives no clue that
 * the fix is aligning the server's ADMIN_API_KEY with the key this build was
 * compiled with — so for auth failures we ask the health action WHY the key
 * was rejected and name the exact thing to change.
 */
const describeSyncFailure = async (url, status) => {
  const base = `Server returned ${status}`;
  if (status === 503) {
    return `${base} — the server has no admin key configured. Redeploy the api/ folder from this build (its leads.php ships a built-in key).`;
  }
  if (status !== 401) return base;

  const health = await fetchLeadsHealth(url);
  if (!health) {
    // Deployed leads.php is older than this build (no health action) — the
    // key mismatch itself is still the overwhelmingly likely cause.
    return `${base} — the server rejected this build's admin key. Set ADMIN_API_KEY in api/config.php on the server to this build's REACT_APP_LEADS_ADMIN_KEY (or delete api/config.php to use the built-in key), and redeploy the api/ folder from this build.`;
  }
  if (!health.receivedKey) {
    return `${base} — the admin key never reached the server (a proxy is stripping it). Redeploy the api/ folder from this build so the query-param fallback is active.`;
  }
  if (!health.keyMatches) {
    const sourceHint =
      health.keySource === "config"
        ? "api/config.php on the server defines a different ADMIN_API_KEY"
        : health.keySource === "env"
          ? "a LEADS_ADMIN_KEY / ADMIN_API_KEY server environment variable defines a different key"
          : "the deployed api/leads.php has a different built-in key";
    return `${base} — ${sourceHint} than the key this admin build was compiled with. Make them match: edit or delete api/config.php on the server, or rebuild with the matching REACT_APP_LEADS_ADMIN_KEY.`;
  }
  return base;
};

/**
 * Normalise a raw server lead so the admin UI always has the fields it expects.
 */
const normalizeLead = (lead) => ({
  ...lead,
  status: lead.status || "new",
  notes: Array.isArray(lead.notes) ? lead.notes : [],
  activity: Array.isArray(lead.activity)
    ? lead.activity
    : [
        {
          action: "Lead created",
          status: lead.status || "new",
          timestamp: lead.submitted_at || new Date().toISOString(),
        },
      ],
});

/**
 * Replace a lead in the cache with a NEW object built by `updater`. Returning a
 * fresh object (rather than mutating in place) keeps React reference checks
 * working so detail/list views re-render after an edit.
 */
const replaceInCache = (id, updater) => {
  let updated = null;
  _cache = _cache.map((l) => {
    if (l.lead_id !== id) return l;
    updated = updater(l);
    return updated;
  });
  return updated;
};

/**
 * Pull every lead from the server-side store (the source of truth) and replace
 * the in-memory cache with it. Returns counts of what changed versus the
 * previous cache so callers can refresh their UI only when something actually
 * moved.
 *
 * Returns { synced, added, updated, removed, error? }.
 */
export const syncLeadsFromServer = async () => {
  const url = getLeadsApiUrl();
  if (!url) {
    return { synced: 0, added: 0, updated: 0, removed: 0, error: "LEADS_API_URL not configured" };
  }
  if (!LEADS_ADMIN_KEY) {
    return {
      synced: 0,
      added: 0,
      updated: 0,
      removed: 0,
      error: "REACT_APP_LEADS_ADMIN_KEY not set — cannot authenticate",
    };
  }

  try {
    const response = await fetch(adminActionUrl(url, "list"), {
      method: "GET",
      headers: { "X-Admin-Key": LEADS_ADMIN_KEY },
      // Bypass every HTTP cache between the panel and the store — a cached
      // list response would hide fresh leads until the cache expired.
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        synced: 0,
        added: 0,
        updated: 0,
        removed: 0,
        error: await describeSyncFailure(url, response.status),
      };
    }
    const data = await response.json();
    const serverLeads = Array.isArray(data.leads) ? data.leads : [];
    const normalized = serverLeads.map(normalizeLead);

    // Diff against the previous cache so the UI only refreshes on real change.
    const prevById = new Map(_cache.map((l) => [l.lead_id, l]));
    const serverIds = new Set();
    let added = 0;
    let updated = 0;
    normalized.forEach((lead) => {
      serverIds.add(lead.lead_id);
      const prev = prevById.get(lead.lead_id);
      if (!prev) {
        added++;
      } else if (JSON.stringify(prev) !== JSON.stringify(lead)) {
        updated++;
      }
    });
    const removed = _cache.filter((l) => !serverIds.has(l.lead_id)).length;

    _cache = normalized;
    return { synced: normalized.length, added, updated, removed };
  } catch (err) {
    console.error("[LeadsAPI] sync failed:", err);
    return { synced: 0, added: 0, updated: 0, removed: 0, error: err.message || "Network error" };
  }
};

/**
 * Get all leads with optional filters (read from the server-backed cache).
 * @param {Object} filters - { search, status, source, dateRange, startDate, endDate }
 * @returns {Array} Filtered leads
 */
export const getLeads = (filters = {}) => {
  let leads = [..._cache];

  // Search filter — name, email, mobile, interest (service_interest), state
  if (filters.search) {
    const q = filters.search.toLowerCase();
    leads = leads.filter(
      (l) =>
        (l.name || "").toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q) ||
        (l.mobile || "").includes(q) ||
        (l.service_interest || "").toLowerCase().includes(q) ||
        (l.state || "").toLowerCase().includes(q)
    );
  }

  // Status filter
  if (filters.status && filters.status !== "all") {
    leads = leads.filter((l) => l.status === filters.status);
  }

  // Source filter
  if (filters.source && filters.source !== "all") {
    leads = leads.filter((l) => l.source === filters.source);
  }

  // Date range filter
  if (filters.dateRange && filters.dateRange !== "all") {
    const now = new Date();
    let startDate;

    switch (filters.dateRange) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week": {
        const day = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - day);
        startDate.setHours(0, 0, 0, 0);
        break;
      }
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "custom":
        if (filters.startDate) startDate = new Date(filters.startDate);
        break;
      default:
        break;
    }

    if (startDate) {
      leads = leads.filter((l) => new Date(l.submitted_at) >= startDate);
    }
    if (filters.dateRange === "custom" && filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      leads = leads.filter((l) => new Date(l.submitted_at) <= endDate);
    }
  }

  // Sort by date descending by default
  leads.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  return leads;
};

/**
 * Get a single lead by ID
 */
export const getLeadById = (id) => {
  return _cache.find((l) => l.lead_id === id) || null;
};

/**
 * Update lead status
 */
export const updateLeadStatus = (id, status) => {
  const existing = _cache.find((l) => l.lead_id === id);
  if (!existing) return null;

  const oldStatus = existing.status;
  const now = new Date().toISOString();
  const updated = replaceInCache(id, (l) => ({
    ...l,
    status,
    activity: [
      ...(l.activity || []),
      {
        // Action text is built from display labels; the timeline also re-maps
        // any quoted status at render time so it always shows present labels.
        action: describeStatusChange(oldStatus, status),
        status,
        timestamp: now,
      },
    ],
    // Last-write-wins marker so the server's merge keeps the newest edit.
    updated_at: now,
  }));

  notifyLeadsChanged();

  // Mirror to the shared server store so other admins/devices see the change.
  callLeadsApi("update", {
    lead_id: id,
    patch: {
      status: updated.status,
      activity: updated.activity,
      updated_at: updated.updated_at,
    },
  });

  return updated;
};

/**
 * Add a note to a lead
 */
export const addLeadNote = (id, noteText) => {
  const existing = _cache.find((l) => l.lead_id === id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const note = {
    id: Date.now().toString(),
    text: noteText,
    timestamp: now,
  };
  const updated = replaceInCache(id, (l) => ({
    ...l,
    notes: [...(l.notes || []), note],
    activity: [
      ...(l.activity || []),
      { action: "Note added", status: l.status, timestamp: now },
    ],
    updated_at: now,
  }));

  notifyLeadsChanged();

  // Mirror to the shared server store so notes persist across admins.
  callLeadsApi("update", {
    lead_id: id,
    patch: {
      notes: updated.notes,
      activity: updated.activity,
      updated_at: updated.updated_at,
    },
  });

  return updated;
};

/**
 * Delete a single lead
 */
export const deleteLead = (id) => {
  _cache = _cache.filter((l) => l.lead_id !== id);
  notifyLeadsChanged();
  // Mirror delete to the shared server store.
  callLeadsApi("delete", { lead_ids: [id] });
  return true;
};

/**
 * Bulk delete leads
 */
export const deleteLeads = (ids) => {
  const idSet = new Set(ids);
  _cache = _cache.filter((l) => !idSet.has(l.lead_id));
  notifyLeadsChanged();
  if (ids.length > 0) {
    callLeadsApi("delete", { lead_ids: ids });
  }
  return true;
};

/**
 * Export leads to CSV string and trigger download
 */
export const exportLeadsCSV = (leads) => {
  const headers = [
    "Lead ID",
    "Name",
    "Mobile",
    "Email",
    "Interested In",
    "State",
    "Source",
    "Status",
    "Submitted At",
    "Page URL",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "UTM Term",
    "UTM Content",
    "Notes",
  ];

  const escapeCSV = (val) => {
    const str = String(val || "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = leads.map((l) => [
    l.lead_id,
    l.name,
    l.mobile,
    l.email,
    l.service_interest,
    l.state,
    l.source,
    l.status,
    l.submitted_at,
    l.page_url,
    l.utm_source,
    l.utm_medium,
    l.utm_campaign,
    l.utm_term,
    l.utm_content,
    (l.notes || []).map((n) => n.text).join(" | "),
  ]);

  const csvContent =
    [headers.map(escapeCSV).join(","), ...rows.map((r) => r.map(escapeCSV).join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().split("T")[0];
  link.href = url;
  link.download = `leads_export_${date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Import leads from a CSV string. New leads are created on the server (the
 * source of truth) and added to the cache. Dedupes by mobile against the
 * current cache.
 * @param {string} csvText - Raw CSV content
 * @returns {Promise<{ imported: number, duplicates: number }>}
 */
export const importLeadsCSV = async (csvText) => {
  const lines = csvText.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return { imported: 0, duplicates: 0 };

  const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim().toLowerCase());
  const mobileIdx = headers.findIndex((h) => h === "mobile");
  const existingMobiles = new Set(_cache.map((l) => l.mobile));

  let imported = 0;
  let duplicates = 0;

  const fieldMap = {
    "lead id": "lead_id",
    name: "name",
    mobile: "mobile",
    email: "email",
    // Canonical key is `service_interest` (kept from the public form); the
    // exported header label is "Interested In", and older "Service Interest"
    // CSVs still import into the same key.
    "interested in": "service_interest",
    "service interest": "service_interest",
    state: "state",
    source: "source",
    status: "status",
    "submitted at": "submitted_at",
  };

  const newLeads = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.replace(/^"|"$/g, "").trim());
    const mobile = mobileIdx >= 0 ? values[mobileIdx] : null;

    if (mobile && existingMobiles.has(mobile)) {
      duplicates++;
      continue;
    }

    const now = new Date().toISOString();
    const lead = {
      lead_id: crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString() + Math.random().toString(36).slice(2),
      status: "new",
      submitted_at: now,
      updated_at: now,
      notes: [],
      activity: [{ action: "Imported from CSV", status: "new", timestamp: now }],
    };

    headers.forEach((h, idx) => {
      const key = fieldMap[h] || h.replace(/\s+/g, "_");
      if (values[idx]) lead[key] = values[idx];
    });

    newLeads.push(lead);
    if (mobile) existingMobiles.add(mobile);
    imported++;
  }

  if (newLeads.length > 0) {
    _cache = [..._cache, ...newLeads];
    // Persist each imported lead to the server (the source of truth).
    const url = getLeadsApiUrl();
    if (url) {
      await Promise.all(
        newLeads.map((lead) =>
          fetch(`${url}?action=create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lead }),
          }).catch((err) => console.error("[LeadsAPI] import create failed:", err))
        )
      );
    }
    notifyLeadsChanged();
  }

  return { imported, duplicates };
};

/**
 * Get summary stats for the dashboard
 */
export const getLeadStats = () => {
  const leads = _cache;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const totalLeads = leads.length;
  const newLeads24h = leads.filter(
    (l) => new Date(l.submitted_at) >= today
  ).length;
  const weekLeads = leads.filter(
    (l) => new Date(l.submitted_at) >= weekStart
  ).length;
  // A lead counts as converted once its status reaches the terminal
  // `completed` key (labelled "Converted" in the UI) — that is the status the
  // convert flow actually sets. The old code counted a non-existent
  // "converted" status, which is why the dashboard Conversion Rate was always
  // 0%.
  const convertedLeads = leads.filter((l) => l.status === "completed").length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0";

  // Top source
  const sourceCounts = {};
  leads.forEach((l) => {
    const src = l.source || "unknown";
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });
  const topSource =
    Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Recent leads (last 5)
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    .slice(0, 5);

  // Unique sources
  const sources = [...new Set(leads.map((l) => l.source).filter(Boolean))];

  // 14-day enquiry trend — submissions per calendar day for the last 14 days
  // (oldest first). Powers the hand-rolled SVG sparkline on the dashboard.
  const trend = [];
  for (let i = 13; i >= 0; i--) {
    const dayStart = new Date(today);
    dayStart.setDate(today.getDate() - i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);
    const count = leads.filter((l) => {
      const t = new Date(l.submitted_at);
      return t >= dayStart && t < dayEnd;
    }).length;
    trend.push({ date: dayStart.toISOString(), count });
  }

  // Status breakdown — count of leads per status, in the canonical order with
  // the display label + color, for the dashboard breakdown row.
  const statusCounts = leads.reduce((acc, l) => {
    const key = l.status || "new";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const statusBreakdown = STATUS_OPTIONS.map((s) => ({
    value: s.value,
    label: s.label,
    color: s.color,
    bg: s.bg,
    count: statusCounts[s.value] || 0,
  }));

  return {
    totalLeads,
    newLeads24h,
    weekLeads,
    conversionRate,
    convertedLeads,
    topSource,
    recentLeads,
    sources,
    trend,
    statusBreakdown,
  };
};
