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

/** The four page backdrops, keyed by the local basename they get.
 *
 *  A photo declares EITHER `id` (an Unsplash photo id, fetched at w=2400)
 *  OR `url` (any absolute URL, fetched verbatim). `crop` is an optional
 *  sharp `extract` region applied to the source before resizing, and
 *  `widths` overrides the global `WIDTHS` ladder for that one photo. */
const PHOTOS = [
  {
    name: 'hero-home-v4',
    url: 'https://res.cloudinary.com/dzokcuzo/image/upload/v1786720393/iStock-1224717790.jpg',
    // The client master, 5000x1900 (2.63:1), shipped **whole**. No `crop`, and
    // that absence is the point of this variant: the hero draws it
    // `object-fit: contain`, so every pixel of the purchased frame is on the
    // page at every viewport and nothing is left to a crop.
    //
    // `hero-home-v3` trimmed 950px off the right to drag the clasp from 68.4%
    // of the file to 84.5%, which is what let a `cover` backdrop clear the
    // copy. `contain` does not crop, so that lever is gone with it: the clasp
    // is back at its native 68.4% and the scrim's two-step fade — not the
    // file — is what keeps it clear of the headline. See the annotated `.bg` /
    // `.scrim` blocks in HeroSection.module.css.
    //
    // 2880 rather than the global 1920, still one width. `contain` draws this
    // at exactly the hero's WIDTH (the box never reaches 2.63:1 below a
    // ~2685px viewport), so 2880 covers a 1920px viewport at 1.5x DPR and any
    // phone at 3x, and the photo is soft enough that it still encodes to
    // ~50 KB.
    widths: [2880],
    note:
      'Home hero backdrop — two people shaking hands, framed at forearm level ' +
      'so neither head is in shot. The WHOLE frame at every width: ' +
      '`object-fit: contain` across the full width of the hero, sitting above ' +
      'the copy as a clear banner below 920px and behind it — bottom-anchored ' +
      'just above the pillars rule, under a two-step left-to-right white ' +
      'fade — from 920px up. See HeroSection.module.css. Supersedes ' +
      '`hero-home-v3`, the 4050x1900 right-trim the `cover` treatment needed; ' +
      'that basename is retired rather than reused because `/images/**` ' +
      'answers `immutable` (see public/.htaccess), exactly as `hero-home` was ' +
      'retired for `hero-home-v2`. Deliberate departure from ' +
      '`mockup/index.html`, which uses an architectural shot here.',
  },
  {
    name: 'hero-expertise',
    url: 'https://res.cloudinary.com/dzokcuzo/image/upload/v1786720389/iStock1559948366-mirrored.jpg',
    // The client-supplied master is 2211x1356 (1.63:1) and needs no re-framing:
    // the subject already sits left with the laptop and the floating candidate
    // cards centre-right, which is the composition the hero's left-heavy scrim
    // is written against. Shipped whole, so the 1920w variant is 1920x1178 and
    // never upscales on a desktop hero.
    note:
      'Expertise hero backdrop — a person typing at a laptop under floating ' +
      'candidate/record cards (opacity .9 under a left-heavy scrim that clears ' +
      'toward the right, mirroring the home hero; below 920px it re-crops to a ' +
      'band — see Expertise/sections/HeroSection.module.css). Deliberate ' +
      'departure from `mockup/expertise.html`, whose hero is type-only.',
  },
  {
    name: 'about-band',
    id: 'photo-1522071820081-009f0129c71c',
    note: 'About dark intersection band (opacity .38)',
  },
  {
    name: 'hero-industries-v2',
    url: 'https://res.cloudinary.com/dzokcuzo/image/upload/v1786720389/iStock-2272021169.jpg',
    // The client-supplied master is 2370x1264 (1.875:1) and ships uncropped.
    // The composition is already the one a left-heavy scrim is written
    // against, and mirrored from the other two: the hand and its dark suit
    // cuff enter from the RIGHT, the glowing KPI ring sits centre-left, and
    // the left ~15% is defocused office that the near-solid white column
    // covers anyway — there is nothing to re-frame. At 1920w the variant is
    // 1920x1024, taller than any desktop hero box draws it, so no render
    // upscales it.
    note:
      'Who We Serve hero backdrop — a hand in a dark suit pointing at a ' +
      'glowing KPI dashboard ring (opacity .9 under a left-heavy scrim that ' +
      'clears toward the right, matching the home and expertise heroes; ' +
      'below 920px it re-crops to a band — see ' +
      'Industries/sections/HeroSection.module.css). Supersedes the Unsplash ' +
      'photo-1449824913935-59a10b8d2000 that shipped as `hero-industries`; ' +
      'that basename is retired rather than reused because `/images/**` ' +
      'answers `immutable` (see public/.htaccess), exactly as `hero-home` ' +
      'was retired for `hero-home-v2`.',
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
// q74/effort6 keeps the heaviest photo at ~107 KB (about-band) — inside the
// 250 KB budget with a wide margin now that the 229 KB `hero-industries`
// landscape has been retired for a 51 KB replacement. The other three still
// render under a white scrim that caps their contribution well below full
// strength, so the quality drop is not perceptible there; verified by
// before/after screenshot diff.
//
// The home hero no longer does — it reaches full strength right of the fade —
// so it was re-checked directly against the source: over the region the hands
// occupy, q74 deviates by a mean of 1.77/255 (max 43, at the sleeve edge)
// against q82's 1.52 (max 31) for 12 KB more. Under 1% mean on a subject that
// is then composited over white and downscaled ~1.5x from the 2880w variant —
// not worth a re-encode, which `/images/**` being `immutable` would make a
// rename anyway.
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

  const widths = photo.widths || WIDTHS;

  for (const width of widths) {
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
    .resize({ width: widths[0], withoutEnlargement: true })
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

// Optional `name` arguments restrict the run to those photos (and skip the
// icons), e.g. `node scripts/generate-images.js hero-expertise`. Adding one
// backdrop should not re-download and re-encode the other three, whose bytes
// are already committed — a bare run still rebuilds everything.
const only = process.argv.slice(2);
const selected = only.length
  ? PHOTOS.filter((p) => only.includes(p.name))
  : PHOTOS;

(async () => {
  if (only.length && selected.length !== only.length) {
    const known = PHOTOS.map((p) => p.name).join(', ');
    throw new Error(`unknown photo name. Known: ${known}`);
  }

  ensureDir(IMAGES_DIR);
  ensureDir(ICONS_DIR);

  process.stdout.write('Photos → public/images/');
  for (const photo of selected) await buildPhoto(photo);

  if (only.length) {
    process.stdout.write('\nIcons skipped (photo filter given).\n');
    process.stdout.write('\nDone.\n');
    return;
  }

  process.stdout.write('\nIcons → public/images/icons/\n');
  for (const icon of ICONS) await buildIcon(icon);

  process.stdout.write('\nDone.\n');
})().catch((err) => {
  console.error('\ngenerate-images failed:', err.message);
  process.exit(1);
});
