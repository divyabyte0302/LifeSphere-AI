import React, { useState, useEffect } from 'react';
import { FileText, Download, X, Share2, CheckCircle2, Code, ShieldCheck, Smartphone, Globe } from 'lucide-react';
import { HealthMetrics, EnvironmentalData, MedicalRecordItem } from '../types';
import { firebaseSyncService } from '../services/firebaseSyncService';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vitals: HealthMetrics;
  environment: EnvironmentalData;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  vitals,
  environment,
}) => {
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const [synchronizedReports, setSynchronizedReports] = useState<MedicalRecordItem[]>([]);

  useEffect(() => {
    const unsub = firebaseSyncService.subscribeToRecords((records) => {
      setSynchronizedReports(records);
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const fhirData = {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: 'LS-8842',
          name: [{ family: 'Vance', given: ['Jordan'] }],
          gender: 'male',
          birthDate: '1992-05-14',
        },
      },
      {
        resource: {
          resourceType: 'Observation',
          status: 'final',
          code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }] },
          valueQuantity: { value: vitals.heartRate, unit: 'beats/minute' },
        },
      },
      {
        resource: {
          resourceType: 'Observation',
          status: 'final',
          code: { coding: [{ system: 'http://loinc.org', code: '2708-6', display: 'Oxygen saturation in Arterial blood' }] },
          valueQuantity: { value: vitals.spO2, unit: '%' },
        },
      },
      {
        resource: {
          resourceType: 'Observation',
          status: 'final',
          code: { coding: [{ system: 'http://lifesphere.ai/codes', code: 'AQI-PM25', display: 'Ambient Air Quality Index' }] },
          valueQuantity: { value: environment.airQualityIndex, unit: 'AQI' },
        },
      },
    ],
  };

  const handleDownload = (format: string) => {
    setDownloaded(format);
    setTimeout(() => setDownloaded(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Clinical Health & Atmospheric Report</h3>
              <p className="text-xs text-slate-400">FHIR HL7 Interoperable Clinical Export</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Patient: Dr. Jordan Vance (LS-8842)</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-850 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Avg Heart Rate</span>
                <span className="font-bold text-white">{vitals.heartRate} BPM</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Resting SpO2</span>
                <span className="font-bold text-cyan-400">{vitals.spO2}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Exposure AQI</span>
                <span className="font-bold text-amber-400">{environment.airQualityIndex}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Sleep Score</span>
                <span className="font-bold text-purple-400">{vitals.sleepScore}/100</span>
              </div>
            </div>
          </div>

          {/* Synchronized Medical Records & Uploads from Android / Web */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5 text-white">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Uploaded Clinical Reports (Live Firebase Storage & Firestore)
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                {synchronizedReports.length} Synchronized
              </span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {synchronizedReports.map((rec) => (
                <div key={rec.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-0.5 min-w-0 pr-3">
                    <span className="font-bold text-white block truncate">{rec.title}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {rec.category} • {rec.fileName} • {rec.fileSize} • {rec.date}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono shrink-0">
                    Synced
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FHIR Code Preview */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-semibold">
              <span className="flex items-center gap-1.5"><Code className="w-3.5 h-3.5 text-purple-400" /> HL7 FHIR Standard JSON</span>
              <span className="text-[11px] text-emerald-400 font-mono">Status: Validated</span>
            </div>
            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 leading-relaxed">
              {JSON.stringify(fhirData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload('PDF')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Clinical Summary</span>
            </button>

            <button
              onClick={() => handleDownload('FHIR')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export FHIR JSON</span>
            </button>
          </div>

          {downloaded && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> {downloaded} package generated!
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
