import {
  SyncStatus,
  DevicePlatform,
  FirebaseSyncConfig,
  SyncAuditLog,
  OfflineMutation,
  SharedCheckupSubmission,
  HealthMeasurementDoc,
  WearableBatchItem,
} from '../types/sync';
import { MedicalRecordItem, Medication } from '../types';
import { PatientTimelineEvent } from '../types/doctor';

// 1. UNIFIED SHARED FIREBASE PROJECT CONFIGURATION
export const sharedFirebaseConfig: FirebaseSyncConfig = {
  projectId: 'lifesphere-ai-production',
  storageBucket: 'lifesphere-ai-production.firebasestorage.app',
  authDomain: 'lifesphere-ai-production.firebaseapp.com',
  databaseURL: 'https://lifesphere-ai-production-default-rtdb.firebaseio.com',
  appId: '1:999251586362:web:c45be9fc-a8f0-499e-8f6d-2365f44fe267',
  activeUserId: 'LS-8842',
};

// Initial Shared Health Measurements (Firestore /users/{uid}/health_measurements/{measurementId})
const initialSharedHealthMeasurements: HealthMeasurementDoc[] = [
  {
    id: 'wearable_android_health_connect_rec_spo2_01',
    userId: 'LS-8842',
    user_id: 'LS-8842',
    measurementType: 'spo2',
    measurement_type: 'spo2',
    numericValue: 98.4,
    numeric_value: 98.4,
    secondaryValue: null,
    secondary_value: null,
    unit: '%',
    measuredAt: '2026-10-25T05:30:00.000Z',
    measured_at: '2026-10-25T05:30:00.000Z',
    sourceProvider: 'android_health_connect',
    source_provider: 'android_health_connect',
    sourceDevice: 'Google Pixel 7 (Health Connect)',
    source_device: 'Google Pixel 7 (Health Connect)',
    sourceRecordId: 'rec_spo2_01',
    source_record_id: 'rec_spo2_01',
    provenance: { sensor: 'Optical Pulse Oximeter', accuracy: 'Clinical Grade' },
    isMissing: false,
    is_missing: false,
    qualityScore: 1.0,
    quality_score: 1.0,
    importedAt: '2026-10-25T05:31:00.000Z',
    imported_at: '2026-10-25T05:31:00.000Z',
  },
  {
    id: 'wearable_android_health_connect_rec_bp_01',
    userId: 'LS-8842',
    user_id: 'LS-8842',
    measurementType: 'blood_pressure',
    measurement_type: 'blood_pressure',
    numericValue: 118,
    numeric_value: 118,
    secondaryValue: 78,
    secondary_value: 78,
    unit: 'mmHg',
    measuredAt: '2026-10-25T05:25:00.000Z',
    measured_at: '2026-10-25T05:25:00.000Z',
    sourceProvider: 'android_health_connect',
    source_provider: 'android_health_connect',
    sourceDevice: 'Google Pixel 7 (Health Connect)',
    source_device: 'Google Pixel 7 (Health Connect)',
    sourceRecordId: 'rec_bp_01',
    source_record_id: 'rec_bp_01',
    provenance: { cuffType: 'Automatic Oscillometric' },
    isMissing: false,
    is_missing: false,
    qualityScore: 1.0,
    quality_score: 1.0,
    importedAt: '2026-10-25T05:26:00.000Z',
    imported_at: '2026-10-25T05:26:00.000Z',
  },
  {
    id: 'wearable_android_health_connect_rec_hr_01',
    userId: 'LS-8842',
    user_id: 'LS-8842',
    measurementType: 'heart_rate',
    measurement_type: 'heart_rate',
    numericValue: 72,
    numeric_value: 72,
    secondaryValue: null,
    secondary_value: null,
    unit: 'bpm',
    measuredAt: '2026-10-25T05:20:00.000Z',
    measured_at: '2026-10-25T05:20:00.000Z',
    sourceProvider: 'android_health_connect',
    source_provider: 'android_health_connect',
    sourceDevice: 'Google Pixel 7 (Health Connect)',
    source_device: 'Google Pixel 7 (Health Connect)',
    sourceRecordId: 'rec_hr_01',
    source_record_id: 'rec_hr_01',
    provenance: { PPG_channel: 'Green LED matrix' },
    isMissing: false,
    is_missing: false,
    qualityScore: 1.0,
    quality_score: 1.0,
    importedAt: '2026-10-25T05:21:00.000Z',
    imported_at: '2026-10-25T05:21:00.000Z',
  },
  {
    id: 'wearable_android_health_connect_rec_hrv_01',
    userId: 'LS-8842',
    user_id: 'LS-8842',
    measurementType: 'hrv',
    measurement_type: 'hrv',
    numericValue: 58,
    numeric_value: 58,
    secondaryValue: null,
    secondary_value: null,
    unit: 'ms',
    measuredAt: '2026-10-25T04:45:00.000Z',
    measured_at: '2026-10-25T04:45:00.000Z',
    sourceProvider: 'android_health_connect',
    source_provider: 'android_health_connect',
    sourceDevice: 'Google Pixel 7 (Health Connect)',
    source_device: 'Google Pixel 7 (Health Connect)',
    sourceRecordId: 'rec_hrv_01',
    source_record_id: 'rec_hrv_01',
    provenance: { RMSSD: true },
    isMissing: false,
    is_missing: false,
    qualityScore: 1.0,
    quality_score: 1.0,
    importedAt: '2026-10-25T04:46:00.000Z',
    imported_at: '2026-10-25T04:46:00.000Z',
  },
  {
    id: 'wearable_android_health_connect_rec_sleep_01',
    userId: 'LS-8842',
    user_id: 'LS-8842',
    measurementType: 'sleep_session',
    measurement_type: 'sleep_session',
    numericValue: 7.5,
    numeric_value: 7.5,
    secondaryValue: 1.8,
    secondary_value: 1.8,
    unit: 'hours',
    measuredAt: '2026-10-25T06:00:00.000Z',
    measured_at: '2026-10-25T06:00:00.000Z',
    sourceProvider: 'android_health_connect',
    source_provider: 'android_health_connect',
    sourceDevice: 'Google Pixel 7 (Health Connect)',
    source_device: 'Google Pixel 7 (Health Connect)',
    sourceRecordId: 'rec_sleep_01',
    source_record_id: 'rec_sleep_01',
    provenance: { deepSleepHours: 1.8, remSleepHours: 1.5, lightSleepHours: 4.2 },
    isMissing: false,
    is_missing: false,
    qualityScore: 1.0,
    quality_score: 1.0,
    importedAt: '2026-10-25T06:01:00.000Z',
    imported_at: '2026-10-25T06:01:00.000Z',
  },
  {
    id: 'wearable_android_health_connect_rec_temp_01',
    userId: 'LS-8842',
    user_id: 'LS-8842',
    measurementType: 'body_temperature',
    measurement_type: 'body_temperature',
    numericValue: 36.6,
    numeric_value: 36.6,
    secondaryValue: null,
    secondary_value: null,
    unit: '°C',
    measuredAt: '2026-10-25T05:00:00.000Z',
    measured_at: '2026-10-25T05:00:00.000Z',
    sourceProvider: 'android_health_connect',
    source_provider: 'android_health_connect',
    sourceDevice: 'Google Pixel 7 (Health Connect)',
    source_device: 'Google Pixel 7 (Health Connect)',
    sourceRecordId: 'rec_temp_01',
    source_record_id: 'rec_temp_01',
    provenance: { sensor: 'Infrared Skin Thermistor' },
    isMissing: false,
    is_missing: false,
    qualityScore: 1.0,
    quality_score: 1.0,
    importedAt: '2026-10-25T05:01:00.000Z',
    imported_at: '2026-10-25T05:01:00.000Z',
  },
];

// Initial Shared Medical Records (Firestore /medical_records/{recordId})
const initialSharedRecords: MedicalRecordItem[] = [
  {
    id: 'rec_01',
    title: 'Post-Bronchodilator Spirometry & FEV1 Panel',
    category: 'Spirometry',
    date: 'Sept 14, 2026',
    provider: 'Metro Pulmonary Clinic',
    fileName: 'pulmonary_spirometry_report.pdf',
    fileSize: '2.4 MB',
    summary: 'FEV1/FVC: 82%. Mild obstruction observed during elevated ambient ozone days.',
  },
  {
    id: 'rec_02',
    title: 'Comprehensive Metabolic & Lipid Panel',
    category: 'Lab Test',
    date: 'Aug 22, 2026',
    provider: 'Quest Diagnostics',
    fileName: 'metabolic_blood_panel.pdf',
    fileSize: '1.8 MB',
    summary: 'Normal fasting blood glucose, liver enzymes, electrolytes and hs-CRP inflammatory marker.',
  },
  {
    id: 'rec_03',
    title: 'Annual Seasonal Influenza & mRNA Vaccine',
    category: 'Vaccination',
    date: 'Aug 04, 2026',
    provider: 'City Health Immunization Hub',
    fileName: 'immunization_record.pdf',
    fileSize: '840 KB',
    summary: 'Quadrivalent seasonal influenza and booster recorded without adverse reaction.',
  },
];

// Initial Shared Medications (Firestore /medications/{medId})
const initialSharedMedications: Medication[] = [
  {
    id: 'med_01',
    name: 'Montelukast Sodium',
    dosage: '10mg',
    frequency: 'Once daily at bedtime',
    scheduledTimes: ['09:00 PM'],
    isTakenToday: true,
    notes: 'Leukotriene receptor antagonist for asthma & seasonal allergic rhinitis.',
  },
  {
    id: 'med_02',
    name: 'Omega-3 EPA/DHA',
    dosage: '1000mg',
    frequency: 'Twice daily with meals',
    scheduledTimes: ['08:00 AM', '07:00 PM'],
    isTakenToday: false,
    notes: 'Cardiovascular cellular membrane support & anti-inflammatory.',
  },
  {
    id: 'med_03',
    name: 'Doxycycline Hyclate',
    dosage: '100mg',
    frequency: 'Once daily with full glass of water',
    scheduledTimes: ['10:00 AM'],
    isTakenToday: true,
    notes: 'Short course antibiotic.',
    environmentalWarning: 'Photosensitivity: Avoid prolonged sun exposure while UV index exceeds 4.0.',
  },
];

// Initial Shared Timeline Events (Firestore /timeline/{eventId})
const initialSharedTimeline: PatientTimelineEvent[] = [
  {
    id: 'EVT-INIT-01',
    timestamp: '2026-09-28T07:15:00Z',
    title: 'Wearable Sync: Nocturnal SpO2 Equilibrium',
    category: 'PATIENT_LOG',
    authorType: 'PATIENT',
    authorName: 'Apple Watch Ultra BLE Stream',
    summary: 'Nocturnal SpO2 average 98.4%. Zero desaturation events recorded overnight.',
    isDoctorVerified: false,
  },
  {
    id: 'EVT-INIT-02',
    timestamp: '2026-09-27T18:30:00Z',
    title: 'Medication Adherence Logged (Web)',
    category: 'MEDICATION_CHANGE',
    authorType: 'PATIENT',
    authorName: 'Alex Mercer (Web)',
    summary: 'Montelukast Sodium 10mg taken on schedule.',
    isDoctorVerified: false,
  },
  {
    id: 'EVT-INIT-03',
    timestamp: '2026-09-26T11:00:00Z',
    title: 'Clinical Video Consultation Completed',
    category: 'CLINICAL_ORDER',
    authorType: 'DOCTOR',
    authorName: 'Dr. Sarah Vance, MD',
    summary: 'Reviewed spirometry curves. Prescribed Albuterol 90mcg pre-workout directive.',
    isDoctorVerified: true,
  },
];

// In-Memory Real-Time State Stores (Simulating shared Firestore instance)
class FirebaseSyncManager {
  private records: MedicalRecordItem[] = [...initialSharedRecords];
  private medications: Medication[] = [...initialSharedMedications];
  private timeline: PatientTimelineEvent[] = [...initialSharedTimeline];
  private checkups: SharedCheckupSubmission[] = [];
  private healthMeasurements: HealthMeasurementDoc[] = [...initialSharedHealthMeasurements];
  
  private documentVersions: Record<string, number> = {};
  private processedHashes: Set<string> = new Set(); // Duplicate detection window
  private offlineQueue: OfflineMutation[] = [];
  private auditLogs: SyncAuditLog[] = [];
  
  private isOnline: boolean = true;
  private syncStatus: SyncStatus = 'SYNCED';
  private lastSynchronizedAt: Date = new Date();

  // Listeners
  private recordListeners: Set<(records: MedicalRecordItem[]) => void> = new Set();
  private medicationListeners: Set<(meds: Medication[]) => void> = new Set();
  private timelineListeners: Set<(timeline: PatientTimelineEvent[]) => void> = new Set();
  private statusListeners: Set<(status: SyncStatus, lastSync: Date) => void> = new Set();
  private auditListeners: Set<(logs: SyncAuditLog[]) => void> = new Set();
  private healthMeasurementListeners: Set<(measurements: HealthMeasurementDoc[]) => void> = new Set();

  constructor() {
    // Initialize version counters
    this.records.forEach((r) => (this.documentVersions[`record_${r.id}`] = 1));
    this.medications.forEach((m) => (this.documentVersions[`med_${m.id}`] = 1));
    this.healthMeasurements.forEach((h) => (this.documentVersions[`health_measurement_${h.id}`] = 1));

    // Browser network listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleReconnection());
      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.syncStatus = 'OFFLINE';
        this.notifyStatus();
      });
    }

    // Log initialization event
    this.logSyncAction({
      action: 'SYNC_TELEMETRY',
      originDevice: 'web',
      targetDevice: 'android',
      collection: 'system',
      documentId: 'init',
      details: 'Dual-platform Firebase real-time listeners initialized for records, medications, checkups, and health_measurements.',
      version: 1,
      latencyMs: 14,
    });
  }

  // =========================================================================
  // LISTENER SUBSCRIPTION API (Firestore onSnapshot emulation)
  // =========================================================================

  public subscribeToRecords(cb: (records: MedicalRecordItem[]) => void): () => void {
    this.recordListeners.add(cb);
    cb([...this.records]);
    return () => this.recordListeners.delete(cb);
  }

  public subscribeToMedications(cb: (meds: Medication[]) => void): () => void {
    this.medicationListeners.add(cb);
    cb([...this.medications]);
    return () => this.medicationListeners.delete(cb);
  }

  public subscribeToTimeline(cb: (timeline: PatientTimelineEvent[]) => void): () => void {
    this.timelineListeners.add(cb);
    cb([...this.timeline]);
    return () => this.timelineListeners.delete(cb);
  }

  public subscribeToSyncStatus(cb: (status: SyncStatus, lastSync: Date) => void): () => void {
    this.statusListeners.add(cb);
    cb(this.syncStatus, this.lastSynchronizedAt);
    return () => this.statusListeners.delete(cb);
  }

  public subscribeToAuditLogs(cb: (logs: SyncAuditLog[]) => void): () => void {
    this.auditListeners.add(cb);
    cb([...this.auditLogs]);
    return () => this.auditListeners.delete(cb);
  }

  public subscribeToHealthMeasurements(cb: (measurements: HealthMeasurementDoc[]) => void): () => void {
    this.healthMeasurementListeners.add(cb);
    cb([...this.healthMeasurements]);
    return () => this.healthMeasurementListeners.delete(cb);
  }

  public getHealthMeasurements(userId?: string): HealthMeasurementDoc[] {
    const targetUid = userId || sharedFirebaseConfig.activeUserId;
    return this.healthMeasurements.filter((m) => m.userId === targetUid || m.user_id === targetUid);
  }

  private notifyRecords() {
    this.recordListeners.forEach((cb) => cb([...this.records]));
  }

  private notifyMedications() {
    this.medications;
    this.medicationListeners.forEach((cb) => cb([...this.medications]));
  }

  private notifyHealthMeasurements() {
    this.healthMeasurementListeners.forEach((cb) => cb([...this.healthMeasurements]));
  }

  private notifyTimeline() {
    this.timelineListeners.forEach((cb) => cb([...this.timeline]));
  }

  private notifyStatus() {
    this.statusListeners.forEach((cb) => cb(this.syncStatus, this.lastSynchronizedAt));
  }

  private notifyAudit() {
    this.auditListeners.forEach((cb) => cb([...this.auditLogs]));
  }

  // =========================================================================
  // CORE OPERATIONS (WITH DUPLICATE, CONFLICT, & OFFLINE HANDLING)
  // =========================================================================

  /**
   * Example 1: User uploads a report on Android.
   * The website must immediately show the uploaded report metadata.
   */
  public async uploadReport({
    origin,
    title,
    category,
    provider,
    fileName,
    fileSize,
    summary,
  }: {
    origin: DevicePlatform;
    title: string;
    category: MedicalRecordItem['category'];
    provider: string;
    fileName: string;
    fileSize: string;
    summary: string;
  }): Promise<{ success: boolean; record: MedicalRecordItem; message: string }> {
    const startTime = performance.now();
    const payloadHash = `hash_${title}_${category}_${fileName}_${fileSize}`;

    // 1. Duplicate updates check
    if (this.processedHashes.has(payloadHash)) {
      this.logSyncAction({
        action: 'SUPPRESS_DUPLICATE',
        originDevice: origin,
        targetDevice: origin === 'android' ? 'web' : 'android',
        collection: 'medical_records',
        documentId: payloadHash,
        details: `Duplicate upload submission suppressed for "${title}".`,
        version: 0,
        payloadHash,
        latencyMs: Math.round(performance.now() - startTime),
      });
      return {
        success: false,
        record: this.records[0],
        message: 'Duplicate update detected and suppressed.',
      };
    }
    this.processedHashes.add(payloadHash);

    const newRecordId = `rec_${Date.now()}`;
    const newRecord: MedicalRecordItem = {
      id: newRecordId,
      title,
      category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      provider,
      fileName,
      fileSize,
      summary,
    };

    // 2. Offline handling
    if (!this.isOnline) {
      this.offlineQueue.push({
        id: `mut_${Date.now()}`,
        collection: 'medical_records',
        documentId: newRecordId,
        operation: 'CREATE',
        payload: newRecord,
        timestamp: new Date().toISOString(),
        originDevice: origin,
        version: 1,
        retryCount: 0,
      });

      this.syncStatus = 'OFFLINE';
      this.logSyncAction({
        action: 'OFFLINE_QUEUED',
        originDevice: origin,
        targetDevice: origin === 'android' ? 'web' : 'android',
        collection: 'medical_records',
        documentId: newRecordId,
        details: `Offline: Queued report upload "${title}" for background sync.`,
        version: 1,
        latencyMs: Math.round(performance.now() - startTime),
      });
      
      // Optimistically update local view
      this.records = [newRecord, ...this.records];
      this.notifyRecords();
      this.notifyStatus();
      return {
        success: true,
        record: newRecord,
        message: 'Report saved offline. Will synchronize when online.',
      };
    }

    // 3. Online: Real-time write to shared Firestore
    this.syncStatus = 'SYNCING';
    this.notifyStatus();

    // Simulate network latency (25-50ms)
    await new Promise((r) => setTimeout(r, 40));

    this.documentVersions[`record_${newRecordId}`] = 1;
    this.records = [newRecord, ...this.records];
    
    // Also push a notification/timeline event for cross-platform visibility
    const timelineEvent: PatientTimelineEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      title: `Report Uploaded (${origin === 'android' ? 'Android' : 'Web'})`,
      category: 'DIAGNOSTIC_REPORT',
      authorType: 'PATIENT',
      authorName: `Patient (${origin === 'android' ? 'Android Mobile' : 'Web Platform'})`,
      summary: `Diagnostic document "${title}" uploaded. Storage: medical_records/LS-8842/${fileName}`,
      isDoctorVerified: false,
    };
    this.timeline = [timelineEvent, ...this.timeline];

    this.lastSynchronizedAt = new Date();
    this.syncStatus = 'SYNCED';

    this.notifyRecords();
    this.notifyTimeline();
    this.notifyStatus();

    const latency = Math.round(performance.now() - startTime);
    this.logSyncAction({
      action: 'UPLOAD_REPORT',
      originDevice: origin,
      targetDevice: origin === 'android' ? 'web' : 'android',
      collection: 'medical_records',
      documentId: newRecordId,
      details: `Report "${title}" synced from ${origin} to ${origin === 'android' ? 'Web' : 'Android'} in real time.`,
      version: 1,
      latencyMs: latency,
    });

    return {
      success: true,
      record: newRecord,
      message: `Report synchronized in real time to ${origin === 'android' ? 'Web' : 'Android'} (${latency}ms).`,
    };
  }

  /**
   * Example 2: User updates medication on website.
   * Android must show the updated medication.
   */
  public async updateMedication({
    origin,
    medicationId,
    isTakenToday,
    dosage,
  }: {
    origin: DevicePlatform;
    medicationId: string;
    isTakenToday?: boolean;
    dosage?: string;
  }): Promise<{ success: boolean; medication: Medication; message: string }> {
    const startTime = performance.now();
    const existing = this.medications.find((m) => m.id === medicationId);
    if (!existing) {
      throw new Error(`Medication not found: ${medicationId}`);
    }

    const currentVer = this.documentVersions[`med_${medicationId}`] || 1;
    const nextVer = currentVer + 1;

    const updatedMed: Medication = {
      ...existing,
      isTakenToday: isTakenToday !== undefined ? isTakenToday : existing.isTakenToday,
      dosage: dosage !== undefined ? dosage : existing.dosage,
    };

    // Offline handling
    if (!this.isOnline) {
      this.offlineQueue.push({
        id: `mut_${Date.now()}`,
        collection: 'medications',
        documentId: medicationId,
        operation: 'UPDATE',
        payload: updatedMed,
        timestamp: new Date().toISOString(),
        originDevice: origin,
        version: nextVer,
        retryCount: 0,
      });

      this.medications = this.medications.map((m) => (m.id === medicationId ? updatedMed : m));
      this.syncStatus = 'OFFLINE';
      this.notifyMedications();
      this.notifyStatus();

      return {
        success: true,
        medication: updatedMed,
        message: 'Medication update saved locally. Queued for background sync.',
      };
    }

    this.syncStatus = 'SYNCING';
    this.notifyStatus();

    await new Promise((r) => setTimeout(r, 35));

    this.documentVersions[`med_${medicationId}`] = nextVer;
    this.medications = this.medications.map((m) => (m.id === medicationId ? updatedMed : m));

    // Timeline event
    const timelineEvent: PatientTimelineEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      title: `Medication Updated (${origin === 'web' ? 'Web' : 'Android'})`,
      category: 'MEDICATION_CHANGE',
      authorType: 'PATIENT',
      authorName: `Patient (${origin === 'web' ? 'Web SaaS' : 'Android Mobile'})`,
      summary: `${updatedMed.name} status updated: ${updatedMed.isTakenToday ? 'Taken' : 'Pending'}. Dose: ${updatedMed.dosage}`,
      isDoctorVerified: false,
    };
    this.timeline = [timelineEvent, ...this.timeline];

    this.lastSynchronizedAt = new Date();
    this.syncStatus = 'SYNCED';

    this.notifyMedications();
    this.notifyTimeline();
    this.notifyStatus();

    const latency = Math.round(performance.now() - startTime);
    this.logSyncAction({
      action: 'UPDATE_MEDICATION',
      originDevice: origin,
      targetDevice: origin === 'web' ? 'android' : 'web',
      collection: 'medications',
      documentId: medicationId,
      details: `Medication "${updatedMed.name}" synced to ${origin === 'web' ? 'Android' : 'Web'} (v${nextVer}).`,
      version: nextVer,
      latencyMs: latency,
    });

    return {
      success: true,
      medication: updatedMed,
      message: `Medication synchronized in real time to ${origin === 'web' ? 'Android' : 'Web'} (${latency}ms).`,
    };
  }

  /**
   * Example 3: User completes a check-up on Android.
   * Website must show the updated timeline.
   */
  public async completeCheckup({
    origin,
    symptomSeverity,
    peakFlow,
    inhalerPuffsUsed,
    nocturnalAwakenings,
  }: {
    origin: DevicePlatform;
    symptomSeverity: 'MILD' | 'MODERATE' | 'SEVERE';
    peakFlow: string;
    inhalerPuffsUsed: number;
    nocturnalAwakenings: number;
  }): Promise<{ success: boolean; submission: SharedCheckupSubmission; message: string }> {
    const startTime = performance.now();
    const checkupId = `chk_${Date.now()}`;

    const submission: SharedCheckupSubmission = {
      id: checkupId,
      userId: sharedFirebaseConfig.activeUserId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      score: symptomSeverity === 'MILD' ? '23 / 25 (Well-Controlled)' : symptomSeverity === 'MODERATE' ? '19 / 25 (Partially Controlled)' : '14 / 25 (Poor Control)',
      symptomSeverity,
      peakFlow,
      inhalerPuffsUsed,
      nocturnalAwakenings,
      submittedFrom: origin,
      timestamp: new Date().toISOString(),
      doctorNotes: 'Auto-routed to Dr. Sarah Vance for clinical review and monthly sign-off.',
      version: 1,
    };

    // Offline handling
    if (!this.isOnline) {
      this.offlineQueue.push({
        id: `mut_${Date.now()}`,
        collection: 'checkups',
        documentId: checkupId,
        operation: 'CREATE',
        payload: submission,
        timestamp: new Date().toISOString(),
        originDevice: origin,
        version: 1,
        retryCount: 0,
      });

      this.checkups = [submission, ...this.checkups];
      this.syncStatus = 'OFFLINE';
      this.notifyStatus();

      return {
        success: true,
        submission,
        message: 'Check-up recorded offline. Will sync when reconnected.',
      };
    }

    this.syncStatus = 'SYNCING';
    this.notifyStatus();

    await new Promise((r) => setTimeout(r, 45));

    this.checkups = [submission, ...this.checkups];

    // The website must immediately show the updated timeline!
    const timelineEvent: PatientTimelineEvent = {
      id: `EVT-CHK-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      title: `Monthly Check-Up Completed (${origin === 'android' ? 'Android' : 'Web'})`,
      category: 'CHECKUP_COMPLETED' as any,
      authorType: 'PATIENT',
      authorName: `Patient (${origin === 'android' ? 'Android Mobile' : 'Web Platform'})`,
      summary: `Score: ${submission.score}. Peak Flow: ${peakFlow}. Inhaler: ${inhalerPuffsUsed} puffs. Severity: ${symptomSeverity}.`,
      isDoctorVerified: false,
    };
    this.timeline = [timelineEvent, ...this.timeline];

    this.lastSynchronizedAt = new Date();
    this.syncStatus = 'SYNCED';

    this.notifyTimeline();
    this.notifyStatus();

    const latency = Math.round(performance.now() - startTime);
    this.logSyncAction({
      action: 'COMPLETE_CHECKUP',
      originDevice: origin,
      targetDevice: origin === 'android' ? 'web' : 'android',
      collection: 'checkups',
      documentId: checkupId,
      details: `Check-up completed on ${origin}. Website timeline and clinical records updated in real time.`,
      version: 1,
      latencyMs: latency,
    });

    return {
      success: true,
      submission,
      message: `Check-up synchronized to Website timeline in real time (${latency}ms).`,
    };
  }

  /**
   * Batch ingestion flow for multi-type wearable measurements (SpO2, blood pressure, heart rate, HRV, sleep, body temp, etc.).
   * Processes records idempotently, handles offline queueing, maps fields cleanly to Firestore health measurement schema,
   * updates live subscriber state, and logs sync audit entries.
   */
  public async ingestWearableBatch({
    userId,
    connectionId,
    provider = 'android_health_connect',
    origin = 'android',
    measurements,
  }: {
    userId?: string;
    connectionId?: string;
    provider?: string;
    origin?: DevicePlatform;
    measurements: WearableBatchItem[];
  }): Promise<{
    success: boolean;
    status: 'success' | 'partial_success' | 'failed';
    recordsImported: number;
    recordsSkippedDuplicate: number;
    recordsFailed: number;
    importedMeasurements: HealthMeasurementDoc[];
    message: string;
  }> {
    const startTime = performance.now();
    const targetUserId = userId || sharedFirebaseConfig.activeUserId;
    const connId = connectionId || `conn_${provider}_${targetUserId.slice(-4)}`;

    let recordsImported = 0;
    let recordsSkippedDuplicate = 0;
    let recordsFailed = 0;
    const newlyImported: HealthMeasurementDoc[] = [];

    for (const item of measurements) {
      try {
        const rawRecId =
          item.sourceRecordId ||
          item.source_record_id ||
          `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const typeStr = item.measurementType || item.measurement_type || 'heart_rate';
        const numVal =
          item.numericValue !== undefined
            ? item.numericValue
            : item.numeric_value !== undefined
            ? item.numeric_value
            : 0;
        const secVal =
          item.secondaryValue !== undefined
            ? item.secondaryValue
            : item.secondary_value !== undefined
            ? item.secondary_value
            : null;

        // Standardize units per record type if unspecified
        let unitStr = item.unit;
        if (!unitStr) {
          switch (typeStr.toLowerCase()) {
            case 'spo2':
              unitStr = '%';
              break;
            case 'blood_pressure':
              unitStr = 'mmHg';
              break;
            case 'heart_rate':
            case 'resting_heart_rate':
              unitStr = 'bpm';
              break;
            case 'hrv':
              unitStr = 'ms';
              break;
            case 'sleep_session':
              unitStr = 'hours';
              break;
            case 'body_temperature':
            case 'skin_temperature':
              unitStr = '°C';
              break;
            case 'steps':
              unitStr = 'count';
              break;
            case 'active_calories':
              unitStr = 'kcal';
              break;
            case 'respiratory_rate':
              unitStr = 'breaths/min';
              break;
            case 'stress_level':
              unitStr = 'score';
              break;
            case 'distance_meters':
              unitStr = 'm';
              break;
            case 'exercise_session':
              unitStr = 'mins';
              break;
            default:
              unitStr = 'units';
              break;
          }
        }

        const stableDocId = `wearable_${provider}_${rawRecId}`;
        const payloadHash = `hash_${provider}_${typeStr}_${rawRecId}_${numVal}_${secVal || ''}`;

        // Deduplication check via stable document ID or payload hash window
        const existingInStore = this.healthMeasurements.some(
          (m) =>
            m.id === stableDocId ||
            m.sourceRecordId === rawRecId ||
            m.source_record_id === rawRecId
        );
        if (this.processedHashes.has(payloadHash) || existingInStore) {
          recordsSkippedDuplicate++;
          continue;
        }
        this.processedHashes.add(payloadHash);

        const timestampIso = item.measuredAt || item.measured_at || new Date().toISOString();
        const devName =
          item.sourceDeviceName ||
          item.source_device_name ||
          item.sourceDevice ||
          item.source_device ||
          `${provider.replace('_', ' ').toUpperCase()} Sensor`;

        const healthDoc: HealthMeasurementDoc = {
          id: stableDocId,
          userId: targetUserId,
          user_id: targetUserId,
          measurementType: typeStr,
          measurement_type: typeStr,
          numericValue: numVal,
          numeric_value: numVal,
          secondaryValue: secVal,
          secondary_value: secVal,
          unit: unitStr,
          measuredAt: timestampIso,
          measured_at: timestampIso,
          sourceProvider: provider,
          source_provider: provider,
          sourceDevice: devName,
          source_device: devName,
          sourceRecordId: rawRecId,
          source_record_id: rawRecId,
          provenance: item.provenanceMetadata || item.provenance || { ingestedVia: 'firebaseSyncService' },
          isMissing: item.isMissing || item.is_missing || false,
          is_missing: item.isMissing || item.is_missing || false,
          qualityScore:
            item.qualityScore !== undefined
              ? item.qualityScore
              : item.quality_score !== undefined
              ? item.quality_score
              : 1.0,
          quality_score:
            item.qualityScore !== undefined
              ? item.qualityScore
              : item.quality_score !== undefined
              ? item.quality_score
              : 1.0,
          importedAt: new Date().toISOString(),
          imported_at: new Date().toISOString(),
        };

        // Offline queueing if disconnected
        if (!this.isOnline) {
          this.offlineQueue.push({
            id: `mut_${Date.now()}_${recordsImported}`,
            collection: 'health_measurements',
            documentId: stableDocId,
            operation: 'CREATE',
            payload: healthDoc,
            timestamp: new Date().toISOString(),
            originDevice: origin,
            version: 1,
            retryCount: 0,
          });
        }

        this.healthMeasurements.unshift(healthDoc);
        newlyImported.push(healthDoc);
        recordsImported++;
      } catch (err) {
        recordsFailed++;
      }
    }

    const latency = Math.round(performance.now() - startTime);
    const statusStr =
      recordsFailed === 0
        ? 'success'
        : recordsImported > 0
        ? 'partial_success'
        : 'failed';

    if (recordsImported > 0) {
      const typesSummary = Array.from(new Set(newlyImported.map((m) => m.measurementType))).join(', ');
      const timelineEvent: PatientTimelineEvent = {
        id: `EVT-WEARABLE-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        title: `Wearable Batch Synchronized (${origin === 'android' ? 'Android Health Connect' : 'Web SaaS'})`,
        category: 'PATIENT_LOG',
        authorType: 'PATIENT',
        authorName: `${provider} Stream`,
        summary: `Batch ingestion complete: ${recordsImported} imported records (${typesSummary}). Idempotently mapped to /users/${targetUserId}/health_measurements.`,
        isDoctorVerified: false,
      };
      this.timeline = [timelineEvent, ...this.timeline];
      this.notifyTimeline();
    }

    this.lastSynchronizedAt = new Date();
    this.syncStatus = this.isOnline ? 'SYNCED' : 'OFFLINE';

    this.notifyHealthMeasurements();
    this.notifyStatus();

    this.logSyncAction({
      action: 'INGEST_WEARABLE_BATCH',
      originDevice: origin,
      targetDevice: origin === 'android' ? 'web' : 'android',
      collection: `users/${targetUserId}/health_measurements`,
      documentId: connId,
      details: `Ingested ${recordsImported} wearable measurements (${recordsSkippedDuplicate} duplicates skipped) into Firestore health_measurements.`,
      version: 1,
      latencyMs: latency,
    });

    return {
      success: recordsFailed === 0 || recordsImported > 0,
      status: statusStr,
      recordsImported,
      recordsSkippedDuplicate,
      recordsFailed,
      importedMeasurements: newlyImported,
      message: `Ingested ${recordsImported} health records into Firestore /users/${targetUserId}/health_measurements.`,
    };
  }

  // =========================================================================
  // NETWORK & RECONCILIATION HANDLING (Offline, Reconnect, Conflicts)
  // =========================================================================

  public toggleNetworkState(online?: boolean) {
    this.isOnline = online !== undefined ? online : !this.isOnline;
    if (this.isOnline) {
      this.handleReconnection();
    } else {
      this.syncStatus = 'OFFLINE';
      this.notifyStatus();
      this.logSyncAction({
        action: 'NETWORK_FAILOVER',
        originDevice: 'web',
        targetDevice: 'android',
        collection: 'network',
        documentId: 'offline',
        details: 'Simulated network disconnection. Offline mutation queue active.',
        version: 0,
        latencyMs: 1,
      });
    }
  }

  public async handleReconnection() {
    this.isOnline = true;
    this.syncStatus = 'SYNCING';
    this.notifyStatus();

    if (this.offlineQueue.length === 0) {
      this.lastSynchronizedAt = new Date();
      this.syncStatus = 'SYNCED';
      this.notifyStatus();
      return;
    }

    const queuedCount = this.offlineQueue.length;
    await new Promise((r) => setTimeout(r, 60));

    // Replay queued mutations with conflict resolution
    while (this.offlineQueue.length > 0) {
      const mut = this.offlineQueue.shift();
      if (!mut) break;

      const currentVer = this.documentVersions[`${mut.collection}_${mut.documentId}`] || 0;
      if (mut.version <= currentVer) {
        // Conflict detected: Last-Write-Wins with deterministic merge
        this.logSyncAction({
          action: 'RESOLVE_CONFLICT',
          originDevice: mut.originDevice,
          targetDevice: 'web',
          collection: mut.collection,
          documentId: mut.documentId,
          details: `Conflict detected for ${mut.collection}/${mut.documentId}. Resolved via server-timestamp LWW.`,
          version: currentVer + 1,
          latencyMs: 12,
        });
      }

      this.documentVersions[`${mut.collection}_${mut.documentId}`] = currentVer + 1;
    }

    this.lastSynchronizedAt = new Date();
    this.syncStatus = 'SYNCED';

    this.notifyRecords();
    this.notifyMedications();
    this.notifyTimeline();
    this.notifyHealthMeasurements();
    this.notifyStatus();

    this.logSyncAction({
      action: 'OFFLINE_RECONCILED',
      originDevice: 'web',
      targetDevice: 'android',
      collection: 'queue',
      documentId: `reconciled_${queuedCount}`,
      details: `Reconnected: Reconciled ${queuedCount} offline mutations seamlessly with Firestore.`,
      version: 1,
      latencyMs: 45,
    });
  }

  // =========================================================================
  // SIMULATION TESTING HELPERS FOR ALL EXAMPLES
  // =========================================================================

  public async simulateAndroidUploadReport() {
    return this.uploadReport({
      origin: 'android',
      title: 'Post-Exertional Spirometry Curve (Android BLE)',
      category: 'Spirometry',
      provider: 'Mobile Bluetooth Spirometer Hub',
      fileName: `spirometry_android_${Date.now().toString().slice(-4)}.pdf`,
      fileSize: '1.4 MB',
      summary: 'FEV1 recorded at 91% predicted during outdoor conditioning.',
    });
  }

  public async simulateWebUpdateMedication() {
    const medId = this.medications[0]?.id || 'med_01';
    const current = this.medications[0];
    return this.updateMedication({
      origin: 'web',
      medicationId: medId,
      isTakenToday: !current?.isTakenToday,
      dosage: current?.dosage || '10mg',
    });
  }

  public async simulateAndroidCompleteCheckup() {
    return this.completeCheckup({
      origin: 'android',
      symptomSeverity: 'MILD',
      peakFlow: '530 L/min',
      inhalerPuffsUsed: 1,
      nocturnalAwakenings: 0,
    });
  }

  public async simulateAndroidWearableBatchSync() {
    const sampleBatch: WearableBatchItem[] = [
      {
        sourceRecordId: `rec_spo2_${Date.now()}`,
        measurementType: 'spo2',
        numericValue: 98.6,
        unit: '%',
        measuredAt: new Date().toISOString(),
        sourceDeviceName: 'Google Pixel Watch 2 (Health Connect)',
        provenanceMetadata: { sensor: 'Optical Pulse Ox', mode: 'Continuous Nocturnal' },
        qualityScore: 0.98,
      },
      {
        sourceRecordId: `rec_bp_${Date.now()}`,
        measurementType: 'blood_pressure',
        numericValue: 120,
        secondaryValue: 80,
        unit: 'mmHg',
        measuredAt: new Date().toISOString(),
        sourceDeviceName: 'Omron Platinum BLE Cuff',
        provenanceMetadata: { cuffLocation: 'Left Upper Arm' },
        qualityScore: 1.0,
      },
      {
        sourceRecordId: `rec_hrv_${Date.now()}`,
        measurementType: 'hrv',
        numericValue: 62,
        unit: 'ms',
        measuredAt: new Date().toISOString(),
        sourceDeviceName: 'Google Pixel Watch 2 (Health Connect)',
        provenanceMetadata: { metric: 'rMSSD' },
        qualityScore: 0.95,
      },
      {
        sourceRecordId: `rec_sleep_${Date.now()}`,
        measurementType: 'sleep_session',
        numericValue: 7.8,
        secondaryValue: 2.1,
        unit: 'hours',
        measuredAt: new Date().toISOString(),
        sourceDeviceName: 'Google Pixel Watch 2 (Health Connect)',
        provenanceMetadata: { deepSleep: '2.1 hrs', remSleep: '1.8 hrs' },
        qualityScore: 1.0,
      },
      {
        sourceRecordId: `rec_temp_${Date.now()}`,
        measurementType: 'body_temperature',
        numericValue: 36.7,
        unit: '°C',
        measuredAt: new Date().toISOString(),
        sourceDeviceName: 'Google Pixel Watch 2 (Health Connect)',
        provenanceMetadata: { sensor: 'Skin Temperature Sensor' },
        qualityScore: 0.99,
      },
    ];

    return this.ingestWearableBatch({
      provider: 'android_health_connect',
      origin: 'android',
      measurements: sampleBatch,
    });
  }

  // =========================================================================
  // HELPERS & AUDIT LOGGING
  // =========================================================================

  private logSyncAction(entry: Omit<SyncAuditLog, 'id' | 'timestamp'>) {
    const newLog: SyncAuditLog = {
      ...entry,
      id: `LOG-SYNC-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs = [newLog, ...this.auditLogs.slice(0, 49)];
    this.notifyAudit();
  }

  public syncHydrationLog(entry: {
    id: string;
    volumeMl: number;
    effectiveMl: number;
    beverageType: string;
    timestamp: string;
    userId?: string;
  }): void {
    const uid = entry.userId || sharedFirebaseConfig.activeUserId || 'LS-8842';
    this.logSyncAction({
      action: 'SYNC_TELEMETRY',
      originDevice: 'web',
      targetDevice: 'android',
      collection: `users/${uid}/hydration`,
      documentId: entry.id,
      details: `Persisted ${entry.volumeMl}ml ${entry.beverageType} (${entry.effectiveMl}ml effective) to users/${uid}/hydration/${entry.id}.`,
      version: 1,
      payloadHash: `hash_hydro_${entry.id}`,
      latencyMs: 14,
    });
  }

  public getFormattedLastSync(): string {
    const now = new Date();
    const diffSecs = Math.round((now.getTime() - this.lastSynchronizedAt.getTime()) / 1000);
    if (diffSecs < 5) return 'Just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    return this.lastSynchronizedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  public getSnapshot() {
    return {
      isOnline: this.isOnline,
      syncStatus: this.syncStatus,
      lastSynchronizedAt: this.lastSynchronizedAt,
      formattedLastSync: this.getFormattedLastSync(),
      queuedCount: this.offlineQueue.length,
      recordCount: this.records.length,
      medicationCount: this.medications.length,
      timelineCount: this.timeline.length,
      healthMeasurementCount: this.healthMeasurements.length,
      records: [...this.records],
      medications: [...this.medications],
      timeline: [...this.timeline],
      healthMeasurements: [...this.healthMeasurements],
      auditLogs: [...this.auditLogs],
    };
  }
}

export const firebaseSyncService = new FirebaseSyncManager();
