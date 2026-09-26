import { FileText, Download, Eye } from 'lucide-react';

const reports = [
  { id: 1, name: 'Monthly Waste Report — September 2026', type: 'Waste', date: '2026-09-21', size: '1.2 MB', status: 'Ready' },
  { id: 2, name: 'Redistribution Summary — Q3 2026', type: 'Redistribution', date: '2026-09-15', size: '850 KB', status: 'Ready' },
  { id: 3, name: 'Sensor Health Report — Week 38', type: 'Sensors', date: '2026-09-19', size: '420 KB', status: 'Ready' },
  { id: 4, name: 'AI Prediction Accuracy — September 2026', type: 'AI', date: '2026-09-20', size: '600 KB', status: 'Ready' },
  { id: 5, name: 'Impact Report — August 2026', type: 'Impact', date: '2026-09-01', size: '2.1 MB', status: 'Ready' },
  { id: 6, name: 'Weekly Operations Report — Week 37', type: 'Operations', date: '2026-09-14', size: '380 KB', status: 'Ready' },
];

const typeColors = {
  Waste: 'bg-red-50 text-red-600',
  Redistribution: 'bg-green-50 text-green-600',
  Sensors: 'bg-blue-50 text-blue-600',
  AI: 'bg-purple-50 text-purple-600',
  Impact: 'bg-emerald-50 text-emerald-600',
  Operations: 'bg-gray-100 text-gray-600',
};

export default function Reports() {
  return (
    <div className="space-y-5">
      {/* Header actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Generated Reports</h3>
          <p className="text-xs text-gray-500 mt-0.5">Download or preview your reports</p>
        </div>
        <button className="bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5">
          <FileText size={13} />
          Generate New Report
        </button>
      </div>

      {/* Reports list */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Report Name', 'Type', 'Date', 'Size', 'Actions'].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText size={15} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-800">{report.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[report.type]}`}>
                    {report.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{report.date}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{report.size}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Preview">
                      <Eye size={14} className="text-gray-500" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Download">
                      <Download size={14} className="text-green-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
