import React, { useState } from 'react';
import { Apple, Droplets, Plus, Minus, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DietViewProps {
  isMobile?: boolean;
}

export const DietView: React.FC<DietViewProps> = ({ isMobile }) => {
  const [waterMl, setWaterMl] = useState(2100);
  const targetMl = 3000;

  const addWater = (amount: number) => {
    setWaterMl((prev) => Math.min(targetMl + 1000, Math.max(0, prev + amount)));
  };

  const progress = Math.min(100, Math.round((waterMl / targetMl) * 100));

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-5xl mx-auto'}`}>
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/30">
          <Apple className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            Environmental Nutrition & Hydration
          </h2>
          <p className="text-xs text-slate-400">
            Counteracting atmospheric oxidative stress through targeted nutritional interventions
          </p>
        </div>
      </div>

      {/* Hydration Tracker Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 md:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Daily Cellular Hydration Target
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-cyan-400">{waterMl}</span>
              <span className="text-sm text-slate-400">/ {targetMl} mL ({progress}%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addWater(-250)}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-lg border border-slate-700 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => addWater(250)}
              className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+250 mL</span>
            </button>
            <button
              onClick={() => addWater(500)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 transition-colors"
            >
              +500 mL
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-slate-400">
          * Dynamic target adjusted: Outdoor temperature of 23.5°C and low relative humidity elevated your baseline fluid requirement by +500 mL.
        </p>
      </div>

      {/* Antioxidant Protocol for Air Pollutants */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Anti-Particulate Nutritional Defense Protocol
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Inhaled PM2.5 generates reactive oxygen species (ROS) in airway epithelium. Clinical studies demonstrate that key micronutrients upregulate Phase II detoxification enzymes:
        </p>

        <div className="grid gap-3 sm:grid-cols-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs font-bold text-emerald-400 block mb-1">Sulforaphane</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Broccoli sprouts & cruciferous greens activate Nrf2 anti-inflammatory pathway against diesel particulates.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs font-bold text-amber-400 block mb-1">Vitamin C & Quercetin</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Citrus, bell peppers & red onions stabilize mast cells to decrease allergic histamine release.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs font-bold text-cyan-400 block mb-1">Omega-3 EPA/DHA</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Cold-water fish or algae oil reduces autonomic HRV depression induced by ozone exposure.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
