/* ============================================
   servicesData — Nilachal Infracon construction services
   --------------------------------------------
   The services offered by Nilachal Infracon, consumed by
   ServicesSection (and its JSON-LD Service schema).
   Shape: { id, name, shortName, target, scope, description,
            features[4], badge, icon }.
   `badge` is a short label or null. `scope` summarises the
   engagement (previously `duration`).
   ============================================ */

export const servicesData = [
  {
    id: 'residential-projects',
    name: 'Residential Projects',
    shortName: 'Residential',
    target: 'Homeowners & housing developers',
    scope: 'Foundation to finishing',
    description:
      'Independent homes, apartments and housing developments — from foundation to finish.',
    features: [
      'Turnkey home construction & delivery',
      'Quality-checked materials at every stage',
      'Transparent costing and timelines',
      'On-site supervision from start to handover',
    ],
    badge: 'Most Popular',
    icon: 'mdi:home-city-outline',
  },
  {
    id: 'commercial-buildings',
    name: 'Commercial Buildings',
    shortName: 'Commercial',
    target: 'Businesses, retailers & offices',
    scope: 'Design-led commercial builds',
    description:
      'Offices, showrooms, retail spaces and commercial complexes built to perform and impress.',
    features: [
      'Showrooms, offices & retail complexes',
      'Durable, high-footfall finishes',
      'Schedule-driven project execution',
      'Compliant, safety-first construction',
    ],
    badge: null,
    icon: 'mdi:office-building-outline',
  },
  {
    id: 'institutional-projects',
    name: 'Institutional Projects',
    shortName: 'Institutional',
    target: 'Schools, hospitals & government bodies',
    scope: 'Large-format institutional builds',
    description:
      'Schools, hospitals, campuses and public buildings delivered to institutional standards.',
    features: [
      'Educational & healthcare facilities',
      'Robust, long-life structural systems',
      'Accessibility and code compliance',
      'Coordinated multi-stakeholder delivery',
    ],
    badge: null,
    icon: 'mdi:bank-outline',
  },
  {
    id: 'renovation-maintenance',
    name: 'Renovation & Maintenance',
    shortName: 'Renovation',
    target: 'Existing property owners',
    scope: 'Upgrades, repairs & upkeep',
    description:
      'Refresh, repair and upgrade existing spaces — from interiors to structural maintenance.',
    features: [
      'Interior and exterior renovation',
      'Structural repair and reinforcement',
      'Waterproofing and finishing upgrades',
      'Scheduled maintenance support',
    ],
    badge: null,
    icon: 'mdi:home-edit-outline',
  },
  {
    id: 'project-management',
    name: 'Project Management',
    shortName: 'Project Mgmt',
    target: 'Owners seeking end-to-end delivery',
    scope: 'Planning to completion',
    description:
      'End-to-end planning, procurement and site management that keeps projects on time and on budget.',
    features: [
      'Planning, budgeting and scheduling',
      'Material procurement and vendor management',
      'Quality control and progress tracking',
      'Single point of accountability',
    ],
    badge: null,
    icon: 'mdi:clipboard-check-outline',
  },
];

export default servicesData;
