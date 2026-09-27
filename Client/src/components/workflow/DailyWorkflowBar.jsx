import { STEP_META, getStepIndex } from '../../data/dailyWorkflow';

/**
 * Horizontal workflow progress bar shown on both ML Intelligence and Surplus Detection pages.
 * Shows the kitchen's current position in the daily food-waste-reduction workflow.
 */
export default function DailyWorkflowBar({ currentStep, compact = false }) {
  const currentIdx = getStepIndex(currentStep);

  if (compact) {
    const meta = STEP_META[currentIdx] || STEP_META[0];
    return (
      <div className="flex items-center gap-2 text-xs">
        <img src={meta.icon} alt={meta.label} className="w-4 h-4 object-contain" />
        <span className="font-semibold text-gray-700">{meta.label}</span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-500">{meta.desc}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-700">Today&apos;s Kitchen Workflow</p>
        <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
      </div>
      <div className="flex items-center">
        {STEP_META.map((step, idx) => {
          const isDone    = idx < currentIdx;
          const isActive  = idx === currentIdx;
          const isFuture  = idx > currentIdx;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              {/* Step node */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                    isDone   ? 'border-green-500 bg-green-50'   :
                    isActive ? 'border-green-600 bg-green-100'  :
                               'border-gray-200 bg-white'
                  }`}
                >
                  {isDone
                    ? <span className="text-green-600">✓</span>
                    : <img src={step.icon} alt={step.label} className="w-6 h-6 object-contain" />
                  }
                </div>
                <div className={`mt-1.5 text-center ${isActive ? 'text-green-700' : isDone ? 'text-green-500' : 'text-gray-400'}`}>
                  <p className={`text-xs font-semibold whitespace-nowrap ${isActive ? '' : ''}`}>{step.label}</p>
                  <p className="text-xs opacity-75 whitespace-nowrap hidden lg:block">{step.desc}</p>
                </div>
              </div>

              {/* Connector */}
              {idx < STEP_META.length - 1 && (
                <div className="flex-1 mx-2 h-0.5 mt-[-18px]" style={{ backgroundColor: idx < currentIdx ? '#22c55e' : '#e5e7eb' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
