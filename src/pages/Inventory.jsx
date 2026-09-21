import { useState } from 'react';
import { inventoryData } from '../data/mockData';
import { Package, Search, Filter } from 'lucide-react';

const statusColors = {
  Good: 'bg-green-50 text-green-600',
  'Expiring Soon': 'bg-amber-50 text-amber-600',
  Critical: 'bg-red-50 text-red-500',
};

export default function Inventory() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(inventoryData.map((i) => i.category))];

  const filtered = inventoryData.filter((item) => {
    const matchSearch = item.item.toLowerCase().includes(search.toLowerCase());
    const matchCat = filter === 'All' || item.category === filter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Items', value: inventoryData.length, color: 'text-gray-900' },
          { label: 'Expiring Soon', value: inventoryData.filter(i => i.status === 'Expiring Soon').length, color: 'text-amber-600' },
          { label: 'Critical', value: inventoryData.filter(i => i.status === 'Critical').length, color: 'text-red-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 text-gray-700"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <button className="ml-auto bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5">
            <Package size={13} />
            Add Item
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Item', 'Category', 'Quantity', 'Expiry Date', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.item}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.expiry}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
