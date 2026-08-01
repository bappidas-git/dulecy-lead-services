/* ============================================
   generate-og.js — Social share (Open Graph) image
   --------------------------------------------
   Builds public/og-image.png (1200×630) — the image shown when the site is
   shared on Facebook, LinkedIn, WhatsApp, Slack, X, Google Discover, etc.

   Composition: deep-navy (#0F2438) background, the white Nilachal logo top-left,
   a green accent rule, the headline "Building the Future of Northeast India",
   and the tagline + site URL along the bottom. Text is drawn via an SVG layer;
   the logo is composited on top.

   Usage:  node scripts/generate-og.js
   Requires dev dep: sharp
   ============================================ */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// White logo (dark backgrounds) — keep in sync with src/data/siteConfig.js.
const LOGO_WHITE_URL =
  "https://res.cloudinary.com/dn9gyaiik/image/upload/v1784965863/nilachal-logo-white_hus13s.png";

const OUT = path.resolve(__dirname, "..", "public", "og-image.png");

const W = 1200;
const H = 630;
const NAVY = "#0F2438";
const GREEN = "#1E7B45";
const FONT = "Liberation Sans, DejaVu Sans, Arial, sans-serif";

async function fetchLogo() {
  const res = await fetch(LOGO_WHITE_URL);
  if (!res.ok) throw new Error(`Failed to fetch white logo: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function buildSvg() {
  return Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${NAVY}" />
  <!-- green accent rule above the headline -->
  <rect x="82" y="322" width="62" height="6" rx="3" fill="${GREEN}" />
  <text x="80" y="406" font-family="${FONT}" font-size="70" font-weight="700"
        letter-spacing="-2" fill="#FFFFFF">Building the Future</text>
  <text x="80" y="484" font-family="${FONT}" font-size="70" font-weight="700"
        letter-spacing="-2" fill="#FFFFFF">of Northeast India</text>
  <text x="80" y="574" font-family="${FONT}" font-size="26" font-weight="500"
        fill="#9DB8CC">Building Tomorrow, Together.</text>
  <text x="${W - 80}" y="574" text-anchor="end" font-family="${FONT}"
        font-size="26" font-weight="600" fill="#3FA46E">www.nilachalinfracon.com</text>
</svg>`);
}

async function main() {
  console.log("Fetching white logo…");
  const logoRaw = await fetchLogo();
  const logo = await sharp(logoRaw)
    .resize({ width: 330, fit: "inside" })
    .png()
    .toBuffer();
  const { height: logoH } = await sharp(logo).metadata();

  const base = sharp(buildSvg()).png();
  const composed = await base
    .composite([{ input: logo, left: 80, top: Math.round(150 - logoH / 2) + 10 }])
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
