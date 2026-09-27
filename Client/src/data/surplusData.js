// Shared surplus listings store
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

export const seedSurplusListings = () => {
  // Always seed latest version during this update to ensure systematic data across app
  const demos = [
    {
      id: 'sl-001',
      kitchenId: 'k-001',
      kitchenName: 'City Hospital Kitchen',
      city: 'Central District',
      address: 'Plot 4, Health Avenue',
      items: [
        { name: 'Dal Tadka', category: 'Pulses', morningPrepared: 15.0, eveningRemaining: 6.2, surplus: 6.2, unit: 'kg' },
        { name: 'Steamed Rice', category: 'Rice / Grains', morningPrepared: 20.0, eveningRemaining: 8.5, surplus: 8.5, unit: 'kg' },
      ],
      totalSurplus: 14.7,
      pickupBy: '21:00',
      status: 'available',
      claimedBy: null,
      notes: 'Freshly cooked. Can be reheated. Containers available.',
      mlGenerated: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sl-002',
      kitchenId: 'k-002',
      kitchenName: 'Green Plate Corporate',
      city: 'Tech Park',
      address: 'Tower B, IT Hub',
      items: [
        { name: 'Wheat Chapati', category: 'Bread / Bakery', morningPrepared: 200, eveningRemaining: 60, surplus: 60, unit: 'pcs' },
        { name: 'Mixed Veg Curry', category: 'Vegetables', morningPrepared: 12.0, eveningRemaining: 4.0, surplus: 4.0, unit: 'kg' },
      ],
      totalSurplus: 8.2,
      pickupBy: '20:30',
      status: 'available',
      claimedBy: null,
      notes: 'Vegetarian. FSSAI compliant kitchen.',
      mlGenerated: true,
      createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sl-003',
      kitchenId: 'k-003',
      kitchenName: 'Metro Canteen',
      city: 'Downtown',
      address: 'Station Road, Level 2',
      items: [
        { name: 'Sambhar', category: 'Pulses', morningPrepared: 25.0, eveningRemaining: 10.0, surplus: 10.0, unit: 'kg' },
        { name: 'Idli', category: 'Rice / Grains', morningPrepared: 300, eveningRemaining: 80, surplus: 80, unit: 'pcs' },
      ],
      totalSurplus: 12.5,
      pickupBy: '19:30',
      status: 'claimed',
      claimedBy: 'Asha Foundation',
      claimedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      notes: 'South Indian. Packed in food-grade containers.',
      mlGenerated: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sl-004',
      kitchenId: 'k-004',
      kitchenName: 'EduCare Hostel',
      city: 'North Campus',
      address: 'University Road',
      items: [
        { name: 'Vegetable Khichdi', category: 'Rice / Grains', morningPrepared: 30.0, eveningRemaining: 9.0, surplus: 9.0, unit: 'kg' },
        { name: 'Curd', category: 'Dairy', morningPrepared: 10.0, eveningRemaining: 3.5, surplus: 3.5, unit: 'kg' },
      ],
      totalSurplus: 12.5,
      pickupBy: '17:30',
      status: 'completed',
      claimedBy: 'Food For All',
      notes: 'Mildly spiced. Freshly made.',
      mlGenerated: true,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
  ];

  localStorage.setItem(SURPLUS_KEY, JSON.stringify(demos));
};

export const FOOD_CATS = [
  'Rice / Grains', 'Vegetables', 'Pulses', 'Bread / Bakery',
  'Meat / Dairy', 'Fruits', 'Beverages', 'Other',
];
