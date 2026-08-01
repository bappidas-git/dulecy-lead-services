/* ============================================
   generate-icons.js — Favicons & PWA icons
   --------------------------------------------
   Regenerates the site's favicon / PWA / Apple-touch icons from the Dulecy
   *icon* logo (the standalone "D" mark). That asset ships with a white circle
   baked onto a transparent square canvas, so the circle wastes most of the
   frame at 16–32px. We therefore flatten it onto white and trim the white
   away, leaving a tight box around the mark itself — which is what stays
   legible at favicon sizes.

   Outputs (into public/):
     - favicon.png            32×32
     - favicon.ico            16 + 32 + 48 (multi-resolution)
     - apple-touch-icon.png   180×180 (white background, padded)
     - logo192.png            192×192 (maskable-safe padding)
     - logo512.png            512×512 (maskable-safe padding)

   Usage:  node scripts/generate-icons.js  (npm run generate:icons)
   Requires dev deps: sharp, png-to-ico
   ============================================ */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const pngToIco = require("png-to-ico").default || require("png-to-ico");

// Icon logo (the "D" mark) — keep in sync with siteConfig.logoIcon in
// src/data/siteConfig.js.
const LOGO_ICON_URL =
  "https://res.cloudinary.com/dn9gyaiik/image/upload/v1785484838/Dulecy-Logo-Icon_hylrpw.png";

const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

async function fetchLogo() {
  const res = await fetch(LOGO_ICON_URL);
  if (!res.ok) throw new Error(`Failed to fetch icon logo: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// Flatten the transparent canvas onto white, then trim the white circle and
// padding down to the bounding box of the mark.
async function extractMark(logoBuf) {
  const flattened = await sharp(logoBuf).flatten({ background: WHITE }).png().toBuffer();
  return sharp(flattened)
    .trim({ background: "#ffffff", threshold: 10 })
    .png()
    .toBuffer();
}

// Place the mark, scaled to `widthPct` of the canvas, centered on a square.
async function squareIcon(markBuf, size, widthPct, background) {
  const inner = Math.round(size * widthPct);
  const resized = await sharp(markBuf)
    .resize({ width: inner, height: inner, fit: "inside", withoutEnlargement: false })
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
  console.log("Fetching Dulecy icon logo…");
  const logo = await fetchLogo();
  const mark = await extractMark(logo);
  const m = await sharp(mark).metadata();
  console.log(`Mark trimmed to ${m.width}×${m.height}`);

  const out = (name) => path.join(PUBLIC_DIR, name);

  // favicon.png (32) — maximise the mark; white background reads well in tabs.
  await sharp(await squareIcon(mark, 32, 0.92, WHITE)).toFile(out("favicon.png"));

  // favicon.ico — 16/32/48 multi-resolution.
  const icoSizes = [16, 32, 48];
  const icoPngs = await Promise.all(
    icoSizes.map((s) => squareIcon(mark, s, 0.92, WHITE)),
  );
  fs.writeFileSync(out("favicon.ico"), await pngToIco(icoPngs));

  // apple-touch-icon (180) — white background with padding (iOS rounds corners).
  await sharp(await squareIcon(mark, 180, 0.78, WHITE)).toFile(
    out("apple-touch-icon.png"),
  );

  // logo192 / logo512 — declared "any maskable" in manifest.json, so the mark
  // must sit inside the central safe zone on a full-bleed white background.
  await sharp(await squareIcon(mark, 192, 0.62, WHITE)).toFile(out("logo192.png"));
  await sharp(await squareIcon(mark, 512, 0.62, WHITE)).toFile(out("logo512.png"));

  // Clean up any leftover exotic Apple icons / Safari pinned tab from an
  // earlier build (no longer referenced by index.html).
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
