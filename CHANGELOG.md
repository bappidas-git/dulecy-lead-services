# Changelog

All notable changes to the **Dulcey Lead Services** website. The site was built
through the ordered prompt series in [`prompts/`](prompts/README.md) — one
prompt per branch/PR — and the entries below summarise each phase under the
`2.0.0` release.

> **History prior to `2.0.0` lives in git.** This repository previously held an
> unrelated one-page site for a different company. Its changelog narrative has
> been removed rather than carried forward; `git log` (and the merged PRs) keep
> the full record if you need it.

The format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [2.23.0] — 2026-08-20 — Home hero: the desktop photograph fills the section again

The eight releases before this one refined a *placed frame* on desktop — a
photograph drawn at a stated width, bled past the hero's right edge, and
feathered on three sides so its edges dissolved rather than cut. This release
retires that machinery **at `min-width: 920px` only** and puts the desktop hero
back on the framing it shipped with earlier in the rebuild: the photograph
covers the section, and one horizontal overlay carries the copy.

**Nothing below 920px changes.** The sub-920px stack — the placed frame at
`--bg-w`, its smootherstep-at-twentieths feather, and the veil-plus-fade
overlay — is byte-for-byte what it was, and was re-verified at 375px.

### Changed

- **The photograph covers the desktop hero** — `object-fit: cover` at
  `object-position: 68% 50%` on an `inset: 0` box, replacing the `--bg-w` /
  `--bg-right` / `--bg-top` placement and the `--feather-x` / `--feather-y`
  masks (all four are switched off from 920px up; all four still run below it).
  It stays an `<img>` rather than becoming a CSS background, because the
  element is the LCP element on `/` and only an `<img>` carries
  `fetchpriority="high"`.

  The file is 2.63:1 and the desktop hero runs about 1.9:1, so `cover` is
  height-limited at every real desktop viewport and only the horizontal
  position carries the composition. **68% is measured off the file, not
  chosen**: the joined hands span 56.1%-81.1% of its width with the skin
  centroid at 68.0%, so a percentage `object-position` pins the clasp at 68%
  of the hero — just right of where "impact" ends — at every width. Measured
  on the shipped WebP, the hands land at:

  | viewport | 920     | 1024     | 1440     | 1906      |
  | -------- | ------- | -------- | -------- | --------- |
  | hands x  | 329-937 | 395-1014 | 658-1318 | 972-1638  |

  Move the subject by re-cutting the file, not by re-tuning this number.

- **The desktop overlay is one layer again — a shelf and a plunge.** The
  `.scrim::after` shield and its `--shield-mask` are gone (they existed to hold
  white over a placed frame that stood directly behind the headline; with the
  photograph on `cover` the horizontal fade carries the whole job), and so is
  `--accent-edge`, which only the shield read.

- **The shelf is three points thinner than the framing it restores** —
  `0.94 / 0.91 / 0.86` → **`0.91 / 0.88 / 0.83`**, with the plunge's landing
  at `0.10` → `0.08`. The shelf is where nearly all of the photograph lives
  (the clasp is pinned at 68% and `--copy-edge` runs 68-73%, so the subject is
  mostly under it), so three points is not the nothing it sounds like: the
  share of the photo's own pixel surviving under the shelf goes from about 14%
  to about 17%.

- **`--copy-edge` is back to `calc(50vw + 320px)`, from `+ 275px`.** The
  `+ 275px` value was fitted to the headline alone, which was correct while the
  placed frame kept the pillars row clear of the photograph. With the
  photograph covering the section that row is over it again, and it runs wider
  than the headline — so the shelf is fitted to the row, as it was before.

### Measured

Sampled over the real composite (the shipped WebP drawn through the same
`cover` mapping, multiplied by the fade's own alpha at each x), worst pixel in
each element's box:

| element                         | 920      | 1024     | 1440     | 1906     | floor |
| ------------------------------- | -------- | -------- | -------- | -------- | ----- |
| accent "impact" vs `#E8293E`    | 3.28     | 3.26     | 3.26     | 3.27     | 3:1   |
| headline, ink                   | 14.8-15.4| 14.7-15.3| 14.7-15.3| 14.7-15.2| 4.5:1 |
| lede, `--grey-2`                | 6.60     | 6.56     | 6.65     | 6.54     | 4.5:1 |
| pillar labels, ink              | 16.0-16.6| 15.2-19.5| 10.3-16.4| 7.2-19.7 | 4.5:1 |

**The accent is still what prices the shelf**, and 0.83 is the floor: it is
the one run of copy in the section that is colour-bound rather than ink-black,
it measures 3.26-3.28:1 across 920-1906px, and each point off the shelf costs
about 0.065. Do not thin it further without re-measuring the accent that way.

### Known, and accepted

- **The pillar numbers sit on photograph again, and two of the four fall below
  4.5:1.** They are 14px `700` `--red` (`#D5192E`) — normal-size text, so the
  4.5:1 threshold applies — and that colour has only 5.24:1 to give *on pure
  white*. Over the composite they read **4.12-5.24:1** across 920-1906px. This
  is a property of the framing this release restores rather than of the
  thinning: at the `0.86` shelf the same row reads 4.16-5.24:1 and still fails
  the same two. The placed frame the release before this one used kept that row
  off the photograph entirely, which is what bought it pure white. Lifting the
  row over the 4.5:1 line means either a second layer under it or a larger /
  darker numeral — neither is in the scope of this change.

- **The desktop fade's ramps are linear**, unlike the smootherstep-at-twentieths
  curves `[2.20.0]` rebuilt everywhere else. The stops at `--copy-edge` and at
  `+8%` are slope discontinuities, so a soft vertical band is visible at each
  under a close look. It is the shape the desktop hero is specified to have,
  and the plunge is steep enough that easing it would visibly move where the
  white lets go rather than only how.

- **The "DLS" watermark is not restored.** `siteConfig.logoMark` still has no
  surface in `src/` — see `CLAUDE.md`. Only the photograph and the overlay
  moved here.

## [2.22.0] — 2026-08-20 — Home hero: the photograph, moved off the accent

The four releases before this one were all about the *overlay* — its lines,
its rectangles, how much of the photograph it was allowed to keep. This one
moves the photograph itself, and it is the only change: one number, on the
desktop rule alone.

**At 11% bleed the clasped hands had converged onto "impact".** The frame's
width tracks the viewport (`92vw`) while the copy caps at a 1280px container,
so the hands' left edge and the headline's right edge do not stay parallel —
they close as the viewport narrows. Measured as the gap between the accent
word's right edge and where the hands begin, 1440px sat at **22px**: close
enough that the clasp read as pressed against the word rather than placed
beside it, and below about 1300px it crossed over and started under the copy.

### Changed

- **`--bg-right` is `-13.5%` of `--bg-w`, from `-11%`** — desktop only
  (`min-width: 920px`). Nothing below the nav breakpoint moves: the frame
  still bleeds 14% there, still pins to the top of the section, and the
  sub-920px overlay stack is untouched. Gap from the accent to the hands, at
  11% against 13.5%:

  | viewport | 920 | 1024 | 1280 | 1440 | 1920 | 2560 |
  | -------- | --- | ---- | ---- | ---- | ---- | ---- |
  | `-11%`   | −81 | −56  | −15  | +22  | +116 | +392 |
  | `-13.5%` | −56 | −31  | +14  | +55  | +161 | +440 |

  The crossover where the hands stop clearing the headline moves from about
  1300px to about 1235px. Below it they still start under the tail of the
  overlay, which stays the correct failure — a narrow desktop has no strip of
  hero the copy does not want.

- **What it spends is the right margin, and it stays sufficient.** The hero's
  right edge now falls at 86.5% of the frame against hands that end at 81.1%,
  so 5.4% of frame is left for the far sleeve to run off on: **53px** where
  `--bg-w` sits on its 980px floor (920-1065px), 72px at 1440px, 96px at
  1920px, 103px at 2560px. The clasp is 245px wide at that floor. 920px is the
  column that runs out first, not the widest one — re-measure there before
  raising the bleed again.

### Unchanged, and verified so

- **Contrast.** The accent on "impact" — the binding element, sampled across
  its whole box against its brightest fill `#E8293E` — reads **3.21-3.28:1**
  from 920px to 2560px against a 3:1 floor, within 0.03 of the release before
  it at every width. The lede improves slightly (4.74 → 4.99:1 at 2560px, its
  tightest width) because a little more of the frame's bottom feather moves
  out from under it.
- **The blending, which is already at its floor.** Measured against a flat
  near-black stand-in for the photograph — which isolates what the gradients
  contribute, since any curvature left is the mask's and never image detail —
  the worst 10px window in the whole desktop composite reads **7-9 levels** at
  920-2560px, and a translation cannot change it. Rebuilding `--feather-y` at
  fortieths and at eightieths instead of twentieths was measured and moves
  that to 9 and 8: the residual is the curve's own curvature quantised to
  8-bit output, not stop spacing. There is nothing left for more stops to buy,
  and the note now says so in the stylesheet so it is not retried.

## [2.21.0] — 2026-08-20 — Home hero: the last rectangle in the overlay

`[2.20.0]` took the *lines* out of the hero by fixing every ramp's curve and
sampling. What it left behind was a *shape*. Behind the headline's first two
lines, from about 1440px up, the photograph carried a slab of extra strength
with a straight top edge and a straight right edge — a rectangle, soft-edged
but unmistakably rectangular, sitting inside an image that is otherwise all
dissolve.

**The cause was two independent ramps crossing the same band of hero.**
`.bg`'s top feather brings the photograph in over the top 34% of the frame;
`.scrim::after`'s mask brought the white in over 32%-42% of the *hero*. Those
are different coordinate systems, and they drift apart as the viewport grows:
the frame's top edge falls at 31% of the hero at 1024px but only 17% at
2560px, while the shield's ramp stayed at 32%. Wherever the photograph arrived
before the white did, the difference was visible as extra photograph — bounded
above by the frame's feather, below by the shield, and on the right by
`--copy-edge`. Three straight sides.

Measured as the peak composite photo weight in the copy column against the
level immediately below it, the slab ran **0.005 at 1024px, 0.068 at 1440px,
0.298 at 1920px and 0.345 at 2560px** — invisible on a laptop, plain on a
desktop, which is why it survived two releases of tuning.

### Changed

- **The shield's mask has no top ramp.** `--shield-mask` on `.scrim::after`
  is opaque from the top of the hero to 60%, then eased out to 78% as before.
  The copy column is therefore exactly `0.15 x mask` from the frame's top
  edge down — one monotone dissolve carrying nothing but the frame's own
  feather, at every width and every viewport height rather than at the ones
  that happened to get measured. Above the frame's top edge the shield paints
  white on white and costs nothing. The bottom ramp is unchanged and stays
  asymmetric: it is fitted to the lede, which is normal-size `--grey-2` on a
  4.5:1 floor.
- **`.bg`'s top feather is capped in pixels** — `--top-ramp: min(160px, 34%)`,
  replacing the flat 34%. What a ramp has to hide is a rate of change per
  pixel, not a share of the picture, so a ramp stated as a fraction of a frame
  that itself grows with the viewport gets longer than it needs to be exactly
  where the frame is biggest, and spends the surplus erasing photograph. The
  cap holds the seam constant instead: worst-band mask curvature over a 10px
  window reads **4.9 / 4.9 / 4.3 / 4.3 / 4.3** at 920 / 1024 / 1440 / 1920 /
  2560px, against 4.9 / 4.9 / 3.7 / 3.0 / 2.6 before — the same worst case,
  spread evenly, and still inside the 3.2-8.5 the edges have measured since
  `[2.20.0]`. `min()` and not a bare `160px` because the frame sits on its
  980px floor below about 1065px, where 34% is only 127px and already the
  shorter of the two: the cap may never lengthen the ramp.

### Result

Removing the slab did not cost photograph, because what the slab showed sat
*under* the copy and the capped feather hands the same area back on the other
side of it, where nothing is over it. Mean photo weight across the band the
slab occupied (33%-100% of the hero wide, 27%-48% tall):

| Viewport | Band, before → after | Right of `--copy-edge`, before → after | Slab |
| -------- | -------------------- | --------------------------------------- | ---- |
| 920px    | 12.1% → 11.7%        | 36.1% → 36.0%                           | none either way |
| 1024px   | 12.9% → 12.6%        | 37.2% → 37.1%                           | none either way |
| 1440px   | 24.0% → 24.0%        | 40.1% → 42.7%                           | 0.068 → **0** |
| 1920px   | 41.4% → **47.4%**    | 41.2% → **54.6%**                       | 0.298 → **0** |
| 2560px   | 45.3% → **54.0%**    | 42.0% → **57.9%**                       | 0.345 → **0** |

Headline contrast improves as a side-effect — **7.8:1 → 14.2:1 at 1920px** and
7.0:1 → 14.9:1 at 2560px, since the slab was the darkest thing under those two
lines. The accent is untouched at **3.25-3.30:1** from 920px to 2560px against
a 3:1 floor, and the lede at 5.2-6.9:1 against 4.5:1. Verified at 920 / 1024 /
1440 / 1920 / 2560px and at a short 1920x640 viewport, where the hero is 40px
shorter and every percentage stop lands somewhere different.

**Nothing below 920px changed.** Both edits are inside the desktop media
query, and the sub-920px stack cannot produce this defect: the frame bleeds
off both sides, its top edge sits under the fixed header, and the overlay
there is a full-width veil plus a full-height fade — no shield, no band, and
no corner of the frame on the page to blend.

## [2.20.0] — 2026-08-20 — Home hero: no seams in the overlay, and less of it

The overlay worked, but you could see how it was built. Two of its edges drew
visible lines across the photograph — one horizontal, along the top of the
frame, and one vertical, down the hero at `--copy-edge` — and the same defect
was present at six more places for the same reason.

**The cause was vertices, not alphas.** A CSS gradient interpolates linearly
between its stops, so a gradient is a piecewise-linear function and every
place its slope changes is a corner. The eye finds corners in a smooth ramp
(Mach banding) far more readily than it finds steepness. Three of them were
stacked here:

- `.bg`'s feather was `t^2.4`, which reaches full strength **still travelling
  at 2.4x**. Where it met the flat middle of the mask — 34% and 68% of the
  frame — the slope dropped to zero in one step. That is the horizontal line
  across the top of the photograph.
- The desktop overlay held a flat 0.50 to `--copy-edge` and then turned
  straight into a 7%-wide plunge, and the shield turned into a 3.5% one. Two
  corners, 66px apart, running the full height of the section. That is the
  vertical line.
- Every ramp was sampled at five or six stops, so each stop was itself a
  slope change worth 4-5 levels regardless of which curve it approximated.

`[2.19.0]`'s note put the frame's top edge at "2.6 levels across any 10px
window". That measurement averaged each row of the ramp before differencing
it, which smooths away exactly the vertex it was meant to find; measuring the
curvature of the composite directly puts the shipped edges at **9.8-31.9
levels**, which matches what is visible on screen.

### Changed

- **Every ramp in the hero is now an eased curve sampled at twentieths.**
  `.bg`'s four mask ramps use `s5(t)^3` (smootherstep cubed), which keeps
  `t^2.4`'s late bias — the part that was right — while arriving at **zero
  slope at both ends**, so neither vertex of a ramp is a corner. The six
  overlay ramps use plain smootherstep. Measured as luminance curvature over a
  10px window against the shipped WebP, the worst edge in the section falls
  from 9.8-31.9 levels to **3.2-8.5** vertically (14.1 at 375px, but that
  peak sits at y=64px, behind the fixed 68px header) and from 6.0-16.8 to
  **1.2-7.8** horizontally, across 375 / 768 / 900 / 920 / 1024 / 1280 / 1440 /
  1920 / 2560px. The alphas are generated, not hand-picked: `s5(t)^3` and
  `s5(t)` at `t = k/20`, `s5` being `6t^5 - 15t^4 + 10t^3`.
- **Each mask is declared once, as a custom property**, and read by both the
  prefixed and the unprefixed `mask-image` (`--feather-y` / `--feather-x` on
  `.bg`, `--shield-mask` on `.scrim::after`). At 38 stops a ramp, two
  hand-maintained copies would drift.
- **The desktop overlay is thinner: base 0.50 → 0.40, shield 0.70 → 0.75.**
  Those move together on purpose — `1 − 0.60 × 0.25` is the same **0.85**
  behind "impact" that `1 − 0.50 × 0.30` produced, so the binding contrast is
  untouched while everything the shield does not cover got lighter. The base's
  plunge is 10% of the hero (from 14%) and the shield's is 5% (from 3.5%);
  both are eased, and across the plunge the pair now leaves the hand with less
  white on it than the cornered version did, not more.
- **The shield's mask band opens at 32% of the hero instead of 25%.** This is
  where most of the extra photograph behind the headline comes from: nothing
  above the accent is colour-bound, so the shield has no work to do there. The
  copy column gains 10% at 1920px and 18% at 2560px. It is flat from 920px
  to 1440px, where the shield's ramp and the frame's own feathers already
  overlap almost exactly and there is nothing left in that band to uncover.
  The band's **bottom ramp stays at 78%** — the lede sits under it at 61%-71%
  of the hero and is 16-19px `--grey-2`, i.e. normal-size text on a **4.5:1**
  floor rather than large text on a 3:1 one. It measures 4.85:1 at 2560px;
  closing that ramp at 72% to match the top takes it to 3.50:1 and fails.
- **The sub-920px veil comes down 0.66 → 0.55 and the fade 0.36 → 0.24**, and
  **`.bg`'s mobile bottom ramp starts at 62% of the frame instead of 68%.**
  Those three move together. The accent word sits at 77%-93% of the frame's
  height at that breakpoint — inside the bottom ramp — so lengthening the ramp
  lightens the mask under the word by more than the thinner veil costs it.
  Thin the veil on its own and 900px, the tightest width, fails first.

### Notes

- **Contrast is level or better everywhere, on the same strict method**
  (each element's whole box against the darkest composite pixel under it).
  The accent holds **3.25-3.31:1** from 920px to 2560px — identical to the
  release before it, by construction — and **improves** below the breakpoint
  to 3.53:1 at 900px, 3.91:1 at 768px and 4.27:1 at 375px, against 3.46 / 3.66
  / 4.16. The ink headline never drops below 8.1:1 and the lede below 4.85:1
  (4.5:1 floor). The pillars row is over bare page white at 5.24:1 at every
  width, unchanged — `--copy-edge` still clears it.
- **How much more photograph you actually see depends on where you look, and
  the copy column is the honest answer for desktop.** The base alpha is the
  weakest of the three desktop levers, because the band where the frame is
  drawn at full mask is very nearly the band the shield covers — so left of
  `--copy-edge` it is the shield's top ramp, not the base, that had room to
  give. Over the hand the gain is 4-5% at every desktop width. Below the
  breakpoint, where the veil is the lever, the copy column gains 14% at 375px
  and 19% at 768-900px and the hand 9-16%.
- **The frame's top and bottom feather LENGTHS are unchanged** (34% / 32% on
  desktop, 20% on mobile) and the left ramp stays at 16%. Only the curve
  across them changed, so nothing about which part of the photograph is drawn
  moved — the fix was to how it dissolves, not to how much of it there is.
  Lengthening the mobile top ramp is actively worse: at 375px a 20% ramp
  finishes at 76px, just past the 68px header that hides it, while a 26% one
  finishes 24px down the visible page and doubles the curvature there.
- **Degradation is unchanged.** Engines without `mask-composite` union the two
  `.bg` ramps; engines without `mask-image` paint the shield unmasked, which
  composites to more white, never less.

## [2.19.0] — 2026-08-20 — Home hero: let the figure through the white, on every device

`[2.18.1]` thinned the desktop shelf to 0.89 → 0.86 → 0.82 and found its
floor there. The hero still read as white paper with a handshake on its right
third, and the reason was not the alpha: it was that a left-to-right fade
cannot uncover this photograph at all. The suited figure the hands belong to
occupies frame width 15.6%-56.1%, which at 1440px runs from 33% of the hero to
69.5% — and the copy runs to 69.5% too. **There is no strip of hero where the
figure is and the copy is not**, so every percent the shelf gave up was given
up under a glyph, and the shelf's tail was already fitted to the one glyph run
that could not afford it.

Two things were also hiding the figure that the overlay was being blamed for:
`.bg`'s left mask ramp ran 32% of the frame against a 16% blown-out window, so
its second half was erasing the torso rather than the frame's edge, and the
overlay's own vertical dimension was unused.

### Changed

- **The desktop overlay is two layers, split by axis** —
  `HeroSection.module.css`'s `min-width: 920px` `.scrim` plus a new
  `.scrim::after`. The base is a flat **0.50** across the copy column (from
  the 0.89 → 0.86 → 0.82 shelf), then the same plunge as before (0.10 at
  `--copy-edge + 7%`, 0 at +14%). The `::after` shield repeats that horizontal
  profile at **0.70** and is masked to the band of hero the red accent
  occupies — opaque 42%-60%, ramped in over the 17% above and out over the 18%
  below — so the two composite to **0.85 behind "impact" alone**, a shade more
  than the 0.845 the old shelf put there. It is a mask on a second layer and
  not a third gradient in the same `background` because stacked translucent
  layers union: a plain vertical band would have raised the white over the
  hands too, and only an intersection can hold white to one band of one column.
- **A `--accent-edge` custom property** (`calc(var(--copy-edge) - 400px)`)
  keys the shield's left ramp to the accent the way `--copy-edge` keys the
  plunge to the copy. The slack between the accent's left edge and
  `--copy-edge` measures 311px at 920px, 316px at 1024px, 352px at 1280px,
  362px at 1440px and 357px at 1920px — it stops growing once the display type
  hits its 104px clamp — so 400px starts the shield 38-89px ahead of the first
  glyph at every width.
- **`.bg`'s left mask ramp is 16% of the frame, from 32%** (`min-width: 920px`
  only). A luminance scan of the shipped WebP puts the figure's own left edge
  at 15.6%-20.7% of the frame depending on the row, with every column left of
  that at 246-252 — so 16% is exactly the blown-out window the ramp has to
  cross, and the 32% version was spending its second half on the torso, holding
  it at about 0.19 mask behind the headline.
- **The sub-920px pair is 0.66 veil / 0.36 → 0.20 → 0.04 fade**, from 0.7 and
  0.55 → 0.32 → 0.06. The split is deliberately not symmetric with the desktop
  pair: below the breakpoint the frame is pinned to the top of the section and
  is only about 40% of the hero tall, so the veil — which must be at full
  strength by the time the copy starts at 26% — already covers the frame's
  lower half whatever it is set to, while the strip above the copy belongs to
  the fade alone. Dropping the fade to 0.36 takes the photograph there from 45%
  of itself to 64%; dropping the veil the same distance would have bought a
  third as much and spent the accent's margin doing it.

### Notes

- **The reveal lives in the frame's feathers, which is why the base alpha is
  worth 0.50.** The frame is about half the hero tall, its top 34% and bottom
  32% are feather, and the full-mask middle is very nearly the same band the
  accent sits in — so there is almost no area where the mask is 1 and the
  shield is 0. What 0.50 multiplies is the surviving mask inside the feathers:
  at mask 0.5 over the near-black sleeve the composite moves from 240 under the
  old shelf to 203. Measured as mean deviation from page white over the columns
  the figure occupies, the photograph gains 29% at 920px, 21% at 1440px, 46% at
  1920px, 64% at 2560px, and 37% at 375px / 28% at 768-900px on the phone
  stack.
- **Every contrast floor is met with more margin than before, not less.**
  Sampling each element's whole box against the darkest backdrop pixel under it
  — stricter than the glyph-coverage method `[2.18.1]` used, and stricter than
  necessary — the accent measures **3.20-3.27:1** from 920px to 2560px against
  3.06-3.12:1 for the shelf it replaces, and 3.69-4.10:1 below the breakpoint
  against 3.82-4.13:1. The ink headline never drops below 12.6:1, the lede
  below 5.55:1 (4.5:1 floor, 19px regular), and the pillars row is over bare
  page white at 5.24:1 at every width. The accent needed that margin:
  shortening `.bg`'s left ramp raised the mask under the word's FIRST glyphs
  from 0.78 to 1, so more of it now sits over full-strength sleeve than when
  0.82 was measured.
- **The frame's top and bottom feathers were not touched, and that was the
  binding constraint on how far this could go.** Shortening the top ramp is by
  far the biggest lever on how much figure is drawn — and it puts a horizontal
  line across the hero: at 34% the largest change in the row-averaged profile
  across any 10px window near the frame's top edge is 2.6 levels, at 22% it is
  7.5, and at 12% it is 22, which is plainly visible. The shipped values hold
  every edge inside the range the previous release already measured (top ≤2.6,
  bottom 2.1-5.2, and 4.2-6.8 across the shield's own seam, against 1.0-1.9 /
  1.0-3.9 / 2.5-6.1 before).
- **Engines without `mask-image` paint the shield unmasked**, which composites
  to roughly the old full-height shelf — more white, never less.

## [2.18.1] — 2026-08-19 — Home hero: thin the white shelf so the photograph reads earlier

The desktop overlay held white at 0.93 → 0.90 → 0.86 across the copy, which
left the photograph contributing 7-14% of itself anywhere left of
`--copy-edge`. On a wide screen the hero read as white paper with a handshake
pasted onto its right third rather than as copy sitting on a photograph.

### Changed

- **The desktop shelf is 0.89 → 0.86 → 0.82** (from `0.93 → 0.90 → 0.86`) in
  `HeroSection.module.css`'s `min-width: 920px` `.scrim`. The photograph's own
  pixel now survives at 11% / 14% / 18% across the shelf instead of 7% / 10% /
  14%, so the sleeve and the near arm read through the span between the
  frame's left feather and the end of the copy. The plunge past `--copy-edge`
  (0.10 at +7%, 0 at +14%) is untouched, as is the sub-920px pair — the phone
  hero's veil-plus-fade split carries its own legibility budget and had no part
  in this.

### Notes

- **0.82 is the floor, not a round number.** The binding pixel is a near-black
  sleeve at full mask directly under the last glyph of "impact" — verified to
  be under a painted glyph by rasterising the accent at its computed font and
  sampling only where its own alpha is 255, not by sampling its bounding box.
  On that measure the tail runs 3.39:1 at 0.86 and 3.13:1 at 0.82 at 1024 /
  1440 / 1920px alike, against a 3:1 large-text floor; 0.80 gives 3.02:1 and
  0.78 breaks it. The ink headline is 13.3:1 at its thinnest. The comment above
  `.scrim` records this so the next pass does not re-derive it — the previous
  comment's "4.0:1, because what sits behind it is the frame's blown-out left"
  was measuring the wrong pixel.
- **The far left is not this gradient's to give.** The frame starts at 17.5% of
  the hero at 1440px and its own left feather does not reach full strength
  until 47%, so at the shelf's 30% stop the backdrop is already 88% page white
  and lowering that stop further moves the composite by about one part in a
  hundred. The first two stops moved to keep the shelf reading as one surface.
  More photograph further left is a `.bg` mask-ramp or `--bg-right` change.

## [2.18.0] — 2026-08-19 — Home hero: no box, a bigger hand, and the DLS watermark retired

`[2.17.0]` fitted the photograph into a placed box. That box was the problem:
at any width its own four edges were on the page, and the feather that was
meant to hide them was a shallow smoothstep laid across two near-black suit
sleeves — 150 levels of change inside 15px, which is a line, not a fade. On a
2560px screen the result read as a grey rectangle sitting behind the hero, with
its left edge running down through the headline.

This drops the box. The frame is drawn **whole, at a stated width**, pinned
past the hero's right edge, and the section clips it — so the only edges that
end on the page are the ones that can be dissolved, and the placement puts the
hero's own edges where the frame carries nothing.

### Changed

- **No fitting box.** `.bgWrap` is gone; the `<img>` is positioned directly
  against `.hero` with `width: var(--bg-w); height: auto`, so nothing in the CSS
  decides a crop. `max-width: none` is needed to override the global
  `img { max-width: 100% }` in `global.css`.
- **`--bg-w` / `--bg-right` / `--bg-top` place it.** `clamp(980px, 92vw, 1900px)`
  from 920px up, bled 11% of its own width past the hero's right edge and
  centred on 52% of the hero — which is where the accent word sits at every
  desktop width. The joined hands were re-measured off the shipped file (skin
  mask): they are 56.1%-81.1% of its width, centroid 68.0%. Because the bleed is
  a fraction of the frame rather than a length, the hero's right edge falls at
  89% of the frame at **every** width from 920px to 3440px — always past the
  hands, so the sleeve is what runs off the page and the clasp cannot. Their
  left edge lands 22px past the headline's right edge at 1440px and further out
  above; below a crossover near 1330px it slips back under the tail of the
  overlay's shelf (14px at 1280px, 55px at 1024px), which is the correct
  trade on a hero the copy already owns 74% of. The hand goes from 265px to
  331px at 1440px, and from 365px to 475px at 2560px.
- **Below 920px the numbers change job.** `clamp(1000px, 165vw, 1400px)`, bled
  14%, top-anchored at the section's own top edge — where the fixed 68px header
  covers it, so there is no top edge to hide. That is a deliberate zoom: 250px
  of hand on a 390px phone, against 132px before.
- **The feather is a power curve, not a smoothstep.** Alpha `t^2.4`, six stops
  per ramp, sampled at fifths. Left 32% of the frame, top 34%, bottom 32% (top
  20% below 920px, where the header does the work). The right edge has no ramp
  at all — it runs off the page, and `overflow: hidden` ends it the way a
  viewport ends any full-bleed image. Measured as the maximum luminance slope
  coherent across the whole frame width, the top edge goes from 2.28 to 0.71
  levels/px at 2560px and the left from 0.79 to 0.55, and in both cases the
  steepest point moves off the boundary and into the middle of the ramp.
- **The scrim splits by axis below 920px.** The veil (0 → 0.7 by 25% of the
  hero) owns legibility on its own, which frees the horizontal fade to stop
  being about text and be about the left edge: 0.55 → 0.32 → 0.06 instead of
  0.9 → 0.86 → 0.62. Over the copy the two composite to 0.79 where they used to
  make 0.91; in the strip above the copy, where the veil is nothing, the
  photograph goes from 14% of itself to 68%. The phone hero was faint because
  of that layer, not because of its size.
- **`--copy-edge` is `50vw + 275px`, from `50vw + 320px`.** The old value was
  fitted to the pillars row, which the band no longer reaches — it is feathered
  to zero by 78% of the hero and the pillars sit at 88% and below. Fitting to
  the headline instead (its widest line is 853px at the 104px display size,
  i.e. `50vw + 257px`) hands 45px back to the hand. The desktop shelf goes back
  up to 0.93 → 0.90 → 0.86 and the plunge tightens to 7% + 7%.
- Contrast was re-measured against the real composite at 320 / 390 / 600 / 768 /
  920 / 1024 / 1200 / 1280 / 1440 / 1920 / 2560px. The red accent on "impact" —
  the section's floor — runs 3.30–4.14:1 against a 3:1 large-text floor,
  equal to or better than `[2.17.0]` at every desktop width; the lede holds
  6.8–8.8:1 and the pillar numbers 5.24:1 on bare white.

### Removed

- **The floating "DLS" watermark.** `.float`, the `floaty` keyframes, and the
  `<img>` that carried them are gone from the Home hero. `siteConfig.logoMark`
  and `MARK_SIZE` stay exported but now have no consumer in `src/` — the mark
  itself is unchanged and still shipped at `public/images/logo/dls-mark-860.png`.

## [2.17.0] — 2026-08-19 — Home hero: the contained frame, drawn at a chosen size

`[2.16.0]` stopped the frame being cropped; it did not stop it being large.
`contain` fixes a photograph's shape but takes its scale from the box holding
it, and that box was the section — so the frame was still drawn as wide as the
hero at every normal viewport (1430px at 1440px, 1910px at 1920px), with the
clasp alone spanning 372px and 497px. **Uncropped is not the same as
unenlarged.** This gives the contained frame a box of its own, which turns out
to buy contrast as well as scale.

### Changed

- **`.bgWrap` is a placed box, not the section.** It takes its width from a new
  `--bg-w` and pins to the hero's right edge: below the 920px nav breakpoint the
  copy spans the frame, so the band does too — `clamp(430px, 135%, 900px)`,
  sitting `--bg-top: 64px` clear of the header — and from 920px up the copy is a
  left column, so the band steps back beside it at `clamp(760px, 74%, 1460px)`,
  centred on the hero's height. Placement is `align-items` plus `padding-top`
  rather than offsets, so the flex centring still works in the wide-and-short
  case past 2.63:1 where height binds instead of width.

  The whole frame is still on the page at every viewport — that is `contain`'s
  guarantee and it is untouched — and the four-edge feather still lands on the
  photo's own edges, because it is stated in percentages of the image. Neither
  clamp end upscales the 2880px master: both ceilings are exactly 2x on retina.

  | Viewport | Frame before | Frame now | Clasp before | Clasp now |
  | --- | --- | --- | --- | --- |
  | 390px | 390px | 527px | 101px | 137px |
  | 768px | 758px | 900px | 197px | 234px |
  | 1440px | 1430px | 1058px | 372px | 275px |
  | 1920px | 1910px | 1413px | 497px | 367px |

- **The desktop shelf goes back up, 0.88 → 0.85 → 0.82 becomes 0.92 → 0.89 →
  0.86.** Not a reversal of `[2.16.0]` — the placement paying for itself. A
  section-filling frame put the clasp at 68% of the hero, i.e. under the shelf,
  so the only way to reveal the subject was to thin the same white that protects
  the copy. Pinned right, the clasp sits at about 76%, inside the plunge, so the
  shelf and the subject have come apart and both can improve at once. Over the
  real composite, against `[2.16.0]` at its own widths: the accent runs
  **3.36 / 3.32 / 3.33:1** at 1024 / 1440 / 1920px against 3.08 / 3.11 / 3.09:1,
  restoring the third of a point above the 3:1 large-text floor that the
  `contain` release had spent; and the photograph averaged across the clasp goes
  **16% → 16%, 27% → 50%, 43% → 76%**. The frame is drawn smaller and more of it
  survives, because what survives is now the part with the hand in it.

- **The sub-920 overlay is untouched, and the placement is why.** With the band
  above the headline rather than across the middle of the section, the same
  alphas measure **4.36:1 at 320 / 390 / 768px and 4.18:1 at 919px** for the
  accent (against 3.35-3.45:1 over a section-filling frame) and **8.81:1** for
  the lede (against 5.06-7.12:1). The 600-900px range `[2.16.0]` identified as
  the sub-920 danger zone is now its safest part.

- `.hero` paints `#fff` explicitly, so the feather dissolves into a stated
  colour rather than into whatever sits behind the section.

### Notes

- No image file changed, so the `public/index.html` LCP preload, the `<img>`,
  its `fetchpriority="high"` and the `HERO_BG` / `HERO_BG_SIZE` constants all
  carry over from `[2.16.0]` untouched.

- `--copy-edge` keeps its fitted `50vw + 320px`. Its pillars clause is
  belt-and-braces now — the band stops above the pillars row at every desktop
  width — but the fade still has to clear the headline and the lede there.

## [2.16.0] — 2026-08-17 — Home hero: the whole frame, feathered into the page

`[2.15.0]` filled the section with the handshake and cropped whatever did not
fit — at 375px that was 80% of the file. The brief here is the other way round:
**the entire photograph must be visible on every device**, the white overlay must
be thinner, and wherever showing the whole frame leaves white around it, that
white must be the overlay's own fade rather than a visible edge.

### Changed

- **`background-size: cover` becomes a contained `<img>`.** `.bgWrap` is the
  `inset: 0` box; the photograph is an `<img>` centred inside it at
  `max-width`/`max-height: 100%` with both dimensions `auto`, which resolves to
  exactly the contain box. Nothing is cropped at any viewport. The `<img>` is
  not a preference: a background is painted inside its element, so the element
  stays section-sized with the letterbox baked in and there is no fixed thing
  for a percentage mask to aim at. As the element now IS the drawn photo, the
  edge feather below can be written in percentages of the image. It also drops
  the css-loader constraint that forced the URL inline (`HERO_BG` is a plain
  `src` now) and lets the backdrop carry `fetchpriority="high"`, which a
  background image cannot.

- **The frame's own edges are feathered to nothing** — 8% of the image
  horizontally, 10% vertically, each ramping through a mid-stop so it reads as a
  fade and not a wipe. Two mask layers intersected (`mask-composite: intersect`,
  `-webkit-mask-composite: source-in`), so corners fade on both axes. This is
  what turns "contained" into "composed": the leftover white is the page, the
  photograph dissolves into it, and no viewport can produce a seam. Engines
  without `mask-composite` fall back to a union (no visible feather) and engines
  without masks to hard edges — both are exactly the previous release's
  treatment of a photo edge, never a missing backdrop.

- **The white overlay is thinner.** From 920px up every stop drops: the shelf
  holds 0.88 → 0.85 → 0.82 to `--copy-edge` instead of 0.94 → 0.91 → 0.86, then
  plunges to 0.08 (was 0.10). Below the breakpoint the vertical veil comes down
  from 0.74 to 0.60 and the fade is reshaped into the same shelf-and-plunge the
  desktop rule uses: 0.90 → 0.86 held to 80% of the hero, then away to 0.06, in
  place of 0.95 → 0.90 → 0.40 → 0.08. The two sub-920 layers multiply, so an
  evenly-ramped fade spent the veil's whole budget in the middle of the section,
  exactly where the headline is; holding the shelf out to 80% spends it at the
  right edge instead, where nothing but photograph is. The composite is thinner
  than before everywhere except a strip between roughly 62% and 86% of the hero,
  which holds up to 0.02 more — bought deliberately, and paid back as accent
  contrast (below).

- **`--copy-edge` and `.float` are untouched**, and the first of those is worth
  saying out loud: a contained frame is width-limited at every normal viewport,
  so it spans the hero edge to edge and the clasp still sits at 68% of the hero
  — the same place `background-position: 68%` pinned it. The plunge still ends
  where the glyphs do.

### Verified

Worst-**pixel** contrast over the real composite — the photograph resampled into
the measured contain box, through the edge mask, under the gradients exactly as
the browser resolves them — sampled at the darkest pixel inside every glyph run's
client rect (`Range.getClientRects()`, so line boxes rather than the block).
Presence is the share of the photograph's own pixel that survives mask ×
overlay, averaged across the clasp (55–81% of the frame, so it straddles the
plunge):

|        | ink   | accent | lede | pillar № | pillar label | presence |
| ------ | ----- | ------ | ---- | -------- | ------------ | -------- |
| 320px  | 19.67 | 4.36   | 5.07 | 5.24     | 19.67        | 12%      |
| 390px  | 19.67 | 4.36   | 5.07 | 5.24     | 19.67        | 12%      |
| 768px  | 15.99 | 3.36   | 7.13 | 5.24     | 19.67        | 12%      |
| 919px  | 15.99 | 3.35   | 7.04 | 5.24     | 19.67        | 12%      |
| 920px  | 14.13 | 3.10   | 6.33 | 5.24     | 19.67        | 16%      |
| 1024px | 14.17 | 3.09   | 6.33 | 5.24     | 19.67        | 16%      |
| 1440px | 14.33 | 3.10   | 6.63 | 5.24     | 19.67        | 27%      |
| 1920px | 14.37 | 3.09   | 6.61 | 5.24     | 19.67        | 43%      |

The red accent on "impact" is the binding case, as it has been through every
revision of this hero, and it clears AA large-text's 3:1 everywhere with
0.09–1.36 in hand. Run the same geometry with `[2.15.0]`'s alphas and it reads
3.38–3.42:1 from 920px up at 11–40% presence: the desktop shelf spends 0.3 of
that margin to raise presence to 16–43%, and the next notch down (0.86 → 0.83 →
0.80) lands on 3.00:1 exactly, which is where the thinning stops.

Below 920px the accent moves the other way — 3.27 → 3.36:1 at 768px — because
reshaping the fade gave back more than thinning the veil took. That range is
also why the check is not a phone-only one: where the band falls relative to the
headline is a function of the hero's aspect, so at 320 and 390px the band lands
*below* the headline (accent over bare white, 4.36:1) while between about 600 and
900px it covers it. Simply thinning the veil under the old evenly-ramped fade
measured 2.96–3.14:1 across 600 / 768 / 900px — at or under the floor at widths a
phone-only reading never visits.

Presence sub-920 is a redistribution rather than a windfall: 24% → 38% at the
hero's right edge, unchanged at 12% across the clasp, 8% → 9% across the whole
band. What changes the phone hero is the crop — the frame is whole now instead of
84% cut away. `--red` on the pillar numbers reads 5.24:1 at every width, the most
that colour can do on pure white, because a contained band never reaches the
pillars row. Production build clean.

## [2.15.0] — 2026-08-17 — Home hero: a background image, not a picture

Three things asked for at once, all about the same section: put **this** frame
back (`iStock-1224717790.jpg`, the 5000×1900 forearm-level handshake that
shipped as `hero-home-v4`), draw it as a **CSS background image** rather than a
`<picture>` in the markup, and keep the left-to-right white overlay but thin
enough that **the photograph still reads through it** — with the clasp landing
next to the red accent word "impact", on every device.

### Changed

- **`hero-home-v6` replaces `hero-home-v5`.** One 2880w WebP (39 KB) plus a
  77 KB JPEG fallback, uncropped from the 5000×1900 master. New basename, not a
  same-name swap and not a revival of `hero-home-v4`: `/images/**` answers
  `immutable` for a year, so either would leave returning visitors on whichever
  bytes they already hold.

- **The `<picture>`/`<img>` pair is gone.** `.bg` is an empty `aria-hidden`
  `<div>` carrying `background-image` / `background-size: cover` /
  `background-position`, and the WebP-or-JPEG choice moves into `image-set()`
  with a bare `url()` declaration above it as the pre-`type()` fallback. The
  `HERO_BG` / `HERO_BG_WEBP` constants are retired — the file names now live in
  the stylesheet and in the `public/index.html` preload, which is the pair that
  has to stay in sync. That preload also stops being an optimisation: a
  background image is discovered after the CSSOM, so on the home route it is
  what keeps the LCP asset from waiting on the bundle.

- **`background-position: 68% 50%`, and x is the only number doing work.** The
  frame is 2.63:1 and the section runs ~0.4:1 (phone) to ~2.4:1 (desktop), so
  `cover` is height-limited at *every* real viewport — there is no width-limited
  desktop regime any more, and the vertical 50% is declared only for the
  ultra-wide-and-short case past 2.63:1. 68% is measured, not chosen: the joined
  hands span 55–81% of the file and the skin centroid sits at 67.8% × 55.2%.
  A percentage `background-position` aligns that fraction of the image with the
  same fraction of the box, so the clasp is pinned at 68% of the hero at every
  width — beginning under "impact" and running right — however steep the crop
  gets (at 375px, 80% of the frame is cut away).

- **The desktop overlay is thinner across the copy.** From 920px up the shelf
  holds 0.94 → 0.91 → 0.86 to `--copy-edge` instead of 0.97 → 0.95 → 0.90, then
  plunges as before (0.10 within 8% of the hero, gone 8% after). Measured on this
  frame at a fixed `--copy-edge`, that raises the share of the photograph
  surviving *under the shelf* from 6.1% to 9.8% at 1440px and 5.9% to 9.7% at
  1920px — a little over 1.6×, and the difference between a tint and a visible
  photograph.

  The sub-920px vertical veil stays at **0.74**, deliberately. It was tried at
  0.72 and put back: the red accent's worst pixel in the whole section is on a
  phone, not a desktop, and 0.72 takes 390px from 3.31:1 to 3.25:1 for 0.3% more
  presence. Only the layer with margin to spare gave any up.

- **`--copy-edge` moves from `calc(50vw + 291px)` to `calc(50vw + 320px)`**, and
  the reason is a detail the old fit missed: it was fitted through the widest
  *glyph run*, but the pillars row is a four-column flex that runs wider than the
  headline, so once the container hits its 1280px cap the fourth pillar's number
  — 14px `--red`, the least forgiving colour in the section — ends 19px *past*
  the old edge, inside the plunge. It measured 3.54:1 there. Clearing it by 10px
  brings it to 4.16:1 for about 2 points of photo presence.

### Verified

Worst-**pixel** contrast over the real composite — the photograph resampled
through `cover` at the measured hero box, under the two gradients exactly as the
browser resolves them, sampled at the darkest pixel anywhere inside a glyph run's
client rect rather than just under its strokes. Presence is the share of the
photograph's own pixel that survives the overlay, averaged across the clasp:

|        | limited by | ink   | accent | lede | pillar № | pillar label | presence |
| ------ | ---------- | ----- | ------ | ---- | -------- | ------------ | -------- |
| 320px  | height     | 16.36 | 4.16   | 6.64 | 5.24     | 16.49        | 15%      |
| 390px  | height     | 16.62 | 3.31   | 6.81 | 5.07     | 17.45        | 15%      |
| 768px  | height     | 16.75 | 3.36   | 6.97 | 4.27     | 16.14        | 20%      |
| 919px  | height     | 16.48 | 3.37   | 7.09 | 4.30     | 16.19        | 22%      |
| 920px  | height     | 15.89 | 3.46   | 7.14 | 4.34     | 16.62        | 24%      |
| 1024px | height     | 15.74 | 3.46   | 7.19 | 4.50     | 16.05        | 29%      |
| 1440px | height     | 15.73 | 3.44   | 7.08 | 4.48     | 10.53        | 39%      |
| 1920px | height     | 15.63 | 3.47   | 7.13 | 4.16     | 7.23         | 47%      |

The red accent on "impact" is the binding case at every width, as it has been
through every revision of this hero, and it clears AA large-text's 3:1 with
0.31–1.16 in hand — its floor (3.31:1, at 390px) is unchanged from `[2.14.0]`'s
3.36:1 within measurement noise, because the layer that protects it did not move.
`--red` on the pillar numbers is the next tightest and is capped by the colour
itself: #D5192E tops out at 5.24:1 even on pure white, so 4.16:1 is 79% of the
best that combination can do anywhere on the site.

"Limited by" is height at every listed viewport, which is the point of the frame
being 2.63:1 — `cover` never crops it vertically, so `background-position`'s y
is inert and x alone decides the composition. 919px and 920px are both listed
because they exercise different scrim stacks; both are readable, which is why the
two-layer stack is the base rule and the desktop one is the `min-width` override
— a viewport at a fractional CSS width satisfies neither query and has to land
on the safe one.

## [2.14.0] — 2026-08-17 — Home hero: the handshake as a full-bleed background

`[2.13.0]` bought the right 55% of the frame at full strength by shrinking the
frame: `object-fit: contain` in a right-anchored box whose width was solved so
the copy always ended left of where the overlay let go. It kept every pixel of
the photograph on the page, but the cost was section white around it — on a
desktop viewport the frame read as a panel held in the corner rather than as
the hero's background. This reverses that trade: **the photograph fills the
section, edge to edge, on every device.**

`.bgPicture` and `.scrim` are now plain `inset: 0` boxes — the same rectangle as
the section — and `.bg` is `object-fit: cover`. The `--band` / `--frame-foot` /
`--frame-max` / `--lede-edge` geometry that sized the panel is gone, along with
the sub-920px banner and the `padding-top` that reserved room for it; `.inner`
is back to the mockup's `clamp(140px, 18vh, 190px)` at every width.

`object-position: 63% 50%` is the one number carrying the composition, and it is
measured, not chosen: the joined hands span 43.5–83% of the file and the skin
centroid sits at 62% × 55%. Setting x to the subject's own fraction is what pins
the clasp at 63% of the hero on the narrow viewports, where `cover` is steeply
height-limited (at 390px the photo is drawn 1584px wide into a 390px box) and
any other value slides the hands off-frame entirely.

### Changed

- **One white overlay, two regimes, no mask.** From 920px up the fade alone
  carries legibility: 0.97 at the left edge, 0.95 at 30%, holding 0.90 across
  the copy to `--copy-edge` (`calc(50vw + 291px)`, fitted through the measured
  right edge of the widest glyph run), then plunging to 0.10 within 8% of the
  hero and to nothing 8% after that. Below the breakpoint the copy spans the
  frame, so a vertical veil joins it — clear to 19% of the hero, 0.74 by 27%,
  held to the foot — and the clear band is the top of the section rather than
  the right of it.

- **The watermark loses its second `top`.** `.float` keeps the mockup's
  `top: 110px` at every width now that there is no banner to drop clear of;
  only the opacity still splits at 920px (0.06 → 0.04).

### Verified

Worst-**pixel** contrast over the real composite (conservative: the darkest
pixel anywhere under a glyph's box, not just under its strokes), and photo
presence — the share of the photo's own pixel that survives the overlay —
averaged across the clasp:

|          | limited by | ink   | accent | lede | pillar № | presence |
| -------- | ---------- | ----- | ------ | ---- | -------- | -------- |
| 320px    | height     | 17.19 | 3.82   | 6.76 | 5.24     | 10%      |
| 390px    | height     | 16.87 | 3.36   | 5.96 | 4.65     | 10%      |
| 768px    | height     | 16.70 | 3.41   | 7.26 | 4.50     | 12%      |
| 919px    | height     | 16.52 | 3.43   | 7.37 | 4.46     | 12%      |
| 920px    | height     | 17.28 | 3.67   | 7.77 | 4.71     | 22%      |
| 1024px   | height     | 17.26 | 3.78   | 7.68 | 4.80     | 24%      |
| 1440px   | height     | 17.08 | 3.73   | 7.77 | 4.27     | 31%      |
| 1920px   | width      | 17.07 | 3.69   | 7.65 | 4.08     | 38%      |

The red accent on "impact" is the binding case at every width, as it has been
through every revision of this hero, and it clears AA large-text's 3:1 with
0.36–0.82 in hand. 919px and 920px are both listed because they exercise
different scrim stacks; both are readable, which is why the two-layer stack is
the base rule and the desktop one is the `min-width` override — a viewport at a
fractional CSS width satisfies neither query and has to land on the safe one.

Presence behind the copy is the honest cost of a full-bleed backdrop: the clasp
sits at 63% of the hero and `--copy-edge` runs 65–78%, so the subject is partly
under the shelf and reads at full strength only right of the plunge. That is
the trade `[2.13.0]` refused and this release accepts — it is what "fills the
section" means with this frame and this headline.

## [2.13.0] — 2026-08-17 — Home hero: a new frame, and the right 55% of it clear

A new client photograph for the hero — a close-framed handshake against a
blown-out white window, `3.png`, 3840×2160 — and a brief for how much of it to
show: keep the left-to-right white fade, but pull it back far enough that
**roughly the right 55% of the image is essentially unveiled**, still fitting
the whole frame rather than filling the section with a crop, on every device.

The shape change is what forced the rework. `[2.12.0]`'s frame was 2.63:1, so
`contain` in a desktop hero was always width-limited — a short band that had to
be bottom-anchored to stay off the copy, under a two-layer scrim keyed to the
section. 16:9 sits close to the section's own ratio, so the same treatment put
the photograph squarely behind the headline, and the brief's fade cannot survive
that: `--grad-text` red (#E8293E) on skin and dark wool measures **1.05–1.6:1**
however the stops are arranged, because the veil that used to rescue it is the
thing being removed.

So the fade is not the lever any more — the frame's **width** is. It is
right-anchored and sized so the copy always ends left of where the overlay lets
go, which costs nothing but section white and buys the whole right 55% at full
strength. Numbers below are photo presence (the share of the photo's own pixel
that survives the overlay) and worst-**glyph** contrast — sampled on the real
composite through a mask of the page's own rendered glyphs, rather than through
line boxes, which measure the gaps between words as if they were text.

### Changed

- **`hero-home-v5` replaces `hero-home-v4`.** One 2880w WebP (56 KB) plus a
  JPEG fallback, uncropped from the 3840×2160 master. New basename, not a
  same-name swap: `/images/**` answers `immutable` for a year, so overwriting
  would leave returning visitors on the old photo. The `public/index.html`
  preload moves with it.

- **The scrim's percentages are the photograph's, not the section's.**
  `.bgPicture` stops being `display: contents` and becomes the positioned box
  the frame is drawn into; `.scrim` is laid over the identical rectangle, so
  "clear from 45%" is a statement about the image and holds at every viewport.
  The box reproduces `object-fit: contain`'s own negotiation in the layout tree
  — `aspect-ratio` against a definite height with an `auto` width, clamped by
  `max-width` — so it is exactly the frame's drawn width in both regimes.

- **One fade instead of two, and no mask.** White holds at 0.97 → 0.93 across
  the frame's left 38%, plunges to 0.12 by 45%, and is gone by 48%. The old
  `--copy-edge` / `--lede-edge` two-layer scrim and its section-foot mask are
  retired: with the frame sized to clear the copy there is nothing left for a
  second layer to protect.

- **`--frame-max` is the new lever**, the larger of two terms because which copy
  the frame must clear depends on how tall it is: `80.65vw − 470px` to clear the
  headline, or clear the lede capped at 500px (281px tall, which fits under the
  headline's last line by construction). It gives 360 / 500 / 500 / 691 / 1078px
  at 920 / 1024 / 1200 / 1440 / 1920px, with an `aspect-ratio` guard for short
  wide viewports such as 1920×720.

- **Below 920px, unchanged in kind and bigger in fact.** Still a clear banner
  above the copy with no overlay at all — 100% of the photograph — now 56.25% of
  the section's width tall rather than 38% (211px at 375px, 426px at 768px), so
  `.inner`'s reserved room grows from 246px to 315px at 375px. The 46vh
  landscape cap is unchanged; the width it is expressed as moves from 121vh to
  82vh with the aspect ratio.

### Measured

| Viewport | Frame      | Clasp | Ink   | Accent | Lede | Pillar № |
| -------- | ---------- | ----- | ----- | ------ | ---- | -------- |
| <920px   | full width | 100%  | 19.67 | 4.36   | 8.81 | 5.24     |
| 920px    | 360×203    | 100%  | 19.67 | 4.36   | 8.81 | 5.24     |
| 1024px   | 500×281    | 100%  | 19.67 | 4.36   | 8.09 | 5.24     |
| 1200px   | 500×281    | 100%  | 19.67 | 4.36   | 8.81 | 5.24     |
| 1440px   | 691×389    | 100%  | 17.59 | 3.90   | 8.81 | 5.24     |
| 1920px   | 1078×607   | 100%  | 17.42 | 3.86   | 8.22 | 5.24     |

The clasp column is the point of the change: it ran 12–94% under `[2.12.0]` and
is 100% everywhere now. The accent stays the binding case, as it has been
through every revision of this hero, and binds higher than before — 3.86–4.36
against 3.49–3.80. 1440px and 1920px are the only widths where the frame is wide
enough to reach under the headline at all; everywhere else the copy sits on bare
section white.

### Known trade-off

Between 920px and about 1000px the frame is small — 360×203, 22% of the
section's height — because the lede is a fixed 640px box there and takes 73% of
the width, leaving little for a photograph that has to clear it. It grows
quickly (500px wide by 1024px) and nothing is cropped or illegible at any point,
but that band is the honest cost of keeping the right 55% genuinely clear rather
than nominally so.

## [2.12.0] — 2026-08-15 — Home hero: the whole frame, never cropped

`[2.11.0]` filled the hero with the handshake using `object-fit: cover`, which
fills a 0.41-1.55:1 section with a 2.63:1 photograph the only way it can — by
throwing most of it away. At 1440px it drew the file at 2.2× the hero's width,
so what reached the page was two hands: no suits, no arms, no second figure, and
on a phone a single knuckle at 19% strength. The brief here is the other half of
the same idea — **fit the whole image, on every device** — because a crop that
tight is not the photograph that was licensed.

So `cover` becomes `contain`, the right-trim that `cover` needed comes off the
file, and the section is re-laid so a band 38% of its width tall has somewhere
to sit. Numbers below are photo presence (the share of the photo's own pixel
that survives the overlay) and worst-pixel contrast, measured on the real
composite — the shipped file at its computed geometry under the browser-resolved
gradient stops — sampled at the skin-tone centroid of the hands.

### Changed

- **The backdrop is `object-fit: contain`, full width, at every breakpoint.**
  Every pixel of the 5000×1900 frame is on the page at every viewport; nothing
  is cropped anywhere. Its height follows from that — 122px at 320px, 288px at
  768px, 543px at 1440px, 726px at 1920px — and where that band sits is now the
  only thing the 920px breakpoint switches.

- **Below 920px the frame is a clear banner above the copy.** It starts 72px
  down (the fixed 68px header, plus a hair, so none of it is spent under the
  header's translucent white) and the copy starts below it: `.inner`'s
  `padding-top` becomes `calc(72px + var(--band) + clamp(32px, 6vw, 56px))`.
  **There is no overlay at all under 920px** — the veil and the fade are both
  gone, because nothing sits on the photo to protect. The section grows by what
  the photo is worth (913 → 1012px at 375px, 853 → 1077px at 768px) instead of
  the photo shrinking into a section written without one.

- **From 920px up the frame is bottom-anchored 130px above the section's foot**,
  which is 4-22px above the pillars' 1px rule at every width. That buys two
  things: the pillars row gets a plain white ground (its red numerals measured
  1.0-3.2:1 over the old backdrop and now read 5.2:1), and the clasp sits as low
  in the section as it can, which is what lets the fade clear it.
  `max(0px, calc(100% - 130px))` keeps that safe past ~2685px, where the frame
  becomes height-limited and a bare `calc()` would resolve negative and clip the
  foot.

- **The fade is two steps, because the copy is not a rectangle.** The headline
  runs out to 63.5-77.6% of the hero; everything below it stops at 47-54%. With
  the whole frame in view the clasp sits at its native 68.2% — 3px from where
  the headline ends at 1440px — so one shelf can clear the glyphs or the
  subject, never both. `.scrim` now carries a short shelf keyed to a new
  `--lede-edge` (the container gutter + `.lede`'s own `max-width: 640px` + 5px:
  677 / 686 / 764 / 1004px at 920 / 1024 / 1440 / 1920px, against measured
  longest lines of 664 / 607 / 685 / 925px), and `.scrim::after` lays the old
  `--copy-edge` shelf over it, masked off below the headline's foot. The plunge
  tightens from 10%/20% of the hero to 6%/12%; no glyph sits in it.

- **The mask is keyed to the section's foot, not to a hero-%.** The headline's
  last line ends a near-constant 423 / 414 / 420 / 420px above it at 920 / 1024
  / 1440 / 1920px, because everything below the headline is fixed-px rhythm
  while the hero's height is not. `100% - 400px` therefore stays solid past the
  last descender at every width with 14-23px to spare. A hero-% boundary drifts
  against that and takes the accent to 2.56:1 at 1024px when it drifts the
  wrong way.

- **The two scrim layers are additive, never complementary.** A mask pair that
  hands off (m and 1−m) dips to 0.72 white mid-ramp and shows the suit through
  in a band; additive errs whiter, by at most ~0.04 alpha in the left half where
  both layers are already 0.95+ — under two luma levels there.

- **Photo presence and worst-pixel contrast**, measured on the real composite:

  | Viewport | Presence | Ink `<h1>` | Accent `#E8293E` | Lede `--grey-2` | Pillars red |
  | -------- | -------- | ---------- | ---------------- | --------------- | ----------- |
  | 320px    | 100%     | 19.7:1     | 4.36:1           | 8.81:1          | 5.24:1      |
  | 375px    | 100%     | 19.7:1     | 4.36:1           | 8.81:1          | 5.24:1      |
  | 768px    | 100%     | 19.7:1     | 4.36:1           | 8.81:1          | 5.24:1      |
  | 920px    | 12%      | 19.5:1     | 4.25:1           | 6.97:1          | 5.24:1      |
  | 1024px   | 20%      | 19.3:1     | 3.59:1           | 7.26:1          | 5.24:1      |
  | 1440px   | 94%      | 18.1:1     | 3.52:1           | 7.20:1          | 5.24:1      |
  | 1920px   | 61%      | 19.2:1     | 3.72:1           | 7.25:1          | 5.24:1      |

  Below 920px every glyph is on plain white, which is why those rows are the
  on-white maxima. The accent stays the binding case above it and is now above
  where `cover` left it (3.49-3.80:1). **The dip at 920-1100px is the honest
  cost of the brief**: the clasp's native 68.2% falls inside the lede's own
  640px box there, and no fade can be both behind a glyph and out of its way.
  It clears as the container caps — 94% by 1440px.

- **The Home hero no longer parallaxes its backdrop.** Scrub parallax needs the
  photo drawn larger than its box so the travel never exposes an edge, which is
  exactly what `contain` exists to prevent: ±8% of the element's height would
  push the frame's top or foot past `overflow: hidden` and crop it. The
  Expertise and Who We Serve heroes still use `useParallax` — they are `cover`.

- **The floating "DLS" mark drops below the banner under 920px**
  (`top: calc(72px + var(--band) + 46px)`), where it sits on white behind the
  copy as the mockup floats it. A 0.07 watermark laid over a photograph is
  noise. From 920px up it keeps the mockup's `top: 110px` and its 0.04.

### Added

- **`public/images/hero-home-v4-2880.webp` (39 KB) + `hero-home-v4.jpg`
  (77 KB)** — the same client master, now shipped **whole**: the `crop` comes
  off `scripts/generate-images.js` entirely. `hero-home-v3`'s 950px right-trim
  existed to drag the clasp from 68.4% of the file to 84.5%, which is how a
  `cover` backdrop cleared the copy; `contain` does not crop, so that lever is
  gone with it and the scrim does the clearing instead. Still one 2880w variant
  and no `sizes`: `contain` draws the photo at exactly the hero's width, so
  2880w covers a 1920px viewport at 1.5× DPR and any phone at 3×, and it is
  4 KB lighter than the crop it replaces despite carrying 950 more px of frame.

### Removed

- **`public/images/hero-home-v3.jpg` + `hero-home-v3-2880.webp`.** Deleted
  rather than left in place: they were the right-trim for the `cover`
  treatment and have no remaining consumer. `/images/**` answers `immutable`
  (see `public/.htaccess`), which is why this ships as `-v4` rather than
  overwriting `-v3` — exactly why `hero-home` became `hero-home-v2` in
  `[2.5.0]`.

- **The sub-920px scrim stack** — the vertical legibility veil and the
  horizontal fade under it. Both existed to make copy readable on top of the
  photo; below 920px no copy is on the photo any more.

## [2.11.0] — 2026-08-15 — Home hero: the handshake as a full-bleed backdrop

`[2.9.0]` and `[2.10.0]` shaped the photo as a **feathered panel** held right of
the copy above 920px and a **band across the top** below it. The brief here is a
different treatment for the same photo: put it in as a **background image that
fills the section**, under a **white overlay that fades out from left to right**,
at **every device size**, and **without enlarging the image**.

So the panel, the band, the two vignette masks and the five scrim layers all
come out, and what replaces them is one `object-fit: cover` backdrop and one
horizontal fade. Numbers below are worst-pixel contrast and photo presence
measured on the **live render** — the shipped `<img>` drawn at its computed
geometry with the browser-resolved gradient stops composited over it — sampled
at the skin-tone centroid of the hands.

### Changed

- **The backdrop fills the hero at every width.** `.bg` is now
  `top: -10%; left: 0; width: 100%; height: 120%; object-fit: cover` — the same
  box the Expertise and Who We Serve heroes already use, sized so
  `useParallax`'s ±8% travel never exposes an edge. Gone: the `--panel` /
  `--panel-inset` geometry, the `16 / 9` band with its lifted `top`, the radial
  vignette, the linear bottom-edge mask, and the `min-width: 920px` override
  that swapped between them. One rule, no breakpoint.

- **The white overlay is a single left-to-right fade.** Above 920px the scrim is
  one `90deg` gradient: a `0.88+` shelf across the copy, then a plunge to `0.06`
  within 10% of the hero and to nothing 10% after that. The shelf ends at
  `--copy-edge` (`calc(50vw + 275px)`), a line fitted through the measured right
  edge of the widest glyph run at 920 / 1024 / 1440 / 1920px so it clears where
  the copy actually ends rather than at one tuned viewport. An even ramp was
  tried first and does not work: it puts ~0.18 white under the end of the
  headline at 1024px, where the red accent reads 1.2:1.

- **Below 920px the fade keeps running left to right, with a vertical veil
  under it.** The copy spans the frame there — at 375px the lede's longest line
  reaches 90.8% of the hero and "impact" reaches 84.1% — so there is no
  right-hand strip for a horizontal fade to clear into and it cannot carry
  legibility alone. A vertical layer does that instead: clear to 19% of the
  hero (the room between the 68px header and the headline), `0.74` by 27%, held
  to the foot. `0.74` is the least white that holds every glyph, grid-searched
  over veil × fade; at `0.66` the accent falls to 1.7:1.

- **Photo presence at the clasp**, and worst-pixel contrast for the three text
  colours, measured on the live render:

  | Viewport | Presence | Ink `<h1>` | Accent `#E8293E` | Lede `--grey-2` |
  | -------- | -------- | ---------- | ---------------- | --------------- |
  | 320px    | 19%      | 15.7:1     | 4.13:1           | 6.33:1          |
  | 375px    | 19%      | 14.1:1     | 3.13:1           | 6.03:1          |
  | 768px    | 19%      | 16.6:1     | 3.67:1           | 6.56:1          |
  | 919px    | 19%      | 16.2:1     | 3.68:1           | 7.07:1          |
  | 920px    | 43%      | 16.6:1     | 3.80:1           | 7.51:1          |
  | 1024px   | 69%      | 16.6:1     | 3.76:1           | 7.53:1          |
  | 1440px   | 97%      | 16.4:1     | 3.62:1           | 7.65:1          |
  | 1920px   | 100%     | 15.8:1     | 3.49:1           | 7.51:1          |

  The accent is the binding case at every width, as it was before, and stays
  clear of AA large-text's 3:1. **Presence below 920px is the honest cost of
  the brief**: filling a 0.41:1 box with a 2.13:1 photograph puts the clasp
  behind the copy, where it can only be a tint. `[2.10.0]`'s band held it at
  94% by keeping it *above* the copy instead of behind it — that is the trade
  the change makes, not a regression in the fade.

### Added

- **`public/images/hero-home-v3-2880.webp` (47 KB) + `hero-home-v3.jpg`
  (95 KB)** — the same client master (5000×1900), re-cut to 4050×1900 by
  trimming 950px off the right edge only.

  The trim is a composition lever, not a framing one. `object-position: <q> 50%`
  pins a subject at fraction `q` of the file onto fraction `q` of the box at
  every viewport, because `cover`'s crop then straddles it symmetrically — so
  where the clasp sits on the page is decided by where it sits in the file. In
  the whole master it is 68.4% across, which lands it under the headline from
  920 to 1440px. At 84.5% it clears the copy at every width from 920px up, and
  it holds there to the pixel: measured 84.5–84.6% of the hero from 320px to
  1920px.

- **One width and no `sizes`, on purpose.** A full-bleed `cover` backdrop is
  scaled by the section's *height*, not its width, so the rendered width barely
  moves with the viewport — 2178 to 2636 CSS px measured across 320–1920px. A
  `vw`-keyed `sizes` would describe the wrong quantity, and every breakpoint
  would resolve to the same variant anyway. 2880w covers the widest of those,
  so **the photo is never drawn past its natural size at any viewport**
  (verified `drawnWidth ≤ 2880` at 320 / 375 / 768 / 919 / 920 / 1024 / 1440 /
  1920px). `scripts/generate-images.js` grew an optional per-photo `widths` to
  express that.

### Removed

- **`public/images/hero-home-v2.jpg` + its two WebP variants.** Deleted rather
  than left in place: they were the 3:2 cut for the panel treatment and have no
  remaining consumer. `/images/**` answers `immutable` (see `public/.htaccess`),
  which is why this ships as `-v3` rather than overwriting `-v2` — exactly why
  `hero-home` became `hero-home-v2` in `[2.5.0]`.

- **`HERO_BG_SRCSET` / `HERO_BG_SIZES`** and the `imagesrcset` / `imagesizes`
  they had to stay in sync with on the home-only preload in
  `public/index.html`. The preload now names the WebP directly and carries
  `type="image/webp"`, so a browser that cannot decode it skips the preload
  instead of wasting it and picks up the JPEG from the `<picture>` when the
  bundle mounts. Verified: one hero request per load, initiated by the preload
  at 26ms, reused by the `<picture>`.

## [2.10.0] — 2026-08-15 — Home hero: the handshake read clearly, on the marked spot

`[2.9.0]` took the backdrop to ~60–65% presence at the clasp, which is visible
but still a wash — the handshake reads as a tint behind the page rather than a
photograph on it. The brief was to keep the same fade-out treatment but let
**the right ~55–60% of the frame read almost clearly**, and to bring the
handshake itself onto a **marked point just past the end of "impact"** — at
every width.

Same photo, same `/images/hero-home-v2*` files. Everything here is geometry and
alpha. Numbers are measured on the real composite
(`opacity × mask × (1 − scrimWhite)` over the shipped photo's pixels), sampled
at the skin-tone centroid of the hands, 53.4% × 55.2% of the frame.

### Changed

- **The handshake now reads at 94–96%, up from 60–67%.** Backdrop opacity goes
  `.92` → `1` at both layouts; the mask and the scrim do all the shaping, which
  is what lets the surviving part of the frame survive completely. Along the
  frame's mid-line the photo is at full strength across its right **56%**
  (panel) / **64%** (band) — the rest is the dissolve.

  | Viewport | Before | After |
  | -------- | ------ | ----- |
  | 320 / 375 / 430px | 67% / 67% / 67% | 94% / 94% / 94% |
  | 600 / 768 / 919px | 45% / 30% / 23% | 94% / 67% / 50% |
  | 920 / 1024 / 1280px | 64% / 66% / 64% | 95% / 95% / 95% |
  | 1440 / 1707 / 1920px | 63% / 61% / 60% | 95% / 96% / 96% |

- **The clasp moves onto the marked point.** At 1920px it lands at 70.7% × 48.1%
  of the hero and at 1707px 72.4% × 48.3%, against 74% × 52.5% before. The panel
  is *narrower* to get there, not wider (603px against 721px at 1920px): the
  clasp sits 53.4% into the frame, so `panelLeft = claspX − 0.534 × panel` —
  shrinking the panel is what moves its left edge off the copy. The previous
  panel could only clear the headline by sliding right, and it took the
  handshake with it.

  The clasp still drifts right as the viewport narrows (75.2% at 1440px, 81.6%
  at 920px). That is geometry, not tuning: the headline's last line runs to
  63.5% of the hero at 1920px but 73.7% at 1024px, so below ~1440px there is no
  room left of it to stand in.

- **`--panel` / `--panel-inset` now live on `.hero`.** The dissolve has to land
  at a fixed fraction of the *panel*, and `.bg` and `.scrim` are siblings, so
  the geometry is a custom property both read. `--panel-inset` reads "hold the
  panel far enough off the right edge that the headline's right edge lands no
  deeper than 32% into it", which keeps the copy inside the dissolve at every
  width (measured 23–32%) without being aimed at any one of them.

- **The dissolve moved from the mask to the scrim.** A radial mask cannot both
  hold a large clear core and drop off inside the ~13% of the panel's width
  between the end of "impact" and the clasp — those are the same knob. The mask
  is now an even vignette centred at 46% × 50%, radii 60% × 56%, so every edge
  feathers and none reads as a cut; the scrim's horizontal layer carries the
  dissolve, with its stops written as `calc(100% − inset − panel × k)` so they
  track the panel exactly.

- **The sub-920px band is 16:9 and lifts with the viewport.** Height is what
  decides whether the band clears the headline, and at the photo's own 3:2 it
  stopped clearing at ~375px; at 16:9 it clears to ~500px, and `cover` scales
  to the width, so the hands are exactly as large as before — it only trims
  7.8% off the top and bottom of a frame whose subject spans 20–90% of its
  height. `top: min(-4.6vw, 24px - 10.35vw)` then lifts the band as the
  viewport widens so the clasp stays above the headline, floored at the
  parallax overscan for small phones. Together these are what let 768–919px
  stop being conceded: 23–30% before, 50–67% now.

### Fixed

- **Text contrast improves at the same time, at every width.** The accent — the
  light end of `--grad-text` (#E8293E) on "impact", the binding case — is now
  flat at **3.96:1** across 920–1920px instead of sagging to **2.39:1** where
  the hero is most crowded, and 4.0–4.36:1 across 320–919px against 3.36–4.36:1.
  The `--grey-2` lede reads 8.4–8.8:1 against 6.2–8.8:1. The ink headline gives
  up a little where the band now sits behind it (18.2–19.7:1 on the panel,
  11.6–11.9:1 at 768–919px) and stays far above AAA throughout.

- **`sizes` corrected for the narrower panel** — `45vw` → `35vw` in both
  `HeroSection.jsx` and the home-only preload in `public/index.html`, which had
  been over-declaring the box and pulling the 1920w variant early.

## [2.9.0] — 2026-08-15 — Home hero: the handshake at 60–65%, nudged left, 6px larger

`[2.8.0]` put the whole handshake in frame and moved it right of the copy, but
it also took the photo down to ~36% presence at the clasp — legible as a shape,
not really as a photograph. The brief was to bring it up to **60–65% visible on
the right**, shift the handshake **slightly left**, and make the image **~6px
larger**, at every width.

Every number below is measured, not estimated: the composite is
`opacity × mask × (1 − scrimWhite)`, sampled over the shipped photo's real
pixels at the handshake's own position. A skin-tone centroid puts the hands at
**53.4% × 55.2%** of the frame — not the 52% × 50% `[2.8.0]` assumed — and that
is where "at the clasp" is sampled throughout.

### Changed

- **Visibility: ~35% → 60–67% at the clasp.** Backdrop opacity goes `.82` →
  `.92`, and both scrims open up on the right. Measured across the ladder:

  | Viewport | Before | After |
  | -------- | ------ | ----- |
  | 320 / 375 / 480px | 41% / 41% / 40% | 67% / 67% / 62% |
  | 768 / 919px | 27% / 22% | 32% / 23% |
  | 920 / 1024 / 1280px | 35% / 36% / 35% | 64% / 65% / 64% |
  | 1440 / 1920px | 35% / 33% | 63% / 60% |

- **6px larger, and it all goes on the left.** The band is `left: -6px;
  width: calc(100% + 6px)`, so the right edge stays flush with the viewport
  and the whole frame — clasp included — shifts 6px toward the copy, covering
  "larger" and "slightly left" with one move. The panel's width clamp gains a
  flat 6px at every stop: `clamp(346px, 44vw - 124px, 906px)`.

  `max-width: none` is required alongside it — `global.css` caps every `img` at
  `max-width: 100%`, which silently clamps `calc(100% + 6px)` back to 100%.

- **Nudged left above the breakpoint, proportionally.** `right` goes
  `clamp(24px, 5.5vw, 130px)` → `clamp(50px, 11vw - 50px, 190px)`: +0.6px at
  920px, +20px at 1280, +29px at 1440, +56px at 1920. The shift has to start
  near zero at the breakpoint, where the headline's last line already reaches
  74% of the hero, and grow only as the 1280px container starts banking gutter.
  The clasp holds at 73–77% of the hero across the whole range.

- **The panel's radial mask moves its centre right instead of tightening.**
  `radial-gradient(40% 50% at 64% 50%, …)`, holding full strength to 34%. The
  vertical stays on the frame's midline so the ellipse still reaches the top
  and bottom edges exactly; horizontally it now falls to zero at 24% across
  rather than at the left edge — that band is the near shoulder, and the only
  part of the panel the headline ever reaches.

  Steepening the ramp in place was tried first and rejected: at radii
  42% × 45% with a 26% core it hit the contrast targets, but the panel area
  reading at ≥25% photo collapsed from 34% to 11% and the backdrop stopped
  looking like a photograph. Moving the centre holds that area at 33%.

- **The band's scrim is three layers, keyed to two different things.** The band
  is sized in `vw`, so its clasp sits at a fixed ~31vw below the hero's top;
  the headline is `clamp()`-sized and starts at a near-fixed ~26–30% of the
  hero's *height*. One gradient can only track one of them, and the shipped one
  tracked the hero — which is why its light window drifted off the band and the
  clasp fell from 41% at 375px to 22% at 919px. Now: a `vw`-keyed light window
  over the band, a hero-%-keyed copy guard over the headline, and the
  horizontal composition ramp.

### Notes

- **Headline contrast improves at almost every width.** The light end of
  `--grad-text` (#E8293E) over the composite behind "impact": 3.08 / 3.45 /
  3.23 / 4.14:1 at 920 / 1280 / 1440 / 1920px, against 3.14 / 3.38 / **2.51** /
  **2.66** before — so the desktop worst case goes from 2.51:1 to 3.08:1 and
  now clears WCAG AA-large (3:1) everywhere it did not. Below the breakpoint it
  is 3.01–4.36:1, against 3.13–4.36:1. The lede never drops below 7.8:1.

- **768–919px is the one place the target is not met** (32% / 23%). The band is
  56–62% of the hero's height there and the headline sets straight over the
  handshake — about 3 percentage points of hero height separates them, and no
  gradient can open one without opening the other. At 60% the headline would
  sit on a 2.3:1 background. This is geometry, not tuning; it holds at or above
  its shipped visibility instead.

- The parallax overscan still clears: the band's worst-case top edge sits at
  −11.9px at 919px, so no white gap opens above it while scrolling.

- Verified at an emulated 919px viewport, where `max-width: 919px` and
  `min-width: 920px` both report `false` — the reason `[2.8.0]` made these
  rules mobile-first with a single `min-width` override, and why the 6px
  geometry lives in the unconditional base rule too.

## [2.8.0] — 2026-08-15 — Home hero: the whole handshake, held right of the copy

The Home hero drew its backdrop full bleed under `object-fit: cover`, and the
box that gives `useParallax` its travel was also what set the crop: only ~72%
of the photo's width survived at 1920px and ~54% at 1024px. The frame filled
with one enormous wrist and the handshake stopped reading as a handshake. The
brief was to show the whole photograph, smaller, with the clasp sitting in the
white to the right of the headline, and to take some weight out of the
right-hand side — at every width.

### Changed

- **The backdrop is never cropped, at any width.** The box is now the photo's
  own 3:2 everywhere (`height: auto`), so both cuffs and both sleeves are
  always in frame. Below the 920px nav breakpoint that means the existing band
  keeps its ratio all the way up to the breakpoint instead of capping at
  `min(66vw, 520px)` — 768–919px had been losing ~15% of the frame off the top
  and bottom.

- **Above 920px the backdrop is a panel, not a bleed.** It is held against the
  right edge and centred on the hero: `width: clamp(340px, 44vw - 130px,
  900px)`, `right: clamp(24px, 5.5vw, 130px)`, `top: 50%` with
  `margin-top: calc(var(--panel) / -3)` — half the derived height, so the
  centring costs no transform (`useParallax` owns that property). The width is
  not a plain `vw` because the container caps at 1280px: past that point every
  extra pixel of viewport is gutter, and the panel is sized to grow into it.

  The clasp sits at 52% × 50% inside the photo, so it lands at 76–78% of the
  hero's width and ~50% of its height at 1920 / 1440 / 1280 / 1024 / 920px —
  the band of white to the right of "impact", which is where the client marked
  it. The headline clears the panel's 30%-alpha contour at every one of those
  widths (measured: +140px at 1920, +1px at 1280, the tightest).

- **A radial mask keeps the panel from reading as a pasted-in rectangle.**
  `radial-gradient(52% 50% at 52% 50%, …)` — radii about the clasp, so the
  ellipse reaches exactly the left, top and bottom edges, the three that cut
  through the near suit and the far sleeve, and stops ~92% of the way to the
  right edge, which is the photo's own blown-out white and needs no help. It
  holds full strength to 42% and eases out from there, so the clasp itself is
  untouched and only its context dissolves.

- **Lighter on the right, in two places.** Backdrop opacity drops `.92` → `.82`
  (shared by both layouts), and the scrim's right-hand stops no longer clear to
  zero: `.34` at 84% and `.30` at the edge on desktop (was `.06` and `0`),
  `.16` at 62% and `.26` at the edge on the band (was `.1` and `0`). Both land
  on the photo's right third — the far sleeve, the darkest mass in the frame.
  Peak photo presence at the clasp goes from ~41% to ~36%.

- **`sizes` now describes the panel, not the viewport.** `HERO_BG_SIZES` (and
  the matching `imagesizes` on the home-only preload in `public/index.html`) is
  `(max-width: 919px) 100vw, 45vw`. The desktop backdrop never draws wider than
  900px, so `100vw` had every desktop pull the 1920w variant for a box a third
  that size.

- **`.bg` and `.scrim` are now mobile-first with a single `min-width: 920px`
  override**, rather than a `max-width: 919px` / `min-width: 920px` pair. A
  viewport at a fractional CSS width — emulation, fractional DPI, some zoom
  levels — satisfies *neither* query, and neither element carries geometry
  outside them: `.bg` would have fallen back to its intrinsic 1920px box in the
  static position. Caught in verification at an emulated 919px viewport, where
  both `matchMedia` queries reported `false`.

### Notes

- The DLS watermark keeps `0.04` above the breakpoint. Its field changed from
  photo to mostly plain white, so it was re-checked against the new stack
  rather than assumed: the composite is within a pixel value or two of what it
  was, because the mark already sat over the photo's blown-out region.
- Verified by measuring the live render at 320 / 375 / 768 / 919 / 920 / 1024 /
  1280 / 1440 / 1920px — aspect 1.5 and no horizontal overflow at all of them —
  and by compositing the exact CSS stack (photo × mask × opacity × both scrim
  gradients, over the measured copy geometry) offline at each width.

## [2.7.0] — 2026-08-14 — New Who We Serve hero backdrop, left-weighted scrim

The `/industries` hero already carried a photograph, but an Unsplash landscape
under an even tint that faded out by 75% of the width — the one hero of the
three still on the mockup's treatment. The client supplied a replacement, and
asked for the Home hero's white fade-out, at every width.

### Added

- **`public/images/hero-industries-v2.jpg` + `-1920.webp` / `-960.webp`** —
  1920×1024 / 960×512, 87 KB / 51 KB / 21 KB, from the client's 2370×1264
  master via `npm run generate:images`. The master is 1.875:1 and ships
  uncropped: the composition is already the one a left-heavy scrim is written
  against, and mirrored from the other two heroes — the hand and its dark suit
  cuff enter from the **right**, the glowing KPI ring sits centre-left, and the
  left ~15% is defocused office that the near-solid white column covers anyway.
  The large variant never upscales on a desktop hero.

### Changed

- **The Who We Serve hero's backdrop and scrim.** The backdrop box drops the
  mockup's `-18% / 136%` for the `-10% / 120%` the Home and Expertise heroes
  use — the shortest box that still covers `useParallax`'s travel, and so the
  one that crops the least — and opacity goes from `.65` to `.9`, since the
  scrim, not the opacity, is what governs how much photo reads. The scrim
  itself is no longer an even tint: it is Home's shape, near-solid white
  across the left column then a ramp that clears completely by the right edge,
  so the photo reads as one subject emerging from the page.
- **The hero's top padding is now `--copy-top` on `.hero`.** Same
  `clamp(140px, 18vh, 190px)` the mockup sets, lifted into a custom property
  because the mobile scrim needs the identical number — the same change the
  Expertise hero made in `[2.6.0]`, and for the same reason.
- **`scripts/generate-images.js`** — the retired Unsplash entry
  (`photo-1449824913935-59a10b8d2000`) is replaced by the client URL under the
  **new** `hero-industries-v2` basename. `/images/**` answers
  `public, max-age=31536000, immutable`, so the old name could not be reused
  without stranding returning visitors on the previous photo for a year —
  exactly why `hero-home` became `hero-home-v2` in `[2.5.0]`.

### Removed

- **`public/images/hero-industries.jpg` + its two WebP variants** — nothing
  references them now, and at 229 KB the 1920w was the heaviest asset in the
  folder. The replacement is 51 KB, which leaves `about-band` (107 KB) as the
  new ceiling under the 250 KB budget.

### Notes

- **Desktop scrim.** Vertical stops are the Home hero's; the horizontal ramp
  is `0.98 → 0.94 → 0.82 → 0.32 → 0.04 → 0`. **960px, not 1440px, sets it.**
  The copy here is short — two display lines that end by 48% — but the 660px
  lede does not shrink with the viewport, and at 960px the container has not
  yet hit its 1280px cap, so that lede's first line runs to **72.4%** of the
  width against 53.9% at 1440px. It is `--grey-2` at normal size, so it owes
  AA 4.5:1, and at 72.4% it sits over the suit. Holding `.82` out to 68% and
  starting the plunge at 86% keeps it on ~91% white there while still clearing
  the last tenth of the width entirely.
- **Below 920px** the backdrop re-crops to a band, as on the other two:
  `min(53vw, 300px)`. `53vw` is `1/1.875` — the photo's own aspect — so below
  the cap the band frames the entire master with nothing cropped on either
  axis (375px wide gives a 199px band against the exact-fit 200px). The cap
  does the job it does on Expertise: this hero's height barely moves across
  the mobile range (438px at 375px wide, 467px at 768px), so an uncapped
  `53vw` would be 45% of the hero at 375px but 88% at 768px. Held at 300px it
  stays between 45% and 64%, and above the cap the box is wider than the
  photo, so `cover` still keeps the full width and crops height only — 73% of
  it at 768px, which drops ceiling and desk edge and holds the hand whole.
- **Worst-case text contrast**, measured on the composited pixels at each
  element's real per-line box — 1440px / 960px / 375px / 768px: red
  `.grad-text` accent **4.1 / 4.1 / 4.4 / 4.4:1** at the bright `#E8293E` end
  of its ramp (display type; AA large wants 3:1), headline ink
  **18.6 / 18.2 / 19.7 / 19.6:1**, `--grey-2` lede
  **8.4 / 7.6 / 8.8 / 8.8:1** (AA normal wants 4.5:1), red eyebrow
  **5.2 / 5.1 / 5.2 / 5.2:1** (11px, no plate of its own). Also spot-checked
  at 1920px and at 320px, where the hero still has no horizontal overflow.

## [2.6.0] — 2026-08-14 — Expertise hero backdrop

The `/expertise` hero was type-only. The client supplied a photograph for it —
a person typing at a laptop under floating candidate/record cards — and asked
for the Home hero's white fade-out, at every width.

### Added

- **`public/images/hero-expertise.jpg` + `-1920.webp` / `-960.webp`** —
  1920×1178 / 960×589, 116 KB / 71 KB / 30 KB, from the client's 2211×1356
  master via `npm run generate:images`. The master is 1.63:1 and needs no
  re-framing: the figure already sits left with the laptop and cards
  centre-right, which is the composition a left-heavy scrim is written
  against, so it ships uncropped and the large variant never upscales.
- **A photo-name filter on `scripts/generate-images.js`** —
  `node scripts/generate-images.js hero-expertise` builds just that backdrop
  and skips the icons. Adding one photo should not re-download and re-encode
  the other three, whose bytes are already committed. A bare run still
  rebuilds everything.
- **A parallaxed backdrop + double white scrim on the Expertise hero.** Same
  structure as the Home hero — `<picture>` with a WebP `srcSet`, `.bg` under
  `.scrim`, `useParallax(parallaxPreset(-16))` — and a deliberate departure
  from `mockup/expertise.html`, which has no image here.

### Changed

- **The hero's top padding is now `--copy-top` on `.hero`.** Same
  `clamp(140px, 18vh, 190px)` the mockup sets, lifted into a custom property
  because the mobile scrim needs the identical number: it has to be opaque by
  the first line of copy, and that line starts exactly there. One declaration,
  so the two cannot drift.

### Notes

- **Desktop scrim.** Vertical stops are the Home hero's; the horizontal ramp
  is `0.98 → 0.94 → 0.76 → 0.30 → 0.03 → 0`, a long shelf then a plunge,
  rather than Home's steady fall from 58%. The accent clause
  "people, processes & performance" runs to 75% of a 1440px viewport and 81%
  at 960px — where the container has not yet hit its 1280px cap — straight
  over the near-black laptop, and red on dark needs more white under it than
  ink does. The plunge starts at 86%, clear of every glyph at every width.
- **Below 920px** the backdrop re-crops to a band, as on Home:
  `min(62vw, 340px)`. The cap is the point — this hero's height barely moves
  across the mobile range (544px at 375px wide, 552px at 768px), so an
  uncapped `62vw` would be 43% of the hero at 375px but 86% at 768px. The
  band's wash is expressed in `--band` and `--copy-top` units rather than
  percentages of a hero whose height the copy, not the viewport, decides.
- **Worst-case text contrast**, measured on the composited pixels at each
  element's real per-line box — 1440px / 960px / 375px / 768px: red accent
  **4.2 / 3.8 / 7.7 / 7.3:1** (display type; AA large wants 3:1), headline ink
  **17.1 / 16.6 / 18.2 / 17.9:1**, `--grey-2` lede **7.7 / 5.8 / 8.8 / 8.8:1**,
  red eyebrow **5.2 / 5.2 / 4.8 / 5.1:1** (12px — AA normal wants 4.5:1), and
  the `--grey-4` helper **3.3 / 3.4 / 3.4 / 3.4:1**, which is what that colour
  scores on plain white anyway.

## [2.5.0] — 2026-08-14 — New Home hero backdrop, left-weighted scrim

The client supplied a new handshake photograph for the Home hero, and asked for
the existing left-to-right treatment to be pushed further: a heavier white over
the left, clearing completely toward the right.

### Added

- **`public/images/hero-home-v2.jpg` + `-1920.webp` / `-960.webp`** — 1920×1280
  / 960×640, 71 KB / 37 KB / 14 KB. Cut from the client's 5000×1900 master by
  `npm run generate:images`.
- **`crop` and `url` source fields in `scripts/generate-images.js`.** `url`
  takes any absolute URL (the other two photos still declare an Unsplash `id`);
  `crop` is a sharp `extract` region applied to the master once, up front, so
  both WebP widths and the JPEG fallback are cut from the identical window.

### Changed

- **The Home hero backdrop.** The master is a 2.63:1 panorama — far wider than
  any box the hero draws it into, so shipping it whole would leave the 1920w
  variant 730px tall and every desktop render upscaling it ~2×. The generator
  extracts the 2850×1900 window at x 38–95%, which is **exactly 3:2 — the same
  aspect the previous backdrop shipped at**, so every crop calculation
  annotated in `HeroSection.module.css` stays true, and it frames the whole
  clasp with the near suit on the left and the far sleeve on the right.
- **The scrim is now lopsided rather than broadly even.** Desktop's horizontal
  gradient goes `0.88 → 0.70 → 0.06` (over 0–76%) → `0.98 → 0.94 → 0.55 →
  0.06 → 0` (over 0–100%): near-solid white across the whole left column, a
  long ramp that only opens past 58%, and a clean zero at the right edge. Below
  920px the band's horizontal gradient stops being a faint lift and carries the
  same reveal (`0.34 → 0.06` becomes `0.8 → 0.55 → 0.1 → 0`), so the treatment
  reads as one idea at every width. The vertical gradients are untouched.
- Worst-case text contrast over the new stack, measured on the composited
  pixels at the elements' real boxes: lede `--grey-2` **6.6:1**, headline ink
  **10.0:1**, the red `impact` accent **4.4:1**, pillars **17.2:1** — all above
  their WCAG AA thresholds, and the lede is better off than before because the
  left column is whiter than it used to be.

### Removed

- **`public/images/hero-home.jpg` + its two WebP variants.** Deleted rather
  than overwritten: `/images/**` answers `immutable, max-age=31536000`, so a
  same-name swap would leave every returning visitor on the old photograph for
  a year. Nothing references the basename any more; the three docs that cited
  `hero-home-1920.webp` as the width-suffix convention now cite
  `hero-home-v2-1920.webp`.

## [2.4.0] — 2026-08-08 — DLS hero watermark

The Home hero floated the old "D" monogram — the same Cloudinary asset the
favicon pipeline eats. The client supplied the "DLS" initialism mark, so that
watermark now draws it, self-hosted alongside the wordmark.

### Added

- **`public/images/logo/dls-mark-860.png`** — 860×460 (1.87:1), 16.3 KB PNG-8,
  flat `#ED1C24` on a real alpha channel. Cut from the client's 3646×2045
  export by trimming its uniform ~104px transparent padding down to the artwork
  bounding box, then resampling to 860w (lanczos3). Trimming is what lets a CSS
  `width` map straight onto the visible mark instead of onto padding.
- **`siteConfig.logoMark` + `MARK_SIZE`** — the same contract the wordmark uses:
  a root-relative path plus the intrinsic size, so the `<img>` reserves the
  right box before the file lands and CSS drives only the width.
- The supplied artwork already peaked at **alpha 255**, so `[2.3.0]`'s
  `×255/222` normalisation pass does not apply here. Verified before shipping
  rather than assumed.

### Changed

- **The hero watermark's width ramp: `26vw / 380px` → `30vw / 430px`.** The
  monogram is square; this lockup is 1.87:1, so at the mockup's width it would
  draw 203px tall — about half the monogram's height — and read as a stray line
  rather than a mark. 430px is also the ceiling the 860px master supports at 2×,
  so it never upscales: measured 0.5 at 1440px and 1920px, 0.27 at 768px, 0.22
  at 375px.
- **Its opacity now splits at the existing 920px breakpoint: `0.07` below,
  `0.04` above.** The monogram is a thin outlined D on a white disc, most of
  which is invisible against the page; DLS is three solid slab glyphs at 59% ink
  coverage — so the same alpha does very different things to the two marks, and
  the right value moves with the mark's size and with what sits behind it.
  Above 920px the mark is 2.3× wider over the lighter full-bleed scrim, and 0.07
  laid down ~4.7× the monogram's integrated darkening: it stopped reading as a
  watermark and read as a second headline behind the first. 0.04 brings that to
  ~2.7× with a peak darkening of 7/255 against the monogram's 18/255. Below
  920px the mark is at its 190px floor inside the photo band, where the backdrop
  re-crops and the scrim thins — 0.04 disappeared into the handshake entirely,
  so the mockup's 0.07 stays. Both values were picked off rendered ladders
  composited over the hero's real photo-plus-scrim stack at 1440px and 375px,
  not off the numbers alone. The split lands on the same breakpoint the backdrop
  already switches on, because it is that switch it is compensating for.
- **`siteConfig.logoIcon` is now a favicon/PWA/splash asset only.** It keeps its
  legacy `Dulecy-Logo-Icon_hylrpw.png` public_id and both hard-coded copies
  (`scripts/generate-icons.js`, the `public/index.html` splash) are untouched —
  but nothing in `src/` renders it any more.
- **`logoAt()` is kept with no caller**, and says so in its own doc comment. Its
  one consumer was this watermark. `logoIcon` is still live in the icon
  pipeline and this remains the only way to size it, so removing the helper
  would cost more than the six lines it saves.

### Verified

Geometry measured from the live DOM at 320 / 375 / 768 / 919 / 920 / 1440 /
1920px: no horizontal overflow at any width, no upscaling past 1:1, aspect held
at 1.870, the opacity flipping on exactly the intended side of the breakpoint
(0.07 at 919px, 0.04 at 920px), and the mark overlapping the badge pill at
375px exactly as the monogram already did — at a lower alpha than before above
920px, and the same 0.07 below it. `npm run build` with `CI=true` compiles with
no warnings. The `floaty` keyframes and the `prefers-reduced-motion` stop are
unchanged.

## [2.3.1] — 2026-08-08 — Even gradient accents

`[2.3.0]`'s companion PR (#44) set `box-decoration-break: clone` on
`.grad-text` so a wrapped red accent stopped showing one bright line above one
dark one. It fixed the banding but not the cause: the ramp was still
horizontal, so it was still as long as whatever line fragment it painted.

### Changed

- **`--grad-text` is now `linear-gradient(180deg, …)`** — vertical, where
  `mockup/styles.css` sets `120deg`. A deliberate departure, mirrored in
  `muiTheme.js`'s `gradients.text`. `--grad` (buttons, cards) stays at `135deg`;
  those boxes never fragment, so they were never affected.
- **Why the axis and not the `box-decoration-break` value.** `.grad-text` sits
  on inline `<em>`s inside display headlines, so it fragments — one box per
  wrapped line — and a CSS gradient's ramp is exactly as long as the box it
  paints. With a horizontal component, neither value works: `slice` splits one
  ramp across the lines by share, and `clone` gives each line the whole ramp but
  over its own width. On `/expertise` at 1440px that meant "people," (280px) ran
  the ramp over 286px while "processes & performance" (958px) ran it over 873px
  — **3× the rate**. "people," fell from `#E3273B` to `#AD1021` inside a single
  word, then "processes" directly beneath it snapped back to `#E6283D`.
- **Vertical removes the width term entirely.** The ramp length becomes the
  inline box height, identical for every fragment of a headline at every
  viewport. Measured on all 8 accents across `/`, `/about`, `/expertise`,
  `/industries` and `/contact` at 320 / 375 / 768 / 1440px — including the
  3-line `/expertise` wrap at 320px and the 2-line `/contact` wrap — every
  fragment of a headline now paints the same ramp with no variation along the
  line (at 1440px both `/expertise` lines run `#E7283D` → `#A90F1F` over 87px).
- **`box-decoration-break: clone` is kept but demoted.** A vertical ramp renders
  identically under both values, so the fix no longer depends on that property
  being supported anywhere; the declaration stays only to keep a future padded
  or bordered accent consistent.

## [2.3.0] — 2026-08-07 — Sharp wordmark

`[2.2.0]` shipped the wordmark from the only artwork then available — a blurred
raster lifted out of a PDF — and recorded the soft "Beyond Business Support"
line as a known limitation. The client has now supplied the real files
(3750×906 PNGs with a true alpha channel), so that limitation is resolved: the
tagline and the ™ are crisp at every size the site draws them.

### Changed

- **New masters, new filenames.** `dulcey-wordmark-1351.png` (ink `#0B0B0C`)
  and `dulcey-wordmark-white-1351.png`, 1351×200 / 6.76:1, ~21 KB each, PNG-8
  with a 128-colour palette. The `-1351` suffix is the width, matching the
  convention the rest of `/images/**` uses (`hero-home-1920.webp`).
  The 2.2.0 files are **deleted rather than overwritten**: they had already
  merged to `main` and `/images/**` answers `immutable, max-age=31536000`, so
  reusing the path would have pinned returning visitors to the blurred render
  for a year.
- **Alpha normalised to full opacity.** The supplied art paints its letterform
  interiors at alpha 222, which composites to `#212121` on white and `#DFDFDF`
  on the ink footer — a visible wash against the site's real ink. Both masters
  are rescaled `×255/222` and clamped, so the solid body reaches 255 while the
  antialiased edge ramp stays proportional. RGB is pinned to `--ink` `#0B0B0C`
  / pure white on every pixel, transparent ones included, so the downscale
  cannot pull a stray colour into the edges.
- **Cut from the shared alpha bounding box** `x179 y248 3419×506` — identical in
  both source files, so the ink and white variants stay pixel-interchangeable.
  Trimming the transparent padding takes the lockup from the raw 4.14:1 to
  6.76:1, within 4% of the 2.2.0 aspect, so the responsive sizing tuned for it
  still holds. Downscaled to height 200 with lanczos3.
- **Aspect-dependent values updated** for 6.49:1 → 6.76:1: `LOGO_SIZE` is now
  `{ width: 1351, height: 200 }`, and the rendered-width figures in the
  `Header` / `Footer` / `AdminLogin` comments (270px at 40px tall, 351px at
  52px, 230px at 34px, 196px at 29px).
- **`.mobileMenuLogo` in the admin topbar** gained the `max-width: 100%` +
  `object-fit: contain` floor every other logo surface already carried.
- **References repointed** — `siteConfig.logo` / `logoWhite`, `LOGO_FILE` in
  `scripts/generate-og.js`, and the two absolute JSON-LD `logo` URLs in
  `public/index.html`. `public/og-image.png` regenerated.

### Verified

- No horizontal overflow and the header row holds 68px at 280 / 361 / 431 /
  1280 px; the logo steps 29 → 34 → 40px across the 360px/430px breakpoints
  with 16px minimum clearance to the burger at the tightest width.
- Footer draws the white variant on `rgb(11,11,12)` and fits its 391px brand
  column; admin login draws the ink variant on white and letterboxes cleanly
  inside a 240px content box at 320px wide.

### Unchanged

- **`logoIcon` is still the old "D" monogram on Cloudinary**, so the splash
  screen and the generated favicons still do not match the wordmark. That needs
  new icon artwork from the client; `npm run generate:icons` regenerates them
  once it lands.

## [2.2.0] — 2026-08-07 — New wordmark

The brand mark changed. The old lockup — a "D" monogram with a bar-chart arrow
beside a serif "DULCEY / LEAD SERVICES" — is replaced by the supplied
sans-serif wordmark, "Dulcey Lead Services™" over "Beyond Business Support".
Both versions are self-hosted with a transparent background.

### Changed

- **`siteConfig.logo` / `logoWhite` now point at `public/images/logo/`** rather
  than Cloudinary: `dulcey-wordmark.png` (ink `#0B0B0C`) and
  `dulcey-wordmark-white.png`. One 1298×200 master each, 22 KB, PNG-8 with a
  128-colour palette — a quarter the size of the full-depth encoding and
  visually identical, since the mark is one colour at varying alpha.
- **Real alpha, no white plate.** The background is genuinely transparent, so
  the same file sits on white, `--bg-grey`, and ink. The footer draws the white
  variant on the dark panel.
- **`logoIcon` still lives on Cloudinary** and is unchanged — it drives the
  splash screen and the generated favicons. It is the *old* "D" monogram, so
  the splash and the favicon no longer match the new wordmark; regenerate them
  once the client supplies the new icon artwork.
- **Responsive sizing, because the lockup is much wider.** At 6.49:1 it draws
  ~71% wider than the old 3.79:1 mark at the same height. The header steps
  40px → 34px → 29px at 430px / 360px; the footer uses
  `clamp(38px, 8.5vw, 52px)`; the admin login card drops 48px → 40px. Every
  surface also carries `max-width: 100%` + `object-fit: contain`, so the mark
  letterboxes rather than distorting if a column ever gets narrower still.
  Verified with no horizontal overflow at 280 / 320 / 360 / 431 / 768 / 1280 px.
- **`LOGO_SIZE`** (`{ width: 1298, height: 200 }`) is exported from
  `siteConfig` and used for every `width`/`height` attribute, so the 6.49:1 box
  is reserved before the file lands.
- **`absoluteUrl()`** added to `siteConfig`. The logo values are root-relative
  now, and `seoConfig.organization.logo` — which a crawler reads — has to be
  fully qualified. The two static JSON-LD blocks in `public/index.html` were
  updated to the same absolute URL.
- **`logoAt()` returns non-Cloudinary URLs untouched** instead of silently
  no-op'ing through a `.replace()` that can never match. The wordmark call
  sites now reference `siteConfig.logo*` directly.
- **`npm run generate:og` reads the wordmark off disk** rather than fetching it,
  so it no longer needs the network; `public/og-image.png` regenerated.

### Known limitation — resolved in [2.3.0]

- **The "Beyond Business Support" line in the lockup is soft.** The only
  artwork supplied was a blurred raster embedded in a PDF (a 1945×356 ink map
  whose peak ink varies with stroke size — 242 on the wordmark, 167 on the
  tagline, 94 on the ™). In that source the tagline's letterforms have already
  merged: a horizontal profile across its x-height never dips between letters,
  only at the word spaces. That is unrecoverable by processing — local-max
  normalisation just blooms the merged letters into blobs. The large wordmark
  itself resamples cleanly. Replace with a vector original when one is
  available; **ship it under a new filename**, since `/images/**` is served
  `immutable`.

## [2.1.2] — 2026-08-06 — Open ampersand

Archivo draws its ampersand as a closed, rotated-8 form with no diagonal leg. It
reads as a stylistic tic rather than an `&` — most visibly in "Schools **&**
Colleges", "HR **&** People Management", and the stroke-only "**&** Priorities"
word in the About band. Fixed site-wide by widening the existing Inter subset by
one glyph, without changing the typeface.

### Changed

- **Ampersand is now the conventional open `&` everywhere.** The Google Fonts
  request that already carried the round full stop is now subset with
  `text=.%26`, so Google ships a 2.2 KB Inter file (up from 1.6 KB) whose
  `@font-face` rules carry `unicode-range: U+26, U+2e`. `'Inter'` was already at
  the head of the sans stacks, so no stack, class, or markup changed — every
  other character still falls through to Archivo. Verified at 375 / 760 /
  1280 px.
- Updated in the same five places the full stop is declared: the `@import` in
  `src/styles/global.css`, the preload + `<noscript>` links in
  `public/index.html`, and the preload list in `src/index.js` (URLs), plus the
  explanatory comments on `--font-primary` (`src/styles/variables.css`) and
  `FONT_SANS` (`src/theme/muiTheme.js`).
- The `%26` must stay percent-encoded — a bare `&` terminates the `text` query
  param, which silently drops the ampersand from the subset while leaving the
  period working.
- `--font-serif` left untouched. Instrument Serif's italic ampersand is a
  deliberate calligraphic form, so `/expertise`'s serif-italic hero line
  ("people, processes & performance.") keeps it.

## [2.1.1] — 2026-08-06 — Round full stop

Archivo draws its period as a hard square. At display sizes — "offer services**.**
We deliver _impact_**.**" in the home hero — it reads as a rendering defect
rather than a typographic choice. Fixed site-wide without changing the typeface.

### Changed

- **Full stop is now round everywhere.** A Google Fonts request subset with
  `text=.` ships a single 1.6 KB Inter glyph whose `@font-face` rules carry
  `unicode-range: U+2e`. Putting `'Inter'` at the head of the sans stacks
  overrides Archivo's square period and nothing else — every other character
  still falls through to Archivo, so headline, body, and admin type are
  pixel-identical apart from the dot. Verified at 375 / 760 / 1280 px.
- Declared in `--font-primary` / `--font-heading` / `--font-body`
  (`src/styles/variables.css`), `FONT_SANS` (`src/theme/muiTheme.js`), the
  `@import` in `src/styles/global.css`, the preload + `<noscript>` links and the
  four splash-screen `font-family` rules in `public/index.html`, and the preload
  list in `src/index.js`.
- `--font-serif` left untouched — Instrument Serif's period is already round.

## [2.1.0] — 2026-08-02 — Brand spelling correction: Dulecy → Dulcey

The client's brand name is **Dulcey**, not "Dulecy" — the rebuild had carried
the wrong spelling throughout. Corrected everywhere, and the site URL moved to
the brand's actual domain.

### Changed

- **Brand name** — every occurrence of `Dulecy` / `dulecy` / `DULECY` rewritten
  to `Dulcey` / `dulcey` / `DULCEY` across `src/`, `public/`, `scripts/`,
  `/mockup`, `/prompts`, and all documentation (80 files). This includes
  `siteConfig.legalName` / `brandName`, page titles, meta descriptions, the
  five JSON-LD blocks in `public/index.html`, `manifest.json`, the footer
  watermark, and the admin panel.
- **Site URL** — `https://www.dulecy.com` → `https://www.dulceyleadservices.com`
  in `siteConfig.siteUrl`, and therefore in every canonical, OG/Twitter URL and
  schema `url` derived from it, plus `public/sitemap.xml`, `public/robots.txt`
  and the static head in `public/index.html`.
- **Logo assets** — `siteConfig.logo` and `siteConfig.logoWhite` re-pointed to
  the new Dulcey-spelled artwork (`v1785682949/Dulcey-Logo_tmkfku.png` and
  `v1785682948/Dulcey-Logo-White_pthxu2.png`). The previous commit had updated
  `/mockup` and the generator scripts but left `siteConfig.js` on the superseded
  `_qr2ka7` / `_uxpsb6` uploads, so the header, footer, admin topbar and login
  card were still serving the old logos.
- **`src/styles/dulecy.css` → `src/styles/dulcey.css`** (import in
  `src/index.js` and the module comments that reference it updated).
- **`public/og-image.png`** regenerated — the wordmark, headline and site URL
  are drawn into the PNG, so the old spelling was baked in.
- **`package.json`** `name` → `dulcey-lead-services-website`, description and
  the `dulecy` keyword.

### Unchanged (deliberately)

- **`siteConfig.logoIcon`** keeps the public_id `Dulecy-Logo-Icon_hylrpw.png`.
  That string is Cloudinary's immutable delivery path for the "D" mark, not a
  brand string — rewriting it would 404 the favicon/PWA icon source. The
  generated icons in `public/` are unaffected and were not regenerated.
- **Admin credentials** — `dulecyadmin` and the `Dulecy@Admin2026` fallback in
  `src/admin/utils/adminAuth.js` are left as-is so the rebrand does not
  invalidate operator logins. Rotate them deliberately, not as a side effect.
- **Lead record field keys, status `value` keys, and the `leads.php` contract**
  — untouched; only comments in those files changed.
- **`dulceyleadservices@gmail.com`** — already the correct spelling, so the
  "intentional misspelling" caveat that used to guard it has been removed from
  `CLAUDE.md`, `CUSTOMIZATION_GUIDE.md` and the prompt docs.

## [2.0.0] — 2026-08-02 — Dulcey Lead Services rebuild

Converted the repository into the production website for **Dulcey Lead
Services**, matching the static design source in `/mockup` — five public pages,
a new enquiry flow, and a rebranded admin panel — while reusing the existing
lead-storage pipeline unchanged.

### 01 — Brand foundation & configuration

**Changed**
- `src/data/siteConfig.js` re-pointed to Dulcey: brand/legal name, tagline
  "Beyond Business Support" + `taglineSecondary`, phone `+91 70990 02522`,
  `dulceyleadservices@gmail.com`, `https://www.dulceyleadservices.com`,
  and the three Cloudinary logos (adds `logoIcon`).
- `src/styles/variables.css` gained the mockup's Dulcey token block (ink, the
  grey ramp, `--line`, `--bg-grey`, `--red`, `--red-hi`, the two gradients) and
  re-pointed every legacy alias family — including `--admin-*` — onto it;
  `src/theme/muiTheme.js` mirrors it.
- Typography switched to **Archivo** + **Instrument Serif**.
- Rotated the admin credentials and the 48-char `REACT_APP_LEADS_ADMIN_KEY`,
  mirrored byte-for-byte into the committed fallback in `public/api/leads.php`.

### 02 — Routing shell, header, mobile menu & footer

**Added**
- Five public routes — `/`, `/about`, `/expertise`, `/industries` (nav label
  "Who We Serve"), `/contact` — plus a branded `*` NotFound, all inside one
  `PublicLayout` so the shell mounts once. Home is eager; the rest are lazy.
- `Header` (fixed 68px, 920px nav breakpoint), the full-screen `MobileMenu`,
  and the dark `Footer`, all mapping over the new `src/data/navigation.js`.
- `ScrollManager`: top on route change, or a poll-until-mounted hash scroll
  (90px header offset) for the `/expertise` deep links.

### 03 — Home page

**Added**
- Seven sections ported 1:1 from `mockup/index.html`: hero (parallax backdrop,
  staggered intro), the rotated marquee strip, Who We Are, the dark Belief band,
  the ten-row expertise index (deep-linking to `/expertise#e01`–`#e10`), the
  seven sector cards, and the closing CTA.
- The shared data layer (`expertiseData.js`, `industriesData.js`) and the GSAP
  hooks that Prompts 04–06 reuse.

### 04 — About page

**Added**
- Six sections ported from `mockup/about.html`: type-only hero, the dark
  Intersection band, Perspective, Difference, Principles, and the Commitment
  CTA — verbatim copy and the mockup's exact motion.

### 05 — Expertise page

**Added**
- Hero, the ten-area single-open accordion with working `#e01`–`#e10` deep
  links (matching-hash-wins on load, `ScrollTrigger.refresh()` on every toggle),
  and the grey "Start with a conversation" CTA.

### 06 — Who We Serve & Contact pages

**Added**
- `/industries`: hero, the seven sector cards plus the red gradient CTA card,
  and the split CTA section.
- `/contact`: the reply-time badge and headline, the phone/email cards, the
  pull quote, and the grey enquiry panel — from `mockup/contact.html`.

### 07 — Unified lead form & enquiry modal

**Changed**
- `UnifiedLeadForm` rewritten as a 1:1 port of the mockup's `.lead-form` (plain
  inputs + CSS Modules, no MUI). Fields: name\*, email\*, phone, organization,
  "what do you need support with?"\*, message — options come from
  `expertiseData` titles + "Something else". Success renders inline.
- Lead contract: adds the optional `organization` key, makes `email` required
  and `mobile` optional, and sends `state` empty. No other key changed and
  `public/api/leads.php` needed no edit (the store is schemaless).
- `ModalContext`: `openLeadDrawer`/`closeLeadDrawer` → `openLeadModal`/
  `closeLeadModal`; scroll lock moved into the new component.

**Added**
- `LeadModal` — a centered modal (portal, backdrop/✕/Escape close, focus trap +
  restore, reduced-motion aware) replacing the side drawer.
- `getOptionalMobileErrorMessage()` in `src/utils/validators.js`.

**Removed**
- The `/thank-you` route — the form now confirms in place.

### 08 — Admin panel

**Changed**
- Login, topbar, dashboard and the guideline gate read the logo and brand name
  from `siteConfig`; admin `.module.css` files swept onto the Dulcey tokens.
- Lead surfaces reshaped around the Prompt 07 payload: an **Organization**
  column replaces State in Lead Management, Lead Detail and the dashboard
  tables, with a new "Interested In" filter and organization folded into search.
- Status **labels** re-mapped onto the consulting pipeline — notably
  `consultation_booked` → "Proposal Sent" and `procedure_scheduled` →
  "Follow-Up". The persisted `value` keys are unchanged.
- The four Guidelines tabs rewritten for Dulcey.

### 09 — Animation & interaction parity

**Fixed**
- `scheduleRefresh()` coalesces a burst of `ScrollTrigger.refresh()` calls into
  one per frame (a Home commit was running 20 full re-measures).
- Refresh on modal open/close (the scroll lock collapses the document) and once
  on window `load`.
- `.link-more` no longer inherits the legacy global 150ms link transition.
- Remaining motion that ignored `prefers-reduced-motion`.

### 10 — SEO

**Changed**
- `src/config/seo.js` rebuilt around `siteConfig` / `expertiseData` /
  `industriesData` / `navigation`: per-route title, description, canonical,
  robots and derived keywords for the five pages, plus `noindex` admin and 404
  entries.
- `src/utils/seo.js` now emits Organization, WebSite, WebPage, BreadcrumbList
  and an `ItemList` of ten `Service` items (each deep-linked to
  `/expertise#eNN`), keeping the same-id injection contract with the static
  blocks in `public/index.html`.
- `robots.txt` and a five-URL `sitemap.xml`; regenerated favicons, PWA icons and
  the OG image from the Dulcey logo.

**Removed**
- `FAQPage`, `LocalBusiness`, `PostalAddress`, geo coordinates, opening hours
  and `areaServed` — the site has no visible FAQ and no public postal address,
  so emitting them would be fabricated.

### 11 — Legacy purge & cleanup

**Removed**
- The previous site's section components, floating UI (mobile drawer, WhatsApp
  FAB, scroll progress, back-to-top), the retired `/thank-you` page and the
  `LeadFormDrawer`.
- Eight orphaned `src/data/*.js` content modules, `useCountUp`, `DURATION.fast`,
  an unused `SectionLoader` variant, **framer-motion**, and 41 dead CSS aliases.
- The last legacy brand strings — comments included — bringing the repo-wide
  count to zero outside `/mockup` and `/prompts`.

### 12 — Assets, performance & accessibility

**Changed**
- Every Unsplash and icons8 hotlink replaced with a first-party asset:
  `npm run generate:images` emits WebP at 1920w/960w plus a JPEG fallback into
  `public/images/` (heaviest photo 229 KB).
- `logoAt()` requests right-sized Cloudinary logos (`f_auto,q_auto:best` at 2×
  the CSS box) — the colour logo went 282 KB → 7 KB — and the home hero is
  preloaded for LCP.
- SweetAlert2 is loaded on first use, and the whole `/admin` tree moved behind a
  single `lazy()` boundary via `AdminLoginRoute` / `AdminProtectedShell`, so
  neither ships in the public bundle.

**Fixed**
- WCAG 2.1 AA sweep: contrast, heading order and focus management. axe-core
  reports zero violations across all five routes, the open modal and the mobile
  menu; Lighthouse Accessibility 100 on every route.

**Added**
- A "Caching & compression" block in the admin Deployment guide (the `.htaccess`
  itself lands with Prompt 14).

### 13 — Documentation

**Changed**
- Rewrote `README.md`, `CLAUDE.md`, `CHANGELOG.md`, `CUSTOMIZATION_GUIDE.md` and
  `SEO_GUIDE.md` for the Dulcey codebase — routes, data layer, animation
  parameters, the lead-storage contract, the design tokens and the SEO system
  all verified against the code rather than carried over. No source changes.

### 14 — Production readiness & final QA

**Added**
- `public/.htaccess` — the Apache configuration, copied into `build/` by
  `npm run build` so a normal upload installs it. Carries the SPA rewrite with
  an `^api/` exclusion (a blanket fallback would serve `index.html` to
  `/api/leads.php` and lose every enquiry silently), immutable caching for
  `/static/**` and `/images/**`, `no-cache` for `index.html`, `Options -Indexes`
  and a dotfile block that deliberately spares `/.well-known/` so Let's Encrypt
  renewal keeps working. Every rule is commented with the reason it exists.
- A first-launch **go-live checklist** in the admin Deployment guide: rotate the
  admin password and leads key, align or delete `api/config.php`, rebuild,
  upload, confirm `action=health` returns JSON, run a real test lead, verify
  deep-link refresh, force the `https` + `www` canonical host, submit the
  sitemap.

**Changed**
- The Deployment guide no longer tells operators to hand-write `.htaccess`; it
  now documents the shipped file and warns that FTP clients routinely skip
  dotfiles. `README.md` gained the matching pointer.

**Fixed**
- **Cross-tab admin sync never actually converged.** Two bugs stacked on top of
  each other, both surfaced by the Prompt 14 QA pass:
  1. `onLeadsChanged` treated the same-tab event and the BroadcastChannel
     message identically, calling the handler straight away. But `_cache` is
     per-JS-context, so a tab receiving a broadcast just re-read its own stale
     copy and rendered the same thing. The broadcast path now re-syncs from the
     server first, and is deliberately not visibility-gated.
  2. `notifyLeadsChanged()` fired *before* `callLeadsApi()` sent the write, so
     even a correct listener fetched a server snapshot that predated the change
     — and, the broadcast already consumed, stayed stale until its next poll.
     Notification is now split: `notifyLeadsChanged()` for this tab (the cache
     is already updated optimistically) and `broadcastLeadsChanged()` for
     siblings, fired only once the server write resolves.

  A note or status change made in one tab now appears in another within one
  request, verified with both tabs hidden and never focused so neither the 15 s
  poll nor the focus sync could mask the result. No localStorage copy of leads
  was introduced; the server remains the single source of truth.
- Ordering bug in the first draft of `public/.htaccess`: the `LONG_CACHE`
  tagging rules sat *after* the "serve real files" rule, which ends in `[L]` and
  stops rewrite processing — so `/static/**` and `/images/**` would never have
  been tagged and the immutable `Cache-Control` header would never have applied.
  Caught by QA before merge; the tagging now runs first.
