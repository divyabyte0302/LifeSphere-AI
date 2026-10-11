import React, { useState } from 'react';
import {
  Stethoscope,
  Users,
  ShieldCheck,
  FileText,
  Sliders,
  LogOut,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  UserCheck,
  UserX,
  Clock,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import {
  DoctorProfile,
  PatientAuthorization,
  DoctorPatientRecord,
  DoctorCareNote,
  DoctorAccessAuditLog
} from '../../types/doctor';
import {
  currentDoctor,
  initialAuthorizations,
  initialDoctorPatients,
  initialDoctorAccessAuditLogs
} from '../../services/doctorService';
import { DoctorPatientListView } from './DoctorPatientListView';
import { DoctorPatientDetailView } from './DoctorPatientDetailView';
import { DoctorAuthorizationManager } from './DoctorAuthorizationManager';
import { DoctorAuditLogsView } from './DoctorAuditLogsView';

interface DoctorLayoutProps {
  onExitDoctorPortal: () => void;
  showSnackbar?: (msg: string) => void;
}

export const DoctorLayout: React.FC<DoctorLayoutProps> = ({
  onExitDoctorPortal,
  showSnackbar,
}) => {
  const [doctor] = useState<DoctorProfile>(currentDoctor);
  const [authorizations, setAuthorizations] = useState<PatientAuthorization[]>(initialAuthorizations);
  const [patientRecords, setPatientRecords] = useState<Record<string, DoctorPatientRecord>>(initialDoctorPatients);
  const [auditLogs, setAuditLogs] = useState<DoctorAccessAuditLog[]>(initialDoctorAccessAuditLogs);
  
  const [currentView, setCurrentView] = useState<'patients' | 'patient_detail' | 'authorizations' | 'audit_logs'>('patients');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('LS-8842');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper to log every doctor access: "Every doctor access must be logged."
  const logAccess = (feature: string, patientId: string = 'N/A', patientName: string = 'N/A') => {
    const newLog: DoctorAccessAuditLog = {
      id: `LOG-DOC-${Date.now().toString().slice(-4)}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorNpi: doctor.npi,
      patientId,
      patientName,
      accessedFeature: feature as any,
      timestamp: new Date().toISOString(),
      purposeOfAccess: 'HIPAA Treatment § 164.506: Clinical Patient Care & Decision Support',
      clientIp: '136.24.89.201',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // 1. Select Patient and Log
  const handleSelectPatient = (patientId: string) => {
    const record = patientRecords[patientId];
    if (!record) return;

    // Check if authorized
    if (record.authorization.status !== 'AUTHORIZED') {
      showSnackbar?.('Access Denied: Patient has revoked authorization.');
      return;
    }

    setSelectedPatientId(patientId);
    setCurrentView('patient_detail');
    logAccess('PATIENT_CHART_INSPECT', patientId, record.patient.name);
    showSnackbar?.(`Opened clinical chart for ${record.patient.name}. Access logged.`);
  };

  // 2. Grant Authorization (Simulation for testing controls)
  const handleGrantAuthorization = (patientId: string) => {
    setAuthorizations((prev) =>
      prev.map((a) =>
        a.patientId === patientId
          ? {
              ...a,
              status: 'AUTHORIZED',
              grantedAt: new Date().toISOString(),
              revokedAt: null,
            }
          : a
      )
    );

    setPatientRecords((prev) => {
      if (prev[patientId]) {
        return {
          ...prev,
          [patientId]: {
            ...prev[patientId],
            authorization: {
              ...prev[patientId].authorization,
              status: 'AUTHORIZED',
              grantedAt: new Date().toISOString(),
              revokedAt: null,
            },
          },
        };
      }
      return prev;
    });

    logAccess('GRANT_AUTHORIZATION_ACTION', patientId, patientRecords[patientId]?.patient.name || patientId);
    showSnackbar?.(`Patient ${patientId} granted authorization. Now visible in active cohort.`);
  };

  // 3. Revoke Authorization (Simulation for testing controls)
  const handleRevokeAuthorization = (patientId: string) => {
    setAuthorizations((prev) =>
      prev.map((a) =>
        a.patientId === patientId
          ? {
              ...a,
              status: 'REVOKED',
              revokedAt: new Date().toISOString(),
            }
          : a
      )
    );

    setPatientRecords((prev) => {
      if (prev[patientId]) {
        return {
          ...prev,
          [patientId]: {
            ...prev[patientId],
            authorization: {
              ...prev[patientId].authorization,
              status: 'REVOKED',
              revokedAt: new Date().toISOString(),
            },
          },
        };
      }
      return prev;
    });

    // If currently viewing revoked patient, return to list
    if (selectedPatientId === patientId && currentView === 'patient_detail') {
      setCurrentView('patients');
    }

    logAccess('REVOKE_AUTHORIZATION_ACTION', patientId, patientRecords[patientId]?.patient.name || patientId);
    showSnackbar?.(`Authorization for ${patientId} REVOKED. Patient chart is now restricted.`);
  };

  // 4. Update Doctor Note & Recommendations (Doctor-entered information must not be overwritten by AI)
  const handleUpdateDoctorNote = (newNote: DoctorCareNote) => {
    setPatientRecords((prev) => {
      const existing = prev[newNote.patientId];
      if (!existing) return prev;

      // Add timeline event
      const timelineEvent = {
        id: `EVT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        title: 'Attending Physician Care Plan Directives Updated',
        category: 'CLINICAL_ORDER' as const,
        authorType: 'DOCTOR' as const,
        authorName: doctor.name,
        summary: `Updated recommendations: ${newNote.recommendations[0] || 'Care plan modified'}`,
        details: newNote.careInstructions,
        isDoctorVerified: true,
      };

      return {
        ...prev,
        [newNote.patientId]: {
          ...existing,
          doctorNotes: [newNote, ...existing.doctorNotes.filter((n) => n.id !== newNote.id)],
          timeline: [timelineEvent, ...existing.timeline],
        },
      };
    });

    logAccess('DOCTOR_RECOMMENDATIONS', newNote.patientId, patientRecords[newNote.patientId]?.patient.name || 'Patient');
    showSnackbar?.('Clinical recommendations signed and committed. AI overwrite protections locked.');
  };

  const authorizedCount = authorizations.filter((a) => a.status === 'AUTHORIZED').length;
  const currentPatientRecord = selectedPatientId ? patientRecords[selectedPatientId] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      
      {/* 1. Dedicated Doctor Portal Top Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-md">
        
        {/* Left: Doctor Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white">
                LIFESPHERE <span className="text-emerald-400">CLINICAL</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Doctor Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs md:max-w-md">
              {doctor.name} • {doctor.clinic}
            </p>
          </div>
        </div>

        {/* Center / Right: Navigation buttons */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              setCurrentView('patients');
              logAccess('PATIENT_LIST');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentView === 'patients'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Authorized Patients ({authorizedCount})</span>
          </button>

          {selectedPatientId && currentPatientRecord && currentPatientRecord.authorization.status === 'AUTHORIZED' && (
            <button
              onClick={() => {
                setCurrentView('patient_detail');
                logAccess('PATIENT_CHART_INSPECT', currentPatientRecord.patient.id, currentPatientRecord.patient.name);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'patient_detail'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Chart: {currentPatientRecord.patient.name.split(' ')[0]}</span>
            </button>
          )}

          <button
            onClick={() => {
              setCurrentView('authorizations');
              logAccess('CONSENT_GOVERNANCE_REVIEW');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentView === 'authorizations'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Authorization Controls</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('audit_logs');
              logAccess('AUDIT_LOG_REVIEW');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentView === 'audit_logs'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Access Audit Logs</span>
          </button>
        </div>

        {/* Right Exit Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExitDoctorPortal}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit Doctor Portal</span>
            <span className="sm:hidden">Exit</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2 animate-in fade-in">
          <button
            onClick={() => {
              setCurrentView('patients');
              logAccess('PATIENT_LIST');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left p-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-white flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Authorized Patients ({authorizedCount})</span>
          </button>

          {selectedPatientId && currentPatientRecord && currentPatientRecord.authorization.status === 'AUTHORIZED' && (
            <button
              onClick={() => {
                setCurrentView('patient_detail');
                logAccess('PATIENT_CHART_INSPECT', currentPatientRecord.patient.id, currentPatientRecord.patient.name);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left p-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-white flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>Current Chart: {currentPatientRecord.patient.name}</span>
            </button>
          )}

          <button
            onClick={() => {
              setCurrentView('authorizations');
              logAccess('CONSENT_GOVERNANCE_REVIEW');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left p-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-white flex items-center gap-2"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Authorization & Revocation Controls</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('audit_logs');
              logAccess('AUDIT_LOG_REVIEW');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left p-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-white flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Physician Access Audit Logs</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {currentView === 'patients' && (
          <DoctorPatientListView
            doctor={doctor}
            patientRecords={patientRecords}
            onSelectPatient={handleSelectPatient}
            onOpenAuthorizationManager={() => {
              setCurrentView('authorizations');
              logAccess('CONSENT_GOVERNANCE_REVIEW');
            }}
          />
        )}

        {currentView === 'patient_detail' && currentPatientRecord && (
          <DoctorPatientDetailView
            patientRecord={currentPatientRecord}
            doctor={doctor}
            onUpdateDoctorNote={handleUpdateDoctorNote}
            onLogAccess={(feature, pId, pName) => logAccess(feature, pId, pName)}
            onBackToList={() => {
              setCurrentView('patients');
              logAccess('PATIENT_LIST');
            }}
          />
        )}

        {currentView === 'authorizations' && (
          <DoctorAuthorizationManager
            authorizations={authorizations}
            doctor={doctor}
            onGrantAuthorization={handleGrantAuthorization}
            onRevokeAuthorization={handleRevokeAuthorization}
          />
        )}

        {currentView === 'audit_logs' && (
          <DoctorAuditLogsView logs={auditLogs} doctor={doctor} />
        )}
      </main>

    </div>
  );
};
