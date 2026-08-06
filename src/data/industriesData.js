/* ============================================
   industriesData — the seven sectors we serve
   --------------------------------------------
   One record per sector, serving two pages with different copy, both
   verbatim from the mockup:
   - /industries (`mockup/industries.html`) reads `num`, `name`,
     `description`, `icon` for the full sector cards.
   - The home page (`mockup/index.html`) reads `homeTitle` / `homeDesc`
     for the short cards — e.g. "Pharmaceutical & Healthcare Organizations"
     shortens to "Pharmaceutical & Healthcare".

   `icon` points at the self-hosted copy of the mockup's icons8 glyph
   (Prompt 12) — byte-identical downloads, so the rendered card is
   unchanged. Refresh them with `npm run generate:images`.

   ⚠️ Array order IS the display order, on both pages and at every
   breakpoint (the two grids are `auto-fit`, so DOM order is visual
   order). It is a deliberate business-priority sequence and no longer
   matches `/mockup`'s order — do not "restore" it to mockup parity.
   `num` is renumbered 01–07 to follow it, so the /industries cards
   still read 01, 02, 03… down the grid.
   ============================================ */

export const industries = [
  {
    num: '01',
    name: 'Corporate Organizations',
    description:
      'HR management, leadership development, professional training, business analytics, and organizational support.',
    icon: '/images/icons/company-d5192e.png',
    homeTitle: 'Corporate Organizations',
    homeDesc: 'HR, analytics, training, and organizational support.',
  },
  {
    num: '02',
    name: 'Marketing & Sales Organizations',
    description:
      'Leadership, team development, performance management, communication, and professional capability building.',
    icon: '/images/icons/commercial-d5192e.png',
    homeTitle: 'Marketing & Sales Organizations',
    homeDesc: 'Performance, leadership, and team development.',
  },
  {
    num: '03',
    name: 'Startups & Growing Businesses',
    description:
      'HR systems, administration, business management, analytics, corporate documentation, and strategic support.',
    icon: '/images/icons/rocket-d5192e.png',
    homeTitle: 'Startups & Growing Businesses',
    homeDesc: 'Systems, documentation, and strategic support.',
  },
  {
    num: '04',
    name: 'Pharmaceutical & Healthcare Organizations',
    description:
      'Specialized business expertise supported by HR, analytics, administration, training, and management experience.',
    icon: '/images/icons/pill-d5192e.png',
    homeTitle: 'Pharmaceutical & Healthcare',
    homeDesc: 'Specialized business expertise with real industry depth.',
  },
  {
    num: '05',
    name: 'Entrepreneurs & Investors',
    description:
      'Business setup, corporate documentation, intellectual property support, business management, and strategic assistance.',
    icon: '/images/icons/briefcase-d5192e.png',
    homeTitle: 'Entrepreneurs & Investors',
    homeDesc: 'Setup, IP support, and strategic assistance.',
  },
  {
    num: '06',
    name: 'Hospitals & Healthcare Institutions',
    description:
      'HR, leadership, professional development, communication, and organizational capability programs.',
    icon: '/images/icons/hospital-3-d5192e.png',
    homeTitle: 'Hospitals & Healthcare Institutions',
    homeDesc: 'HR, leadership, and capability programs.',
  },
  {
    num: '07',
    name: 'Business Schools & Colleges',
    description:
      'Leadership, employability, professional development, business skills, and industry-oriented learning.',
    icon: '/images/icons/graduation-cap-d5192e.png',
    homeTitle: 'Business Schools & Colleges',
    homeDesc: 'Employability and industry-oriented learning.',
  },
];

/** The ink marquee strip under the home hero (`mockup/index.html`). */
export const marqueeItems = [
  'Pharmaceutical & Healthcare',
  'Hospitals',
  'Corporates',
  'Marketing & Sales Teams',
  'Business Schools',
  'Startups',
  'Entrepreneurs & Investors',
];

export default industries;
