import React, { useState } from 'react';
import {
  Activity,
  CloudSun,
  FolderOpen,
  Pill,
  ClipboardCheck,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Heart,
  Droplets,
  Wind,
  Stethoscope
} from 'lucide-react';

export const PublicFeatures: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const features = [
    {
      id: 'telemetry',
      category: 'clinical',
      title: 'Continuous Physiological Telemetry',
      badge: 'Real-time Ingestion',
      icon: <Activity className="w-6 h-6 text-rose-400" />,
      description:
        'Continuous streaming of resting heart rate, pulse oximetry (SpO2), heart rate variability (HRV SDNN), and blood pressure trends.',
      highlights: [
        'Multi-wearable bridge (Apple Watch, Oura, Garmin)',
        'Sub-second anomaly detection algorithms',
        'Automatic circadian baseline learning',
      ],
      metric: '99.98% Telemetry Ingestion Uptime',
    },
    {
      id: 'environment',
      category: 'atmospheric',
      title: 'Hyperlocal Environmental Sensing',
      badge: 'Micro-Climate Grid',
      icon: <CloudSun className="w-6 h-6 text-amber-400" />,
      description:
        'Street-level atmospheric tracking of particulate matter (PM2.5, PM10), ground-level tropospheric ozone, pollen grain counts, and solar UV radiation.',
      highlights: [
        'Hyperlocal air quality indexing (AQI)',
        'Pollen allergen species breakdown (Tree, Grass, Weed)',
        'Proactive atmospheric inversion alerts',
      ],
      metric: '< 100m Hyperlocal Resolution',
    },
    {
      id: 'records',
      category: 'clinical',
      title: 'Sovereign Longitudinal Health Vault',
      badge: 'HIPAA Vault',
      icon: <FolderOpen className="w-6 h-6 text-cyan-400" />,
      description:
        'A secure, tamper-proof repository for spirometry curves, post-bronchodilator PFT reports, lab panels, and diagnostic PDFs under patient-controlled cryptographic keys.',
      highlights: [
        'HL7 FHIR JSON and PDF diagnostic viewer',
        'Zero administrator access by default (Least Privilege)',
        'Time-stamped audit accounting of every access',
      ],
      metric: 'AES-256 Vault Encryption',
    },
    {
      id: 'medications',
      category: 'safety',
      title: 'Medication Photo-Safety & Interaction Shield',
      badge: 'Safety Shield',
      icon: <Pill className="w-6 h-6 text-indigo-400" />,
      description:
        'Prescription tracker that cross-references active medications with solar UV index to prevent photo-allergic reactions and environmental incompatibilities.',
      highlights: [
        'Photosensitive medication warnings (e.g., Doxycycline, NSAIDs)',
        'Rescue inhaler frequency tracking & step-up triggers',
        'Adherence analysis without intrusive alerts',
      ],
      metric: '100% Prescription Audited',
    },
    {
      id: 'checkup',
      category: 'clinical',
      title: 'Monthly Check-Up Trajectory Comparison',
      badge: 'Standardized Survey',
      icon: <ClipboardCheck className="w-6 h-6 text-purple-400" />,
      description:
        'Guided monthly clinical symptom survey measuring peak flow, nocturnal awakenings, and functional exercise capacity with month-over-month trajectory analysis.',
      highlights: [
        'Asthma Control Test (ACT) compatible scoring',
        'Automated risk score delta (Month-over-Month)',
        'Clinical summary PDF export for clinic visits',
      ],
      metric: 'Month-over-Month Delta Analysis',
    },
    {
      id: 'emergency',
      category: 'safety',
      title: 'Emergency Support & ICE Passport',
      badge: 'Safety Workflow',
      icon: <ShieldAlert className="w-6 h-6 text-rose-500" />,
      description:
        'Evidence-backed emergency workflow that explains uncertainty, requires explicit user confirmation, and never auto-contacts services without authorization.',
      highlights: [
        'Configured rules for Hypoxemic and Bradycardia spikes',
        'Offline SMS fallback for low-connectivity environments',
        'In Case of Emergency (ICE) dynamic clinical passport',
      ],
      metric: 'Zero Unauthorized Auto-Dials',
    },
  ];

  const filteredFeatures =
    selectedCategory === 'all'
      ? features
      : features.filter((f) => f.category === selectedCategory);

  return (
    <section id="features" className="py-20 lg:py-28 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Comprehensive Platform Modules</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Designed for Clinical Depth and Daily Life
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every feature is architected under strict clinical boundary principles: transparent AI uncertainty, patient-sovereign consent, and immutable physician directive supremacy.
          </p>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'All Modules' },
              { id: 'clinical', label: 'Clinical Telemetry' },
              { id: 'atmospheric', label: 'Atmospheric Sensing' },
              { id: 'safety', label: 'Safety & Emergency' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feat) => (
            <div
              key={feat.id}
              className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 hover:border-emerald-500/40 hover:bg-slate-900 transition-all shadow-xl relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-slate-950 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {feat.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {feat.description}
                </p>

                <div className="pt-2 border-t border-slate-850 space-y-2">
                  {feat.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metric Stamp */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-emerald-400 font-bold">{feat.metric}</span>
                <span className="text-slate-500">HIPAA Compliant</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
