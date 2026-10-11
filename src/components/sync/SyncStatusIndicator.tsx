import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  Smartphone,
  Globe,
  ArrowRightLeft,
  ShieldCheck,
  Clock,
  Layers,
  FileText,
  Pill,
  ClipboardCheck,
  ChevronDown,
  X,
  Copy
} from 'lucide-react';
import { firebaseSyncService, sharedFirebaseConfig } from '../../services/firebaseSyncService';
import { SyncStatus, SyncAuditLog } from '../../types/sync';
import { MedicalRecordItem, Medication } from '../../types';
import { PatientTimelineEvent } from '../../types/doctor';

interface SyncStatusIndicatorProps {
  onNotify?: (msg: string) => void;
  compact?: boolean;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  onNotify,
  compact = false,
}) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('SYNCED');
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [lastSyncFormatted, setLastSyncFormatted] = useState<string>('Just now');
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<SyncAuditLog[]>([]);
  const [records, setRecords] = useState<MedicalRecordItem[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [timeline, setTimeline] = useState<PatientTimelineEvent[]>([]);

  // Update timer for "Last synchronized" humanized display
  useEffect(() => {
    const unsubStatus = firebaseSyncService.subscribeToSyncStatus((status, time) => {
      setSyncStatus(status);
      setLastSync(time);
      setLastSyncFormatted(firebaseSyncService.getFormattedLastSync());
    });

    const unsubAudit = firebaseSyncService.subscribeToAuditLogs((logs) => {
      setAuditLogs(logs);
    });

    const unsubRecords = firebaseSyncService.subscribeToRecords((r) => setRecords(r));
    const unsubMeds = firebaseSyncService.subscribeToMedications((m) => setMedications(m));
    const unsubTimeline = firebaseSyncService.subscribeToTimeline((t) => setTimeline(t));

    const interval = setInterval(() => {
      setLastSyncFormatted(firebaseSyncService.getFormattedLastSync());
    }, 2000);

    return () => {
      unsubStatus();
      unsubAudit();
      unsubRecords();
      unsubMeds();
      unsubTimeline();
      clearInterval(interval);
    };
  }, []);

  const handleTestUploadFromAndroid = async () => {
    const res = await firebaseSyncService.simulateAndroidUploadReport();
    onNotify?.(res.message);
  };

  const handleTestUpdateMedOnWeb = async () => {
    const res = await firebaseSyncService.simulateWebUpdateMedication();
    onNotify?.(res.message);
  };

  const handleTestCompleteCheckupOnAndroid = async () => {
    const res = await firebaseSyncService.simulateAndroidCompleteCheckup();
    onNotify?.(res.message);
  };

  const handleToggleOffline = () => {
    firebaseSyncService.toggleNetworkState();
    const snap = firebaseSyncService.getSnapshot();
    onNotify?.(snap.isOnline ? 'Network restored. Reconciled queued changes with Firestore.' : 'Network offline. Mutations queued locally.');
  };

  const handleTestDuplicateAttack = async () => {
    // Attempt double upload with same hash
    await firebaseSyncService.simulateAndroidUploadReport();
    const second = await firebaseSyncService.simulateAndroidUploadReport();
    onNotify?.(second.message);
  };

  return (
    <>
      {/* Top Header Widget */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setInspectorOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all shadow-sm ${
            syncStatus === 'SYNCED'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/60'
              : syncStatus === 'SYNCING'
              ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 animate-pulse'
              : syncStatus === 'OFFLINE'
              ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}
          title="Click to open Real-Time Firebase Sync Inspector & Device Simulator"
        >
          {syncStatus === 'SYNCED' ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          ) : syncStatus === 'SYNCING' ? (
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
          ) : syncStatus === 'OFFLINE' ? (
            <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          )}

          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline font-bold">
              {syncStatus === 'SYNCED'
                ? 'Synced'
                : syncStatus === 'SYNCING'
                ? 'Syncing'
                : syncStatus === 'OFFLINE'
                ? 'Offline (Queued)'
                : 'Error'}
            </span>
            <span className="text-slate-400 hidden md:inline">·</span>
            <span className="text-[11px] text-slate-300">
              Last synchronized: <strong className="text-white">{lastSyncFormatted}</strong>
            </span>
          </div>

          <ArrowRightLeft className="w-3 h-3 text-slate-400 ml-0.5 hidden lg:block" />
        </button>
      </div>

      {/* Cross-Platform Real-Time Sync Inspector Modal */}
      {inspectorOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl space-y-6 p-6 sm:p-7 animate-in zoom-in-95 duration-150 my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                  <ArrowRightLeft className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                      Shared Firebase Synchronization
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Project: {sharedFirebaseConfig.projectId}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Android ↔ Web Real-Time Synchronization Engine
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setInspectorOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Architecture Overview Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Cloud Firestore</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> onSnapshot Active
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Firebase Storage</span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  AES-256 Medical Vault
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Unified Authentication</span>
                <span className="text-sm font-bold text-cyan-400 mt-0.5 block">
                  UID: #LS-8842
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Last Synchronized</span>
                <span className="text-sm font-bold text-amber-400 mt-0.5 block">
                  {lastSyncFormatted}
                </span>
              </div>
            </div>

            {/* LIVE TEST CONTROLS FOR USER SPECIFIED SCENARIOS */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                  Interactive Cross-Platform Test Scenarios:
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Real-time Firestore listeners trigger across both views
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Example 1: User uploads a report on Android */}
                <button
                  onClick={handleTestUploadFromAndroid}
                  className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-500 hover:bg-slate-850 text-left transition-all space-y-2 group shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Smartphone className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">Example 1</span>
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block group-hover:text-emerald-300">
                      Upload Report on Android
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                      Website immediately displays the uploaded report metadata.
                    </span>
                  </div>
                </button>

                {/* Example 2: User updates medication on website */}
                <button
                  onClick={handleTestUpdateMedOnWeb}
                  className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 hover:border-indigo-500 hover:bg-slate-850 text-left transition-all space-y-2 group shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Globe className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">Example 2</span>
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block group-hover:text-indigo-300">
                      Update Medication on Web
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                      Android app immediately shows the updated medication state.
                    </span>
                  </div>
                </button>

                {/* Example 3: User completes a check-up on Android */}
                <button
                  onClick={handleTestCompleteCheckupOnAndroid}
                  className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 hover:border-purple-500 hover:bg-slate-850 text-left transition-all space-y-2 group shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <ClipboardCheck className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono text-purple-400 font-bold">Example 3</span>
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block group-hover:text-purple-300">
                      Complete Check-Up on Android
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                      Website timeline updates immediately with new survey record.
                    </span>
                  </div>
                </button>

              </div>
            </div>

            {/* FAULT TOLERANCE & EDGE CASE TEST CONTROLS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleToggleOffline}
                className="p-3 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs text-left"
              >
                <div className="flex items-center gap-2.5">
                  <WifiOff className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="font-bold text-white block">Test Network Offline / Reconnect</span>
                    <span className="text-[10px] text-slate-400">Queues mutations offline; resolves on reconnect</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {syncStatus === 'OFFLINE' ? 'Bring Online' : 'Go Offline'}
                </span>
              </button>

              <button
                onClick={handleTestDuplicateAttack}
                className="p-3 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Copy className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-bold text-white block">Test Duplicate Update Suppression</span>
                    <span className="text-[10px] text-slate-400">Verifies idempotency window and deduplication</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">Trigger</span>
              </button>
            </div>

            {/* REAL-TIME AUDIT TRAIL OF SYNCED PACKETS */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Live Synchronization Audit Trail (Last 8 Packets):
              </span>

              <div className="rounded-2xl bg-slate-950 border border-slate-800 max-h-48 overflow-y-auto divide-y divide-slate-850 font-mono text-[11px]">
                {auditLogs.slice(0, 8).map((log) => (
                  <div key={log.id} className="p-2.5 flex items-center justify-between gap-3 text-slate-300">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.originDevice === 'android' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {log.originDevice.toUpperCase()} → {log.targetDevice.toUpperCase()}
                      </span>
                      <span className="font-bold text-white truncate">{log.action}</span>
                      <span className="text-slate-500 hidden sm:inline truncate">{log.details}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-slate-400 text-[10px]">
                      <span className="text-emerald-400">{log.latencyMs}ms</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Synchronized: {records.length} Reports • {medications.length} Medications • {timeline.length} Timeline Events</span>
              <button
                onClick={() => setInspectorOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl font-sans font-semibold text-xs transition-colors"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
