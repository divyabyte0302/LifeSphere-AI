import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Clock,
  Sparkles,
  Info,
  RotateCcw,
  WifiOff,
  Copy
} from 'lucide-react';

export const PublicEmergencySupport: React.FC = () => {
  const [alertState, setAlertState] = useState<'idle' | 'triggered' | 'confirmed' | 'cancelled' | 'safe'>('idle');
  const [offlineSimulated, setOfflineSimulated] = useState(false);
  const [duplicateSuppressed, setDuplicateSuppressed] = useState(false);

  const handleTriggerAlert = () => {
    setAlertState('triggered');
    setDuplicateSuppressed(false);
  };

  const handleDuplicateTest = () => {
    if (alertState === 'triggered') {
      setDuplicateSuppressed(true);
      setTimeout(() => setDuplicateSuppressed(false), 4000);
    } else {
      setAlertState('triggered');
    }
  };

  return (
    <section id="emergency-support" className="py-20 lg:py-28 bg-slate-900/40 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Clinical Safety Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Emergency Support & Confirmation Protocol
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Never automatically contact emergency services without explicit user confirmation. LifeSphere AI pairs multi-sensor pattern detection with transparent uncertainty disclosures and strict human authorization.
          </p>
        </div>

        {/* Workflow Pipeline Diagram */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 max-w-4xl mx-auto text-xs font-mono text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-3">
            Deterministic Clinical Workflow
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-slate-300">
            <span className="p-2 rounded-xl bg-slate-900 border border-slate-800">Critical Pattern</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-500/30 font-bold">ALERT DETECTED</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 rounded-xl bg-slate-900 border border-slate-800">Show Evidence</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 rounded-xl bg-amber-950/60 text-amber-300 border border-amber-500/30">Explain Uncertainty</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold">User Confirmation</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 rounded-xl bg-slate-900 border border-slate-800">Authorized Action</span>
          </div>
        </div>

        {/* Interactive Emergency Simulator Card */}
        <div className="max-w-3xl mx-auto bg-slate-950 border-2 border-rose-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block font-bold">
                  Clinical Simulator
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Hypoxemic Spike & Arrhythmia Protocol
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOfflineSimulated(!offlineSimulated)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border flex items-center gap-1.5 transition-colors ${
                  offlineSimulated
                    ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>{offlineSimulated ? 'Offline: SMS Fallback' : 'Network: Online'}</span>
              </button>
            </div>
          </div>

          {/* SIMULATION STATES */}
          {alertState === 'idle' && (
            <div className="py-8 text-center space-y-4">
              <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
                Test the safety workflow by triggering a simulated critical biomarker pattern (SpO2 drop &lt; 90% combined with sudden tachycardia).
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleTriggerAlert}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all"
                >
                  Simulate Critical Pattern Detection
                </button>
              </div>
            </div>
          )}

          {alertState === 'triggered' && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              
              {/* ALERT DETECTED BANNER */}
              <div className="p-4 bg-rose-950/40 border-2 border-rose-500 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-rose-300 font-black">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-sm font-mono tracking-wider">ALERT DETECTED</span>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">ID: #ALT-9042</span>
              </div>

              {/* WHY THIS ALERT APPEARED */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-300 block">Why this alert appeared:</span>
                <p className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                  Configured rule triggered: Continuous pulse oximetry recorded arterial SpO2 below 89.4% sustained for &gt; 180 seconds, accompanied by acute sinus tachycardia (114 BPM) while at rest.
                </p>
              </div>

              {/* MEASUREMENTS INVOLVED & TIME */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">SpO2 Reading</span>
                  <span className="text-base font-bold text-rose-400">89.4%</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Resting Heart Rate</span>
                  <span className="text-base font-bold text-amber-400">114 BPM</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Time of Measurements</span>
                  <span className="text-xs font-bold text-white">08:14:22 Local</span>
                </div>
              </div>

              {/* POSSIBLE SIGNIFICANCE */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-300 block">Possible significance:</span>
                <p className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                  Potential acute hypoxemic desaturation or bronchospasm exacerbation. May indicate immediate requirement for rescue bronchodilator or professional clinical evaluation.
                </p>
              </div>

              {/* IMPORTANT: AI UNCERTAINTY NOTICE */}
              <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Important: This is an AI-assisted alert and may be incorrect.</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Sensor displacement, motion artifacts, or cold extremities can trigger false alarms. Verify how you feel physically before confirming emergency action.
                </p>
              </div>

              {duplicateSuppressed && (
                <div className="p-3 bg-indigo-950/50 border border-indigo-500/40 rounded-xl text-xs text-indigo-200 flex items-center gap-2">
                  <Copy className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Duplicate Alert Suppressed: Identical pattern within 10-minute cooldown window.</span>
                </div>
              )}

              {/* THE 3 REQUIRED BUTTONS */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setAlertState('confirmed')}
                  className="w-full sm:flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Confirm Emergency Action</span>
                </button>

                <button
                  onClick={() => setAlertState('cancelled')}
                  className="w-full sm:w-auto py-3 px-5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={() => setAlertState('safe')}
                  className="w-full sm:w-auto py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
                >
                  I'm Safe
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                <button
                  onClick={handleDuplicateTest}
                  className="text-cyan-400 hover:underline"
                >
                  Test Duplicate Alert Suppression
                </button>
                <span>Never auto-dials without confirmation</span>
              </div>

            </div>
          )}

          {alertState === 'confirmed' && (
            <div className="p-6 bg-slate-900 rounded-2xl border border-rose-500/50 text-center space-y-4 animate-in fade-in">
              <CheckCircle2 className="w-10 h-10 text-rose-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Authorized Emergency Action Initiated</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Emergency ICE contact (Sarah Vance, Spouse) alerted via encrypted SMS with GPS coordinates and live biometric passport.
                {offlineSimulated && ' (Offline SMS Fallback Activated Successfully)'}
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 text-left space-y-1">
                <p>alertId: #ALT-9042 • userId: #LS-8842</p>
                <p>confirmedAt: {new Date().toISOString()}</p>
                <p>actionResult: DISPATCHED_AUTHORIZED_ICE</p>
              </div>
              <button
                onClick={() => setAlertState('idle')}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
              >
                Reset Simulator
              </button>
            </div>
          )}

          {alertState === 'cancelled' && (
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-700 text-center space-y-3 animate-in fade-in">
              <XCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Alert Cancelled</h4>
              <p className="text-xs text-slate-400">
                Alert cancelledAt: {new Date().toISOString()}. No emergency contacts contacted. Action recorded in HIPAA audit log.
              </p>
              <button
                onClick={() => setAlertState('idle')}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
              >
                Reset Simulator
              </button>
            </div>
          )}

          {alertState === 'safe' && (
            <div className="p-6 bg-slate-900 rounded-2xl border border-emerald-500/50 text-center space-y-3 animate-in fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">User Confirmed Safe</h4>
              <p className="text-xs text-slate-300">
                Recorded false-positive feedback for sensor calibration. Duplicate alerts suppressed for 10 minutes.
              </p>
              <button
                onClick={() => setAlertState('idle')}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
              >
                Reset Simulator
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
