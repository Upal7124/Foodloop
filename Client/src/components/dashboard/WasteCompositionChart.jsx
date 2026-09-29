import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#14b8a6",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3">
        <p className="text-xs font-semibold text-gray-700">{payload[0].name}</p>
        <p className="text-xs text-gray-500">{payload[0].value} kg</p>
      </div>
    );
  }

  return null;
};

export default function WasteCompositionChart({ data = [], totalWaste = 0 }) {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="h-full w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Waste Composition
      </h3>

      {chartData.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">
          No waste data available
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Donut Chart */}
          <div className="relative flex-shrink-0">
            <ResponsiveContainer width={170} height={170}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={78}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>

                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-gray-900">
                {Number(totalWaste || 0).toFixed(1)} kg
              </span>

              <span className="text-xs text-gray-500">Total Waste</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full mt-3 space-y-2">
            {chartData.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        item.color || COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>

                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                  {Number(item.value || 0).toFixed(1)} kg
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
