import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Lock,
  Cpu,
  Radio,
  Clock
} from 'lucide-react';
import { SystemConfig } from '../../types/admin';

interface AdminConfigViewProps {
  config: SystemConfig;
  onSaveConfig: (newConfig: SystemConfig) => void;
}

export const AdminConfigView: React.FC<AdminConfigViewProps> = ({
  config: initialConfig,
  onSaveConfig,
}) => {
  const [config, setConfig] = useState<SystemConfig>(initialConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider font-mono">
              Cluster Parameters
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">System & Emergency Configuration</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure clinical safety thresholds, automated trigger rules, AI model routing, and security policies.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Configuration changes deployed to active cluster nodes.</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Emergency & Pattern Detection Thresholds */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-400" />
            <span>Configured Emergency Rule Thresholds</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Critical SpO2 Trigger Floor (%)</label>
              <input
                type="number"
                step="0.1"
                value={config.emergencySpO2Threshold}
                onChange={(e) => setConfig({ ...config, emergencySpO2Threshold: parseFloat(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10px] text-slate-500">Alerts fire if SpO2 drops below this value for &gt;120s</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Resting Heart Rate Ceiling (BPM)</label>
              <input
                type="number"
                value={config.emergencyHeartRateThreshold}
                onChange={(e) => setConfig({ ...config, emergencyHeartRateThreshold: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10px] text-slate-500">Triggers acute tachycardia review under rest</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Ambient PM2.5 Hazard Threshold (µg/m³)</label>
              <input
                type="number"
                step="0.5"
                value={config.emergencyPm25Threshold}
                onChange={(e) => setConfig({ ...config, emergencyPm25Threshold: parseFloat(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10px] text-slate-500">Triggers asthmatic synergy alerts</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="space-y-1.5 max-w-sm">
              <label className="text-xs text-slate-400">Duplicate Alert Cooldown Window (Minutes)</label>
              <input
                type="number"
                value={config.duplicateAlertCooldownMinutes}
                onChange={(e) => setConfig({ ...config, duplicateAlertCooldownMinutes: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10px] text-slate-500">Prevents alarm fatigue for identical triggers</span>
            </div>
          </div>
        </div>

        {/* Section 2: AI Engine & Platform Security Policies */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>AI Model & Policy Architecture</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Primary AI Reasoning Model</label>
              <select
                value={config.defaultAiModel}
                onChange={(e) => setConfig({ ...config, defaultAiModel: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Gemini 2.0 Flash">Gemini 2.0 Flash (Low latency, high throughput)</option>
                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Deep multimodal reasoning)</option>
                <option value="Gemini 1.5 Flash">Gemini 1.5 Flash (Lightweight mobile inference)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">HIPAA Data Retention Period (Months)</label>
              <input
                type="number"
                value={config.dataRetentionMonths}
                onChange={(e) => setConfig({ ...config, dataRetentionMonths: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-500">84 Months = 7-Year HIPAA § 164.316 Requirement</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Enforce Hardware MFA for Clinical & Admin Staff</span>
                <span className="text-[11px] text-slate-400">Requires FIDO2 / WebAuthn hardware security keys</span>
              </div>
              <input
                type="checkbox"
                checked={config.enforceMfaForStaff}
                onChange={(e) => setConfig({ ...config, enforceMfaForStaff: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-400 block">Cluster Maintenance Mode</span>
                <span className="text-[11px] text-slate-400">Restricts non-administrative write requests to queue</span>
              </div>
              <input
                type="checkbox"
                checked={config.maintenanceMode}
                onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-rose-500 focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save & Deploy Configurations</span>
          </button>
        </div>

      </form>

    </div>
  );
};
