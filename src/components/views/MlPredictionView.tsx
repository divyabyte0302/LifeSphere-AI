import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Cpu,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  HelpCircle,
  Play
} from 'lucide-react';
import { HealthMetrics, EnvironmentalData, HorizonRiskPrediction } from '../../types';
import { DEMO_ML_PREDICTION } from '../../data/syntheticData';

interface MlPredictionViewProps {
  vitals: HealthMetrics;
  environment: EnvironmentalData;
  isMobile?: boolean;
}

export const MlPredictionView: React.FC<MlPredictionViewProps> = ({
  vitals,
  environment,
  isMobile = false
}) => {
  const [activeHorizon, setActiveHorizon] = useState<1 | 6 | 12 | 24>(1);
  const [modelData] = useState(DEMO_ML_PREDICTION);

  const currentForecast = modelData.horizonPredictions.find((h) => h.horizonHours === activeHorizon) || modelData.horizonPredictions[0];

  const getRiskColor = (cat: HorizonRiskPrediction['riskCategory']) => {
    switch (cat) {
      case 'Severe':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'High':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Moderate':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-7xl mx-auto'}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
              Module 08 · Predictive Machine Learning Service
            </span>
            <span className="text-[10px] text-slate-500">·</span>
            <span className="text-[11px] text-slate-400">{modelData.evaluation.algorithm}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
            Machine-Learning Risk Prediction
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Supervised multi-horizon risk classifier trained on physiological and ambient co-exposure cohorts to predict Heat Stress, Dehydration, and Respiratory Spikes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-2 bg-purple-950/40 border border-purple-500/30 rounded-xl text-xs font-mono text-purple-300 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>XGBoost v2.0 Multi-Output</span>
          </div>
        </div>
      </div>

      {/* Mandatory Academic Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white">Demonstration Academic Mode Notice:</span>
          <p className="text-slate-400 leading-relaxed">
            {modelData.evaluation.academicDisclaimer} All predictions, confidence scores, and SHAP feature importance vectors are simulated demonstration outputs evaluated on synthetic research benchmarks.
          </p>
        </div>
      </div>

      {/* Horizon Selector Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Prediction Forecast Horizon:
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          {([1, 6, 12, 24] as const).map((hours) => (
            <button
              key={hours}
              onClick={() => setActiveHorizon(hours)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeHorizon === hours
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {hours} Hour{hours > 1 ? 's' : ''} Ahead
            </button>
          ))}
        </div>
      </div>

      {/* Horizon Prediction Hero Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase">
              Horizon T + {activeHorizon} Hour{activeHorizon > 1 ? 's' : ''} Comprehensive Risk
            </span>
            <div className="flex items-center gap-3">
              <span className="text-2xl md:text-3xl font-black text-white">
                Score: {currentForecast.riskScore} <span className="text-sm text-slate-400">/ 100</span>
              </span>
              <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full border uppercase ${getRiskColor(currentForecast.riskCategory)}`}>
                {currentForecast.riskCategory} Risk
              </span>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="text-slate-400 block">Calibrated Confidence</span>
            <span className="text-base font-bold text-cyan-400">
              {(currentForecast.confidenceScore * 100).toFixed(1)}% (Platt Scaled)
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 space-y-1.5">
          <span className="text-[11px] text-slate-400 font-mono uppercase block">
            Primary Risk Factors Triggering Prediction:
          </span>
          <div className="flex flex-wrap gap-2">
            {currentForecast.primaryContributingFactors.map((factor, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono"
              >
                ● {factor}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Domain Risk Categories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Heat-Stress Risk Model</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Score: {modelData.heatStressRisk.riskScore}/100
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluates WBGT index vs heart rate reserve to predict acute heat exhaustion.
          </p>
          <div className="text-[11px] text-slate-400 font-mono space-y-1 pt-2 border-t border-slate-800">
            <div>Confidence: {(modelData.heatStressRisk.confidenceScore * 100).toFixed(0)}%</div>
            <div className="text-emerald-400">Status: {modelData.heatStressRisk.riskCategory} Risk</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Dehydration Predictor</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Score: {modelData.dehydrationRisk.riskScore}/100
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Estimates fluid deficit from step cadence, skin conductance, and ambient vapor pressure deficit.
          </p>
          <div className="text-[11px] text-slate-400 font-mono space-y-1 pt-2 border-t border-slate-800">
            <div>Confidence: {(modelData.dehydrationRisk.confidenceScore * 100).toFixed(0)}%</div>
            <div className="text-amber-400">Status: {modelData.dehydrationRisk.riskCategory} Risk</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Respiratory Air Hazard</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
              Score: {modelData.respiratoryEnvironmentalRisk.riskScore}/100
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Correlates PM2.5 and pollen grain density with resting SpO2 trajectory and medical history.
          </p>
          <div className="text-[11px] text-slate-400 font-mono space-y-1 pt-2 border-t border-slate-800">
            <div>Confidence: {(modelData.respiratoryEnvironmentalRisk.confidenceScore * 100).toFixed(0)}%</div>
            <div className="text-orange-400">Status: {modelData.respiratoryEnvironmentalRisk.riskCategory} Risk</div>
          </div>
        </div>
      </div>

      {/* SHAP Feature Contribution Matrix */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              SHAP Global Feature Importance & Directional Vectors
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">TreeExplainer Tree SHAP</span>
        </div>

        <div className="space-y-3">
          {modelData.featureImportances.map((feat) => (
            <div key={feat.featureName} className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center font-mono">
                <span className="text-slate-300 font-medium">{feat.featureName}</span>
                <span
                  className={feat.direction === 'increases_risk' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}
                >
                  {feat.shapValue > 0 ? `+${feat.shapValue}` : feat.shapValue} SHAP ({(feat.importanceScore * 100).toFixed(0)}% Weight)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 flex">
                <div
                  className={`h-full rounded-full ${
                    feat.direction === 'increases_risk' ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${feat.importanceScore * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Benchmark & Training Validation Report */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Offline Model Validation & Evaluation Metrics (No Data Leakage)
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Accuracy</span>
            <span className="text-base font-bold text-white font-mono mt-0.5 block">
              {(modelData.evaluation.accuracy * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Precision</span>
            <span className="text-base font-bold text-cyan-400 font-mono mt-0.5 block">
              {(modelData.evaluation.precision * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Recall</span>
            <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
              {(modelData.evaluation.recall * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">F1-Score</span>
            <span className="text-base font-bold text-purple-400 font-mono mt-0.5 block">
              {(modelData.evaluation.f1Score * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">AUC-ROC</span>
            <span className="text-base font-bold text-amber-400 font-mono mt-0.5 block">
              {modelData.evaluation.aucRoc.toFixed(3)}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-mono pt-1">
          {modelData.evaluation.datasetReference}
        </p>
      </div>
    </div>
  );
};
