import React, { useState, useEffect } from 'react';
import {
  Watch,
  Wifi,
  BatteryCharging,
  Bluetooth,
  RefreshCw,
  CheckCircle2,
  Plus,
  Play,
  Pause,
  Sliders,
  Trash2,
  Terminal,
  Activity,
  Heart,
  Droplet,
  CloudSun,
  ShieldAlert,
  Radio,
  Signal,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { WearableSensorDevice } from '../types/wearables';
import { INITIAL_WEARABLE_DEVICES } from '../data/wearableSensorsData';
import { BluetoothPairingModal } from './wearables/BluetoothPairingModal';
import { GattInspectorModal } from './wearables/GattInspectorModal';

interface WearablesViewProps {
  isMobile?: boolean;
  onUpdateHeartRate?: (hr: number) => void;
  showSnackbar?: (msg: string) => void;
}

export const WearablesView: React.FC<WearablesViewProps> = ({
  isMobile,
  onUpdateHeartRate,
  showSnackbar,
}) => {
  const [devices, setDevices] = useState<WearableSensorDevice[]>(() => {
    const saved = localStorage.getItem('lifesphere_wearable_sensors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_WEARABLE_DEVICES;
      }
    }
    return INITIAL_WEARABLE_DEVICES;
  });

  const [syncing, setSyncing] = useState(false);
  const [pairingModalOpen, setPairingModalOpen] = useState(false);
  const [inspectedDevice, setInspectedDevice] = useState<WearableSensorDevice | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to local storage on update
  useEffect(() => {
    localStorage.setItem('lifesphere_wearable_sensors', JSON.stringify(devices));
  }, [devices]);

  // Subtle real-time telemetry oscillation simulation so values look live
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prevDevices) =>
        prevDevices.map((dev) => {
          if (dev.status !== 'streaming') return dev;

          let updatedVal = dev.liveTelemetry.primaryValue;
          if (typeof updatedVal === 'number') {
            // Jitter by ±1 or small fraction
            if (dev.category === 'chest_strap' || dev.category === 'smartwatch') {
              const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
              updatedVal = Math.min(110, Math.max(55, updatedVal + delta));
              if (onUpdateHeartRate && dev.category === 'chest_strap') {
                onUpdateHeartRate(updatedVal);
              }
            } else if (dev.category === 'pulse_oximeter') {
              const delta = (Math.random() * 0.4 - 0.2);
              updatedVal = parseFloat(Math.min(100, Math.max(94, updatedVal + delta)).toFixed(1));
            } else if (dev.category === 'continuous_glucose') {
              const delta = Math.floor(Math.random() * 3) - 1;
              updatedVal = Math.min(140, Math.max(75, updatedVal + delta));
            } else if (dev.category === 'environmental_beacon') {
              const delta = (Math.random() * 0.6 - 0.3);
              updatedVal = parseFloat(Math.min(80, Math.max(5, updatedVal + delta)).toFixed(1));
            }
          }

          return {
            ...dev,
            lastSyncTimestamp: 'Just now',
            liveTelemetry: {
              ...dev.liveTelemetry,
              primaryValue: updatedVal,
            },
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [onUpdateHeartRate]);

  const showNotification = (msg: string) => {
    if (showSnackbar) {
      showSnackbar(msg);
    } else {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleSyncAll = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setDevices((prev) =>
        prev.map((d) => ({
          ...d,
          lastSyncTimestamp: 'Just now',
        }))
      );
      showNotification('All wearable sensors synchronized over BLE 5.3.');
    }, 1200);
  };

  const handleDevicePaired = (newDevice: WearableSensorDevice) => {
    setDevices((prev) => [newDevice, ...prev]);
    showNotification(`Paired with ${newDevice.name} via Bluetooth BLE.`);
  };

  const handleToggleStreaming = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === deviceId) {
          const nextStatus = dev.status === 'streaming' ? 'standby' : 'streaming';
          showNotification(
            nextStatus === 'streaming'
              ? `Resumed live telemetry stream for ${dev.name}.`
              : `Paused streaming for ${dev.name} to preserve battery.`
          );
          return { ...dev, status: nextStatus };
        }
        return dev;
      })
    );
  };

  const handleUnpairDevice = (deviceId: string) => {
    const devToForget = devices.find((d) => d.id === deviceId);
    if (!devToForget) return;

    if (window.confirm(`Unpair and disconnect ${devToForget.name}?`)) {
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
      showNotification(`Unpaired ${devToForget.name} from Bluetooth registry.`);
    }
  };

  const handleCalibrate = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === deviceId) {
          return {
            ...dev,
            lastSyncTimestamp: 'Just now',
          };
        }
        return dev;
      })
    );
    showNotification('Zero-drift sensor calibration complete.');
  };

  const streamingCount = devices.filter((d) => d.status === 'streaming').length;
  const avgBattery = Math.round(
    devices.reduce((acc, d) => acc + d.batteryLevel, 0) / (devices.length || 1)
  );

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-6xl mx-auto'}`}>
      
      {/* Top Header with Add Sensor Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20">
            <Watch className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-xl font-extrabold text-white">
                Wearable Sensor Ecosystem
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                BLE 5.3 GATT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous biosensor streaming, multi-lead telemetry, and inhaled atmospheric capture
            </p>
          </div>
        </div>

        {/* Action Buttons: Add Sensor via Bluetooth + Sync Now */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncAll}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync All'}</span>
          </button>

          <button
            onClick={() => setPairingModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Bluetooth className="w-4 h-4 stroke-[2.5]" />
            <span>+ Pair Bluetooth Sensor</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Paired Sensors</span>
            <Watch className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">{devices.length}</span>
            <span className="text-[11px] text-cyan-400 font-mono">active</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Live Telemetry</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-400">{streamingCount}</span>
            <span className="text-[11px] text-slate-400 font-mono">channels 1 Hz</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Link Encryption</span>
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-indigo-300">AES-128</span>
            <span className="text-[11px] text-slate-400 font-mono">CCM Mode</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Avg Sensor Battery</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">{avgBattery}%</span>
            <span className="text-[11px] text-emerald-400 font-mono">nominal</span>
          </div>
        </div>
      </div>

      {/* Main Connected Devices Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Bluetooth className="w-4 h-4 text-cyan-400" />
            Connected Wearable Peripherals ({devices.length})
          </h3>
          <span className="text-[11px] text-slate-400">
            Real-time GATT CCCD Characteristic Subscriptions Active
          </span>
        </div>

        {devices.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <Bluetooth className="w-12 h-12 text-cyan-400/40 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">No Bluetooth Sensors Paired</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Pair your normal smartwatch (Samsung Galaxy Watch, Apple Watch, Pixel Watch, Garmin, Fitbit, Amazfit), Polar H10, CGM, or BLE health band.
              </p>
            </div>
            <button
              onClick={() => setPairingModalOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Pair Smartwatch / Bluetooth Sensor</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((device) => {
              const isStreaming = device.status === 'streaming';

              return (
                <div
                  key={device.id}
                  className="rounded-3xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4 relative group"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
                          device.category === 'smartwatch'
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            : device.category === 'chest_strap'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : device.category === 'continuous_glucose'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : device.category === 'environmental_beacon'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        }`}
                      >
                        {device.category === 'smartwatch' ? (
                          <Watch className="w-6 h-6" />
                        ) : device.category === 'chest_strap' ? (
                          <Heart className="w-6 h-6" />
                        ) : device.category === 'continuous_glucose' ? (
                          <Droplet className="w-6 h-6" />
                        ) : device.category === 'environmental_beacon' ? (
                          <CloudSun className="w-6 h-6" />
                        ) : (
                          <Activity className="w-6 h-6" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm md:text-base font-bold text-white">
                            {device.name}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {device.manufacturer} • {device.model}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            Placement: {device.placement}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Firmware {device.firmwareVersion}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Connection Status Pill */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                          isStreaming
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isStreaming ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                          }`}
                        ></span>
                        {isStreaming ? 'Streaming' : 'Standby'}
                      </span>
                    </div>
                  </div>

                  {/* Live Telemetry Display Block */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        Live Stream ({device.liveTelemetry.primaryMetric})
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-2xl font-black text-white font-mono tracking-tight">
                          {device.liveTelemetry.primaryValue}
                        </span>
                        <span className="text-xs font-bold text-cyan-400 font-mono">
                          {device.liveTelemetry.unit}
                        </span>
                      </div>
                    </div>

                    {device.liveTelemetry.secondaryMetric && (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">
                          {device.liveTelemetry.secondaryMetric}
                        </span>
                        <div className="flex items-baseline justify-end gap-1 mt-0.5">
                          <span className="text-base font-bold text-slate-200 font-mono">
                            {device.liveTelemetry.secondaryValue}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {device.liveTelemetry.secondaryUnit}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Device Telemetry Specs */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{device.batteryLevel}%</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Signal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{device.signalStrength} dBm</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Bluetooth className="w-3.5 h-3.5 text-blue-400" />
                      <span>{device.bleVersion}</span>
                    </div>

                    <div>
                      <span className="text-slate-500">Synced {device.lastSyncTimestamp}</span>
                    </div>
                  </div>

                  {/* Interactive Controls Bar */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStreaming(device.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isStreaming
                            ? 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold'
                        }`}
                        title={isStreaming ? 'Pause live stream' : 'Resume live stream'}
                      >
                        {isStreaming ? (
                          <>
                            <Pause className="w-3 h-3 text-amber-400" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" />
                            <span>Stream</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setInspectedDevice(device)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700/60 transition-colors"
                        title="View GATT Primary Services and Hex Packets"
                      >
                        <Terminal className="w-3 h-3 text-cyan-400" />
                        <span>Inspect GATT</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleUnpairDevice(device.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Unpair and Disconnect"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bluetooth Integration Knowledge & Pairing Guidance */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
          <Info className="w-4 h-4 text-cyan-400" />
          Supported Bluetooth Low Energy (BLE) Medical Profiles
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850 space-y-1">
            <span className="font-bold text-white block">1. Heart Rate & ECG</span>
            <p className="text-[11px] leading-relaxed">
              Standard GATT Service <code className="text-cyan-400">0x180D</code> and Characteristic <code className="text-cyan-400">0x2A37</code> for millisecond R-R intervals and continuous ECG vectors.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850 space-y-1">
            <span className="font-bold text-white block">2. Continuous Oximetry</span>
            <p className="text-[11px] leading-relaxed">
              Standard GATT Service <code className="text-cyan-400">0x1822</code> for continuous arterial oxygen saturation (SpO2%) and nocturnal desaturation monitoring.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850 space-y-1">
            <span className="font-bold text-white block">3. Inhaled Atmospheric Beacon</span>
            <p className="text-[11px] leading-relaxed">
              Personalized micro-laser scattering PM2.5 beacons operating on Environmental Sensing <code className="text-cyan-400">0x181A</code> with 1 Hz continuous capture.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {pairingModalOpen && (
        <BluetoothPairingModal
          onClose={() => setPairingModalOpen(false)}
          onDevicePaired={handleDevicePaired}
          existingDeviceIds={devices.map((d) => d.id)}
        />
      )}

      {inspectedDevice && (
        <GattInspectorModal
          device={inspectedDevice}
          onClose={() => setInspectedDevice(null)}
          onCalibrate={handleCalibrate}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/40 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
