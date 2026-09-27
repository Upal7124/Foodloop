import { useEffect, useState } from 'react';
import { Save, Bell, Shield, Building2, Palette } from 'lucide-react';

export default function Settings() {
  const [restaurant, setRestaurant] = useState('The Green Plate');
  const [email, setEmail] = useState('admin@greenplate.com');
  const [aiRecommendations, setAiRecommendations] = useState(false);
  const [sensorAlerts, setSensorAlerts] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('foodloop-theme') || 'light');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('foodloop-theme', theme);

    let style = document.getElementById('foodloop-dark-mode-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'foodloop-dark-mode-styles';
      style.textContent = `
        html.dark body { background-color: #111827 !important; color: #f3f4f6 !important; }
        html.dark .bg-white { background-color: #1f2937 !important; }
        html.dark .bg-gray-50 { background-color: #111827 !important; }
        html.dark .bg-gray-100 { background-color: #374151 !important; }
        html.dark .border-gray-200, html.dark .border-gray-300 { border-color: #374151 !important; }
        html.dark .text-gray-900, html.dark .text-gray-800 { color: #f9fafb !important; }
        html.dark .text-gray-700, html.dark .text-gray-600, html.dark .text-gray-500 { color: #d1d5db !important; }
        html.dark input, html.dark textarea, html.dark select { background-color: #374151 !important; color: #f9fafb !important; border-color: #4b5563 !important; }
        html.dark .hover\\:bg-gray-50:hover { background-color: #374151 !important; }
      `;
      document.head.appendChild(style);
    }
  }, [theme]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-green-500' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`}></span>
    </button>
  );

  return (
    <div className="mt-5 space-y-5 max-w-2xl">
      {/* Restaurant Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={16} className="text-green-600" />
          <h3 className="text-sm font-semibold text-gray-900">Restaurant Information</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Restaurant Name</label>
            <input value={restaurant} onChange={(e) => setRestaurant(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Admin Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-green-600" />
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'AI Recommendations', desc: 'Get daily meal prep suggestions', value: aiRecommendations, onChange: setAiRecommendations },
            { label: 'Sensor Alerts', desc: 'Instant alerts for sensor anomalies', value: sensorAlerts, onChange: setSensorAlerts },
            { label: 'Weekly Report', desc: 'Receive weekly summary via email', value: weeklyReport, onChange: setWeeklyReport },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <Toggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={16} className="text-green-600" />
          <h3 className="text-sm font-semibold text-gray-900">Appearance</h3>
        </div>
        <div className="flex gap-3">
          {['light', 'dark'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium capitalize transition-colors ${
                theme === t ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {t} Mode
            </button>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div>
        {/* <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            saved ? 'bg-green-700 text-white' : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <Save size={14} />
          {saved ? 'Saved!' : 'Save Settings'}
        </button> */}
      </div>
    </div>
  );
}
