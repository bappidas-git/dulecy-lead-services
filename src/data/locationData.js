/* ============================================
   locationData — Nilachal Infracon office & reach
   --------------------------------------------
   Contact/address facts are pulled from siteConfig (the single source of
   truth); this file only shapes them for the Location/Contact sections and
   lists the Northeast states served. Keys `name`, `address`, `phone`,
   `phoneDisplay`, `whatsapp`, `servingStates` are bound by consumers.
   ============================================ */

import { siteConfig, fullAddress } from './siteConfig';

export const locationData = {
  name: siteConfig.legalName,
  address: fullAddress,
  city: siteConfig.address.city,
  state: siteConfig.address.state,
  phone: siteConfig.phone,
  phoneDisplay: siteConfig.phoneDisplay,
  whatsapp: siteConfig.whatsapp,
  mapsQuery: siteConfig.mapsQuery,
  servingStates: [
    'Assam',
    'Arunachal Pradesh',
    'Meghalaya',
    'Manipur',
    'Mizoram',
    'Nagaland',
    'Tripura',
    'Sikkim',
  ],
};

export default locationData;
