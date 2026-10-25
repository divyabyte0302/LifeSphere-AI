import { MedicalRecordItem, Medication, HealthMetrics, EnvironmentalData } from './index';
import { PatientTimelineEvent } from './doctor';

export type SyncStatus = 'SYNCED' | 'SYNCING' | 'OFFLINE' | 'CONFLICT' | 'NETWORK_ERROR';
export type DevicePlatform = 'android' | 'web';

export interface FirebaseSyncConfig {
  projectId: string;
  storageBucket: string;
  authDomain: string;
  databaseURL: string;
  appId: string;
  activeUserId: string;
}

export interface SyncAuditLog {
  id: string;
  timestamp: string;
  action:
    | 'UPLOAD_REPORT'
    | 'UPDATE_MEDICATION'
    | 'COMPLETE_CHECKUP'
    | 'SYNC_TELEMETRY'
    | 'INGEST_WEARABLE_BATCH'
    | 'RESOLVE_CONFLICT'
    | 'SUPPRESS_DUPLICATE'
    | 'OFFLINE_QUEUED'
    | 'OFFLINE_RECONCILED'
    | 'NETWORK_FAILOVER';
  originDevice: DevicePlatform;
  targetDevice: DevicePlatform;
  collection: string;
  documentId: string;
  details: string;
  version: number;
  payloadHash?: string;
  latencyMs: number;
}

export interface OfflineMutation {
  id: string;
  collection: 'medical_records' | 'medications' | 'checkups' | 'timeline' | 'health_snapshots' | 'health_measurements';
  documentId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: string;
  originDevice: DevicePlatform;
  version: number;
  retryCount: number;
}

export interface HealthMeasurementDoc {
  id: string;
  userId: string;
  user_id: string;
  measurementType: string;
  measurement_type: string;
  numericValue: number;
  numeric_value: number;
  secondaryValue?: number | null;
  secondary_value?: number | null;
  unit: string;
  measuredAt: string;
  measured_at: string;
  sourceProvider: string;
  source_provider: string;
  sourceDevice: string;
  source_device: string;
  sourceRecordId: string;
  source_record_id: string;
  provenance: Record<string, any>;
  isMissing: boolean;
  is_missing: boolean;
  qualityScore: number;
  quality_score: number;
  importedAt: string;
  imported_at: string;
}

export interface WearableBatchItem {
  sourceRecordId?: string;
  source_record_id?: string;
  measurementType?: string;
  measurement_type?: string;
  numericValue?: number;
  numeric_value?: number;
  secondaryValue?: number | null;
  secondary_value?: number | null;
  unit?: string;
  measuredAt?: string;
  measured_at?: string;
  sourceDeviceName?: string;
  source_device_name?: string;
  sourceDevice?: string;
  source_device?: string;
  provenanceMetadata?: Record<string, any>;
  provenance?: Record<string, any>;
  isMissing?: boolean;
  is_missing?: boolean;
  qualityScore?: number;
  quality_score?: number;
}

export interface SharedCheckupSubmission {
  id: string;
  userId: string;
  date: string;
  score: string;
  symptomSeverity: 'MILD' | 'MODERATE' | 'SEVERE';
  peakFlow: string;
  inhalerPuffsUsed: number;
  nocturnalAwakenings: number;
  submittedFrom: DevicePlatform;
  timestamp: string;
  doctorNotes?: string;
  version: number;
}
