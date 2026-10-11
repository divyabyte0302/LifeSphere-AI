import React from 'react';
import {
  HardDrive,
  Database,
  Lock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Activity,
  Layers,
  Archive
} from 'lucide-react';
import { StorageMetrics } from '../../types/admin';

interface AdminStorageViewProps {
  storage: StorageMetrics;
}

export const AdminStorageView: React.FC<AdminStorageViewProps> = ({
  storage,
}) => {
  const percentUsed = ((storage.totalStorageGB / storage.quotaLimitGB) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider font-mono">
              AES-256-GCM Encrypted
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Storage & Database Consumption</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cloud Storage bucket volume, Firestore document density, and cryptographic key rotation status.
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-xs text-right">
          <span className="text-slate-500 block text-[10px]">Bucket</span>
          <span className="text-white font-bold">{storage.bucketName}</span>
        </div>
      </div>

      {/* Storage & Firestore Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Bucket Volume */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Bucket Utilization</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{storage.totalStorageGB} GB</span>
            <span className="text-xs text-slate-400 font-mono">Limit: {storage.quotaLimitGB} GB</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all"
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-mono">{storage.fileCount.toLocaleString()} total stored blobs</p>
        </div>

        {/* Firestore Documents */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Firestore Documents</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">
              {storage.firestoreDocumentCount.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-bold">18 Collections</span>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
            <span>Reads: {storage.firestoreReadOperationsToday.toLocaleString()}/day</span>
            <span>Writes: {storage.firestoreWriteOperationsToday.toLocaleString()}/day</span>
          </div>
        </div>

        {/* Encryption at Rest */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">KMS Cryptography</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-emerald-400 font-mono">FIPS 140-2 Level 3</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              {storage.kmsKeyStatus}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Every medical attachment & telemetry packet is encrypted with customer-managed keys before disk commit.
          </p>
        </div>

      </div>

      {/* Storage Breakdown by Clinical Data Type */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Archive className="w-4 h-4 text-purple-400" /> Stored Asset Breakdown by Medical Tier
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block">High-Frequency ECG & Biomarkers</span>
            <span className="text-lg font-bold text-white">68.2 GB</span>
            <span className="text-[10px] text-slate-400 block">Lead II Waveforms, HRV, SpO2</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block">Diagnostic PDFs & Spirometry</span>
            <span className="text-lg font-bold text-white">42.5 GB</span>
            <span className="text-[10px] text-slate-400 block">Lab blood tests, pulmonary reports</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block">FHIR HL7 Encrypted Bundles</span>
            <span className="text-lg font-bold text-white">14.3 GB</span>
            <span className="text-[10px] text-slate-400 block">Interoperability clinical archives</span>
          </div>
        </div>
      </div>

    </div>
  );
};
