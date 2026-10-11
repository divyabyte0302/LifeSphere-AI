import React, { useState } from 'react';
import {
  ClipboardCheck,
  TrendingDown,
  TrendingUp,
  Activity,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Lock,
  FileText,
  AlertCircle
} from 'lucide-react';

export const PublicMonthlyCheckup: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<'sept' | 'aug' | 'july'>('sept');

  const checkupHistory = {
    sept: {
      date: 'September 15, 2026',
      score: '22 / 25',
      status: 'Well-Controlled (GINA Tier 1)',
      statusColor: 'text-emerald-400',
      peakFlow: '520 L/min (93% Predicted)',
      rescueUsage: '1 puff per week (Decreased from 3)',
      nocturnalAwakenings: '0 in last 30 days',
      trajectory: '+12% Improvement over August',
      doctorNotes: 'Dr. Sarah Vance, MD reviewed and signed: "Maintain current Budesonide/Formoterol dose. Excellent progress."',
    },
    aug: {
      date: 'August 14, 2026',
      score: '19 / 25',
      status: 'Partially Controlled (GINA Tier 2)',
      statusColor: 'text-amber-400',
      peakFlow: '480 L/min (86% Predicted)',
      rescueUsage: '3 puffs per week during high humidity',
      nocturnalAwakenings: '1 episode during wildfire alert',
      trajectory: '+5% over July baseline',
      doctorNotes: 'Advised pre-treatment before morning runs when AQI exceeds 50.',
    },
    july: {
      date: 'July 15, 2026',
      score: '17 / 25',
      status: 'Moderate Control Need',
      statusColor: 'text-orange-400',
      peakFlow: '450 L/min (80% Predicted)',
      rescueUsage: '5 puffs per week',
      nocturnalAwakenings: '3 episodes related to birch pollen',
      trajectory: 'Initial Baseline Assessment',
      doctorNotes: 'Initiated SMART protocol controller therapy.',
    },
  };

  const activeCheckup = checkupHistory[selectedMonth];

  return (
    <section id="monthly-checkup" className="py-20 lg:py-28 bg-slate-900/50 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* SECTION 8: MONTHLY CHECK-UP HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-wider font-bold">
            <ClipboardCheck className="w-4 h-4 text-purple-400" />
            <span>Structured Clinical Assessment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            The Monthly Check-Up Routine
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every 30 days, LifeSphere AI guides you through a rapid, validated symptom inventory. Comparing peak expiratory flow, rescue inhaler frequency, and nocturnal symptoms yields a measurable control index.
          </p>
        </div>

        {/* SECTION 8 & 9 INTERACTIVE CHECK-UP DISPLAY */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Month Selector & Trajectory */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Month-over-Month Assessments
            </span>

            {(['sept', 'aug', 'july'] as const).map((mKey) => {
              const item = checkupHistory[mKey];
              const isSelected = selectedMonth === mKey;
              return (
                <div
                  key={mKey}
                  onClick={() => setSelectedMonth(mKey)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-purple-500/50 shadow-xl'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{item.date.split(',')[0]}</span>
                    <span className="font-mono text-xs font-bold text-purple-400">{item.score}</span>
                  </div>
                  <span className={`text-xs font-semibold block mt-1 ${item.statusColor}`}>
                    {item.status.split('(')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    {item.trajectory}
                  </span>
                </div>
              );
            })}

            {/* SECTION 9 SUMMARY CALLOUT: POST CHECK-UP UPDATES */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Post Check-Up Engine
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Immediately upon check-up submission, LifeSphere AI triggers 4 automated updates across your profile and clinical care team.
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Check-up Data & Post Updates */}
          <div className="lg:col-span-8 bg-slate-950 border-2 border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block">
                  Clinical Scorecard • ACT Protocol
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Check-Up Record: {activeCheckup.date}
                </h3>
              </div>

              <div className="text-right font-mono">
                <span className="text-2xl font-black text-purple-400 block">{activeCheckup.score}</span>
                <span className="text-[10px] text-slate-500">Asthma Control Test</span>
              </div>
            </div>

            {/* Checkup Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Peak Flow (PEF)</span>
                <span className="text-sm font-bold text-white">{activeCheckup.peakFlow}</span>
              </div>
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Rescue Inhaler Frequency</span>
                <span className="text-sm font-bold text-amber-400">{activeCheckup.rescueUsage}</span>
              </div>
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Nocturnal Symptoms</span>
                <span className="text-sm font-bold text-emerald-400">{activeCheckup.nocturnalAwakenings}</span>
              </div>
            </div>

            {/* SECTION 9: POST CHECK-UP UPDATES BREAKDOWN */}
            <div id="post-checkup" className="pt-4 border-t border-slate-800 space-y-3 scroll-mt-24">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                Post Check-Up Automated Synchronizations:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Risk Recalibration</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Composite clinical risk factor updated to {activeCheckup.status}. Wearable threshold buffers adapt accordingly.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-cyan-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Trajectory Plotting</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Month-over-month delta plotted into your longitudinal health trend vault for historical comparison.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-indigo-400">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Physician Notification</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Summary auto-routed to authorized attending doctor for review and clinical sign-off.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Non-Overwrite Lock</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Physician directives remain authoritative and cannot be silently replaced by AI algorithms.
                  </p>
                </div>
              </div>
            </div>

            {/* Doctor Verification Stamp */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-xs">
              <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Physician Directive Signature:</span>
                <p className="text-emerald-200/90 text-[11px] mt-0.5">
                  {activeCheckup.doctorNotes}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
