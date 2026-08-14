/* ============================================
   generate-images.js — first-party page imagery
   --------------------------------------------
   Downloads the three page backdrops once and writes optimized,
   self-hosted variants into `public/images/`, plus the icons8 glyphs the
   mockup uses into `public/images/icons/`.

   Run:  npm run generate:images
   (build-time only — uses the existing `sharp` dev dependency, adds no
   runtime dependency)

   Photos: each source is fetched at w=2400 (or verbatim, for a `url` source)
   and emitted as
     <name>-1920.webp / <name>-960.webp   → what browsers actually load
     <name>.jpg                            → universal fallback (1920w)
   Quality is tuned to keep every large variant under ~250 KB while
   staying visually identical to the mockup — every photo sits under a white
   scrim that blends away most compression noise, so they are forgiving.

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

/** The three page backdrops, keyed by the local basename they get.
 *
 *  A photo declares EITHER `id` (an Unsplash photo id, fetched at w=2400)
 *  OR `url` (any absolute URL, fetched verbatim). `crop` is an optional
 *  sharp `extract` region applied to the source before resizing. */
const PHOTOS = [
  {
    name: 'hero-home-v2',
    url: 'https://res.cloudinary.com/dzokcuzo/image/upload/v1786720393/iStock-1224717790.jpg',
    // The client-supplied master is a 5000x1900 panorama (2.63:1) — far wider
    // than any box the hero draws it into, so shipping it whole would mean the
    // 1920w variant is only 730px tall and every desktop render upscales it
    // ~2x. This extract takes the 2850x1900 window at x 38-95%, which is
    // exactly 3:2 — the same aspect the previous backdrop shipped at, so every
    // crop calculation annotated in `HeroSection.module.css` stays true — and
    // frames the whole clasp with the near suit on the left and the far sleeve
    // on the right. The blank left 38% of the master is dead white that the
    // scrim would have covered anyway.
    crop: { left: 1900, top: 0, width: 2850, height: 1900 },
    note:
      'Home hero backdrop — two people shaking hands, framed at forearm level ' +
      'so neither head is in shot (opacity .92 under a left-heavy scrim that ' +
      'clears toward the right; below 920px it re-crops to a band — see ' +
      'HeroSection.module.css). Supersedes the Unsplash ' +
      'photo-1521791136064-7986c2920216 that shipped as `hero-home`; that ' +
      'basename is retired rather than reused because `/images/**` answers ' +
      '`immutable` (see public/.htaccess). Deliberate departure from ' +
      '`mockup/index.html`, which uses an architectural shot here.',
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
// the 250 KB budget with margin. Every photo renders under a white scrim that
// caps its contribution well below full strength (the home hero peaks around
// 57%, the others lower), so the quality drop is not perceptible; verified by
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
  const url =
    photo.url ||
    `https://images.unsplash.com/${photo.id}?q=80&w=2400&auto=format&fit=crop`;
  process.stdout.write(`\n${photo.name}  ← ${photo.id || photo.url}\n`);

  const downloaded = await fetchBuffer(url);
  const downloadedMeta = await sharp(downloaded).metadata();
  process.stdout.write(
    `  source        ${downloadedMeta.width}×${downloadedMeta.height}  ${kb(downloaded.length)}\n`,
  );

  // `crop` re-frames the master once, up front, so both WebP widths and the
  // JPEG fallback are cut from the identical region.
  const source = photo.crop
    ? await sharp(downloaded).extract(photo.crop).toBuffer()
    : downloaded;
  if (photo.crop) {
    const { width, height } = await sharp(source).metadata();
    process.stdout.write(
      `  cropped       ${width}×${height}  (left ${photo.crop.left}, top ${photo.crop.top})\n`,
    );
  }

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
