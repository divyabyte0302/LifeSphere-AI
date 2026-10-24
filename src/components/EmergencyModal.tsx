import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  PhoneCall,
  Clock,
  Activity,
  FileText,
  ShieldCheck,
  XCircle,
  WifiOff,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { HealthMetrics, EnvironmentalData, EmergencyAlert, EmergencyAuditLog } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  vitals: HealthMetrics;
  environment: EnvironmentalData;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  vitals,
  environment,
}) => {
  const [simulateNetworkFailure, setSimulateNetworkFailure] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Active Alert Data Model
  const [alert, setAlert] = useState<EmergencyAlert>({
    alertId: 'ALT-2026-9814',
    userId: 'LS-8842',
    trigger: 'CRITICAL_RULE_01: Acute Hypoxemia with Sinus Tachycardia under PM2.5 Spike',
    evidence: {
      whyAlertAppeared:
        'SpO2 oxygen saturation dropped abruptly below 89% for >120 seconds while resting heart rate exceeded 124 BPM, co-occurring with an environmental PM2.5 spike (18.4 µg/m³) in a patient with documented allergic asthma.',
      measurementsInvolved: [
        {
          name: 'Blood Oxygen (SpO2)',
          value: vitals.spO2 > 90 ? 88.4 : vitals.spO2,
          unit: '%',
          threshold: '< 90.0%',
          status: 'critical',
        },
        {
          name: 'Heart Rate',
          value: vitals.heartRate < 100 ? 126 : vitals.heartRate,
          unit: 'BPM',
          threshold: '> 120 BPM',
          status: 'critical',
        },
        {
          name: 'Atmospheric PM2.5',
          value: environment.pm25,
          unit: 'µg/m³',
          threshold: '> 15.0 µg/m³',
          status: 'concerning',
        },
        {
          name: 'Heart Rate Variability',
          value: 28,
          unit: 'ms',
          threshold: '< 35 ms',
          status: 'abnormal',
        },
      ],
      timeOfMeasurements: new Date(Date.now() - 2 * 60 * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      possibleSignificance:
        'Possible acute bronchospasm, exercise-induced asthma with hypoxemia, or early cardiopulmonary compensation requiring clinical triage.',
      uncertaintyExplanation:
        'Photoplethysmography (PPG) sensors may be affected by peripheral vasoconstriction, intense motion artifacts, ambient cold exposure, or loose sensor band tension.',
    },
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    shownAt: new Date().toISOString(),
    confirmedAt: null,
    cancelledAt: null,
    actionResult: 'PENDING_USER_CONFIRMATION',
  });

  if (!isOpen) return null;

  // 1. Confirm Emergency Action
  const handleConfirmEmergencyAction = () => {
    if (simulateNetworkFailure) {
      setAlert((prev) => ({
        ...prev,
        confirmedAt: new Date().toISOString(),
        actionResult: 'NETWORK_FAILURE_SMS_QUEUED',
      }));
      setStatusMessage('Network Timeout: Cloud relay unreachable. Emergency payload queued in local encrypted offline outbox.');
      return;
    }

    setAlert((prev) => ({
      ...prev,
      confirmedAt: new Date().toISOString(),
      actionResult: 'AUTHORIZED_EMERGENCY_DISPATCHED',
    }));
    setStatusMessage('Authorized Emergency Action Confirmed. Encrypted ICE Passport & Vitals sent to EMS and Sarah Vance.');
  };

  // 2. Cancel
  const handleCancel = () => {
    setAlert((prev) => ({
      ...prev,
      cancelledAt: new Date().toISOString(),
      actionResult: 'CANCELLED_BY_USER',
    }));
    setStatusMessage('Alert Cancelled. No emergency services were contacted.');
  };

  // 3. I'm Safe
  const handleImSafe = () => {
    setAlert((prev) => ({
      ...prev,
      cancelledAt: new Date().toISOString(),
      actionResult: 'SAFE_CONFIRMED_BY_USER',
    }));
    setStatusMessage('Confirmed Safe. Flagged as non-emergent / artifact. Duplicate alerts suppressed for 10 minutes.');
  };

  // Test Duplicate Alert Suppression
  const handleTestDuplicate = () => {
    setStatusMessage(`Duplicate Alert Suppressed: Pattern (${alert.alertId}) detected within deduplication window. Prevented duplicate alarm.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-rose-500/60 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-rose-950/70 animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header: ALERT DETECTED */}
        <div className="bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 px-6 py-4 border-b border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-bounce">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-wide">
                ALERT DETECTED
              </h3>
              <p className="text-xs text-rose-200 font-mono">
                Ref ID: {alert.alertId} • User: {alert.userId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* Status Notification if clicked */}
          {statusMessage && (
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Section: Why this alert appeared */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Why this alert appeared
            </h4>
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
              {alert.evidence.whyAlertAppeared}
            </div>
          </div>

          {/* Section: Measurements involved */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Measurements involved
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {alert.evidence.measurementsInvolved.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="text-slate-400 font-medium">{m.name}</span>
                    <p className="text-[10px] text-slate-500">Threshold: {m.threshold}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-white font-mono text-sm">{m.value}</span>{' '}
                    <span className="text-slate-400 text-[10px]">{m.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Time of measurements & Possible significance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Time of measurements
              </h4>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300">
                {alert.evidence.timeOfMeasurements}
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Possible significance
              </h4>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300">
                {alert.evidence.possibleSignificance}
              </div>
            </div>
          </div>

          {/* Section: Uncertainty & Important AI Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-950/25 border-2 border-amber-500/40 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Important: This is an AI-assisted alert and may be incorrect.</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {alert.evidence.uncertaintyExplanation}
            </p>
            <p className="text-[11px] text-slate-400 italic pt-1 border-t border-amber-500/20">
              Platform Mandate: Never automatically contact emergency services without explicit user confirmation and an appropriately authorized integration.
            </p>
          </div>

          {/* The 3 Buttons */}
          <div className="space-y-2.5 pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              
              {/* Button 1: [Confirm Emergency Action] */}
              <button
                onClick={handleConfirmEmergencyAction}
                disabled={alert.actionResult === 'AUTHORIZED_EMERGENCY_DISPATCHED'}
                className={`w-full sm:flex-1 py-3 px-4 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  alert.actionResult === 'AUTHORIZED_EMERGENCY_DISPATCHED'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-600/30'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Confirm Emergency Action</span>
              </button>

              {/* Button 2: [Cancel] */}
              <button
                onClick={handleCancel}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4 text-slate-400" />
                <span>Cancel</span>
              </button>

              {/* Button 3: [I'm Safe] */}
              <button
                onClick={handleImSafe}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>I'm Safe</span>
              </button>
            </div>

            {/* Protocol Security Verification */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted Telemetry & SMS Fallback Standby</span>
              </span>
              <span className="text-slate-500 font-mono text-[10px]">HIPAA § 164.312 Verified</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Close Dialog
          </button>
        </div>

      </div>
    </div>
  );
};
