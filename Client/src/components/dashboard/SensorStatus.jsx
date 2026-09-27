import { sensorData } from '../../data/mockData';
import { Wifi } from 'lucide-react';

export default function SensorStatus() {
  return (
    <div className="h-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wifi size={16} className="text-green-600" />
          <h3 className="text-sm font-semibold text-gray-900">Sensor Status</h3>
        </div>
        <button className="text-xs text-green-600 font-medium hover:underline">View All</button>
      </div>

      {/* Sensor list */}
      <div className="space-y-3">
        {sensorData.map((sensor) => (
          <div key={sensor.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-8 rounded-full bg-green-100 flex-shrink-0"></div>
              <span className="text-xs text-gray-700">{sensor.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-700">{sensor.value}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                sensor.status === 'Online'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-500'
              }`}>
                {sensor.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
