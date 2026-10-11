import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Layers,
  Server,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  HardDrive
} from 'lucide-react';
import { SystemHealthMetrics } from '../../types/admin';

interface AdminSystemMonitoringViewProps {
  metrics: SystemHealthMetrics;
}

export const AdminSystemMonitoringView: React.FC<AdminSystemMonitoringViewProps> = ({
  metrics: initialMetrics,
}) => {
  const [metrics, setMetrics] = useState<SystemHealthMetrics>(initialMetrics);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSimulateRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        cpuUsagePercent: parseFloat((20 + Math.random() * 15).toFixed(1)),
        memoryUsagePercent: parseFloat((38 + Math.random() * 8).toFixed(1)),
        averageLatencyMs: parseFloat((32 + Math.random() * 10).toFixed(1)),
        networkThroughputMbps: parseFloat((150 + Math.random() * 60).toFixed(1)),
      }));
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-mono">
              Cluster State: {metrics.status}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Uptime: {metrics.uptimeHours} hrs (99.98%)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">System Infrastructure Telemetry</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Distributed node instances, memory allocation, container scaling, and live network throughput.
          </p>
        </div>

        <button
          onClick={handleSimulateRefresh}
          disabled={isRefreshing}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Primary Hardware & Infrastructure Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">CPU Allocation</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{metrics.cpuUsagePercent}%</span>
            <span className="text-xs text-slate-500">16 vCPUs</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.cpuUsagePercent}%` }}
            />
          </div>
        </div>

        {/* Memory */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">RAM Utilization</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{metrics.memoryUsagePercent}%</span>
            <span className="text-xs text-slate-500">26.3 / 64 GB</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.memoryUsagePercent}%` }}
            />
          </div>
        </div>

        {/* Containers */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Instances Scale</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{metrics.activeContainerInstances}</span>
            <span className="text-xs text-indigo-400 font-bold">Auto-scaling on</span>
          </div>
          <p className="text-[11px] text-slate-400">Target replica count: 12-24 pods</p>
        </div>

        {/* Latency */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Cluster Roundtrip</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400 font-mono">{metrics.averageLatencyMs} ms</span>
            <span className="text-xs text-slate-500">p95: 54ms</span>
          </div>
          <p className="text-[11px] text-slate-400">Throughput: {metrics.networkThroughputMbps} Mbps</p>
        </div>
      </div>

      {/* Cluster Pods and Node Health Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" /> Active Microservice Pod Replicas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {[
            { name: 'telemetry-ingestion-v1', pods: '4/4', status: 'Healthy', region: 'us-west1-a' },
            { name: 'ai-synergy-worker-v2', pods: '6/6', status: 'Healthy', region: 'us-west1-b' },
            { name: 'emergency-dispatch-gateway', pods: '2/2', status: 'Healthy', region: 'us-west1-c' },
            { name: 'fhir-hl7-transformer', pods: '2/2', status: 'Healthy', region: 'us-west1-a' },
            { name: 'environmental-mesh-collector', pods: '3/3', status: 'Healthy', region: 'us-west1-b' },
            { name: 'auth-session-manager', pods: '2/2', status: 'Healthy', region: 'us-west1-c' },
          ].map((srv, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-white text-[11px]">{srv.name}</span>
                <span className="text-emerald-400 font-bold">{srv.status}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Pods: {srv.pods}</span>
                <span>{srv.region}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
