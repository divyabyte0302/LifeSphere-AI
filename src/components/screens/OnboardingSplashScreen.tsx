import React, { useState } from 'react';
import { Activity, ShieldCheck, Wind, Heart, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { ScreenModule } from '../../types';

interface OnboardingSplashProps {
  type: 'splash' | 'onboarding';
  setScreen: (module: ScreenModule) => void;
  showSnackbar: (msg: string) => void;
}

export const OnboardingSplashScreen: React.FC<OnboardingSplashProps> = ({
  type,
  setScreen,
  showSnackbar,
}) => {
  const [step, setStep] = useState(1);

  if (type === 'splash') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[550px] p-6 text-center select-none">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-pulse">
            <Activity className="w-12 h-12 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="absolute -inset-2 rounded-[32px] bg-emerald-500/20 blur-xl -z-10 animate-ping"></div>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">LIFESPHERE AI</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Personal Health & Environmental Intelligence Platform
        </p>

        <div className="mt-8 flex items-center gap-2 text-xs text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Material 3 • Android SDK 34</span>
        </div>

        <button
          onClick={() => setScreen('onboarding')}
          className="mt-8 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          <span>Enter LifeSphere</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-6 my-4">
      {/* Step indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step ? 'w-8 bg-emerald-500' : s < step ? 'w-4 bg-emerald-700' : 'w-4 bg-slate-800'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] font-mono text-slate-400">Step {step} of 3</span>
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Baseline Health Profile</h2>
            <p className="text-xs text-slate-400 mt-1">
              LifeSphere AI customizes clinical reasoning based on your personal physiology.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block mb-1">Pre-existing Condition:</span>
              <span className="text-white font-semibold">Mild Allergic Asthma (Documented)</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block mb-1">Sensitivities:</span>
              <span className="text-white font-semibold">Tree Pollen, Dust Mites, Penicillin</span>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Atmospheric Hazard Tracking</h2>
            <p className="text-xs text-slate-400 mt-1">
              Authorizes precise GPS-based ambient Air Quality Index (AQI), PM2.5, and UV radiation alerts.
            </p>
          </div>

          <div className="space-y-2 pt-2 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time PM2.5 particulate concentration alerts</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Drug-UV photosensitivity contraindication alerts</span>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Data Sovereignty & HIPAA</h2>
            <p className="text-xs text-slate-400 mt-1">
              Your telemetry is encrypted on device. You maintain full ownership and can export or delete records anytime.
            </p>
          </div>

          <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs space-y-1.5">
            <span className="font-bold text-emerald-400 block">Permissions Requested:</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              - Bluetooth (Wearable synchronization)<br />
              - Approximate Location (Local air quality telemetry)<br />
              - Notifications (High environmental hazard alerts)
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="text-xs text-slate-400 hover:text-white"
          >
            Back
          </button>
        ) : (
          <button
            onClick={() => setScreen('dashboard')}
            className="text-xs text-slate-500 hover:text-slate-400"
          >
            Skip for now
          </button>
        )}

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              showSnackbar('Onboarding completed! Welcome to your Command Center.');
              setScreen('dashboard');
            }}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <span>Finish & Go to Dashboard</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
