export type BluetoothSensorCategory =
  | 'smartwatch'
  | 'smart_ring'
  | 'chest_strap'
  | 'pulse_oximeter'
  | 'continuous_glucose'
  | 'environmental_beacon'
  | 'smart_patch'
  | 'spirometer'
  | 'custom_diy';

export type BluetoothConnectionState = 'connected' | 'streaming' | 'standby' | 'disconnected';

export interface BluetoothGattCharacteristic {
  uuid: string;
  name: string;
  properties: ('read' | 'write' | 'notify' | 'indicate')[];
  lastValue?: string | number;
  unit?: string;
}

export interface BluetoothGattService {
  uuid: string;
  name: string;
  characteristics: BluetoothGattCharacteristic[];
}

export interface WearableSensorDevice {
  id: string;
  name: string;
  manufacturer: string;
  category: BluetoothSensorCategory;
  model: string;
  bleVersion: 'BLE 4.2' | 'BLE 5.0' | 'BLE 5.1' | 'BLE 5.2' | 'BLE 5.3' | 'BLE 5.4';
  macAddress: string;
  batteryLevel: number; // 0-100%
  signalStrength: number; // RSSI dBm e.g. -54
  status: BluetoothConnectionState;
  streamingMetrics: string[]; // e.g. ['Heart Rate', 'ECG', 'SpO2']
  lastSyncTimestamp: string;
  samplingIntervalSeconds: number;
  placement: 'wrist' | 'chest' | 'finger' | 'arm' | 'ear' | 'belt' | 'ambient';
  firmwareVersion: string;
  liveTelemetry: {
    primaryMetric: string;
    primaryValue: number | string;
    unit: string;
    trend?: 'up' | 'down' | 'stable';
    secondaryMetric?: string;
    secondaryValue?: number | string;
    secondaryUnit?: string;
  };
  gattServices: BluetoothGattService[];
  isCustomDevice?: boolean;
}

export interface DiscoveredBleDevice {
  id: string;
  name: string;
  manufacturer: string;
  category: BluetoothSensorCategory;
  model: string;
  bleVersion: 'BLE 4.2' | 'BLE 5.0' | 'BLE 5.1' | 'BLE 5.2' | 'BLE 5.3' | 'BLE 5.4';
  macAddress: string;
  signalStrength: number; // RSSI dBm
  advertisedServices: string[];
  batteryLevel: number;
  defaultPlacement: 'wrist' | 'chest' | 'finger' | 'arm' | 'ear' | 'belt' | 'ambient';
  streamingMetrics: string[];
  pairingSecurity: 'Just Works' | 'Passkey (PIN)' | 'Numeric Comparison' | 'OOB (NFC)';
  defaultGattServices: BluetoothGattService[];
}
