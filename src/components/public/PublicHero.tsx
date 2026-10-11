import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Wind,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ChevronDown,
  AlertTriangle,
  Play,
  RotateCw,
  Sun,
  Droplets,
  Layers,
  Lock
} from 'lucide-react';

interface PublicHeroProps {
  onGetStarted: () => void;
  onExploreFeatures: () => void;
}

export const PublicHero: React.FC<PublicHeroProps> = ({
  onGetStarted,
  onExploreFeatures,
}) => {
  const [activeSimulationMode, setActiveSimulationMode] = useState<'normal' | 'wildfire_inversion' | 'athletic_exercise'>('normal');

  const simulationPresets = {
    normal: {
      label: 'Optimal Baseline',
      heartRate: 64,
      spO2: 98.4,
      hrv: 62,
      aqi: 28,
      pm25: 6.2,
      uvIndex: 3.5,
      temp: '21.5°C',
      status: 'Equilibrium Baseline',
      statusColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      aiSummary: 'Cardiopulmonary stability within target physiological bounds. Ambient air quality optimal for outdoor endurance.',
    },
    wildfire_inversion: {
      label: 'Wildfire Smoke Spike',
      heartRate: 78,
      spO2: 95.8,
      hrv: 44,
      aqi: 142,
      pm25: 54.8,
      uvIndex: 4.8,
      temp: '26.8°C',
      status: 'Environmental Strain Detected',
      statusColor: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      aiSummary: 'Atmospheric PM2.5 elevated above respiratory threshold. Early airway irritation pattern predicted. Pre-medication advised if outdoor exertion planned.',
    },
    athletic_exercise: {
      label: 'Aerobic Exercise Session',
      heartRate: 138,
      spO2: 97.2,
      hrv: 32,
      aqi: 34,
      pm25: 8.1,
      uvIndex: 6.2,
      temp: '23.0°C',
      status: 'Active Aerobic Zone 3',
      statusColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      aiSummary: 'Sustained cardiovascular stimulus with robust arterial oxygenation. Hydration pacing adjusted for solar UV exposure.',
    },
  };

  const currentPreset = simulationPresets[activeSimulationMode];

  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Background ambient gradient blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-cyan-500/5 blur-[140px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Clinical Boundary Kicker */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Multi-Modal Health Intelligence</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">HIPAA § 164.508 Sovereign Consent</span>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Your Health. Your Data.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Your Personalized Health Intelligence.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed font-normal">
            LifeSphere AI brings together your authorized health, lifestyle, wearable and environmental information into a continuously updated personal health profile.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={onExploreFeatures}
              className="px-7 py-4 bg-slate-900 hover:bg-slate-850 text-slate-200 font-bold text-sm rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>Explore Features</span>
              <ChevronDown className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          {/* Clinical Non-Replacement Boundary Notice */}
          <p className="text-[11px] text-slate-400 max-w-xl mx-auto flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Clinical decision-support & continuous tracking. LifeSphere AI does not replace doctors, prevent all diseases, or guarantee outcomes.
            </span>
          </p>
        </div>

        {/* Live Multi-Sensor Telemetry Simulation Card */}
        <div className="max-w-5xl mx-auto pt-6">
          <div className={`bg-slate-900/90 border ${currentPreset.borderColor} rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 relative overflow-hidden`}>
            
            {/* Card Header & Interactive Scenario Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-400 font-bold">LIVE TELEMETRY SYNTHESIS</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">Stream Rate: 1 Hz</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Continuous Cardiopulmonary & Micro-Climate Feed
                </h3>
              </div>

              {/* Scenario Selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs">
                <span className="text-[10px] text-slate-500 uppercase font-mono px-2 hidden sm:inline">Scenario:</span>
                {(['normal', 'wildfire_inversion', 'athletic_exercise'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveSimulationMode(key)}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                      activeSimulationMode === key
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {simulationPresets[key].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 py-6 font-mono text-left">
              
              {/* Metric 1: Heart Rate */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Heart Rate</span>
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {currentPreset.heartRate} <span className="text-xs font-normal text-slate-400">BPM</span>
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1">Wearable BLE</span>
              </div>

              {/* Metric 2: Arterial Oxygen SpO2 */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Arterial SpO2</span>
                <span className="text-xl sm:text-2xl font-bold text-cyan-400">
                  {currentPreset.spO2}%
                </span>
                <span className="text-[10px] text-cyan-300 block mt-1">Pulse Oximetry</span>
              </div>

              {/* Metric 3: HRV (SDNN) */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">HRV (SDNN)</span>
                <span className="text-xl sm:text-2xl font-bold text-indigo-400">
                  {currentPreset.hrv} <span className="text-xs font-normal text-slate-400">ms</span>
                </span>
                <span className="text-[10px] text-indigo-300 block mt-1">Autonomic Index</span>
              </div>

              {/* Metric 4: Ambient PM2.5 */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">PM2.5 Airborne</span>
                <span className="text-xl sm:text-2xl font-bold text-amber-400">
                  {currentPreset.pm25} <span className="text-xs font-normal text-slate-400">µg</span>
                </span>
                <span className="text-[10px] text-amber-300 block mt-1">EPA Micro-Sensor</span>
              </div>

              {/* Metric 5: Air Quality Index */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Ambient AQI</span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                  {currentPreset.aqi} <span className="text-xs font-normal text-slate-400">AQI</span>
                </span>
                <span className="text-[10px] text-emerald-300 block mt-1">Hyperlocal Mesh</span>
              </div>

              {/* Metric 6: Solar UV & Ambient Temp */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">UV & Thermal</span>
                <span className="text-xl sm:text-2xl font-bold text-orange-400">
                  {currentPreset.uvIndex} <span className="text-xs font-normal text-slate-400">UV</span>
                </span>
                <span className="text-[10px] text-orange-300 block mt-1">{currentPreset.temp}</span>
              </div>
            </div>

            {/* AI Multi-Modal Synthesis Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                      Gemini 2.0 Correlator Insight
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${currentPreset.statusColor}`}>
                      [{currentPreset.status}]
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {currentPreset.aiSummary}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>AES-256 Encrypted Stream</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
