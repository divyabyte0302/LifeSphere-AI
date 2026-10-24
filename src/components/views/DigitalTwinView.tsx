import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Droplet,
  Wind,
  Shield,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Thermometer
} from 'lucide-react';
import { HealthMetrics, EnvironmentalData } from '../../types';
import { DEMO_DIGITAL_TWIN } from '../../data/syntheticData';

interface DigitalTwinViewProps {
  vitals: HealthMetrics;
  environment: EnvironmentalData;
  isMobile?: boolean;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  vitals,
  environment,
  isMobile = false
}) => {
  const [twinData, setTwinData] = useState(DEMO_DIGITAL_TWIN);
  const [activeSimulationId, setActiveSimulationId] = useState<string | null>(null);
  const [simulatedLoadActive, setSimulatedLoadActive] = useState(false);
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);

  const handleRunSimulation = (scenarioId: string) => {
    setActiveSimulationId(scenarioId);
    setSimulatedLoadActive(true);
    const scenario = twinData.simulationScenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      setSimulationNotice(scenario.recommendation);
    }
  };

  const handleResetTwin = () => {
    setActiveSimulationId(null);
    setSimulatedLoadActive(false);
    setSimulationNotice(null);
  };

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-7xl mx-auto'}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              Module 03 · Personal Physiological Replica
            </span>
            <span className="text-[10px] text-slate-500">·</span>
            <span className="text-[11px] text-slate-400">Twin ID: {twinData.twinId}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
            Personal AI Digital Twin
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Simulates dynamic cardiovascular resilience, bronchial barrier integrity, and thermoregulatory load in response to real-time ambient stressors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {simulatedLoadActive && (
            <button
              onClick={handleResetTwin}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Baseline</span>
            </button>
          )}
          <div className="px-3 py-2 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs font-mono text-cyan-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Continuous In-Silico Sync</span>
          </div>
        </div>
      </div>

      {/* Top Digital Twin Vitals Mesh Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cardiac Reserve</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{simulatedLoadActive ? '58' : twinData.cardiacReserveScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span className={simulatedLoadActive ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
              {simulatedLoadActive ? '↓ Strained (-20 pts)' : 'Optimal Ejection'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pulmonary Resilience</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{simulatedLoadActive ? '44' : twinData.respiratoryResilienceIndex}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span className={simulatedLoadActive ? 'text-rose-400 font-semibold' : 'text-amber-400'}>
              {simulatedLoadActive ? 'Bronchial irritation risk' : 'Mild PM2.5 deposition'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Thermal Tolerance</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{twinData.thermalLoadTolerance}</span>
            <span className="text-xs text-slate-400">°C threshold</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400">Current ambient: {environment.temperature.toFixed(1)}°C</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Hydration Index</span>
            <Droplet className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{simulatedLoadActive ? '58' : twinData.hydrationIndex}</span>
            <span className="text-xs text-slate-400">%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-slate-300">Fluid buffer: ~650ml</span>
          </div>
        </div>
      </div>

      {/* Organ Systems Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Biological Compartments & Stress Vectors
          </h3>
          <span className="text-xs text-slate-400">4 Core Physiological Sub-models</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {twinData.organs.map((organ) => {
            const isStrained = simulatedLoadActive && (organ.name.includes('Cardio') || organ.name.includes('Pulmonary'));
            const effectiveStress = isStrained ? Math.min(95, organ.stressLevel + 35) : organ.stressLevel;

            return (
              <div
                key={organ.name}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{organ.name}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${
                      effectiveStress > 70
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : effectiveStress > 45
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {effectiveStress > 70 ? 'High Strain' : effectiveStress > 45 ? 'Mild Strain' : 'Optimal'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>Stress Load: {effectiveStress}%</span>
                    <span>Resilience: {organ.resilienceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        effectiveStress > 70
                          ? 'bg-rose-500'
                          : effectiveStress > 45
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${effectiveStress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-800/80">
                  <div className="text-[11px]">
                    <span className="text-slate-500">Key Stressor: </span>
                    <span className="text-slate-300">{organ.primaryFactor}</span>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-slate-500">Digital Twin Buffer: </span>
                    <span className="text-cyan-300">{organ.activeMitigation}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* In-Silico Intervention Simulation Sandbox */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm md:text-base font-bold text-white">
                In-Silico Intervention Sandbox
              </h3>
              <p className="text-xs text-slate-400">
                Test predictive physiological changes before engaging in real-world environmental exposure.
              </p>
            </div>
          </div>
          {simulatedLoadActive && (
            <span className="text-[11px] font-mono text-amber-400 font-bold px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30">
              Simulation Active
            </span>
          )}
        </div>

        {simulationNotice && (
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Intervention Prognosis: </span>
              {simulationNotice}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {twinData.simulationScenarios.map((scenario) => {
            const isSelected = activeSimulationId === scenario.id;

            return (
              <div
                key={scenario.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-slate-950 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-white block">{scenario.title}</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{scenario.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Baseline Risk: {scenario.baselineRisk}%</span>
                    <span
                      className={`font-bold ${
                        scenario.predictedRiskWithIntervention > scenario.baselineRisk
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      Simulated: {scenario.predictedRiskWithIntervention}%
                    </span>
                  </div>

                  <button
                    onClick={() => handleRunSimulation(scenario.id)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Simulated Active' : 'Run Scenario'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
