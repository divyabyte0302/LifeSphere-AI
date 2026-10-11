import React, { useState } from 'react';
import {
  Layers,
  Activity,
  CloudSun,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Clock,
  Info,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sliders
} from 'lucide-react';
import { HealthMetrics, EnvironmentalData } from '../../types';
import { DEMO_FUSION_METRICS } from '../../data/syntheticData';

interface FusionEngineViewProps {
  vitals: HealthMetrics;
  environment: EnvironmentalData;
  isMobile?: boolean;
}

export const FusionEngineView: React.FC<FusionEngineViewProps> = ({
  vitals,
  environment,
  isMobile = false
}) => {
  const [metrics, setMetrics] = useState(DEMO_FUSION_METRICS);
  const [activeWindow, setActiveWindow] = useState<number>(4);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      setMetrics((prev) => ({
        ...prev,
        calculatedAt: 'Recalculated just now',
        cumulativePm25Inhaled: parseFloat((prev.cumulativePm25Inhaled + 1.2).toFixed(1))
      }));
    }, 900);
  };

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-7xl mx-auto'}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              Module 07 · Cross-Domain Telemetry Fusion
            </span>
            <span className="text-[10px] text-slate-500">·</span>
            <span className="text-[11px] text-slate-400">Pipeline v2.4 (Academic)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
            Health–Environment Fusion Engine
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Fuses continuous biometric measurements with micro-climate variables to quantify co-exposure hazard synergies and time-lagged physiological vulnerability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? 'Synthesizing...' : 'Re-run Fusion Matrix'}</span>
          </button>
        </div>
      </div>

      {/* Fusion Engine Pipeline Flow Diagram */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Documented Ingestion & Fusion Pipeline Architecture
          </span>
          <span className="text-[10px] text-slate-500 font-mono">End-to-End Latency: ~140ms</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400 font-mono text-[11px]">Stage 1: Ingestion</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="text-[11px] text-slate-300">
              BLE GATT 5.3 telemetry (HR, SpO2, Skin Temp) paired with hyperlocal meteorological API stations.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 font-mono text-[11px]">Stage 2: Cross-Correlation</span>
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-300">
              Dynamic time-warping & cross-correlation matrix aligns vital sign fluctuations with micro-pollutant spikes.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 font-mono text-[11px]">Stage 3: Synergy Weighting</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-300">
              Non-linear synergistic hazard multipliers compute compound vulnerability (e.g. Asthma × Ozone × PM2.5).
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-400 font-mono text-[11px]">Stage 4: Prediction Feed</span>
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-[11px] text-slate-300">
              Feeds calibrated feature tensors into Life Risk Score Engine and multi-horizon XGBoost models.
            </p>
          </div>
        </div>
      </div>

      {/* Fusion Exposure Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-mono">Combined Fusion Score</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400">{metrics.combinedFusionScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Moderate Co-Exposure Buffer</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-mono">Cumulative PM2.5 Inhaled</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{metrics.cumulativePm25Inhaled}</span>
            <span className="text-xs text-slate-400">µg (4h window)</span>
          </div>
          <span className="text-[11px] text-amber-400 mt-1 block">Within tolerable daily load</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-mono">Physiological Vulnerability</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-cyan-400">{metrics.physiologicalVulnerabilityScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Asthma history factored</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-mono">Environmental Hazard Index</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-400">{metrics.environmentalHazardScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">AQI 68 + UV 4.8 combined</span>
        </div>
      </div>

      {/* Synergistic Hazard Cross-Multipliers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Detected Health–Environment Multiplicative Synergies
          </h3>
          <span className="text-xs text-slate-400">Multi-Stressor Interaction Matrix</span>
        </div>

        <div className="space-y-3">
          {metrics.synergies.map((syn, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-white">{syn.factorA}</span>
                  <span className="text-xs text-slate-500 font-bold">+</span>
                  <span className="text-xs font-bold text-amber-300">{syn.factorB}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {syn.riskImpactDescription}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block">Synergy Factor</span>
                  <span className="text-lg font-bold text-amber-400">{syn.multiplier}× Multiplier</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time-Lagged Physiological Impact Projections */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white font-mono uppercase tracking-wider">
            <Clock className="w-4 h-4 text-cyan-400" />
            Time-Lagged Exposure Forecasts (Cumulative Latency Impact)
          </div>
          <span className="text-xs text-slate-500">Based on inhaled dosage kinetics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {metrics.laggedImpactForecasts.map((lag) => (
            <div key={lag.lagHours} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-400 font-bold">T + {lag.lagHours} Hours</span>
                <span className="text-[11px] font-mono text-amber-400 font-semibold">{lag.probabilityPercent}% probability</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{lag.predictedSymptom}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
