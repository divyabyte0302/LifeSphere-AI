import React, { useState } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  Heart,
  Wind,
  Activity,
  Calendar,
  AlertTriangle,
  Lock,
  Clock,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { DoctorPatientRecord, DoctorProfile } from '../../types/doctor';

interface DoctorPatientListViewProps {
  doctor: DoctorProfile;
  patientRecords: Record<string, DoctorPatientRecord>;
  onSelectPatient: (patientId: string) => void;
  onOpenAuthorizationManager: () => void;
}

export const DoctorPatientListView: React.FC<DoctorPatientListViewProps> = ({
  doctor,
  patientRecords,
  onSelectPatient,
  onOpenAuthorizationManager,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Critical Mandate: "Doctors must only see patients who have explicitly authorized access."
  const authorizedPatients = Object.values(patientRecords).filter(
    (record) => record.authorization.status === 'AUTHORIZED'
  );

  const filteredPatients = authorizedPatients.filter((r) => {
    const q = searchQuery.toLowerCase();
    const cond = (r.patient.primaryCondition || r.patient.chronicConditions.join(' ')).toLowerCase();
    return (
      r.patient.name.toLowerCase().includes(q) ||
      r.patient.id.toLowerCase().includes(q) ||
      cond.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-mono">
              Attending Physician Portal
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              Active Doctor: {doctor.name}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Authorized Clinical Patient Cohort
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Doctors must only see patients who have explicitly authorized access. All patient charts below have active, unrevoked consent records.
          </p>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAuthorizationManager}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors shadow-md"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Manage Patient Authorizations</span>
          </button>
        </div>
      </div>

      {/* Strict Privacy Filter Badge */}
      <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-300 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Showing only patients with active consent grants ({authorizedPatients.length} Authorized)</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
          HIPAA § 164.508 Active Filter
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by patient name, MRN, condition..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Patient Cards Grid */}
      {filteredPatients.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Authorized Patients Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No patient records match the current search query or active authorization criteria.
          </p>
          <button
            onClick={onOpenAuthorizationManager}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
          >
            Review Authorization Grants
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPatients.map((rec) => {
            const { patient, vitals, environment, checkups, doctorNotes } = rec;
            const latestNote = doctorNotes[0];

            return (
              <div
                key={patient.id}
                onClick={() => onSelectPatient(patient.id)}
                className="p-5 bg-slate-900 hover:bg-slate-850/80 border-2 border-slate-800 hover:border-emerald-500/50 rounded-3xl transition-all cursor-pointer group shadow-xl space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-black text-white text-base shadow-md group-hover:scale-105 transition-transform">
                      {patient.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-white text-base group-hover:text-emerald-300 transition-colors">
                          {patient.name}
                        </h3>
                        <span className="text-xs text-slate-400">({patient.age}y)</span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">MRN: {patient.id}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    AUTHORIZED
                  </span>
                </div>

                {/* Condition */}
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Primary Diagnosis</span>
                  <span className="text-slate-200 font-semibold">{patient.primaryCondition || patient.chronicConditions[0] || 'Asthma'}</span>
                </div>

                {/* Telemetry Snapshot */}
                <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Resting HR</span>
                    <span className="font-bold text-white">{vitals.heartRate} BPM</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Blood SpO2</span>
                    <span className="font-bold text-emerald-400">{vitals.spO2}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Ambient AQI</span>
                    <span className="font-bold text-cyan-400">{environment.airQualityIndex} AQI</span>
                  </div>
                </div>

                {/* Footer with Doctor Notes Preview */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-400">
                    {latestNote ? (
                      <span className="text-emerald-400 font-medium">
                        Follow-up: {latestNote.followUpDate}
                      </span>
                    ) : (
                      <span>No follow-up scheduled</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Inspect Patient Chart</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
