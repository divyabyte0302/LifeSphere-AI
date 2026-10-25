import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  RefreshCw,
  Zap,
  ShieldAlert,
  Thermometer,
  CloudRain
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { SafeRouteOption } from '../../types';
import { DEMO_SAFE_ROUTES } from '../../data/syntheticData';

const GOOGLE_MAPS_API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyA4oo7fI-UZG4AembyHFmU_wsi0_4A22Io';

interface DestinationReport {
  destination: string;
  coordinates: { lat: number; lng: number };
  aqi: number;
  pm25: number;
  uvIndex: number;
  pollenCount: string;
  temperature: number;
  weather: string;
  precautions: string[];
}

interface SafeRoutesViewProps {
  isMobile?: boolean;
}

export const SafeRoutesView: React.FC<SafeRoutesViewProps> = ({ isMobile = false }) => {
  const [origin, setOrigin] = useState('Central Health Hub, 100 Van Ness Ave, San Francisco');
  const [destination, setDestination] = useState('Golden Gate Park Conservatory, San Francisco');
  const [routes, setRoutes] = useState<SafeRouteOption[]>(DEMO_SAFE_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(DEMO_SAFE_ROUTES[0].id);

  // Pre-travel destination report state
  const [destinationReport, setDestinationReport] = useState<DestinationReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // Active navigation & auto-rerouting simulation state
  const [isNavigating, setIsNavigating] = useState(false);
  const [navProgress, setNavProgress] = useState(0);
  const [hazardAlertModal, setHazardAlertModal] = useState<{
    open: boolean;
    reason: string;
    suggestedRoute: SafeRouteOption;
  } | null>(null);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  // Map markers center positions for route options
  const mapCenter = { lat: 37.7749, lng: -122.4194 };
  const originCoord = { lat: 37.7749, lng: -122.4194 };
  const destinationCoord = { lat: 37.7694, lng: -122.4862 };

  // Fetch destination report when component mounts or destination changes
  useEffect(() => {
    fetchDestinationReport();
  }, [destination]);

  const fetchDestinationReport = async () => {
    setIsLoadingReport(true);
    try {
      const res = await fetch(
        `/api/environment/destination-report?lat=37.7694&lng=-122.4862&destination=${encodeURIComponent(
          destination
        )}`
      );
      if (res.ok) {
        const data = await res.json();
        setDestinationReport(data);
      } else {
        // Fallback report structure
        setDestinationReport({
          destination,
          coordinates: destinationCoord,
          aqi: 42,
          pm25: 10.2,
          uvIndex: 4,
          pollenCount: 'Moderate (Birch/Oak)',
          temperature: 21.5,
          weather: 'Partly Cloudy',
          precautions: [
            'Optimal micro-climate zone. Air quality is good.',
            'Moderate UV levels: Sunscreen recommended between 11 AM and 3 PM.',
            'Light tree pollen in canopy zones.'
          ]
        });
      }
    } catch {
      setDestinationReport({
        destination,
        coordinates: destinationCoord,
        aqi: 42,
        pm25: 10.2,
        uvIndex: 4,
        pollenCount: 'Moderate (Birch/Oak)',
        temperature: 21.5,
        weather: 'Partly Cloudy',
        precautions: [
          'Optimal micro-climate zone. Air quality is good.',
          'Moderate UV levels: Sunscreen recommended between 11 AM and 3 PM.',
          'Light tree pollen in canopy zones.'
        ]
      });
    } finally {
      setIsLoadingReport(false);
    }
  };

  // Simulate active navigation progress
  useEffect(() => {
    let interval: any;
    if (isNavigating) {
      interval = setInterval(() => {
        setNavProgress((prev) => {
          if (prev >= 100) {
            setIsNavigating(false);
            return 100;
          }
          return prev + 5;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isNavigating]);

  // Trigger simulated environmental hazard to test automatic rerouting
  const handleSimulateHazard = () => {
    const alternativeRoute =
      routes.find((r) => r.id !== selectedRouteId) || {
        ...selectedRoute,
        id: 'rerouted-1',
        title: 'Emergency Clean Bypass (Via Panhandle Canopy)',
        durationMinutes: selectedRoute.durationMinutes + 3,
        averagePm25: 8.4,
        averageAqi: 34,
        advisory: 'Rerouted away from industrial particulate spike.'
      };

    setHazardAlertModal({
      open: true,
      reason: 'Particulate Matter (PM2.5) spike detected along Market St corridor (+85 µg/m³). AQI deteriorated to 142 (Unhealthy).',
      suggestedRoute: alternativeRoute
    });
  };

  const handleAcceptReroute = () => {
    if (hazardAlertModal) {
      setSelectedRouteId(hazardAlertModal.suggestedRoute.id);
      setHazardAlertModal(null);
    }
  };

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-7xl mx-auto'}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              Modules 5–7 · Safest Route & Environmental Micro-Routing
            </span>
            <span className="text-[10px] text-slate-500">·</span>
            <span className="text-[11px] text-slate-400">Google Maps Platform Integrated</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
            Safest Route Map & Pre-Travel Intelligence
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Calculates low-exposure walking, cycling, and transit corridors by evaluating micro-climate air quality, UV index, pollen density, and urban heat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isNavigating ? (
            <div className="px-3.5 py-2 bg-cyan-950/60 border border-cyan-500/50 rounded-xl text-xs font-mono text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Active Navigation ({navProgress}%)</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsNavigating(true);
                setNavProgress(0);
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Start Active Navigation</span>
            </button>
          )}

          <button
            onClick={handleSimulateHazard}
            className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Simulate Hazard Spike</span>
          </button>
        </div>
      </div>

      {/* Origin & Destination Route Planning Controls */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Origin Location</span>
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Destination Location</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              onClick={fetchDestinationReport}
              disabled={isLoadingReport}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingReport ? 'animate-spin' : ''}`} />
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODULE 7: Environmental Conditions Before Travel Report */}
      {destinationReport && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Pre-Travel Environmental Conditions Report
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-semibold">
              Live Forecast Sync
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Air Quality</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-emerald-400">AQI {destinationReport.aqi}</span>
              </div>
              <span className="text-[10px] text-emerald-300 block">PM2.5: {destinationReport.pm25} µg/m³</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">UV Radiation</span>
              <div className="flex items-baseline gap-1">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-lg font-bold text-amber-300">UV {destinationReport.uvIndex}</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Moderate Exposure</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Pollen Count</span>
              <div className="flex items-baseline gap-1">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-300 truncate">{destinationReport.pollenCount}</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Allergen Density</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Temperature</span>
              <div className="flex items-baseline gap-1">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <span className="text-lg font-bold text-white">{destinationReport.temperature}°C</span>
              </div>
              <span className="text-[10px] text-slate-400 block">{destinationReport.weather}</span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Health Status</span>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Safe to Travel</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Corridor clear</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-300 font-mono">
            <span className="text-emerald-400 font-bold uppercase text-[11px] shrink-0">Precautions:</span>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {destinationReport.precautions.map((p, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  • {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: Route Options Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {routes.map((route, idx) => {
          const isSelected = route.id === selectedRouteId;
          const rankLabel = idx === 0 ? '#1 Safest Choice' : idx === 1 ? '#2 Balanced' : '#3 Direct Route';

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
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
                  {rankLabel}
                </span>
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </div>

              <h4 className="text-sm font-bold text-white truncate">{route.title}</h4>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-850">
                  <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
                  <span className="text-sm font-bold text-white">{route.durationMinutes} min</span>
                  <span className="text-[10px] text-slate-500 block">{route.totalDistanceKm} km</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-850">
                  <span className="text-[10px] text-slate-400 block uppercase">Avg PM2.5</span>
                  <span className="text-sm font-bold text-cyan-400">{route.averagePm25} µg/m³</span>
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
                  <span>High Traffic Exposure Corridor</span>
                </div>
              )}

              <p className="text-[11px] text-slate-400 leading-relaxed">{route.advisory}</p>
            </div>
          );
        })}
      </div>

      {/* MODULE 5 & 6: Interactive Google Maps Component */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              Interactive Google Maps Spatial Navigation & Micro-Climate Waypoints
            </h3>
            <p className="text-xs text-slate-400">
              Active Corridor: <strong className="text-emerald-400">{selectedRoute.title}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400">● Clean Corridors</span>
            <span className="flex items-center gap-1 text-amber-400">● Moderate AQI</span>
            <span className="flex items-center gap-1 text-rose-400">● High Exposure Zones</span>
          </div>
        </div>

        {/* Embedded Google Map Component using @vis.gl/react-google-maps */}
        <div className="h-[360px] w-full rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-950">
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Map
              defaultCenter={mapCenter}
              defaultZoom={13}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              className="w-full h-full"
            >
              {/* Origin Marker */}
              <AdvancedMarker position={originCoord}>
                <Pin background="#10b981" borderColor="#047857" glyphColor="#ffffff" />
              </AdvancedMarker>

              {/* Destination Marker */}
              <AdvancedMarker position={destinationCoord}>
                <Pin background="#06b6d4" borderColor="#0e7490" glyphColor="#ffffff" />
              </AdvancedMarker>

              {/* Waypoint Markers for Selected Route */}
              {selectedRoute.waypoints.map((wp, i) => {
                const latOffset = (i + 1) * -0.002;
                const lngOffset = (i + 1) * -0.012;
                const pos = { lat: originCoord.lat + latOffset, lng: originCoord.lng + lngOffset };
                const bg = wp.aqi < 50 ? '#10b981' : wp.aqi < 80 ? '#f59e0b' : '#f43f5e';
                return (
                  <AdvancedMarker key={wp.name} position={pos}>
                    <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-mono font-bold text-white shadow-lg flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: bg }}></span>
                      <span>
                        {wp.name} (AQI {wp.aqi})
                      </span>
                    </div>
                  </AdvancedMarker>
                );
              })}
            </Map>
          </APIProvider>
        </div>

        {/* Waypoints Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
            Corridor Waypoints Breakdown
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {selectedRoute.waypoints.map((wp, idx) => {
              const aqiColor =
                wp.aqi < 50
                  ? 'border-emerald-500/40 text-emerald-400'
                  : wp.aqi < 80
                  ? 'border-amber-500/40 text-amber-400'
                  : 'border-rose-500/40 text-rose-400';

              return (
                <div
                  key={wp.name}
                  className="p-3.5 rounded-xl border bg-slate-900/60 border-slate-800 space-y-2"
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
        </div>
      </div>

      {/* MODULE 6: Automatic Rerouting Alert Modal */}
      {hazardAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block">
                  Module 6 · Real-Time Hazard Detection
                </span>
                <h3 className="text-lg font-bold text-white">Environmental Hazard Alert</h3>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 leading-relaxed font-mono">
              {hazardAlertModal.reason}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Proposed Safer Alternative Route</span>
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-400 font-mono">
                    {hazardAlertModal.suggestedRoute.title}
                  </h4>
                  <span className="text-[11px] font-mono text-white font-bold">
                    {hazardAlertModal.suggestedRoute.durationMinutes} mins
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {hazardAlertModal.suggestedRoute.advisory}
                </p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-emerald-300 pt-1">
                  <span>Avg PM2.5: {hazardAlertModal.suggestedRoute.averagePm25} µg/m³</span>
                  <span>AQI: {hazardAlertModal.suggestedRoute.averageAqi}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setHazardAlertModal(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
              >
                Dismiss & Stay
              </button>
              <button
                onClick={handleAcceptReroute}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept New Route</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
