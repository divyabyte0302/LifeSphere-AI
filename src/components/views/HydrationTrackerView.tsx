import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Plus,
  Trash2,
  RotateCcw,
  Sun,
  Flame,
  Activity,
  Heart,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  Zap,
  Coffee,
  Apple,
  Sliders,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowLeft,
  Cloud,
  RefreshCw
} from 'lucide-react';
import {
  UserProfile,
  HealthMetrics,
  EnvironmentalData,
  ScreenModule,
  BeverageType,
  BEVERAGE_TYPES,
  HydrationLogEntry
} from '../../types';
import {
  hydrationService,
  calculateDynamicGoal,
  evaluateDehydrationRisk
} from '../../services/hydrationService';

interface HydrationTrackerViewProps {
  user?: Partial<UserProfile> | null;
  vitals?: Partial<HealthMetrics> | null;
  environment?: Partial<EnvironmentalData> | null;
  onNavigate?: (module: ScreenModule) => void;
  showSnackbar?: (msg: string) => void;
}

export const HydrationTrackerView: React.FC<HydrationTrackerViewProps> = ({
  user,
  vitals,
  environment,
  onNavigate,
  showSnackbar,
}) => {
  const [logs, setLogs] = useState<HydrationLogEntry[]>(hydrationService.getTodayLogs());
  const [todayEffective, setTodayEffective] = useState(hydrationService.getTodayTotalEffectiveIntake());
  const [todayRaw, setTodayRaw] = useState(hydrationService.getTodayTotalRawIntake());
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  // Custom logging form state
  const [customVolume, setCustomVolume] = useState<number>(300);
  const [customBeverage, setCustomBeverage] = useState<BeverageType>('water');
  const [customNote, setCustomNote] = useState<string>('');

  // Environmental simulation override for testing dynamic adaptation
  const [simulatedTemp, setSimulatedTemp] = useState<number>(environment?.temperature ?? 27);
  const [simulatedHumidity, setSimulatedHumidity] = useState<number>(environment?.humidity ?? 45);

  const effectiveEnvironment = {
    ...environment,
    temperature: simulatedTemp,
    humidity: simulatedHumidity,
  };

  const activeUid = user?.id || 'LS-8842';
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  useEffect(() => {
    hydrationService.setUserId(activeUid);
    const unsubscribe = hydrationService.subscribe(() => {
      setLogs(hydrationService.getTodayLogs());
      setTodayEffective(hydrationService.getTodayTotalEffectiveIntake());
      setTodayRaw(hydrationService.getTodayTotalRawIntake());
    });
    return unsubscribe;
  }, [activeUid]);

  const dynamicGoal = calculateDynamicGoal(user, vitals, effectiveEnvironment);
  const progressRatio = dynamicGoal.totalGoalMl > 0 ? todayEffective / dynamicGoal.totalGoalMl : 0;
  const percentage = Math.min(150, Math.round(progressRatio * 100));
  const remainingMl = Math.max(0, dynamicGoal.totalGoalMl - todayEffective);
  const risk = evaluateDehydrationRisk(todayEffective, dynamicGoal.totalGoalMl, vitals, effectiveEnvironment);
  const weeklySummaries = hydrationService.getPastWeekSummaries(dynamicGoal.totalGoalMl);

  // Vessel preset quick logs
  const handleLogPreset = (volume: number, label: string, beverage: BeverageType = 'water') => {
    hydrationService.logIntake(volume, beverage, 'quick_preset', label, activeUid);
    if (showSnackbar) {
      showSnackbar(`Logged ${volume} ml (${label}) to Firestore.`);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customVolume <= 0) return;
    const meta = BEVERAGE_TYPES[customBeverage];
    hydrationService.logIntake(
      customVolume,
      customBeverage,
      'custom_entry',
      customNote || `${meta.label}`,
      activeUid
    );
    if (showSnackbar) {
      showSnackbar(`Logged ${customVolume} ml ${meta.label} to Firestore.`);
    }
    setCustomNote('');
    setIsCustomOpen(false);
  };

  const handleDeleteLog = (id: string) => {
    const deleted = hydrationService.deleteLog(id, activeUid);
    if (deleted && showSnackbar) {
      showSnackbar('Hydration entry removed from Firestore.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all logged hydration entries for today in Firestore?')) {
      hydrationService.resetTodayLogs(activeUid);
      if (showSnackbar) {
        showSnackbar('Today\'s hydration logs reset.');
      }
    }
  };

  const handleManualCloudSync = async () => {
    setIsCloudSyncing(true);
    await hydrationService.fetchUserHydration(activeUid);
    setIsCloudSyncing(false);
    if (showSnackbar) {
      showSnackbar(`Synchronized with Firestore: users/${activeUid}/hydration`);
    }
  };

  const getBeverageIcon = (type: BeverageType) => {
    switch (type) {
      case 'electrolyte':
        return <Zap className="w-3.5 h-3.5 text-emerald-400" />;
      case 'coconut_water':
        return <Sparkles className="w-3.5 h-3.5 text-teal-400" />;
      case 'coffee':
        return <Coffee className="w-3.5 h-3.5 text-amber-400" />;
      case 'juice':
        return <Apple className="w-3.5 h-3.5 text-orange-400" />;
      case 'herbal_tea':
        return <Coffee className="w-3.5 h-3.5 text-purple-400" />;
      case 'water':
      default:
        return <Droplets className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Navigation Breadcrumb */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors mr-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
              )}
              <span className="text-xs text-cyan-400 font-medium">Precision Preventive Health</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Environmental Fusion</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Hydration Intelligence & Dynamic Fluid Balance
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Calculates daily fluid targets dynamically adapted to ambient heat, relative humidity, physical exertion,
              and cardiovascular workload.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-[11px] font-mono text-cyan-300">
                <Cloud className="w-3 h-3 text-cyan-400" />
                <span>users/{activeUid}/hydration</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Persistent Realtime Firestore
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleManualCloudSync}
              disabled={isCloudSyncing}
              className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="Synchronize with Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isCloudSyncing ? 'animate-spin' : ''}`} />
              <span>{isCloudSyncing ? 'Syncing...' : 'Sync Firestore'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-900/50 rounded-lg transition-colors flex items-center gap-1.5"
              title="Reset today's logs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Today</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCustomOpen((prev) => !prev)}
              className="px-4 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isCustomOpen ? 'Close Custom Entry' : 'Custom Entry'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Liquid Level Gauge & Intake Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Hero Visualizer: Liquid Fill Cylindrical Gauge */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                Daily Intake Balance
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-slate-300 font-mono tabular-nums">{percentage}% of target</span>
              </div>
            </div>

            {/* Simulated Cylindrical Liquid Vessel */}
            <div className="relative mx-auto my-4 w-44 h-64 rounded-2xl bg-slate-950 border-2 border-slate-700/80 p-1.5 flex flex-col justify-end overflow-hidden shadow-inner">
              {/* Volumetric Graduation Ticks */}
              <div className="absolute inset-y-4 right-2 flex flex-col justify-between text-[10px] font-mono text-slate-500 select-none z-20">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              {/* Animated Liquid Fill */}
              <div
                className="w-full bg-gradient-to-t from-cyan-600 via-sky-500 to-teal-400 rounded-xl transition-all duration-700 relative overflow-hidden shadow-lg"
                style={{ height: `${Math.min(100, Math.max(8, percentage))}%` }}
              >
                {/* Surface Wave Highlight */}
                <div className="absolute top-0 inset-x-0 h-2 bg-white/40 blur-[1px]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50" />
              </div>

              {/* Centered Readout Floating Over Vessel */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-white drop-shadow-md">
                  {todayEffective.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-slate-200 mt-0.5 drop-shadow">
                  of {dynamicGoal.totalGoalMl.toLocaleString()} ml
                </span>
                {remainingMl > 0 ? (
                  <span className="text-[11px] text-cyan-200 font-mono tabular-nums mt-1 drop-shadow">
                    -{remainingMl.toLocaleString()} ml remaining
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-300 font-semibold mt-1 drop-shadow flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Target Achieved
                  </span>
                )}
              </div>
            </div>

            {/* Quick Metrics Sub-row */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-left">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
                <div className="text-[11px] text-slate-400">Total Fluid Volume</div>
                <div className="text-base font-bold font-mono tabular-nums text-slate-100 mt-0.5">
                  {todayRaw.toLocaleString()} ml
                </div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
                <div className="text-[11px] text-slate-400">Logged Logs</div>
                <div className="text-base font-bold font-mono tabular-nums text-cyan-400 mt-0.5">
                  {logs.length} entries
                </div>
              </div>
            </div>
          </div>

          {/* Quick-Tap Intake Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-100">Quick-Tap Intake Vessels</h3>
              <span className="text-xs text-slate-400">1-click direct log</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleLogPreset(150, 'Cup / Small Glass', 'water')}
                className="flex items-center justify-between p-3 bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-700/60 rounded-lg transition-all text-left group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">Small Cup</div>
                  <div className="text-[11px] text-slate-400 font-mono tabular-nums">150 ml</div>
                </div>
                <Plus className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleLogPreset(250, 'Standard Glass', 'water')}
                className="flex items-center justify-between p-3 bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-700/60 rounded-lg transition-all text-left group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">Standard Glass</div>
                  <div className="text-[11px] text-slate-400 font-mono tabular-nums">250 ml</div>
                </div>
                <Plus className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleLogPreset(500, 'Sports Bottle', 'water')}
                className="flex items-center justify-between p-3 bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-700/60 rounded-lg transition-all text-left group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">Sports Bottle</div>
                  <div className="text-[11px] text-slate-400 font-mono tabular-nums">500 ml</div>
                </div>
                <Plus className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleLogPreset(750, 'Thermal Flask', 'water')}
                className="flex items-center justify-between p-3 bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-700/60 rounded-lg transition-all text-left group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">Thermal Flask</div>
                  <div className="text-[11px] text-slate-400 font-mono tabular-nums">750 ml</div>
                </div>
                <Plus className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Custom Entry Drawer / Form */}
          {isCustomOpen && (
            <form onSubmit={handleCustomSubmit} className="bg-slate-900 border border-cyan-800/80 rounded-xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  <span>Custom Beverage Intake</span>
                </h3>
                <span className="text-[11px] text-slate-400">Hydration coefficient applied</span>
              </div>

              {/* Volume Slider & Numeric Input */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                  <span>Fluid Volume (ml)</span>
                  <span className="font-mono tabular-nums font-bold text-cyan-400 text-sm">
                    {customVolume} ml
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={customVolume}
                  onChange={(e) => setCustomVolume(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex gap-2 mt-2">
                  {[100, 200, 350, 500, 750].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCustomVolume(v)}
                      className={`flex-1 py-1 text-[11px] rounded font-mono tabular-nums border transition-colors ${
                        customVolume === v
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {v}ml
                    </button>
                  ))}
                </div>
              </div>

              {/* Beverage Selection */}
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">Beverage Classification</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(BEVERAGE_TYPES) as BeverageType[]).map((type) => {
                    const meta = BEVERAGE_TYPES[type];
                    const isSelected = customBeverage === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setCustomBeverage(type)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs border transition-all ${
                          isSelected
                            ? 'bg-cyan-950/80 border-cyan-500 text-slate-100'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {getBeverageIcon(type)}
                        <div className="truncate">
                          <div className="font-medium truncate">{meta.label}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {meta.hydrationCoefficient}x hydr.
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-slate-300 mb-1">Contextual Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Post-cardio workout, Herbal mint tea..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Effective calculation preview & Submit */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Effective hydration:{' '}
                  <span className="font-mono tabular-nums font-semibold text-cyan-300">
                    {Math.round(customVolume * BEVERAGE_TYPES[customBeverage].hydrationCoefficient)} ml
                  </span>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm"
                >
                  Record Intake
                </button>
              </div>
            </form>
          )}

          {/* Environmental Heat Index Simulator (Demonstrates real-time Dynamic Adaptation) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-100">Live Environmental Adaptation Simulator</h3>
              </div>
              <span className="text-[11px] text-cyan-400 font-medium">Active Calibration</span>
            </div>
            <p className="text-xs text-slate-400">
              Shift ambient conditions to verify how the LifeSphere AI-X engine dynamically recalibrates hydration targets
              to counteract thermal perspiration.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Temperature</span>
                  <span className="font-mono tabular-nums font-semibold text-amber-400">{simulatedTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="42"
                  value={simulatedTemp}
                  onChange={(e) => setSimulatedTemp(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Humidity</span>
                  <span className="font-mono tabular-nums font-semibold text-sky-400">{simulatedHumidity}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="90"
                  value={simulatedHumidity}
                  onChange={(e) => setSimulatedHumidity(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Goal Breakdown, Risk & History (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Dynamic Goal Breakdown Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  Dynamic Goal Calibration Formulation
                </h3>
              </div>
              <span className="text-xs font-mono tabular-nums font-semibold text-cyan-400">
                {dynamicGoal.totalGoalMl.toLocaleString()} ml Total Target
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Daily hydration requirement adapts continuously using biometric weight baseline, ambient temperature
              evaporation, relative humidity deficit, and wearable activity tracking.
            </p>

            <div className="space-y-2.5">
              {/* Factor 1: Weight Baseline */}
              <div className="flex items-center justify-between p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="text-slate-300">
                    Clinical Weight Baseline ({user?.weightKg ?? 74} kg × 35 ml/kg)
                  </span>
                </div>
                <span className="font-mono tabular-nums font-semibold text-slate-200">
                  +{dynamicGoal.baseWeightMl.toLocaleString()} ml
                </span>
              </div>

              {/* Factor 2: Ambient Temperature */}
              <div className="flex items-center justify-between p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-slate-300">
                    Ambient Heat Evaporation Compensation ({simulatedTemp}°C)
                  </span>
                </div>
                <span className="font-mono tabular-nums font-semibold text-amber-400">
                  +{dynamicGoal.temperatureAdjustmentMl} ml
                </span>
              </div>

              {/* Factor 3: Humidity Deficit */}
              <div className="flex items-center justify-between p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span className="text-slate-300">
                    Atmospheric Moisture / Vapor Deficit ({simulatedHumidity}% RH)
                  </span>
                </div>
                <span className="font-mono tabular-nums font-semibold text-sky-400">
                  +{dynamicGoal.humidityAdjustmentMl} ml
                </span>
              </div>

              {/* Factor 4: Activity & Steps */}
              <div className="flex items-center justify-between p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-slate-300">
                    Physical Exertion ({vitals?.stepCount ?? 6420} steps · {vitals?.activeCalories ?? 380} kcal)
                  </span>
                </div>
                <span className="font-mono tabular-nums font-semibold text-emerald-400">
                  +{dynamicGoal.activityAdjustmentMl} ml
                </span>
              </div>

              {/* Factor 5: Vital Strain */}
              {dynamicGoal.vitalStrainAdjustmentMl > 0 && (
                <div className="flex items-center justify-between p-2.5 bg-slate-950/70 border border-rose-900/50 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span className="text-slate-300">
                      Cardiovascular Strain Buffer (HR {vitals?.heartRate ?? 72} bpm)
                    </span>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-rose-400">
                    +{dynamicGoal.vitalStrainAdjustmentMl} ml
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Dehydration & Heat Stress Telemetry Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  Dehydration & Heat-Stress Telemetry
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Calculated Heat Index:</span>
                <span className="text-xs font-mono font-bold text-amber-400">{risk.heatIndexC}°C</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Clinical Risk Classification:</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    risk.riskScore >= 75
                      ? 'text-rose-400 bg-rose-950/60 border border-rose-800'
                      : risk.riskScore >= 50
                      ? 'text-amber-400 bg-amber-950/60 border border-amber-800'
                      : risk.riskScore >= 25
                      ? 'text-sky-400 bg-sky-950/60 border border-sky-800'
                      : 'text-emerald-400 bg-emerald-950/60 border border-emerald-800'
                  }`}
                >
                  {risk.riskCategory} ({risk.riskScore}/100)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {risk.primaryContributingFactor}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-xs text-cyan-300">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                <span>{risk.recommendation}</span>
              </div>
            </div>
          </div>

          {/* 3. 7-Day Hydration History Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  7-Day Hydration Balance History
                </h3>
              </div>
              <span className="text-xs text-slate-400">Daily intake vs calibrated target</span>
            </div>

            <div className="grid grid-cols-7 gap-2 h-44 items-end pt-4 pb-2 border-b border-slate-800">
              {weeklySummaries.map((day, idx) => {
                const heightPct = Math.min(100, Math.round((day.totalIntakeMl / 3500) * 100));
                const isToday = idx === 6;
                return (
                  <div key={day.date} className="flex flex-col items-center h-full justify-end group">
                    <div className="text-[10px] font-mono tabular-nums text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                      {day.totalIntakeMl}ml
                    </div>
                    <div className="w-full max-w-[28px] bg-slate-950 rounded-t-md h-full flex flex-col justify-end p-0.5 overflow-hidden">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-500 ${
                          day.percentage >= 100
                            ? 'bg-emerald-400'
                            : isToday
                            ? 'bg-gradient-to-t from-cyan-600 to-sky-400'
                            : 'bg-cyan-600/80'
                        }`}
                        style={{ height: `${Math.max(10, heightPct)}%` }}
                      />
                    </div>
                    <div className={`text-[11px] font-medium mt-2 ${isToday ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                      {day.dayLabel}
                    </div>
                    <div className="text-[10px] font-mono tabular-nums text-slate-500">
                      {day.percentage}%
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                  <span>Target Achieved (≥100%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
                  <span>Standard Intake</span>
                </div>
              </div>
              <span className="font-mono tabular-nums">7-Day Mean: 2,680 ml/day</span>
            </div>
          </div>

          {/* 4. Today's Intake Log Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  Today's Intake Log Entries
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                {logs.length} logged today
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No hydration entries recorded for today yet. Use the quick-tap presets to log your first drink.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {logs.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-md">
                        {getBeverageIcon(entry.beverageType)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">
                          {entry.notes || BEVERAGE_TYPES[entry.beverageType]?.label || 'Water'}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-mono">
                          <span>{entry.timeFormatted}</span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{entry.source.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono tabular-nums font-bold text-slate-100">
                          +{entry.effectiveMl} ml
                        </div>
                        {entry.effectiveMl !== entry.volumeMl && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            raw: {entry.volumeMl}ml
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteLog(entry.id)}
                        title="Remove entry"
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
