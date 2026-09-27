/**
 * Daily Workflow Store
 * Manages the end-to-end daily kitchen workflow state:
 * IDLE → PLAN_READY → MORNING_LOCKED → EVENING_LOCKED → LISTED
 *
 * In production this would be a real-time state synced via WebSocket/DB.
 */

const WORKFLOW_KEY = 'foodloop_daily_workflow';

export const STEPS = {
  IDLE:             'idle',
  PLAN_READY:       'plan_ready',
  MORNING_LOCKED:   'morning_locked',
  EVENING_LOCKED:   'evening_locked',
  LISTED:           'listed',
};

export const STEP_META = [
  { key: STEPS.IDLE,           icon: "https://cdn.creazilla.com/cliparts/75176/sun-icon-clipart-xl.png", label: 'Start of Day',        desc: 'ML generates preparation plan' },
  { key: STEPS.PLAN_READY,     icon: "https://www.clipartmax.com/png/middle/164-1649544_checklist-noun-project-5166-yellow-action-plan-white-icon.png", label: 'Plan Ready',           desc: 'Kitchen receives prep quantities' },
  { key: STEPS.MORNING_LOCKED, icon: "https://static.vecteezy.com/system/resources/previews/049/451/885/non_2x/golden-computer-monitor-illustration-free-vector.jpg", label: 'Morning Logged',       desc: 'Actual prepared weights recorded' },
  { key: STEPS.EVENING_LOCKED, icon: "https://cdn-icons-png.flaticon.com/512/2007/2007962.png", label: 'Evening Logged',       desc: 'Remaining food weighed' },
  { key: STEPS.LISTED,         icon: "https://icones.pro/wp-content/uploads/2021/04/icone-de-nourriture-jaune-symbole-png.png", label: 'Surplus Listed',       desc: 'Marketplace updated for NGOs' },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

export const getWorkflow = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(WORKFLOW_KEY));
    if (!raw || raw.date !== todayKey()) return { date: todayKey(), step: STEPS.IDLE, plan: null };
    return raw;
  } catch { return { date: todayKey(), step: STEPS.IDLE, plan: null }; }
};

export const setWorkflow = (updates) => {
  const current = getWorkflow();
  localStorage.setItem(WORKFLOW_KEY, JSON.stringify({ ...current, ...updates, date: todayKey() }));
};

export const getStepIndex = (step) => Object.values(STEPS).indexOf(step);

// ─── Mock API: Generate daily preparation plan ────────────────────────────────
/**
 * In production: POST https://ml-api.foodloop.internal/plan?date=YYYY-MM-DD
 * Model inputs: historical consumption, day-of-week, season, upcoming events
 * Returns: recommended quantities for each item
 */
export const mockGeneratePlan = async (onProgress) => {
  const progressSteps = [
    { pct: 15, msg: 'Connecting to ML endpoint (FastAPI)…' },
    { pct: 30, msg: 'Loading historical consumption data (last 30 days)…' },
    { pct: 50, msg: 'Running XGBoost demand forecast…' },
    { pct: 65, msg: 'Applying day-of-week seasonality adjustment…' },
    { pct: 80, msg: 'Optimizing for minimum expected waste…' },
    { pct: 92, msg: 'Generating per-item recommendations…' },
    { pct: 100, msg: '✅ Preparation plan ready!' },
  ];

  for (const step of progressSteps) {
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 350));
    onProgress(step);
  }

  const dow = new Date().getDay(); // 0=Sun, 6=Sat
  const isWeekend = dow === 0 || dow === 6;
  const scale = isWeekend ? 0.72 : 1.0;
  const jitter = () => (Math.random() - 0.5) * 0.12;

  const items = [
    { name: 'Basmati Rice',    category: 'Rice / Grains',  qty: Math.round(25 * scale * (1 + jitter())), unit: 'kg',  rationale: 'Primary staple — high consistent demand' },
    { name: 'Dal Tadka',       category: 'Pulses',         qty: Math.round(18 * scale * (1 + jitter())), unit: 'kg',  rationale: '↑ 8% vs last week (new menu item)' },
    { name: 'Chapati',         category: 'Bread / Bakery', qty: Math.round(280 * scale * (1 + jitter())), unit: 'pcs', rationale: 'Reduced 12% to cut last-week surplus' },
    { name: 'Mixed Vegetables',category: 'Vegetables',     qty: Math.round(14 * scale * (1 + jitter())), unit: 'kg',  rationale: 'Seasonal adjustment (monsoon)' },
    { name: 'Curd',            category: 'Meat / Dairy',   qty: Math.round(7 * scale * (1 + jitter())), unit: 'kg',  rationale: 'Steady demand, weekend dip applied' },
    { name: 'Khichdi',         category: 'Rice / Grains',  qty: Math.round(12 * scale * (1 + jitter())), unit: 'kg',  rationale: 'Alternate carb option' },
  ];

  return {
    success: true,
    date: todayKey(),
    generatedAt: new Date().toISOString(),
    modelVersion: 'v1.14',
    confidence: Math.round(82 + Math.random() * 12),
    expectedMeals: Math.round(440 * scale),
    expectedSurplusKg: +(3.8 * scale).toFixed(1),
    expectedWasteKg: +(2.1 * scale).toFixed(1),
    items,
    endpoint: 'https://ml-api.foodloop.internal/plan',
  };
};
