import { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, AreaChart, Area,
} from 'recharts';
import {
  Scale, Wifi, WifiOff, RotateCcw, Download, Filter,
  AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown,
  Activity, ChevronDown, Trash2, Info,
} from 'lucide-react';
import { format } from 'date-fns';

// ─── Constants ───────────────────────────────────────────────────────────────
const MAX_CAPACITY_KG = 30;
const LIVE_WINDOW = 60;          // seconds of live data shown in chart
const TICK_MS = 500;             // sensor polling interval (ms)
const STABLE_THRESHOLD = 0.05;  // weight change < this → stable

const FOOD_CATEGORIES = [
  { label: 'Rice / Grains', color: '#22c55e' },
  { label: 'Vegetables', color: '#3b82f6' },
  { label: 'Bread / Bakery', color: '#f59e0b' },
  { label: 'Meat / Dairy', color: '#f97316' },
  { label: 'Pulses', color: '#8b5cf6' },
  { label: 'Waste', color: '#ef4444' },
  { label: 'Surplus', color: '#14b8a6' },
  { label: 'Other', color: '#6b7280' },
];

// ─── Seed historical readings (past sessions) ─────────────────────────────
const generateHistory = () => {
  const items = [
    { item: 'Basmati Rice', category: 'Rice / Grains', weight: 12.4 },
    { item: 'Tomatoes', category: 'Vegetables', weight: 3.2 },
    { item: 'Wheat Flour', category: 'Rice / Grains', weight: 8.7 },
    { item: 'Chicken', category: 'Meat / Dairy', weight: 5.0 },
    { item: 'Kitchen Waste', category: 'Waste', weight: 2.3 },
    { item: 'Dal (Lentils)', category: 'Pulses', weight: 6.1 },
    { item: 'Bread Loaves', category: 'Bread / Bakery', weight: 4.5 },
    { item: 'Surplus Curry', category: 'Surplus', weight: 7.8 },
    { item: 'Spinach', category: 'Vegetables', weight: 1.9 },
    { item: 'Milk (packet)', category: 'Meat / Dairy', weight: 3.0 },
    { item: 'Mixed Waste', category: 'Waste', weight: 1.4 },
    { item: 'Brown Rice', category: 'Rice / Grains', weight: 9.2 },
  ];

  const now = Date.now();
  return items.map((item, i) => ({
    id: `hist-${i}`,
    ...item,
    timestamp: new Date(now - (i + 1) * 18 * 60 * 1000).toISOString(), // every ~18 min
    tare: +(Math.random() * 0.3).toFixed(3),
    unit: 'kg',
  }));
};

// ─── Sensor simulation engine ─────────────────────────────────────────────
function useSensorSimulator() {
  const [isConnected, setIsConnected] = useState(true);
  const [rawWeight, setRawWeight] = useState(0);
  const [tare, setTare] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | loading | stable | unloading
  const [liveData, setLiveData] = useState([]);
  const phaseRef = useRef('idle');
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const tickRef = useRef(0);

  // Simulate a full weighing cycle
  const startCycle = useCallback(() => {
    const target = +(Math.random() * 18 + 0.5).toFixed(2);
    targetRef.current = target;
    phaseRef.current = 'loading';
    setPhase('loading');
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isConnected) return;
      tickRef.current += 1;
      const t = tickRef.current;

      let newWeight = currentRef.current;
      const noise = () => (Math.random() - 0.5) * 0.04;

      if (phaseRef.current === 'idle') {
        newWeight = Math.max(0, noise() * 0.5);
        // auto-start a cycle every ~20s
        if (t % 40 === 0) startCycle();

      } else if (phaseRef.current === 'loading') {
        const target = targetRef.current;
        if (currentRef.current < target - 0.1) {
          newWeight = currentRef.current + (target - currentRef.current) * 0.18 + noise();
        } else {
          newWeight = target + noise() * 0.5;
          phaseRef.current = 'stable';
          setPhase('stable');
        }

      } else if (phaseRef.current === 'stable') {
        newWeight = targetRef.current + noise() * 0.5;
        // stay stable for ~15s, then unload
        if (t % 30 === 0) {
          phaseRef.current = 'unloading';
          setPhase('unloading');
        }

      } else if (phaseRef.current === 'unloading') {
        if (currentRef.current > 0.1) {
          newWeight = currentRef.current * 0.82 + noise();
        } else {
          newWeight = Math.max(0, noise() * 0.3);
          phaseRef.current = 'idle';
          setPhase('idle');
        }
      }

      newWeight = Math.max(0, +newWeight.toFixed(3));
      currentRef.current = newWeight;
      setRawWeight(newWeight);

      const timeLabel = format(new Date(), 'HH:mm:ss');
      setLiveData((prev) => {
        const next = [...prev, { time: timeLabel, weight: newWeight, t: Date.now() }];
        // keep only last LIVE_WINDOW * 2 ticks
        return next.slice(-(LIVE_WINDOW * (1000 / TICK_MS)));
      });
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [isConnected, startCycle]);

  const doTare = () => setTare(rawWeight);
  const resetTare = () => setTare(0);
  const toggleConnection = () => setIsConnected((v) => !v);
  const netWeight = Math.max(0, +(rawWeight - tare).toFixed(3));

  return { isConnected, rawWeight, netWeight, tare, phase, liveData, doTare, resetTare, toggleConnection };
}

// ─── Sub-components ───────────────────────────────────────────────────────

function LiveDisplay({ weight, netWeight, tare, phase, capacity }) {
  const pct = Math.min((weight / capacity) * 100, 100);
  const overload = weight > capacity;

  const phaseConfig = {
    idle:      { label: 'Empty / Idle',   color: '#9ca3af', pulse: false },
    loading:   { label: 'Loading…',        color: '#f59e0b', pulse: true  },
    stable:    { label: '✓ Stable',        color: '#22c55e', pulse: false },
    unloading: { label: 'Removing…',       color: '#3b82f6', pulse: true  },
  };
  const cfg = phaseConfig[phase] || phaseConfig.idle;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scale size={18} className="text-green-600" />
          <span className="text-sm font-semibold text-gray-900">Live Reading</span>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cfg.pulse ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: cfg.color + '20', color: cfg.color }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Big weight display */}
      <div className="text-center my-4">
        <div className={`text-7xl font-black tracking-tight transition-all ${overload ? 'text-red-500' : 'text-gray-900'}`}>
          {weight.toFixed(2)}
        </div>
        <div className="text-xl text-gray-400 font-medium mt-1">kg</div>
        {tare > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            Net: <span className="font-semibold text-green-700">{netWeight.toFixed(3)} kg</span>
            <span className="mx-1.5 text-gray-300">|</span>
            Tare: <span className="font-medium">{tare.toFixed(3)} kg</span>
          </div>
        )}
      </div>

      {/* Capacity bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>0 kg</span>
          <span className={overload ? 'text-red-500 font-bold' : ''}>{overload ? '⚠ OVERLOAD' : `${pct.toFixed(1)}% of ${capacity} kg`}</span>
          <span>{capacity} kg</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${pct}%`,
              backgroundColor: overload ? '#ef4444' : pct > 85 ? '#f97316' : '#22c55e',
            }}
          />
        </div>
      </div>

      {/* Overload warning */}
      {overload && (
        <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
          <span className="text-xs text-red-600 font-medium">Weight exceeds max capacity! Remove load immediately.</span>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, unit, icon, color, sub }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        {/* <span className="text-lg">{icon}</span> */}
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold" style={{ color }}>{value}</span>
        <span className="text-sm text-gray-400 mb-0.5">{unit}</span>
      </div>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-green-700">{payload[0].value.toFixed(3)} kg</p>
      </div>
    );
  }
  return null;
};

// ─── Main Page ────────────────────────────────────────────────────────────
export default function WeighingScale() {
  const { isConnected, rawWeight, netWeight, tare, phase, liveData, doTare, resetTare, toggleConnection } = useSensorSimulator();
  const [unit, setUnit] = useState('kg');
  const [history, setHistory] = useState(generateHistory);
  const [filterCat, setFilterCat] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [addingReading, setAddingReading] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newCat, setNewCat] = useState(FOOD_CATEGORIES[0].label);
  const lastSaved = useRef(null);

  // Auto-save when weight becomes stable with significant value
  useEffect(() => {
    if (phase === 'stable' && rawWeight > 0.5) {
      const id = `live-${Date.now()}`;
      if (lastSaved.current !== id) {
        lastSaved.current = id;
      }
    }
  }, [phase, rawWeight]);

  // Convert weight to display unit
  const displayWeight = (w) => {
    if (unit === 'g') return (w * 1000).toFixed(0);
    if (unit === 'lb') return (w * 2.205).toFixed(3);
    return w.toFixed(3);
  };

  // Save current reading to history
  const saveReading = () => {
    if (rawWeight < 0.05) return;
    const entry = {
      id: Date.now().toString(),
      item: newLabel || 'Unlabelled',
      category: newCat,
      weight: +rawWeight.toFixed(3),
      tare: +tare.toFixed(3),
      unit: 'kg',
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [entry, ...prev]);
    setNewLabel('');
    setAddingReading(false);
  };

  const deleteRecord = (id) => setHistory((prev) => prev.filter((h) => h.id !== id));

  // Stats from today's history
  const todayHistory = history.filter((h) => new Date(h.timestamp).toDateString() === new Date().toDateString());
  const todayTotal = todayHistory.reduce((s, h) => s + h.weight, 0);
  const todayMax = todayHistory.length ? Math.max(...todayHistory.map((h) => h.weight)) : 0;
  const todayMin = todayHistory.length ? Math.min(...todayHistory.map((h) => h.weight)) : 0;
  const todayAvg = todayHistory.length ? todayTotal / todayHistory.length : 0;

  const filteredHistory = filterCat === 'All' ? history : history.filter((h) => h.category === filterCat);
  const categories = ['All', ...new Set(history.map((h) => h.category))];

  const catColor = (cat) => FOOD_CATEGORIES.find((c) => c.label === cat)?.color || '#6b7280';

  // Chart domain
  const weights = liveData.map((d) => d.weight);
  const yMax = Math.max(MAX_CAPACITY_KG, ...weights) + 1;

  return (
    <div className="mt-5 space-y-5">
      {/* ── Connection status bar ── */}
      <div className={`rounded-xl px-4 py-3 flex items-center justify-between text-sm ${isConnected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex items-center gap-2.5">
          {isConnected
            ? <Wifi size={15} className="text-green-600" />
            : <WifiOff size={15} className="text-red-500" />
          }
          <span className={`font-medium ${isConnected ? 'text-green-700' : 'text-red-600'}`}>
            {isConnected ? 'Sensor Online — Prep Scale (Kitchen Station 1)' : 'Sensor Disconnected'}
          </span>
          {isConnected && (
            <span className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block"></span>
              Live · polling every 500ms
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Unit toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
            {['kg', 'g', 'lb'].map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${unit === u ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {u}
              </button>
            ))}
          </div>
          <button
            onClick={toggleConnection}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${isConnected ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
          >
            {isConnected ? 'Disconnect' : 'Reconnect'}
          </button>
        </div>
      </div>

      {/* ── Row 1: Live display + Stats ── */}
      <div className="grid grid-cols-12 gap-4">
        {/* Live weight display */}
        <div className="col-span-4">
          <LiveDisplay
            weight={rawWeight}
            netWeight={netWeight}
            tare={tare}
            phase={phase}
            capacity={MAX_CAPACITY_KG}
          />

          {/* Tare controls */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={doTare}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={13} /> Set Tare
            </button>
            <button
              onClick={resetTare}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={13} /> Reset Tare
            </button>
          </div>

          {/* Save reading */}
          {!addingReading ? (
            <button
              onClick={() => setAddingReading(true)}
              disabled={rawWeight < 0.05}
              className="mt-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40"
              style={{ backgroundColor: '#16a34a' }}
            >
              + Save Reading
            </button>
          ) : (
            <div className="mt-2 bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
              <p className="text-xs font-semibold text-gray-700">Log this reading</p>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Item name (e.g. Basmati Rice)"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                {FOOD_CATEGORIES.map((c) => <option key={c.label}>{c.label}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={() => setAddingReading(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={saveReading} className="flex-1 py-2 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: '#16a34a' }}>Save</button>
              </div>
            </div>
          )}
        </div>

        {/* Today's stats */}
        <div className="col-span-8 grid grid-cols-2 gap-4 content-start">
          <StatCard label="Total Weighed Today" value={todayTotal.toFixed(2)} unit="kg" icon="⚖️" color="#1a6b3a" sub={`${todayHistory.length} readings`} />
          <StatCard label="Session Average" value={todayAvg.toFixed(2)} unit="kg" icon="📊" color="#3b82f6" sub="per reading" />
          <StatCard label="Heaviest Reading" value={todayMax.toFixed(2)} unit="kg" icon="🔺" color="#f97316" sub="today's max" />
          <StatCard label="Lightest Reading" value={todayMin.toFixed(2)} unit="kg" icon="🔻" color="#8b5cf6" sub="today's min" />

          {/* Calibration & alerts */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-700 mb-3">Sensor Health</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Calibration', status: 'OK', value: 'Last: 2026-09-20', ok: true },
                { label: 'Drift', status: '±0.02 kg', value: 'Within tolerance', ok: true },
                { label: 'Battery', status: '87%', value: 'AC powered', ok: true },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{item.label}</span>
                    {item.ok
                      ? <CheckCircle size={12} className="text-green-500" />
                      : <AlertTriangle size={12} className="text-amber-500" />
                    }
                  </div>
                  <p className="text-sm font-bold text-gray-900">{item.status}</p>
                  <p className="text-xs text-gray-400">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Real-time chart ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-green-600" />
            <h3 className="text-sm font-semibold text-gray-900">Live Weight Stream</h3>
            <span className="text-xs text-gray-400">— last 60 seconds</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
              {unit === 'kg' ? rawWeight.toFixed(3) : displayWeight(rawWeight)} {unit}
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={liveData.slice(-120)} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              interval="preserveStartEnd"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, yMax]}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={MAX_CAPACITY_KG} stroke="#ef4444" strokeDasharray="4 3" label={{ value: 'Max', fill: '#ef4444', fontSize: 10 }} />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#22c55e"
              strokeWidth={2.5}
              fill="url(#wGrad)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Row 3: History table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">Measurement History</h3>
            <span className="text-xs text-gray-400">({filteredHistory.length} records)</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Category filter */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50"
              >
                <Filter size={12} />
                {filterCat}
                <ChevronDown size={12} />
              </button>
              {filterOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setFilterCat(c); setFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 ${filterCat === c ? 'text-green-700 font-semibold' : 'text-gray-700'}`}
                    >
                      {c !== 'All' && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: catColor(c) }}></span>}
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50">
              <Download size={12} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Date & Time', 'Item / Description', 'Category', 'Gross Weight', 'Tare', 'Net Weight', ''].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No readings found</td>
                </tr>
              ) : filteredHistory.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium text-gray-800">{format(new Date(row.timestamp), 'dd MMM yyyy')}</p>
                    <p className="text-xs text-gray-400">{format(new Date(row.timestamp), 'hh:mm:ss a')}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{row.item}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: catColor(row.category) + '20', color: catColor(row.category) }}
                    >
                      {row.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">{row.weight.toFixed(3)} kg</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{row.tare?.toFixed(3) || '0.000'} kg</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-700">
                    {(row.weight - (row.tare || 0)).toFixed(3)} kg
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteRecord(row.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center gap-6 text-xs text-gray-500">
          <span>Total: <strong className="text-gray-900">{filteredHistory.reduce((s, h) => s + h.weight, 0).toFixed(2)} kg</strong></span>
          <span>Records: <strong className="text-gray-900">{filteredHistory.length}</strong></span>
          <span>Avg: <strong className="text-gray-900">{filteredHistory.length ? (filteredHistory.reduce((s, h) => s + h.weight, 0) / filteredHistory.length).toFixed(2) : '0.00'} kg</strong></span>
        </div>
      </div>
    </div>
  );
}
