/* ============================================
   statsData — Nilachal Infracon headline metrics
   --------------------------------------------
   Consumed by StatsSection. Each `stat` string MUST start with a
   number so the ScrollTrigger counter (parseStatValue / useCountUp)
   can animate it. Shape: { id, icon, title, description, stat, statLabel }.
   ============================================ */

export const statsData = [
  {
    id: 1,
    icon: 'mdi:calendar-star',
    title: 'A Decade of Building Experience',
    description:
      'Over ten years serving Northeast India with dependable infrastructure and building materials.',
    stat: '10+',
    statLabel: 'Years of Experience',
  },
  {
    id: 2,
    icon: 'mdi:package-variant-closed',
    title: 'A Wide Product Range',
    description:
      'Thousands of products and solutions across doors, tiles, sanitaryware, cement, steel and more.',
    stat: '5000+',
    statLabel: 'Products & Solutions',
  },
  {
    id: 3,
    icon: 'mdi:account-group',
    title: 'Trusted by Thousands',
    description:
      'Homeowners, builders and businesses across the region rely on us for quality and service.',
    stat: '5000+',
    statLabel: 'Happy Customers',
  },
  {
    id: 4,
    icon: 'mdi:map-marker-radius',
    title: 'Serving the Northeast',
    description:
      'A growing supply network reaching customers and projects across the Northeastern states.',
    stat: '7+',
    statLabel: 'States Served in Northeast India',
  },
  {
    id: 5,
    icon: 'mdi:shield-check',
    title: 'Assured Quality',
    description:
      'Every product is genuine and quality-checked, so you build with complete confidence.',
    stat: '100%',
    statLabel: 'Quality Assurance',
  },
];

export default statsData;
