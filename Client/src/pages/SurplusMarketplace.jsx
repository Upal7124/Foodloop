import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  MapPin, Clock, Scale, Filter, Search, CheckCircle2,
  Package, Truck, ChevronDown, AlertCircle, Leaf,
  RefreshCw, PhoneCall, Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSurplusListings, updateListingStatus, seedSurplusListings } from '../data/surplusData';

const STATUS_CONFIG = {
  available: { label: 'Available',  color: '#22c55e', bg: '#f0fdf4' },
  claimed:   { label: 'Claimed',    color: '#3b82f6', bg: '#eff6ff' },
  completed: { label: 'Completed',  color: '#6b7280', bg: '#f9fafb' },
};

const CAT_COLORS = {
  'Rice / Grains': '#22c55e',
  'Vegetables':    '#3b82f6',
  'Pulses':        '#8b5cf6',
  'Bread / Bakery':'#f59e0b',
  'Meat / Dairy':  '#f97316',
  'Fruits':        '#ec4899',
  'Beverages':     '#06b6d4',
  'Other':         '#6b7280',
};

function SurplusCard({ listing, onClaim, currentUser }) {
  const [expanded, setExpanded] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const cfg = STATUS_CONFIG[listing.status] || STATUS_CONFIG.available;
  const isAvailable = listing.status === 'available';
  const isMyKitchen = listing.kitchenId === currentUser?.id;
  const timeAgo = formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true });
  const pickupDeadline = listing.pickupBy;

  const handleClaim = async () => {
    setClaiming(true);
    await new Promise((r) => setTimeout(r, 700));
    onClaim(listing.id);
    setClaiming(false);
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm transition-all ${isAvailable ? 'border-gray-200 hover:border-green-300 hover:shadow-md' : 'border-gray-100'}`}>
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-gray-900">{listing.kitchenName}</h3>
              {isMyKitchen && (
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium border border-green-100">
                  Your listing
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
              <span className="flex items-center gap-1"><MapPin size={11} />{listing.city || 'Location not set'}</span>
              <span className="flex items-center gap-1"><Clock size={11} />Posted {timeAgo}</span>
              {pickupDeadline && (
                <span className="flex items-center gap-1 text-amber-600 font-medium"><Clock size={11} />Pickup by {pickupDeadline}</span>
              )}
            </div>
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0"
            style={{ backgroundColor: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Total surplus highlight */}
        <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3 mb-3">
          <div className="flex items-center gap-2">
            <Scale size={16} className="text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Total Surplus</p>
              <p className="text-xl font-black text-green-700">{listing.totalSurplus?.toFixed(1)} kg</p>
            </div>
          </div>
          <div className="flex-1 flex flex-wrap gap-2 justify-end">
            {listing.items?.map((item) => (
              <span
                key={item.name}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ backgroundColor: (CAT_COLORS[item.category] || '#6b7280') + '20', color: CAT_COLORS[item.category] || '#6b7280' }}
              >
                {item.name} · {Number(item.surplus).toFixed(1)} kg
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        {listing.notes && (
          <p className="text-xs text-gray-500 mb-3 italic">"{listing.notes}"</p>
        )}

        {/* Claimed by */}
        {listing.claimedBy && (
          <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mb-3">
            <CheckCircle2 size={13} />
            Claimed by <strong>{listing.claimedBy}</strong>
          </div>
        )}

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-3"
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronDown size={12} className="-rotate-90" />}
          {expanded ? 'Hide details' : 'View item breakdown'}
        </button>

        {/* Expanded: item breakdown */}
        {expanded && (
          <div className="border-t border-gray-100 pt-3 space-y-2 mb-3">
            <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-500 px-2">
              <span>Item</span>
              <span>Prepared</span>
              <span>Remaining</span>
              <span>Surplus</span>
            </div>
            {listing.items?.map((item) => (
              <div key={item.name} className="grid grid-cols-4 gap-2 text-xs bg-gray-50 rounded-lg px-2 py-2">
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="text-gray-500">{Number(item.morningPrepared).toFixed(1)} kg</span>
                <span className="text-amber-600">{Number(item.eveningRemaining).toFixed(1)} kg</span>
                <span className="font-bold text-green-700">{Number(item.surplus).toFixed(1)} kg</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {isAvailable && !isMyKitchen && (
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-70"
            style={{ backgroundColor: '#16a34a' }}
          >
            {claiming
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>Claiming…</>
              : <><Truck size={14} /> Claim this Surplus</>
            }
          </button>
        )}
        {!isAvailable && listing.status !== 'completed' && (
          <p className="text-xs text-center text-gray-400 mt-1">This listing has been claimed</p>
        )}
      </div>
    </div>
  );
}

export default function SurplusMarketplace() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('available');
  const [filterCity, setFilterCity] = useState('All');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    seedSurplusListings(); // ensure demo data exists
    setListings(getSurplusListings());
  }, []);

  const refresh = () => {
    setListings(getSurplusListings());
    setLastRefresh(new Date());
  };

  const handleClaim = (id) => {
    const orgName = user?.name ? `${user.name} (${user.restaurant || 'NGO'})` : 'Anonymous NGO';
    updateListingStatus(id, 'claimed', orgName);
    setListings(getSurplusListings());
  };

  // Derive filter options
  const cities = ['All', ...new Set(listings.map((l) => l.city).filter(Boolean))];

  const filtered = listings.filter((l) => {
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    const matchCity = filterCity === 'All' || l.city === filterCity;
    const matchSearch = !search ||
      l.kitchenName.toLowerCase().includes(search.toLowerCase()) ||
      l.items?.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchCity && matchSearch;
  });

  const available = listings.filter((l) => l.status === 'available').length;
  const claimed   = listings.filter((l) => l.status === 'claimed').length;
  const totalKg   = listings.filter((l) => l.status === 'available').reduce((s, l) => s + (l.totalSurplus || 0), 0);

  return (
    <div className="space-y-5">
      {/* ── Hero banner ── */}
      <div className="bg-gradient-to-r from-green-700 to-teal-600 rounded-xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Leaf size={16} className="text-green-300" />
              <span className="text-green-200 text-xs font-medium uppercase tracking-wide">Live Marketplace</span>
            </div>
            <h2 className="text-xl font-bold mb-1">Surplus Food Listings</h2>
            <p className="text-green-100 text-sm">
              Institutional kitchens list their daily surplus here. Claim and coordinate pickup.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-green-200 text-xs mb-1">Updated {format(lastRefresh, 'hh:mm a')}</p>
            <button onClick={refresh} className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition-colors">
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { icon: '🟢', label: 'Available Now', value: available },
            { icon: '✅', label: 'Claimed Today', value: claimed },
            { icon: '⚖️', label: 'Total Surplus (kg)', value: totalKg.toFixed(1) },
          ].map((s) => (
            <div key={s.label} className="bg-white/15 rounded-xl px-4 py-3">
              <p className="text-green-100 text-xs mb-1">{s.icon} {s.label}</p>
              <p className="text-white font-black text-xl">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by kitchen or food item…"
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 bg-white"
          />
        </div>

        {/* Status filter */}
        <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
          {[
            { key: 'available', label: '🟢 Available' },
            { key: 'claimed',   label: '✅ Claimed' },
            { key: 'all',       label: 'All' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${filterStatus === f.key ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* City filter */}
        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* ── Result count ── */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Showing <strong>{filtered.length}</strong> listing{filtered.length !== 1 ? 's' : ''}
          {filterStatus === 'available' ? ' available for pickup' : ''}
        </p>
        {filterStatus === 'available' && totalKg > 0 && (
          <p className="text-xs text-green-700 font-medium">
            🌱 {totalKg.toFixed(1)} kg of food can be saved today
          </p>
        )}
      </div>

      {/* ── Listing cards ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <Package size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">No listings found</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((listing) => (
            <SurplusCard
              key={listing.id}
              listing={listing}
              onClaim={handleClaim}
              currentUser={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
