import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  Calendar,
  User,
  Plus,
  X,
  FileCheck,
  CheckCircle2,
  Filter,
  Smartphone,
  Globe,
  ArrowRightLeft
} from 'lucide-react';
import { MedicalRecordItem } from '../../types';
import { firebaseSyncService } from '../../services/firebaseSyncService';

interface MedicalRecordsScreenProps {
  showSnackbar: (msg: string) => void;
  isMobile?: boolean;
}

export const MedicalRecordsScreen: React.FC<MedicalRecordsScreenProps> = ({
  showSnackbar,
  isMobile,
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Spirometry' | 'Lab Test' | 'Vaccination'>('All');

  // Form states for file upload
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<MedicalRecordItem['category']>('Spirometry');
  const [docProvider, setDocProvider] = useState('Dr. Rachel Adams (Pulmonology)');
  const [fileName, setFileName] = useState('');
  const [records, setRecords] = useState<MedicalRecordItem[]>([]);

  // Real-time Firestore listener for medical records (shared between Android & Web)
  useEffect(() => {
    const unsubscribe = firebaseSyncService.subscribeToRecords((liveRecords) => {
      setRecords(liveRecords);
    });
    return () => unsubscribe();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    const deviceOrigin = isMobile ? 'android' : 'web';
    const chosenFileName = fileName || `${docTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`;

    const res = await firebaseSyncService.uploadReport({
      origin: deviceOrigin,
      title: docTitle,
      category: docCategory,
      provider: docProvider,
      fileName: chosenFileName,
      fileSize: '1.4 MB',
      summary: `Uploaded from ${deviceOrigin === 'android' ? 'Android Mobile' : 'Web SaaS'} and parsed via LifeSphere Clinical OCR engine.`,
    });

    setIsUploadOpen(false);
    setDocTitle('');
    setFileName('');
    showSnackbar(res.message);
  };

  const filtered = filter === 'All' ? records : records.filter((r) => r.category === filter);

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-5xl mx-auto'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              Medical Records & Diagnostic Vault
            </h2>
            <p className="text-xs text-slate-400">
              HL7/FHIR compatible clinical history, lab tests and spirometry
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Record</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['All', 'Spirometry', 'Lab Test', 'Vaccination'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === cat
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Record Cards */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">{item.date}</span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.provider}</p>
              <p className="text-xs text-slate-300 italic pt-1">{item.summary}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
              <button
                onClick={() => showSnackbar(`Downloading ${item.fileName}...`)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>{item.fileSize}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload File Modal Dialog */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Upload Clinical Record</h3>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Allergen IgE Panel or Spirometry"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Category</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Spirometry">Spirometry</option>
                    <option value="Lab Test">Lab Test</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Radiology">Radiology / Chest X-Ray</option>
                    <option value="Prescription">Prescription</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Provider / Clinic</label>
                  <input
                    type="text"
                    value={docProvider}
                    onChange={(e) => setDocProvider(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Drag and Drop File Picker Zone */}
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Upload PDF / DICOM / Image</label>
                <div
                  onClick={() => setFileName('patient_clinical_upload_2026.pdf')}
                  className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/60 transition-colors"
                >
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-semibold">
                    {fileName ? (
                      <span className="text-emerald-400 flex items-center justify-center gap-1">
                        <FileCheck className="w-4 h-4" /> Selected: {fileName}
                      </span>
                    ) : (
                      'Click to select file from device storage'
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Supports PDF, JPG, PNG up to 25MB (Encrypted)</p>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Confirm & Encrypt Upload
                </button>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
