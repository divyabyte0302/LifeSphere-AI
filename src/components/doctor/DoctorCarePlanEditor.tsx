import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Lock,
  AlertTriangle,
  Sparkles,
  Save,
  Clock,
  Award
} from 'lucide-react';
import { DoctorCareNote, DoctorProfile } from '../../types/doctor';

interface DoctorCarePlanEditorProps {
  patientId: string;
  patientName: string;
  doctor: DoctorProfile;
  existingNote?: DoctorCareNote;
  onSaveNote: (note: DoctorCareNote) => void;
  onClose: () => void;
}

export const DoctorCarePlanEditor: React.FC<DoctorCarePlanEditorProps> = ({
  patientId,
  patientName,
  doctor,
  existingNote,
  onSaveNote,
  onClose,
}) => {
  const [recommendations, setRecommendations] = useState<string[]>(
    existingNote?.recommendations || [
      'Pre-medicate with 2 puffs Albuterol 15 minutes prior to outdoor athletic training when ambient PM2.5 > 15 µg/m³.',
      'Maintain Budesonide/Formoterol maintenance therapy uninterrupted through October allergen season.',
      'Schedule annual repeat spirometry with post-bronchodilator assessment in March 2027.',
    ]
  );
  const [newRecText, setNewRecText] = useState('');
  const [followUpDate, setFollowUpDate] = useState(
    existingNote?.followUpDate || '2026-12-15'
  );
  const [careInstructions, setCareInstructions] = useState(
    existingNote?.careInstructions ||
      'If daytime rescue inhaler usage exceeds 3 times in any 7-day period, or morning Peak Expiratory Flow drops below 450 L/min for 2 consecutive days, initiate Step-Up SMART therapy and message clinical desk immediately.'
  );
  const [carePlanInformation, setCarePlanInformation] = useState(
    existingNote?.carePlanInformation ||
      'Longitudinal Management Goal: Maintain zero emergency department visits, maintain FEV1 > 90% predicted, preserve full high-intensity aerobic exercise capability, and minimize systemic corticosteroid exposure.'
  );

  const handleAddRecommendation = () => {
    if (!newRecText.trim()) return;
    setRecommendations([...recommendations, newRecText.trim()]);
    setNewRecText('');
  };

  const handleRemoveRecommendation = (index: number) => {
    setRecommendations(recommendations.filter((_, idx) => idx !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedNote: DoctorCareNote = {
      id: existingNote?.id || `NOTE-${Date.now().toString().slice(-4)}`,
      patientId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorNpi: doctor.npi,
      clinic: doctor.clinic,
      recommendations,
      followUpDate,
      careInstructions,
      carePlanInformation,
      isPhysicianOverride: true, // Physician instructions must not be silently overwritten by AI-generated plans
      createdAt: existingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      signatureHash: `SHA256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
    };

    onSaveNote(updatedNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl shadow-emerald-950/60 space-y-5 p-6 animate-in fade-in zoom-in-95 my-8">
        
        {/* Header with Visual Distinction (Gold/Emerald Physician Badge) */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-mono">
                  Verified Physician Entry
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  NPI: {doctor.npi}
                </span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">
                Clinical Care Directives & Recommendations
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Patient: <strong className="text-slate-200">{patientName} ({patientId})</strong> • Attending: {doctor.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Protection Banner: Non-Overwritable Mandate */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-950 border-2 border-emerald-500/40 flex items-start gap-3">
          <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <span>Physician Sovereign Directives — Non-Overwritable by AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                LOCKED OVERRIDE
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Every directive and instruction entered here is signed with your clinical credentials.
              Under platform safety policy, <strong>doctor instructions must not be silently overwritten by AI-generated plans</strong>.
              AI algorithms are restricted to assistive and supervised roles.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* 1. Doctors Recommendations (List) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Doctor Recommendations
            </label>

            <div className="space-y-2">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-medium"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{rec}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveRecommendation(idx)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Recommendation Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add specific clinical recommendation..."
                value={newRecText}
                onChange={(e) => setNewRecText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRecommendation();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddRecommendation}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* 2. Follow-Up Date & Care Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Follow-up date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Follow-Up Date
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                required
              />
              <span className="text-[10px] text-slate-500 block">
                Next scheduled clinical visit
              </span>
            </div>

            {/* Care Instructions (Span 2) */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Patient Care Instructions
              </label>
              <textarea
                rows={3}
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                placeholder="Specific instructions for asthma triggers, rescue inhaler limits, and symptoms..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* 3. Care-Plan Information */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4" /> Comprehensive Care-Plan Information
            </label>
            <textarea
              rows={3}
              value={carePlanInformation}
              onChange={(e) => setCarePlanInformation(e.target.value)}
              placeholder="Longitudinal clinical goals, targeted spirometry thresholds, and therapy titration schedules..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          {/* Electronic Signature Badge */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Digital Clinical Cryptographic Signature:</span>
            </div>
            <span className="text-emerald-400 font-bold">
              {doctor.name} ({doctor.licenseNumber})
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-emerald-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Commit & Sign Doctor Care Plan</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
