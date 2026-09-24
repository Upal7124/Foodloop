import { useState } from 'react';
import { Building2, MapPin, Phone, Globe, Users, ArrowRight, SkipForward, Leaf, CheckCircle2, FileText } from 'lucide-react';

const NGO_FOCUS = ['Food Distribution', 'Child Nutrition', 'Elderly Care', 'Homeless Shelter', 'Community Kitchen', 'Disaster Relief', 'Other'];
const COVERAGE = ['Local (within 5 km)', 'City-wide', 'District-level', 'State-level', 'Multi-state'];

export default function NGOProfileStep({ pendingUser, onComplete, onSkip }) {
  const [form, setForm] = useState({
    orgName: pendingUser?.restaurant || '',
    regNumber: '',
    focusAreas: [],
    coverage: '',
    beneficiaries: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    contactPhone: '',
    website: '',
    acceptsPickup: true,
    hasColdStorage: false,
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const set = (f, v) => { setForm((p) => ({ ...p, [f]: v })); setErrors((p) => ({ ...p, [f]: undefined })); };
  const toggleFocus = (a) => setForm((p) => ({ ...p, focusAreas: p.focusAreas.includes(a) ? p.focusAreas.filter((x) => x !== a) : [...p.focusAreas, a] }));

  const validate = () => {
    const e = {};
    if (!form.orgName.trim()) e.orgName = 'Organization name is required.';
    if (!form.city.trim()) e.city = 'City is required.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onComplete(form);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f3f4f6' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #0f4c81 0%, #1e6fba 60%, #1a5fa0 100%)' }}>
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full opacity-10" style={{ backgroundColor: '#60a5fa' }}></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-400"><Leaf className="w-6 h-6 text-white" /></div>
          <div><p className="text-white font-bold text-xl">FoodLoop</p><p className="text-blue-200 text-xs">Cook Smart. Share More.</p></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center"><CheckCircle2 size={14} className="text-white" /></div><span className="text-blue-200 text-sm">Account Created</span></div>
            <div className="flex-1 h-px bg-white/20"></div>
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center"><span className="text-white text-xs font-bold">2</span></div><span className="text-white text-sm font-medium">NGO Profile</span></div>
          </div>
          <h2 className="text-white text-3xl font-bold leading-snug mb-4">Tell Us About<br />Your Organisation</h2>
          <p className="text-blue-200 text-sm leading-relaxed mb-6">Helps us match you with the right surplus food sources near you.</p>
          <div className="space-y-2.5">
            {['🎯 Get matched with nearby kitchen surpluses', '📦 One-click surplus claiming', '🚚 Coordinate with delivery agents', '📊 Track your impact reports'].map((b) => (
              <div key={b} className="flex items-center gap-3 bg-white/10 rounded-lg px-3 py-2"><span className="text-sm">{b}</span></div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-blue-300 text-xs">Good Food · Brighter Tomorrows 🌱</p>
      </div>

      {/* Right - form */}
      <div className="flex-1 flex items-start justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg py-4">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">NGO Profile</h1><p className="text-sm text-gray-500 mt-0.5">Step 2 of 2 — Optional, you can skip anytime</p></div>
            <button onClick={onSkip} className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"><SkipForward size={13} />Skip for now</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2"><Building2 size={15} className="text-blue-600" /><h3 className="text-sm font-semibold text-gray-900">Organization Details</h3></div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Organization Name <span className="text-red-400">*</span></label>
                <input type="text" value={form.orgName} onChange={(e) => set('orgName', e.target.value)} placeholder="e.g. Asha Foundation" className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.orgName ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.orgName && <p className="text-xs text-red-500 mt-1">{errors.orgName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5"><FileText size={11} className="inline mr-1" />NGO Registration Number</label>
                <input type="text" value={form.regNumber} onChange={(e) => set('regNumber', e.target.value)} placeholder="FCRA / 80G / Trust Deed No." className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Focus Areas</label>
                <div className="flex flex-wrap gap-2">{NGO_FOCUS.map((a) => (<button key={a} type="button" onClick={() => toggleFocus(a)} className={`px-3 py-1.5 rounded-full text-xs border transition-all ${form.focusAreas.includes(a) ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>{a}</button>))}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Coverage Area</label>
                  <select value={form.coverage} onChange={(e) => set('coverage', e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200">
                    <option value="">Select…</option>
                    {COVERAGE.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5"><Users size={11} className="inline mr-1" />Daily Beneficiaries</label>
                  <input type="number" value={form.beneficiaries} onChange={(e) => set('beneficiaries', e.target.value)} placeholder="e.g. 500" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 mb-1"><MapPin size={15} className="text-blue-600" /><h3 className="text-sm font-semibold text-gray-900">Location & Contact</h3></div>
              <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Street address" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              <div className="grid grid-cols-3 gap-3">
                <div><input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="City *" className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.city ? 'border-red-300' : 'border-gray-200'}`} />{errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}</div>
                <input type="text" value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="State" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <input type="text" value={form.pinCode} onChange={(e) => set('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="PIN" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative"><Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="tel" value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} placeholder="Contact Phone" className="w-full pl-9 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
                <div className="relative"><Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="url" value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="Website URL" className="w-full pl-9 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Capabilities</h3>
              {[{ field: 'acceptsPickup', label: 'We can pick up food from kitchens', icon: '🚗' }, { field: 'hasColdStorage', label: 'We have cold storage facilities', icon: '❄️' }].map((item) => (
                <label key={item.field} className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => set(item.field, !form[item.field])} className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer ${form[item.field] ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>{form[item.field] && <CheckCircle2 size={12} className="text-white" />}</div>
                  <span className="text-sm text-gray-700">{item.icon} {item.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3 pb-4">
              <button type="button" onClick={onSkip} className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">Skip for now</button>
              <button type="submit" className="px-8 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#1e6fba', flexGrow: 2 }}>Save & Continue <ArrowRight size={15} /></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
