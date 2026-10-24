import React, { useState } from 'react';
import {
  Heart,
  Droplets,
  Activity,
  Wind,
  Sun,
  Flower2,
  Moon,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Clock,
  Compass,
  CheckCircle2,
  RefreshCw,
  Calendar,
  FileText,
  Pill,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Stethoscope,
  X,
  Plus,
  Info
} from 'lucide-react';
import { HealthMetrics, EnvironmentalData, Recommendation, ScreenModule, Medication, UserProfile } from '../types';
import { HydrationCard } from './hydration/HydrationCard';

interface DashboardViewProps {
  vitals: HealthMetrics;
  environment: EnvironmentalData;
  medications: Medication[];
  recommendations: Recommendation[];
  setScreen: (module: ScreenModule) => void;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  isMobile?: boolean;
  user?: UserProfile;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  vitals,
  environment,
  medications,
  recommendations,
  setScreen,
  onRefresh,
  isRefreshing,
  isMobile = false,
  user,
}) => {
  // Test states for Loading, Empty, and Error
  const [viewState, setViewState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');
  const [dismissAlert, setDismissAlert] = useState(false);

  // Compute taken medications count
  const takenCount = medications.filter((m) => m.isTakenToday).length;
  const totalMeds = medications.length;

  // AQI color computation
  const getAqiBadge = (aqi: number) => {
    if (aqi <= 50) return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', label: 'Good' };
    if (aqi <= 100) return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Moderate' };
    if (aqi <= 150) return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', label: 'Unhealthy for Sensitive Groups' };
    return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', label: 'Unhealthy' };
  };

  const aqiStyle = getAqiBadge(environment.airQualityIndex);

  // Pull-to-refresh handler
  const handlePullRefresh = async () => {
    await onRefresh();
  };

  if (viewState === 'loading') {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="h-6 w-48 bg-slate-800 rounded animate-pulse"></div>
          <button onClick={() => setViewState('normal')} className="text-xs text-emerald-400">Exit Loading State</button>
        </div>
        <div className="h-28 bg-slate-900/60 rounded-3xl border border-slate-800 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse"></div>
          ))}
        </div>
        <div className="h-40 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse"></div>
      </div>
    );
  }

  if (viewState === 'error') {
    return (
      <div className="p-6 text-center max-w-md mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">Sensor Communication Timeout</h3>
        <p className="text-xs text-slate-400">
          Unable to synchronize real-time BLE biometric or atmospheric telemetry. Please check Bluetooth permissions and network connectivity.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setViewState('normal')}
            className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
          >
            Retry Connection
          </button>
          <button
            onClick={() => setViewState('normal')}
            className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
          >
            Use Offline Cache
          </button>
        </div>
      </div>
    );
  }

  if (viewState === 'empty') {
    return (
      <div className="p-6 text-center max-w-md mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <Activity className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">No Telemetry Recorded Yet</h3>
        <p className="text-xs text-slate-400">
          Pair your smartwatch or tap "Log Measurement" below to record your first vital sign.
        </p>
        <button
          onClick={() => setViewState('normal')}
          className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400 transition-colors"
        >
          Sync Health Records
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-7xl mx-auto'}`}>
      
      {/* Live Telemetry Sync Bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live Telemetry Stream Connected</span>
        </span>
        <button
          onClick={handlePullRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Synchronizing...' : 'Sync Telemetry'}</span>
        </button>
      </div>

      {/* 1. Important Alerts (Hazard & Medication Warning) */}
      {!dismissAlert && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-500/40 p-4 shadow-lg flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 border border-amber-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Important Health Alert</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-semibold">Air & Medication</span>
              </div>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                Ambient Air Quality is currently <strong className="text-amber-300">AQI {environment.airQualityIndex} ({environment.airQualityCategory})</strong> with elevated PM2.5. Additionally, your active prescription <em>Doxycycline</em> increases sun photosensitivity during current UV {environment.uvIndex.toFixed(1)}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissAlert(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors shrink-0"
            title="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Overall Life Risk Score & Multi-Horizon Forecasts (Hero Card) */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 p-5 md:p-6 shadow-2xl relative overflow-hidden space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">
                LifeSphere AI-X Preventive Composite Index
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                MODERATE VIGILANCE (SCORE 42)
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Life Risk Score: <span className="text-cyan-400">42</span> <span className="text-base text-slate-400 font-normal">/ 100</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Autonomic compensation is stable (resting HR {vitals.restingHeartRate} BPM, SpO2 {vitals.spO2}%). Risk is predominantly driven by ambient particulate exposure (PM2.5 {environment.pm25} µg/m³) interacting with seasonal pollen allergens.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
            <button
              onClick={() => setScreen('life_risk_score')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <span>Explain Formula</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => setScreen('digital_twin')}
              className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digital Twin</span>
            </button>
            <button
              onClick={() => setScreen('emergency')}
              className="px-3 py-2 bg-rose-600/90 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-rose-600/30"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS Support</span>
            </button>
          </div>
        </div>

        {/* 1h, 6h, 12h, 24h Multi-Horizon Forecast Strip */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Machine-Learning Risk Forecasts (XGBoost Multi-Horizon Ensemble):
            </span>
            <button
              onClick={() => setScreen('ml_prediction')}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
            >
              <span>View Model Weights</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">T + 1 Hour</span>
              <span className="text-base font-bold text-emerald-400 block mt-0.5">32 / 100</span>
              <span className="text-[10px] text-emerald-400">Low Risk (92% conf)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">T + 6 Hours</span>
              <span className="text-base font-bold text-amber-400 block mt-0.5">52 / 100</span>
              <span className="text-[10px] text-amber-300">Moderate Risk (PM2.5 peak)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">T + 12 Hours</span>
              <span className="text-base font-bold text-amber-400 block mt-0.5">44 / 100</span>
              <span className="text-[10px] text-amber-300">Evening Inversion (84% conf)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">T + 24 Hours</span>
              <span className="text-base font-bold text-emerald-400 block mt-0.5">28 / 100</span>
              <span className="text-[10px] text-emerald-400">Low Risk (Rain cleansing)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recent Measurements (Rounded Cards Grid) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm md:text-base font-bold text-white tracking-tight">
              Recent Physiological Measurements
            </h3>
          </div>
          <button
            onClick={() => setScreen('measurements')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'}`}>
          {/* Heart Rate */}
          <div
            onClick={() => setScreen('measurements')}
            className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 p-4 cursor-pointer transition-all"
          >
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Heart Rate</span>
              <Heart className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{vitals.heartRate}</span>
              <span className="text-[11px] text-slate-400 font-mono">BPM</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-1">Resting: {vitals.restingHeartRate} BPM</span>
          </div>

          {/* Blood Pressure */}
          <div
            onClick={() => setScreen('measurements')}
            className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-4 cursor-pointer transition-all"
          >
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Blood Pressure</span>
              <Activity className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{vitals.bloodPressure}</span>
              <span className="text-[11px] text-slate-400 font-mono">mmHg</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-1">Normal Systolic</span>
          </div>

          {/* SpO2 */}
          <div
            onClick={() => setScreen('measurements')}
            className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-4 cursor-pointer transition-all"
          >
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Blood Oxygen</span>
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{vitals.spO2.toFixed(1)}</span>
              <span className="text-[11px] text-slate-400 font-mono">%</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-1">Optimal Saturation</span>
          </div>

          {/* Blood Glucose */}
          <div
            onClick={() => setScreen('measurements')}
            className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-4 cursor-pointer transition-all"
          >
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Blood Glucose</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{vitals.glucose}</span>
              <span className="text-[11px] text-slate-400 font-mono">mg/dL</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-1">Fasting Normal</span>
          </div>

          {/* Body Temperature */}
          <div
            onClick={() => setScreen('measurements')}
            className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-4 cursor-pointer transition-all"
          >
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Core Temp</span>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{vitals.bodyTemperature}</span>
              <span className="text-[11px] text-slate-400 font-mono">°C</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-1">Afebrile</span>
          </div>
        </div>
      </section>

      {/* Hydration Intelligence & Dynamic Target */}
      <section>
        <HydrationCard
          user={user}
          vitals={vitals}
          environment={environment}
          onNavigateToHydration={() => setScreen('hydration')}
        />
      </section>

      {/* 4. Environmental Exposure & 5. Health Trends (Two Column Layout) */}
      <div className="grid md:grid-cols-2 gap-4">
        
        {/* Environmental Exposure */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">Environmental Exposure</h4>
            </div>
            <button
              onClick={() => setScreen('environment')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Details
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className={`p-3 rounded-xl border ${aqiStyle.bg} ${aqiStyle.border}`}>
              <span className="text-[11px] text-slate-400 block">Air Quality Index</span>
              <span className={`text-2xl font-bold ${aqiStyle.text}`}>{environment.airQualityIndex}</span>
              <span className="text-[10px] text-slate-300 block">{aqiStyle.label}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
              <span className="text-[11px] text-slate-400 block">PM2.5 Micro-Dust</span>
              <span className="text-2xl font-bold text-white">{environment.pm25} <span className="text-xs text-slate-400 font-normal">µg/m³</span></span>
              <span className="text-[10px] text-amber-400 block">Mild Airway Irritant</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
              <span className="text-[11px] text-slate-400 block">Solar UV Index</span>
              <span className="text-2xl font-bold text-white">{environment.uvIndex.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 12</span></span>
              <span className="text-[10px] text-orange-400 block">Moderate (SPF 50)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
              <span className="text-[11px] text-slate-400 block">Pollen Count</span>
              <span className="text-2xl font-bold text-white">{environment.pollenCount} <span className="text-xs text-slate-400 font-normal">gr/m³</span></span>
              <span className="text-[10px] text-emerald-400 block">{environment.pollenCategory} Allergen</span>
            </div>
          </div>
        </div>

        {/* Health Trends Micro-Chart */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-bold text-white">Health & AQI Trends (7 Days)</h4>
            </div>
            <button
              onClick={() => setScreen('trends')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Analyze
            </button>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-850">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
              <span>HRV (ms) vs Atmospheric AQI</span>
              <span className="text-[11px] text-emerald-400">Stable Coherence</span>
            </div>
            {/* Visual 7-day sparkline representation */}
            <div className="grid grid-cols-7 gap-1.5 items-end h-20 pt-2">
              {[
                { day: 'M', hrv: 62, aqi: 45 },
                { day: 'T', hrv: 58, aqi: 68 },
                { day: 'W', hrv: 44, aqi: 142 },
                { day: 'T', hrv: 50, aqi: 95 },
                { day: 'F', hrv: 60, aqi: 52 },
                { day: 'S', hrv: 65, aqi: 38 },
                { day: 'S', hrv: 58, aqi: 68 },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    style={{ height: `${(item.hrv / 70) * 48}px` }}
                    className="w-full rounded-t bg-emerald-500/80 hover:bg-emerald-400 transition-colors"
                    title={`HRV: ${item.hrv}ms`}
                  ></div>
                  <span className="text-[10px] text-slate-400 mt-1">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            HRV dipped on Wednesday corresponding with PM2.5 particulate spike. Full autonomic recovery noted Friday.
          </p>
        </div>

      </div>

      {/* 6. Upcoming Monthly Check-up & 7. Medication Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        
        {/* Upcoming Monthly Check-up Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                Upcoming Monthly Check-up
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold uppercase">
                In 4 Days
              </span>
            </div>
            <h4 className="text-base font-bold text-white">October 2026 Comprehensive Evaluation</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Scheduled clinical check-up with AI spirometry review, allergy antigen assessment, and post-checkup prescription calibration.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">Date: Oct 02, 2026</span>
            <button
              onClick={() => setScreen('checkup')}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-purple-600/20"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Start Check-up</span>
            </button>
          </div>
        </div>

        {/* Medication Summary Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-indigo-400" />
                Medication Adherence Today
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                {takenCount} of {totalMeds} Doses Logged
              </span>
            </div>

            {/* Adherence progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${(takenCount / totalMeds) * 100}%` }}
              ></div>
            </div>

            <div className="space-y-1.5 text-xs">
              {medications.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-300 truncate max-w-[200px]">{m.name} ({m.dosage})</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.isTakenToday ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    {m.isTakenToday ? 'Taken' : 'Pending 09:00 PM'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => setScreen('medications')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>Manage Prescriptions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 8. Latest Recommendations & 9. Latest Health Report */}
      <div className="grid md:grid-cols-2 gap-4">
        
        {/* Latest Recommendations Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Latest AI Preventive Recommendations
            </span>
            <button
              onClick={() => setScreen('recommendations')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              All Directives
            </button>
          </div>

          <div className="space-y-2">
            {recommendations.slice(0, 2).map((rec) => (
              <div key={rec.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-850 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{rec.title}</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                    {rec.priority}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Health Report Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-400" />
                Latest Health Report
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                Available
              </span>
            </div>

            <h4 className="text-base font-bold text-white">September 2026 Clinical Synthesis</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              14-page verified clinical summary documenting monthly ECG stability, AQI cross-correlation analysis, and prescription adherence.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">Format: PDF & FHIR HL7</span>
            <button
              onClick={() => setScreen('reports')}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Review Report</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
