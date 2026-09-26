import { recentActivities } from '../../data/mockData';
import { Clock } from 'lucide-react';

const statusColors = {
  Logged: 'bg-blue-50 text-blue-600',
  Completed: 'bg-green-50 text-green-600',
  Resolved: 'bg-purple-50 text-purple-600',
  Pending: 'bg-amber-50 text-amber-600',
};

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <button className="text-xs text-green-600 font-medium hover:underline">View All</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-400 pb-2 pr-4">Time</th>
              <th className="text-left text-xs font-medium text-gray-400 pb-2 pr-4">Activity</th>
              <th className="text-left text-xs font-medium text-gray-400 pb-2 pr-4">Details</th>
              <th className="text-right text-xs font-medium text-gray-400 pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentActivities.map((activity, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-2.5 pr-4">
                  <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                </td>
                <td className="py-2.5 pr-4">
                  <span className="text-xs font-medium text-gray-800">{activity.activity}</span>
                </td>
                <td className="py-2.5 pr-4">
                  <span className="text-xs text-gray-600">{activity.details}</span>
                </td>
                <td className="py-2.5 text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[activity.status] || 'bg-gray-50 text-gray-600'}`}>
                    {activity.status}
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
