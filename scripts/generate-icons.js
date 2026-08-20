/* ============================================
   generate-icons.js — Favicons & PWA icons
   --------------------------------------------
   Regenerates the site's favicon / PWA / Apple-touch icons from the "DLS"
   mark (`public/images/logo/dls-mark-860.png`) — the same self-hosted,
   full-alpha artwork `siteConfig.logoMark` points at. The source is already
   trimmed to its own glyphs, so there is no white plate or dead padding to
   crop; we still `.trim()` defensively in case a future re-cut carries some.

   **Every output is transparent.** The mark ships as full-alpha `#ED1C24`
   glyphs on nothing, and the generator preserves that end to end — no
   `flatten()`, and every canvas is created at `alpha: 0`. The `.trim()` above
   is what makes this safe: it removes the transparent margin, so `WIDTH_PCT`
   measures the *visible* mark rather than the mark plus its padding.

   Two surfaces are transparent by explicit request, against platform advice —
   if either ever needs to go back to an opaque plate, give it `WHITE` below
   instead of `TRANSPARENT` and nothing else has to change:
     - apple-touch-icon: iOS does not honour alpha on home-screen icons and
       composites the transparent area onto **black**, so the mark reads red
       on black rather than red on white.
     - maskable-*: the maskable spec assumes an opaque bleed, since the
       launcher crops to its own shape; with alpha the result depends on what
       the launcher paints behind it.

   The mark is 860×460 — **1.87:1, not square** — so every size below is
   driven by a *width* fraction and letterboxes vertically. Do not reuse the
   old "D"-mark percentages: at 0.92 width a square mark filled the frame,
   whereas this one is only ~0.53 as tall as it is wide.

   Outputs (into public/):
     - favicon.png            32×32
     - favicon.ico            16 + 32 + 48 (multi-resolution, 32-bit RGBA)
     - apple-touch-icon.png   180×180 (padded)
     - logo192.png            192×192 ("any" — mark near full width)
     - logo512.png            512×512 ("any")
     - maskable-192.png       192×192 (mark inside the 80% safe circle)
     - maskable-512.png       512×512 (ditto)

   Why "any" and "maskable" are separate files: a maskable icon must keep its
   artwork inside a centred circle of 80% the canvas diameter, which for a
   1.87:1 mark caps it at ~0.70 width. Declaring one file `"any maskable"`
   would force that padding on the un-masked surfaces too (Chrome's install
   prompt, the tab-strip PWA icon), shrinking the mark for no reason.

   Usage:  node scripts/generate-icons.js  (npm run generate:icons)
   Requires dev deps: sharp, png-to-ico
   ============================================ */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const pngToIco = require("png-to-ico").default || require("png-to-ico");

const PUBLIC_DIR = path.resolve(__dirname, "..", "public");

// The "DLS" mark — keep in sync with siteConfig.logoMark in
// src/data/siteConfig.js. `/images/**` is immutable-cached, so a re-cut ships
// under a new `-<width>` filename; update this path in the same pass.
const MARK_FILE = path.join(PUBLIC_DIR, "images", "logo", "dls-mark-860.png");

// Canvas backgrounds. WHITE is unused at present — kept as the documented
// escape hatch for the apple-touch / maskable note in the header above.
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
// eslint-disable-next-line no-unused-vars
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

// Fraction of the canvas *width* the mark spans, per surface.
const WIDTH_PCT = {
  favicon: 0.94, // 16–48px: every pixel counts, corners are unused anyway
  apple: 0.84, // iOS rounds the corners and adds its own gloss-era inset
  any: 0.88, // un-masked PWA / install-prompt icon
  maskable: 0.7, // ~0.705 is the 80%-safe-circle cap at 1.87:1; round down
};

// Trim the transparent padding down to the bounding box of the mark. Alpha is
// preserved — `WIDTH_PCT` is meant to measure the glyphs, not the margin.
async function extractMark() {
  return sharp(MARK_FILE).trim({ threshold: 10 }).png().toBuffer();
}

// Place the mark, scaled to `widthPct` of the canvas, centered on a square.
// The mark is wider than it is tall, so `fit: inside` against a square box
// always binds on width — `widthPct` is literally the width fraction.
async function squareIcon(markBuf, size, widthPct, background) {
  const inner = Math.max(1, Math.round(size * widthPct));
  const resized = await sharp(markBuf)
    .resize({
      width: inner,
      height: inner,
      fit: "inside",
      withoutEnlargement: false,
      background: TRANSPARENT,
    })
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
  console.log(`Reading ${path.relative(process.cwd(), MARK_FILE)}…`);
  const mark = await extractMark();
  const m = await sharp(mark).metadata();
  console.log(`Mark trimmed to ${m.width}×${m.height} (alpha: ${m.hasAlpha})`);

  const out = (name) => path.join(PUBLIC_DIR, name);

  // favicon.png (32) — maximise the mark.
  await sharp(await squareIcon(mark, 32, WIDTH_PCT.favicon, TRANSPARENT)).toFile(
    out("favicon.png"),
  );

  // favicon.ico — 16/32/48 multi-resolution. png-to-ico embeds each PNG
  // whole, so the 32-bit RGBA alpha survives into the .ico.
  const icoPngs = await Promise.all(
    [16, 32, 48].map((s) => squareIcon(mark, s, WIDTH_PCT.favicon, TRANSPARENT)),
  );
  fs.writeFileSync(out("favicon.ico"), await pngToIco(icoPngs));

  // apple-touch-icon (180) — padded because iOS rounds the corners.
  await sharp(await squareIcon(mark, 180, WIDTH_PCT.apple, TRANSPARENT)).toFile(
    out("apple-touch-icon.png"),
  );

  // logo192 / logo512 — manifest `purpose: "any"`.
  await sharp(await squareIcon(mark, 192, WIDTH_PCT.any, TRANSPARENT)).toFile(
    out("logo192.png"),
  );
  await sharp(await squareIcon(mark, 512, WIDTH_PCT.any, TRANSPARENT)).toFile(
    out("logo512.png"),
  );

  // maskable-192 / maskable-512 — manifest `purpose: "maskable"`; the mark
  // must survive Android cropping it to a circle/squircle.
  await sharp(await squareIcon(mark, 192, WIDTH_PCT.maskable, TRANSPARENT)).toFile(
    out("maskable-192.png"),
  );
  await sharp(await squareIcon(mark, 512, WIDTH_PCT.maskable, TRANSPARENT)).toFile(
    out("maskable-512.png"),
  );

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
