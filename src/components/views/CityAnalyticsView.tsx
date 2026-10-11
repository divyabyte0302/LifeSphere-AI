import React, { useState } from 'react';
import {
  Building2,
  Activity,
  CloudSun,
  ShieldCheck,
  AlertTriangle,
  Users,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Info,
  Hospital
} from 'lucide-react';
import { CityAnalyticsData, CityWardRisk } from '../../types';
import { DEMO_CITY_ANALYTICS } from '../../data/syntheticData';

interface CityAnalyticsViewProps {
  isMobile?: boolean;
}

export const CityAnalyticsView: React.FC<CityAnalyticsViewProps> = ({
  isMobile = false
}) => {
  const [cityData] = useState<CityAnalyticsData>(DEMO_CITY_ANALYTICS);
  const [selectedWard, setSelectedWard] = useState<CityWardRisk | null>(cityData.wards[0]);

  const getHeatColor = (level: CityWardRisk['heatStressLevel']) => {
    switch (level) {
      case 'Severe':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'High':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Moderate':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-7xl mx-auto'}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              Module 14 · Municipal Epidemiological Intelligence
            </span>
            <span className="text-[10px] text-slate-500">·</span>
            <span className="text-[11px] text-slate-400">Anonymized K-Anonymity (k=50)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
            City-Level Environmental Analytics
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Aggregated spatio-temporal environmental health metrics across municipal districts to guide municipal interventions and hospital surge readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300">
            {cityData.totalMonitorsActive} Active Sensor Nodes
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Strict De-Identification Protocol:</span> All data presented at the municipal tier is aggregated to ward-level spatial buckets with differential privacy and k-anonymity (k &ge; 50). No individual patient trajectories or raw clinical records are accessible.
        </div>
      </div>

      {/* Active Citywide Advisory Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Active Public Health Advisory:</strong> {cityData.activeAdvisory}
          </span>
        </div>
        <span className="text-[10px] font-mono text-amber-400 hidden sm:inline">Updated 2m ago</span>
      </div>

      {/* City Overview KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-mono block">Citywide Avg AQI</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{cityData.cityWideAverageAqi}</span>
            <span className="text-xs text-amber-400 font-mono">Moderate</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">8 Wards Monitored</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-mono block">Citywide Avg Temp</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-cyan-400">{cityData.cityWideAverageTemp}</span>
            <span className="text-xs text-slate-400 font-mono">°C</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Diurnal peak: 26.8°C</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-mono block">Monitored Population</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400">391,000</span>
            <span className="text-xs text-slate-400 font-mono">citizens</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">100% Ward Coverage</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-mono block">Average Hospital Load</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-purple-400">70.8%</span>
            <span className="text-xs text-slate-400 font-mono">capacity</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Surge buffer adequate</span>
        </div>
      </div>

      {/* Ward Breakdown Table & Spatial Heatmap Selector */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            Ward-Level Environmental Vulnerability Matrix
          </h3>
          <span className="text-xs text-slate-400">Click a ward for detailed indicators</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-mono uppercase">
                <th className="pb-3 font-semibold">Ward & Name</th>
                <th className="pb-3 font-semibold">Population</th>
                <th className="pb-3 font-semibold">Current AQI</th>
                <th className="pb-3 font-semibold">PM2.5</th>
                <th className="pb-3 font-semibold">Temp</th>
                <th className="pb-3 font-semibold">Heat Stress</th>
                <th className="pb-3 font-semibold">Vulnerability Index</th>
                <th className="pb-3 font-semibold">Hospital Load</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {cityData.wards.map((ward) => {
                const isSelected = selectedWard?.wardId === ward.wardId;

                return (
                  <tr
                    key={ward.wardId}
                    onClick={() => setSelectedWard(ward)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-800/80 text-white' : 'hover:bg-slate-850 text-slate-300'
                    }`}
                  >
                    <td className="py-3 font-sans font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span>{ward.wardName}</span>
                    </td>
                    <td className="py-3 text-slate-400">{ward.population.toLocaleString()}</td>
                    <td className="py-3">
                      <span
                        className={`font-bold ${
                          ward.aqiCurrent > 100
                            ? 'text-rose-400'
                            : ward.aqiCurrent > 60
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {ward.aqiCurrent}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">{ward.pm25Current} µg</td>
                    <td className="py-3 text-slate-300">{ward.temperatureCurrent}°C</td>
                    <td className="py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getHeatColor(ward.heatStressLevel)}`}>
                        {ward.heatStressLevel}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 text-right font-bold">{ward.vulnerabilityIndex}</span>
                        <div className="w-16 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full ${
                              ward.vulnerabilityIndex > 60
                                ? 'bg-rose-500'
                                : ward.vulnerabilityIndex > 35
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                            style={{ width: `${ward.vulnerabilityIndex}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-400">{ward.hospitalCapacityPercent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Ward Detail Card */}
        {selectedWard && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-cyan-400 uppercase">Selected District Detail</span>
              <h4 className="text-sm font-bold text-white">{selectedWard.wardName}</h4>
              <p className="text-slate-400">
                Population: {selectedWard.population.toLocaleString()} residents · Vulnerability Index: {selectedWard.vulnerabilityIndex}/100.
                {selectedWard.aqiCurrent > 90
                  ? ' High particulate density demands prioritized indoor cooling centers.'
                  : ' Ambient exposures remain well within seasonal baseline tolerances.'}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 font-mono text-right">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">ER Surge Risk</span>
                <span className={`text-base font-bold ${selectedWard.hospitalCapacityPercent > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedWard.hospitalCapacityPercent > 80 ? 'Elevated' : 'Nominal'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
