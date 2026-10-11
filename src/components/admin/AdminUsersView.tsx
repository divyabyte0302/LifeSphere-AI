import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  Lock,
  EyeOff,
  UserCheck,
  UserX,
  AlertTriangle,
  FileText,
  Clock,
  Smartphone,
  CheckCircle2,
  XCircle,
  Key,
  ShieldAlert
} from 'lucide-react';
import { AdminUser, UserRole } from '../../types/admin';

interface AdminUsersViewProps {
  users: AdminUser[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onToggleUserStatus: (userId: string) => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  users,
  onUpdateUserRole,
  onToggleUserStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [breakGlassNotice, setBreakGlassNotice] = useState(false);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Privacy Banner: Least Privilege Guarantee */}
      <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              User Management & Identity Administration
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider font-mono">
                Least Privilege Active
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Administrators manage roles, authentication tokens, and account status without access to raw protected health information (PHI).
            </p>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
          Total Users: <strong className="text-white">{users.length}</strong>
        </div>
      </div>

      {/* 2. Search, Filter, and Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, account ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto overflow-x-auto">
          {(['ALL', 'USER', 'DOCTOR', 'ADMIN'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                roleFilter === role
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
              <tr>
                <th className="py-3.5 px-5">User</th>
                <th className="py-3.5 px-4">Role (RBAC)</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Device</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                        {user.displayName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{user.displayName}</span>
                          {user.emailVerified && (
                            <span title="Email Verified">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                        user.role === 'ADMIN'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : user.role === 'DOCTOR'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : user.status === 'SUSPENDED'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {user.deviceType}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setBreakGlassNotice(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      Manage & Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. User Details Modal with Explicit Medical Record Redaction (Least Privilege) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-5 p-6 animate-in fade-in zoom-in-95 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                  {selectedUser.displayName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedUser.displayName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    ID: {selectedUser.id} • {selectedUser.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Account Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-500 block">Current Role:</span>
                <span className="text-white font-bold">{selectedUser.role}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Status:</span>
                <span className="text-emerald-400 font-bold">{selectedUser.status}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Device:</span>
                <span className="text-slate-300">{selectedUser.deviceType}</span>
              </div>
              <div>
                <span className="text-slate-500 block">MFA Enforcement:</span>
                <span className={selectedUser.mfaEnabled ? 'text-emerald-400' : 'text-amber-400'}>
                  {selectedUser.mfaEnabled ? 'Hardware / TOTP Enabled' : 'Not Enabled'}
                </span>
              </div>
            </div>

            {/* LEAST PRIVILEGE CLINICAL REDACTION SECTION */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border-2 border-rose-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <EyeOff className="w-4 h-4" />
                  <span>Clinical Medical Records: Redacted by Least Privilege Policy</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  HIPAA § 164.502
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                As an <strong>ADMINISTRATOR</strong>, you are strictly prohibited from viewing patient medical records, raw ECG waveforms, laboratory panels, or psychiatric check-up answers by default. Only an authorized <strong>DOCTOR</strong> assigned to this patient or the patient themselves can access these records.
              </p>

              {/* Redacted Data Fields Simulation */}
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-slate-500">
                  <span>Diagnostic History & Diagnoses:</span>
                  <span className="text-rose-400 font-bold">[REDACTED_CLINICAL_DIAGNOSES - ACCESS DENIED]</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-slate-500">
                  <span>Continuous ECG & Lead II Waveforms:</span>
                  <span className="text-rose-400 font-bold">[RESTRICTED_WAVEFORM_BLOB - E2E ENCRYPTED]</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-slate-500">
                  <span>Active Prescriptions & Notes:</span>
                  <span className="text-rose-400 font-bold">[MASKED_PHI - DOCTOR ROLE REQUIRED]</span>
                </div>
              </div>
            </div>

            {/* Administrative Management Actions */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Administrative Permissions & Controls
              </h4>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Change Role to DOCTOR */}
                <button
                  onClick={() => {
                    onUpdateUserRole(selectedUser.id, 'DOCTOR');
                    setSelectedUser({ ...selectedUser, role: 'DOCTOR' });
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors"
                >
                  Set Role: DOCTOR
                </button>

                {/* Change Role to USER */}
                <button
                  onClick={() => {
                    onUpdateUserRole(selectedUser.id, 'USER');
                    setSelectedUser({ ...selectedUser, role: 'USER' });
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-colors"
                >
                  Set Role: USER
                </button>

                {/* Change Role to ADMIN */}
                <button
                  onClick={() => {
                    onUpdateUserRole(selectedUser.id, 'ADMIN');
                    setSelectedUser({ ...selectedUser, role: 'ADMIN' });
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
                >
                  Set Role: ADMIN
                </button>

                {/* Suspend or Activate Account */}
                <button
                  onClick={() => {
                    onToggleUserStatus(selectedUser.id);
                    setSelectedUser({
                      ...selectedUser,
                      status: selectedUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
                    });
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    selectedUser.status === 'ACTIVE'
                      ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {selectedUser.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
