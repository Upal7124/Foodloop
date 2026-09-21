import { Lightbulb, TrendingDown, ExternalLink } from 'lucide-react';

export default function AIRecommendation() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-500" />
          <h3 className="text-sm font-semibold text-gray-900">AI Recommendation</h3>
        </div>
        <button className="text-xs text-green-600 font-medium hover:underline flex items-center gap-1">
          View Details
          <ExternalLink size={11} />
        </button>
      </div>

      {/* Recommendation text */}
      <p className="text-xs text-gray-600 leading-relaxed mb-3">
        Based on the last 7 days, we recommend preparing{' '}
        <strong className="text-gray-900">500–520 meals</strong> tomorrow.
      </p>

      {/* Impact badge */}
      <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2.5">
        <TrendingDown size={14} className="text-green-600 flex-shrink-0" />
        <p className="text-xs text-green-700">
          This can reduce potential waste by <strong>~20%</strong>.
        </p>
      </div>
    </div>
  );
}
