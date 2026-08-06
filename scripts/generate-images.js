/* ============================================
   generate-images.js — first-party page imagery
   --------------------------------------------
   Downloads the three mockup backdrops once and writes optimized,
   self-hosted variants into `public/images/`, plus the icons8 glyphs the
   mockup uses into `public/images/icons/`.

   Run:  npm run generate:images
   (build-time only — uses the existing `sharp` dev dependency, adds no
   runtime dependency)

   Photos: each source is fetched at w=2400 and emitted as
     <name>-1920.webp / <name>-960.webp   → what browsers actually load
     <name>.jpg                            → universal fallback (1920w)
   Quality is tuned to keep every large variant under ~250 KB while
   staying visually identical to the mockup — the photos sit under heavy
   scrims at 0.38–0.65 opacity, so they are extremely forgiving.

   Icons: the mockup's icons8 PNGs at 100px, downloaded verbatim (byte
   copies) so the rendered glyph is pixel-identical. Two red variants are
   in use: D5192E (on light) and F0293E (footer, on ink).
   ============================================ */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const ICONS_DIR = path.join(IMAGES_DIR, 'icons');

// ---------------------------------------------
// Sources
// ---------------------------------------------

/** The three Unsplash backdrops, keyed by the local basename they get. */
const PHOTOS = [
  {
    name: 'hero-home',
    id: 'photo-1521791136064-7986c2920216',
    note:
      'Home hero backdrop — two people shaking hands, framed at forearm level ' +
      'so neither head is in shot (opacity .5, object-position center 30%; ' +
      'phones re-crop it to a band — see HeroSection.module.css). ' +
      'Deliberate departure from `mockup/index.html`, which uses the ' +
      'architectural photo-1486406146926-c627a92ad1ab here.',
  },
  {
    name: 'about-band',
    id: 'photo-1522071820081-009f0129c71c',
    note: 'About dark intersection band (opacity .38)',
  },
  {
    name: 'hero-industries',
    id: 'photo-1449824913935-59a10b8d2000',
    note: 'Who We Serve hero backdrop (opacity .65, object-position center 40%)',
  },
];

/** icons8 glyphs, `<slug>` → downloaded as `<color>-<slug>.png`. */
const ICONS = [
  { slug: 'phone', color: 'D5192E' },
  { slug: 'new-post', color: 'D5192E' },
  { slug: 'phone', color: 'F0293E' },
  { slug: 'new-post', color: 'F0293E' },
  { slug: 'pill', color: 'D5192E' },
  { slug: 'hospital-3', color: 'D5192E' },
  { slug: 'company', color: 'D5192E' },
  { slug: 'commercial', color: 'D5192E' },
  { slug: 'graduation-cap', color: 'D5192E' },
  { slug: 'rocket', color: 'D5192E' },
  { slug: 'briefcase', color: 'D5192E' },
];

const WIDTHS = [1920, 960];
// q74/effort6 keeps the heaviest photo (hero-industries) at ~229 KB — inside
// the 250 KB budget with margin. Every photo renders under a scrim at
// 0.38–0.65 opacity, so the quality drop is not perceptible; verified by
// before/after screenshot diff.
const WEBP_QUALITY = 74;
const WEBP_EFFORT = 6;
const JPEG_QUALITY = 74;

// ---------------------------------------------
// Helpers
// ---------------------------------------------

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status} ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// ---------------------------------------------
// Photos
// ---------------------------------------------

async function buildPhoto(photo) {
  const url = `https://images.unsplash.com/${photo.id}?q=80&w=2400&auto=format&fit=crop`;
  process.stdout.write(`\n${photo.name}  ← ${photo.id}\n`);

  const source = await fetchBuffer(url);
  const meta = await sharp(source).metadata();
  process.stdout.write(`  source        ${meta.width}×${meta.height}  ${kb(source.length)}\n`);

  for (const width of WIDTHS) {
    const out = path.join(IMAGES_DIR, `${photo.name}-${width}.webp`);
    const buf = await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
      .toBuffer();
    fs.writeFileSync(out, buf);
    process.stdout.write(`  ${path.basename(out).padEnd(26)} ${kb(buf.length)}\n`);
  }

  // JPEG fallback at the large width, for browsers without WebP.
  const jpegOut = path.join(IMAGES_DIR, `${photo.name}.jpg`);
  const jpegBuf = await sharp(source)
    .resize({ width: WIDTHS[0], withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();
  fs.writeFileSync(jpegOut, jpegBuf);
  process.stdout.write(`  ${path.basename(jpegOut).padEnd(26)} ${kb(jpegBuf.length)}\n`);
}

// ---------------------------------------------
// Icons
// ---------------------------------------------

async function buildIcon(icon) {
  const url = `https://img.icons8.com/ios-filled/100/${icon.color}/${icon.slug}.png`;
  const out = path.join(ICONS_DIR, `${icon.slug}-${icon.color.toLowerCase()}.png`);
  const buf = await fetchBuffer(url);
  // Byte-for-byte: re-encoding a 100px flat-color glyph risks visible edge
  // differences, and these files are already ~1–2 KB.
  fs.writeFileSync(out, buf);
  process.stdout.write(`  ${path.basename(out).padEnd(30)} ${kb(buf.length)}\n`);
}

// ---------------------------------------------
// Main
// ---------------------------------------------

(async () => {
  ensureDir(IMAGES_DIR);
  ensureDir(ICONS_DIR);

  process.stdout.write('Photos → public/images/');
  for (const photo of PHOTOS) await buildPhoto(photo);

  process.stdout.write('\nIcons → public/images/icons/\n');
  for (const icon of ICONS) await buildIcon(icon);

  process.stdout.write('\nDone.\n');
})().catch((err) => {
  console.error('\ngenerate-images failed:', err.message);
  process.exit(1);
});
