import React, { useState } from 'react';
import {
  Calendar,
  Apple,
  CheckCircle2,
  Droplets,
  Wind,
  Sun,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { HealthMetrics, EnvironmentalData, ScreenModule } from '../../types';

interface PlansScreensProps {
  type: 'health_plan' | 'diet_plan';
  vitals: HealthMetrics;
  environment: EnvironmentalData;
  setScreen: (module: ScreenModule) => void;
  showSnackbar: (msg: string) => void;
  isMobile?: boolean;
}

export const PlansScreens: React.FC<PlansScreensProps> = ({
  type,
  vitals,
  environment,
  setScreen,
  showSnackbar,
  isMobile,
}) => {
  const [waterLogged, setWaterLogged] = useState(2100);
  const targetWater = 3000;

  if (type === 'diet_plan') {
    return (
      <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-5xl mx-auto'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/30">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                Personalized Environmental Diet & Hydration Plan
              </h2>
              <p className="text-xs text-slate-400">
                Nutritional defense against particulate oxidative stress and high UV
              </p>
            </div>
          </div>
        </div>

        {/* Hydration Widget */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Dynamic Hydration Goal</span>
              <span className="text-2xl font-bold text-cyan-400">{waterLogged} <span className="text-xs text-slate-400">/ {targetWater} mL</span></span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setWaterLogged((w) => w + 250);
                  showSnackbar('+250 mL hydration logged.');
                }}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold"
              >
                +250 mL
              </button>
              <button
                onClick={() => {
                  setWaterLogged((w) => w + 500);
                  showSnackbar('+500 mL hydration logged.');
                }}
                className="px-3 py-1.5 bg-slate-800 text-cyan-300 rounded-xl text-xs font-semibold border border-slate-700"
              >
                +500 mL
              </button>
            </div>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (waterLogged / targetWater) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            * Calibrated for ambient temp 23.5°C and low relative humidity (52%).
          </p>
        </div>

        {/* Dietary Regimen */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Targeted Anti-Pollutant Meal Guidelines</h3>
          
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-emerald-400">Breakfast</span>
              <h4 className="text-sm font-semibold text-white">Green Tea & Berry Smoothie</h4>
              <p className="text-xs text-slate-400">Rich in EGCG catechins and anthocyanins to protect alveolar capillaries.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-amber-400">Lunch</span>
              <h4 className="text-sm font-semibold text-white">Wild Salmon & Quinoa Bowl</h4>
              <p className="text-xs text-slate-400">Omega-3 fatty acids prevent particulate-triggered autonomic HRV drops.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-purple-400">Dinner</span>
              <h4 className="text-sm font-semibold text-white">Cruciferous Stir-fry</h4>
              <p className="text-xs text-slate-400">Broccoli sprouts activate sulforaphane Nrf2 glutathione synthesis.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Personalized Health Plan
  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-5xl mx-auto'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              Personalized Health & Environmental Plan
            </h2>
            <p className="text-xs text-slate-400">
              Circadian routines synchronized with local particulate and solar cycles
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> 07:00 AM - 08:30 AM
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">Morning Window</span>
          </div>
          <h4 className="text-sm font-bold text-white">Optimal Aerobic Cardio Window</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ambient ground-level ozone and photochemical smog are lowest prior to 09:00 AM. Run on outdoor shaded tracks before temperature exceeds 24°C.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-orange-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" /> 11:30 AM - 03:30 PM
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 font-semibold">Peak UV Index (4.8)</span>
          </div>
          <h4 className="text-sm font-bold text-white">Doxycycline Photosensitivity Shielding</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Avoid direct sunlight exposure. Apply broad-spectrum mineral sunscreen (SPF 50+) and wear UV400 polarized sunglasses when commuting.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-purple-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> 09:00 PM - 10:30 PM
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-semibold">Night Adherence</span>
          </div>
          <h4 className="text-sm font-bold text-white">Montelukast 10mg & Sleep Preparation</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ingest evening dose to prevent nocturnal bronchial constriction. Lower bedroom thermostat to 19°C for delta REM sleep stabilization.
          </p>
        </div>
      </div>
    </div>
  );
};
