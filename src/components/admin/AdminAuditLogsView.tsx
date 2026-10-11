import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Clock,
  User,
  Activity,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'ADMIN' | 'SYSTEM' | 'DOCTOR' | 'USER';
  action: string;
  resource: string;
  ipAddress: string;
  outcome: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  details: string;
}

const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'AUD-99120',
    timestamp: '2026-09-28T06:14:02Z',
    actor: 'divya03022005@gmail.com',
    actorRole: 'ADMIN',
    action: 'ADMIN_DASHBOARD_ACCESS',
    resource: '/admin/dashboard',
    ipAddress: '128.12.90.14',
    outcome: 'SUCCESS',
    details: 'Administrative role verified via cryptographic token claim `admin: true`.',
  },
  {
    id: 'AUD-99119',
    timestamp: '2026-09-28T05:42:15Z',
    actor: 'usr_untrusted_node',
    actorRole: 'USER',
    action: 'PHI_ACCESS_ATTEMPT_BLOCKED',
    resource: '/medical_records/USR-8842',
    ipAddress: '198.51.100.44',
    outcome: 'DENIED',
    details: 'Unauthorized read request rejected by Firestore Least Privilege security rules.',
  },
  {
    id: 'AUD-99118',
    timestamp: '2026-09-28T04:20:00Z',
    actor: 'alex.mercer@example.com',
    actorRole: 'USER',
    action: 'EMERGENCY_ACTION_CONFIRMED',
    resource: '/emergency_alerts/ALT-2026-9814',
    ipAddress: '172.56.21.90',
    outcome: 'SUCCESS',
    details: 'Patient explicitly authorized emergency dispatch to 911 PSAP and ICE contact.',
  },
  {
    id: 'AUD-99117',
    timestamp: '2026-09-28T03:15:00Z',
    actor: 'SYSTEM_DAEMON',
    actorRole: 'SYSTEM',
    action: 'KMS_CRYPTOGRAPHIC_KEY_ROTATION',
    resource: 'cloudkms/cryptoKeys/lifesphere-phi-key',
    ipAddress: 'Internal VPC',
    outcome: 'SUCCESS',
    details: 'Automated 90-day rotation executed. New encryption version primary.',
  },
  {
    id: 'AUD-99116',
    timestamp: '2026-09-28T02:00:10Z',
    actor: 'dr.sarah.vance@lifesphere.org',
    actorRole: 'DOCTOR',
    action: 'CLINICAL_PATIENT_REVIEW',
    resource: '/patients/USR-8842/telemetry',
    ipAddress: '136.24.89.201',
    outcome: 'SUCCESS',
    details: 'Assigned physician reviewed 30-day HRV variance and asthma symptom index.',
  },
  {
    id: 'AUD-99115',
    timestamp: '2026-09-27T22:30:00Z',
    actor: 'robert.langdon@untrusted.net',
    actorRole: 'USER',
    action: 'ROLE_MODIFICATION_ATTEMPT',
    resource: '/users/USR-1092',
    ipAddress: '192.0.2.88',
    outcome: 'DENIED',
    details: 'Attempted to write `{ role: "ADMIN" }` into profile document. Rejected by rules.',
  },
];

export const AdminAuditLogsView: React.FC = () => {
  const [logs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOutcome, setFilterOutcome] = useState<'ALL' | 'SUCCESS' | 'DENIED'>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOutcome = filterOutcome === 'ALL' || log.outcome === filterOutcome;
    return matchesSearch && matchesOutcome;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lifesphere_hipaa_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider font-mono">
              HIPAA § 164.312(b) Immutable Trail
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Append-Only Storage Verified
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">System Audit-Log Monitoring</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tamper-proof chronological log of all administrative operations, security challenges, and role claim validations.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors self-start md:self-auto shadow-md"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Compliance Audit Package</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by actor, action, IP, resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {(['ALL', 'SUCCESS', 'DENIED'] as const).map((outcome) => (
            <button
              key={outcome}
              onClick={() => setFilterOutcome(outcome)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterOutcome === outcome
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {outcome}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
              <tr>
                <th className="py-3.5 px-4">Event ID / Time</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Resource Target</th>
                <th className="py-3.5 px-4">IP / Origin</th>
                <th className="py-3.5 px-4">Outcome</th>
                <th className="py-3.5 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{log.id}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-white block font-sans font-medium">{log.actor}</span>
                    <span className="text-[10px] text-slate-500">{log.actorRole}</span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-200">
                    {log.action}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 truncate max-w-xs">
                    {log.resource}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {log.ipAddress}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.outcome === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {log.outcome}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-sans text-xs text-slate-300 max-w-md">
                    {log.details}
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
