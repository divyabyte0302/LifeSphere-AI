import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Wind,
  Sun,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2,
  Navigation,
  TreePine,
  AlertTriangle
} from 'lucide-react';
import { SafeRouteOption } from '../../types';
import { DEMO_SAFE_ROUTES } from '../../data/syntheticData';

interface SafeRoutesViewProps {
  isMobile?: boolean;
}

export const SafeRoutesView: React.FC<SafeRoutesViewProps> = ({ isMobile = false }) => {
  const [routes] = useState<SafeRouteOption[]>(DEMO_SAFE_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0].id);
  const [activeWaypointIdx, setActiveWaypointIdx] = useState<number | null>(null);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-7xl mx-auto'}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              Module 11 · Environmental Micro-Routing
            </span>
            <span className="text-[10px] text-slate-500">·</span>
            <span className="text-[11px] text-slate-400">Low-Exposure Navigation</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
            Safe Route Planning & Clean Corridors
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Minimizes particulate and thermal exposure during outdoor travel by comparing micro-climate air quality across path alternatives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>Hyperlocal Dispersion Routing</span>
          </div>
        </div>
      </div>

      {/* Route Options Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {routes.map((route) => {
          const isSelected = route.id === selectedRouteId;

          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500/80 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate max-w-[200px]">
                  {route.title}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-850">
                  <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
                  <span className="text-sm font-bold text-white">{route.durationMinutes} min</span>
                  <span className="text-[10px] text-slate-500 block">{route.totalDistanceKm} km</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-850">
                  <span className="text-[10px] text-slate-400 block uppercase">Avg PM2.5</span>
                  <span className="text-sm font-bold text-cyan-400">{route.averagePm25} µg</span>
                  <span className="text-[10px] text-emerald-400 block">AQI {route.averageAqi}</span>
                </div>
              </div>

              {route.pm25ReductionVsFastestPercent > 0 ? (
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 font-bold flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{route.pm25ReductionVsFastestPercent}% Lower PM2.5 Inhalation</span>
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>High Traffic Pollution Corridor</span>
                </div>
              )}

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {route.advisory}
              </p>
            </div>
          );
        })}
      </div>

      {/* Visual Interactive Safe Corridor Map Simulator */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              Waypoints & Micro-Climate Atmospheric Layers
            </h3>
            <p className="text-xs text-slate-400">
              Selected: <strong className="text-emerald-400">{selectedRoute.title}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400">● Clean (AQI &lt; 50)</span>
            <span className="flex items-center gap-1 text-amber-400">● Moderate (50-100)</span>
            <span className="flex items-center gap-1 text-rose-400">● Unhealthy (&gt; 100)</span>
          </div>
        </div>

        {/* Visual Waypoint Nodes Canvas */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {selectedRoute.waypoints.map((wp, idx) => {
              const isSelected = activeWaypointIdx === idx;
              const aqiColor =
                wp.aqi < 50
                  ? 'border-emerald-500/40 text-emerald-400'
                  : wp.aqi < 80
                  ? 'border-amber-500/40 text-amber-400'
                  : 'border-rose-500/40 text-rose-400';

              return (
                <div
                  key={wp.name}
                  onClick={() => setActiveWaypointIdx(idx)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    isSelected ? 'bg-slate-900 ring-1 ring-cyan-400' : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Step {idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded font-bold border ${aqiColor}`}>
                      AQI {wp.aqi}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-white">{wp.name}</h5>

                  <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                    <div>PM2.5: {wp.pm25} µg/m³</div>
                    <div>Temp: {wp.temperature}°C</div>
                    {wp.hazardNote && (
                      <div className="text-amber-300 text-[10px] font-sans pt-1">
                        ℹ {wp.hazardNote}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-850 text-xs text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TreePine className="w-4 h-4 text-emerald-400" />
              <span>Bio-Climate Canopy Bonus: <strong>-1.8°C lower radiant heat</strong> along protected vegetative corridors</span>
            </span>
            <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              GPS Live Signal Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
