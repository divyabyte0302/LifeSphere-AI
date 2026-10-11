import React, { useState, useEffect } from 'react';
import {
  X,
  Bluetooth,
  Radio,
  Search,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  Sliders,
  Battery,
  Shield,
  Activity,
  Heart,
  Droplet,
  CloudSun,
  Plus,
  HelpCircle,
  Watch,
  Smartphone,
  Check
} from 'lucide-react';
import {
  WearableSensorDevice,
  DiscoveredBleDevice,
  BluetoothSensorCategory
} from '../../types/wearables';
import {
  DISCOVERABLE_BLE_DEVICES,
  STANDARD_GATT_SERVICES
} from '../../data/wearableSensorsData';

interface BluetoothPairingModalProps {
  onClose: () => void;
  onDevicePaired: (device: WearableSensorDevice) => void;
  existingDeviceIds: string[];
}

type PairingStep = 'scanning' | 'handshake' | 'configure' | 'success';

export const BluetoothPairingModal: React.FC<BluetoothPairingModalProps> = ({
  onClose,
  onDevicePaired,
  existingDeviceIds,
}) => {
  const [activeTab, setActiveTab] = useState<'discovered' | 'custom'>('discovered');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [discoveredDevices, setDiscoveredDevices] = useState<DiscoveredBleDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DiscoveredBleDevice | null>(null);
  const [pairingStep, setPairingStep] = useState<PairingStep>('scanning');
  const [handshakeProgress, setHandshakeProgress] = useState(0);
  const [handshakeMessage, setHandshakeMessage] = useState('Initiating BLE 5.3 physical link...');
  
  // Custom configuration fields
  const [customName, setCustomName] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState<'wrist' | 'chest' | 'finger' | 'arm' | 'ear' | 'belt' | 'ambient'>('wrist');
  const [selectedInterval, setSelectedInterval] = useState<number>(1);

  // DIY custom sensor form state
  const [diyName, setDiyName] = useState('');
  const [diyManufacturer, setDiyManufacturer] = useState('Custom Maker / Lab');
  const [diyCategory, setDiyCategory] = useState<BluetoothSensorCategory>('chest_strap');
  const [diyServiceUuid, setDiyServiceUuid] = useState('0000180d-0000-1000-8000-00805f9b34fb');
  const [diyMetric, setDiyMetric] = useState('Heart Rate & ECG');
  const [diyBleVersion, setDiyBleVersion] = useState<'BLE 5.0' | 'BLE 5.2' | 'BLE 5.3'>('BLE 5.3');

  // Web Bluetooth support detection
  const hasWebBluetooth = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

  // Simulate realistic BLE device discovery scan with progressive reveals
  useEffect(() => {
    setDiscoveredDevices([]);
    setIsScanning(true);

    const available = DISCOVERABLE_BLE_DEVICES.filter(
      (d) => !existingDeviceIds.includes(d.id)
    );

    // Staggered discovery animation
    const timers: NodeJS.Timeout[] = [];
    available.forEach((dev, index) => {
      const t = setTimeout(() => {
        setDiscoveredDevices((prev) => {
          if (prev.some((p) => p.id === dev.id)) return prev;
          return [...prev, dev];
        });
      }, (index + 1) * 600);
      timers.push(t);
    });

    const stopScanTimer = setTimeout(() => {
      setIsScanning(false);
    }, available.length * 600 + 400);
    timers.push(stopScanTimer);

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [existingDeviceIds]);

  // Trigger Native Web Bluetooth API if available and user clicks "Scan Hardware"
  const handleRequestNativeBluetooth = async () => {
    if (!hasWebBluetooth) {
      alert('Web Bluetooth API is not supported in this browser engine. Showing nearby medical BLE peripherals.');
      return;
    }

    try {
      // @ts-ignore
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          'heart_rate',
          'pulse_oximeter',
          'health_thermometer',
          'battery_service',
          'environmental_sensing',
          '0000180d-0000-1000-8000-00805f9b34fb',
          '00001822-0000-1000-8000-00805f9b34fb',
        ],
      });

      if (device) {
        const nativeBleDevice: DiscoveredBleDevice = {
          id: `ble_native_${device.id || Date.now()}`,
          name: device.name || 'Discovered BLE Peripheral',
          manufacturer: 'Bluetooth SIG Compliant',
          category: 'smartwatch',
          model: 'Generic BLE 5.x',
          bleVersion: 'BLE 5.3',
          macAddress: 'AA:BB:CC:DD:EE:FF',
          signalStrength: -45,
          advertisedServices: ['Standard Health GATT Profiles'],
          batteryLevel: 95,
          defaultPlacement: 'wrist',
          streamingMetrics: ['Live Biometric Telemetry'],
          pairingSecurity: 'Just Works',
          defaultGattServices: [STANDARD_GATT_SERVICES.heartRate, STANDARD_GATT_SERVICES.battery],
        };

        handleStartPairing(nativeBleDevice);
      }
    } catch (err: any) {
      // User cancelled picker or device was rejected
      console.log('Web Bluetooth scan skipped or cancelled:', err);
    }
  };

  const handleStartPairing = (device: DiscoveredBleDevice) => {
    setSelectedDevice(device);
    setCustomName(device.name);
    setSelectedPlacement(device.defaultPlacement);
    setPairingStep('handshake');
    setHandshakeProgress(15);
    setHandshakeMessage(`Connecting to ${device.name}...`);

    // Simulated multi-stage GATT Handshake
    setTimeout(() => {
      setHandshakeProgress(45);
      setHandshakeMessage(`Exchanging ${device.pairingSecurity} encryption keys (AES-128 CCM)...`);
    }, 700);

    setTimeout(() => {
      setHandshakeProgress(75);
      setHandshakeMessage(`Enumerating GATT Services: ${device.advertisedServices.slice(0, 2).join(', ')}...`);
    }, 1400);

    setTimeout(() => {
      setHandshakeProgress(100);
      setHandshakeMessage('GATT Primary Services connected. Telemetry stream ready.');
      setTimeout(() => {
        setPairingStep('configure');
      }, 500);
    }, 2100);
  };

  const handleConfirmPairing = () => {
    if (!selectedDevice) return;

    // Create the fully hydrated WearableSensorDevice
    const newSensor: WearableSensorDevice = {
      id: selectedDevice.id,
      name: customName.trim() || selectedDevice.name,
      manufacturer: selectedDevice.manufacturer,
      category: selectedDevice.category,
      model: selectedDevice.model,
      bleVersion: selectedDevice.bleVersion,
      macAddress: selectedDevice.macAddress,
      batteryLevel: selectedDevice.batteryLevel,
      signalStrength: selectedDevice.signalStrength,
      status: 'streaming',
      streamingMetrics: selectedDevice.streamingMetrics,
      lastSyncTimestamp: 'Just now',
      samplingIntervalSeconds: selectedInterval,
      placement: selectedPlacement,
      firmwareVersion: 'v3.2.1-ble',
      liveTelemetry: {
        primaryMetric: selectedDevice.streamingMetrics[0] || 'Heart Rate',
        primaryValue:
          selectedDevice.category === 'chest_strap' || selectedDevice.category === 'smartwatch'
            ? 74
            : selectedDevice.category === 'continuous_glucose'
            ? 96
            : selectedDevice.category === 'pulse_oximeter'
            ? 98.6
            : 18.2,
        unit:
          selectedDevice.category === 'continuous_glucose'
            ? 'mg/dL'
            : selectedDevice.category === 'pulse_oximeter'
            ? '%'
            : selectedDevice.category === 'environmental_beacon'
            ? 'µg/m³'
            : 'BPM',
        trend: 'stable',
        secondaryMetric: selectedDevice.streamingMetrics[1] || 'Battery',
        secondaryValue: selectedDevice.batteryLevel,
        secondaryUnit: '%',
      },
      gattServices: selectedDevice.defaultGattServices,
    };

    setPairingStep('success');
    setTimeout(() => {
      onDevicePaired(newSensor);
      onClose();
    }, 1000);
  };

  const handlePairDiyDevice = () => {
    if (!diyName.trim()) return;

    const diyDevice: DiscoveredBleDevice = {
      id: `diy_${Date.now()}`,
      name: diyName.trim(),
      manufacturer: diyManufacturer.trim() || 'Custom IoT Maker',
      category: diyCategory,
      model: 'Custom-BLE-MCU',
      bleVersion: diyBleVersion,
      macAddress: 'E4:5F:01:23:45:67',
      signalStrength: -50,
      advertisedServices: [diyServiceUuid],
      batteryLevel: 90,
      defaultPlacement: 'wrist',
      streamingMetrics: [diyMetric],
      pairingSecurity: 'Just Works',
      defaultGattServices: [
        {
          uuid: diyServiceUuid,
          name: `Custom Service (${diyServiceUuid.substring(0, 8)})`,
          characteristics: [
            {
              uuid: '00002a37-0000-1000-8000-00805f9b34fb',
              name: `${diyMetric} Raw Stream`,
              properties: ['notify', 'read'],
              lastValue: 'Live Telemetry Active',
              unit: 'raw',
            },
          ],
        },
        STANDARD_GATT_SERVICES.battery,
      ],
    };

    handleStartPairing(diyDevice);
  };

  // Filter devices
  const filteredDevices = discoveredDevices.filter((dev) => {
    const matchesCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'smartwatch' && dev.category === 'smartwatch') ||
      (categoryFilter === 'heart' && (dev.category === 'chest_strap' || dev.category === 'smartwatch')) ||
      (categoryFilter === 'glucose' && dev.category === 'continuous_glucose') ||
      (categoryFilter === 'oximeter' && dev.category === 'pulse_oximeter') ||
      (categoryFilter === 'environmental' && dev.category === 'environmental_beacon');

    const matchesSearch =
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.model.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20">
              <Bluetooth className="w-6 h-6 stroke-[2.5]" />
              {isScanning && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping"></span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-white">
                  Add Wearable Sensor via Bluetooth
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                  BLE 5.3 GATT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pair normal smartwatches (Galaxy Watch, Apple Watch, Pixel Watch, Garmin, Fitbit), chest straps, CGMs, and health sensors
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

        {/* STEP 1: SCANNING & DISCOVERY */}
        {pairingStep === 'scanning' && (
          <div className="space-y-4">
            
            {/* Nav Tabs: Discovered BLE Peripherals vs DIY Custom Sensor */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('discovered')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'discovered'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Nearby BLE Devices ({discoveredDevices.length})
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'custom'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  + Custom / Any Smartwatch
                </button>
              </div>

              {/* Native Web Bluetooth trigger button */}
              {hasWebBluetooth && (
                <button
                  onClick={handleRequestNativeBluetooth}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-colors"
                  title="Open Chrome/Edge Native Bluetooth Device Selector"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span className="hidden sm:inline">Web Bluetooth API</span>
                </button>
              )}
            </div>

            {activeTab === 'discovered' && (
              <>
                {/* Search & Category Pills */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search smartwatch, Galaxy Watch, Apple Watch, Garmin, Polar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {[
                      { id: 'all', label: 'All Devices' },
                      { id: 'smartwatch', label: '⌚ Smartwatches' },
                      { id: 'heart', label: 'Heart & ECG' },
                      { id: 'oximeter', label: 'SpO2 Oximeter' },
                      { id: 'glucose', label: 'Glucose CGM' },
                      { id: 'environmental', label: 'Air & Particulate' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setCategoryFilter(tab.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-colors ${
                          categoryFilter === tab.id
                            ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 font-bold'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Radar Sweep Banner during active scan */}
                {isScanning && (
                  <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-cyan-300">
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>Scanning 2.4 GHz BLE advertising channels (37, 38, 39)...</span>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">
                      {discoveredDevices.length} peripherals found
                    </span>
                  </div>
                )}

                {/* Discovered Peripherals List */}
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((device) => (
                      <div
                        key={device.id}
                        className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-950 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 transition-colors shrink-0">
                            {device.category === 'chest_strap' || device.category === 'smartwatch' ? (
                              <Heart className="w-5 h-5 text-rose-400" />
                            ) : device.category === 'continuous_glucose' ? (
                              <Droplet className="w-5 h-5 text-amber-400" />
                            ) : device.category === 'environmental_beacon' ? (
                              <CloudSun className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Activity className="w-5 h-5 text-cyan-400" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs md:text-sm font-bold text-white">
                                {device.name}
                              </h4>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                {device.bleVersion}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {device.manufacturer} • {device.model}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-mono">
                              <span className="text-emerald-400">
                                Signal: {device.signalStrength} dBm
                              </span>
                              <span>•</span>
                              <span>Battery: {device.batteryLevel}%</span>
                              <span>•</span>
                              <span className="text-cyan-400 truncate max-w-[140px]">
                                {device.streamingMetrics[0]}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStartPairing(device)}
                          className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all shrink-0"
                        >
                          <Bluetooth className="w-3.5 h-3.5" />
                          <span>Pair Device</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
                      <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-300 font-semibold">No new devices detected</p>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        Make sure your Bluetooth sensor is turned on and in pairing mode (press & hold power button for 3 seconds).
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB: DIY CUSTOM BLE SENSOR */}
            {activeTab === 'custom' && (
              <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Watch className="w-4 h-4 text-cyan-400" />
                    Pair Any Smartwatch, Fitness Band, or Custom BLE Sensor
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Pair your Fire-Boltt, Noise, Boat, Pebble, Suunto, Coros, Wear OS watch, or DIY biosensor node.
                  </p>
                </div>

                {/* Quick 1-Click Presets */}
                <div className="space-y-1.5 pt-1 pb-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">1-Click Smartwatch Presets:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDiyName('My Smartwatch');
                        setDiyManufacturer('Generic Bluetooth Smartwatch');
                        setDiyCategory('smartwatch');
                        setDiyServiceUuid('0000180d-0000-1000-8000-00805f9b34fb');
                        setDiyMetric('Heart Rate, Steps & Sleep Staging');
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Watch className="w-3 h-3 text-cyan-400" />
                      <span>⌚ Smartwatch (Generic / Wear OS)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDiyName('Fitness Tracker Band');
                        setDiyManufacturer('Smart Band');
                        setDiyCategory('smartwatch');
                        setDiyServiceUuid('0000180d-0000-1000-8000-00805f9b34fb');
                        setDiyMetric('Continuous PPG HR, SpO2 & Calories');
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Activity className="w-3 h-3 text-emerald-400" />
                      <span>🏃 Fitness Band / Tracker</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDiyName('ESP32 Health Node');
                        setDiyManufacturer('IoT Bio-Maker Lab');
                        setDiyCategory('custom_diy');
                        setDiyServiceUuid('0000180d-0000-1000-8000-00805f9b34fb');
                        setDiyMetric('Multi-Sensor Raw Bio-stream');
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Cpu className="w-3 h-3 text-indigo-400" />
                      <span>🔬 ESP32 / Arduino BLE</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">
                      Sensor Name / Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ESP32 Pulse Oximeter Lab #2"
                      value={diyName}
                      onChange={(e) => setDiyName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">
                      Manufacturer / Lab
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bioengineering Lab"
                      value={diyManufacturer}
                      onChange={(e) => setDiyManufacturer(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">
                      Sensor Form Factor
                    </label>
                    <select
                      value={diyCategory}
                      onChange={(e) => setDiyCategory(e.target.value as BluetoothSensorCategory)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="chest_strap">Chest Strap (ECG / RR)</option>
                      <option value="pulse_oximeter">Pulse Oximeter (SpO2)</option>
                      <option value="smartwatch">Smart Wristband</option>
                      <option value="continuous_glucose">Continuous Glucose Monitor</option>
                      <option value="environmental_beacon">Environmental Air Probe</option>
                      <option value="spirometer">Spirometry Flowmeter</option>
                      <option value="custom_diy">Custom DIY Sensor</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">
                      Primary GATT Service UUID
                    </label>
                    <input
                      type="text"
                      placeholder="0000180d-0000-1000-8000-00805f9b34fb"
                      value={diyServiceUuid}
                      onChange={(e) => setDiyServiceUuid(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[11px] placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">
                      Streaming Metrics Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Heart Rate, Galvanic Skin Response, Optical PM2.5"
                      value={diyMetric}
                      onChange={(e) => setDiyMetric(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePairDiyDevice}
                  disabled={!diyName.trim()}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Initiate Custom BLE Pairing Handshake</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* STEP 2: BLE GATT HANDSHAKE & SECURITY EXCHANGE */}
        {pairingStep === 'handshake' && selectedDevice && (
          <div className="py-8 space-y-6 text-center">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
              <div className="w-full h-full rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Bluetooth className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-bold text-white">
                Pairing with {selectedDevice.name}
              </h4>
              <p className="text-xs text-cyan-300 font-mono">
                {handshakeMessage}
              </p>
            </div>

            {/* Progress bar */}
            <div className="max-w-md mx-auto space-y-1.5">
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${handshakeProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>BLE 5.3 Physical Layer</span>
                <span>{handshakeProgress}% Complete</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3 max-w-md mx-auto rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AES-128 Encryption • Zero plaintext biometrics over-the-air</span>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIGURE SENSOR ATTRIBUTES */}
        {pairingStep === 'configure' && selectedDevice && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-300">
                  GATT Handshake Successful!
                </h4>
                <p className="text-[11px] text-slate-300">
                  {selectedDevice.name} is ready for integration. Configure your body placement and sampling interval.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Sensor Display Name */}
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Device Label / Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Body Placement Selector */}
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Body Placement Location
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'wrist', label: 'Wrist' },
                    { id: 'chest', label: 'Chest Strap' },
                    { id: 'finger', label: 'Finger Ring' },
                    { id: 'arm', label: 'Upper Arm' },
                    { id: 'belt', label: 'Belt / Pocket' },
                    { id: 'ambient', label: 'Ambient / Room' },
                  ].map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setSelectedPlacement(loc.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                        selectedPlacement === loc.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sampling Rate Interval */}
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Data Sampling & Telemetry Interval
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { sec: 1, label: 'Continuous (1s)', desc: 'Real-time ECG/HR' },
                    { sec: 5, label: 'High Res (5s)', desc: 'Balanced HRV' },
                    { sec: 10, label: 'Periodic (10s)', desc: 'Optimal Battery' },
                    { sec: 60, label: 'Power Saver (60s)', desc: 'Long-term' },
                  ].map((rate) => (
                    <button
                      key={rate.sec}
                      type="button"
                      onClick={() => setSelectedInterval(rate.sec)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedInterval === rate.sec
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="block text-xs font-bold text-white">{rate.label}</span>
                      <span className="block text-[10px] text-slate-400">{rate.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Streaming metrics summary */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-[11px] text-slate-400 block mb-1 font-mono uppercase">
                  Mapped Telemetry Channels
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDevice.streamingMetrics.map((metric) => (
                    <span
                      key={metric}
                      className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono"
                    >
                      ● {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPairingStep('scanning')}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
              >
                Back to Scan
              </button>
              <button
                type="button"
                onClick={handleConfirmPairing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save & Start Telemetry Stream</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS STATE */}
        {pairingStep === 'success' && selectedDevice && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Sensor Connected!</h3>
              <p className="text-xs text-slate-400">
                {customName || selectedDevice.name} is now actively transmitting real-time biometrics.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
