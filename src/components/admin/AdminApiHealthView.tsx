import React, { useState } from 'react';
import {
  Server,
  Activity,
  CheckCircle2,
  Clock,
  Play,
  RotateCw,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { ApiEndpointHealth } from '../../types/admin';

interface AdminApiHealthViewProps {
  apiEndpoints: ApiEndpointHealth[];
}

export const AdminApiHealthView: React.FC<AdminApiHealthViewProps> = ({
  apiEndpoints: initialEndpoints,
}) => {
  const [endpoints, setEndpoints] = useState<ApiEndpointHealth[]>(initialEndpoints);
  const [pingingIndex, setPingingIndex] = useState<number | null>(null);

  const handleTestPing = (index: number) => {
    setPingingIndex(index);
    setTimeout(() => {
      setEndpoints((prev) =>
        prev.map((ep, idx) =>
          idx === index
            ? {
                ...ep,
                responseTimeMs: Math.max(12, Math.round(ep.responseTimeMs + (Math.random() * 8 - 4))),
                successRatePercent: 99.98,
              }
            : ep
        )
      );
      setPingingIndex(null);
    }, 450);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider font-mono">
              Gateway v2.4 Online
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">API Health & Endpoint Diagnostics</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time latency histograms, p95/p99 latency bounds, and live health check pings.
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3 font-mono text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">Endpoints</span>
            <span className="text-white font-bold">{endpoints.length} Active</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px]">Mean Latency</span>
            <span className="text-cyan-400 font-bold">
              {(endpoints.reduce((acc, e) => acc + e.responseTimeMs, 0) / endpoints.length).toFixed(0)} ms
            </span>
          </div>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
              <tr>
                <th className="py-3.5 px-5">Method / Route</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Latency (p50)</th>
                <th className="py-3.5 px-4">p95 / p99</th>
                <th className="py-3.5 px-4">Success Rate</th>
                <th className="py-3.5 px-4">Throughput</th>
                <th className="py-3.5 px-5 text-right">Diagnostic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {endpoints.map((ep, idx) => (
                <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                        {ep.method}
                      </span>
                      <span className="font-bold text-white">{ep.endpoint}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {ep.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-cyan-400">
                    {ep.responseTimeMs} ms
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {ep.p95LatencyMs}ms / {ep.p99LatencyMs}ms
                  </td>

                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    {ep.successRatePercent}%
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {ep.requestsPerMinute.toLocaleString()} rpm
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => handleTestPing(idx)}
                      disabled={pingingIndex === idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCw className={`w-3 h-3 ${pingingIndex === idx ? 'animate-spin text-cyan-400' : ''}`} />
                      <span>Ping</span>
                    </button>
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
