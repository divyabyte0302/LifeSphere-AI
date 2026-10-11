import React, { useState } from 'react';
import {
  X,
  Bluetooth,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { WearableSensorDevice } from '../../types/wearables';

interface GattInspectorModalProps {
  device: WearableSensorDevice;
  onClose: () => void;
  onCalibrate?: (deviceId: string) => void;
}

export const GattInspectorModal: React.FC<GattInspectorModalProps> = ({
  device,
  onClose,
  onCalibrate,
}) => {
  const [copiedUuid, setCopiedUuid] = useState<string | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [hexPackets] = useState<string[]>([
    '0x10 0x48 0x03 0x41 0x03 0x44 (HR: 72 bpm, RR: 833ms, 836ms)',
    '0x02 0x62 0x00 0x48 (SpO2: 98.4%, Pulse: 72 bpm, Normal)',
    '0x00 0x58 (Battery Level: 88%)',
    '0x12 0x60 0x00 0x14 0x01 (Optical PM2.5: 18.4 µg/m³, Quality: Good)',
  ]);

  const handleCopy = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    setCopiedUuid(uuid);
    setTimeout(() => setCopiedUuid(null), 2000);
  };

  const handleRunCalibration = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      if (onCalibrate) onCalibrate(device.id);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bluetooth className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-white">{device.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  {device.bleVersion}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                MAC: {device.macAddress} • Firmware {device.firmwareVersion}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry & Connection Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">RSSI Signal</span>
            <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
              {device.signalStrength} dBm
            </span>
            <span className="text-[10px] text-slate-500">Excellent link</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Battery</span>
            <span className="text-sm font-bold text-white font-mono mt-0.5 block">
              {device.batteryLevel}%
            </span>
            <span className="text-[10px] text-emerald-400">Normal voltage</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Sampling</span>
            <span className="text-sm font-bold text-cyan-400 font-mono mt-0.5 block">
              {device.samplingIntervalSeconds}s rate
            </span>
            <span className="text-[10px] text-slate-500">Continuous CCCD</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Security</span>
            <span className="text-sm font-bold text-indigo-400 font-mono mt-0.5 block">
              AES-128
            </span>
            <span className="text-[10px] text-indigo-300">BLE Mode 1 Lv4</span>
          </div>
        </div>

        {/* Primary GATT Services & Characteristics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Discovered GATT Primary Services & Characteristics
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">
              {device.gattServices.length} Services active
            </span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {device.gattServices.map((service, idx) => (
              <div
                key={service.uuid + idx}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-bold text-white">{service.name}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(service.uuid)}
                    className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                    title="Copy UUID"
                  >
                    {copiedUuid === service.uuid ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span className="truncate max-w-[120px]">{service.uuid.substring(0, 8)}...</span>
                  </button>
                </div>

                {/* Characteristics list */}
                <div className="space-y-1.5 pl-2 border-l border-slate-800">
                  {service.characteristics.map((char) => (
                    <div
                      key={char.uuid}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-xl bg-slate-900/60"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 font-medium text-[11px]">{char.name}</span>
                        <div className="flex gap-1">
                          {char.properties.map((prop) => (
                            <span
                              key={prop}
                              className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400"
                            >
                              {prop}
                            </span>
                          ))}
                        </div>
                      </div>
                      {char.lastValue && (
                        <span className="font-mono text-emerald-400 font-semibold text-[11px]">
                          {char.lastValue}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Raw Hex Packet Console */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Live GATT Characteristic Stream (Last Received Packets)
            </span>
            <span className="text-[10px] text-emerald-400 animate-pulse">● Receiving 1 Hz</span>
          </div>

          <div className="space-y-1 text-[10px] text-slate-400 max-h-24 overflow-y-auto">
            {hexPackets.map((pkt, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-cyan-300">{pkt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Cryptographically Bound to Patient ID</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunCalibration}
              disabled={isCalibrating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isCalibrating ? 'Calibrating...' : 'Zero-Drift Calibrate'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
