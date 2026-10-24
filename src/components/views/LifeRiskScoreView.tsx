import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  Heart,
  Wind,
  Thermometer,
  CloudSun,
  Info,
  Sliders,
  CheckCircle2,
  FileText,
  Calculator,
  HelpCircle
} from 'lucide-react';
import { HealthMetrics, EnvironmentalData } from '../../types';
import { DEMO_LIFE_RISK_SCORE } from '../../data/syntheticData';

interface LifeRiskScoreViewProps {
  vitals: HealthMetrics;
  environment: EnvironmentalData;
  isMobile?: boolean;
}

export const LifeRiskScoreView: React.FC<LifeRiskScoreViewProps> = ({
  vitals,
  environment,
  isMobile = false
}) => {
  const [model] = useState(DEMO_LIFE_RISK_SCORE);

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-7xl mx-auto'}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              Module 09 · Multi-System Risk Index
            </span>
            <span className="text-[10px] text-slate-500">·</span>
            <span className="text-[11px] text-slate-400">Mathematical Explainability</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
            Life Risk Score & Explainability
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Transparent composite preventive index mathematically formulated to synthesize physiological strain and external atmospheric hazards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300">
            Weighted Linear Composite Model
          </div>
        </div>
      </div>

      {/* Hero Life Risk Score Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">
              Current Life Risk Score
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {model.overallScore}
              </span>
              <span className="text-base text-slate-400 font-mono">/ 100</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {model.category}
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Autonomic compensation remains effective. The score is predominantly driven by respiratory exposure to ambient fine particulates (PM2.5: {environment.pm25} µg/m³) rather than acute cardiac destabilization.
            </p>
          </div>

          {/* Mathematical Formula Blueprint Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 max-w-md space-y-2 font-mono text-xs">
            <span className="text-slate-400 text-[11px] uppercase block flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              Documented Linear Formula:
            </span>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 text-[11px] leading-relaxed">
              Score = 0.30·C_stress + 0.30·R_hazard + 0.25·T_strain + 0.15·E_exposure
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Weights derived from occupational environmental epidemiology and clinical heat-stress cohorts.
            </p>
          </div>
        </div>
      </div>

      {/* Transparent Sub-Score Breakdown (4 Columns) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Component Breakdown & Input Parameters
          </h3>
          <span className="text-xs text-slate-400">Sum of Weights = 100%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {model.subScores.map((sub) => {
            const getIcon = () => {
              if (sub.name.includes('Cardiac')) return <Heart className="w-5 h-5 text-rose-400" />;
              if (sub.name.includes('Respiratory')) return <Wind className="w-5 h-5 text-cyan-400" />;
              if (sub.name.includes('Thermal')) return <Thermometer className="w-5 h-5 text-amber-400" />;
              return <CloudSun className="w-5 h-5 text-emerald-400" />;
            };

            return (
              <div
                key={sub.name}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {getIcon()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{sub.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">Weight: {sub.weightPercent}% of Total Score</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xl font-black text-white">{sub.score}</span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        sub.score > 70 ? 'bg-rose-500' : sub.score > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${sub.score}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                  {sub.details}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinical Interpretation & Guidelines */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">
          <Info className="w-4 h-4" />
          Clinical Transparency & Preventive Interpretation
        </div>
        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            <strong>1. Preventive Health Advisory:</strong> The Life Risk Score synthesizes real-time autonomic stability and ambient environmental stressors to calculate targeted behavioral adaptations.
          </p>
          <p>
            <strong>2. Actionable Guidance:</strong> Elevated risk tiers trigger prioritized preventive measures (fluid replenishment, particulate protection, cooled recovery areas) before acute decompensation occurs.
          </p>
          <p>
            <strong>3. Clinician-Auditable Metrics:</strong> Every biomarker coefficient and environmental weight is fully transparent, ensuring patients and attending healthcare providers can review the underlying indicators.
          </p>
        </div>
      </div>
    </div>
  );
};
