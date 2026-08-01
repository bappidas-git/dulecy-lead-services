/* ============================================
   generate-icons.js — Favicons & PWA icons
   --------------------------------------------
   Regenerates the site's favicon / PWA / Apple-touch icons from the Nilachal
   Infracon color logo. The logo is a landscape lockup (emblem + wordmark), so
   we crop to the emblem — the illustrative brand mark — which stays legible at
   small icon sizes where the wordmark would not.

   Outputs (into public/):
     - favicon.png            32×32
     - favicon.ico            16 + 32 + 48 (multi-resolution)
     - apple-touch-icon.png   180×180 (white background, padded)
     - logo192.png            192×192 (maskable-safe padding)
     - logo512.png            512×512 (maskable-safe padding)

   Usage:  node scripts/generate-icons.js
   Requires dev deps: sharp, png-to-ico
   ============================================ */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const pngToIco = require("png-to-ico").default || require("png-to-ico");

// Color logo (light backgrounds) — keep in sync with src/data/siteConfig.js.
const LOGO_URL =
  "https://res.cloudinary.com/dn9gyaiik/image/upload/v1784965863/nilachal-logo_v2lolq.png";

const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

async function fetchLogo() {
  const res = await fetch(LOGO_URL);
  if (!res.ok) throw new Error(`Failed to fetch logo: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// Crop the emblem (top illustration, above the NILACHAL wordmark) and trim the
// surrounding transparency to a tight bounding box.
async function extractEmblem(logoBuf) {
  const { width, height } = await sharp(logoBuf).metadata();
  // The wordmark sits in the bottom third; ~68% of the height captures the
  // emblem with a small gap above the text.
  const cropHeight = Math.round(height * 0.68);
  const cropped = await sharp(logoBuf)
    .extract({ left: 0, top: 0, width, height: cropHeight })
    .png()
    .toBuffer();
  return sharp(cropped).trim().png().toBuffer();
}

// Place the emblem, scaled to `widthPct` of the canvas, centered on a square.
async function squareIcon(emblemBuf, size, widthPct, background) {
  const inner = Math.round(size * widthPct);
  const resized = await sharp(emblemBuf)
    .resize({ width: inner, fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toBuffer();
}

async function main() {
  console.log("Fetching color logo…");
  const logo = await fetchLogo();
  const emblem = await extractEmblem(logo);
  const em = await sharp(emblem).metadata();
  console.log(`Emblem cropped to ${em.width}×${em.height}`);

  const out = (name) => path.join(PUBLIC_DIR, name);

  // favicon.png (32) — maximise the mark; white background reads well in tabs.
  await sharp(await squareIcon(emblem, 32, 0.9, WHITE)).toFile(out("favicon.png"));

  // favicon.ico — 16/32/48 multi-resolution.
  const icoSizes = [16, 32, 48];
  const icoPngs = await Promise.all(
    icoSizes.map((s) => squareIcon(emblem, s, 0.9, WHITE)),
  );
  fs.writeFileSync(out("favicon.ico"), await pngToIco(icoPngs));

  // apple-touch-icon (180) — white background with padding (iOS rounds corners).
  await sharp(await squareIcon(emblem, 180, 0.78, WHITE)).toFile(
    out("apple-touch-icon.png"),
  );

  // logo192 / logo512 — maskable "any maskable": keep the emblem inside the
  // central safe zone on a full-bleed white background.
  await sharp(await squareIcon(emblem, 192, 0.66, WHITE)).toFile(out("logo192.png"));
  await sharp(await squareIcon(emblem, 512, 0.66, WHITE)).toFile(out("logo512.png"));

  // Clean up any leftover exotic Apple icons / Safari pinned tab from the
  // previous build (no longer referenced by index.html).
  for (const stale of [
    "apple-touch-icon-152x152.png",
    "apple-touch-icon-167x167.png",
    "apple-touch-icon-180x180.png",
    "safari-pinned-tab.svg",
  ]) {
    const p = out(stale);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(`Removed stale ${stale}`);
    }
  }

  console.log("Icons written to public/.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
