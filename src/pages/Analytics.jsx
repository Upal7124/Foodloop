import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { analyticsMonthlyData } from '../data/mockData';

const summaryStats = [
  { label: 'Total Meals Prepared', value: '4,820', change: '+8.2%', positive: true },
  { label: 'Avg Daily Waste', value: '2.1 kg', change: '-18%', positive: true },
  { label: 'Redistribution Rate', value: '72%', change: '+12%', positive: true },
  { label: 'AI Accuracy', value: '91.3%', change: '+3.1%', positive: true },
];

export default function Analytics() {
  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {summaryStats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className={`text-xs font-semibold mt-1 ${s.positive ? 'text-green-600' : 'text-red-500'}`}>
              {s.change} vs last period
            </p>
          </div>
        ))}
      </div>

      {/* Monthly Waste & Redistribution Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Waste vs Redistribution (kg)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analyticsMonthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="waste" name="Food Waste" fill="#f87171" radius={[4, 4, 0, 0]} />
            <Bar dataKey="redistributed" name="Redistributed" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Meals Prepared Trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Meals Prepared — Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={analyticsMonthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="prepared"
              name="Meals Prepared"
              stroke="#1a6b3a"
              strokeWidth={2.5}
              dot={{ fill: '#1a6b3a', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
