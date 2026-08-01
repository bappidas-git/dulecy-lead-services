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

   `icon` keeps the mockup's icons8 CDN URL for pixel parity; the assets
   are self-hosted in Prompt 12.
   ============================================ */

export const industries = [
  {
    num: '01',
    name: 'Pharmaceutical & Healthcare Organizations',
    description:
      'Specialized business expertise supported by HR, analytics, administration, training, and management experience.',
    icon: 'https://img.icons8.com/ios-filled/100/D5192E/pill.png',
    homeTitle: 'Pharmaceutical & Healthcare',
    homeDesc: 'Specialized business expertise with real industry depth.',
  },
  {
    num: '02',
    name: 'Hospitals & Healthcare Institutions',
    description:
      'HR, leadership, professional development, communication, and organizational capability programs.',
    icon: 'https://img.icons8.com/ios-filled/100/D5192E/hospital-3.png',
    homeTitle: 'Hospitals & Healthcare Institutions',
    homeDesc: 'HR, leadership, and capability programs.',
  },
  {
    num: '03',
    name: 'Corporate Organizations',
    description:
      'HR management, leadership development, professional training, business analytics, and organizational support.',
    icon: 'https://img.icons8.com/ios-filled/100/D5192E/company.png',
    homeTitle: 'Corporate Organizations',
    homeDesc: 'HR, analytics, training, and organizational support.',
  },
  {
    num: '04',
    name: 'Marketing & Sales Organizations',
    description:
      'Leadership, team development, performance management, communication, and professional capability building.',
    icon: 'https://img.icons8.com/ios-filled/100/D5192E/commercial.png',
    homeTitle: 'Marketing & Sales Organizations',
    homeDesc: 'Performance, leadership, and team development.',
  },
  {
    num: '05',
    name: 'Business Schools & Colleges',
    description:
      'Leadership, employability, professional development, business skills, and industry-oriented learning.',
    icon: 'https://img.icons8.com/ios-filled/100/D5192E/graduation-cap.png',
    homeTitle: 'Business Schools & Colleges',
    homeDesc: 'Employability and industry-oriented learning.',
  },
  {
    num: '06',
    name: 'Startups & Growing Businesses',
    description:
      'HR systems, administration, business management, analytics, corporate documentation, and strategic support.',
    icon: 'https://img.icons8.com/ios-filled/100/D5192E/rocket.png',
    homeTitle: 'Startups & Growing Businesses',
    homeDesc: 'Systems, documentation, and strategic support.',
  },
  {
    num: '07',
    name: 'Entrepreneurs & Investors',
    description:
      'Business setup, corporate documentation, intellectual property support, business management, and strategic assistance.',
    icon: 'https://img.icons8.com/ios-filled/100/D5192E/briefcase.png',
    homeTitle: 'Entrepreneurs & Investors',
    homeDesc: 'Setup, IP support, and strategic assistance.',
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
