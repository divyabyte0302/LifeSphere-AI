import React from 'react';
import {
  Sparkles,
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Layers,
  Database
} from 'lucide-react';
import { AiServiceStatus } from '../../types/admin';

interface AdminAiMonitoringViewProps {
  aiServices: AiServiceStatus[];
}

export const AdminAiMonitoringView: React.FC<AdminAiMonitoringViewProps> = ({
  aiServices,
}) => {
  const totalTokens = aiServices.reduce((acc, s) => acc + s.tokensConsumedToday, 0);
  const totalQuota = aiServices.reduce((acc, s) => acc + s.dailyQuotaTokens, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-mono">
              Google GenAI SDK 0.1.1 Active
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">AI Service & Model Telemetry</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Token quotas, inference latencies, context cache hits, and clinical safety guardrail tracking.
          </p>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs font-mono text-right">
          <span className="text-slate-500 block">Daily Quota Consumed</span>
          <span className="text-emerald-400 font-bold text-base">
            {((totalTokens / totalQuota) * 100).toFixed(1)}%
          </span>
          <span className="text-[10px] text-slate-400 block">
            {(totalTokens / 1000000).toFixed(2)}M / {(totalQuota / 1000000).toFixed(1)}M Tokens
          </span>
        </div>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiServices.map((service, idx) => {
          const quotaPercent = ((service.tokensConsumedToday / service.dailyQuotaTokens) * 100).toFixed(1);
          return (
            <div
              key={idx}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold font-mono text-emerald-400">
                  {service.model}
                </span>
                <span className="text-[10px] font-bold text-emerald-300 font-mono">
                  {service.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{service.serviceName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{service.provider}</p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Quota: {quotaPercent}%</span>
                  <span className="text-slate-400">
                    {(service.tokensConsumedToday / 1000).toFixed(0)}k / {(service.dailyQuotaTokens / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${quotaPercent}%` }}
                  />
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block">Avg Latency</span>
                  <span className="font-bold text-white">{service.latencyAverageMs} ms</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Cache Hit Rate</span>
                  <span className="font-bold text-cyan-400">{service.cacheHitRatePercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Error Rate</span>
                  <span className="font-bold text-emerald-400">{service.errorRatePercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Safety Triggers</span>
                  <span className="font-bold text-white">{service.promptSafetyFilterTriggers}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
