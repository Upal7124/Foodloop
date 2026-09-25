import { useState } from 'react';
import {
  Building2, MapPin, Phone, Clock, Users, ChefHat,
  Utensils, ArrowRight, CheckCircle2, SkipForward, Leaf
} from 'lucide-react';

const KITCHEN_TYPES = [
  { value: 'hospital', label: 'Hospital / Healthcare', icon: '🏥' },
  { value: 'school', label: 'School / College', icon: '🏫' },
  { value: 'corporate', label: 'Corporate Cafeteria', icon: '🏢' },
  { value: 'ngo', label: 'NGO / Charitable', icon: '🤝' },
  { value: 'restaurant', label: 'Restaurant / Hotel', icon: '🍽️' },
  { value: 'community', label: 'Community Kitchen', icon: '🏘️' },
  { value: 'government', label: 'Government Institution', icon: '🏛️' },
  { value: 'other', label: 'Other', icon: '🍳' },
];

const MEAL_RANGES = [
  'Under 100 meals/day',
  '100–300 meals/day',
  '300–500 meals/day',
  '500–1,000 meals/day',
  '1,000–5,000 meals/day',
  'Above 5,000 meals/day',
];

const CUISINE_TYPES = ['North Indian', 'South Indian', 'Continental', 'Chinese', 'Multi-cuisine', 'Vegan/Vegetarian', 'Other'];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function KitchenProfileStep({ pendingUser, onComplete, onSkip }) {
  const [form, setForm] = useState({
    kitchenName: pendingUser?.restaurant || '',
    kitchenType: '',
    mealsPerDay: '',
    cuisineTypes: [],
    address: '',
    city: '',
    state: '',
    pinCode: '',
    contactPhone: '',
    operatingFrom: '07:00',
    operatingTo: '21:00',
    operatingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    staffCount: '',
    hasWasteMgmt: false,
    hasRefrigeration: false,
    hasWeighingScale: false,
    additionalNotes: '',
  });

  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleCuisine = (c) => {
    setForm((prev) => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(c)
        ? prev.cuisineTypes.filter((x) => x !== c)
        : [...prev.cuisineTypes, c],
    }));
  };

  const toggleDay = (d) => {
    setForm((prev) => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(d)
        ? prev.operatingDays.filter((x) => x !== d)
        : [...prev.operatingDays, d],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.kitchenName.trim()) e.kitchenName = 'Kitchen name is required.';
    if (!form.kitchenType) e.kitchenType = 'Please select a kitchen type.';
    if (!form.mealsPerDay) e.mealsPerDay = 'Please select daily meal capacity.';
    if (!form.city.trim()) e.city = 'City is required.';
    if (form.contactPhone && !/^\d{10}$/.test(form.contactPhone.replace(/\D/g, ''))) {
      e.contactPhone = 'Enter a valid 10-digit phone number.';
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }
    onComplete(form);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f3f4f6' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #14532d 0%, #1a6b3a 60%, #166534 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full opacity-10" style={{ backgroundColor: '#4ade80' }}></div>
        <div className="absolute bottom-16 -left-8 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: '#22c55e' }}></div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#22c55e' }}>
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-xl">FoodLoop</p>
            <p className="text-green-300 text-xs">Cook Smart. Share More.</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            {/* Step 1 - done */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-green-400 flex items-center justify-center">
                <CheckCircle2 size={14} className="text-white" />
              </div>
              <span className="text-green-200 text-sm">Account Created</span>
            </div>
            <div className="flex-1 h-px bg-white/20"></div>
            {/* Step 2 - active */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <span className="text-white text-sm font-medium">Kitchen Profile</span>
            </div>
          </div>

          <h2 className="text-white text-3xl font-bold leading-snug mb-4">
            Tell Us About<br />Your Kitchen
          </h2>
          <p className="text-green-200 text-sm leading-relaxed mb-6">
            This helps FoodLoop give you smarter AI meal recommendations and connect you with the right redistribution partners.
          </p>
          <div className="space-y-2.5">
            {[
              { icon: '🎯', text: 'Tailored AI recommendations' },
              { icon: '🤝', text: 'Better redistribution matching' },
              { icon: '📊', text: 'Accurate waste benchmarks' },
              { icon: '🌱', text: 'Personalised impact reports' },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-3 bg-white/10 rounded-lg px-3 py-2">
                <span className="text-lg">{b.icon}</span>
                <span className="text-green-100 text-sm">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-green-300 text-xs">Good Food · Brighter Tomorrows 🌱</p>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-start justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg py-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 lg:hidden">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1a6b3a' }}>
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">FoodLoop</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kitchen Profile</h1>
                <p className="text-sm text-gray-500 mt-0.5">Step 2 of 2 — This is optional, you can skip anytime</p>
              </div>
              <button
                type="button"
                onClick={onSkip}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SkipForward size={13} />
                Skip for now
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* === Basic Info Card === */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ChefHat size={16} className="text-green-600" />
                <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
              </div>

              {/* Kitchen name */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Kitchen / Institution Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.kitchenName}
                    onChange={(e) => set('kitchenName', e.target.value)}
                    placeholder="e.g. St. Mary's Hospital Kitchen"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-colors ${errors.kitchenName ? 'border-red-300' : 'border-gray-200'}`}
                  />
                </div>
                {errors.kitchenName && <p className="text-xs text-red-500 mt-1">{errors.kitchenName}</p>}
              </div>

              {/* Kitchen type */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Kitchen Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {KITCHEN_TYPES.map((kt) => (
                    <button
                      key={kt.value}
                      type="button"
                      onClick={() => set('kitchenType', kt.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs text-left transition-all ${
                        form.kitchenType === kt.value
                          ? 'border-green-500 bg-green-50 text-green-800 font-medium'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base flex-shrink-0">{kt.icon}</span>
                      {kt.label}
                    </button>
                  ))}
                </div>
                {errors.kitchenType && <p className="text-xs text-red-500 mt-1">{errors.kitchenType}</p>}
              </div>

              {/* Meals per day */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Daily Meal Capacity <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.mealsPerDay}
                  onChange={(e) => set('mealsPerDay', e.target.value)}
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-colors ${errors.mealsPerDay ? 'border-red-300' : 'border-gray-200'}`}
                >
                  <option value="">Select capacity...</option>
                  {MEAL_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.mealsPerDay && <p className="text-xs text-red-500 mt-1">{errors.mealsPerDay}</p>}
              </div>
            </div>

            {/* === Cuisine Card === */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Utensils size={16} className="text-green-600" />
                <h3 className="text-sm font-semibold text-gray-900">Cuisine & Menu</h3>
                <span className="text-xs text-gray-400 ml-auto">Optional</span>
              </div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Cuisine Type(s)</label>
              <div className="flex flex-wrap gap-2">
                {CUISINE_TYPES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCuisine(c)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      form.cuisineTypes.includes(c)
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* === Location Card === */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-green-600" />
                <h3 className="text-sm font-semibold text-gray-900">Location & Contact</h3>
                <span className="text-xs text-gray-400 ml-auto">Optional</span>
              </div>

              {/* Address */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Street Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="Building, Street, Area"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => set('city', e.target.value)}
                    placeholder="Mumbai"
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 ${errors.city ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => set('state', e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">PIN Code</label>
                  <input
                    type="text"
                    value={form.pinCode}
                    onChange={(e) => set('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="400001"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Contact Phone</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={form.contactPhone}
                    onChange={(e) => set('contactPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 ${errors.contactPhone ? 'border-red-300' : 'border-gray-200'}`}
                  />
                </div>
                {errors.contactPhone && <p className="text-xs text-red-500 mt-1">{errors.contactPhone}</p>}
              </div>
            </div>

            {/* === Operations Card === */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-green-600" />
                <h3 className="text-sm font-semibold text-gray-900">Operations</h3>
                <span className="text-xs text-gray-400 ml-auto">Optional</span>
              </div>

              {/* Operating hours */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">Operating Hours</label>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={form.operatingFrom}
                    onChange={(e) => set('operatingFrom', e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  />
                  <span className="text-sm text-gray-400">to</span>
                  <input
                    type="time"
                    value={form.operatingTo}
                    onChange={(e) => set('operatingTo', e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Operating days */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">Operating Days</label>
                <div className="flex gap-2">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`w-10 h-10 rounded-full text-xs font-medium border transition-all ${
                        form.operatingDays.includes(d)
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-green-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Staff count */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  <Users size={12} className="inline mr-1" />
                  Kitchen Staff Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.staffCount}
                  onChange={(e) => set('staffCount', e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                />
              </div>
            </div>

            {/* === Equipment Card === */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base">⚙️</span>
                <h3 className="text-sm font-semibold text-gray-900">Equipment & Facilities</h3>
                <span className="text-xs text-gray-400 ml-auto">Optional</span>
              </div>
              <div className="space-y-3">
                {[
                  { field: 'hasWasteMgmt', label: 'Dedicated waste management system', icon: '🗑️' },
                  { field: 'hasRefrigeration', label: 'Cold storage / refrigeration units', icon: '❄️' },
                  { field: 'hasWeighingScale', label: 'Food weighing / prep scales', icon: '⚖️' },
                ].map((item) => (
                  <label
                    key={item.field}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      onClick={() => set(item.field, !form[item.field])}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                        form[item.field] ? 'bg-green-600 border-green-600' : 'border-gray-300 group-hover:border-green-400'
                      }`}
                    >
                      {form[item.field] && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className="text-sm text-gray-700">
                      <span className="mr-1.5">{item.icon}</span>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* === Notes === */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Additional Notes <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={form.additionalNotes}
                onChange={(e) => set('additionalNotes', e.target.value)}
                rows={3}
                placeholder="Any other details about your kitchen, special requirements, or redistribution preferences..."
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pb-4">
              <button
                type="button"
                onClick={onSkip}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Skip for now
              </button>
              <button
                type="submit"
                className="flex-2 px-8 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors"
                style={{ backgroundColor: '#16a34a', flexGrow: 2 }}
              >
                Save & Continue
                <ArrowRight size={15} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
