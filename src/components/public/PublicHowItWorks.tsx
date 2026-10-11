import React, { useState } from 'react';
import {
  Watch,
  CloudSun,
  Cpu,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const PublicHowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'Connect Devices & Authorize Telemetry',
      subtitle: 'Zero friction, patient-permissioned integration',
      icon: <Watch className="w-6 h-6 text-emerald-400" />,
      description:
        'Securely link your smartwatch (Apple Watch, Garmin, Galaxy Watch), smart ring (Oura), or medical Bluetooth pulse oximeter and spirometer. All data transfer is end-to-end encrypted with user-revocable consent.',
      details: [
        'Automatic background sync of heart rate, HRV, SpO2, and sleep stages',
        'Strict HIPAA and GDPR consent flags enabled at the device layer',
        'No data sold to brokers or advertisers — ever',
      ],
      badge: 'Step 1: Ingestion',
    },
    {
      step: '02',
      title: 'Ingest Hyperlocal Atmospheric Telemetry',
      subtitle: 'Micro-climate data down to your street level',
      icon: <CloudSun className="w-6 h-6 text-amber-400" />,
      description:
        'LifeSphere AI taps into continuous hyperlocal environmental monitoring stations. As you move throughout your day, we track real-time changes in ambient air quality, particulate pollution, and solar intensity.',
      details: [
        'Fine particulate matter PM2.5 & PM10 tracking',
        'Tropospheric ground-level ozone and pollen allergens (tree, grass, weed)',
        'Solar UV index with photo-sensitive medication warnings',
      ],
      badge: 'Step 2: Environmental Sync',
    },
    {
      step: '03',
      title: 'Cross-Stream Multi-Modal AI Correlation',
      subtitle: 'Gemini 2.0 contextual physiological reasoning',
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      description:
        'Our clinical reasoning models do not treat symptoms in isolation. When your resting heart rate elevates or oxygen saturation dips, the engine cross-references recent smoke inversions, temperature spikes, or sleep disruptions.',
      details: [
        'Identifies correlated cardiopulmonary trends before severe distress',
        'Calculates transparent confidence scores and uncertainty disclosures',
        'Strict algorithmic bounds prevent diagnostic over-reach',
      ],
      badge: 'Step 3: Clinical Synthesis',
    },
    {
      step: '04',
      title: 'Personalized Action & Doctor Collaboration',
      subtitle: 'Physician-directed plans with immutable override locks',
      icon: <Stethoscope className="w-6 h-6 text-indigo-400" />,
      description:
        'You receive timely, actionable guidance — from inhaler pre-medication timings to hydration regimens. Meanwhile, your authorized physician accesses structured trends, updates directives, and signs off on care plans.',
      details: [
        'Doctor instructions cannot be silently overwritten by AI plans',
        'Structured monthly check-ups measure month-over-month trajectory',
        'One-click patient revocation of clinical access at any time',
      ],
      badge: 'Step 4: Empowered Care',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-900/50 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Architecture & Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            How LifeSphere AI Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From sensor wristband to attending physician, explore the four interconnected stages that power our continuous health intelligence platform.
          </p>
        </div>

        {/* 4 Steps Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Step Navigation Cards */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-slate-900 border-emerald-500/50 shadow-xl shadow-emerald-950/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      STEP {s.step}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      {s.badge}
                    </span>
                  </div>
                  <h3 className={`text-base font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {s.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Interactive Showcase of Selected Step */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    {steps[activeStep].icon}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                      Phase {steps[activeStep].step} Specification
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {steps[activeStep].title}
                    </h3>
                  </div>
                </div>

                <span className="text-2xl font-black font-mono text-slate-700">
                  #{steps[activeStep].step}
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {steps[activeStep].description}
              </p>

              {/* Key Capabilities Checklist */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono block">
                  Clinical & Architectural Capabilities:
                </span>
                <ul className="space-y-2.5">
                  {steps[activeStep].details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-3 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stepper Navigation Buttons */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                >
                  Previous Step
                </button>

                <div className="flex items-center gap-1.5">
                  {steps.map((_, dotIdx) => (
                    <div
                      key={dotIdx}
                      className={`h-1.5 rounded-full transition-all ${
                        activeStep === dotIdx ? 'w-6 bg-emerald-400' : 'w-1.5 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none shadow-md"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
