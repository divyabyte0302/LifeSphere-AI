import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, FileCheck, Eye, EyeOff, KeyRound } from 'lucide-react';

interface ConsentViewProps {
  isMobile?: boolean;
}

export const ConsentView: React.FC<ConsentViewProps> = ({ isMobile }) => {
  const [biometrics, setBiometrics] = useState(true);
  const [geoTracking, setGeoTracking] = useState(true);
  const [aiTriage, setAiTriage] = useState(true);
  const [anonymizedResearch, setAnonymizedResearch] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-4xl mx-auto'}`}>
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            Consent, Privacy & Data Sovereignty
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
              HIPAA & GDPR Compliant
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            You retain cryptographic ownership of all physiological biomarkers and microclimate logs
          </p>
        </div>
      </div>

      {/* Security Guarantee Box */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed space-y-1">
          <p className="font-semibold text-white">Client-Side Zero Knowledge Encryption</p>
          <p>
            Your continuous ECG, heart rate variability, and clinical medication history are encrypted on-device. LifeSphere AI never monetizes or sells medical telemetry.
          </p>
        </div>
      </div>

      {/* Consent Toggles */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800 overflow-hidden">
        {/* Biometrics */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs md:text-sm font-semibold text-white">
              Continuous Wearable Biometric Streaming
            </h4>
            <p className="text-xs text-slate-400">
              Allows real-time telemetry processing from Apple Watch, Oura Ring, or BLE sensors.
            </p>
          </div>
          <button
            onClick={() => setBiometrics(!biometrics)}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
              biometrics ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                biometrics ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Ambient Geo Tracking */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs md:text-sm font-semibold text-white">
              Ambient Air Quality Geo-Location
            </h4>
            <p className="text-xs text-slate-400">
              Synchronizes hyperlocal AQI, PM2.5, UV Index and pollen allergen density matching your GPS.
            </p>
          </div>
          <button
            onClick={() => setGeoTracking(!geoTracking)}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
              geoTracking ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                geoTracking ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* AI Symptom Checkup Engine */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs md:text-sm font-semibold text-white">
              Generative AI Diagnostic Correlation
            </h4>
            <p className="text-xs text-slate-400">
              Empowers Gemini AI to perform cross-system synergy assessments between your vitals and environment.
            </p>
          </div>
          <button
            onClick={() => setAiTriage(!aiTriage)}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
              aiTriage ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                aiTriage ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Anonymized Research */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs md:text-sm font-semibold text-white">
              Anonymized Epidemiological Research Pool
            </h4>
            <p className="text-xs text-slate-400">
              Contributes de-identified particulate health trends to global academic research consortiums.
            </p>
          </div>
          <button
            onClick={() => setAnonymizedResearch(!anonymizedResearch)}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
              anonymizedResearch ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                anonymizedResearch ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs md:text-sm transition-colors shadow-lg shadow-emerald-500/20"
        >
          Save Data Sovereignty Preferences
        </button>

        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Preferences committed to local encrypted vault
          </span>
        )}
      </div>

    </div>
  );
};
