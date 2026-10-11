import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Download,
  Trash2,
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  Eye,
  Key
} from 'lucide-react';
import { UserProfile, ScreenModule } from '../../types';

interface SettingsAndAccountProps {
  type: 'profile' | 'privacy' | 'data_export' | 'account_deletion';
  user: UserProfile;
  setScreen: (module: ScreenModule) => void;
  showSnackbar: (msg: string) => void;
  isMobile?: boolean;
}

export const SettingsAndAccountScreens: React.FC<SettingsAndAccountProps> = ({
  type,
  user,
  setScreen,
  showSnackbar,
  isMobile,
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [exportFormat, setExportFormat] = useState<'PDF' | 'FHIR' | 'CSV'>('PDF');
  const [isExporting, setIsExporting] = useState(false);

  if (type === 'account_deletion') {
    return (
      <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-lg mx-auto'}`}>
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto mb-2">
            <Trash2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Permanently Delete Account</h2>
          <p className="text-xs text-slate-400">
            This action is irreversible. All continuous ECG telemetry, air quality logs, prescription history, and clinical reports will be purged.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 space-y-2">
          <span className="font-bold block">Important Notice:</span>
          <p>
            Under HIPAA & GDPR "Right to Erasure", all cryptographic hashes referencing your clinical profile will be destroyed immediately.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-semibold block">
            Type <span className="text-rose-400 font-bold font-mono">DELETE</span> to confirm:
          </label>
          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="DELETE"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            disabled={deleteConfirmation !== 'DELETE'}
            onClick={() => {
              showSnackbar('Account and all telemetry purged.');
              setScreen('login');
            }}
            className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition-colors"
          >
            Permanently Purge My Data
          </button>
          <button
            onClick={() => setScreen('dashboard')}
            className="px-4 py-3 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (type === 'data_export') {
    return (
      <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-xl mx-auto'}`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white">Data Export & Clinical Interoperability</h2>
            <p className="text-xs text-slate-400">Download your personal health record in open standards</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-2">Export Format</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'PDF', label: 'PDF Summary', desc: 'Physician printable report' },
                { id: 'FHIR', label: 'HL7 FHIR JSON', desc: 'EHR interoperability' },
                { id: 'CSV', label: 'Raw CSV', desc: 'Continuous sensor logs' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setExportFormat(f.id as any)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    exportFormat === f.id
                      ? 'bg-purple-600/20 border-purple-500 text-white'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-bold block">{f.label}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-xs text-slate-400">
            Included datasets: 30-day continuous heart rate, SpO2 telemetry, AQI & particulate correlations, prescription adherence, and doctor notes.
          </div>

          <button
            onClick={() => {
              setIsExporting(true);
              setTimeout(() => {
                setIsExporting(false);
                showSnackbar(`Exported LifeSphere_${exportFormat}_Archive.zip successfully.`);
              }, 1000);
            }}
            disabled={isExporting}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating encrypted archive...' : `Download ${exportFormat} Archive`}</span>
          </button>
        </div>
      </div>
    );
  }

  if (type === 'privacy') {
    return (
      <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-4xl mx-auto'}`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white">Android Permissions & Privacy Architecture</h2>
            <p className="text-xs text-slate-400">Granular control over device sensors, GPS, and biometric processing</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white">Approximate & Fine Geolocation</span>
              <p className="text-xs text-slate-400">Needed exclusively to query localized atmospheric AQI stations matching your coordinates.</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">GRANTED</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white">Body Sensors & Heart Rate (BODY_SENSORS)</span>
              <p className="text-xs text-slate-400">Accesses wearable sensor API for real-time pulse oximetry and ECG.</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">GRANTED</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white">Bluetooth Low Energy (BLUETOOTH_CONNECT)</span>
              <p className="text-xs text-slate-400">Scans and streams packets from external pocket optical particulate sensors.</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">GRANTED</span>
          </div>
        </div>
      </div>
    );
  }

  // Profile View
  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-4xl mx-auto'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-base">
            JV
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white">{user.name}</h2>
            <p className="text-xs text-slate-400">{user.email} • ID: {user.id}</p>
          </div>
        </div>

        <button
          onClick={() => showSnackbar('Profile details updated.')}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700"
        >
          Edit Profile
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800 text-xs">
        <div className="p-4 flex justify-between">
          <span className="text-slate-400 font-semibold">Age & Gender</span>
          <span className="text-white">{user.age} Years • {user.gender}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-slate-400 font-semibold">Height & Weight</span>
          <span className="text-white">{user.heightCm} cm • {user.weightKg} kg (BMI: 22.8)</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-slate-400 font-semibold">Blood Group</span>
          <span className="text-rose-400 font-bold">{user.bloodType}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-slate-400 font-semibold">Chronic Conditions</span>
          <span className="text-amber-400 font-semibold">{user.chronicConditions.join(', ')}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-slate-400 font-semibold">Known Allergies</span>
          <span className="text-slate-200">{user.allergies.join(', ')}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-slate-400 font-semibold">Emergency Contact (ICE)</span>
          <span className="text-emerald-400 font-semibold">{user.emergencyContact.name} ({user.emergencyContact.phone})</span>
        </div>
      </div>
    </div>
  );
};
