/* ============================================
   Lead Submission Utility
   Submits public landing-page leads directly to the
   shared server-side store (public/api/leads.php),
   which is the SINGLE SOURCE OF TRUTH for leads.

   Every submission — no matter which browser or
   device it comes from — is written to the server,
   so the admin panel sees every lead. There is no
   localStorage copy of leads: the server is
   authoritative and the admin reads straight from it.
   ============================================ */

import { siteConfig } from "../data/siteConfig";

// =============================================
// CONFIGURATION
// Server-side lead storage endpoint. The admin panel reads leads from here,
// so a submission made on one browser/device is visible to every admin.
// Same-origin by default; override with REACT_APP_LEADS_API_URL if the PHP
// endpoint lives elsewhere.
// =============================================
const LEADS_API_URL = process.env.REACT_APP_LEADS_API_URL || "/api/leads.php";

// Phone number surfaced in user-facing fallback messages when a submission
// cannot be saved. Sourced from siteConfig (single source of business truth).
const CONTACT_PHONE = siteConfig.phoneDisplay;

/**
 * Generate a UUID v4
 */
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Submit lead data to the shared server-side store.
 * @param {Object} leadData - The form data to submit
 * @param {string} leadData.name - Applicant's full name
 * @param {string} leadData.mobile - Mobile number (10 digits, +91 added separately)
 * @param {string} [leadData.email] - Email address (optional)
 * @param {string} leadData.service_interest - Selected interest (legacy key — value is
 *   the product/service label, e.g. "Steel Doors", or "General Enquiry"). Kept as
 *   `service_interest` to preserve the existing admin panel mapping.
 * @param {string} leadData.state - Enquirer's home state (NE India + "Other")
 * @param {string} [leadData.message] - Optional free-text question
 * @param {string} leadData.source - Form source identifier (e.g., 'hero-form', 'contact-form')
 * @returns {Promise<{success: boolean, duplicate?: boolean, message: string}>}
 */
export const submitLeadToWebhook = async (leadData) => {
  // Enrich the submission with metadata, attribution and the admin-panel
  // fields (status / notes / activity) so the lead renders correctly in the
  // LMS the moment it lands on the server.
  const submittedAt = new Date().toISOString();
  const params = new URLSearchParams(window.location.search);
  const enrichedData = {
    ...leadData,
    lead_id: generateUUID(),
    status: "new",
    submitted_at: submittedAt,
    updated_at: submittedAt,
    page_url: window.location.href,
    user_agent: navigator.userAgent,
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
    notes: [],
    activity: [
      {
        action: "Lead created",
        status: "new",
        timestamp: submittedAt,
      },
    ],
  };

  if (!LEADS_API_URL) {
    console.error("[LeadsAPI] No lead endpoint configured");
    return {
      success: false,
      message: `Submissions aren't configured yet. Please call us at ${CONTACT_PHONE}.`,
    };
  }

  try {
    const response = await fetch(`${LEADS_API_URL}?action=create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead: enrichedData }),
      keepalive: true,
    });

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      if (data && data.duplicate) {
        // Server already holds a lead with this mobile/email — cross-device
        // duplicate prevention without exposing the admin key on the client.
        return {
          success: true,
          duplicate: true,
          message: "An enquiry with these details was already submitted.",
        };
      }
      return { success: true, message: "Lead submitted successfully" };
    }

    console.error("[LeadsAPI] create returned", response.status);
    return {
      success: false,
      message: `We couldn't submit your enquiry right now. Please try again or call us at ${CONTACT_PHONE}.`,
    };
  } catch (error) {
    // Network-level failure (offline, DNS error, etc.). Surface honestly so
    // the lead isn't silently lost — the user can retry or call.
    console.error("[LeadsAPI] create failed:", error);
    return {
      success: false,
      message: `Network error. Please check your connection and try again, or call us at ${CONTACT_PHONE}.`,
    };
  }
};

/**
 * Get current submission configuration.
 * Used by the admin panel's leadService to resolve the leads API URL.
 */
export const getConfig = () => ({
  LEADS_API_URL,
});
