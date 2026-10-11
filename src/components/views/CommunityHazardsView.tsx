import React, { useState } from 'react';
import {
  AlertTriangle,
  MapPin,
  CheckCircle2,
  ThumbsUp,
  Plus,
  Flame,
  Factory,
  Sun,
  Wind,
  Truck,
  Filter,
  ShieldCheck,
  Send,
  X,
  Users
} from 'lucide-react';
import { CommunityHazardReport } from '../../types';
import { DEMO_COMMUNITY_HAZARDS } from '../../data/syntheticData';

interface CommunityHazardsViewProps {
  isMobile?: boolean;
}

export const CommunityHazardsView: React.FC<CommunityHazardsViewProps> = ({
  isMobile = false
}) => {
  const [hazards, setHazards] = useState<CommunityHazardReport[]>(DEMO_COMMUNITY_HAZARDS);
  const [filterType, setFilterType] = useState<string>('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // New report form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CommunityHazardReport['hazardType']>('wildfire_smoke');
  const [newLocation, setNewLocation] = useState('');
  const [newSeverity, setNewSeverity] = useState<CommunityHazardReport['severity']>('high');
  const [newPm25, setNewPm25] = useState('');

  const handleVote = (id: string) => {
    setHazards((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const updatedUserVoted = !h.userVoted;
          const updatedVotes = updatedUserVoted ? h.verificationVotes + 1 : h.verificationVotes - 1;
          const updatedStatus = updatedVotes >= 15 ? 'community_verified' : h.status;
          return {
            ...h,
            verificationVotes: updatedVotes,
            userVoted: updatedUserVoted,
            status: updatedStatus
          };
        }
        return h;
      })
    );
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    const newReport: CommunityHazardReport = {
      id: `haz_${Date.now()}`,
      title: newTitle.trim(),
      hazardType: newType,
      locationName: newLocation.trim(),
      reportedAt: 'Just now',
      reportedByAnonymized: 'You (Citizen Scientist #911)',
      severity: newSeverity,
      verificationVotes: 1,
      status: 'unverified',
      measuredPm25: newPm25 ? parseFloat(newPm25) : undefined,
      userVoted: true
    };

    setHazards([newReport, ...hazards]);
    setIsReportModalOpen(false);
    setNewTitle('');
    setNewLocation('');
    setNewPm25('');
  };

  const filteredHazards = hazards.filter((h) => {
    if (filterType === 'all') return true;
    return h.hazardType === filterType;
  });

  const getHazardIcon = (type: CommunityHazardReport['hazardType']) => {
    switch (type) {
      case 'wildfire_smoke':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'industrial_emission':
        return <Factory className="w-4 h-4 text-purple-400" />;
      case 'urban_heat_island':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'construction_dust':
        return <Truck className="w-4 h-4 text-yellow-400" />;
      default:
        return <Wind className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-7xl mx-auto'}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
              Module 12 · Crowdsourced Environmental Intelligence
            </span>
            <span className="text-[10px] text-slate-500">·</span>
            <span className="text-[11px] text-slate-400">Citizen Verification Protocol</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
            Community Hazard Reporting & Verification
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Real-time citizen science network reporting localized micro-pollutants, industrial discharges, and urban heat spots with peer-reviewed consensus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Report Environmental Hazard</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All Hazards' },
          { id: 'wildfire_smoke', label: 'Wildfire Smoke' },
          { id: 'industrial_emission', label: 'Industrial Emission' },
          { id: 'urban_heat_island', label: 'Heat Hotspots' },
          { id: 'stagnant_air', label: 'Stagnant Inversion' },
          { id: 'construction_dust', label: 'Construction Dust' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterType === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hazards Cards Feed */}
      <div className="space-y-3">
        {filteredHazards.map((hazard) => (
          <div
            key={hazard.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                {getHazardIcon(hazard.hazardType)}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{hazard.title}</h4>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                      hazard.severity === 'hazardous'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : hazard.severity === 'high'
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {hazard.severity} Severity
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      hazard.status === 'community_verified'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {hazard.status === 'community_verified' ? '✓ Community Verified' : 'Under Investigation'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{hazard.locationName}</span>
                  </span>
                  <span>·</span>
                  <span>Reported {hazard.reportedAt}</span>
                  <span>·</span>
                  <span>By {hazard.reportedByAnonymized}</span>
                </div>

                {(hazard.measuredPm25 || hazard.measuredTemp) && (
                  <div className="flex items-center gap-3 text-[11px] font-mono text-cyan-300 pt-1">
                    {hazard.measuredPm25 && <span>Observed PM2.5: {hazard.measuredPm25} µg/m³</span>}
                    {hazard.measuredTemp && <span>Observed Surface Temp: {hazard.measuredTemp}°C</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
              <button
                onClick={() => handleVote(hazard.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  hazard.userVoted
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{hazard.verificationVotes} Verify Votes</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Report Environmental Hazard</h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Hazard Title / Summary</label>
                <input
                  type="text"
                  placeholder="e.g. Localized smoke cloud near train tracks"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Hazard Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="wildfire_smoke">Wildfire Smoke</option>
                    <option value="industrial_emission">Industrial Emission</option>
                    <option value="urban_heat_island">Urban Heat Hotspot</option>
                    <option value="stagnant_air">Stagnant Inversion</option>
                    <option value="construction_dust">Construction Dust</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Observed Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                    <option value="hazardous">Hazardous / Acute</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Specific Location / Cross Street</label>
                <input
                  type="text"
                  placeholder="e.g. Corner of 7th & Elm, South Industrial Ward"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Optional Sensor Reading (PM2.5 in µg/m³)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 42.5"
                  value={newPm25}
                  onChange={(e) => setNewPm25(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
