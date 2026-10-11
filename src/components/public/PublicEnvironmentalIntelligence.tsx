import React, { useState } from 'react';
import {
  CloudSun,
  Wind,
  Sun,
  Droplets,
  AlertTriangle,
  Layers,
  Sparkles,
  MapPin,
  ShieldCheck,
  Thermometer,
  Activity
} from 'lucide-react';

export const PublicEnvironmentalIntelligence: React.FC = () => {
  const [selectedSensor, setSelectedSensor] = useState<'pm25' | 'ozone' | 'pollen' | 'uv'>('pm25');

  const sensorDetails = {
    pm25: {
      name: 'Fine Airborne Particulates (PM2.5 & PM10)',
      reading: '18.4 µg/m³',
      category: 'Moderate (Sensitive Threshold)',
      color: 'text-amber-400',
      badgeBg: 'bg-amber-950/40 border-amber-500/30',
      desc: 'Microscopic combustion particles capable of penetrating deep into alveolar pulmonary capillaries, provoking systemic vascular inflammation and bronchial constriction.',
      clinicalImpact: 'LifeSphere AI alerts asthma and cardiovascular patients when regional PM2.5 exceeds 15 µg/m³.',
    },
    ozone: {
      name: 'Tropospheric Ground-Level Ozone (O3)',
      reading: '44 ppb',
      category: 'Approaching Action Threshold',
      color: 'text-orange-400',
      badgeBg: 'bg-orange-950/40 border-orange-500/30',
      desc: 'Formed when industrial emissions and vehicle exhaust react with sunlight. Acts as a powerful pulmonary oxidant, reducing lung elasticity and triggering deep airway irritation.',
      clinicalImpact: 'Automated warnings shift outdoor endurance runs to morning hours before photochemical reaction peaks.',
    },
    pollen: {
      name: 'Allergen Pollen Grain Counts',
      reading: '38 grains/m³',
      category: 'High Birch & Grass Density',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/40 border-emerald-500/30',
      desc: 'Seasonal allergen species breakdown. Real-time pollen traps monitor Tree (Birch/Oak), Grass, and Weed (Ragweed) concentrations.',
      clinicalImpact: 'Syncs with patient allergy profile to advise topical nasal corticosteroid and HEPA filter schedule.',
    },
    uv: {
      name: 'Solar Ultraviolet Radiation (UV Index)',
      reading: '6.2 / 12',
      category: 'High UV Radiation',
      color: 'text-yellow-400',
      badgeBg: 'bg-yellow-950/40 border-yellow-500/30',
      desc: 'Erythemal solar radiation index. Combined with medication photo-safety engine to prevent drug-induced photodermatitis.',
      clinicalImpact: 'Patients taking photosensitizing medications (e.g. Doxycycline, NSAIDs) receive proactive UV shield alerts.',
    },
  };

  const activeSensor = sensorDetails[selectedSensor];

  return (
    <section id="environmental-intelligence" className="py-20 lg:py-28 bg-slate-900/40 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider font-bold">
            <CloudSun className="w-4 h-4 text-amber-400" />
            <span>Hyperlocal Micro-Climate Sensing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Environmental Intelligence
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Your body doesn't exist in a vacuum. LifeSphere AI tracks the air you breathe and the atmosphere you inhabit down to your immediate neighborhood micro-climate.
          </p>
        </div>

        {/* Interactive Environmental Console */}
        <div className="max-w-5xl mx-auto bg-slate-950 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold">
                  Hyperlocal Atmospheric Grid
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Live Sensor Array: North Pavilion District (Elev. 142m)
                </h3>
              </div>
            </div>

            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
              Refreshed: Every 60 Seconds
            </span>
          </div>

          {/* Sensor Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'pm25', label: 'Airborne PM2.5', value: '18.4 µg' },
              { id: 'ozone', label: 'Tropospheric Ozone', value: '44 ppb' },
              { id: 'pollen', label: 'Allergen Pollen', value: '38 gr' },
              { id: 'uv', label: 'Solar UV Index', value: '6.2 / 12' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSelectedSensor(btn.id as any)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedSensor === btn.id
                    ? 'bg-slate-900 border-amber-500/50 shadow-lg'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-slate-400 block font-mono">{btn.label}</span>
                <span className="text-base sm:text-lg font-bold text-white font-mono block mt-0.5">
                  {btn.value}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Sensor Deep Dive Card */}
          <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-850 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <h4 className="text-base font-bold text-white">
                {activeSensor.name}
              </h4>
              <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${activeSensor.badgeBg} ${activeSensor.color}`}>
                {activeSensor.reading} • {activeSensor.category}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeSensor.desc}
            </p>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-amber-200/90">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Clinical Correlation Rule:</strong>
                <span>{activeSensor.clinicalImpact}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
