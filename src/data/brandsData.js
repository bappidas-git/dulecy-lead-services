/* ============================================
   brandsData — Partner / stocked brands
   --------------------------------------------
   The brands carried by North East Buildmart, rendered by the Brands
   section (prompt 09). `logoFile` points to a transparent PNG under
   /images/brands/. When the file is missing the Brands section renders a
   styled text wordmark instead, so no placeholder images are required.
   Shape: { id, name, logoFile }.
   ============================================ */

export const brandsData = [
  { id: 'sail', name: 'SAIL', logoFile: '/images/brands/sail.png' },
  { id: 'ultratech-cement', name: 'UltraTech Cement', logoFile: '/images/brands/ultratech-cement.png' },
  { id: 'dalmia-cement', name: 'Dalmia Cement', logoFile: '/images/brands/dalmia-cement.png' },
  { id: 'galaxy-cement', name: 'Galaxy Cement', logoFile: '/images/brands/galaxy-cement.png' },
  { id: 'simpolo', name: 'Simpolo', logoFile: '/images/brands/simpolo.png' },
  { id: 'solorex', name: 'Solorex', logoFile: '/images/brands/solorex.png' },
  { id: 'jaquar', name: 'Jaquar', logoFile: '/images/brands/jaquar.png' },
  { id: 'belz-vanity', name: 'BELZ Vanity', logoFile: '/images/brands/belz-vanity.png' },
  { id: 'oyster-bath-tubs', name: 'Oyster Bath Tubs', logoFile: '/images/brands/oyster-bath-tubs.png' },
  { id: 'corsa', name: 'Corsa', logoFile: '/images/brands/corsa.png' },
  { id: 'petra-steel-doors', name: 'Petra Steel Doors', logoFile: '/images/brands/petra-steel-doors.png' },
  { id: 'apl-apollo', name: 'APL Apollo', logoFile: '/images/brands/apl-apollo.png' },
];

export default brandsData;
