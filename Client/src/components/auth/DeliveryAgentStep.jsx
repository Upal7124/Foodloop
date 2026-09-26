import { useState } from 'react';
import { Truck, MapPin, Phone, ArrowRight, SkipForward, Leaf, CheckCircle2 } from 'lucide-react';

const VEHICLE_TYPES = [
  { value: 'bike', label: '🏍️ Motorbike', capacity: 'Up to 30 kg' },
  { value: 'auto', label: '🛺 Auto-rickshaw', capacity: 'Up to 100 kg' },
  { value: 'van', label: '🚐 Mini-van', capacity: 'Up to 500 kg' },
  { value: 'truck', label: '🚛 Truck', capacity: '500+ kg' },
  { value: 'cycle', label: '🚲 Bicycle', capacity: 'Up to 15 kg' },
];

const TIME_SLOTS = ['Early Morning (4am–8am)', 'Morning (8am–12pm)', 'Afternoon (12pm–4pm)', 'Evening (4pm–8pm)', 'Night (8pm–12am)', 'Flexible'];

export default function DeliveryAgentStep({ pendingUser, onComplete, onSkip }) {
  const [form, setForm] = useState({
    agentName: pendingUser?.name || '',
    vehicleType: '',
    vehicleNumber: '',
    drivingLicenseNo: '',
    city: '',
    state: '',
    coverageRadius: '',
    availableSlots: [],
    contactPhone: '',
    hasInsulated: false,
    hasColdChain: false,
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const set = (f, v) => { setForm((p) => ({ ...p, [f]: v })); setErrors((p) => ({ ...p, [f]: undefined })); };
  const toggleSlot = (s) => setForm((p) => ({ ...p, availableSlots: p.availableSlots.includes(s) ? p.availableSlots.filter((x) => x !== s) : [...p.availableSlots, s] }));

  const validate = () => {
    const e = {};
    if (!form.vehicleType) e.vehicleType = 'Please select a vehicle type.';
    if (!form.city.trim()) e.city = 'City is required.';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onComplete(form);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f3f4f6' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #7c3aed 0%, #9333ea 60%, #7e22ce 100%)' }}>
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full opacity-10" style={{ backgroundColor: '#c4b5fd' }}></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-400"><Leaf className="w-6 h-6 text-white" /></div>
          <div><p className="text-white font-bold text-xl">FoodLoop</p><p className="text-purple-200 text-xs">Cook Smart. Share More.</p></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-purple-400 flex items-center justify-center"><CheckCircle2 size={14} className="text-white" /></div><span className="text-purple-200 text-sm">Account Created</span></div>
            <div className="flex-1 h-px bg-white/20"></div>
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center"><span className="text-white text-xs font-bold">2</span></div><span className="text-white text-sm font-medium">Agent Profile</span></div>
          </div>
          <h2 className="text-white text-3xl font-bold leading-snug mb-4">Set Up Your<br />Delivery Profile</h2>
          <p className="text-purple-200 text-sm leading-relaxed mb-6">Share your vehicle info and availability so kitchens and NGOs can connect with you.</p>
          <div className="space-y-2.5">
            {['📦 Get notified for nearby pickups', '🗺️ Optimised delivery routes', '📱 In-app coordination', '🌱 Earn by reducing waste'].map((b) => (
              <div key={b} className="flex items-center gap-3 bg-white/10 rounded-lg px-3 py-2"><span className="text-sm text-purple-100">{b}</span></div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-purple-300 text-xs">Good Food · Brighter Tomorrows 🌱</p>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-start justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg py-4">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Delivery Agent Profile</h1><p className="text-sm text-gray-500 mt-0.5">Step 2 of 2 — Optional, you can skip anytime</p></div>
            <button onClick={onSkip} className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"><SkipForward size={13} />Skip for now</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vehicle */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4"><Truck size={15} className="text-purple-600" /><h3 className="text-sm font-semibold text-gray-900">Vehicle Details</h3></div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Vehicle Type <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-1 gap-2 mb-4">
                {VEHICLE_TYPES.map((vt) => (
                  <button key={vt.value} type="button" onClick={() => set('vehicleType', vt.value)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm text-left transition-all ${form.vehicleType === vt.value ? 'border-purple-500 bg-purple-50 text-purple-800' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                    <span className="font-medium">{vt.label}</span>
                    <span className="text-xs text-gray-400">{vt.capacity}</span>
                  </button>
                ))}
              </div>
              {errors.vehicleType && <p className="text-xs text-red-500 mb-3">{errors.vehicleType}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1.5">Vehicle Number</label><input type="text" value={form.vehicleNumber} onChange={(e) => set('vehicleNumber', e.target.value)} placeholder="MH 01 AB 1234" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1.5">Driving License No.</label><input type="text" value={form.drivingLicenseNo} onChange={(e) => set('drivingLicenseNo', e.target.value)} placeholder="MH-0120230012345" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200" /></div>
              </div>
            </div>

            {/* Location & Coverage */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 mb-1"><MapPin size={15} className="text-purple-600" /><h3 className="text-sm font-semibold text-gray-900">Location & Coverage</h3></div>
              <div className="grid grid-cols-2 gap-3">
                <div><input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Base City *" className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200 ${errors.city ? 'border-red-300' : 'border-gray-200'}`} />{errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}</div>
                <input type="text" value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="State" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1.5">Coverage Radius (km)</label><input type="number" min="1" value={form.coverageRadius} onChange={(e) => set('coverageRadius', e.target.value)} placeholder="e.g. 20" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1.5"><Phone size={11} className="inline mr-1" />Contact Phone</label><input type="tel" value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} placeholder="+91 98765 43210" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200" /></div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Availability Slots</h3>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSlot(s)}
                    className={`py-2 px-3 rounded-lg text-xs border transition-all text-left ${form.availableSlots.includes(s) ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-200 text-gray-600 hover:border-purple-300'}`}>{s}</button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Equipment</h3>
              {[{ field: 'hasInsulated', label: 'Insulated delivery bags/boxes', icon: '🧊' }, { field: 'hasColdChain', label: 'Cold chain / refrigeration support', icon: '❄️' }].map((item) => (
                <label key={item.field} className="flex items-center gap-3 cursor-pointer mb-2">
                  <div onClick={() => set(item.field, !form[item.field])} className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer ${form[item.field] ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}>{form[item.field] && <CheckCircle2 size={12} className="text-white" />}</div>
                  <span className="text-sm text-gray-700">{item.icon} {item.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3 pb-4">
              <button type="button" onClick={onSkip} className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">Skip for now</button>
              <button type="submit" className="px-8 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#7c3aed', flexGrow: 2 }}>Save & Continue <ArrowRight size={15} /></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
