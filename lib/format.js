export const money = (n) => '৳' + (Number(n) || 0).toLocaleString('en-IN');
export const FREE_SHIPPING_AT = 5000;
export const SHIPPING_FEE = 120;
export const shippingFor = (subtotal) => (subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE);
export const CATEGORIES = [
  { key: 'lamps', label: 'Lamps', image: '/images/category-lamps.webp' },
  { key: 'mirrors', label: 'Mirrors', image: '/images/category-mirrors.webp' },
  { key: 'accessories', label: 'Accessories', image: '/images/category-accessories.webp' },
  { key: 'beauty', label: 'Beauty', image: '/images/category-beauty.webp' },
  { key: 'clothes', label: 'Clothes', image: '/images/category-clothes.webp' },
];
