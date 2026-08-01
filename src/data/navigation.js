/* ============================================
   navigation — single source of truth for site nav
   --------------------------------------------
   The desktop nav (Header), the full-screen MobileMenu and the
   footer "Explore" column all map over this one list, so a route
   is added/renamed in exactly one place.

   `num` is the 01–05 index the mobile menu prints before each label.
   ============================================ */

export const NAV_LINKS = [
  { to: '/', label: 'Home', num: '01' },
  { to: '/about', label: 'About', num: '02' },
  { to: '/expertise', label: 'Expertise', num: '03' },
  { to: '/industries', label: 'Who We Serve', num: '04' },
  { to: '/contact', label: 'Contact', num: '05' },
];

export default NAV_LINKS;
