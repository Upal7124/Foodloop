import { sensorData } from '../data/mockData';
import { Wifi, AlertTriangle, CheckCircle } from 'lucide-react';

const extendedSensors = [
  ...sensorData,
  { name: 'Outdoor Temp', value: '32.1 °C', status: 'Online' },
  { name: 'Water Meter', value: '340 L', status: 'Online' },
  { name: 'CO₂ Sensor', value: '412 ppm', status: 'Offline' },
];

export default function Sensors() {
  const online = extendedSensors.filter((s) => s.status === 'Online').length;
  const offline = extendedSensors.filter((s) => s.status === 'Offline').length;

  return (
    <div className="mt-5 space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Sensors</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{extendedSensors.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-green-600" />
            <p className="text-xs text-gray-500">Online</p>
          </div>
          <p className="text-3xl font-bold text-green-600 mt-1">{online}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-500" />
            <p className="text-xs text-gray-500">Offline</p>
          </div>
          <p className="text-3xl font-bold text-red-500 mt-1">{offline}</p>
        </div>
      </div>

      {/* Sensor cards grid */}
      <div className="grid grid-cols-3 gap-4">
        {extendedSensors.map((sensor) => (
          <div key={sensor.name} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wifi size={14} className={sensor.status === 'Online' ? 'text-green-500' : 'text-gray-300'} />
                <span className="text-xs font-medium text-gray-700">{sensor.name}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                sensor.status === 'Online' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
              }`}>
                {sensor.status}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{sensor.value}</p>
            <p className="text-xs text-gray-400 mt-1">Last updated: just now</p>
          </div>
        ))}
      </div>
    </div>
  );
}
