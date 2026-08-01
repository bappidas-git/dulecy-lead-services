<?php
/* ============================================
   Lead Storage API
   Server-side shared storage for leads so the
   admin panel can see leads submitted from any
   browser/device (localStorage is per-device).

   Endpoints (all on this single file):
     POST /api/leads.php?action=create
       Body: { "lead": {...} }
       Public — no auth. Called by webhookSubmit.js
       after the Pabbly POST.

     GET  /api/leads.php?action=list
       Header: X-Admin-Key: <ADMIN_API_KEY>
       Returns all stored leads. Used by the admin
       panel to populate/refresh its LMS.

     POST /api/leads.php?action=update
       Header: X-Admin-Key
       Body: { "lead_id": "...", "patch": {...} }
       Merges patch into the lead. Used for status /
       note / activity updates from the admin panel.

     POST /api/leads.php?action=delete
       Header: X-Admin-Key
       Body: { "lead_ids": ["..."] }
       Removes leads by id.

     GET  /api/leads.php?action=health
       Public diagnostic — no lead data, no key
       material. Reports which source the server's
       admin key comes from (config.php / env /
       committed default), a short fingerprint of
       it, whether THIS request carried a key that
       matched, and whether the data store is
       writable. Lets the admin panel explain a
       misconfiguration instead of a bare 401.

   Auth: admin actions accept the key via the
   X-Admin-Key header, or — for proxies that strip
   custom headers — an admin_key query param / JSON
   body field. The key is compiled into the public
   admin bundle, so it is a sync handshake, not a
   private secret.

   Storage: a JSON file at api/data/leads.json.
   The data/ folder is created on first use and
   protected with a .htaccess "Deny from all".
   ============================================ */

header('Content-Type: application/json');
// Never let a proxy/CDN (e.g. the Varnish layer Cloudways runs in front of
// PHP apps) or the browser cache API responses: a cached `list` would serve
// stale — or worse, unauthenticated — lead data, and a cached 401 would keep
// the admin panel broken even after the key is fixed.
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ----- Storage paths -----
$dataDir  = __DIR__ . '/data';
$dataFile = $dataDir . '/leads.json';

if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
    @file_put_contents($dataDir . '/.htaccess', "Require all denied\nDeny from all\n");
    @file_put_contents($dataDir . '/index.html', '');
}

// ----- Resolve the admin key used to gate list/update/delete -----
//
// The admin panel reads the shared lead store using REACT_APP_LEADS_ADMIN_KEY,
// which is compiled into the public client bundle — so this value is NOT a
// real secret, it is just the handshake that keeps the admin panel and this
// API in sync. Previously the key lived ONLY in config.php, which is
// .gitignore'd and therefore never reaches the server on a fresh deploy. When
// it was missing, list/update/delete returned 503 and the admin panel could
// never load leads submitted from other devices. We now resolve the key from
// several sources, falling back to a committed default that matches the value
// in .env so cross-device sync works out of the box without a manual
// server-side config step.
//
// Resolution order (first non-empty wins):
//   1. ADMIN_API_KEY defined in config.php (highest priority — lets an
//      operator override the default with their own secret).
//   2. LEADS_ADMIN_KEY / ADMIN_API_KEY environment variable (e.g. set in the
//      Cloudways application settings).
//   3. The committed default below, which MUST match REACT_APP_LEADS_ADMIN_KEY
//      in .env. Change BOTH together to lock the API down to a private key.
$adminKey       = '';
$adminKeySource = 'default'; // 'config' | 'env' | 'default' — surfaced by action=health
$configFile     = __DIR__ . '/config.php';
if (file_exists($configFile)) {
    require_once $configFile;
    if (defined('ADMIN_API_KEY') && ADMIN_API_KEY !== '') {
        $adminKey       = ADMIN_API_KEY;
        $adminKeySource = 'config';
    }
}
if ($adminKey === '') {
    $envKey = getenv('LEADS_ADMIN_KEY');
    if (!$envKey) {
        $envKey = getenv('ADMIN_API_KEY');
    }
    if ($envKey) {
        $adminKey       = $envKey;
        $adminKeySource = 'env';
    }
}
if ($adminKey === '') {
    // Default — keep in sync with REACT_APP_LEADS_ADMIN_KEY in .env.
    $adminKey = 'idpFeRFMVsr80CkF8S6jGmcpAFagTIycB5GXa9GGi1z8LKP8';
}

// ----- Helpers -----
function load_leads($file) {
    if (!file_exists($file)) return [];
    $raw = @file_get_contents($file);
    if ($raw === false || $raw === '') return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function save_leads($file, $leads) {
    $fp = fopen($file, 'c+');
    if (!$fp) return false;
    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        return false;
    }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($leads, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return true;
}

// Union-merge two append-only arrays (notes or activity) coming from different
// devices, de-duping by a stable key and sorting chronologically. This is what
// keeps notes and the activity timeline in sync: each admin device mirrors its
// own (possibly stale) full array, so a plain overwrite would let one device
// drop entries another device added. Merging instead accumulates every entry.
function merge_lead_array($existing, $incoming, $type) {
    $existing = is_array($existing) ? $existing : [];
    $incoming = is_array($incoming) ? $incoming : [];
    $byKey = [];
    foreach (array_merge($existing, $incoming) as $item) {
        if (!is_array($item)) continue;
        if ($type === 'notes') {
            $key = (isset($item['id']) && $item['id'] !== '')
                ? 'id:' . $item['id']
                : 't:' . ($item['timestamp'] ?? '') . '|' . ($item['text'] ?? '');
        } else {
            $key = ($item['timestamp'] ?? '') . '|' . ($item['action'] ?? '');
        }
        if (!isset($byKey[$key])) {
            $byKey[$key] = $item;
        }
    }
    $result = array_values($byKey);
    // ISO 8601 timestamps sort correctly as plain strings.
    usort($result, function ($a, $b) {
        return strcmp($a['timestamp'] ?? '', $b['timestamp'] ?? '');
    });
    return $result;
}

// Read the admin key off the request, trying every transport the client may
// have used. The X-Admin-Key header is the primary vector; the query-param and
// body fallbacks exist because some hosting stacks (reverse proxies, caches,
// security modules) strip custom request headers, which used to turn every
// admin call into an unexplainable 401. The key ships inside the public admin
// bundle, so carrying it in an XHR URL does not expose anything new.
function read_admin_key($input) {
    $header = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
    if (is_string($header) && $header !== '') {
        return $header;
    }
    // Some FastCGI/proxy stacks only surface custom headers via getallheaders()
    // (or alter their case) — scan it case-insensitively before falling back.
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $name => $value) {
            if (strcasecmp($name, 'X-Admin-Key') === 0 && is_string($value) && $value !== '') {
                return $value;
            }
        }
    }
    $query = $_GET['admin_key'] ?? '';
    if (is_string($query) && $query !== '') {
        return $query;
    }
    $body = isset($input['admin_key']) ? $input['admin_key'] : '';
    if (is_string($body) && $body !== '') {
        return $body;
    }
    return '';
}

function require_admin_auth($expected, $provided) {
    if (empty($expected)) {
        http_response_code(503);
        echo json_encode(['error' => 'Admin API key not configured on server']);
        exit;
    }
    if (!is_string($provided) || $provided === '' || !hash_equals($expected, $provided)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

// ----- Parse request -----
$method = $_SERVER['REQUEST_METHOD'];
$raw    = file_get_contents('php://input');
$input  = json_decode($raw, true);
if (!is_array($input)) $input = [];
$action = $_GET['action'] ?? ($input['action'] ?? '');

// ----- Routes -----

// Public diagnostic. Exposes no lead data and no key material: the 8-char
// SHA-256 prefix only lets a client that ALREADY holds a key check whether it
// is the same one, and the real key is compiled into the public admin bundle
// anyway. This is what lets the admin panel turn a bare 401 into "the server's
// config.php defines a different ADMIN_API_KEY than this build".
if ($action === 'health') {
    $provided = read_admin_key($input);
    echo json_encode([
        'success'        => true,
        'version'        => 2,
        'keySource'      => $adminKeySource,
        'keyFingerprint' => substr(hash('sha256', $adminKey), 0, 8),
        'receivedKey'    => $provided !== '',
        'keyMatches'     => $provided !== '' && hash_equals($adminKey, $provided),
        'storeWritable'  => is_dir($dataDir) && is_writable($dataDir)
                            && (!file_exists($dataFile) || is_writable($dataFile)),
    ]);
    exit;
}

if ($method === 'GET' && ($action === '' || $action === 'list')) {
    require_admin_auth($adminKey, read_admin_key($input));
    echo json_encode(['success' => true, 'leads' => load_leads($dataFile)]);
    exit;
}

if ($method === 'POST' && $action === 'create') {
    $lead = $input['lead'] ?? null;
    if (!is_array($lead) || empty($lead['lead_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid lead payload']);
        exit;
    }
    $leads = load_leads($dataFile);
    // Dedup by lead_id (idempotent re-submits) and by mobile number
    // (cross-device duplicate prevention — the same applicant submitting
    // again from any browser/device is treated as a duplicate).
    $incomingMobile = isset($lead['mobile']) ? trim((string) $lead['mobile']) : '';
    foreach ($leads as $existing) {
        if (($existing['lead_id'] ?? null) === $lead['lead_id']) {
            echo json_encode(['success' => true, 'duplicate' => true]);
            exit;
        }
        if ($incomingMobile !== '' && trim((string) ($existing['mobile'] ?? '')) === $incomingMobile) {
            echo json_encode(['success' => true, 'duplicate' => true]);
            exit;
        }
    }
    $leads[] = $lead;
    if (!save_leads($dataFile, $leads)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save lead']);
        exit;
    }
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'POST' && $action === 'update') {
    require_admin_auth($adminKey, read_admin_key($input));
    $id    = $input['lead_id'] ?? '';
    $patch = $input['patch'] ?? null;
    if (!$id || !is_array($patch)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing lead_id or patch']);
        exit;
    }
    $leads = load_leads($dataFile);
    $found = false;
    foreach ($leads as &$lead) {
        if (($lead['lead_id'] ?? null) === $id) {
            foreach ($patch as $k => $v) {
                if (($k === 'notes' || $k === 'activity') && is_array($v)) {
                    // Append-only arrays: union with what we already have so a
                    // stale array from one device can't erase another device's
                    // entries.
                    $lead[$k] = merge_lead_array($lead[$k] ?? [], $v, $k);
                } else {
                    // Scalar fields (status, conversion tracking, updated_at):
                    // last-write-wins straight replace.
                    $lead[$k] = $v;
                }
            }
            $found = true;
            break;
        }
    }
    unset($lead);
    if (!$found) {
        http_response_code(404);
        echo json_encode(['error' => 'Lead not found']);
        exit;
    }
    save_leads($dataFile, $leads);
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'POST' && $action === 'delete') {
    require_admin_auth($adminKey, read_admin_key($input));
    $ids = $input['lead_ids'] ?? [];
    if (!is_array($ids) || count($ids) === 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing lead_ids']);
        exit;
    }
    $idSet = array_flip($ids);
    $leads = load_leads($dataFile);
    $remaining = [];
    foreach ($leads as $lead) {
        $lid = $lead['lead_id'] ?? '';
        if (!isset($idSet[$lid])) {
            $remaining[] = $lead;
        }
    }
    save_leads($dataFile, $remaining);
    echo json_encode([
        'success' => true,
        'removed' => count($leads) - count($remaining),
    ]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Unknown action']);
