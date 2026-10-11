import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Droplets,
  Apple,
  Moon,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Flame,
  Sun
} from 'lucide-react';

export const PublicPersonalizedPlan: React.FC = () => {
  const [activePillar, setActivePillar] = useState<'pacing' | 'hydration' | 'nutrition' | 'sleep'>('pacing');

  const pillars = {
    pacing: {
      title: 'Respiratory & Aerobic Pacing',
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      tag: 'Cardiopulmonary',
      summary: 'Dynamic exercise scheduling matched to diurnal atmospheric quality windows.',
      directives: [
        'Optimal outdoor aerobic window: 06:30 – 08:30 AM before photochemical ozone generation peaks.',
        'If ambient PM2.5 exceeds 25 µg/m³, shift interval training to indoor filtered facilities.',
        'Pre-medicate with prescribed bronchodilator 15 minutes prior to cold-air or high-effort workouts.',
      ],
      clinicalContext: 'Target: Maintain FEV1 > 90% predicted without post-exercise bronchospasm.',
    },
    hydration: {
      title: 'Hydration & Thermal Regulation',
      icon: <Droplets className="w-5 h-5 text-cyan-400" />,
      tag: 'Metabolic & Thermal',
      summary: 'Fluid and electrolyte replenishment dynamically calibrated to ambient heat index.',
      directives: [
        'Baseline water intake: 2.8 Liters / day, expanding by 500 mL per 5°C increase above 25°C ambient temperature.',
        'Include 350 mg sodium and 150 mg magnesium post-endurance to prevent vascular volume contraction.',
        'Monitor urine specific gravity and resting heart rate as secondary dehydration indicators.',
      ],
      clinicalContext: 'Target: Prevent hemoconcentration and nocturnal cardiac strain.',
    },
    nutrition: {
      title: 'Anti-Inflammatory & Antioxidant Nutrition',
      icon: <Apple className="w-5 h-5 text-emerald-400" />,
      tag: 'Cellular Defense',
      summary: 'Nutrient-dense antioxidant protocols designed to counteract particulate oxidative stress.',
      directives: [
        'Daily intake of high-polyphenol foods (wild blueberries, green tea catechins, dark leafy greens).',
        'Omega-3 fatty acids (EPA/DHA 1,500 mg) to modulate bronchial inflammatory cascade.',
        'Magnesium-rich foods (pumpkin seeds, spinach) to support bronchial smooth muscle relaxation.',
      ],
      clinicalContext: 'Target: Mitigate alveolar lipid peroxidation induced by airborne PM2.5.',
    },
    sleep: {
      title: 'Sleep Hygiene & Environmental Shielding',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      tag: 'Circadian Recovery',
      summary: 'Nocturnal allergen barriers and micro-climate temperature optimization.',
      directives: [
        'Engage HEPA air purifier in bedroom 45 minutes prior to sleep on high-air-exchange mode.',
        'Target bedroom thermal ambient between 18.5°C and 19.5°C with 45–50% relative humidity.',
        'Shower and change clothing immediately after late-afternoon outdoor exposure during pollen season.',
      ],
      clinicalContext: 'Target: Preserve nocturnal parasympathetic vagal dominance (HRV > 60 ms).',
    },
  };

  const current = pillars[activePillar];

  return (
    <section id="personalized-plan" className="py-20 lg:py-28 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Tailored Lifestyle Directives</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            The Personalized Health Plan
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Personalized guidance that adapts to who you are, how you feel, and where you walk. LifeSphere AI formulates daily actionable plans across four evidence-supported pillars.
          </p>
        </div>

        {/* 4 Pillars Interactive Tabs & Showcase */}
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Tab Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['pacing', 'hydration', 'nutrition', 'sleep'] as const).map((key) => {
              const p = pillars[key];
              const isSelected = activePillar === key;
              return (
                <button
                  key={key}
                  onClick={() => setActivePillar(key)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/50 shadow-xl shadow-emerald-950/20'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-850">
                      {p.icon}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Pillar</span>
                  </div>
                  <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {p.title}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                    {p.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Detail Card */}
          <div className="bg-slate-900 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  {current.icon}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                    Active Protocol • {current.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {current.title}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850 self-start sm:self-auto">
                Updated Daily based on AQI & Wearables
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {current.summary}
            </p>

            {/* Directives Checklist */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono block">
                Evidence-Based Protocol Guidelines:
              </span>
              <div className="space-y-2.5">
                {current.directives.map((dir, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-850 flex items-start gap-3 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{dir}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Target Goal */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-mono">
                {current.clinicalContext}
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono text-[11px]">
                <ShieldCheck className="w-4 h-4" /> Physician Supervised
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
