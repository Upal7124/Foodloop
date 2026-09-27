import { useState, useEffect, useRef } from 'react';
import { format, addDays } from 'date-fns';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from 'recharts';
import {
  Brain, Cpu, Activity, TrendingUp,
  CheckCircle2, RefreshCw, Upload, Clock,
  Server, Database, BarChart2, Sparkles,
  Target, ArrowUpRight, ArrowDownRight, Wifi,
  Send, ArrowRight, PackageCheck,
} from 'lucide-react';
import {
  seedMLData, getTrainingRuns, getPredictions,
  saveTrainingRun, savePrediction, mockTrainAPI, mockPredictAPI,
} from '../data/mlData';
import {
  getWorkflow, setWorkflow, STEPS, mockGeneratePlan,
} from '../data/dailyWorkflow';
import DailyWorkflowBar from '../components/workflow/DailyWorkflowBar';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate   = (d) => format(new Date(d), 'dd MMM');
const fmtFull   = (d) => format(new Date(d), 'dd MMM yyyy, hh:mm a');
const fmtShort  = (d) => format(new Date(d), 'MMM dd');

const ML_ENDPOINT = 'https://ml-api.foodloop.internal';

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 text-xs">
      <p className="text-gray-500 mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  );
};

// ─── Metric card ─────────────────────────────────────────────────────────────
function MetricCard({ icon, label, value, unit, sub, trend, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        {/* <span className="text-base">{icon}</span> */}
        <span className="text-xs text-gray-500">{label}</span>
        {trend !== undefined && (
          <span className={`ml-auto flex items-center gap-0.5 text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend > 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-black" style={{ color }}>{value}</span>
        {unit && <span className="text-xs text-gray-400 mb-0.5">{unit}</span>}
      </div>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Training progress overlay ────────────────────────────────────────────────
function TrainingProgress({ progress, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#14532d' }}>
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Training ML Model</h3>
            <p className="text-xs text-gray-500">{ML_ENDPOINT}/train</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{progress.msg}</span>
            <span className="font-bold">{progress.pct}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress.pct}%`, backgroundColor: '#16a34a' }}
            />
          </div>
        </div>

        {/* Steps log */}
        <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
          {progress.logs?.map((log, i) => (
            <div key={i} className={`${i === progress.logs.length - 1 ? 'text-green-400' : 'text-gray-400'}`}>
              <span className="text-gray-600">{'>'} </span>{log}
            </div>
          ))}
          {progress.pct < 100 && <span className="text-green-400 animate-pulse">█</span>}
        </div>

        {progress.pct === 100 && (
          <button
            onClick={onClose}
            className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: '#16a34a' }}
          >
            View Results
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Prediction result card ───────────────────────────────────────────────────
function PredictionCard({ pred, icon, color }) {
  const error = pred.actual !== null ? Math.abs(pred.predicted - pred.actual) : null;
  const errorPct = pred.actual ? ((error / pred.actual) * 100).toFixed(1) : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        {/* <span className="text-lg">{icon}</span> */}
        <span className="text-xs font-medium text-gray-600">{pred.label}</span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: color + '20', color }}
        >
          {pred.confidence}% confident
        </span>
      </div>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-3xl font-black" style={{ color }}>{pred.predicted}</span>
        <span className="text-sm text-gray-400 mb-1">{pred.unit}</span>
      </div>
      {pred.lower !== undefined && (
        <p className="text-xs text-gray-400">Range: {pred.lower} – {pred.upper} {pred.unit}</p>
      )}
      {pred.actual !== null && pred.actual !== undefined && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2">
          <span className="text-xs text-gray-500">Actual: <strong>{pred.actual}</strong></span>
          <span className={`text-xs font-medium ${errorPct < 10 ? 'text-green-600' : errorPct < 20 ? 'text-amber-500' : 'text-red-500'}`}>
            ({errorPct}% error)
          </span>
        </div>
      )}
      {!pred.actual && <p className="text-xs text-gray-400 mt-2">Awaiting actual data…</p>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MLIntelligence() {
  const [runs, setRuns] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [activeTab, setActiveTab] = useState('today');
  const [training, setTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [apiStatus, setApiStatus] = useState('online');
  const logsRef = useRef([]);

  // ── Workflow & plan generation ─────────────────────────────────────────────
  const [workflow, setWorkflowState] = useState(getWorkflow);
  const [planGenerating, setPlanGenerating] = useState(false);
  const [planProgress, setPlanProgress]     = useState(null);
  const [planLogs, setPlanLogs]             = useState([]);
  const [planPushed, setPlanPushed]         = useState(false);

  useEffect(() => {
    seedMLData();
    setRuns(getTrainingRuns());
    setPredictions(getPredictions());
    const wf = getWorkflow();
    setWorkflowState(wf);
    if (wf.step !== STEPS.IDLE && wf.plan) setPlanPushed(true);
  }, []);

  // Latest metrics from most recent run
  const latestRun = runs[0];
  const prevRun   = runs[1];
  const accTrend  = latestRun && prevRun ? latestRun.accuracy - prevRun.accuracy : 0;
  const maeTrend  = latestRun && prevRun ? prevRun.mae - latestRun.mae : 0; // lower MAE = better, so flip

  // Chart data: accuracy & loss over training history
  const trendChartData = [...runs].reverse().map((r) => ({
    date: fmtShort(r.runDate),
    accuracy: r.accuracy,
    loss: r.loss * 100, // scale for readability
    mae: r.mae,
  }));

  // Chart: predicted vs actual (meals)
  const predChartData = [...predictions]
    .filter((p) => p.type === 'meals' && p.actual !== null)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14)
    .map((p) => ({
      date: fmtShort(p.date),
      Predicted: p.predicted,
      Actual: p.actual,
    }));

  // ── Train model ─────────────────────────────────────────────────────────────
  const handleTrain = async () => {
    setTraining(true);
    logsRef.current = [];
    setTrainingProgress({ pct: 0, msg: 'Initialising…', logs: [] });

    const payload = {
      dataPoints: Math.floor(Math.random() * 50 + 100),
      items: ['Basmati Rice', 'Dal Tadka', 'Mixed Vegetables', 'Chapati'],
      date: new Date().toISOString(),
    };

    const result = await mockTrainAPI(payload, (step) => {
      logsRef.current = [...logsRef.current, step.msg];
      setTrainingProgress({ pct: step.pct, msg: step.msg, logs: [...logsRef.current] });
    });

    if (result.success) {
      const newRun = {
        id: `run-live-${Date.now()}`,
        runDate: new Date().toISOString(),
        ...result,
      };
      saveTrainingRun(newRun);
      setRuns(getTrainingRuns());
    }
    setTraining(false);
  };

  const closeProgress = () => setTrainingProgress(null);

  // ── Get prediction ───────────────────────────────────────────────────────────
  const handlePredict = async () => {
    setPredicting(true);
    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    const result = await mockPredictAPI(tomorrow);
    if (result.success) {
      setLatestPrediction(result);
      result.predictions.forEach((p) => {
        savePrediction({
          id: `pred-${Date.now()}-${p.type}`,
          date: addDays(new Date(), 1).toISOString(),
          ...p,
          actual: null,
          modelVersion: result.modelVersion,
        });
      });
      setPredictions(getPredictions());
    }
    setPredicting(false);
  };

  // ── Ping API ─────────────────────────────────────────────────────────────────
  const pingAPI = async () => {
    setApiStatus('checking');
    await new Promise((r) => setTimeout(r, 1200));
    setApiStatus('online');
  };

  // ── Generate today's preparation plan ────────────────────────────────────────
  const handleGeneratePlan = async () => {
    setPlanGenerating(true);
    setPlanLogs([]);
    setPlanProgress({ pct: 0, msg: 'Starting…' });

    const result = await mockGeneratePlan((step) => {
      setPlanLogs((prev) => [...prev, step.msg]);
      setPlanProgress(step);
    });

    if (result.success) {
      setWorkflow({ step: STEPS.PLAN_READY, plan: result });
      setWorkflowState(getWorkflow());
    }
    setPlanGenerating(false);
  };

  const handlePushToKitchen = () => {
    const wf = getWorkflow();
    if (wf.plan) {
      setWorkflow({ step: STEPS.PLAN_READY, plan: wf.plan });
      setWorkflowState(getWorkflow());
      setPlanPushed(true);
    }
  };

  const PRED_ICONS = { meals: '🍽️', waste: '🗑️', surplus: '📦', cost: '💰' };
  const PRED_COLORS = { meals: '#16a34a', waste: '#ef4444', surplus: '#f59e0b', cost: '#3b82f6' };

  const tabs = [
    { key: 'today',        label: "Today's Plan",       icon: <Sparkles size={13} /> },
    { key: 'overview',     label: 'Overview',            icon: <Activity size={13} /> },
    { key: 'training',     label: 'Training Records',    icon: <Database size={13} /> },
    { key: 'predictions',  label: 'Prediction History',  icon: <Target size={13} /> },
    { key: 'performance',  label: 'Model Performance',   icon: <BarChart2 size={13} /> },
  ];

  const todayPlan = workflow.plan;

  return (
    <div className="mt-5 space-y-5">
      {/* Training overlay */}
      {trainingProgress && (
        <TrainingProgress progress={trainingProgress} onClose={closeProgress} />
      )}

      {/* ── Daily workflow status bar ── */}
      <DailyWorkflowBar currentStep={workflow.step} />

      {/* ── API Status bar ─────────────────────────────────────────────────── */}
      <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${apiStatus === 'online' ? 'bg-green-50 border border-green-200' : apiStatus === 'checking' ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex items-center gap-3">
          <Server size={15} className={apiStatus === 'online' ? 'text-green-600' : 'text-amber-500'} />
          <div>
            <span className={`text-sm font-semibold ${apiStatus === 'online' ? 'text-green-800' : 'text-amber-700'}`}>
              ML API {apiStatus === 'checking' ? 'Checking…' : apiStatus === 'online' ? '· Online' : '· Offline'}
            </span>
            <span className="text-xs text-gray-500 ml-2 font-mono">{ML_ENDPOINT}</span>
          </div>
          {apiStatus === 'online' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">Model: <strong className="text-gray-700">{latestRun?.modelVersion || 'v1.0'}</strong></span>
          <span className="text-xs text-gray-500">Last trained: <strong>{latestRun ? fmtDate(latestRun.runDate) : 'Never'}</strong></span>
          <button onClick={pingAPI} className="flex items-center gap-1.5 text-xs border border-gray-200 bg-white rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
            <Wifi size={11} /> Ping
          </button>
        </div>
      </div>

      {/* ── Action buttons ──────────────────────────────────────────────────── */}
      <div className="flex gap-3">
        <button
          onClick={handleTrain}
          disabled={training || trainingProgress !== null}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all"
          style={{ backgroundColor: '#16a34a' }}
        >
          {training ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
          {training ? 'Training…' : 'Train Model with Today\'s Data'}
        </button>
        <button
          onClick={handlePredict}
          disabled={predicting || !latestRun}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all"
          style={{ backgroundColor: '#3b82f6' }}
        >
          {predicting ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {predicting ? 'Predicting…' : 'Get Tomorrow\'s Predictions'}
        </button>
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
          
          <span>Simulates real REST calls to a deployed FastAPI + scikit-learn service</span>
        </div>
      </div>

      {/* ── Latest prediction cards (if just predicted) ─────────────────────── */}
      {latestPrediction && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            {/* <Sparkles size={16} className="text-black-500" /> */}
            <h3 className="text-sm font-semibold text-gray-900">
              Tomorrow's Predictions — {format(addDays(new Date(), 1), 'dd MMM yyyy')}
            </h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-auto">{latestPrediction.modelVersion}</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {latestPrediction.predictions.map((p) => (
              <PredictionCard key={p.type} pred={p}  color={PRED_COLORS[p.type]} />
            ))}
          </div>
        </div>
      )}

      {/* ── Metric overview cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard icon="🎯" label="Model Accuracy"  value={latestRun ? `${latestRun.accuracy}` : '—'} unit="%" color="#16a34a" trend={accTrend} sub={`MAE: ${latestRun?.mae || '—'}`} />
        <MetricCard icon="📉" label="Training Loss"   value={latestRun ? latestRun.loss : '—'} color="#f59e0b" trend={latestRun && prevRun ? prevRun.loss - latestRun.loss : undefined} sub="Lower is better" />
        <MetricCard icon="📊" label="R² Score"         value={latestRun ? latestRun.r2 : '—'} color="#3b82f6" sub="Explained variance" />
        <MetricCard icon="🔄" label="Training Runs"   value={runs.length} color="#8b5cf6" sub={`Latest: ${latestRun ? fmtDate(latestRun.runDate) : 'None'}`} />
      </div>

      {/* ── Tab bar ─────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 pt-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors -mb-px ${activeTab === t.key ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ══════════ TAB: TODAY'S PLAN ════════════════════════════════════════════ */}
      {activeTab === 'today' && (
        <div className="space-y-4">
          {/* Generate plan section */}
          {!todayPlan && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#1a3a2a' }}>
                <Brain size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Generate Today&apos;s Preparation Plan</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                The ML model analyses your last 30 days of consumption data, day-of-week patterns,
                and seasonal factors to tell your kitchen exactly how much of each item to prepare
                — minimising waste while ensuring enough food is ready.
              </p>
              {planGenerating && planProgress && (
                <div className="max-w-md mx-auto mb-6">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>{planProgress.msg}</span>
                    <span className="font-bold">{planProgress.pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${planProgress.pct}%`, backgroundColor: '#16a34a' }} />
                  </div>
                  <div className="bg-gray-900 rounded-xl p-3 font-mono text-xs text-left space-y-0.5 max-h-28 overflow-y-auto">
                    {planLogs.map((log, i) => (
                      <div key={i} className={i === planLogs.length - 1 ? 'text-green-400' : 'text-gray-400'}>
                        <span className="text-gray-600">{'>'} </span>{log}
                      </div>
                    ))}
                    {planGenerating && <span className="text-green-400 animate-pulse">█</span>}
                  </div>
                </div>
              )}
              <button onClick={handleGeneratePlan} disabled={planGenerating}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white mx-auto disabled:opacity-60"
                style={{ backgroundColor: '#16a34a' }}>
                {planGenerating ? <RefreshCw size={15} className="animate-spin" /> : <Sparkles size={15} />}
                {planGenerating ? 'Generating plan…' : 'Generate Today\'s Preparation Plan'}
              </button>
            </div>
          )}

          {/* Plan ready */}
          {todayPlan && (
            <>
              <div className="bg-gradient-to-r from-green-700 to-teal-600 rounded-xl p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles size={14} className="text-green-300" />
                      <span className="text-green-200 text-xs font-medium">ML Preparation Plan · {todayPlan.modelVersion} · {todayPlan.confidence}% confident</span>
                    </div>
                    <h2 className="text-lg font-bold mb-1">Today&apos;s Kitchen Plan</h2>
                    <p className="text-green-100 text-sm">Based on historical demand, day-of-week patterns, and wastage minimisation</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-200 text-xs">For {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                    <p className="text-white font-bold text-2xl mt-0.5">{todayPlan.expectedMeals} meals</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/15 rounded-xl px-4 py-3">
                    <p className="text-green-200 text-xs mb-1"> Expected Meals</p>
                    <p className="text-white font-black text-xl">{todayPlan.expectedMeals}</p>
                  </div>
                  <div className="bg-white/15 rounded-xl px-4 py-3">
                    <p className="text-green-200 text-xs mb-1"> Target Surplus</p>
                    <p className="text-white font-black text-xl">&lt;{todayPlan.expectedSurplusKg} kg</p>
                  </div>
                  <div className="bg-white/15 rounded-xl px-4 py-3">
                    <p className="text-green-200 text-xs mb-1"> Target Waste</p>
                    <p className="text-white font-black text-xl">&lt;{todayPlan.expectedWasteKg} kg</p>
                  </div>
                </div>
              </div>

              {/* Item recommendations */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Cpu size={15} className="text-green-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Per-Item Recommendations</h3>
                  </div>
                  <span className="text-xs text-gray-400">Endpoint: {todayPlan.endpoint}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {todayPlan.items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.category}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-6">
                        <div>
                          <p className="text-xl font-black text-green-700">{item.qty} <span className="text-sm font-medium text-gray-400">{item.unit}</span></p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.rationale}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Push to kitchen */}
                <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-4">
                  {!planPushed ? (
                    <button onClick={handlePushToKitchen}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{ backgroundColor: '#16a34a' }}>
                      <Send size={14} /> Send Plan to Kitchen (Surplus Detection)
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex-1">
                      <PackageCheck size={18} className="text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">Plan sent to Surplus Detection!</p>
                        <p className="text-xs text-green-600 mt-0.5">
                          Navigate to <strong>Surplus Detection</strong> to load these quantities into the morning session.
                        </p>
                      </div>
                    </div>
                  )}
                  <button onClick={handleGeneratePlan} disabled={planGenerating}
                    className="flex items-center gap-1.5 text-xs border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600">
                    <RefreshCw size={11} /> Regenerate
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════ TAB: OVERVIEW ═══════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-5">
          {/* Predicted vs Actual chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-green-600" />
              <h3 className="text-sm font-semibold text-gray-900">Predicted vs Actual Meals (14d)</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={predChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Predicted" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="5 3" />
                <Line type="monotone" dataKey="Actual"    stroke="#16a34a" strokeWidth={2} dot={{ r: 3, fill: '#16a34a' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Accuracy trend */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={15} className="text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-900">Model Accuracy Over Training Runs</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendChartData}>
                <defs>
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="accuracy" stroke="#16a34a" strokeWidth={2.5} fill="url(#accGrad)" dot={false} name="Accuracy %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Architecture info */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Cpu size={15} className="text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">Model Architecture & Deployment</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Algorithm',     value: 'Gradient Boosted Trees (XGBoost)',   icon: '🌲' },
                { label: 'Deployment',    value: 'FastAPI + Docker · AWS EC2',         icon: '☁️' },
                { label: 'Features',      value: 'Day, meal type, season, history-7d', icon: '📐' },
                { label: 'Retraining',    value: 'Daily automatic (midnight IST)',      icon: '🔄' },
                { label: 'Input Format',  value: 'JSON payload (REST)',                 icon: '📡' },
                { label: 'Latency',       value: '~1.2s average inference time',       icon: '⚡' },
                { label: 'Model Store',   value: 'S3 bucket · versioned',              icon: '🗄️' },
                { label: 'Monitoring',    value: 'MLflow + Grafana dashboard',         icon: '📈' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1"> 
                    {item.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ TAB: TRAINING RECORDS ═══════════════════════════════════════ */}
      {activeTab === 'training' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Date', 'Version', 'Data Points', 'Items Trained', 'Accuracy', 'MAE', 'R²', 'Loss', 'Duration', 'Status'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {runs.map((run) => (
                  <tr key={run.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-800">{fmtDate(run.runDate)}</p>
                      <p className="text-xs text-gray-400">{format(new Date(run.runDate), 'hh:mm a')}</p>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{run.modelVersion}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-700">{run.dataPoints}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(run.itemsTrained || []).slice(0, 2).map((item) => (
                          <span key={item} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{item}</span>
                        ))}
                        {(run.itemsTrained || []).length > 2 && (
                          <span className="text-xs text-gray-400">+{run.itemsTrained.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${run.accuracy >= 90 ? 'text-green-600' : run.accuracy >= 80 ? 'text-amber-500' : 'text-red-500'}`}>
                        {run.accuracy}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{run.mae}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{run.r2}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{run.loss}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{run.trainingTimeSec}s</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit">
                        <CheckCircle2 size={11} /> Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center gap-6 text-xs text-gray-500 rounded-b-xl">
            <span>Total runs: <strong className="text-gray-900">{runs.length}</strong></span>
            <span>Best accuracy: <strong className="text-green-700">{runs.length ? Math.max(...runs.map((r) => r.accuracy)).toFixed(2) : 0}%</strong></span>
            <span>Best MAE: <strong className="text-gray-900">{runs.length ? Math.min(...runs.map((r) => r.mae)).toFixed(3) : 0}</strong></span>
          </div>
        </div>
      )}

      {/* ══════════ TAB: PREDICTION HISTORY ════════════════════════════════════ */}
      {activeTab === 'predictions' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Date', 'Metric', 'Model Version', 'Predicted', 'Actual', 'Error', 'Confidence', 'Status'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {predictions.map((p) => {
                  const err = p.actual !== null && p.actual !== undefined ? Math.abs(p.predicted - p.actual) : null;
                  const errPct = err !== null ? ((err / p.actual) * 100).toFixed(1) : null;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{fmtDate(p.date)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-gray-800 flex items-center gap-1">
                           {p.label}
                        </span>
                      </td>
                      <td className="px-4 py-3"><span className="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{p.modelVersion}</span></td>
                      <td className="px-4 py-3 text-sm font-bold" style={{ color: PRED_COLORS[p.type] }}>{p.predicted} {p.unit}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{p.actual !== null && p.actual !== undefined ? `${p.actual} ${p.unit}` : <span className="text-gray-300 text-xs">Pending</span>}</td>
                      <td className="px-4 py-3">
                        {errPct !== null
                          ? <span className={`text-xs font-semibold ${errPct < 10 ? 'text-green-600' : errPct < 20 ? 'text-amber-500' : 'text-red-500'}`}>{errPct}%</span>
                          : <span className="text-gray-300 text-xs">—</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full w-16">
                            <div className="h-full rounded-full" style={{ width: `${p.confidence}%`, backgroundColor: PRED_COLORS[p.type] }} />
                          </div>
                          <span className="text-xs text-gray-600">{p.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {p.actual !== null && p.actual !== undefined
                          ? <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Verified</span>
                          : <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium animate-pulse">Awaiting</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════ TAB: MODEL PERFORMANCE ══════════════════════════════════════ */}
      {activeTab === 'performance' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            {/* MAE Trend */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Mean Absolute Error (MAE)</h3>
              <p className="text-xs text-gray-400 mb-4">Lower = better predictions</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="mae" fill="#3b82f6" radius={[3,3,0,0]} name="MAE" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Loss trend */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Training Loss</h3>
              <p className="text-xs text-gray-400 mb-4">Scaled ×100 for visibility</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trendChartData}>
                  <defs>
                    <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="loss" stroke="#f59e0b" fill="url(#lossGrad)" strokeWidth={2} dot={false} name="Loss ×100" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Prediction accuracy by type */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Prediction Accuracy by Metric</h3>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(PRED_COLORS).map(([type, color]) => {
                  const preds = predictions.filter((p) => p.type === type && p.actual !== null && p.actual !== undefined);
                  const avgErr = preds.length
                    ? preds.reduce((s, p) => s + Math.abs(p.predicted - p.actual) / p.actual * 100, 0) / preds.length
                    : null;
                  const hitRate = preds.length
                    ? (preds.filter((p) => Math.abs(p.predicted - p.actual) / p.actual < 0.15).length / preds.length * 100).toFixed(0)
                    : null;
                  return (
                    <div key={type} className="bg-gray-50 rounded-xl p-4">
                      {/* <p className="text-lg mb-2">{PRED_ICONS[type]}</p> */}
                      <p className="text-xs text-gray-500 capitalize mb-1">{type}</p>
                      <p className="text-2xl font-black" style={{ color }}>{hitRate !== null ? `${hitRate}%` : '—'}</p>
                      <p className="text-xs text-gray-400 mt-1">Hit rate (±15%)</p>
                      {avgErr !== null && <p className="text-xs text-gray-500 mt-0.5">Avg error: {avgErr.toFixed(1)}%</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
