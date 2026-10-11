import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Activity,
  Layers,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Database,
  CloudSun,
  HeartPulse
} from 'lucide-react';

export const PublicProblemSolution: React.FC = () => {
  const problems = [
    {
      title: 'Isolated Wearable Data Silos',
      description:
        'Smartwatches and rings collect heart rate and sleep in closed proprietary apps, detached from clinical context or medical records.',
    },
    {
      title: 'Disconnected Environmental Exposure',
      description:
        'Spikes in wildfire PM2.5, ground-level ozone, and allergen blooms trigger cardiopulmonary stress, but weather apps never correlate with your biology.',
    },
    {
      title: 'Reactive Crisis-Based Healthcare',
      description:
        'Patients and doctors only discover physiological decline when symptoms escalate into urgent clinic visits or emergency admissions.',
    },
    {
      title: 'Fragmented Medical History',
      description:
        'Spirometry tests, blood work, and prescriptions live scattered across disparate hospital portals with zero unified longitudinal view.',
    },
  ];

  const solutions = [
    {
      title: 'Continuous Bi-Directional Telemetry',
      description:
        'Real-time ingestion of resting heart rate, pulse oximetry (SpO2), HRV, and blood pressure into a unified clinical-grade stream.',
    },
    {
      title: 'Hyperlocal Atmospheric Synthesis',
      description:
        'Street-level micro-climate intelligence continuously cross-referenced with your specific respiratory and cardiovascular baselines.',
    },
    {
      title: 'Proactive Early Pattern Warnings',
      description:
        'AI-assisted pattern detection identifies anomalies and suggests preventative pacing hours before acute flare-ups manifest.',
    },
    {
      title: 'Sovereign Longitudinal Health Vault',
      description:
        'Patients hold exclusive cryptographic consent over their records, granting permissioned, auditable access directly to their attending doctors.',
    },
  ];

  return (
    <section id="problem-solution" className="py-20 lg:py-28 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* SECTION 2: THE PROBLEM */}
        <div id="problem" className="space-y-12 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider font-bold">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>The Problem in Modern Health Tracking</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Biometrics and the Environment Have Operated in Complete Silos
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every day, billions of biometric data points are captured by wearables, while atmospheric sensors track toxic particulates. Yet until now, no platform unified them to provide contextual intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((p, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-rose-500/20 rounded-3xl p-6 space-y-3 relative overflow-hidden group hover:border-rose-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {p.description}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] text-rose-400 font-medium">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Uncoordinated Care</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: THE SOLUTION */}
        <div id="solution" className="pt-10 border-t border-slate-900 space-y-12 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>The LifeSphere AI Paradigm</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              A Unified Ecosystem for Continuous Personal Health Intelligence
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              LifeSphere AI integrates four core dimensions—wearables, ambient air, clinical records, and physician collaboration—into an adaptive, patient-sovereign intelligence profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((s, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-emerald-500/20 rounded-3xl p-6 space-y-3 relative overflow-hidden group hover:border-emerald-500/40 hover:bg-slate-900 transition-all shadow-xl"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {s.description}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Proactive Clinical Context</span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Bridge Diagram */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto text-center space-y-4">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
              The Four-Stream Synthesis Engine
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <HeartPulse className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                <span className="font-bold text-white block">Physiological</span>
                <span className="text-[10px] text-slate-400">Wearables & BLE</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <CloudSun className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="font-bold text-white block">Atmospheric</span>
                <span className="text-[10px] text-slate-400">AQI, PM2.5, UV</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <Database className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <span className="font-bold text-white block">Clinical Vault</span>
                <span className="text-[10px] text-slate-400">FHIR Records & PFT</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="font-bold text-white block">Doctor Directives</span>
                <span className="text-[10px] text-slate-400">Non-Overwrite Lock</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
