import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Wind,
  Heart,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Info,
  Calendar,
  Layers
} from 'lucide-react';

export const PublicHealthTrends: React.FC = () => {
  const [selectedCorrelation, setSelectedCorrelation] = useState<'spo2_pm25' | 'hrv_ozone' | 'hr_heat'>('spo2_pm25');

  const correlationData = {
    spo2_pm25: {
      title: 'Arterial Oxygen (SpO2) vs. Ambient PM2.5 Particulate Concentration',
      subtitle: 'Longitudinal 7-Day Inversion Analysis',
      findings: 'During the Sept 22 wildfire inversion (PM2.5 peaked at 54.8 µg/m³), nocturnal SpO2 exhibited a mild 1.8% variance before stabilizing post-HEPA purification.',
      confidence: 94,
      trendPoints: [
        { day: 'Mon', vital: 98.6, env: 8.2, label: 'Optimal' },
        { day: 'Tue', vital: 98.4, env: 12.4, label: 'Good' },
        { day: 'Wed', vital: 97.2, env: 38.6, label: 'Smoke Inversion' },
        { day: 'Thu', vital: 96.8, env: 54.8, label: 'Peak PM2.5' },
        { day: 'Fri', vital: 97.8, env: 22.1, label: 'Clearing' },
        { day: 'Sat', vital: 98.4, env: 9.4, label: 'Restored' },
        { day: 'Sun', vital: 98.5, env: 7.6, label: 'Optimal' },
      ],
      vitalName: 'SpO2 (%)',
      envName: 'PM2.5 (µg/m³)',
    },
    hrv_ozone: {
      title: 'Autonomic HRV (SDNN) vs. Ground-Level Tropospheric Ozone',
      subtitle: 'Circadian Stress & Oxidative Load',
      findings: 'Ozone elevation (> 45 ppb) during mid-afternoon solar peaks correlates with a transient 14ms reduction in heart rate variability, signaling autonomic load.',
      confidence: 89,
      trendPoints: [
        { day: 'Mon', vital: 64, env: 22, label: 'Balanced' },
        { day: 'Tue', vital: 66, env: 26, label: 'Balanced' },
        { day: 'Wed', vital: 58, env: 42, label: 'Moderate O3' },
        { day: 'Thu', vital: 48, env: 52, label: 'High O3 Peak' },
        { day: 'Fri', vital: 56, env: 34, label: 'Recovery' },
        { day: 'Sat', vital: 62, env: 28, label: 'Normal' },
        { day: 'Sun', vital: 65, env: 24, label: 'Optimal' },
      ],
      vitalName: 'HRV (ms)',
      envName: 'Ozone (ppb)',
    },
    hr_heat: {
      title: 'Resting Heart Rate vs. Thermal Heat Index & Humidity',
      subtitle: 'Cardiovascular Workload & Dehydration Strain',
      findings: 'Ambient temperatures exceeding 29°C elevated nocturnal resting heart rate by 4.2 BPM, successfully mitigated by pre-hydration protocols.',
      confidence: 92,
      trendPoints: [
        { day: 'Mon', vital: 58, env: 20, label: 'Mild' },
        { day: 'Tue', vital: 59, env: 22, label: 'Mild' },
        { day: 'Wed', vital: 64, env: 28, label: 'Heat Inversion' },
        { day: 'Thu', vital: 66, env: 32, label: 'Peak Temp' },
        { day: 'Fri', vital: 62, env: 27, label: 'Cooling' },
        { day: 'Sat', vital: 59, env: 21, label: 'Normal' },
        { day: 'Sun', vital: 58, env: 19, label: 'Comfort' },
      ],
      vitalName: 'Resting HR (BPM)',
      envName: 'Temp (°C)',
    },
  };

  const activeData = correlationData[selectedCorrelation];

  return (
    <section id="health-trends" className="py-20 lg:py-28 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Multi-Modal Predictive Correlation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            AI-Assisted Health Trends
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            By observing how your body responds to shifting environmental triggers over days, weeks, and seasons, LifeSphere AI reveals hidden patterns that isolated trackers miss.
          </p>

          {/* Correlation Mode Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'spo2_pm25', label: 'SpO2 vs. Wildfire PM2.5' },
              { id: 'hrv_ozone', label: 'HRV vs. Ground Ozone' },
              { id: 'hr_heat', label: 'Resting HR vs. Heat Index' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSelectedCorrelation(btn.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCorrelation === btn.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Trend Chart Card */}
        <div className="max-w-5xl mx-auto bg-slate-900/80 border-2 border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                {activeData.subtitle}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {activeData.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                Model Confidence: {activeData.confidence}%
              </span>
            </div>
          </div>

          {/* Interactive SVG / Bar Chart Representation */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Time-Series: 7-Day Window</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> {activeData.vitalName}
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> {activeData.envName}
                </span>
              </div>
            </div>

            {/* Custom Responsive SVG Chart Simulation */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4 pb-2 items-end h-56 bg-slate-950/80 rounded-2xl border border-slate-850 p-4">
              {activeData.trendPoints.map((pt, i) => (
                <div key={i} className="flex flex-col items-center justify-end h-full gap-2">
                  <div className="text-[10px] font-mono text-slate-400 hidden sm:block">
                    {pt.vital}
                  </div>
                  
                  {/* Two comparative bars */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-36">
                    <div
                      style={{ height: `${Math.min(100, (pt.vital / 110) * 100)}%` }}
                      className="w-2.5 sm:w-4 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md transition-all duration-500"
                      title={`${activeData.vitalName}: ${pt.vital}`}
                    />
                    <div
                      style={{ height: `${Math.min(100, (pt.env / 60) * 100)}%` }}
                      className="w-2.5 sm:w-4 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-md transition-all duration-500"
                      title={`${activeData.envName}: ${pt.env}`}
                    />
                  </div>

                  <span className="text-[11px] font-mono text-slate-300 font-bold">{pt.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Synthesis Callout Box */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">Synthesized Pattern Finding</span>
              <span className="text-[10px] font-mono text-slate-500">(Gemini 2.0 Correlator)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeData.findings}
            </p>
          </div>

          {/* Crucial Ethical Disclaimer Banner */}
          <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-[11px] text-amber-200/90 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Transparent AI Clinical Uncertainty Notice:</strong> AI-assisted trend correlation identifies potential statistical relationships for educational and physician review. This does not constitute a formal diagnosis, guarantee prognosis, or replace clinical examination by licensed doctors.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
