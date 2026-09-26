import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Sun, Moon, Plus, Trash2, CheckCircle2, AlertTriangle,
  TrendingDown, Scale, Send, ChevronDown, ChevronUp, Info,
  PackageCheck, Clock, Leaf,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveSurplusListing, FOOD_CATS } from '../data/surplusData';

const SESSION_KEY = 'foodloop_weigh_sessions';
const SURPLUS_THRESHOLD_PCT = 20; // >20% leftover = surplus

const loadSessions = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || {}; }
  catch { return {}; }
};
const saveSessions = (data) => localStorage.setItem(SESSION_KEY, JSON.stringify(data));

const todayKey = () => format(new Date(), 'yyyy-MM-dd');

const emptyItem = () => ({ id: Date.now().toString(), name: '', category: 'Rice / Grains', weight: '' });

// ── Sub: Weighing session form (morning or evening) ──────────────────────────
function SessionForm({ session, items, onAddItem, onUpdateItem, onDeleteItem, onLock, locked }) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-5">
            <input
              disabled={locked}
              type="text"
              value={item.name}
              onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
              placeholder={`Item ${idx + 1} name`}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div className="col-span-4">
            <select
              disabled={locked}
              value={item.category}
              onChange={(e) => onUpdateItem(item.id, 'category', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:bg-gray-50"
            >
              {FOOD_CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <div className="relative">
              <input
                disabled={locked}
                type="number"
                min="0"
                step="0.01"
                value={item.weight}
                onChange={(e) => onUpdateItem(item.id, 'weight', e.target.value)}
                placeholder="kg"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:bg-gray-50"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
            </div>
          </div>
          <div className="col-span-1 flex justify-center">
            {!locked && (
              <button onClick={() => onDeleteItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      ))}

      {!locked && (
        <button
          onClick={onAddItem}
          className="flex items-center gap-2 text-xs text-green-700 font-medium hover:text-green-800 mt-1"
        >
          <Plus size={13} /> Add item
        </button>
      )}

      {!locked && items.length > 0 && items.some((i) => i.name && i.weight) && (
        <button
          onClick={onLock}
          className="mt-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2"
          style={{ backgroundColor: '#16a34a' }}
        >
          <CheckCircle2 size={15} />
          Lock {session === 'morning' ? 'Morning' : 'Evening'} Session
        </button>
      )}

      {locked && (
        <div className="flex items-center gap-2 text-xs text-green-700 font-medium mt-1">
          <CheckCircle2 size={13} className="text-green-500" />
          Session locked · {format(new Date(), 'hh:mm a')}
        </div>
      )}
    </div>
  );
}

// ── Sub: Surplus result row ────────────────────────────────────────────────
function SurplusRow({ row }) {
  const pct = row.morningWeight > 0
    ? ((row.eveningWeight / row.morningWeight) * 100).toFixed(1)
    : 0;
  const isSurplus = row.eveningWeight / row.morningWeight > SURPLUS_THRESHOLD_PCT / 100;

  return (
    <tr className={`${isSurplus ? 'bg-amber-50' : ''}`}>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.name}</td>
      <td className="px-4 py-3 text-xs text-gray-500">{row.category}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{Number(row.morningWeight).toFixed(2)} kg</td>
      <td className="px-4 py-3 text-sm text-gray-700">{Number(row.eveningWeight).toFixed(2)} kg</td>
      <td className="px-4 py-3">
        <span className={`text-sm font-bold ${isSurplus ? 'text-amber-600' : 'text-gray-400'}`}>
          {Number(row.eveningWeight).toFixed(2)} kg
        </span>
        <span className="text-xs text-gray-400 ml-1">({pct}%)</span>
      </td>
      <td className="px-4 py-3">
        {isSurplus
          ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit"><AlertTriangle size={11} /> Surplus</span>
          : <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">Consumed</span>
        }
      </td>
    </tr>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function SurplusDetection() {
  const { user } = useAuth();
  const today = todayKey();
  const [sessions, setSessions] = useState(loadSessions);
  const todayData = sessions[today] || { morning: { items: [], locked: false }, evening: { items: [], locked: false } };

  const [activeTab, setActiveTab] = useState('morning');
  const [pickupBy, setPickupBy] = useState('21:00');
  const [notes, setNotes] = useState('');
  const [listed, setListed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => { saveSessions(sessions); }, [sessions]);

  const updateSession = (session, key, value) => {
    setSessions((prev) => ({
      ...prev,
      [today]: {
        ...todayData,
        [session]: { ...todayData[session], [key]: value },
      },
    }));
  };

  const addItem = (session) => {
    const items = [...(todayData[session].items || []), emptyItem()];
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

  const lockSession = (session) => updateSession(session, 'locked', true);

  // ── Surplus analysis ────────────────────────────────────────────────────
  const morningItems = todayData.morning.items.filter((i) => i.name && Number(i.weight) > 0);
  const eveningItems = todayData.evening.items.filter((i) => i.name && Number(i.weight) > 0);
  const bothLocked = todayData.morning.locked && todayData.evening.locked;

  const analysisRows = morningItems.map((m) => {
    const e = eveningItems.find((ev) => ev.name.toLowerCase() === m.name.toLowerCase());
    return {
      name: m.name,
      category: m.category,
      morningWeight: Number(m.weight),
      eveningWeight: e ? Number(e.weight) : 0,
    };
  });

  const surplusRows = analysisRows.filter(
    (r) => r.eveningWeight / r.morningWeight > SURPLUS_THRESHOLD_PCT / 100
  );
  const totalSurplus = surplusRows.reduce((s, r) => s + r.eveningWeight, 0);
  const totalMorning = analysisRows.reduce((s, r) => s + r.morningWeight, 0);
  const totalEvening = analysisRows.reduce((s, r) => s + r.eveningWeight, 0);

  // ── List on marketplace ─────────────────────────────────────────────────
  const handleList = () => {
    const listing = {
      id: `sl-${Date.now()}`,
      kitchenId: user?.id,
      kitchenName: user?.restaurant || 'My Kitchen',
      city: 'Unknown', // would come from kitchen profile
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
      status: 'available',
      claimedBy: null,
      createdAt: new Date().toISOString(),
    };
    saveSurplusListing(listing);
    setListed(true);
  };

  const morningTotal = morningItems.reduce((s, i) => s + Number(i.weight), 0);
  const eveningTotal = eveningItems.reduce((s, i) => s + Number(i.weight), 0);

  return (
    <div className="space-y-5">
      {/* ── Header banner ── */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-xl p-5 text-white flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold mb-1">Daily Surplus Detection</h2>
          <p className="text-green-100 text-sm">
            Log morning prep weights and evening remainders to automatically detect and list surplus food.
          </p>
        </div>
        <div className="text-right">
          <p className="text-green-200 text-xs">Today</p>
          <p className="text-white font-bold text-lg">{format(new Date(), 'dd MMM yyyy')}</p>
        </div>
      </div>

      {/* ── Info banner ── */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3">
        <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-blue-800 font-medium">How it works</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Log what you <strong>prepared in the morning</strong>. At the end of the day, log what&apos;s <strong>left over in the evening</strong>.
            FoodLoop will automatically calculate surplus (items with &gt;{SURPLUS_THRESHOLD_PCT}% remaining) and let you list them for NGOs.
          </p>
        </div>
      </div>

      {/* ── Session tabs + forms ── */}
      <div className="grid grid-cols-2 gap-5">
        {/* Morning */}
        <div className={`bg-white rounded-xl border shadow-sm ${activeTab === 'morning' ? 'border-amber-300' : 'border-gray-200'}`}>
          <div
            className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 cursor-pointer"
            onClick={() => setActiveTab('morning')}
          >
            <Sun size={16} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-900">Morning Session</h3>
            <span className="text-xs text-gray-400 ml-auto">Prepared food weights</span>
            {todayData.morning.locked && <CheckCircle2 size={14} className="text-green-500" />}
          </div>
          <div className="p-5">
            {/* Column headers */}
            <div className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-5 text-xs font-medium text-gray-500">Item Name</div>
              <div className="col-span-4 text-xs font-medium text-gray-500">Category</div>
              <div className="col-span-2 text-xs font-medium text-gray-500">Weight</div>
              <div className="col-span-1"></div>
            </div>
            {todayData.morning.items.length === 0 && (
              <p className="text-xs text-gray-400 mb-3">No items yet. Click "Add item" to start.</p>
            )}
            <SessionForm
              session="morning"
              items={todayData.morning.items}
              locked={todayData.morning.locked}
              onAddItem={() => addItem('morning')}
              onUpdateItem={(id, f, v) => updateItem('morning', id, f, v)}
              onDeleteItem={(id) => deleteItem('morning', id)}
              onLock={() => lockSession('morning')}
            />
            {morningTotal > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Total prepared</span>
                <span className="text-sm font-bold text-gray-900">{morningTotal.toFixed(2)} kg</span>
              </div>
            )}
          </div>
        </div>

        {/* Evening */}
        <div className={`bg-white rounded-xl border shadow-sm ${activeTab === 'evening' ? 'border-blue-300' : 'border-gray-200'}`}>
          <div
            className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 cursor-pointer"
            onClick={() => setActiveTab('evening')}
          >
            <Moon size={16} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-gray-900">Evening Session</h3>
            <span className="text-xs text-gray-400 ml-auto">Remaining food weights</span>
            {todayData.evening.locked && <CheckCircle2 size={14} className="text-green-500" />}
          </div>
          <div className="p-5">
            <div className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-5 text-xs font-medium text-gray-500">Item Name</div>
              <div className="col-span-4 text-xs font-medium text-gray-500">Category</div>
              <div className="col-span-2 text-xs font-medium text-gray-500">Remaining</div>
              <div className="col-span-1"></div>
            </div>
            {!todayData.morning.locked && (
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">
                <AlertTriangle size={12} />
                Lock the morning session first before logging evening data.
              </div>
            )}
            {todayData.evening.items.length === 0 && todayData.morning.locked && (
              <p className="text-xs text-gray-400 mb-3">No items yet. Click "Add item" to start.</p>
            )}
            <SessionForm
              session="evening"
              items={todayData.evening.items}
              locked={todayData.evening.locked || !todayData.morning.locked}
              onAddItem={() => addItem('evening')}
              onUpdateItem={(id, f, v) => updateItem('evening', id, f, v)}
              onDeleteItem={(id) => deleteItem('evening', id)}
              onLock={() => lockSession('evening')}
            />
            {eveningTotal > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Total remaining</span>
                <span className="text-sm font-bold text-gray-900">{eveningTotal.toFixed(2)} kg</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Surplus Analysis ── */}
      {bothLocked && analysisRows.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <TrendingDown size={16} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-900">Surplus Analysis</h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-500">Total prepared: <strong>{totalMorning.toFixed(2)} kg</strong></span>
              <span className="text-gray-500">Remaining: <strong className="text-amber-600">{totalEvening.toFixed(2)} kg</strong></span>
              <span className="text-gray-500">Consumed: <strong className="text-green-600">{(totalMorning - totalEvening).toFixed(2)} kg</strong></span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-5">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-green-700">{(totalMorning - totalEvening).toFixed(2)} <span className="text-sm font-medium">kg</span></p>
              <p className="text-xs text-green-600 mt-1">Food Consumed Today</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-amber-600">{totalSurplus.toFixed(2)} <span className="text-sm font-medium">kg</span></p>
              <p className="text-xs text-amber-600 mt-1">Surplus Detected</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-blue-700">{surplusRows.length}</p>
              <p className="text-xs text-blue-600 mt-1">Items with Surplus</p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Item', 'Category', 'Prepared (Morning)', 'Remaining (Evening)', 'Surplus', 'Status'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {analysisRows.map((row) => <SurplusRow key={row.name} row={row} />)}
              </tbody>
            </table>
          </div>

          {/* List on marketplace */}
          {surplusRows.length > 0 && !listed && (
            <div className="p-5 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-900 mb-3">List Surplus on Marketplace</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    <Clock size={11} className="inline mr-1" />
                    Pickup by
                  </label>
                  <input
                    type="time"
                    value={pickupBy}
                    onChange={(e) => setPickupBy(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Notes for NGOs</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Vegetarian, packed in containers"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-200"
                  />
                </div>
              </div>
              <button
                onClick={handleList}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: '#16a34a' }}
              >
                <Send size={14} />
                List {totalSurplus.toFixed(2)} kg on Surplus Marketplace
              </button>
            </div>
          )}

          {listed && (
            <div className="p-5 border-t border-gray-100">
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-4">
                <PackageCheck size={20} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Listed on Marketplace!</p>
                  <p className="text-xs text-green-600 mt-0.5">
                    {totalSurplus.toFixed(2)} kg of surplus food is now visible to NGOs and delivery agents.
                    Navigate to <strong>Surplus Marketplace</strong> to track claims.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!bothLocked && (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <Scale size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">Surplus analysis will appear here</p>
          <p className="text-xs text-gray-400 mt-1">Lock both morning and evening sessions to see the breakdown</p>
        </div>
      )}
    </div>
  );
}
