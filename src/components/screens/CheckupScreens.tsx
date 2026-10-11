import React, { useState } from 'react';
import {
  Stethoscope,
  CheckCircle2,
  Calendar,
  Activity,
  ArrowRight,
  TrendingUp,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { HealthMetrics, EnvironmentalData, ScreenModule, CheckupComparisonData } from '../../types';
import { firebaseSyncService } from '../../services/firebaseSyncService';

interface CheckupScreensProps {
  type: 'checkup' | 'post_checkup' | 'checkup_comparison';
  vitals: HealthMetrics;
  environment: EnvironmentalData;
  setScreen: (module: ScreenModule) => void;
  showSnackbar: (msg: string) => void;
  isMobile?: boolean;
}

export const CheckupScreens: React.FC<CheckupScreensProps> = ({
  type,
  vitals,
  environment,
  setScreen,
  showSnackbar,
  isMobile,
}) => {
  // Checkup Questionnaire state
  const [step, setStep] = useState(1);
  const [chestWheeze, setChestWheeze] = useState<'none' | 'mild' | 'moderate'>('mild');
  const [inhalerPuffs, setInhalerPuffs] = useState('2');
  const [morningCough, setMorningCough] = useState(false);
  const [completed, setCompleted] = useState(false);

  const comparisonData: CheckupComparisonData[] = [
    { metric: 'Resting Heart Rate', previousMonth: '68 BPM', currentMonth: '64 BPM', delta: '-4 BPM', trend: 'improved' },
    { metric: 'Arterial SpO2', previousMonth: '97.2%', currentMonth: '98.4%', delta: '+1.2%', trend: 'improved' },
    { metric: 'Heart Rate Variability (HRV)', previousMonth: '51 ms', currentMonth: '58 ms', delta: '+7 ms', trend: 'improved' },
    { metric: 'High AQI Wheezing Days', previousMonth: '6 Days', currentMonth: '2 Days', delta: '-4 Days', trend: 'improved' },
    { metric: 'Sleep Quality Score', previousMonth: '81 / 100', currentMonth: '86 / 100', delta: '+5 pts', trend: 'improved' },
    { metric: 'Montelukast Adherence', previousMonth: '84%', currentMonth: '96%', delta: '+12%', trend: 'improved' },
  ];

  if (type === 'checkup_comparison') {
    return (
      <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-5xl mx-auto'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                Month-over-Month Check-up Comparison
              </h2>
              <p className="text-xs text-slate-400">
                August vs. September 2026 clinical biomarker trajectories
              </p>
            </div>
          </div>

          <button
            onClick={() => setScreen('dashboard')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Comparison Table Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Clinical Marker</span>
            <div className="flex gap-8 font-mono">
              <span className="w-20 text-right">Aug 2026</span>
              <span className="w-20 text-right text-emerald-400 font-bold">Sept 2026</span>
              <span className="w-16 text-right">Delta</span>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {comparisonData.map((row, i) => (
              <div key={i} className="p-4 flex justify-between items-center text-xs">
                <span className="font-semibold text-white">{row.metric}</span>
                <div className="flex gap-8 font-mono">
                  <span className="w-20 text-right text-slate-400">{row.previousMonth}</span>
                  <span className="w-20 text-right text-white font-bold">{row.currentMonth}</span>
                  <span className="w-16 text-right text-emerald-400 font-bold">{row.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Interpretation */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-emerald-400 block mb-1">Physician Consensus Note:</span>
          Marked improvement in autonomic vagal tone (+7ms HRV) and reduction in bronchospasm episodes despite persistent September particulate haze. Continued adherence to nighttime leukotriene blockade (Montelukast 10mg) and indoor air filtration is strongly recommended.
        </div>
      </div>
    );
  }

  if (type === 'post_checkup') {
    return (
      <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-4xl mx-auto'}`}>
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 text-center space-y-2 shadow-2xl">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Monthly Check-up Verified</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Your physiological markers and respiratory symptom score for September 2026 have been evaluated by LifeSphere Clinical Engine.
          </p>
        </div>

        {/* Updated Directives */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            Calibrated Post-Checkup Directives
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-0.5">1. Prescription Continuity</span>
              <span className="text-slate-300">Continue Montelukast 10mg nightly at 09:00 PM. No dosage escalation required.</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-0.5">2. Environmental Shielding</span>
              <span className="text-slate-300">Maintain bedroom HEPA filtration on days when hyperlocal AQI exceeds 60.</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-purple-400 font-bold block mb-0.5">3. Next Scheduled Evaluation</span>
              <span className="text-slate-300">October 02, 2026 (Scheduled automated check-in).</span>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              onClick={() => setScreen('checkup_comparison')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>View Month-over-Month Comparison</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScreen('dashboard')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Monthly Check-up Flow
  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-4xl mx-auto'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              Monthly Health-Environment Check-up
            </h2>
            <p className="text-xs text-slate-400">
              Correlating monthly symptoms, vitals and ambient particulate exposure
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Step 1: Verify Current Physiological Vitals</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-slate-400 block text-[10px]">Heart Rate</span>
                <span className="text-base font-bold text-white">{vitals.heartRate} BPM</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-slate-400 block text-[10px]">Blood Oxygen</span>
                <span className="text-base font-bold text-cyan-400">{vitals.spO2}%</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                <span className="text-base font-bold text-white">{vitals.bloodPressure}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-slate-400 block text-[10px]">Avg Ambient AQI</span>
                <span className="text-base font-bold text-amber-400">{environment.airQualityIndex}</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Confirm & Proceed</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Step 2: Respiratory & Airway Assessment</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Have you experienced chest tightness or wheezing during outdoor exertion this month?
                </label>
                <div className="flex gap-2">
                  {(['none', 'mild', 'moderate'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setChestWheeze(lvl)}
                      className={`px-3 py-1.5 rounded-xl capitalize font-semibold ${
                        chestWheeze === lvl ? 'bg-purple-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  How many times did you need your albuterol rescue inhaler this past week?
                </label>
                <input
                  type="number"
                  value={inhalerPuffs}
                  onChange={(e) => setInhalerPuffs(e.target.value)}
                  className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={morningCough}
                  onChange={(e) => setMorningCough(e.target.checked)}
                  className="accent-purple-500"
                />
                <span className="text-slate-300">Waking with morning cough or dry throat.</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={async () => {
                  const origin = isMobile ? 'android' : 'web';
                  const res = await firebaseSyncService.completeCheckup({
                    origin,
                    symptomSeverity: chestWheeze === 'none' ? 'MILD' : chestWheeze === 'mild' ? 'MODERATE' : 'SEVERE',
                    peakFlow: '530 L/min',
                    inhalerPuffsUsed: parseInt(inhalerPuffs) || 2,
                    nocturnalAwakenings: morningCough ? 1 : 0,
                  });
                  showSnackbar(res.message);
                  setScreen('post_checkup');
                }}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Submit & Generate Post Check-up Plan</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
