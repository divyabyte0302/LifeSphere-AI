import React from 'react';
import {
  Activity,
  ShieldCheck,
  Lock,
  Heart,
  FileText,
  Mail,
  ArrowUp
} from 'lucide-react';

interface PublicFooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenLogin: (role?: 'USER' | 'DOCTOR' | 'ADMIN') => void;
  onOpenRegister: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onNavigateSection,
  onOpenLogin,
  onOpenRegister,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      
      {/* Mandatory Clinical Disclaimers & Safety Notice Banner */}
      <div className="bg-slate-900/80 border-b border-slate-850 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 text-[11px] leading-relaxed text-slate-300">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="font-bold text-white block uppercase tracking-wider text-[10px] font-mono">
              Clinical & Regulatory Boundary Notice
            </span>
            <p className="text-slate-400">
              LifeSphere AI is an assistive continuous personal health intelligence platform designed for decision support and data aggregation. LifeSphere AI <strong>does not replace doctors</strong>, provide definitive medical diagnoses, <strong>prevent all diseases</strong>, or <strong>guarantee health outcomes</strong>. Always consult your attending physician or certified clinical provider regarding any health condition or treatment plan. In case of an emergency, immediately call 911 or your local emergency services.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* Brand & Mission */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              LIFESPHERE <span className="text-emerald-400">AI</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Bridging wearable biometrics, hyperlocal atmospheric intelligence, and attending physician collaboration under patient-sovereign cryptographic consent.
          </p>
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500 pt-2">
            <span>HIPAA § 164.508</span>
            <span>•</span>
            <span>GDPR Art. 9</span>
            <span>•</span>
            <span>HL7 FHIR</span>
            <span>•</span>
            <span>AES-256</span>
          </div>
        </div>

        {/* Section Links 1 */}
        <div className="space-y-3">
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
            Platform
          </span>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigateSection('problem-solution')} className="hover:text-white transition-colors">
                Problem & Solution
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('how-it-works')} className="hover:text-white transition-colors">
                How It Works
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('features')} className="hover:text-white transition-colors">
                Platform Features
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('continuous-profile')} className="hover:text-white transition-colors">
                Continuous Profile
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('health-trends')} className="hover:text-white transition-colors">
                AI Health Trends
              </button>
            </li>
          </ul>
        </div>

        {/* Section Links 2 */}
        <div className="space-y-3">
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
            Clinical Modules
          </span>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigateSection('monthly-checkup')} className="hover:text-white transition-colors">
                Monthly Check-up
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('post-checkup')} className="hover:text-white transition-colors">
                Post Check-up Updates
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('personalized-plan')} className="hover:text-white transition-colors">
                Personalized Health Plan
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('environmental-intelligence')} className="hover:text-white transition-colors">
                Environmental Intelligence
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('emergency-support')} className="hover:text-white transition-colors">
                Emergency Support
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('technology')} className="hover:text-white transition-colors">
                Technology Stack
              </button>
            </li>
          </ul>
        </div>

        {/* Section Links 3: Access & Governance */}
        <div className="space-y-3">
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
            Portals & Access
          </span>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onOpenLogin('USER')} className="hover:text-white transition-colors text-emerald-400 font-medium">
                Patient Sign In
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLogin('DOCTOR')} className="hover:text-white transition-colors text-cyan-400 font-medium">
                Doctor Portal Sign In
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLogin('ADMIN')} className="hover:text-white transition-colors text-indigo-400 font-medium">
                Admin Web Portal
              </button>
            </li>
            <li>
              <button onClick={onOpenRegister} className="hover:text-white transition-colors text-white font-medium">
                New User Registration
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('contact')} className="hover:text-white transition-colors">
                Contact & Support
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('faq')} className="hover:text-white transition-colors">
                FAQ
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Legal Strip */}
      <div className="border-t border-slate-900 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <span>
            © {new Date().getFullYear()} LifeSphere AI. All rights reserved. Sovereign health intelligence.
          </span>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigateSection('privacy-consent')} className="hover:text-slate-300">
              HIPAA & Privacy Policy
            </button>
            <button onClick={() => onNavigateSection('technology')} className="hover:text-slate-300">
              Security Specifications
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Return to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};
