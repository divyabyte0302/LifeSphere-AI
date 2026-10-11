import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  WifiOff,
  Copy,
  Clock,
  Activity,
  FileText,
  PhoneCall,
  RefreshCw,
  Info,
  ShieldCheck,
  MapPin,
  Heart,
  Droplets,
  Wind,
  Check,
  ChevronRight,
  Database
} from 'lucide-react';
import { HealthMetrics, EnvironmentalData, EmergencyAlert, EmergencyAuditLog } from '../types';

interface EmergencySupportViewProps {
  vitals: HealthMetrics;
  environment: EnvironmentalData;
  userId?: string;
  showSnackbar?: (msg: string) => void;
  isMobile?: boolean;
}

export const EmergencySupportView: React.FC<EmergencySupportViewProps> = ({
  vitals,
  environment,
  userId = 'LS-8842',
  showSnackbar,
  isMobile = false,
}) => {
  // Configured Detection Rules
  const [detectionRulesEnabled, setDetectionRulesEnabled] = useState(true);
  const [simulateNetworkFailure, setSimulateNetworkFailure] = useState(false);

  // Active Alert State
  const [currentAlert, setCurrentAlert] = useState<EmergencyAlert | null>(null);
  
  // Storage of Stored Alerts
  const [storedAlerts, setStoredAlerts] = useState<EmergencyAlert[]>([]);

  // Audit Logs (HIPAA Compliance)
  const [auditLogs, setAuditLogs] = useState<EmergencyAuditLog[]>([]);

  // Action status message
  const [actionNotice, setActionNotice] = useState<{
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Active view tab: 'active_alert' | 'rules' | 'stored_records' | 'audit_logs'
  const [activeTab, setActiveTab] = useState<'alert' | 'records' | 'logs'>('alert');

  // Initialize with sample audit log and test pattern
  useEffect(() => {
    // Check initial state
    const initialAlert: EmergencyAlert = {
      alertId: 'ALT-2026-9814',
      userId,
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
            name: 'Heart Rate Variability (SDNN)',
            value: 28,
            unit: 'ms',
            threshold: '< 35 ms (Depressed)',
            status: 'abnormal',
          },
        ],
        timeOfMeasurements: new Date(Date.now() - 3 * 60 * 1000).toLocaleTimeString([], {
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
      shownAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      confirmedAt: null,
      cancelledAt: null,
      actionResult: 'PENDING_USER_CONFIRMATION',
    };

    setCurrentAlert(initialAlert);

    // Initial audit log
    const initialLog: EmergencyAuditLog = {
      id: `AUD-${Date.now()}-01`,
      alertId: initialAlert.alertId,
      userId,
      action: 'EMERGENCY_ALERT_SHOWN',
      timestamp: initialAlert.shownAt,
      details: 'Critical pattern alert displayed to user on screen. Awaiting explicit user confirmation.',
      clientPlatform: isMobile ? 'Android Mobile' : 'Web SaaS',
    };

    setAuditLogs([initialLog]);
  }, [userId, isMobile]);

  // Helper to log audit events
  const addAuditLog = (
    alertId: string,
    action: EmergencyAuditLog['action'],
    details: string
  ) => {
    const newLog: EmergencyAuditLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      alertId,
      userId,
      action,
      timestamp: new Date().toISOString(),
      details,
      clientPlatform: isMobile ? 'Android Mobile' : 'Web SaaS',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // 1. Confirm Emergency Action
  const handleConfirmEmergencyAction = () => {
    if (!currentAlert) return;

    // Test Network Failure condition
    if (simulateNetworkFailure) {
      const updatedAlert: EmergencyAlert = {
        ...currentAlert,
        confirmedAt: new Date().toISOString(),
        actionResult: 'NETWORK_FAILURE_SMS_QUEUED',
        networkSimulatedFailure: true,
      };

      setCurrentAlert(updatedAlert);
      setStoredAlerts((prev) => [updatedAlert, ...prev]);

      addAuditLog(
        currentAlert.alertId,
        'NETWORK_FAILURE_FALLBACK',
        'Cloud telemetry dispatch failed due to simulated network timeout. Encrypted SMS fallback packet queued in local offline outbox for ICE contacts & EMS.'
      );

      setActionNotice({
        type: 'warning',
        message: 'Network timeout: Primary cloud relay failed. Encrypted SOS packet queued locally for offline emergency dispatch.',
      });
      showSnackbar?.('Emergency action queued locally (Network Failure Fallback).');
      return;
    }

    // Normal successful authorized dispatch
    const updatedAlert: EmergencyAlert = {
      ...currentAlert,
      confirmedAt: new Date().toISOString(),
      actionResult: 'AUTHORIZED_EMERGENCY_DISPATCHED',
    };

    setCurrentAlert(updatedAlert);
    setStoredAlerts((prev) => [updatedAlert, ...prev]);

    addAuditLog(
      currentAlert.alertId,
      'EMERGENCY_ACTION_CONFIRMED',
      'User explicitly confirmed emergency action. Transmitted ICE Medical Passport, GPS coordinates, and real-time biometrics to authorized responder integration.'
    );

    setActionNotice({
      type: 'success',
      message: 'Authorized emergency action executed. Emergency services and ICE contacts have been notified with verified credentials.',
    });
    showSnackbar?.('Emergency dispatch authorized and transmitted.');
  };

  // 2. Cancel
  const handleCancelAlert = () => {
    if (!currentAlert) return;

    const updatedAlert: EmergencyAlert = {
      ...currentAlert,
      cancelledAt: new Date().toISOString(),
      actionResult: 'CANCELLED_BY_USER',
    };

    setCurrentAlert(updatedAlert);
    setStoredAlerts((prev) => [updatedAlert, ...prev]);

    addAuditLog(
      currentAlert.alertId,
      'EMERGENCY_ACTION_CANCELLED',
      'User dismissed the alert. Emergency dispatch was aborted. No external services were contacted.'
    );

    setActionNotice({
      type: 'info',
      message: 'Alert cancelled. No emergency services were contacted.',
    });
    showSnackbar?.('Emergency alert cancelled.');
  };

  // 3. I'm Safe (User reports false alarm / felt fine)
  const handleImSafe = () => {
    if (!currentAlert) return;

    const updatedAlert: EmergencyAlert = {
      ...currentAlert,
      cancelledAt: new Date().toISOString(),
      actionResult: 'SAFE_CONFIRMED_BY_USER',
    };

    setCurrentAlert(updatedAlert);
    setStoredAlerts((prev) => [updatedAlert, ...prev]);

    addAuditLog(
      currentAlert.alertId,
      'EMERGENCY_SAFE_CONFIRMED',
      'User confirmed "I\'m Safe". Flagged as non-emergent artifact or transient elevation. Duplicate suppression window activated for 10 minutes.'
    );

    setActionNotice({
      type: 'success',
      message: 'Thank you for confirming. "I\'m Safe" status recorded. Duplicate alerts for this pattern are suppressed.',
    });
    showSnackbar?.('Recorded as Safe. Duplicate alerts suppressed.');
  };

  // TEST: Duplicate Alert Trigger
  const handleTestDuplicateAlert = () => {
    if (!currentAlert) {
      showSnackbar?.('No baseline alert to duplicate.');
      return;
    }

    // Attempting to fire the exact same trigger within suppression window
    addAuditLog(
      currentAlert.alertId,
      'DUPLICATE_ALERT_SUPPRESSED',
      `Duplicate critical pattern (${currentAlert.trigger}) was detected within the 10-minute suppression cooldown. Alert suppressed to prevent patient alarm fatigue.`
    );

    setActionNotice({
      type: 'info',
      message: `Duplicate Alert Suppressed: Identical pattern (${currentAlert.alertId}) detected within deduplication window. Prevented duplicate notification.`,
    });
    showSnackbar?.('Duplicate alert suppressed according to safety rules.');
  };

  // Trigger New Critical Pattern Simulation
  const handleTriggerNewPattern = (patternType: 'hypoxia' | 'bradycardia' | 'cardiac_strain') => {
    const newAlertId = `ALT-${Date.now().toString().slice(-4)}`;
    let triggerName = '';
    let evidence: EmergencyAlert['evidence'];

    if (patternType === 'hypoxia') {
      triggerName = 'CRITICAL_RULE_01: Acute Hypoxemia with Sinus Tachycardia';
      evidence = {
        whyAlertAppeared:
          'Continuous pulse oximeter registered SpO2 drop to 87% accompanied by heart rate accelerating to 132 BPM in ambient PM2.5 of 22 µg/m³.',
        measurementsInvolved: [
          { name: 'SpO2 Oxygen Saturation', value: '87.0', unit: '%', threshold: '< 90%', status: 'critical' },
          { name: 'Heart Rate', value: '132', unit: 'BPM', threshold: '> 120 BPM', status: 'critical' },
          { name: 'Ambient PM2.5', value: '22.4', unit: 'µg/m³', threshold: '> 15 µg/m³', status: 'concerning' },
        ],
        timeOfMeasurements: new Date().toLocaleTimeString(),
        possibleSignificance: 'Severe respiratory compromise or acute asthma exacerbation.',
        uncertaintyExplanation: 'Sensor displacement or cold extremities may contribute to lower PPG reading.',
      };
    } else if (patternType === 'bradycardia') {
      triggerName = 'CRITICAL_RULE_02: Severe Sustained Bradycardia with Hypotension';
      evidence = {
        whyAlertAppeared:
          'Resting heart rate fell to 38 BPM for >3 minutes with estimated blood pressure 88/54 mmHg while inactive.',
        measurementsInvolved: [
          { name: 'Heart Rate', value: '38', unit: 'BPM', threshold: '< 40 BPM', status: 'critical' },
          { name: 'Blood Pressure', value: '88/54', unit: 'mmHg', threshold: '< 90/60 mmHg', status: 'critical' },
          { name: 'Respiratory Rate', value: '10', unit: 'bpm', threshold: '< 12 bpm', status: 'abnormal' },
        ],
        timeOfMeasurements: new Date().toLocaleTimeString(),
        possibleSignificance: 'Significant vagal response, conduction abnormality, or severe drug bradycardia.',
        uncertaintyExplanation: 'Sleeping artifact or intermittent loose sensor contact may falsely register low beats.',
      };
    } else {
      triggerName = 'CRITICAL_RULE_03: Extreme Thermal Cardiac Strain';
      evidence = {
        whyAlertAppeared:
          'Heart rate elevated to 142 BPM sustained while ambient temperature reached 39.2°C and UV Index registered 10.4.',
        measurementsInvolved: [
          { name: 'Heart Rate', value: '142', unit: 'BPM', threshold: '> 130 BPM', status: 'critical' },
          { name: 'Ambient Temp', value: '39.2', unit: '°C', threshold: '> 35°C', status: 'critical' },
          { name: 'UV Radiation Index', value: '10.4', unit: 'UV', threshold: '> 8.0', status: 'critical' },
        ],
        timeOfMeasurements: new Date().toLocaleTimeString(),
        possibleSignificance: 'Risk of heat exhaustion progressing to heat stroke and cardiovascular decompensation.',
        uncertaintyExplanation: 'Active high-intensity exercise may account for heart rate elevation.',
      };
    }

    const alert: EmergencyAlert = {
      alertId: newAlertId,
      userId,
      trigger: triggerName,
      evidence,
      createdAt: new Date().toISOString(),
      shownAt: new Date().toISOString(),
      confirmedAt: null,
      cancelledAt: null,
      actionResult: 'PENDING_USER_CONFIRMATION',
    };

    setCurrentAlert(alert);
    setActionNotice(null);
    addAuditLog(newAlertId, 'EMERGENCY_ALERT_GENERATED', `Pattern matched rule: ${triggerName}`);
    addAuditLog(newAlertId, 'EMERGENCY_ALERT_SHOWN', 'Alert modal presented to patient.');
    showSnackbar?.('New critical pattern detected. Review evidence.');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Mode Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Emergency Support & Response Engine
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                Safety Protocol
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Rule-based critical pattern detection with mandatory user confirmation and audit trails.
            </p>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('alert')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'alert'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Alert
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'records'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Stored Records ({storedAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'logs'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Action Notification Box if any */}
      {actionNotice && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start gap-3 animate-in fade-in ${
            actionNotice.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : actionNotice.type === 'warning'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : actionNotice.type === 'info'
              ? 'bg-sky-950/40 border-sky-500/40 text-sky-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          {actionNotice.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {actionNotice.type === 'warning' && <WifiOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {actionNotice.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
          {actionNotice.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          <div className="flex-1">
            <span className="font-semibold">{actionNotice.message}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-slate-400 hover:text-white"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: ACTIVE ALERT / WORKFLOW VIEW */}
      {activeTab === 'alert' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Alert Card (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            {currentAlert ? (
              <div className="bg-slate-900 border-2 border-rose-500/60 rounded-3xl overflow-hidden shadow-2xl shadow-rose-950/40">
                
                {/* ALERT DETECTED HEADER */}
                <div className="bg-gradient-to-r from-rose-950 via-red-900/60 to-rose-950 px-6 py-5 border-b border-rose-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-bounce">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
                        ALERT DETECTED
                      </h3>
                      <p className="text-xs text-rose-200 font-mono">
                        Ref: {currentAlert.alertId} • User: {currentAlert.userId}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {currentAlert.actionResult === 'PENDING_USER_CONFIRMATION'
                        ? 'AWAITING USER'
                        : currentAlert.actionResult.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  
                  {/* Workflow Guide */}
                  <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between overflow-x-auto gap-2">
                    <span className="text-rose-400 font-bold flex items-center gap-1">1. Critical Pattern</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-amber-400 font-bold flex items-center gap-1">2. Evidence Shown</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-sky-400 font-bold flex items-center gap-1">3. Uncertainty</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-emerald-400 font-bold flex items-center gap-1">4. User Confirmation</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-white font-bold flex items-center gap-1">5. Authorized Action</span>
                  </div>

                  {/* Section 1: Why this alert appeared */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4" /> Why this alert appeared
                    </h4>
                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
                      {currentAlert.evidence.whyAlertAppeared}
                    </div>
                  </div>

                  {/* Section 2: Measurements involved */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4" /> Measurements involved
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentAlert.evidence.measurementsInvolved.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs text-slate-400 font-medium">{m.name}</p>
                            <p className="text-[10px] text-slate-500">Threshold: {m.threshold}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-extrabold font-mono text-white">
                              {m.value}
                            </span>{' '}
                            <span className="text-xs text-slate-400">{m.unit}</span>
                            <div>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                                  m.status === 'critical'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                    : m.status === 'abnormal'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                                }`}
                              >
                                {m.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Time of measurements & Possible significance */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Time of measurements
                      </h4>
                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300">
                        {currentAlert.evidence.timeOfMeasurements}
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Reported: {new Date(currentAlert.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4" /> Possible significance
                      </h4>
                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300">
                        {currentAlert.evidence.possibleSignificance}
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Uncertainty Explanation & Mandatory Disclaimer */}
                  <div className="p-4 rounded-2xl bg-amber-950/20 border-2 border-amber-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs tracking-wide">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Important: This is an AI-assisted alert and may be incorrect.</span>
                    </div>
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      {currentAlert.evidence.uncertaintyExplanation}
                    </p>
                    <p className="text-[11px] text-slate-400 italic pt-1 border-t border-amber-500/20">
                      Standard Clinical Rule: Never automatically contact emergency services without explicit user confirmation and an appropriately authorized integration.
                    </p>
                  </div>

                  {/* Section 5: The Three Required Action Buttons */}
                  <div className="pt-2 border-t border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      
                      {/* Button 1: [Confirm Emergency Action] */}
                      <button
                        onClick={handleConfirmEmergencyAction}
                        disabled={currentAlert.actionResult === 'AUTHORIZED_EMERGENCY_DISPATCHED'}
                        className={`w-full sm:flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                          currentAlert.actionResult === 'AUTHORIZED_EMERGENCY_DISPATCHED'
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-600/30 active:scale-98'
                        }`}
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Confirm Emergency Action</span>
                      </button>

                      {/* Button 2: [Cancel] */}
                      <button
                        onClick={handleCancelAlert}
                        className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs md:text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4 text-slate-400" />
                        <span>Cancel</span>
                      </button>

                      {/* Button 3: [I'm Safe] */}
                      <button
                        onClick={handleImSafe}
                        className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 font-bold text-xs md:text-sm border border-emerald-500/40 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>I'm Safe</span>
                      </button>

                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                      <span>Timestamp: {new Date(currentAlert.shownAt).toLocaleTimeString()}</span>
                      <span>Action Result: <strong className="text-slate-300">{currentAlert.actionResult}</strong></span>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Critical Patterns Active</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  All physiological biomarkers and ambient atmospheric parameters are currently within normal baseline tolerances.
                </p>
                <button
                  onClick={() => handleTriggerNewPattern('hypoxia')}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Simulate Critical Pattern
                </button>
              </div>
            )}
          </div>

          {/* Test & Simulation Sidebar (Span 1) */}
          <div className="space-y-4">
            
            {/* Simulation & Rule Testing Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-400" /> Pattern Testing & QA
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  Sandbox
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Trigger configured rules to evaluate pattern detection, evidence presentation, and authorized action workflow:
              </p>

              {/* Trigger Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => handleTriggerNewPattern('hypoxia')}
                  className="w-full text-left p-3 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-rose-300">Rule 1: Hypoxemic Spike</p>
                    <p className="text-[11px] text-slate-500">SpO2 &lt; 90% + PM2.5 &gt; 18 µg/m³</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => handleTriggerNewPattern('bradycardia')}
                  className="w-full text-left p-3 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-amber-300">Rule 2: Severe Bradycardia</p>
                    <p className="text-[11px] text-slate-500">HR &lt; 40 BPM + Hypotension</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => handleTriggerNewPattern('cardiac_strain')}
                  className="w-full text-left p-3 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-purple-300">Rule 3: Thermal Heat Strain</p>
                    <p className="text-[11px] text-slate-500">HR &gt; 140 BPM + Temp &gt; 39°C</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Network Failure Test Toggle */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Test Network Failure</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulateNetworkFailure}
                      onChange={(e) => {
                        setSimulateNetworkFailure(e.target.checked);
                        showSnackbar?.(
                          e.target.checked
                            ? 'Simulating offline network failure on action confirm.'
                            : 'Network restored to normal online state.'
                        );
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  When enabled, confirms simulate an unreachable cloud gateway and tests the local encrypted SMS fallback queue.
                </p>
              </div>

              {/* Duplicate Alert Test Button */}
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={handleTestDuplicateAlert}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Copy className="w-4 h-4 text-sky-400" />
                  <span>Test Duplicate Alert Suppression</span>
                </button>
                <p className="text-[10px] text-slate-500 mt-1.5 text-center">
                  Verifies suppression within 10-minute cooldown window.
                </p>
              </div>

            </div>

            {/* In Case of Emergency (ICE) Passport Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Authorized Emergency Target
              </h4>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Contact:</span>
                  <span className="text-emerald-400 font-semibold">Sarah Vance (Spouse)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">E.164 Phone:</span>
                  <span className="text-slate-200 font-mono">+1 (555) 019-2834</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">EMS Dispatch:</span>
                  <span className="text-rose-400 font-semibold">Authorized 911 PSAP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Medical Passport:</span>
                  <span className="text-slate-200">O+ Universal • Asthma</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: STORED RECORDS (All alert fields stored) */}
      {activeTab === 'records' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" /> Stored Emergency Alerts
              </h3>
              <p className="text-xs text-slate-400">
                Complete persisted records schema: alertId, userId, trigger, evidence, timestamps, and actionResult.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              Total: {storedAlerts.length}
            </span>
          </div>

          {storedAlerts.length === 0 ? (
            <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800/80">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No past alerts stored yet.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Trigger and action an alert in the "Active Alert" tab to store records.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Alert ID</th>
                    <th className="py-3 px-4">User ID</th>
                    <th className="py-3 px-4">Trigger</th>
                    <th className="py-3 px-4">Created At</th>
                    <th className="py-3 px-4">Shown At</th>
                    <th className="py-3 px-4">Confirmed At</th>
                    <th className="py-3 px-4">Cancelled At</th>
                    <th className="py-3 px-4">Action Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {storedAlerts.map((record, index) => (
                    <tr key={index} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-rose-400">{record.alertId}</td>
                      <td className="py-3 px-4 text-slate-300">{record.userId}</td>
                      <td className="py-3 px-4 font-sans text-slate-200 max-w-xs truncate">
                        {record.trigger}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(record.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(record.shownAt).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 text-emerald-400">
                        {record.confirmedAt ? new Date(record.confirmedAt).toLocaleTimeString() : '—'}
                      </td>
                      <td className="py-3 px-4 text-amber-400">
                        {record.cancelledAt ? new Date(record.cancelledAt).toLocaleTimeString() : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            record.actionResult === 'AUTHORIZED_EMERGENCY_DISPATCHED'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : record.actionResult === 'SAFE_CONFIRMED_BY_USER'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : record.actionResult === 'NETWORK_FAILURE_SMS_QUEUED'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {record.actionResult}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AUDIT LOGS (HIPAA Compliance § 164.312(b)) */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" /> HIPAA Emergency Audit Trail
              </h3>
              <p className="text-xs text-slate-400">
                Immutable chronological log of pattern triggers, presentations, explicit user confirmations, and network fallbacks.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              {auditLogs.length} Events Logged
            </span>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-white">{log.action}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {log.alertId}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-sky-400 border border-sky-500/20">
                        {log.clientPlatform}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{log.details}</p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
