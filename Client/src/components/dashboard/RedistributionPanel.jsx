import { redistributionData } from '../../data/mockData';
import { Truck } from 'lucide-react';

export default function RedistributionPanel() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-900">Redistribution</h3>
        </div>
        <button className="text-xs text-green-600 font-medium hover:underline">View All</button>
      </div>

      {/* Total */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-900">22 kg</p>
        <p className="text-xs text-gray-500">Surplus food redistributed this week</p>
      </div>

      {/* Partners list */}
      <div className="space-y-3">
        {redistributionData.map((item) => (
          <div key={item.org} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700">{item.org}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-700">{item.amount}</span>
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
