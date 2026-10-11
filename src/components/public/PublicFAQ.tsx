import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';

export const PublicFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchFilter, setSearchFilter] = useState('');

  const faqs = [
    {
      q: 'Does LifeSphere AI replace doctors or certified healthcare providers?',
      a: 'Absolutely not. LifeSphere AI does not replace doctors, hospital teams, or emergency services. The platform is designed strictly as an assistive health intelligence and decision-support system. It collects and correlates continuous data to empower both you and your attending physician. In all clinical matters, your physician\'s directives remain supreme and can never be overwritten by AI-generated plans.',
    },
    {
      q: 'Does LifeSphere AI claim to prevent all diseases or guarantee health outcomes?',
      a: 'No. LifeSphere AI makes no claims to prevent all diseases or guarantee specific health results. Biology, environmental exposures, and genetics are multifaceted. Our role is to provide transparent statistical pattern detection, timely environmental pacing alerts, and structured longitudinal records so that you and your clinical care team have richer, proactive insights.',
    },
    {
      q: 'Who has access to my private medical records and diagnostic files?',
      a: 'Only you and the healthcare professionals you explicitly authorize. We implement strict Role-Based Access Control (RBAC) and HIPAA least-privilege principles. System administrators are strictly excluded from viewing private medical records by default. Furthermore, if you revoke a doctor\'s access, their access to your longitudinal telemetry and diagnostic PDFs is terminated immediately.',
    },
    {
      q: 'How does LifeSphere AI connect with my existing wearables?',
      a: 'We support Apple Watch, Garmin, Oura Ring Gen 3, Samsung Galaxy Watch, and standard Bluetooth Low Energy (BLE) pulse oximeters and spirometers. Data synchronization is encrypted and managed through permissioned device bridges, with user-controlled consent toggles at every step.',
    },
    {
      q: 'How does emergency pattern detection work?',
      a: 'Configured clinical rules evaluate continuous vitals (such as sustained hypoxemia or acute bradycardia). If an anomaly is identified, the system immediately presents evidence, explains algorithmic uncertainty ("This is an AI-assisted alert and may be incorrect"), and requires explicit user confirmation before any action is taken. The system will never automatically contact emergency contacts without your authorization.',
    },
    {
      q: 'What is the Monthly Check-up and how does it help my treatment?',
      a: 'The Monthly Check-up is a standardized 2-minute clinical survey (aligned with the Asthma Control Test ACT) that records your peak flow, rescue medication frequency, and nocturnal symptoms. Comparing month-over-month trajectories allows both you and your physician to evaluate whether controller medications are performing optimally.',
    },
    {
      q: 'Is my data sold to health insurance companies or advertising brokers?',
      a: 'Never. LifeSphere AI does not sell, license, or monetize patient data. We operate under zero-advertising, zero-brokerage privacy standards compliant with HIPAA § 164.508 and GDPR Article 9.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.a.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <section id="faq" className="py-20 lg:py-28 bg-slate-900/40 border-t border-slate-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Clear Answers & Clinical Boundaries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Everything you need to know about LifeSphere AI’s safety boundaries, data governance, and physician collaboration.
          </p>

          {/* Search filter */}
          <div className="pt-2 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search questions (e.g. doctors, privacy, emergency)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.q}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-slate-400">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-850 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
