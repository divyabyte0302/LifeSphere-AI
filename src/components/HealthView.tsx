import React, { useEffect, useState } from 'react';
import {
  Heart,
  Activity,
  Droplets,
  Thermometer,
  Gauge,
  Zap,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import { HealthMetrics } from '../types';

interface HealthViewProps {
  vitals: HealthMetrics;
  isMobile?: boolean;
}

export const HealthView: React.FC<HealthViewProps> = ({ vitals, isMobile }) => {
  // Pulse animation state
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-7xl mx-auto'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30">
            <Heart className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              Physiological Vitals & Bio-Telemetry
            </h2>
            <p className="text-xs text-slate-400">
              High-Frequency Continuous Sampling • Clinical Standard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          BLE Sensor Feed Active
        </div>
      </div>

      {/* Real-time ECG Waveform Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Lead II Continuous Electrocardiogram (ECG)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-rose-400">{vitals.heartRate}</span>
              <span className="text-xs text-slate-400 font-mono">BPM (Sinus Rhythm)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <div>
              <span className="text-slate-500 text-[10px] block">HRV (SDNN)</span>
              <span className="text-emerald-400 font-bold">{vitals.hrv} ms</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">RESTING HR</span>
              <span className="text-white font-bold">{vitals.restingHeartRate} BPM</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Q-T INTERVAL</span>
              <span className="text-white font-bold">412 ms</span>
            </div>
          </div>
        </div>

        {/* Animated ECG Grid Graphic */}
        <div className="relative h-28 w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* ECG SVG wave repeating */}
          <svg className="w-full h-20 text-emerald-400 stroke-current fill-none stroke-[2.2]" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path
              d="M0,50 L80,50 L95,35 L110,65 L125,50 L140,50 L150,15 L160,90 L170,40 L185,50 L200,50 
                 L280,50 L295,35 L310,65 L325,50 L340,50 L350,15 L360,90 L370,40 L385,50 L400,50
                 L480,50 L495,35 L510,65 L525,50 L540,50 L550,15 L560,90 L570,40 L585,50 L600,50
                 L680,50 L695,35 L710,65 L725,50 L740,50 L750,15 L760,90 L770,40 L785,50 L800,50
                 L880,50 L895,35 L910,65 L925,50 L940,50 L950,15 L960,90 L970,40 L985,50 L1000,50"
            />
          </svg>

          {/* Sweeping radar scanner */}
          <div className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-emerald-400/20 to-emerald-400/40 pointer-events-none animate-[ping_4s_infinite]"></div>
        </div>
      </div>

      {/* Vital Biomarkers Breakdown */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Blood Oxygen */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Arterial Oxygen (SpO2)</span>
            <Droplets className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{vitals.spO2.toFixed(1)}</span>
            <span className="text-xs text-slate-400">%</span>
          </div>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> High Tissue Oxygenation
          </p>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: `${vitals.spO2}%` }}></div>
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Systemic Blood Pressure</span>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{vitals.bloodPressure}</span>
            <span className="text-xs text-slate-400">mmHg</span>
          </div>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Optimal Range (AHA Guidelines)
          </p>
          <div className="mt-3 text-[11px] text-slate-400 flex justify-between font-mono">
            <span>Systolic: {vitals.systolic}</span>
            <span>Diastolic: {vitals.diastolic}</span>
          </div>
        </div>

        {/* Core Temperature */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Core Body Temperature</span>
            <Thermometer className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{vitals.bodyTemperature}</span>
            <span className="text-xs text-slate-400">°C</span>
          </div>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Normothermic / Afebrile
          </p>
          <div className="mt-3 text-[11px] text-slate-400">
            Circadian Basal Shift: -0.2°C at 04:00 AM
          </div>
        </div>
      </div>

      {/* Autonomic Nervous System & Stress Analysis */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          Autonomic Nervous System & Stress Balance
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
              <span>Allostatic Stress Index</span>
              <span className="text-emerald-400 font-bold">{vitals.stressLevel} / 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div className="bg-gradient-to-r from-emerald-500 to-amber-500 h-2 rounded-full" style={{ width: `${vitals.stressLevel}%` }}></div>
            </div>
            <span className="text-[11px] text-slate-400">
              Low sympathetic dominance. Parasympathetic vagal tone is active.
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
              <span>Respiratory Rate</span>
              <span className="text-cyan-400 font-bold">{vitals.respiratoryRate} bpm</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <span className="text-[11px] text-slate-400">
              Normal resting breathing pattern without hyperventilation.
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
