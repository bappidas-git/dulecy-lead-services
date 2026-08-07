/* ============================================
   generate-og.js — Social share (Open Graph) image
   --------------------------------------------
   Builds public/og-image.png (1200×630) — the image shown when the site is
   shared on Facebook, LinkedIn, WhatsApp, Slack, X, Google Discover, etc.

   Composition follows the Dulcey design system: white background, ink
   (#0B0B0C) headline, a Dulcey-red accent rule, the color logo lockup
   top-left, and the secondary tagline + site URL along the bottom. Text is
   drawn via an SVG layer; the logo is composited on top.

   Brand values are mirrored from src/data/siteConfig.js and
   src/styles/variables.css — update both if the palette changes.

   Usage:  node scripts/generate-og.js  (npm run generate:og)
   Requires dev dep: sharp
   ============================================ */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Ink lockup (light backgrounds) — keep in sync with siteConfig.logo. Now read
// off disk rather than fetched: the wordmark is self-hosted, so `npm run
// generate:og` no longer needs the network.
const LOGO_FILE = path.resolve(
  __dirname,
  "..",
  "public",
  "images",
  "logo",
  "dulcey-wordmark.png"
);

const OUT = path.resolve(__dirname, "..", "public", "og-image.png");

const W = 1200;
const H = 630;
const WHITE = "#FFFFFF";
const INK = "#0B0B0C"; // --ink
const RED = "#D5192E"; // --red (Dulcey red)
const SLATE = "#4A4A4F"; // --grey-2
const FONT = "Liberation Sans, DejaVu Sans, Arial, Helvetica, sans-serif";

function readLogo() {
  if (!fs.existsSync(LOGO_FILE))
    throw new Error(`Logo not found at ${LOGO_FILE}`);
  return fs.readFileSync(LOGO_FILE);
}

function buildSvg() {
  return Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${WHITE}" />
  <!-- red accent rule above the headline -->
  <rect x="80" y="322" width="62" height="6" rx="3" fill="${RED}" />
  <text x="80" y="406" font-family="${FONT}" font-size="66" font-weight="700"
        letter-spacing="-2" fill="${INK}">Dulcey Lead Services</text>
  <text x="80" y="484" font-family="${FONT}" font-size="66" font-weight="700"
        letter-spacing="-2" fill="${RED}">Beyond Business Support</text>
  <text x="80" y="574" font-family="${FONT}" font-size="26" font-weight="500"
        fill="${SLATE}">Your Partner in Business Leadership</text>
  <text x="${W - 80}" y="574" text-anchor="end" font-family="${FONT}"
        font-size="26" font-weight="600" fill="${INK}">www.dulceyleadservices.com</text>
</svg>`);
}

async function main() {
  console.log("Reading Dulcey wordmark…");
  const logoRaw = readLogo();
  const logo = await sharp(logoRaw)
    .resize({ width: 440, fit: "inside" })
    .png()
    .toBuffer();
  const { height: logoH } = await sharp(logo).metadata();

  // The wordmark is transparent, so flatten the SVG plate first — compositing
  // a transparent mark straight onto the base is what keeps the edges clean.
  const base = sharp(buildSvg()).flatten({ background: WHITE }).png();
  const composed = await base
    .composite([{ input: logo, left: 80, top: Math.round(160 - logoH / 2) }])
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  await sharp(composed).toFile(OUT);
  const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log(`Wrote ${OUT} (${W}×${H}, ${kb} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
