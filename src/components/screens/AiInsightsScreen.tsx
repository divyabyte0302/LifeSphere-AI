import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Wind,
  CheckCircle2,
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import { HealthMetrics, EnvironmentalData, Recommendation, ScreenModule } from '../../types';

interface AiInsightsProps {
  type: 'ai_insights' | 'recommendations';
  vitals: HealthMetrics;
  environment: EnvironmentalData;
  recommendations: Recommendation[];
  setScreen: (module: ScreenModule) => void;
  showSnackbar: (msg: string) => void;
  isMobile?: boolean;
}

export const AiInsightsScreen: React.FC<AiInsightsProps> = ({
  type,
  vitals,
  environment,
  recommendations,
  setScreen,
  showSnackbar,
  isMobile,
}) => {
  if (type === 'recommendations') {
    return (
      <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-5xl mx-auto'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-white">Preventive Clinical Recommendations</h2>
              <p className="text-xs text-slate-400">Actionable interventions targeting personal atmospheric vulnerabilities</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {rec.category}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  rec.priority === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {rec.priority} Priority
                </span>
              </div>

              <h4 className="text-sm md:text-base font-bold text-white">{rec.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>

              <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
                <span>Trigger: {rec.triggerSource}</span>
                <button
                  onClick={() => showSnackbar(`Action for "${rec.title}" confirmed.`)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Mark Implemented
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // AI Insights
  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-5xl mx-auto'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white">Gemini AI Multi-System Intelligence</h2>
            <p className="text-xs text-slate-400">Cross-correlating respiratory biomarkers with air hazards</p>
          </div>
        </div>

        <button
          onClick={() => setScreen('checkup')}
          className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Launch AI Triage</span>
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Continuous Synthesis Report
        </h3>

        <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
          Patient exhibits mild bronchial hypersensitivity. Today's ambient PM2.5 level of <strong>{environment.pm25} µg/m³</strong> is within moderate thresholds, while resting pulse is <strong>{vitals.restingHeartRate} BPM</strong> and SpO2 is optimal at <strong>{vitals.spO2}%</strong>.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
            <span className="font-bold text-emerald-400 block mb-1">Pulmonary Resilience</span>
            <p className="text-slate-400">Vagal tone is stable with 58ms HRV, indicating minimal bronchial sympathetic strain today.</p>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
            <span className="font-bold text-amber-400 block mb-1">Allergen Cross-Sensitivity</span>
            <p className="text-slate-400">Pollen density of {environment.pollenCount} gr/m³ can exacerbate mucosal drying in 23.5°C weather.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
