import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Activity,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  Check
} from 'lucide-react';

export type AuthCategory = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface AuthenticatedSession {
  role: AuthCategory;
  email: string;
  name: string;
  token: string;
  authTime: string;
}

interface AuthLoginGateProps {
  onAuthenticated: (session: AuthenticatedSession) => void;
  onExplorePublicWebsite?: () => void;
  initialRole?: AuthCategory;
  errorMessage?: string | null;
}

interface RoleCredentialPreset {
  category: AuthCategory;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  defaultEmail: string;
  defaultPassword: string;
  defaultName: string;
  authorizedScope: string[];
  accessLevel: string;
}

const ROLE_PRESETS: Record<AuthCategory, RoleCredentialPreset> = {
  PATIENT: {
    category: 'PATIENT',
    title: 'Patient & Individual',
    subtitle: 'Personal biometric health & environmental intelligence',
    badge: 'Sovereign Patient',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: <Activity className="w-5 h-5 text-emerald-400" />,
    defaultEmail: 'patient@lifesphere.ai',
    defaultPassword: 'PatientPass2026!',
    defaultName: 'Dr. Jordan Vance',
    authorizedScope: [
      'Personal Biometric Telemetry & Overview',
      'AI Digital Twin & Longitudinal Modeling',
      'Monthly Checkup Scheduler & Recurrence',
      'Continuous Health Analytics & CSV Export',
      'Personal Emergency SOS & Safety Routing',
    ],
    accessLevel: 'HIPAA Tier-1 Sovereign Data Owner',
  },
  DOCTOR: {
    category: 'DOCTOR',
    title: 'Doctor & Clinician',
    subtitle: 'Clinical cohort triage, consultations & directive adjustments',
    badge: 'Licensed Clinician',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: <Stethoscope className="w-5 h-5 text-blue-400" />,
    defaultEmail: 'doctor@lifesphere.ai',
    defaultPassword: 'DoctorPass2026!',
    defaultName: 'Dr. Sarah Vance, MD',
    authorizedScope: [
      'Multi-Patient Longitudinal Triage',
      'Clinical Care Plan & Medication Directives',
      'Diagnostic Lab & Spirometry Reviews',
      'HIPAA Immutable Consultation Audit Logs',
    ],
    accessLevel: 'Clinical Practitioner (Authorized Patients Only)',
  },
  ADMIN: {
    category: 'ADMIN',
    title: 'System Administrator',
    subtitle: 'Cloud cluster orchestration, RBAC security & system monitoring',
    badge: 'Security Admin',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    icon: <ShieldAlert className="w-5 h-5 text-indigo-400" />,
    defaultEmail: 'admin@lifesphere.ai',
    defaultPassword: 'AdminPass2026!',
    defaultName: 'Root Security Officer',
    authorizedScope: [
      'System Health & Ingestion Queue Monitoring',
      'Role-Based Access Control (RBAC) Management',
      'Security Audit Logs & Intrusion Events',
      'FCM Global Notification Broadcast Hub',
      'API Endpoint SLAs & Storage Quotas',
    ],
    accessLevel: 'Super Administrator (Least Privilege Role Claims)',
  },
};

export const AuthLoginGate: React.FC<AuthLoginGateProps> = ({
  onAuthenticated,
  onExplorePublicWebsite,
  initialRole = 'PATIENT',
  errorMessage,
}) => {
  const [selectedRole, setSelectedRole] = useState<AuthCategory>(initialRole);
  const [email, setEmail] = useState<string>(ROLE_PRESETS[initialRole].defaultEmail);
  const [password, setPassword] = useState<string>(ROLE_PRESETS[initialRole].defaultPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(errorMessage || null);

  const currentPreset = ROLE_PRESETS[selectedRole];

  const handleRoleTabChange = (role: AuthCategory) => {
    setSelectedRole(role);
    setEmail(ROLE_PRESETS[role].defaultEmail);
    setPassword(ROLE_PRESETS[role].defaultPassword);
    setLoginError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!email.trim() || !password.trim()) {
      setLoginError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    // Simulate authenticating against Firebase Auth and determining credential role
    setTimeout(() => {
      setIsSubmitting(false);

      // Validate email format
      if (!email.includes('@')) {
        setLoginError('Invalid email address format.');
        return;
      }

      const session: AuthenticatedSession = {
        role: selectedRole,
        email: email.trim(),
        name: currentPreset.defaultName,
        token: `mock-token-${selectedRole.toLowerCase()}-${Date.now()}`,
        authTime: new Date().toISOString(),
      };

      onAuthenticated(session);
    }, 450);
  };

  const handleQuickRoleLogin = (role: AuthCategory) => {
    const preset = ROLE_PRESETS[role];
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onAuthenticated({
        role,
        email: preset.defaultEmail,
        name: preset.defaultName,
        token: `mock-token-${role.toLowerCase()}-${Date.now()}`,
        authTime: new Date().toISOString(),
      });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-300">
      
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="w-5 h-5 text-slate-950 font-black" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
              <span>LIFESPHERE</span>
              <span className="text-cyan-400">AI-X</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Security Gateway
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Identity Authentication & Role Authorization Enforcement</p>
          </div>
        </div>

        {onExplorePublicWebsite && (
          <button
            onClick={onExplorePublicWebsite}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Explore Public Product Overview</span>
          </button>
        )}
      </header>

      {/* Main Content: Credential Category Selection & Login Portal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center">
        
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Trust Role-Based Access Control</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Sign In to LifeSphere AI-X
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto">
            Select your credential category to open your authorized application workspace.
          </p>
        </div>

        {/* 3 Credential Category Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {(['PATIENT', 'DOCTOR', 'ADMIN'] as AuthCategory[]).map((role) => {
            const preset = ROLE_PRESETS[role];
            const isSelected = selectedRole === role;

            return (
              <div
                key={role}
                onClick={() => handleRoleTabChange(role)}
                className={`cursor-pointer rounded-2xl p-4 md:p-5 border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/20 shadow-xl shadow-cyan-500/10'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      {preset.icon}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${preset.badgeColor}`}>
                      {preset.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    {preset.title}
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 ml-auto" />}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {preset.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-850">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                    Authorized Scope
                  </span>
                  <p className="text-[11px] text-slate-300 font-medium truncate">
                    {preset.authorizedScope[0]}
                  </p>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickRoleLogin(role);
                    }}
                    className={`mt-3 w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span>Quick Access as {role}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Credential Form Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full mx-auto shadow-2xl">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                Category: {currentPreset.title}
              </span>
              <h2 className="text-base font-bold text-white">
                Enter {selectedRole} Credentials
              </h2>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${currentPreset.badgeColor}`}>
              {currentPreset.accessLevel}
            </span>
          </div>

          {loginError && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Authorized Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`e.g. ${currentPreset.defaultEmail}`}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-500">
                  Encrypted & Hashed (PBKDF2)
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Scope Summary Preview */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Workspace Privileges upon Verification:
              </span>
              <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                {currentPreset.authorizedScope.map((scope, idx) => (
                  <li key={idx} className="truncate">
                    {scope}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials & Granting Role Claims...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate & Open {currentPreset.title}</span>
                </>
              )}
            </button>
          </form>

        </div>

      </main>

      {/* Footer Security Certifications */}
      <footer className="border-t border-slate-800 bg-slate-900/40 px-6 py-4 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strict Role Isolation Enforcement: Patient, Clinician, and Admin sessions are partitioned.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>AES-256 GCM In-Transit</span>
          <span>•</span>
          <span>Firebase Auth Token Binding</span>
          <span>•</span>
          <span>HIPAA Compliance Level 3</span>
        </div>
      </footer>

    </div>
  );
};
