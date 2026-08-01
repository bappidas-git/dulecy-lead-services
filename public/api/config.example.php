<?php
/* ============================================
   API Configuration
   Copy this file to config.php and fill in
   your values.
   ============================================ */

// ============================================
// Lead Storage API (leads.php)
// Shared secret that gates admin-only endpoints
// (list / update / delete). MUST match the value
// of REACT_APP_LEADS_ADMIN_KEY used by the admin
// panel build. Generate a long (40+ char) random
// string.
//
// This file is OPTIONAL: leads.php ships a committed
// fallback key that already matches the
// REACT_APP_LEADS_ADMIN_KEY in .env, so cross-device
// sync works out of the box. Define
// ADMIN_API_KEY here (in a real config.php) ONLY to
// override that default with your own private key —
// and if you do, rotate REACT_APP_LEADS_ADMIN_KEY to
// the same value and rebuild the client.
// ============================================
define('ADMIN_API_KEY', 'CHANGE_ME_TO_A_LONG_RANDOM_STRING');
