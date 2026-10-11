import React from 'react';
import {
  CloudSun,
  Wind,
  Sun,
  Flower2,
  Thermometer,
  Droplets,
  Volume2,
  Gauge,
  ShieldAlert,
  AlertCircle,
  Clock,
  Compass
} from 'lucide-react';
import { EnvironmentalData } from '../types';

interface EnvironmentViewProps {
  environment: EnvironmentalData;
  isMobile?: boolean;
}

export const EnvironmentView: React.FC<EnvironmentViewProps> = ({ environment, isMobile }) => {
  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-7xl mx-auto'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              Atmospheric & Environmental Station
            </h2>
            <p className="text-xs text-slate-400">
              Station Location: Metropolitan Biosphere Hub (GPS Active)
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-xs text-slate-400">Atmospheric Pressure</div>
          <div className="text-sm font-bold text-white font-mono">{environment.atmosphericPressure} hPa</div>
        </div>
      </div>

      {/* Main AQI Hero Gauge Card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 p-6 shadow-2xl relative overflow-hidden">
        <div className="grid md:grid-cols-3 gap-6 items-center">
          
          {/* Big Gauge Display */}
          <div className="text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Air Quality Index (AQI)
            </span>
            <div className="mt-2 flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-6xl font-black text-amber-400 tracking-tight">
                {environment.airQualityIndex}
              </span>
              <span className="text-base text-slate-400 font-medium">US AQI</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase">
              {environment.airQualityCategory}
            </div>
          </div>

          {/* Biological Impact Summary */}
          <div className="md:col-span-2 space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Physiological Health Advisory
            </h4>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Elevated particulate concentrations (PM2.5: {environment.pm25} µg/m³) exceed WHO 24-hour guidelines.
              Individuals with pre-existing reactive airway disease or asthma should avoid vigorous outdoor workouts.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                Outdoor Mask: Recommended N95
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                Indoor Air Purifier: Recommended High Fan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Pollutant Breakdown Grid */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {/* PM2.5 */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>PM2.5 Fine Particles</span>
            <Wind className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{environment.pm25} <span className="text-xs text-slate-400">µg/m³</span></div>
          <p className="text-[11px] text-amber-400 mt-2">Permeates deep alveolar lung tissue</p>
        </div>

        {/* PM10 */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>PM10 Inhalable Dust</span>
            <Wind className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{environment.pm10} <span className="text-xs text-slate-400">µg/m³</span></div>
          <p className="text-[11px] text-emerald-400 mt-2">Within standard safe envelope</p>
        </div>

        {/* Ground-level Ozone */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Ground-level Ozone (O3)</span>
            <Sun className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">{environment.ozone} <span className="text-xs text-slate-400">ppb</span></div>
          <p className="text-[11px] text-slate-400 mt-2">Photochemical smog derivative</p>
        </div>

        {/* UV Index */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Solar UV Index</span>
            <Sun className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">{environment.uvIndex.toFixed(1)} <span className="text-xs text-slate-400">/ 12</span></div>
          <p className="text-[11px] text-orange-400 mt-2">Burn time: ~30 min without SPF</p>
        </div>
      </div>

      {/* Ambient Microclimate Sensors */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Ambient Temperature</span>
            <div className="text-xl font-bold text-white">{environment.temperature}°C</div>
            <span className="text-[11px] text-slate-500">Thermal Comfort: Neutral</span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Relative Humidity</span>
            <div className="text-xl font-bold text-white">{environment.humidity}%</div>
            <span className="text-[11px] text-emerald-400">Optimal Airway Moisture</span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Acoustic Noise Sensor</span>
            <div className="text-xl font-bold text-white">{environment.noiseDecibels} dB</div>
            <span className="text-[11px] text-slate-500">Quiet Suburban Ambience</span>
          </div>
        </div>
      </div>

      {/* 24-Hour Predictive Hourly AQI Simulation */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            24-Hour Micro-Particulate & AQI Forecast
          </h3>
          <span className="text-xs text-slate-400">Atmospheric Dispersion Simulation</span>
        </div>

        <div className="grid grid-cols-6 gap-2 text-center">
          {[
            { time: '10:00 AM', aqi: 62, status: 'Moderate' },
            { time: '01:00 PM', aqi: 78, status: 'Moderate' },
            { time: '04:00 PM', aqi: 104, status: 'Unhealthy SG' },
            { time: '07:00 PM', aqi: 82, status: 'Moderate' },
            { time: '10:00 PM', aqi: 54, status: 'Moderate' },
            { time: '01:00 AM', aqi: 42, status: 'Good' },
          ].map((slot, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[11px] text-slate-400">{slot.time}</span>
              <div className="text-base font-bold text-white my-1">{slot.aqi}</div>
              <span className={`text-[10px] font-semibold ${slot.aqi > 100 ? 'text-orange-400' : 'text-emerald-400'}`}>
                {slot.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
