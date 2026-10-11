import React, { useState } from 'react';
import {
  Heart,
  Droplets,
  Activity,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { HealthMetrics, MeasurementRecord } from '../../types';

interface MeasurementsScreenProps {
  vitals: HealthMetrics;
  onLogMeasurement: (record: MeasurementRecord) => void;
  showSnackbar: (msg: string) => void;
  isMobile?: boolean;
}

export const MeasurementsScreen: React.FC<MeasurementsScreenProps> = ({
  vitals,
  onLogMeasurement,
  showSnackbar,
  isMobile,
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<MeasurementRecord['type']>('Heart Rate');
  const [val1, setVal1] = useState('72');
  const [val2, setVal2] = useState('118/76');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSource, setSelectedSource] = useState<MeasurementRecord['source']>('Manual Log');
  const [filter, setFilter] = useState<'all' | 'cardiac' | 'respiratory' | 'metabolic'>('all');

  const [records, setRecords] = useState<MeasurementRecord[]>([
    { id: '1', type: 'Heart Rate', value: '72', unit: 'BPM', timestamp: 'Today, 09:15 AM', source: 'Apple Watch Ultra', status: 'optimal' },
    { id: '2', type: 'SpO2', value: '98.4', unit: '%', timestamp: 'Today, 09:15 AM', source: 'Apple Watch Ultra', status: 'optimal' },
    { id: '3', type: 'Blood Pressure', value: '118/76', unit: 'mmHg', timestamp: 'Today, 08:30 AM', source: 'BLE Sensor', status: 'normal' },
    { id: '4', type: 'Blood Glucose', value: '94', unit: 'mg/dL', timestamp: 'Today, 07:45 AM', source: 'Manual Log', status: 'normal' },
    { id: '5', type: 'Body Temperature', value: '36.6', unit: '°C', timestamp: 'Today, 07:00 AM', source: 'Oura Ring', status: 'normal' },
    { id: '6', type: 'Respiratory Rate', value: '14.5', unit: 'bpm', timestamp: 'Yesterday, 11:30 PM', source: 'Oura Ring', status: 'normal' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let value = val1;
    let unit = 'BPM';
    if (selectedType === 'Blood Pressure') {
      value = val2;
      unit = 'mmHg';
    } else if (selectedType === 'SpO2') {
      unit = '%';
    } else if (selectedType === 'Blood Glucose') {
      unit = 'mg/dL';
    } else if (selectedType === 'Body Temperature') {
      unit = '°C';
    } else if (selectedType === 'Respiratory Rate') {
      unit = 'bpm';
    }

    const newRecord: MeasurementRecord = {
      id: Date.now().toString(),
      type: selectedType,
      value,
      unit,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      source: selectedSource,
      status: 'normal',
    };

    setRecords([newRecord, ...records]);
    onLogMeasurement(newRecord);
    setIsBottomSheetOpen(false);
    showSnackbar(`${selectedType} measurement of ${value} ${unit} successfully recorded.`);
  };

  const filteredRecords = records.filter((r) => {
    if (filter === 'cardiac') return r.type === 'Heart Rate' || r.type === 'Blood Pressure';
    if (filter === 'respiratory') return r.type === 'SpO2' || r.type === 'Respiratory Rate';
    if (filter === 'metabolic') return r.type === 'Blood Glucose' || r.type === 'Body Temperature';
    return true;
  });

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-5xl mx-auto'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              Health Measurements Log
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated wearable sensor streams and patient clinical self-reports
            </p>
          </div>
        </div>

        {/* Action Button: Opens BottomSheet */}
        <button
          onClick={() => setIsBottomSheetOpen(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Log Measurement</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {(['all', 'cardiac', 'respiratory', 'metabolic'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
              filter === tab
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Measurements Table / Cards */}
      <div className="space-y-2.5">
        {filteredRecords.map((r) => (
          <div
            key={r.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400">
                {r.type === 'Heart Rate' && <Heart className="w-5 h-5 text-rose-400" />}
                {r.type === 'Blood Pressure' && <Activity className="w-5 h-5 text-blue-400" />}
                {r.type === 'SpO2' && <Droplets className="w-5 h-5 text-cyan-400" />}
                {r.type === 'Blood Glucose' && <Activity className="w-5 h-5 text-purple-400" />}
                {r.type === 'Body Temperature' && <Activity className="w-5 h-5 text-amber-400" />}
                {r.type === 'Respiratory Rate' && <Droplets className="w-5 h-5 text-teal-400" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{r.type}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span>{r.source}</span>
                  <span>•</span>
                  <span>{r.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-white font-mono">
                {r.value} <span className="text-xs text-slate-400 font-normal">{r.unit}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                {r.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Material 3 BottomSheet / Modal to Log New Measurement */}
      {isBottomSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Record Vital Sign</h3>
              </div>
              <button
                onClick={() => setIsBottomSheetOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Vital Type Selector */}
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Vital Sign</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Heart Rate">Heart Rate (BPM)</option>
                  <option value="Blood Pressure">Blood Pressure (mmHg)</option>
                  <option value="SpO2">Blood Oxygen (SpO2 %)</option>
                  <option value="Blood Glucose">Blood Glucose (mg/dL)</option>
                  <option value="Body Temperature">Body Temperature (°C)</option>
                  <option value="Respiratory Rate">Respiratory Rate (Breaths/min)</option>
                </select>
              </div>

              {/* Value Input */}
              {selectedType === 'Blood Pressure' ? (
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Systolic / Diastolic</label>
                  <input
                    type="text"
                    value={val2}
                    onChange={(e) => setVal2(e.target.value)}
                    placeholder="e.g. 120/80"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Value</label>
                  <input
                    type="number"
                    step="0.1"
                    value={val1}
                    onChange={(e) => setVal1(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Date Picker (M3 Date Picker form control) */}
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Date Recorded</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Source */}
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Measurement Source</label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Manual Log">Manual Clinical Log</option>
                  <option value="Apple Watch Ultra">Apple Watch Ultra</option>
                  <option value="Oura Ring">Oura Ring Gen 3</option>
                  <option value="BLE Sensor">BLE Optical Pulse Oximeter</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Save Measurement
                </button>
                <button
                  type="button"
                  onClick={() => setIsBottomSheetOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
