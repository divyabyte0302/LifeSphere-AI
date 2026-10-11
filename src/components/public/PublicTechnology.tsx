import React from 'react';
import {
  Cpu,
  Layers,
  ShieldCheck,
  Smartphone,
  Server,
  Lock,
  Database,
  Code2,
  FileCode,
  Zap,
  Globe
} from 'lucide-react';

export const PublicTechnology: React.FC = () => {
  const stack = [
    {
      title: 'Multi-Modal Reasoning AI',
      subtitle: 'Gemini 2.0 Flash Engine',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      desc: 'Sub-second multi-stream correlation cross-referencing biometric trends with atmospheric telemetry and clinical guidelines with strict algorithmic safety bounds.',
    },
    {
      title: 'Full Dual-Platform Parity',
      subtitle: 'React 18 & Native Android',
      icon: <Smartphone className="w-5 h-5 text-emerald-400" />,
      desc: 'High-performance responsive Web SaaS platform (Desktop, Tablet, Mobile) running in tandem with a complete native Android Google Pixel Material 3 architecture.',
    },
    {
      title: 'Hardened RBAC Security Rules',
      subtitle: 'Firebase Firestore & Auth',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
      desc: 'Cryptographic custom claims enforce strict Least Privilege. Administrators are excluded from raw medical records; doctors only access authorized charts.',
    },
    {
      title: 'Clinical Data Interoperability',
      subtitle: 'HL7 FHIR & LOINC Standards',
      icon: <Database className="w-5 h-5 text-cyan-400" />,
      desc: 'Standardized clinical payloads for spirometry (PFT), arterial blood gases, vital signs, and allergy registries enabling seamless export to hospital EHRs.',
    },
    {
      title: 'Tamper-Proof Audit Logging',
      subtitle: 'HIPAA § 164.312(b)',
      icon: <Lock className="w-5 h-5 text-rose-400" />,
      desc: 'Append-only immutable audit trail recording every physician access, emergency alert confirmation, and authorization grant with digital signature hashes.',
    },
    {
      title: 'Offline Resilient Protocol',
      subtitle: 'SMS Fallback & BLE Sync',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      desc: 'Edge-cached biometric buffers continue recording vitals when cellular networks fail, falling back to encrypted SMS payloads in emergency scenarios.',
    },
  ];

  return (
    <section id="technology" className="py-20 lg:py-28 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider font-bold">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Architecture & Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Built on Modern Clinical Technology
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Engineered with strict zero-trust principles, hardened cryptographic rules, and modern open healthcare interchange formats.
          </p>
        </div>

        {/* Tech Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stack.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-3 relative overflow-hidden group hover:border-indigo-500/40 hover:bg-slate-900 transition-all shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Spec 0{idx + 1}</span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {item.title}
              </h3>
              <span className="text-xs font-mono text-indigo-400 block font-semibold">
                {item.subtitle}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Cryptographic Standards Strip */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6 max-w-4xl mx-auto flex flex-wrap items-center justify-around gap-6 text-center font-mono text-xs text-slate-400">
          <div>
            <span className="text-white font-bold block text-sm">AES-256</span>
            <span className="text-[10px]">Rest Storage</span>
          </div>
          <div className="w-px h-8 bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-white font-bold block text-sm">TLS 1.3</span>
            <span className="text-[10px]">Transport Security</span>
          </div>
          <div className="w-px h-8 bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-white font-bold block text-sm">HL7 FHIR</span>
            <span className="text-[10px]">Clinical Interchange</span>
          </div>
          <div className="w-px h-8 bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-white font-bold block text-sm">SHA-256</span>
            <span className="text-[10px]">Physician Signatures</span>
          </div>
        </div>

      </div>
    </section>
  );
};
