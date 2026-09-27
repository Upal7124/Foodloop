import { useState } from 'react';
import { impactData } from '../../data/mockData';
import { Leaf } from 'lucide-react';

const ranges = ['This Month', 'Last Month', 'Last 3 Months'];

const icons = {
  food: '🍽️',
  water: '💧',
  energy: '⚡',
  leaf: '🌱',
};

export default function ImpactPanel() {
  const [range, setRange] = useState('This Month');
  const [open, setOpen] = useState(false);

  return (
    <div className="h-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Leaf size={16} className="text-green-600" />
          <h3 className="text-sm font-semibold text-gray-900">Impact</h3>
        </div>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50"
          >
            {range}
            <span className="text-gray-400">▾</span>
          </button>
          {open && (
            <div className="absolute top-full right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => { setRange(r); setOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Impact metrics */}
      <div className="space-y-3">
        {impactData.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* <span className="text-sm">{icons[item.icon]}</span> */}
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
            <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
