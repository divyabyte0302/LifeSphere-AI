import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types/admin';

interface PublicAuthModalsProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  defaultRole?: UserRole;
  onClose: () => void;
  onSuccessLogin: (role: UserRole) => void;
}

export const PublicAuthModals: React.FC<PublicAuthModalsProps> = ({
  isOpen,
  initialMode,
  defaultRole = 'USER',
  onClose,
  onSuccessLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [condition, setCondition] = useState('Asthma');
  const [consentChecked, setConsentChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Preset quick fill for test convenience
  const handleQuickRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'DOCTOR') {
      setEmail('sarah.vance@lifesphere.ai');
      setPassword('••••••••••••');
    } else if (role === 'ADMIN') {
      setEmail('admin@lifesphere.ai');
      setPassword('••••••••••••');
    } else {
      setEmail('alex.mercer@example.com');
      setPassword('••••••••••••');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccessLogin(selectedRole);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-5 p-6 animate-in zoom-in-95 duration-150 my-8">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xs">
              LS
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">
              LifeSphere <span className="text-emerald-400">AI</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In (Login)
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            New Account (Register)
          </button>
        </div>

        {/* Role Selector Pill Tabs */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Select Portal & Access Scope:
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleQuickRoleSelect('USER')}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'USER'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span>Patient</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSelect('DOCTOR')}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'DOCTOR'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSelect('ADMIN')}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-300 font-medium block">Account Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Primary Health Focus</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans"
              >
                <option value="Asthma">Allergic Asthma & Respiratory Sensitivity</option>
                <option value="Cardio">Cardiovascular Health & Sinus Rhythm</option>
                <option value="Allergy">Seasonal Pollen & PM2.5 Exposure</option>
                <option value="Athletic">Endurance Training & Altitude Adaptation</option>
              </select>
            </div>
          )}

          {mode === 'register' && (
            <label className="flex items-start gap-2 pt-1 text-[11px] text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 rounded border-slate-800 text-emerald-500 focus:ring-0"
              />
              <span>I consent to HIPAA § 164.508 sovereign cryptographic data isolation.</span>
            </label>
          )}

          <button
            type="submit"
            disabled={isLoading || (mode === 'register' && !consentChecked)}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <span>{isLoading ? 'Verifying Credentials...' : mode === 'login' ? `Enter ${selectedRole === 'DOCTOR' ? 'Doctor Portal' : selectedRole === 'ADMIN' ? 'Admin Portal' : 'Patient App'}` : 'Complete Registration & Launch'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Helper Test Notice */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-mono text-center">
          <span>Demo auto-fills ready for Patient, Doctor, and Admin roles.</span>
        </div>

      </div>
    </div>
  );
};
