export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';

export const wasteCategories = [
  { id: 'mobile', label: 'Mobile Phone', emoji: '📱' },
  { id: 'laptop', label: 'Laptop', emoji: '💻' },
  { id: 'battery', label: 'Battery', emoji: '🔋' },
  { id: 'charger', label: 'Charger', emoji: '🔌' },
  { id: 'keyboard', label: 'Keyboard', emoji: '⌨️' },
  { id: 'monitor', label: 'Monitor', emoji: '🖥️' },
  { id: 'printer', label: 'Printer', emoji: '🖨️' },
  { id: 'router', label: 'Router', emoji: '📡' },
  { id: 'headphones', label: 'Headphones', emoji: '🎧' },
  { id: 'other', label: 'Other', emoji: '♻️' },
];

export const conditions = [
  { id: 'working', label: 'Working' },
  { id: 'not-working', label: 'Not Working' },
];

export const actions = {
  SELL: 'sell',
  DONATE: 'donate',
  RECYCLE: 'recycle',
};

export const badges = {
  firstDonation: {
    id: 'first-donation',
    name: 'First Device Donated',
    icon: '🎁',
    description: 'Donated your first e-waste item',
  },
  firstRecycle: {
    id: 'first-recycle',
    name: 'First Device Recycled',
    icon: '♻️',
    description: 'Recycled your first e-waste item',
  },
  ecoWarrior1: {
    id: 'eco-warrior-level-1',
    name: 'Eco Warrior Level 1',
    icon: '🌱',
    description: 'Donated or recycled 5 items',
  },
  ecoWarrior2: {
    id: 'eco-warrior-level-2',
    name: 'Eco Warrior Level 2',
    icon: '🌿',
    description: 'Donated or recycled 10 items',
  },
  collector: {
    id: 'collector',
    name: 'Super Collector',
    icon: '🏆',
    description: 'Collected 20 items',
  },
};
