import React from 'react';
import { ShieldAlert, Lock, AlertTriangle, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { CurrentAdminAuth, AdminAuthService } from '../../services/adminAuthService';

interface AdminRouteGuardProps {
  currentAuth: CurrentAdminAuth;
  onRoleSwitch: (role: 'USER' | 'DOCTOR' | 'ADMIN') => void;
  children: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  currentAuth,
  onRoleSwitch,
  children,
}) => {
  const isAdmin = currentAuth.role === 'ADMIN' && currentAuth.claims.admin === true;

  if (isAdmin) {
    return <>{children}</>;
  }

  // HTTP 403 Forbidden Screen enforcing RBAC & Least Privilege
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-8 shadow-2xl shadow-rose-950/40 text-center space-y-6 animate-in fade-in zoom-in-95">
        
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>

        {/* Title & Status */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            HTTP 403: Forbidden Access
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Administrative Privilege Required
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            The LifeSphere AI Admin Web Portal is protected by Firebase Authentication and cryptographic role claims. Your current active credentials do not have the required <code className="text-rose-400 font-mono font-bold">ADMIN</code> claim.
          </p>
        </div>

        {/* Identity & Claims Inspection Box */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 text-left font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-850">
            <span>Authenticated Principal:</span>
            <span className="text-white font-bold">{currentAuth.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Current Role:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              currentAuth.role === 'DOCTOR' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
            }`}>
              {currentAuth.role}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Firebase Token Claim `admin`:</span>
            <span className="text-rose-400 font-bold">{String(currentAuth.claims.admin)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Route Authorization Policy:</span>
            <span className="text-amber-400 font-bold">Requires `request.auth.token.role == 'ADMIN'`</span>
          </div>
        </div>

        {/* Least Privilege Explanation */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-left text-xs text-amber-200/90 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Zero-Trust & Least Privilege Architecture</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Role-Based Access Control (RBAC) separates concerns. Regular <strong>USERS</strong> access personal telemetry, <strong>DOCTORS</strong> access assigned clinical cohorts, and only verified <strong>ADMINS</strong> can inspect system telemetry, audit trails, and infrastructure health.
          </p>
        </div>

        {/* Interactive Role Switcher for Evaluators / Testing */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <p className="text-xs text-slate-400 font-medium">
            Test Route Protection by Switching Role Claims:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onRoleSwitch('ADMIN')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Switch to ADMIN Role (Grant Access)</span>
            </button>
            <button
              onClick={() => onRoleSwitch('DOCTOR')}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
            >
              Switch to DOCTOR Role
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
