import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { wasteCompositionData } from '../../data/mockData';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3">
        <p className="text-xs font-semibold text-gray-700">{payload[0].name}</p>
        <p className="text-xs text-gray-500">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function WasteCompositionChart() {
  const totalWaste = 18;

  return (
    <div className="h-full w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Waste Composition</h3>
  
      <div className=" flex items-center justify-center gap-4">
        {/* Donut Chart */}
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={150} height={150}>
            <PieChart>
              <Pie
                data={wasteCompositionData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                dataKey="value"
              >
                {wasteCompositionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-gray-900">{totalWaste} kg</span>
            <span className="text-xs text-gray-500">Total Waste</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {wasteCompositionData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
              <span className="text-xs font-semibold text-gray-700">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
