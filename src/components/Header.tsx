import React from 'react';
import {
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  AlertTriangle,
  Activity,
  RotateCcw,
  ShieldAlert,
  Stethoscope,
  CheckCircle2,
  X
} from 'lucide-react';
import { ViewMode } from '../types';
import { SyncStatusIndicator } from './sync/SyncStatusIndicator';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onTriggerSos: () => void;
  aqi: number;
  setAqi: (aqi: number) => void;
  heartRate: number;
  setHeartRate: (hr: number) => void;
  onResetSimulation: () => void;
  onClose?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  onTriggerSos,
  aqi,
  setAqi,
  heartRate,
  setHeartRate,
  onResetSimulation,
  onClose,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand logo & platform tags */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Activity className="w-5 h-5 text-slate-950 font-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-sm md:text-base text-white">LIFESPHERE AI</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 font-mono">
                Flutter M3 + Web
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Android Mobile • Responsive Web SaaS • Personal Health & Environmental Intelligence
            </p>
          </div>
        </div>

        {/* Viewport & Platform View Switcher */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
          {/* Public Marketing Website */}
          <button
            onClick={() => setViewMode('public_web')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'public_web'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Public Marketing & Clinical Website (Home, About, Features, Privacy, Contact)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Public Site</span>
          </button>

          {/* Desktop Web */}
          <button
            onClick={() => setViewMode('authenticated_web')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'authenticated_web'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop SaaS Web Layout with Left Sidebar and Top Header"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop Web</span>
          </button>

          {/* Tablet Web */}
          <button
            onClick={() => setViewMode('tablet_web')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'tablet_web'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet Web Layout (Responsive Drawer & Adaptive Cards)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          {/* Mobile Web */}
          <button
            onClick={() => setViewMode('mobile_web')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'mobile_web'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile Web Layout (Drawer & Bottom Navigation)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile Web</span>
          </button>

          {/* Android Native Simulator */}
          <button
            onClick={() => setViewMode('android')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'android'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Android Google Pixel Mobile Simulator"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Android Frame</span>
          </button>

          {/* Secure Admin Web Portal */}
          <button
            onClick={() => setViewMode('admin_portal')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'admin_portal'
                ? 'bg-indigo-600 text-white shadow-md font-bold'
                : 'text-indigo-400 hover:text-indigo-300 hover:bg-slate-900'
            }`}
            title="Secure Admin Web Portal (RBAC, System Monitoring, Least Privilege)"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-bold">Admin Portal</span>
          </button>

          {/* Optional Doctor Portal */}
          <button
            onClick={() => setViewMode('doctor_portal')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'doctor_portal'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-900'
            }`}
            title="Doctor Portal (Patient List, Timeline, Trends, Care Plans, Access Logs)"
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">Doctor Portal</span>
          </button>

          {/* Cross-Platform Automated Test Runner */}
          <button
            onClick={() => setViewMode('cross_platform_test')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'cross_platform_test'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-amber-400 hover:text-amber-300 hover:bg-slate-900'
            }`}
            title="Cross-Platform Test Suite (40 Automated Tests, Pass/Fail Report)"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">Test Suite (40)</span>
          </button>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-3">
          {/* AQI simulation slider */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Simulate AQI:</span>
            <input
              type="range"
              min="20"
              max="220"
              value={aqi}
              onChange={(e) => setAqi(parseInt(e.target.value))}
              className="w-16 h-1.5 bg-slate-700 rounded-lg accent-emerald-500 cursor-pointer"
            />
            <span
              className={`font-mono font-bold ${
                aqi > 150 ? 'text-rose-400' : aqi > 100 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {aqi}
            </span>
          </div>

          {/* Heart rate simulation */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">HR:</span>
            <input
              type="range"
              min="55"
              max="130"
              value={heartRate}
              onChange={(e) => setHeartRate(parseInt(e.target.value))}
              className="w-16 h-1.5 bg-slate-700 rounded-lg accent-rose-500 cursor-pointer"
            />
            <span className="font-mono font-bold text-rose-400">{heartRate} BPM</span>
          </div>

          <button
            onClick={onResetSimulation}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset telemetry simulation to baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Real-time Firebase Sync Status & Last Synchronized */}
          <SyncStatusIndicator />

          {/* Global SOS button */}
          <button
            onClick={onTriggerSos}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs shadow-md shadow-rose-600/30 transition-all active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
            <span>SOS</span>
          </button>

          {/* Close/Hide Header */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              title="Hide this top bar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
