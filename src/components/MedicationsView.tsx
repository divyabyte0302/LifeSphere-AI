import React from 'react';
import { Pill, Sun, AlertTriangle, CheckCircle2, Clock, Plus, ShieldAlert } from 'lucide-react';
import { Medication } from '../types';

interface MedicationsViewProps {
  medications: Medication[];
  onToggleTaken: (id: string) => void;
  isMobile?: boolean;
}

export const MedicationsView: React.FC<MedicationsViewProps> = ({
  medications,
  onToggleTaken,
  isMobile,
}) => {
  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-5xl mx-auto'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              Prescription & Environmental Interaction Engine
            </h2>
            <p className="text-xs text-slate-400">
              Cross-references pharmacokinetics with ambient heat, UV and air quality
            </p>
          </div>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="rounded-2xl bg-amber-950/30 border border-amber-500/30 p-4 flex items-start gap-3">
        <Sun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-200 leading-relaxed">
          <span className="font-bold text-amber-300">Environmental Pharmacovigilance:</span> Certain medications (e.g. Doxycycline, Diuretics, Retinoids) induce phototoxic dermatitis or impair hypothalamic thermoregulation during high UV or heat indexes. LifeSphere AI automatically correlates timing.
        </div>
      </div>

      {/* Medication List */}
      <div className="space-y-3">
        {medications.map((med) => (
          <div
            key={med.id}
            className={`rounded-2xl border p-4 md:p-5 transition-all ${
              med.isTakenToday
                ? 'bg-slate-900/60 border-slate-800'
                : 'bg-slate-900 border-slate-700/80 shadow-md'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm md:text-base">{med.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {med.dosage}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{med.frequency}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 pt-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Scheduled: {med.scheduledTimes.join(', ')}</span>
                </div>
              </div>

              <button
                onClick={() => onToggleTaken(med.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  med.isTakenToday
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{med.isTakenToday ? 'Taken Today' : 'Mark Taken'}</span>
              </button>
            </div>

            {/* Environmental Warning Badge if present */}
            {med.environmentalWarning && (
              <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <span className="font-bold">Environmental Interaction: </span>
                  {med.environmentalWarning}
                </div>
              </div>
            )}

            <div className="mt-2 text-[11px] text-slate-500 italic">
              {med.notes}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
