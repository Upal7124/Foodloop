import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Sun, Moon, Plus, Trash2, CheckCircle2, AlertTriangle,
  TrendingDown, Scale, Send, Info, PackageCheck, Clock,
  Sparkles, ArrowRight, RefreshCw, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveSurplusListing, FOOD_CATS } from '../data/surplusData';
import {
  getWorkflow, setWorkflow, STEPS,
} from '../data/dailyWorkflow';
import DailyWorkflowBar from '../components/workflow/DailyWorkflowBar';

const SESSION_KEY = 'foodloop_weigh_sessions';
const SURPLUS_THRESHOLD_PCT = 20;

const loadSessions = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || {}; } catch { return {}; } };
const saveSessions = (d) => localStorage.setItem(SESSION_KEY, JSON.stringify(d));
const todayKey = () => format(new Date(), 'yyyy-MM-dd');
const makeItem = (overrides = {}) => ({ id: Date.now().toString() + Math.random(), name: '', category: 'Rice / Grains', weight: '', mlSuggested: null, ...overrides });

// ── Sub: single row in session form ─────────────────────────────────────────
function ItemRow({ item, locked, onChange, onDelete, showML }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center mb-2">
      <div className="col-span-4">
        <input disabled={locked} type="text" value={item.name}
          onChange={(e) => onChange(item.id, 'name', e.target.value)}
          placeholder="Food item name"
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:bg-gray-50 disabled:text-gray-500" />
      </div>
      <div className="col-span-3">
        <select disabled={locked} value={item.category}
          onChange={(e) => onChange(item.id, 'category', e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:bg-gray-50">
          {FOOD_CATS.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="col-span-2">
        <div className="relative">
          <input disabled={locked} type="number" min="0" step="0.01" value={item.weight}
            onChange={(e) => onChange(item.id, 'weight', e.target.value)}
            placeholder="kg"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:bg-gray-50" />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
        </div>
      </div>
      {showML && item.mlSuggested !== null && (
        <div className="col-span-2 text-center">
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-50 text-purple-700">
            ML: {item.mlSuggested} {item.mlUnit || 'kg'}
          </span>
        </div>
      )}
      {!showML && <div className="col-span-2"></div>}
      <div className="col-span-1 flex justify-center">
        {!locked && (
          <button onClick={() => onDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Sub: surplus analysis row ────────────────────────────────────────────────
function SurplusRow({ row }) {
  const remaining = Number(row.eveningWeight);
  const prepared  = Number(row.morningWeight);
  const pct = prepared > 0 ? ((remaining / prepared) * 100).toFixed(1) : 0;
  const isSurplus = prepared > 0 && remaining / prepared > SURPLUS_THRESHOLD_PCT / 100;

  return (
    <tr className={isSurplus ? 'bg-amber-50/60' : ''}>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.name}</td>
      <td className="px-4 py-3 text-xs text-gray-500">{row.category}</td>
      {row.mlRecommended && (
        <td className="px-4 py-3">
          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
            {row.mlRecommended} kg
          </span>
        </td>
      )}
      <td className="px-4 py-3 text-sm text-gray-700">{prepared.toFixed(2)} kg</td>
      <td className="px-4 py-3 text-sm text-gray-700">{remaining.toFixed(2)} kg</td>
      <td className="px-4 py-3">
        <span className={`text-sm font-bold ${isSurplus ? 'text-amber-600' : 'text-gray-400'}`}>{remaining.toFixed(2)} kg</span>
        <span className="text-xs text-gray-400 ml-1">({pct}%)</span>
      </td>
      <td className="px-4 py-3">
        {isSurplus
          ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit"><AlertTriangle size={11} /> Surplus</span>
          : <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">Consumed</span>}
      </td>
    </tr>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SurplusDetection() {
  const { user } = useAuth();
  const today = todayKey();

  const [sessions, setSessions]   = useState(loadSessions);
  const [workflow, setWorkflowState] = useState(getWorkflow);
  const [pickupBy, setPickupBy]   = useState('21:00');
  const [notes, setNotes]         = useState('');
  const [listed, setListed]       = useState(workflow.step === STEPS.LISTED);
  const [activeTab, setActiveTab] = useState('morning');
  const [showMLBanner, setShowMLBanner] = useState(true);

  const todayData = sessions[today] || { morning: { items: [], locked: false }, evening: { items: [], locked: false } };
  const plan = workflow.plan;

  useEffect(() => { saveSessions(sessions); }, [sessions]);

  // Refresh workflow state when plan arrives from MLIntelligence
  useEffect(() => {
    const interval = setInterval(() => {
      const wf = getWorkflow();
      setWorkflowState(wf);
      if (wf.step === STEPS.LISTED) setListed(true);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateSession = (session, key, value) => {
    setSessions((prev) => ({
      ...prev,
      [today]: { ...todayData, [session]: { ...todayData[session], [key]: value } },
    }));
  };

  const addItem = (session) => {
    const items = [...(todayData[session].items || []), makeItem()];
    updateSession(session, 'items', items);
  };

  const updateItem = (session, id, field, val) => {
    const items = todayData[session].items.map((i) => i.id === id ? { ...i, [field]: val } : i);
    updateSession(session, 'items', items);
  };

  const deleteItem = (session, id) => {
    const items = todayData[session].items.filter((i) => i.id !== id);
    updateSession(session, 'items', items);
  };

  const lockSession = (session) => {
    updateSession(session, 'locked', true);
    if (session === 'morning') {
      const newStep = STEPS.MORNING_LOCKED;
      setWorkflow({ step: newStep });
      setWorkflowState(getWorkflow());
      // Pre-populate evening with morning item names
      if (!todayData.evening.items || todayData.evening.items.length === 0) {
        const eveningItems = todayData.morning.items
          .filter((i) => i.name && Number(i.weight) > 0)
          .map((i) => makeItem({ name: i.name, category: i.category, mlSuggested: null }));
        setSessions((prev) => ({
          ...prev,
          [today]: {
            ...todayData,
            morning: { ...todayData.morning, locked: true },
            evening: { items: eveningItems, locked: false },
          },
        }));
      }
    }
    if (session === 'evening') {
      setWorkflow({ step: STEPS.EVENING_LOCKED });
      setWorkflowState(getWorkflow());
    }
  };

  // ── Load ML plan into morning session ──────────────────────────────────────
  const loadMLPlan = () => {
    if (!plan || todayData.morning.locked) return;
    const items = plan.items.map((p) =>
      makeItem({
        name: p.name,
        category: p.category,
        weight: '',              // kitchen fills actual weight
        mlSuggested: p.qty,
        mlUnit: p.unit,
      })
    );
    setSessions((prev) => ({
      ...prev,
      [today]: { ...todayData, morning: { items, locked: false } },
    }));
    setShowMLBanner(false);
  };

  // ── Surplus analysis ────────────────────────────────────────────────────────
  const morningItems = todayData.morning.items.filter((i) => i.name && Number(i.weight) > 0);
  const eveningItems = todayData.evening.items.filter((i) => i.name && Number(i.weight) > 0);
  const bothLocked = todayData.morning.locked && todayData.evening.locked;

  const analysisRows = morningItems.map((m) => {
    const e = eveningItems.find((ev) => ev.name.toLowerCase() === m.name.toLowerCase());
    const planItem = plan?.items?.find((p) => p.name.toLowerCase() === m.name.toLowerCase());
    return {
      name: m.name,
      category: m.category,
      morningWeight: Number(m.weight),
      eveningWeight: e ? Number(e.weight) : 0,
      mlRecommended: planItem ? planItem.qty : null,
    };
  });

  const surplusRows = analysisRows.filter(
    (r) => r.morningWeight > 0 && r.eveningWeight / r.morningWeight > SURPLUS_THRESHOLD_PCT / 100
  );
  const totalSurplus  = surplusRows.reduce((s, r) => s + r.eveningWeight, 0);
  const totalMorning  = analysisRows.reduce((s, r) => s + r.morningWeight, 0);
  const totalEvening  = analysisRows.reduce((s, r) => s + r.eveningWeight, 0);
  const consumedPct   = totalMorning > 0 ? ((totalMorning - totalEvening) / totalMorning * 100).toFixed(1) : 0;

  // ── List on marketplace ─────────────────────────────────────────────────────
  const handleList = () => {
    const listing = {
      id: `sl-${Date.now()}`,
      kitchenId: user?.id,
      kitchenName: user?.restaurant || 'My Kitchen',
      city: workflow.plan?.city || 'Unknown',
      address: '',
      items: surplusRows.map((r) => ({
        name: r.name,
        category: r.category,
        morningPrepared: r.morningWeight,
        eveningRemaining: r.eveningWeight,
        surplus: r.eveningWeight,
      })),
      totalSurplus,
      pickupBy,
      notes,
      mlGenerated: !!plan,
      modelVersion: plan?.modelVersion || null,
      status: 'available',
      claimedBy: null,
      createdAt: new Date().toISOString(),
    };
    saveSurplusListing(listing);
    setWorkflow({ step: STEPS.LISTED });
    setWorkflowState(getWorkflow());
    setListed(true);
  };

  const morningTotal = todayData.morning.items.reduce((s, i) => s + Number(i.weight || 0), 0);
  const eveningTotal = todayData.evening.items.reduce((s, i) => s + Number(i.weight || 0), 0);
  const hasPlan      = !!plan && workflow.step !== STEPS.IDLE;
  const showMLCol    = hasPlan && activeTab === 'morning';

  return (
    <div className="mt-5 space-y-5">
      {/* ── Workflow status bar ── */}
      <DailyWorkflowBar currentStep={workflow.step} />

      {/* ── ML Plan banner ── */}
      {hasPlan && showMLBanner && !todayData.morning.locked && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold text-purple-800">ML Preparation Plan Ready</p>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                {plan?.modelVersion} · {plan?.confidence}% confidence
              </span>
            </div>
            <p className="text-xs text-purple-600 mb-2">
              Today&apos;s plan recommends <strong>{plan?.expectedMeals} meals</strong>, targeting
              &lt;{plan?.expectedSurplusKg} kg surplus and &lt;{plan?.expectedWasteKg} kg waste.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {plan.items.map((item) => (
                <span key={item.name} className="text-xs bg-white border border-purple-200 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                  {item.name}: <strong>{item.qty} {item.unit}</strong>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadMLPlan}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white"
                style={{ backgroundColor: '#7c3aed' }}
              >
                <ArrowRight size={12} /> Load into Morning Session
              </button>
              <button onClick={() => setShowMLBanner(false)} className="text-xs text-purple-500 hover:text-purple-700 px-3 py-2">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Info banner (no plan yet) ── */}
      {!hasPlan && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3">
          <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            <strong>Tip:</strong> First visit <strong>ML Intelligence → Today&apos;s Plan</strong> to generate AI-based preparation quantities.
            The plan will auto-populate your morning session here with recommended amounts.
          </p>
        </div>
      )}

      {/* ── Session cards ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Morning */}
        <div className={`bg-white rounded-xl border shadow-sm ${todayData.morning.locked ? 'border-green-200' : 'border-amber-200'}`}>
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
            <Sun size={15} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-900">Morning Session</h3>
            <span className="text-xs text-gray-400 ml-auto">What was prepared</span>
            {todayData.morning.locked && <CheckCircle2 size={14} className="text-green-500" />}
          </div>
          <div className="p-5">
            {/* Column headers */}
            <div className={`grid grid-cols-12 gap-2 mb-2 text-xs font-medium text-gray-500`}>
              <div className="col-span-4">Item</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-2">Actual (kg)</div>
              {showMLCol && <div className="col-span-2 text-purple-600">ML Suggests</div>}
              <div className="col-span-1"></div>
            </div>
            {todayData.morning.items.length === 0 && (
              <p className="text-xs text-gray-400 mb-3">
                {hasPlan ? 'Click "Load into Morning Session" above to pre-fill from ML plan.' : 'Click "+ Add item" to start.'}
              </p>
            )}
            {todayData.morning.items.map((item) => (
              <ItemRow key={item.id} item={item} locked={todayData.morning.locked}
                onChange={(id, f, v) => updateItem('morning', id, f, v)}
                onDelete={(id) => deleteItem('morning', id)}
                showML={showMLCol} />
            ))}
            {!todayData.morning.locked && (
              <button onClick={() => addItem('morning')} className="flex items-center gap-1.5 text-xs text-green-700 font-medium hover:text-green-800 mt-1">
                <Plus size={12} /> Add item
              </button>
            )}
            {!todayData.morning.locked && todayData.morning.items.some((i) => i.name && i.weight) && (
              <button onClick={() => lockSession('morning')} className="mt-3 w-full py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2" style={{ backgroundColor: '#16a34a' }}>
                <CheckCircle2 size={13} /> Lock Morning Session
              </button>
            )}
            {todayData.morning.locked && (
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                <CheckCircle2 size={12} /> Locked · Evening session auto-populated ↓
              </p>
            )}
            {morningTotal > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
                <span className="text-gray-500">Total prepared</span>
                <span className="font-bold text-gray-900">{morningTotal.toFixed(2)} kg</span>
              </div>
            )}
          </div>
        </div>

        {/* Evening */}
        <div className={`bg-white rounded-xl border shadow-sm ${todayData.evening.locked ? 'border-green-200' : todayData.morning.locked ? 'border-blue-200' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
            <Moon size={15} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-gray-900">Evening Session</h3>
            <span className="text-xs text-gray-400 ml-auto">What&apos;s remaining</span>
            {todayData.evening.locked && <CheckCircle2 size={14} className="text-green-500" />}
          </div>
          <div className="p-5">
            {!todayData.morning.locked && (
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">
                <AlertTriangle size={12} /> Lock the morning session first.
              </div>
            )}
            {todayData.morning.locked && todayData.evening.items.length === 0 && (
              <p className="text-xs text-gray-400 mb-3">Items auto-populated from morning. Fill remaining weights.</p>
            )}
            <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-medium text-gray-500">
              <div className="col-span-4">Item</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-2">Remaining (kg)</div>
              <div className="col-span-2"></div>
              <div className="col-span-1"></div>
            </div>
            {todayData.evening.items.map((item) => (
              <ItemRow key={item.id} item={item} locked={todayData.evening.locked || !todayData.morning.locked}
                onChange={(id, f, v) => updateItem('evening', id, f, v)}
                onDelete={(id) => deleteItem('evening', id)}
                showML={false} />
            ))}
            {todayData.morning.locked && !todayData.evening.locked && (
              <button onClick={() => addItem('evening')} className="flex items-center gap-1.5 text-xs text-green-700 font-medium hover:text-green-800 mt-1">
                <Plus size={12} /> Add item
              </button>
            )}
            {todayData.morning.locked && !todayData.evening.locked && todayData.evening.items.some((i) => i.weight) && (
              <button onClick={() => lockSession('evening')} className="mt-3 w-full py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2" style={{ backgroundColor: '#16a34a' }}>
                <CheckCircle2 size={13} /> Lock Evening Session → Detect Surplus
              </button>
            )}
            {todayData.evening.locked && (
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                <CheckCircle2 size={12} /> Locked · See surplus analysis below ↓
              </p>
            )}
            {eveningTotal > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
                <span className="text-gray-500">Total remaining</span>
                <span className="font-bold text-gray-900">{eveningTotal.toFixed(2)} kg</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Surplus Analysis ── */}
      {bothLocked && analysisRows.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <TrendingDown size={15} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-900">Surplus Analysis</h3>
              {hasPlan && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">ML-assisted</span>}
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-500">Prepared: <strong>{totalMorning.toFixed(2)} kg</strong></span>
              <span className="text-gray-500">Remaining: <strong className="text-amber-600">{totalEvening.toFixed(2)} kg</strong></span>
              <span className="text-gray-500">Consumed: <strong className="text-green-600">{consumedPct}%</strong></span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4 p-5">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-green-700">{(totalMorning - totalEvening).toFixed(2)} <span className="text-sm font-medium">kg</span></p>
              <p className="text-xs text-green-600 mt-1">Food Consumed</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-amber-600">{totalSurplus.toFixed(2)} <span className="text-sm font-medium">kg</span></p>
              <p className="text-xs text-amber-600 mt-1">Surplus Detected</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-blue-700">{surplusRows.length}</p>
              <p className="text-xs text-blue-600 mt-1">Items with Surplus</p>
            </div>
            {hasPlan && (
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-purple-700">
                  {plan.expectedSurplusKg > 0 ? ((totalSurplus - plan.expectedSurplusKg) / plan.expectedSurplusKg * 100).toFixed(0) : '—'}
                  <span className="text-sm font-medium">%</span>
                </p>
                <p className="text-xs text-purple-600 mt-1">vs ML Forecast</p>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Item</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Category</th>
                  {hasPlan && <th className="text-left text-xs font-medium text-purple-500 px-4 py-3">ML Recommended</th>}
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Prepared</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Remaining</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Surplus</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {analysisRows.map((row) => <SurplusRow key={row.name} row={row} showML={hasPlan} />)}
              </tbody>
            </table>
          </div>

          {/* List on marketplace */}
          {surplusRows.length > 0 && !listed && (
            <div className="p-5 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                📦 List Surplus on Marketplace for NGOs
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5"><Clock size={11} className="inline mr-1" />Pickup by</label>
                  <input type="time" value={pickupBy} onChange={(e) => setPickupBy(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-200" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Notes for NGOs</label>
                  <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Vegetarian, packed in containers" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-200" />
                </div>
              </div>
              <button onClick={handleList} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#16a34a' }}>
                <Send size={14} />
                Auto-List {totalSurplus.toFixed(2)} kg on Surplus Marketplace
                {hasPlan && <span className="ml-1 text-green-200 text-xs">(ML-tracked)</span>}
              </button>
            </div>
          )}

          {listed && (
            <div className="p-5 border-t border-gray-100">
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-4">
                <PackageCheck size={20} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Surplus Listed on Marketplace! 🎉</p>
                  <p className="text-xs text-green-600 mt-0.5">
                    <strong>{totalSurplus.toFixed(2)} kg</strong> is now visible to NGOs and delivery agents.
                    Today&apos;s workflow is complete. Tomorrow&apos;s ML plan will reflect today&apos;s outcomes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!bothLocked && (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <Scale size={28} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-500">Surplus analysis appears after both sessions are locked</p>
          <p className="text-xs text-gray-400 mt-1">
            {!todayData.morning.locked ? 'Start by logging morning prep weights →' : 'Now log and lock the evening remaining weights →'}
          </p>
        </div>
      )}
    </div>
  );
}
