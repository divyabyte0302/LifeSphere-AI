import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Globe,
  Clock,
  ShieldCheck,
  EyeOff
} from 'lucide-react';
import { SecurityEvent } from '../../types/admin';

interface AdminSecurityEventsViewProps {
  securityEvents: SecurityEvent[];
}

export const AdminSecurityEventsView: React.FC<AdminSecurityEventsViewProps> = ({
  securityEvents,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const filteredEvents = securityEvents.filter((e) => {
    const matchesSearch =
      e.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.sourceIp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || e.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider font-mono">
              SIEM Threat Mitigation Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Security Events & Threat Intelligence</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated brute force mitigation, geographic IP rate limiting, and RBAC least privilege policy enforcement.
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-xs flex items-center gap-3">
          <div>
            <span className="text-slate-500 block text-[10px]">Threat Level</span>
            <span className="text-emerald-400 font-bold">NOMINAL</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px]">Auto-Mitigated</span>
            <span className="text-white font-bold">100%</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by event type, IP, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {(['ALL', 'CRITICAL', 'HIGH', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                severityFilter === sev
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    event.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : event.severity === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {event.severity}
                </span>
                <span className="font-bold text-white text-sm font-mono">
                  {event.eventType}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-500">{event.id}</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  {event.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {event.details}
            </p>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-850">
              <div className="flex items-center gap-3">
                <span>Origin IP: <strong className="text-slate-300">{event.sourceIp}</strong></span>
                <span>Location: <strong className="text-slate-300">{event.location}</strong></span>
              </div>
              <div>
                {new Date(event.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
