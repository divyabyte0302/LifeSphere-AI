import React, { useState } from 'react';
import {
  User,
  Heart,
  Activity,
  Wind,
  Droplets,
  Calendar,
  FileText,
  Pill,
  Sparkles,
  Stethoscope,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Download,
  Plus,
  Lock,
  ArrowLeft,
  Check,
  Sliders
} from 'lucide-react';
import {
  DoctorPatientRecord,
  DoctorProfile,
  DoctorCareNote
} from '../../types/doctor';
import { DoctorCarePlanEditor } from './DoctorCarePlanEditor';

interface DoctorPatientDetailViewProps {
  patientRecord: DoctorPatientRecord;
  doctor: DoctorProfile;
  onUpdateDoctorNote: (note: DoctorCareNote) => void;
  onLogAccess: (feature: string, patientId: string, patientName: string) => void;
  onBackToList: () => void;
}

export const DoctorPatientDetailView: React.FC<DoctorPatientDetailViewProps> = ({
  patientRecord,
  doctor,
  onUpdateDoctorNote,
  onLogAccess,
  onBackToList,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'timeline' | 'trends' | 'reports' | 'medications' | 'checkups' | 'careplan'
  >('overview');
  const [editorOpen, setEditorOpen] = useState(false);

  const { patient, vitals, environment, timeline, healthTrends, reports, medications, checkups, doctorNotes, aiPlans } =
    patientRecord;

  const latestDoctorNote = doctorNotes[0];

  const handleTabChange = (
    tab: 'overview' | 'timeline' | 'trends' | 'reports' | 'medications' | 'checkups' | 'careplan'
  ) => {
    setActiveTab(tab);
    const featureMap: Record<typeof tab, string> = {
      overview: 'PATIENT_OVERVIEW',
      timeline: 'TIMELINE',
      trends: 'HEALTH_TRENDS',
      reports: 'REPORTS',
      medications: 'MEDICATIONS',
      checkups: 'CHECKUP_HISTORY',
      careplan: 'CARE_PLAN_NOTES',
    };
    onLogAccess(featureMap[tab], patient.id, patient.name);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Patient Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-start gap-4">
            <button
              onClick={onBackToList}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors mt-0.5"
              title="Return to Authorized Patient List"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-mono">
                  Access Authorized by Patient
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  MRN: {patient.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Expires: {new Date(patientRecord.authorization.expiresAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{patient.name}</span>
                <span className="text-sm font-normal text-slate-400">({patient.age} yrs)</span>
              </h1>
              
              <p className="text-xs text-slate-300 mt-1 max-w-2xl font-medium">
                Condition: <strong className="text-emerald-400">{patient.primaryCondition || patient.chronicConditions[0] || 'Asthma'}</strong>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Allergies: {patient.allergies.join(', ')} • ICE: {patient.emergencyContact.name} ({patient.emergencyContact.phone})
              </p>
            </div>
          </div>

          {/* Quick Doctor Action Button */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => {
                setEditorOpen(true);
                onLogAccess('CARE_PLAN_EDITOR_OPEN', patient.id, patient.name);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Update Care Plan & Directives</span>
            </button>
          </div>

        </div>

        {/* Live Biomarker Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Resting HR</span>
            <span className="text-base font-bold text-white">{vitals.heartRate} BPM</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Blood Oxygen (SpO2)</span>
            <span className="text-base font-bold text-emerald-400">{vitals.spO2}%</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">HRV (SDNN)</span>
            <span className="text-base font-bold text-cyan-400">{vitals.hrv} ms</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Blood Pressure</span>
            <span className="text-base font-bold text-white">{vitals.bloodPressure}</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Ambient PM2.5</span>
            <span className="text-base font-bold text-amber-400">{environment.pm25} µg/m³</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Air Quality Index</span>
            <span className="text-base font-bold text-emerald-400">{environment.airQualityIndex} AQI</span>
          </div>
        </div>
      </div>

      {/* Feature Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: 'Doctor Overview & Directives' },
          { id: 'timeline', label: `Patient Timeline (${timeline.length})` },
          { id: 'trends', label: 'Health & Environmental Trends' },
          { id: 'reports', label: `Reports (${reports.length})` },
          { id: 'medications', label: `Medications (${medications.length})` },
          { id: 'checkups', label: `Check-up History (${checkups.length})` },
          { id: 'careplan', label: 'Care-Plan & AI Comparison' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & DOCTOR RECOMMENDATIONS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* VISUAL CONTRAST SECTION: DOCTOR DIRECTIVE VS AI SUGGESTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* DOCTOR-ENTERED INFORMATION CARD (Gold/Emerald Distinct Styling) */}
            <div className="bg-slate-900 border-2 border-emerald-500/70 rounded-3xl p-6 space-y-4 shadow-xl shadow-emerald-950/20 relative">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase tracking-wider block">
                      Physician Directive • Authoritative
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      Attending Doctor Orders & Plan
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-500/30">
                  {latestDoctorNote?.doctorName}
                </span>
              </div>

              {latestDoctorNote ? (
                <div className="space-y-4 text-xs">
                  {/* Doctor Recommendations */}
                  <div className="space-y-2">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] block">
                      Prescribed Clinical Recommendations:
                    </span>
                    <ul className="space-y-1.5">
                      {latestDoctorNote.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-200">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Follow Up Date */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Follow-Up Target Date:</span>
                    <span className="text-amber-400 font-bold font-mono">
                      {latestDoctorNote.followUpDate}
                    </span>
                  </div>

                  {/* Care Instructions */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 text-[11px] block">Patient Care Instructions:</span>
                    <p className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 leading-relaxed">
                      {latestDoctorNote.careInstructions}
                    </p>
                  </div>

                  {/* Care Plan Information */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 text-[11px] block">Longitudinal Care-Plan:</span>
                    <p className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 leading-relaxed">
                      {latestDoctorNote.carePlanInformation}
                    </p>
                  </div>

                  {/* Physician Override Lock Stamp */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Lock className="w-3 h-3" /> Locked Directive (Non-Overwritable)
                    </span>
                    <span>Signed: {new Date(latestDoctorNote.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs space-y-2">
                  <p>No physician directives entered yet.</p>
                  <button
                    onClick={() => setEditorOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                  >
                    Add Directives Now
                  </button>
                </div>
              )}
            </div>

            {/* AI-GENERATED INFORMATION CARD (Purple/Indigo Distinct Styling) */}
            <div className="bg-slate-900 border-2 border-purple-500/50 rounded-3xl p-6 space-y-4 shadow-xl shadow-purple-950/20 relative">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase tracking-wider block">
                      AI Assistive Model • Probabilistic
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      Synthesized Machine Intelligence Insights
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-950/60 px-2 py-1 rounded-lg border border-purple-500/30">
                  Gemini 2.0 Flash
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {aiPlans.length > 0 ? (
                  aiPlans.map((plan) => (
                    <div key={plan.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-purple-300">{plan.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          Confidence: {plan.confidenceScore}%
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {plan.planDetails}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-500 border-t border-slate-850">
                        <span>Model: {plan.aiModel}</span>
                        <span className="text-emerald-400 font-bold">Physician Supervised</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs">No pending AI propositions.</p>
                )}

                {/* AI Uncertainty & Hierarchy Notice */}
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200/90 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Non-Overwrite Protocol Enforced</span>
                  </div>
                  <p className="text-slate-400 leading-normal">
                    AI-generated plans cannot override, replace, or alter doctor instructions. In any conflict, the physician's directive above governs treatment.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Active Prescriptions */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-400" /> Current Prescriptions
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">{medications.length}</span>
              </div>
              <div className="space-y-2 text-xs">
                {medications.map((m) => (
                  <div key={m.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="font-bold text-white">{m.name}</p>
                    <p className="text-[10px] text-slate-400">{m.dosage} • {m.frequency}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Spirometry / PFT */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" /> Latest Spirometry Report
                </span>
                <span className="text-xs font-mono text-cyan-400">{reports[0]?.date}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <p className="font-bold text-white">{reports[0]?.title}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">{reports[0]?.summary}</p>
              </div>
            </div>

            {/* Last Self-Checkup */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-400" /> Last Self-Checkup
                </span>
                <span className="text-xs font-mono text-purple-400">{checkups[0]?.date}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Severity:</span>
                  <span className="text-emerald-400 font-bold">{checkups[0]?.symptomSeverity}</span>
                </div>
                <p className="text-[11px] text-slate-300">{checkups[0]?.peakFlowOrSpirometry}</p>
                <p className="text-[10px] text-slate-500 italic">"{checkups[0]?.patientNotes}"</p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: PATIENT TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" /> Patient Longitudinal Timeline
              </h3>
              <p className="text-xs text-slate-400">
                Chronological aggregation of clinical orders, diagnostic lab reports, AI triggers, and patient symptom logs.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              {timeline.length} Events Logged
            </span>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-800">
            {timeline.map((event) => (
              <div key={event.id} className="relative flex items-start gap-4 pl-1">
                {/* Dot */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    event.authorType === 'DOCTOR'
                      ? 'bg-emerald-500 text-white'
                      : event.authorType === 'AI'
                      ? 'bg-purple-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {event.authorType === 'DOCTOR' && <Stethoscope className="w-3 h-3" />}
                  {event.authorType === 'AI' && <Sparkles className="w-3 h-3" />}
                  {event.authorType === 'PATIENT' && <User className="w-3 h-3" />}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 p-4 rounded-2xl border ${
                    event.authorType === 'DOCTOR'
                      ? 'bg-slate-950 border-emerald-500/40'
                      : event.authorType === 'AI'
                      ? 'bg-slate-950 border-purple-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{event.title}</span>
                      <span
                        className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${
                          event.authorType === 'DOCTOR'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : event.authorType === 'AI'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {event.authorType} ENTRY: {event.authorName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{event.summary}</p>
                  {event.details && (
                    <p className="text-[11px] text-slate-400 mt-1 italic">{event.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HEALTH TRENDS */}
      {activeTab === 'trends' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" /> Longitudinal Biomarker & Atmospheric Correlation
              </h3>
              <p className="text-xs text-slate-400">
                7-day rolling window of resting heart rate, blood oxygen (SpO2), heart rate variability, and ambient PM2.5.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">SpO2 (%)</th>
                  <th className="py-3 px-4">Resting Heart Rate (BPM)</th>
                  <th className="py-3 px-4">HRV SDNN (ms)</th>
                  <th className="py-3 px-4">Ambient PM2.5 (µg/m³)</th>
                  <th className="py-3 px-4">Ambient Temp (°C)</th>
                  <th className="py-3 px-4">Clinical Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {healthTrends.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/50">
                    <td className="py-3 px-4 font-bold text-white">{t.date}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{t.spO2}%</td>
                    <td className="py-3 px-4 text-white">{t.restingHeartRate} BPM</td>
                    <td className="py-3 px-4 text-cyan-400">{t.hrv} ms</td>
                    <td className="py-3 px-4 text-amber-400">{t.ambientPm25} µg/m³</td>
                    <td className="py-3 px-4 text-slate-300">{t.temperature}°C</td>
                    <td className="py-3 px-4 font-sans text-xs text-slate-400">
                      {t.ambientPm25 > 20
                        ? 'Particulate spike; mild compensatory cardiac elevation noted'
                        : 'Normal baseline tolerance maintained'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" /> Patient Medical Reports & Spirometry Files
              </h3>
              <p className="text-xs text-slate-400">
                Diagnostic laboratory panels, pulmonary function tests, and radiological studies.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              {reports.length} Documents
            </span>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{rep.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                      {rep.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{rep.summary}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Provider: {rep.provider} • Date: {rep.date} • File: {rep.fileName} ({rep.fileSize})
                  </p>
                </div>

                <button
                  onClick={() => alert(`Downloading verified clinical report: ${rep.fileName}`)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors self-start md:self-auto shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MEDICATIONS */}
      {activeTab === 'medications' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-400" /> Prescribed Medications & Inhaler Adherence
              </h3>
              <p className="text-xs text-slate-400">
                Active pharmacotherapy orders and continuous smart inhaler sensor telemetry.
              </p>
            </div>
            <button
              onClick={() => {
                setEditorOpen(true);
                onLogAccess('MEDICATION_ORDER_REVIEW', patient.id, patient.name);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Modify Orders</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {medications.map((med) => (
              <div
                key={med.id}
                className="p-5 bg-slate-950 rounded-2xl border-2 border-emerald-500/30 space-y-3"
              >
                <div>
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                    Physician Prescribed
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">{med.name}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{med.dosage}</p>
                </div>

                <div className="text-xs space-y-1 pt-2 border-t border-slate-850">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Frequency:</span>
                    <span className="text-slate-300 font-medium">{med.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Prescriber:</span>
                    <span className="text-slate-300 font-medium">{med.prescribedBy}</span>
                  </div>
                </div>

                {/* AI Adherence Telemetry Note */}
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-200/90 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-purple-300 text-[10px] uppercase">
                    <Sparkles className="w-3 h-3" /> Smart Sensor Adherence:
                  </span>
                  <p className="leading-relaxed">{med.aiAdherenceAnalysis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CHECK-UP HISTORY */}
      {activeTab === 'checkups' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" /> Patient Self-Checkup History & Symptom Diary
              </h3>
              <p className="text-xs text-slate-400">
                Monthly structured asthma control tests, self-reported wheezing, and peak flow records.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              {checkups.length} Submissions
            </span>
          </div>

          <div className="space-y-3">
            {checkups.map((chk) => (
              <div
                key={chk.id}
                className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs font-mono">{chk.date}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        chk.symptomSeverity === 'MILD'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : chk.symptomSeverity === 'MODERATE'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {chk.symptomSeverity}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Doctor Reviewed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Reported Symptoms</span>
                    <p className="text-slate-200 mt-0.5">{chk.reportedSymptoms.join('; ')}</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Peak Flow / Spirometry</span>
                    <p className="text-slate-200 mt-0.5 font-mono">{chk.peakFlowOrSpirometry}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 italic">
                  Patient Journal: "{chk.patientNotes}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: CARE-PLAN & AI COMPARISON */}
      {activeTab === 'careplan' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" /> Care-Plan Directives & Non-Overwrite Hierarchy
              </h3>
              <p className="text-xs text-slate-400">
                Authoritative doctor instructions and supervised AI assistive recommendations.
              </p>
            </div>
            <button
              onClick={() => setEditorOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Edit Care Plan</span>
            </button>
          </div>

          {/* Explanation of Non-Overwrite Governance */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Clinical Directive Supremacy Policy
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Platform safety rule: <strong>Doctor instructions must not be silently overwritten by AI-generated plans</strong>.
              When an attending physician enters recommendations or care plans, a cryptographic lock is applied.
              Any algorithmically generated lifestyle suggestions are flagged as secondary and cannot contradict or replace doctor instructions.
            </p>
          </div>

          {latestDoctorNote && (
            <div className="p-5 bg-slate-950 rounded-2xl border-2 border-emerald-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  Active Signed Directive (Hash: {latestDoctorNote.signatureHash.substring(0, 16)}...)
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Updated: {new Date(latestDoctorNote.updatedAt).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {latestDoctorNote.carePlanInformation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Editor Modal */}
      {editorOpen && (
        <DoctorCarePlanEditor
          patientId={patient.id}
          patientName={patient.name}
          doctor={doctor}
          existingNote={latestDoctorNote}
          onSaveNote={onUpdateDoctorNote}
          onClose={() => setEditorOpen(false)}
        />
      )}

    </div>
  );
};
