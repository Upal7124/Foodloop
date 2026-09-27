// Mock data for FoodLoop Dashboard

export const statCards = [
  {
    id: 1,
    title: 'Meals Prepared',
    value: '520',
    change: '+12%',
    positive: true,
    icon: 'utensils',
    color: 'green',
    vsText: 'vs. last week',
  },
  {
    id: 2,
    title: 'Meals Served',
    value: '480',
    change: '+8%',
    positive: true,
    icon: 'users',
    color: 'blue',
    vsText: 'vs. last week',
  },
  {
    id: 3,
    title: 'Food Waste',
    value: '18 kg',
    change: '-25%',
    positive: true,
    icon: 'trash',
    color: 'red',
    vsText: 'vs. last week',
  },
  {
    id: 4,
    title: 'Food Redistributed',
    value: '22 kg',
    change: '+40%',
    positive: true,
    icon: 'leaf',
    color: 'amber',
    vsText: 'vs. last week',
  },
];

export const consumptionData = [
  { day: 'Mon', actual: 220, predicted: 210 },
  { day: 'Tue', actual: 280, predicted: 260 },
  { day: 'Wed', actual: 320, predicted: 300 },
  { day: 'Thu', actual: 260, predicted: 280 },
  { day: 'Fri', actual: 390, predicted: 350 },
  { day: 'Sat', actual: 310, predicted: 330 },
  { day: 'Sun', actual: 240, predicted: 260 },
];

export const wasteCompositionData = [
  { name: 'Rice / Grains', value: 35, color: '#22c55e' },
  { name: 'Vegetables', value: 25, color: '#3b82f6' },
  { name: 'Bread', value: 15, color: '#f59e0b' },
  { name: 'Meat / Dairy', value: 15, color: '#f97316' },
  { name: 'Others', value: 10, color: '#8b5cf6' },
];

export const sensorData = [
  { name: 'Prep Scale', value: '12.4 kg', status: 'Online' },
  { name: 'Waste Bin', value: '3.2 kg', status: 'Online' },
  { name: 'Fridge (Storage)', value: '4.1 °C', status: 'Online' },
  { name: 'Hot Holding Unit', value: '62.3 °C', status: 'Online' },
  { name: 'Energy Meter', value: '12.5 kWh', status: 'Online' },
];

export const redistributionData = [
  { org: 'Asha Foundation', amount: '12 kg', date: 'Today', icon: '' },
  { org: 'City Food Bank', amount: '8 kg', date: 'Yesterday', icon: '' },
  { org: 'Community Kitchen', amount: '2 kg', date: '12 Sep', icon: '' },
];

export const impactData = [
  { label: 'Food Saved', value: '86 kg', icon: 'food', color: '#22c55e' },
  { label: 'Water Conserved', value: '~34,400 litres', icon: 'water', color: '#3b82f6' },
  { label: 'Energy Saved', value: '~120 kWh', icon: 'energy', color: '#f59e0b' },
  { label: 'CO₂ Emissions Reduced', value: '~62 kg', icon: 'leaf', color: '#10b981' },
];

export const recentActivities = [
  { time: '10:30 AM', activity: 'Food Prepared', details: '25 kg Rice', status: 'Logged' },
  { time: '12:15 PM', activity: 'Waste Recorded', details: '2.3 kg (Vegetables)', status: 'Logged' },
  { time: '02:40 PM', activity: 'Surplus Collected', details: '8 kg to Asha Foundation', status: 'Completed' },
  { time: '05:10 PM', activity: 'Sensor Alert', details: 'Fridge temperature back to normal', status: 'Resolved' },
];

export const analyticsMonthlyData = [
  { month: 'Jan', waste: 45, redistributed: 30, prepared: 400 },
  { month: 'Feb', waste: 38, redistributed: 35, prepared: 420 },
  { month: 'Mar', waste: 52, redistributed: 28, prepared: 480 },
  { month: 'Apr', waste: 30, redistributed: 42, prepared: 510 },
  { month: 'May', waste: 25, redistributed: 48, prepared: 530 },
  { month: 'Jun', waste: 20, redistributed: 55, prepared: 560 },
  { month: 'Jul', waste: 18, redistributed: 60, prepared: 590 },
  { month: 'Aug', waste: 22, redistributed: 58, prepared: 570 },
  { month: 'Sep', waste: 18, redistributed: 62, prepared: 600 },
];

export const inventoryData = [
  { id: 1, item: 'Rice', category: 'Grains', quantity: '150 kg', expiry: '2026-10-15', status: 'Good' },
  { id: 2, item: 'Wheat Flour', category: 'Grains', quantity: '80 kg', expiry: '2026-10-01', status: 'Good' },
  { id: 3, item: 'Tomatoes', category: 'Vegetables', quantity: '25 kg', expiry: '2026-09-25', status: 'Expiring Soon' },
  { id: 4, item: 'Spinach', category: 'Vegetables', quantity: '8 kg', expiry: '2026-09-22', status: 'Critical' },
  { id: 5, item: 'Chicken', category: 'Meat', quantity: '40 kg', expiry: '2026-09-23', status: 'Critical' },
  { id: 6, item: 'Milk', category: 'Dairy', quantity: '60 L', expiry: '2026-09-24', status: 'Expiring Soon' },
  { id: 7, item: 'Bread', category: 'Bakery', quantity: '30 pcs', expiry: '2026-09-22', status: 'Critical' },
  { id: 8, item: 'Lentils', category: 'Legumes', quantity: '100 kg', expiry: '2026-12-01', status: 'Good' },
];
