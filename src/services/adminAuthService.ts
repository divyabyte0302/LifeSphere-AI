import {
  AdminUser,
  SystemHealthMetrics,
  ApiEndpointHealth,
  AiServiceStatus,
  StorageMetrics,
  SecurityEvent,
  SupportTicket,
  SystemConfig,
  AdminNotification,
  UserRole
} from '../types/admin';

export interface FirebaseTokenClaims {
  role: UserRole;
  admin: boolean;
  doctor: boolean;
  user: boolean;
  emailVerified: boolean;
  mfaAuthenticated: boolean;
  iss: string;
  sub: string;
  aud: string;
}

export interface CurrentAdminAuth {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  claims: FirebaseTokenClaims;
}

// Initial Admin User (Matches the runtime user email)
let currentAuth: CurrentAdminAuth = {
  uid: 'usr_admin_001',
  email: 'divya03022005@gmail.com',
  displayName: 'Divya (System Administrator)',
  role: 'ADMIN',
  claims: {
    role: 'ADMIN',
    admin: true,
    doctor: false,
    user: false,
    emailVerified: true,
    mfaAuthenticated: true,
    iss: 'https://securetoken.google.com/lifesphere-ai-prod',
    sub: 'usr_admin_001',
    aud: 'lifesphere-ai-prod',
  },
};

// Listeners for auth state changes
const authListeners: Array<(auth: CurrentAdminAuth) => void> = [];

export const AdminAuthService = {
  getCurrentAuth(): CurrentAdminAuth {
    return currentAuth;
  },

  subscribe(listener: (auth: CurrentAdminAuth) => void): () => void {
    authListeners.push(listener);
    listener(currentAuth);
    return () => {
      const idx = authListeners.indexOf(listener);
      if (idx !== -1) authListeners.splice(idx, 1);
    };
  },

  /**
   * Set user role simulation to test Route-Based Access Control (RBAC)
   * Easily toggle between ADMIN (authorized), DOCTOR (unauthorized for admin), and USER (unauthorized)
   */
  switchRole(newRole: UserRole): CurrentAdminAuth {
    const isAdmin = newRole === 'ADMIN';
    const isDoctor = newRole === 'DOCTOR';
    const isUser = newRole === 'USER';

    currentAuth = {
      ...currentAuth,
      role: newRole,
      displayName: isAdmin
        ? 'Divya (System Administrator)'
        : isDoctor
        ? 'Dr. Sarah Vance, MD (Cardiologist)'
        : 'Alex Mercer (Patient)',
      claims: {
        ...currentAuth.claims,
        role: newRole,
        admin: isAdmin,
        doctor: isDoctor,
        user: isUser,
      },
    };

    authListeners.forEach((l) => l(currentAuth));
    return currentAuth;
  },

  /**
   * Verifies if the authenticated session has the verified ADMIN role claim
   */
  hasAdminClaim(): boolean {
    return currentAuth.role === 'ADMIN' && currentAuth.claims.admin === true;
  },

  hasDoctorClaim(): boolean {
    return currentAuth.role === 'DOCTOR' && currentAuth.claims.doctor === true;
  },
};

// Initial Seed Data for System Management
export const initialAdminUsers: AdminUser[] = [
  {
    id: 'USR-8842',
    email: 'alex.mercer@example.com',
    displayName: 'Alex Mercer',
    role: 'USER',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-08-12T09:30:00Z',
    lastLogin: '2026-09-28T05:42:00Z',
    assignedDoctorId: 'DOC-4102',
    assignedClinic: 'Stanford Comprehensive Pulmonary Care',
    deviceType: 'Android Pixel',
    mfaEnabled: true,
  },
  {
    id: 'USR-9021',
    email: 'maria.gonzalez@example.com',
    displayName: 'Maria Gonzalez',
    role: 'USER',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-07-22T14:15:00Z',
    lastLogin: '2026-09-27T19:22:00Z',
    assignedDoctorId: 'DOC-4102',
    assignedClinic: 'UCSF Environmental Medicine',
    deviceType: 'iPhone iOS',
    mfaEnabled: false,
  },
  {
    id: 'DOC-4102',
    email: 'dr.sarah.vance@lifesphere.org',
    displayName: 'Dr. Sarah Vance, MD',
    role: 'DOCTOR',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-06-01T08:00:00Z',
    lastLogin: '2026-09-28T04:15:00Z',
    assignedClinic: 'Bay Area Respiratory Consortium',
    deviceType: 'macOS Safari',
    mfaEnabled: true,
  },
  {
    id: 'DOC-5519',
    email: 'dr.marcus.chen@lifesphere.org',
    displayName: 'Dr. Marcus Chen, MD',
    role: 'DOCTOR',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-06-15T11:20:00Z',
    lastLogin: '2026-09-28T02:00:00Z',
    assignedClinic: 'Stanford Health Care',
    deviceType: 'Web Chrome',
    mfaEnabled: true,
  },
  {
    id: 'ADM-001',
    email: 'divya03022005@gmail.com',
    displayName: 'Divya',
    role: 'ADMIN',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-05-10T12:00:00Z',
    lastLogin: '2026-09-28T06:14:00Z',
    deviceType: 'Web Chrome',
    mfaEnabled: true,
  },
  {
    id: 'USR-9481',
    email: 'jordan.taylor@example.com',
    displayName: 'Jordan Taylor',
    role: 'USER',
    status: 'PENDING_MFA',
    emailVerified: true,
    createdAt: '2026-09-25T16:40:00Z',
    lastLogin: '2026-09-26T10:11:00Z',
    deviceType: 'Android Pixel',
    mfaEnabled: false,
  },
  {
    id: 'USR-1092',
    email: 'robert.langdon@untrusted.net',
    displayName: 'Robert Langdon',
    role: 'USER',
    status: 'SUSPENDED',
    emailVerified: false,
    createdAt: '2026-09-20T03:12:00Z',
    lastLogin: '2026-09-20T03:15:00Z',
    deviceType: 'Web Chrome',
    mfaEnabled: false,
  },
];

export const initialSystemHealth: SystemHealthMetrics = {
  cpuUsagePercent: 24.8,
  memoryUsagePercent: 41.2,
  activeContainerInstances: 14,
  platformUptimePercent: 99.98,
  uptimeHours: 1464,
  averageLatencyMs: 38.4,
  status: 'OPTIMAL',
  networkThroughputMbps: 184.2,
  lastRestart: '2026-08-01T00:00:00Z',
};

export const initialApiEndpoints: ApiEndpointHealth[] = [
  {
    endpoint: '/api/v1/telemetry/vitals/stream',
    method: 'POST',
    status: 'HEALTHY',
    responseTimeMs: 32,
    successRatePercent: 99.96,
    requestsPerMinute: 4280,
    p95LatencyMs: 48,
    p99LatencyMs: 82,
  },
  {
    endpoint: '/api/v1/environmental/hyperlocal',
    method: 'GET',
    status: 'HEALTHY',
    responseTimeMs: 24,
    successRatePercent: 99.99,
    requestsPerMinute: 1950,
    p95LatencyMs: 35,
    p99LatencyMs: 54,
  },
  {
    endpoint: '/api/v1/ai/synergy/analyze',
    method: 'POST',
    status: 'HEALTHY',
    responseTimeMs: 215,
    successRatePercent: 99.72,
    requestsPerMinute: 310,
    p95LatencyMs: 380,
    p99LatencyMs: 620,
  },
  {
    endpoint: '/api/v1/emergency/sos/dispatch',
    method: 'POST',
    status: 'HEALTHY',
    responseTimeMs: 18,
    successRatePercent: 100.0,
    requestsPerMinute: 12,
    p95LatencyMs: 22,
    p99LatencyMs: 30,
  },
  {
    endpoint: '/api/v1/fhir/export/hl7-bundle',
    method: 'GET',
    status: 'HEALTHY',
    responseTimeMs: 88,
    successRatePercent: 99.85,
    requestsPerMinute: 65,
    p95LatencyMs: 120,
    p99LatencyMs: 195,
  },
  {
    endpoint: '/api/v1/auth/mfa/challenge',
    method: 'POST',
    status: 'HEALTHY',
    responseTimeMs: 42,
    successRatePercent: 99.91,
    requestsPerMinute: 410,
    p95LatencyMs: 60,
    p99LatencyMs: 95,
  },
];

export const initialAiServices: AiServiceStatus[] = [
  {
    serviceName: 'Gemini Physiological-Atmospheric Correlator',
    model: 'gemini-1.5-pro',
    provider: 'Gemini 1.5 Pro',
    status: 'OPERATIONAL',
    tokensConsumedToday: 482150,
    dailyQuotaTokens: 2500000,
    latencyAverageMs: 245,
    errorRatePercent: 0.08,
    promptSafetyFilterTriggers: 0,
    cacheHitRatePercent: 68.4,
  },
  {
    serviceName: 'Real-Time Biomarker Anomaly Detection',
    model: 'gemini-2.0-flash',
    provider: 'Gemini 2.0 Flash',
    status: 'OPERATIONAL',
    tokensConsumedToday: 1120400,
    dailyQuotaTokens: 5000000,
    latencyAverageMs: 95,
    errorRatePercent: 0.02,
    promptSafetyFilterTriggers: 0,
    cacheHitRatePercent: 84.1,
  },
  {
    serviceName: 'Clinical FHIR Narrative Synthesizer',
    model: 'gemini-1.5-flash',
    provider: 'Gemini 1.5 Flash',
    status: 'OPERATIONAL',
    tokensConsumedToday: 185300,
    dailyQuotaTokens: 1000000,
    latencyAverageMs: 110,
    errorRatePercent: 0.04,
    promptSafetyFilterTriggers: 0,
    cacheHitRatePercent: 72.0,
  },
];

export const initialStorageMetrics: StorageMetrics = {
  bucketName: 'gs://lifesphere-ai-prod.appspot.com',
  totalStorageBytes: 134217728000,
  totalStorageGB: 125.0,
  quotaLimitGB: 500.0,
  fileCount: 48920,
  encryptedAtRest: true,
  kmsKeyStatus: 'ACTIVE_ROTATED',
  firestoreDocumentCount: 382410,
  firestoreReadOperationsToday: 41250,
  firestoreWriteOperationsToday: 18920,
};

export const initialSecurityEvents: SecurityEvent[] = [
  {
    id: 'SEC-8901',
    eventType: 'PHI_UNAUTHORIZED_ACCESS_BLOCKED',
    severity: 'HIGH',
    sourceIp: '198.51.100.44',
    location: 'Frankfurt, Germany',
    timestamp: '2026-09-28T05:12:00Z',
    targetUser: 'USR-8842',
    details: 'Direct request to `/medical_records/USR-8842` without Doctor authorization token was rejected by Least Privilege Security Rules.',
    status: 'BLOCKED',
  },
  {
    id: 'SEC-8900',
    eventType: 'BRUTE_FORCE_BLOCKED',
    severity: 'HIGH',
    sourceIp: '203.0.113.19',
    location: 'Shenzhen, China',
    timestamp: '2026-09-28T03:45:00Z',
    targetUser: 'USR-1092',
    details: '14 consecutive failed password attempts detected within 30 seconds. Source IP rate-limited for 4 hours.',
    status: 'MITIGATED',
  },
  {
    id: 'SEC-8899',
    eventType: 'ADMIN_LOGIN_SUCCESS',
    severity: 'LOW',
    sourceIp: '128.12.90.14',
    location: 'Mountain View, CA, USA',
    timestamp: '2026-09-28T06:14:00Z',
    targetUser: 'ADM-001',
    details: 'Administrator divya03022005@gmail.com successfully authenticated with FIDO2 WebAuthn Hardware Token.',
    status: 'AUDITED',
  },
  {
    id: 'SEC-8898',
    eventType: 'PRIVILEGE_ESCALATION_BLOCKED',
    severity: 'CRITICAL',
    sourceIp: '192.0.2.88',
    location: 'Singapore',
    timestamp: '2026-09-27T22:30:00Z',
    targetUser: 'USR-9021',
    details: 'Client attempted to inject custom claim `{ admin: true }` in document update payload. Blocked by Firestore security rules.',
    status: 'BLOCKED',
  },
  {
    id: 'SEC-8897',
    eventType: 'API_KEY_ROTATION',
    severity: 'LOW',
    sourceIp: 'Internal Automation',
    location: 'GCP Cloud KMS',
    timestamp: '2026-09-27T18:00:00Z',
    details: 'Automated 90-day cryptographic key rotation completed successfully for Cloud KMS master key ring.',
    status: 'AUDITED',
  },
];

export const initialSupportTickets: SupportTicket[] = [
  {
    id: 'TCK-2026-041',
    ticketNumber: 'LS-9941',
    userId: 'USR-8842',
    userEmail: 'alex.mercer@example.com',
    subject: 'Bluetooth Pulse Oximeter sync delay during outdoor run',
    category: 'TELEMETRY_SYNC',
    priority: 'MEDIUM',
    status: 'OPEN',
    createdAt: '2026-09-28T04:20:00Z',
    updatedAt: '2026-09-28T05:00:00Z',
    assignedAgent: 'Support Specialist Marcus',
  },
  {
    id: 'TCK-2026-040',
    ticketNumber: 'LS-9940',
    userId: 'DOC-4102',
    userEmail: 'dr.sarah.vance@lifesphere.org',
    subject: 'FHIR HL7 bulk export authorization for clinical trial cohort',
    category: 'CLINICAL_INTEGRATION',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: '2026-09-27T16:10:00Z',
    updatedAt: '2026-09-28T01:30:00Z',
    assignedAgent: 'Lead Solutions Architect Elena',
  },
  {
    id: 'TCK-2026-039',
    ticketNumber: 'LS-9939',
    userId: 'USR-9481',
    userEmail: 'jordan.taylor@example.com',
    subject: 'Authenticator app replacement for MFA token reset',
    category: 'ACCOUNT_ACCESS',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: '2026-09-27T11:00:00Z',
    updatedAt: '2026-09-27T14:45:00Z',
    assignedAgent: 'Security Ops Support',
  },
  {
    id: 'TCK-2026-038',
    ticketNumber: 'LS-9938',
    userId: 'USR-9021',
    userEmail: 'maria.gonzalez@example.com',
    subject: 'Question on PM2.5 threshold sensitivity for pediatric profile',
    category: 'SENSOR_CALIBRATION',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: '2026-09-26T09:15:00Z',
    updatedAt: '2026-09-26T17:30:00Z',
    assignedAgent: 'Clinical Support Desk',
  },
];

export const initialSystemConfig: SystemConfig = {
  emergencySpO2Threshold: 90.0,
  emergencyHeartRateThreshold: 120,
  emergencyPm25Threshold: 15.0,
  duplicateAlertCooldownMinutes: 10,
  defaultAiModel: 'Gemini 2.0 Flash',
  maintenanceMode: false,
  enforceMfaForStaff: true,
  rateLimitPerMinute: 6000,
  dataRetentionMonths: 84, // 7-year HIPAA compliance
  fhirExportVersion: 'FHIR R4 (HL7 v4.0.1)',
};

export const initialAdminNotifications: AdminNotification[] = [
  {
    id: 'NOTIF-01',
    title: 'Severe Wildfire Smoke Inversion Advisory (Bay Area & Central Valley)',
    message: 'Ambient PM2.5 elevated above 85 µg/m³. Automated preventative warnings dispatched to 14,280 patients with respiratory flags.',
    targetAudience: 'ASTHMA_COHORT',
    type: 'ENVIRONMENTAL_ADVISORY',
    sentAt: '2026-09-28T02:00:00Z',
    deliveryRatePercent: 99.8,
    openRatePercent: 84.2,
    status: 'SENT',
  },
  {
    id: 'NOTIF-02',
    title: 'Scheduled Core Infrastructure Maintenance (Zero-Downtime)',
    message: 'Database connection pool optimization will execute on Sunday at 02:00 UTC. No client disconnection expected.',
    targetAudience: 'ALL_USERS',
    type: 'SYSTEM_MAINTENANCE',
    sentAt: '2026-09-27T12:00:00Z',
    deliveryRatePercent: 99.9,
    openRatePercent: 62.0,
    status: 'SENT',
  },
  {
    id: 'NOTIF-03',
    title: 'Clinical Guideline Update: Global Initiative for Asthma (GINA 2026)',
    message: 'Synergy algorithm weights for temperature inversions updated in accordance with 2026 GINA recommendations.',
    targetAudience: 'DOCTORS_ONLY',
    type: 'CLINICAL_UPDATE',
    sentAt: '2026-09-25T15:30:00Z',
    deliveryRatePercent: 100.0,
    openRatePercent: 91.5,
    status: 'SENT',
  },
];
