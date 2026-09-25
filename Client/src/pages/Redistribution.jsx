import { redistributionData } from '../data/mockData';
import { Truck, Plus, MapPin } from 'lucide-react';

const allRedistributions = [
  { org: 'Asha Foundation', amount: '12 kg', date: 'Today', icon: '🏠', type: 'NGO', status: 'Delivered' },
  { org: 'City Food Bank', amount: '8 kg', date: 'Yesterday', icon: '🏛️', type: 'Food Bank', status: 'Delivered' },
  { org: 'Community Kitchen', amount: '2 kg', date: '12 Sep', icon: '🍳', type: 'Kitchen', status: 'Completed' },
  { org: 'Hope Shelter', amount: '5 kg', date: '10 Sep', icon: '🏡', type: 'Shelter', status: 'Delivered' },
  { org: 'Green Meals NGO', amount: '7 kg', date: '8 Sep', icon: '🥗', type: 'NGO', status: 'Pending' },
];

const statusColors = {
  Delivered: 'bg-green-50 text-green-600',
  Completed: 'bg-blue-50 text-blue-600',
  Pending: 'bg-amber-50 text-amber-600',
};

export default function Redistribution() {
  const totalKg = allRedistributions.reduce((acc, r) => acc + parseInt(r.amount), 0);

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Redistributed</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{totalKg} kg</p>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Partner Organizations</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{allRedistributions.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Pending Deliveries</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">
            {allRedistributions.filter(r => r.status === 'Pending').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Redistribution History</h3>
          <button className="bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5">
            <Plus size={13} />
            Log Redistribution
          </button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Organization', 'Type', 'Amount', 'Date', 'Status'].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {allRedistributions.map((item) => (
              <tr key={item.org} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-800">{item.org}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.type}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">{item.amount}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{item.date}</td>
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
  );
}
