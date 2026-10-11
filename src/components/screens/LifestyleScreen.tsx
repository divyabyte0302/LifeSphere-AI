import React from 'react';
import { Moon, Footprints, Flame, Clock, Award, ShieldCheck } from 'lucide-react';
import { HealthMetrics, ScreenModule } from '../../types';

interface LifestyleScreenProps {
  vitals: HealthMetrics;
  setScreen: (module: ScreenModule) => void;
  isMobile?: boolean;
}

export const LifestyleScreen: React.FC<LifestyleScreenProps> = ({ vitals, isMobile }) => {
  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-5xl mx-auto'}`}>
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
          <Moon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base md:text-lg font-bold text-white">Lifestyle & Circadian Telemetry</h2>
          <p className="text-xs text-slate-400">Sleep architecture, step counts, and active caloric burn</p>
        </div>
      </div>

      {/* Sleep Architecture */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase text-slate-400">Nocturnal Sleep Staging</span>
          <span className="text-sm font-bold text-purple-400">{vitals.sleepScore} / 100 Score</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-[11px] text-slate-400 block">Total Duration</span>
            <span className="text-lg font-bold text-white">{vitals.totalSleepHours} hrs</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-[11px] text-purple-400 block">Deep Sleep</span>
            <span className="text-lg font-bold text-white">{vitals.deepSleepHours} hrs</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-[11px] text-cyan-400 block">REM Dreaming</span>
            <span className="text-lg font-bold text-white">{vitals.remSleepHours} hrs</span>
          </div>
        </div>
      </div>

      {/* Daily Steps & Calories */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1.5"><Footprints className="w-4 h-4 text-emerald-400" /> Daily Steps</span>
            <span className="font-mono text-emerald-400">{vitals.stepCount} / 10,000</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(vitals.stepCount / 10000) * 100}%` }}></div>
          </div>
          <span className="text-[11px] text-slate-500 block">Goal: 84% achieved</span>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-400" /> Active Burn</span>
            <span className="font-mono text-orange-400">{vitals.activeCalories} kcal</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
          <span className="text-[11px] text-slate-500 block">Calibrated for baseline metabolic rate</span>
        </div>
      </div>
    </div>
  );
};
