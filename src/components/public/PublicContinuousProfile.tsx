import React, { useState } from 'react';
import {
  User,
  Heart,
  Activity,
  Wind,
  Droplets,
  Calendar,
  FileText,
  Pill,
  ShieldCheck,
  Sparkles,
  Lock,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const PublicContinuousProfile: React.FC = () => {
  const [lastRefreshed, setLastRefreshed] = useState('Just now (1s ago)');
  const [profileTab, setProfileTab] = useState<'vitals' | 'clinical' | 'medications' | 'safety'>('vitals');

  return (
    <section id="continuous-profile" className="py-20 lg:py-28 bg-slate-900/40 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Living Health Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            The Continuous Health Profile
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Traditional health records are static snapshots taken once a year at an annual clinic visit. LifeSphere AI creates a living, continuously updating personal health profile that harmonizes daily biometric telemetry with longitudinal medical records.
          </p>
        </div>

        {/* Interactive Profile Interface Mockup */}
        <div className="max-w-5xl mx-auto bg-slate-950 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Top Profile Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
                AM
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Sovereign Patient Chart
                  </span>
                  <span className="text-xs text-slate-400 font-mono">MRN: #LS-8842</span>
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Alex Mercer</span>
                  <span className="text-xs font-normal text-slate-400">(Age: 38 • Male)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Primary Condition: <strong className="text-emerald-400">Moderate Persistent Allergic Asthma</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto font-mono text-xs">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                <span className="text-slate-500 block text-[10px]">Continuous Sync</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> {lastRefreshed}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 text-xs font-semibold">
            {[
              { id: 'vitals', label: '1. Dynamic Physiological Baselines' },
              { id: 'clinical', label: '2. Clinical Vault & PFT Reports' },
              { id: 'medications', label: '3. Active Prescriptions & UV Sync' },
              { id: 'safety', label: '4. ICE Passport & Emergency Directives' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setProfileTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  profileTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Vitals */}
          {profileTab === 'vitals' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in duration-200">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Resting HR (7-Day Mean)</span>
                <span className="text-2xl font-bold text-white font-mono block">58 <span className="text-xs text-slate-500">BPM</span></span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Baseline Normal
                </span>
              </div>
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Nocturnal SpO2 (Mean)</span>
                <span className="text-2xl font-bold text-cyan-400 font-mono block">98.2%</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Zero Hypoxemia Events
                </span>
              </div>
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono">HRV Autonomic (SDNN)</span>
                <span className="text-2xl font-bold text-indigo-400 font-mono block">62 <span className="text-xs text-slate-500">ms</span></span>
                <span className="text-[11px] text-indigo-300">Robust Vagal Tone</span>
              </div>
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Blood Pressure Baseline</span>
                <span className="text-2xl font-bold text-white font-mono block">118/76</span>
                <span className="text-[11px] text-emerald-400">Normotensive Range</span>
              </div>
            </div>
          )}

          {/* Tab 2: Clinical */}
          {profileTab === 'clinical' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200 text-xs">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Latest Spirometry Report (PFT)</span>
                  <span className="font-mono text-cyan-400">Sept 15, 2026</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Post-bronchodilator assessment: FEV1 at 92% of predicted value, FVC at 95%, Ratio 0.79. Demonstrates excellent pharmacological control without air-trapping.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Clinician Verified by Dr. Sarah Vance, MD</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Allergy & Trigger Profile</span>
                  <span className="font-mono text-amber-400">3 Verified Triggers</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Birch Pollen (Class 4)</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Grass Pollen (Class 3)</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">PM2.5 Airborne Smoke</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Atmospheric sync automatically triggers pre-medication advisories when regional pollen &gt; 35 grains/m³.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Medications */}
          {profileTab === 'medications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200 text-xs">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Budesonide / Formoterol (Symbicort)</span>
                  <span className="font-mono text-emerald-400">160/4.5 mcg</span>
                </div>
                <p className="text-slate-400">
                  2 inhalations twice daily (08:00 & 20:00). Anti-inflammatory controller therapy with rapid-onset long-acting bronchodilator.
                </p>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-850 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Adherence: 98% (Last 30 Days)</span>
                  <span className="text-emerald-400 font-bold">Optimal Compliance</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Albuterol Sulfate (Ventolin HFA)</span>
                  <span className="font-mono text-amber-400">90 mcg PRN</span>
                </div>
                <p className="text-slate-400">
                  Rescue inhaler: 2 puffs 15 minutes prior to outdoor athletic training when AQI &gt; 50 or PM2.5 &gt; 15 µg/m³.
                </p>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-850 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Rescue Usage: 1 puff / week</span>
                  <span className="text-emerald-400 font-bold">Within GINA Bounds</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Safety */}
          {profileTab === 'safety' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200 text-xs">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-white block">In Case of Emergency (ICE) Contacts</span>
                <div className="space-y-1.5 text-slate-300 font-mono text-[11px]">
                  <p>Primary: Sarah Vance (Spouse) • +1 (555) 019-2834</p>
                  <p>Physician: Dr. Sarah Vance, MD (Pulmonology) • +1 (555) 018-9900</p>
                  <p>Blood Type: O+ • Known Allergies: Birch Pollen, NSAIDs</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Emergency Protocol Thresholds</span>
                <p className="text-slate-400 leading-relaxed">
                  Configured rules flag Hypoxemic Spikes (SpO2 &lt; 92% sustained for &gt; 3 mins) or Severe Bradycardia (&lt; 40 BPM accompanied by acute decline). Triggers evidence presentation for user confirmation.
                </p>
              </div>
            </div>
          )}

          {/* Bottom Security Assurance */}
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Patient Sovereign Data: Encrypted at rest (AES-256) and TLS 1.3 in transit.</span>
            </span>
            <span className="font-mono text-emerald-400 font-semibold">Zero Advertising Profiling</span>
          </div>

        </div>

      </div>
    </section>
  );
};
