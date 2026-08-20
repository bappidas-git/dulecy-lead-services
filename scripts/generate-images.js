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
    name: 'hero-home-v6',
    url: 'https://res.cloudinary.com/dzokcuzo/image/upload/v1786720393/iStock-1224717790.jpg',
    // The client master, 5000x1900 (2.63:1), shipped **whole**. No `crop`, and
    // none should ever be added here: the hero draws the entire frame at a
    // stated CSS width and lets the section clip it, so the framing is a
    // render-time decision made per viewport, not something baked into the
    // file.
    //
    // **These fractions are what the hero's geometry is written around** —
    // measured off the file itself (skin-tone mask, 500x190 sample), and every
    // placement number in HeroSection.module.css is derived from them rather
    // than tuned by eye:
    //
    //   0-16%        blown-out white window (mean luminance 0.98)
    //   18-56%       the near person's dark suit shoulder and sleeve (0.23-0.40)
    //   56.1-81.1%   the joined hands, skin centroid at 68.0% x 55.2%
    //                (vertically 21.9-86.3% of the frame)
    //   81.1-100%    the far person's dark sleeve entering from the right
    //
    // The hero pins the frame past its own right edge by 11% of the frame's
    // width, which puts the hands' left edge at `100% - 0.329 x --bg-w` of the
    // hero (just past the headline's last line) and leaves 8% of frame between
    // their right edge and the screen, so the sleeve runs off the page and the
    // clasp never can. The left 16% is what the mask's left feather is free to
    // spend, being white ramping into white. Re-cutting the file moves all four
    // of those boundaries and every one of those numbers with them — re-measure
    // before changing this source.
    //
    // 2880 rather than the global 1920, still one width. It covers the widest
    // draw (`--bg-w` caps at 1900 CSS px) with room to spare on a 2x display,
    // and the photo's shallow depth of field keeps it small — 2.63:1 means the
    // 2880w variant is only 1094px tall.
    widths: [2880],
    note:
      'Home hero backdrop — two people shaking hands, framed at forearm level ' +
      'so neither head is in shot, against a blown-out white window. Drawn as ' +
      'a plain <img> at a stated width (not a <picture>, not a background), ' +
      'whole and uncropped, pinned past the hero\'s right edge so the far ' +
      'sleeve runs off the page and the clasp lands beside the headline; its ' +
      'other three edges are feathered to nothing on a power curve so the ' +
      'frame dissolves into the page instead of ending on a line. Under a ' +
      'white overlay that runs left to right so the copy reads on paper and ' +
      'the clasp on clear photo. See HeroSection.module.css. Restores the ' +
      '5000x1900 master that shipped as `hero-home-v4` and supersedes ' +
      '`hero-home-v5`, the 3840x2160 frame; that basename is retired rather ' +
      'than reused because `/images/**` answers `immutable` (see ' +
      'public/.htaccess), exactly as `hero-home` was retired for ' +
      '`hero-home-v2`. Deliberate departure from `mockup/index.html`, which ' +
      'uses an architectural shot here.',
  },
  {
    name: 'hero-expertise',
    url: 'https://res.cloudinary.com/dzokcuzo/image/upload/v1786720389/iStock1559948366-mirrored.jpg',
    // The client-supplied master is 2211x1356 (1.63:1) and ships **whole**. No
    // `crop`, and none should ever be added here: since `[2.28.0]` the hero
    // draws the entire frame at every width — `max-width`/`max-height` on an
    // intrinsically-sized <img> — and lets the section decide what of it is
    // seen, so the framing is a render-time decision made per viewport rather
    // than something baked into the file.
    //
    // **These fractions are what the hero's overlay is written around**, and
    // they are why the composition needed no re-framing in the first place:
    //
    //   0-35%      the sitter's white shirt and the defocused window (bright,
    //              the left edge column running a mean 160/255)
    //   35-48%     the floating candidate/record cards over dark background
    //   48-100%    the laptop, near-black — the reason the white over the copy
    //              cannot go below 0.85 and hold the 11px red eyebrow at 4.5:1
    //   bottom 15% the white desk (mean 202/255), which is what the frame's
    //              bottom feather has to cross
    //
    // Re-cutting the file moves all four and invalidates the numbers in
    // `Expertise/sections/HeroSection.module.css` — re-measure before changing
    // this source.
    note:
      'Expertise hero backdrop — a person typing at a laptop under floating ' +
      'candidate/record cards. Drawn WHOLE and uncropped at every width, ' +
      'pinned to the top-right of the hero at the largest size that fits ' +
      'inside it, with its left and bottom edges feathered to nothing; under ' +
      'white that holds only where the copy is (a band from `--copy-top` down ' +
      'below 920px, a flat .85 shelf-and-plunge above it) and lets go ' +
      'everywhere else — see Expertise/sections/HeroSection.module.css. ' +
      'Deliberate departure from `mockup/expertise.html`, whose hero is ' +
      'type-only.',
  },
  {
    name: 'about-band',
    id: 'photo-1522071820081-009f0129c71c',
    note: 'About dark intersection band (opacity .38)',
  },
  {
    name: 'hero-industries-v2',
    url: 'https://res.cloudinary.com/dzokcuzo/image/upload/v1786720389/iStock-2272021169.jpg',
    // The client-supplied master is 2370x1264 (1.875:1) and ships **whole**.
    // No `crop`, and none should ever be added here: since `[2.29.0]` the hero
    // draws the entire frame at every width — `max-width`/`max-height` on an
    // intrinsically-sized <img> — and lets the section decide what of it is
    // seen, so the framing is a render-time decision made per viewport rather
    // than something baked into the file.
    //
    // **These fractions are what the hero's overlay is written around**, and
    // they are why the composition needed no re-framing in the first place —
    // it is mirrored from the home hero's, with the subject entering from the
    // right, which is the end the white lets go of:
    //
    //   column deciles  167 / 161 / 156 / 150 / 140 / 119 / 92 / 52 / 66 / 43
    //                   — defocused bright office on the left falling away to
    //                     the dark suit cuff and the glowing KPI ring
    //   left 16%        mean 165/255 (174 over the first 4%) — an 81-to-90
    //                   level step against a #fff section, which is what the
    //                   frame's left feather has to cross
    //   bottom 18%      mean 123/255 — a 131-level step, two and a half times
    //                   the expertise hero's, and the reason this frame's
    //                   bottom ramp is max(80px, 20%) rather than that
    //                   section's max(64px, 18%)
    //   top 6.8%        mean 60/255 (33 across the right quarter) — no edge
    //                   treatment (it is the top of the page), but it is what
    //                   the translucent header composites over
    //   darkest pixel   10/255 — the worst case the white over the copy is
    //                   priced against
    //
    // Re-cutting the file moves all of those and invalidates the numbers in
    // `Industries/sections/HeroSection.module.css` — re-measure before
    // changing this source. At 1920w the variant is 1920x1024, wider and
    // taller than any hero draws it, so no render upscales it.
    note:
      'Who We Serve hero backdrop — a hand in a dark suit pointing at a ' +
      'glowing KPI dashboard ring. Drawn WHOLE and uncropped at every width, ' +
      'pinned to the top-right of the hero at the largest size that fits ' +
      'inside it, with its left and bottom edges feathered to nothing; under ' +
      'white that holds only where the copy is (a band from `--copy-top` ' +
      'down below 920px, a flat .75 shelf-and-plunge above it) and lets go ' +
      'everywhere else — see Industries/sections/HeroSection.module.css. ' +
      'Deliberate departure from `mockup/industries.html`, which tints its ' +
      'photo evenly and fades it out by 75% of the width. Supersedes the ' +
      'Unsplash photo-1449824913935-59a10b8d2000 that shipped as ' +
      '`hero-industries`; that basename is retired rather than reused ' +
      'because `/images/**` answers `immutable` (see public/.htaccess), ' +
      'exactly as `hero-home` was retired for `hero-home-v2`.',
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
