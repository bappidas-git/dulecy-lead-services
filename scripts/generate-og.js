/* ============================================
   generate-og.js — Social share (Open Graph) image
   --------------------------------------------
   Builds public/og-image.png (1200×630) — the image shown when the site is
   shared on Facebook, LinkedIn, WhatsApp, Slack, X, Google Discover, etc.

   Composition follows the Dulecy design system: white background, ink
   (#0B0B0C) headline, a Dulecy-red accent rule, the color logo lockup
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

// Color logo (light backgrounds) — keep in sync with siteConfig.logo.
const LOGO_URL =
  "https://res.cloudinary.com/dn9gyaiik/image/upload/v1785484838/Dulecy-Logo_qr2ka7.png";

const OUT = path.resolve(__dirname, "..", "public", "og-image.png");

const W = 1200;
const H = 630;
const WHITE = "#FFFFFF";
const INK = "#0B0B0C"; // --color-ink
const RED = "#D5192E"; // --color-accent (Dulecy red)
const SLATE = "#4A4A4F"; // --color-slate
const FONT = "Liberation Sans, DejaVu Sans, Arial, Helvetica, sans-serif";

async function fetchLogo() {
  const res = await fetch(LOGO_URL);
  if (!res.ok) throw new Error(`Failed to fetch color logo: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function buildSvg() {
  return Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${WHITE}" />
  <!-- red accent rule above the headline -->
  <rect x="80" y="322" width="62" height="6" rx="3" fill="${RED}" />
  <text x="80" y="406" font-family="${FONT}" font-size="66" font-weight="700"
        letter-spacing="-2" fill="${INK}">Dulecy Lead Services</text>
  <text x="80" y="484" font-family="${FONT}" font-size="66" font-weight="700"
        letter-spacing="-2" fill="${RED}">Beyond Business Support</text>
  <text x="80" y="574" font-family="${FONT}" font-size="26" font-weight="500"
        fill="${SLATE}">Your Partner in Business Leadership</text>
  <text x="${W - 80}" y="574" text-anchor="end" font-family="${FONT}"
        font-size="26" font-weight="600" fill="${INK}">www.dulecy.com</text>
</svg>`);
}

async function main() {
  console.log("Fetching Dulecy color logo…");
  const logoRaw = await fetchLogo();
  const logo = await sharp(logoRaw)
    .resize({ width: 400, fit: "inside" })
    .png()
    .toBuffer();
  const { height: logoH } = await sharp(logo).metadata();

  const base = sharp(buildSvg()).png();
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
