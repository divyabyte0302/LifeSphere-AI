import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Plus,
  ArrowRight,
  Sun,
  Flame,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  UserProfile,
  HealthMetrics,
  EnvironmentalData,
  ScreenModule
} from '../../types';
import {
  hydrationService,
  calculateDynamicGoal,
  evaluateDehydrationRisk
} from '../../services/hydrationService';

interface HydrationCardProps {
  user?: Partial<UserProfile> | null;
  vitals?: Partial<HealthMetrics> | null;
  environment?: Partial<EnvironmentalData> | null;
  onNavigateToHydration?: () => void;
  onQuickLogSuccess?: (message: string) => void;
  className?: string;
}

export const HydrationCard: React.FC<HydrationCardProps> = ({
  user,
  vitals,
  environment,
  onNavigateToHydration,
  onQuickLogSuccess,
  className = '',
}) => {
  const [todayIntake, setTodayIntake] = useState(hydrationService.getTodayTotalEffectiveIntake());
  const [logsCount, setLogsCount] = useState(hydrationService.getTodayLogs().length);
  const [isLoggedPulse, setIsLoggedPulse] = useState(false);

  useEffect(() => {
    if (user?.id) {
      hydrationService.setUserId(user.id);
    }
    const unsubscribe = hydrationService.subscribe(() => {
      setTodayIntake(hydrationService.getTodayTotalEffectiveIntake());
      setLogsCount(hydrationService.getTodayLogs().length);
    });
    return unsubscribe;
  }, [user?.id]);

  const dynamicGoal = calculateDynamicGoal(user, vitals, environment);
  const percentage = Math.min(100, Math.round((todayIntake / dynamicGoal.totalGoalMl) * 100));
  const remainingMl = Math.max(0, dynamicGoal.totalGoalMl - todayIntake);
  const risk = evaluateDehydrationRisk(todayIntake, dynamicGoal.totalGoalMl, vitals, environment);

  const handleQuickAdd250 = (e: React.MouseEvent) => {
    e.stopPropagation();
    hydrationService.logIntake(250, 'water', 'quick_preset', 'Quick Glass (+250 ml)', user?.id);
    setIsLoggedPulse(true);
    setTimeout(() => setIsLoggedPulse(false), 800);
    if (onQuickLogSuccess) {
      onQuickLogSuccess('Logged 250 ml pure water.');
    }
  };

  return (
    <div
      onClick={onNavigateToHydration}
      className={`group relative bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-cyan-950/20 ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-950/70 border border-cyan-800/60 rounded-lg text-cyan-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
              Hydration Intelligence
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <span>Dynamic Goal</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{dynamicGoal.totalGoalMl} ml</span>
            </div>
          </div>
        </div>

        {/* Quick +250ml Action */}
        <button
          type="button"
          onClick={handleQuickAdd250}
          title="Quick log 250ml water"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-700/50 hover:border-cyan-500 rounded-lg transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+250 ml</span>
        </button>
      </div>

      {/* Primary Intake Numbers */}
      <div className="flex items-baseline justify-between mt-2 mb-2">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-2xl font-bold font-mono tabular-nums text-slate-100 transition-all ${
              isLoggedPulse ? 'text-cyan-400 scale-105' : ''
            }`}
          >
            {todayIntake.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">/ {dynamicGoal.totalGoalMl.toLocaleString()} ml</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold font-mono tabular-nums text-cyan-400">
          <span>{percentage}%</span>
          {percentage >= 100 && (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />
          )}
        </div>
      </div>

      {/* Progress Bar with Liquid Gradient */}
      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80 mb-3">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Environmental & Dynamic Factors Context Line */}
      <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <span className="text-slate-300">
            {remainingMl > 0 ? `${remainingMl.toLocaleString()} ml remaining` : 'Target reached'}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="truncate text-slate-400">
            {environment?.temperature ? `${environment.temperature}°C ambient` : 'Ambient baseline'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
          <span className="font-medium text-[11px]">View Tracker</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
