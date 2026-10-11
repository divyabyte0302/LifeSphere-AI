import React from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Lock,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { PatientAuthorization, DoctorProfile } from '../../types/doctor';

interface DoctorAuthorizationManagerProps {
  authorizations: PatientAuthorization[];
  doctor: DoctorProfile;
  onGrantAuthorization: (patientId: string) => void;
  onRevokeAuthorization: (patientId: string) => void;
}

export const DoctorAuthorizationManager: React.FC<DoctorAuthorizationManagerProps> = ({
  authorizations,
  doctor,
  onGrantAuthorization,
  onRevokeAuthorization,
}) => {
  const authorizedCount = authorizations.filter((a) => a.status === 'AUTHORIZED').length;
  const revokedCount = authorizations.filter((a) => a.status === 'REVOKED').length;

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-mono">
              HIPAA § 164.508 Consent Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Patient Authorization & Revocation Governance</h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
            Doctors must only see patients who have explicitly authorized access. Patients maintain sovereign control to grant, renew, or revoke clinical data sharing permissions at any time.
          </p>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 font-mono text-xs flex items-center gap-4 shrink-0">
          <div>
            <span className="text-slate-500 block text-[10px]">Authorized</span>
            <span className="text-emerald-400 font-bold text-base">{authorizedCount} Active</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px]">Revoked</span>
            <span className="text-rose-400 font-bold text-base">{revokedCount} Blocked</span>
          </div>
        </div>
      </div>

      {/* Legal & Policy Safeguard Card */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border-2 border-amber-500/30 text-xs text-amber-200/90 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Zero-Trust Patient Consent Policy</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          When a patient revokes authorization, all longitudinal metrics, spirometry PDFs, diagnostic histories, and medication logs are <strong>instantly withheld</strong> from this portal. Only patients with active, unrevoked consent appear in your clinical list.
        </p>
      </div>

      {/* Authorizations Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Consent Records for {doctor.name} ({doctor.clinic})
          </h3>
          <span className="text-xs font-mono text-slate-400">Total: {authorizations.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
              <tr>
                <th className="py-3.5 px-5">Patient</th>
                <th className="py-3.5 px-4">Authorization Status</th>
                <th className="py-3.5 px-4">Authorized Scopes</th>
                <th className="py-3.5 px-4">Granted Date</th>
                <th className="py-3.5 px-4">Revoked / Expiry Date</th>
                <th className="py-3.5 px-5 text-right">Consent Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {authorizations.map((auth) => (
                <tr key={auth.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div>
                      <span className="font-bold text-white font-sans text-xs block">{auth.patientName}</span>
                      <span className="text-[10px] text-slate-400">{auth.patientId} • {auth.patientEmail}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        auth.status === 'AUTHORIZED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {auth.status === 'AUTHORIZED' ? 'AUTHORIZED (VISIBLE)' : 'REVOKED (RESTRICTED)'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 font-sans text-[11px]">
                    {auth.authorizedScopes.length > 0
                      ? auth.authorizedScopes.join(', ')
                      : 'None (Withheld)'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(auth.grantedAt).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4">
                    {auth.revokedAt ? (
                      <span className="text-rose-400 font-bold">
                        Revoked: {new Date(auth.revokedAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        Expires: {new Date(auth.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-5 text-right font-sans">
                    {auth.status === 'AUTHORIZED' ? (
                      <button
                        onClick={() => onRevokeAuthorization(auth.patientId)}
                        className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                        title="Simulate patient revoking doctor access"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Revoke Access</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onGrantAuthorization(auth.patientId)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                        title="Simulate patient granting consent to doctor"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Grant Authorization</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
