import React from 'react';
import { TrendingUp, Activity, Wind, Moon, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TrendsViewProps {
  isMobile?: boolean;
  onNavigateToAnalytics?: () => void;
}

export const TrendsView: React.FC<TrendsViewProps> = ({ isMobile, onNavigateToAnalytics }) => {
  const weeklyData = [
    { day: 'Mon', hrv: 62, aqi: 45, sleep: 7.8, note: 'Normal' },
    { day: 'Tue', hrv: 58, aqi: 68, sleep: 7.4, note: 'Moderate AQI' },
    { day: 'Wed', hrv: 44, aqi: 142, sleep: 6.2, note: 'PM2.5 Spike • Low HRV' },
    { day: 'Thu', hrv: 50, aqi: 95, sleep: 6.9, note: 'Recovery' },
    { day: 'Fri', hrv: 60, aqi: 52, sleep: 8.1, note: 'Optimal' },
    { day: 'Sat', hrv: 65, aqi: 38, sleep: 8.5, note: 'Clean Air' },
    { day: 'Sun', hrv: 58, aqi: 68, sleep: 7.8, note: 'Current' },
  ];

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-6xl mx-auto'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              Longitudinal Health & Atmospheric Trends
            </h2>
            <p className="text-xs text-slate-400">
              Evaluating multi-day autonomic stress curves versus ambient pollution
            </p>
          </div>
        </div>

        {onNavigateToAnalytics && (
          <button
            onClick={onNavigateToAnalytics}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Open Health Analytics</span>
          </button>
        )}
      </div>

      {/* Hero Correlation Finding */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Clinical Correlation Discovery (30-Day Cohort)
          </span>
          <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
            <ArrowDownRight className="w-4 h-4" /> -18% HRV on High AQI Days
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          On days when ambient particulate matter (PM2.5) exceeded 25 µg/m³, your heart rate variability (HRV) dipped from a baseline of 62ms down to 44ms, indicating compensatory sympathetic activation.
        </p>

        {/* 7-Day Visual Bars Comparison */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-3">
            <span>7-Day HRV vs AQI Progression</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400 text-[11px]"><span className="w-2 h-2 bg-emerald-500 rounded-sm"></span> HRV (ms)</span>
              <span className="flex items-center gap-1 text-amber-400 text-[11px]"><span className="w-2 h-2 bg-amber-500 rounded-sm"></span> AQI Level</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex flex-col items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-300 mb-2">{d.day}</span>
                
                {/* Bar heights */}
                <div className="h-24 w-full flex items-end justify-center gap-1.5 py-1">
                  <div
                    style={{ height: `${(d.hrv / 70) * 100}%` }}
                    className="w-2.5 rounded-t-sm bg-emerald-500"
                    title={`HRV: ${d.hrv} ms`}
                  ></div>
                  <div
                    style={{ height: `${(d.aqi / 150) * 100}%` }}
                    className={`w-2.5 rounded-t-sm ${d.aqi > 100 ? 'bg-rose-500' : 'bg-amber-500'}`}
                    title={`AQI: ${d.aqi}`}
                  ></div>
                </div>

                <span className="text-[10px] text-slate-400 mt-2 font-mono">{d.hrv}ms</span>
                <span className={`text-[9px] font-bold mt-0.5 ${d.aqi > 100 ? 'text-rose-400' : 'text-slate-500'}`}>
                  {d.aqi} AQI
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
