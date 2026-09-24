// Shared surplus listings store (mirrors what a MongoDB collection would look like)
const SURPLUS_KEY = 'foodloop_surplus_listings';

export const getSurplusListings = () => {
  try { return JSON.parse(localStorage.getItem(SURPLUS_KEY)) || []; }
  catch { return []; }
};

export const saveSurplusListing = (listing) => {
  const all = getSurplusListings();
  const updated = [listing, ...all.filter((l) => l.id !== listing.id)];
  localStorage.setItem(SURPLUS_KEY, JSON.stringify(updated));
};

export const updateListingStatus = (id, status, claimedBy = null) => {
  const all = getSurplusListings().map((l) =>
    l.id === id ? { ...l, status, claimedBy, claimedAt: new Date().toISOString() } : l
  );
  localStorage.setItem(SURPLUS_KEY, JSON.stringify(all));
};

// Seed demo surplus listings
export const seedSurplusListings = () => {
  const existing = getSurplusListings();
  if (existing.length > 0) return;

  const demos = [
    {
      id: 'sl-001',
      kitchenId: 'demo-user',
      kitchenName: 'The Green Plate (Restaurant)',
      city: 'Mumbai',
      address: 'Bandra West, Mumbai',
      items: [
        { name: 'Dal Tadka', category: 'Pulses', morningPrepared: 15.0, eveningRemaining: 6.2, surplus: 6.2 },
        { name: 'Steamed Rice', category: 'Rice / Grains', morningPrepared: 20.0, eveningRemaining: 8.5, surplus: 8.5 },
      ],
      totalSurplus: 14.7,
      pickupBy: '21:00',
      status: 'available',
      claimedBy: null,
      notes: 'Freshly cooked. Can be reheated. Containers available.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sl-002',
      kitchenId: 'kitchen-2',
      kitchenName: 'City Hospital Cafeteria',
      city: 'Pune',
      address: 'Shivajinagar, Pune',
      items: [
        { name: 'Chapati', category: 'Bread / Bakery', morningPrepared: 200, eveningRemaining: 60, surplus: 60, unit: 'pcs' },
        { name: 'Mixed Vegetables', category: 'Vegetables', morningPrepared: 12.0, eveningRemaining: 4.0, surplus: 4.0 },
      ],
      totalSurplus: 8.2,
      pickupBy: '20:30',
      status: 'available',
      claimedBy: null,
      notes: 'Vegetarian. FSSAI compliant kitchen.',
      createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sl-003',
      kitchenId: 'kitchen-3',
      kitchenName: 'Sunrise Corporate Cafeteria',
      city: 'Bengaluru',
      address: 'Whitefield, Bengaluru',
      items: [
        { name: 'Sambhar', category: 'Pulses', morningPrepared: 25.0, eveningRemaining: 10.0, surplus: 10.0 },
        { name: 'Idli', category: 'Rice / Grains', morningPrepared: 300, eveningRemaining: 80, surplus: 80, unit: 'pcs' },
      ],
      totalSurplus: 12.5,
      pickupBy: '19:30',
      status: 'claimed',
      claimedBy: 'Asha Foundation',
      claimedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      notes: 'South Indian. Packed in food-grade containers.',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sl-004',
      kitchenId: 'kitchen-4',
      kitchenName: 'St. Mary\'s School Kitchen',
      city: 'Mumbai',
      address: 'Andheri East, Mumbai',
      items: [
        { name: 'Khichdi', category: 'Rice / Grains', morningPrepared: 30.0, eveningRemaining: 9.0, surplus: 9.0 },
        { name: 'Curd', category: 'Meat / Dairy', morningPrepared: 10.0, eveningRemaining: 3.5, surplus: 3.5 },
      ],
      totalSurplus: 12.5,
      pickupBy: '17:30',
      status: 'completed',
      claimedBy: 'City Food Bank',
      notes: 'Mid-day meal surplus. Freshly made.',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
  ];

  localStorage.setItem(SURPLUS_KEY, JSON.stringify(demos));
};

// Food categories
export const FOOD_CATS = [
  'Rice / Grains', 'Vegetables', 'Pulses', 'Bread / Bakery',
  'Meat / Dairy', 'Fruits', 'Beverages', 'Other',
];
