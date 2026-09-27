// ML Model Data Store

const ML_TRAINING_KEY = 'foodloop_ml_training_runs';
const ML_PREDICTIONS_KEY = 'foodloop_ml_predictions';

export const getTrainingRuns = () => {
  try { return JSON.parse(localStorage.getItem(ML_TRAINING_KEY)) || []; }
  catch { return []; }
};

export const getPredictions = () => {
  try { return JSON.parse(localStorage.getItem(ML_PREDICTIONS_KEY)) || []; }
  catch { return []; }
};

export const saveTrainingRun = (run) => {
  const all = [run, ...getTrainingRuns()];
  localStorage.setItem(ML_TRAINING_KEY, JSON.stringify(all));
};

export const savePrediction = (pred) => {
  const all = [pred, ...getPredictions()];
  localStorage.setItem(ML_PREDICTIONS_KEY, JSON.stringify(all.slice(0, 60)));
};

export const seedMLData = () => {
  // Overwriting for data harmonization
  const now = Date.now();
  const ITEMS = ['Steamed Rice', 'Dal Tadka', 'Wheat Chapati', 'Mixed Veg Curry', 'Vegetable Khichdi'];

  const runs = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(now - (14 - i) * 86400000);
    const baseAcc = 72 + i * 1.5 + (Math.random() - 0.5) * 3;
    const mae = 1.8 - i * 0.08 + (Math.random() - 0.5) * 0.3;
    return {
      id: `run-${i}`,
      runDate: day.toISOString(),
      status: 'completed',
      dataPoints: Math.floor(Math.random() * 40 + 80),
      itemsTrained: ITEMS.slice(0, Math.floor(Math.random() * 3 + 3)),
      accuracy: +Math.min(baseAcc, 97).toFixed(2),
      mae: +Math.max(mae, 0.3).toFixed(3),
      r2: +(0.65 + i * 0.02 + (Math.random() - 0.5) * 0.04).toFixed(3),
      loss: +(0.42 - i * 0.018 + (Math.random() - 0.5) * 0.05).toFixed(4),
      epochs: 50,
      trainingTimeSec: Math.floor(Math.random() * 120 + 30),
      modelVersion: `v1.${i + 1}`,
      endpoint: 'https://ml-api.foodloop.internal/train',
    };
  });

  localStorage.setItem(ML_TRAINING_KEY, JSON.stringify(runs));

  const predictions = Array.from({ length: 21 }, (_, i) => {
    const day = new Date(now - (21 - i) * 86400000);
    const base = 450 + Math.sin(i * 0.8) * 40;
    const predicted = Math.round(base + (Math.random() - 0.5) * 30);
    const actual = Math.round(predicted + (Math.random() - 0.5) * 40);
    return {
      id: `pred-${i}`,
      date: day.toISOString(),
      type: 'meals',
      label: 'Total Meals',
      predicted,
      actual: i < 20 ? actual : null,
      unit: 'meals',
      confidence: +(82 + Math.random() * 12).toFixed(1),
      modelVersion: `v1.${Math.min(i + 1, 14)}`,
    };
  });

  const wastePredictions = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(now - (14 - i) * 86400000);
    const predicted = +(Math.random() * 8 + 3).toFixed(2);
    const actual = i < 13 ? +(predicted + (Math.random() - 0.5) * 2).toFixed(2) : null;
    return {
      id: `wpred-${i}`,
      date: day.toISOString(),
      type: 'waste',
      label: 'Food Waste',
      predicted,
      actual,
      unit: 'kg',
      confidence: +(75 + Math.random() * 15).toFixed(1),
      modelVersion: `v1.${Math.min(i + 1, 14)}`,
    };
  });

  localStorage.setItem(ML_PREDICTIONS_KEY, JSON.stringify([...predictions, ...wastePredictions]));
};

export const mockTrainAPI = async (payload, onProgress) => {
  const steps = [
    { pct: 10, msg: 'Connecting to ML endpoint...' },
    { pct: 25, msg: 'Serializing training payload...' },
    { pct: 40, msg: 'Uploading data to model server...' },
    { pct: 55, msg: 'Preprocessing features...' },
    { pct: 70, msg: 'Running gradient descent (epoch 1-50)...' },
    { pct: 85, msg: 'Validating on holdout set...' },
    { pct: 95, msg: 'Saving model weights...' },
    { pct: 100, msg: 'Training complete!' },
  ];
  for (const step of steps) {
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
    onProgress(step);
  }
  const runs = getTrainingRuns();
  const lastAcc = runs[0]?.accuracy || 80;
  return {
    success: true,
    modelVersion: `v1.${runs.length + 1}`,
    accuracy: +Math.min(lastAcc + Math.random() * 2, 98).toFixed(2),
    mae: +Math.max((runs[0]?.mae || 1.5) - Math.random() * 0.1, 0.2).toFixed(3),
    r2: +Math.min((runs[0]?.r2 || 0.75) + Math.random() * 0.02, 0.99).toFixed(3),
    loss: +Math.max((runs[0]?.loss || 0.25) - Math.random() * 0.015, 0.05).toFixed(4),
    epochs: 50,
    trainingTimeSec: Math.floor(Math.random() * 120 + 40),
    dataPoints: payload.dataPoints,
    itemsTrained: payload.items,
    endpoint: 'https://ml-api.foodloop.internal/train',
    status: 'completed',
  };
};

export const mockPredictAPI = async (targetDate) => {
  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
  const runs = getTrainingRuns();
  const latestVersion = runs[0]?.modelVersion || 'v1.1';
  return {
    success: true,
    targetDate,
    modelVersion: latestVersion,
    predictions: [
      { type: 'meals',   label: 'Total Meals',   predicted: Math.round(430 + Math.random() * 80), unit: 'meals', confidence: +(80 + Math.random() * 15).toFixed(1), lower: 400, upper: 520 },
      { type: 'waste',   label: 'Food Waste',    predicted: +(4 + Math.random() * 5).toFixed(2),   unit: 'kg',   confidence: +(75 + Math.random() * 18).toFixed(1), lower: 2.0, upper: 12.0 },
      { type: 'surplus', label: 'Surplus Food',  predicted: +(3 + Math.random() * 6).toFixed(2),   unit: 'kg',   confidence: +(70 + Math.random() * 20).toFixed(1), lower: 1.0, upper: 10.0 },
      { type: 'cost',    label: 'Est. Food Cost', predicted: Math.round(8000 + Math.random() * 4000), unit: 'INR', confidence: +(78 + Math.random() * 15).toFixed(1), lower: 7000, upper: 15000 },
    ],
  };
};
