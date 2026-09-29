import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ranges = ["Last 7 Days", "Last 30 Days", "Last 90 Days"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3">
        <p className="text-xs font-semibold text-gray-700 mb-2">{label}</p>

        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />

            <span className="text-gray-600">{p.name}:</span>

            <span className="font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default function FoodConsumptionChart({ data = [] }) {
  const [range, setRange] = useState("Last 7 Days");
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Food Consumption vs. Prediction
          </h3>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-green-500 inline-block rounded" />
              <span className="text-xs text-gray-500">Actual Consumption</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-green-400 inline-block" />
              <span className="text-xs text-gray-500">AI Predicted</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50"
          >
            {range}
            <span className="text-gray-400">▾</span>
          </button>

          {open && (
            <div className="absolute top-full right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRange(r);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="actual"
            name="Actual Consumption"
            stroke="#22c55e"
            strokeWidth={2.5}
            dot={{
              fill: "#22c55e",
              r: 4,
              strokeWidth: 0,
            }}
            activeDot={{ r: 5 }}
          />

          <Line
            type="monotone"
            dataKey="predicted"
            name="AI Predicted"
            stroke="#86efac"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={{
              fill: "#86efac",
              r: 3,
              strokeWidth: 0,
            }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
