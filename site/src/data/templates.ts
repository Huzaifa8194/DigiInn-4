export const templateCatalog = 'https://templates.digiinn360.com/';

export const templates = [
  ['toy-shop', 'Pebble & Pine', 'Toy shop', 'A toy storefront with a gift finder, wishlists, order tracking and stock management.'],
  ['garment-store', 'Threadline', 'Garment store', 'A clothing store with size and colour variants, returns and a point of sale that shares stock with the website.'],
  ['electronics-store', 'Circuit House', 'Electronics store', 'An electronics catalogue with product comparison, instalment estimates, warranty tracking and repair tickets.'],
  ['oil-filter-store', 'FilterWorks', 'Automotive retail', 'A parts store with vehicle fitment search, part-number lookup and wholesale pricing.'],
  ['restaurant', 'Ember & Salt', 'Restaurant', 'Online reservations and ordering alongside table service, kitchen screens and delivery dispatch.'],
  ['fastfood', 'Bun Theory', 'Quick service', 'Self-service ordering, counter checkout and kitchen and pickup screens.'],
  ['clinic', 'Meridian Clinic', 'Clinic management', 'Appointments, reception queues, consultations, lab results and a patient portal.'],
  ['pharmacy', 'Greenleaf Pharmacy', 'Pharmacy', 'A pharmacy storefront and point of sale with batch tracking, expiry checks and supplier purchasing.'],
  ['manufacturing', 'Forgeline', 'Manufacturing', 'Production planning, work orders, quality checks and dispatch for a shop floor.'],
  ['inventory', 'Stockroom', 'Inventory management', 'Warehouse transfers, cycle counts, purchase orders and barcode-based stock tracking.'],
].map(([slug, title, category, summary]) => ({
  title,
  category,
  summary,
  href: new URL(`${slug}/index.html`, templateCatalog).href,
  image: new URL(`assets/previews/${slug}.png`, templateCatalog).href,
}));
