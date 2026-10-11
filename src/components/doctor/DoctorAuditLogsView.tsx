import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  ShieldCheck,
  Clock,
  User,
  Activity,
  CheckCircle2,
  Lock,
  Stethoscope
} from 'lucide-react';
import { DoctorAccessAuditLog, DoctorProfile } from '../../types/doctor';

interface DoctorAuditLogsViewProps {
  logs: DoctorAccessAuditLog[];
  doctor: DoctorProfile;
}

export const DoctorAuditLogsView: React.FC<DoctorAuditLogsViewProps> = ({
  logs,
  doctor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.accessedFeature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.purposeOfAccess.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `doctor_clinical_access_trail_${doctor.id}_${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider font-mono">
              HIPAA § 164.312(b) Clinical Accounting of Disclosures
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Physician Clinical Access Audit Trail</h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
            Every doctor access must be logged. Every patient review, chart inspection, spirometry query, and care-plan modification is immutably timestamped and attributed to your clinical license.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors self-start md:self-auto shadow-md"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Accounting Log</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by patient, feature, purpose..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
              <tr>
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-4">Attending Physician</th>
                <th className="py-3.5 px-4">Patient Target</th>
                <th className="py-3.5 px-4">Accessed Feature / Module</th>
                <th className="py-3.5 px-4">Regulatory Purpose of Access</th>
                <th className="py-3.5 px-5 text-right">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <span className="text-white block font-bold">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    <span className="text-white font-bold block">{log.doctorName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">NPI: {log.doctorNpi}</span>
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    <span className="text-emerald-400 font-bold block">{log.patientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.patientId}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-200 border border-slate-800">
                      {log.accessedFeature}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-sans text-slate-300 text-xs max-w-xs">
                    {log.purposeOfAccess}
                  </td>

                  <td className="py-3.5 px-5 text-right text-slate-400">
                    {log.clientIp}
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
