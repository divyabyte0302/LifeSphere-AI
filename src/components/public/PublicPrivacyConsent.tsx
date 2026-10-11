import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  FileCheck,
  Key,
  Database,
  CheckCircle2,
  XCircle,
  EyeOff
} from 'lucide-react';

export const PublicPrivacyConsent: React.FC = () => {
  const [consentWearables, setConsentWearables] = useState(true);
  const [consentLocation, setConsentLocation] = useState(true);
  const [consentDoctorSharing, setConsentDoctorSharing] = useState(true);
  const [consentAIProcessing, setConsentAIProcessing] = useState(true);

  return (
    <section id="privacy-consent" className="py-20 lg:py-28 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Sovereign Data Governance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Privacy & Explicit Consent
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Your physiological data belongs exclusively to you. LifeSphere AI enforces absolute least privilege, cryptographic access controls, and zero third-party monetization.
          </p>
        </div>

        {/* 3 Core Privacy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Sovereign Patient Ownership</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every data point collected from wearables or surveys is signed with your identity keys. You can grant, restrict, or revoke access with a single click.
            </p>
          </div>

          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Strict Least Privilege (RBAC)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Administrators cannot view private medical records by default. Doctors can only see patients who explicitly authorized them. Zero unauthorized discovery.
            </p>
          </div>

          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Immutable HIPAA Audit Trail</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every query, chart review, and report download is immutably timestamped in tamper-proof compliance logs under HIPAA § 164.312(b).
            </p>
          </div>
        </div>

        {/* Interactive Consent Control Simulation Console */}
        <div className="max-w-4xl mx-auto bg-slate-900/90 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                Interactive Security Sandbox
              </span>
              <h4 className="text-lg font-bold text-white">
                Live Patient Consent & Revocation Controls
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              HIPAA § 164.508 Active
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Toggle 1 */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-white block">Continuous Wearable Biometric Streaming</span>
                <span className="text-[11px] text-slate-400">Ingest continuous SpO2, heart rate, and sleep stages.</span>
              </div>
              <button
                onClick={() => setConsentWearables(!consentWearables)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  consentWearables
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {consentWearables ? 'AUTHORIZED' : 'REVOKED'}
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-white block">Hyperlocal Atmospheric Geo-Sensing</span>
                <span className="text-[11px] text-slate-400">Cross-reference location with street-level AQI and PM2.5.</span>
              </div>
              <button
                onClick={() => setConsentLocation(!consentLocation)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  consentLocation
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {consentLocation ? 'AUTHORIZED' : 'REVOKED'}
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-white block">Attending Physician Chart Access (Dr. Sarah Vance, MD)</span>
                <span className="text-[11px] text-slate-400">Allow authorized doctor to inspect monthly check-ups and PFT reports.</span>
              </div>
              <button
                onClick={() => setConsentDoctorSharing(!consentDoctorSharing)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  consentDoctorSharing
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-rose-500 text-white shadow-md'
                }`}
              >
                {consentDoctorSharing ? 'AUTHORIZED' : 'REVOKED'}
              </button>
            </div>

            {/* Toggle 4 */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-white block">Gemini Multi-Modal Predictive Pacing Analysis</span>
                <span className="text-[11px] text-slate-400">Enable AI-assisted correlation modeling for early trend warnings.</span>
              </div>
              <button
                onClick={() => setConsentAIProcessing(!consentAIProcessing)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  consentAIProcessing
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {consentAIProcessing ? 'AUTHORIZED' : 'REVOKED'}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center font-mono">
            Revoking permissions immediately blocks downstream pipelines. Revoked data is never cached or stored.
          </p>
        </div>

      </div>
    </section>
  );
};
