export type UserRole = 'USER' | 'DOCTOR' | 'ADMIN';

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_MFA' | 'INACTIVE';
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
  assignedDoctorId?: string;
  assignedClinic?: string;
  deviceType: 'Android Pixel' | 'iPhone iOS' | 'Web Chrome' | 'macOS Safari';
  mfaEnabled: boolean;
  // Note: Medical records are deliberately NOT stored in this object (Least Privilege)
}

export interface SystemHealthMetrics {
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  activeContainerInstances: number;
  platformUptimePercent: number;
  uptimeHours: number;
  averageLatencyMs: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  networkThroughputMbps: number;
  lastRestart: string;
}

export interface ApiEndpointHealth {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'HEALTHY' | 'WARNING' | 'DOWN';
  responseTimeMs: number;
  successRatePercent: number;
  requestsPerMinute: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
}

export interface AiServiceStatus {
  serviceName: string;
  model: string;
  provider: 'Gemini 1.5 Pro' | 'Gemini 2.0 Flash' | 'Gemini 1.5 Flash' | 'Clinical NER Model';
  status: 'OPERATIONAL' | 'RATE_LIMITED' | 'DEGRADED';
  tokensConsumedToday: number;
  dailyQuotaTokens: number;
  latencyAverageMs: number;
  errorRatePercent: number;
  promptSafetyFilterTriggers: number;
  cacheHitRatePercent: number;
}

export interface StorageMetrics {
  bucketName: string;
  totalStorageBytes: number;
  totalStorageGB: number;
  quotaLimitGB: number;
  fileCount: number;
  encryptedAtRest: boolean;
  kmsKeyStatus: 'ACTIVE_ROTATED' | 'PENDING_ROTATION';
  firestoreDocumentCount: number;
  firestoreReadOperationsToday: number;
  firestoreWriteOperationsToday: number;
}

export interface SecurityEvent {
  id: string;
  eventType:
    | 'SUSPICIOUS_LOGIN_ATTEMPT'
    | 'BRUTE_FORCE_BLOCKED'
    | 'PRIVILEGE_ESCALATION_BLOCKED'
    | 'PHI_UNAUTHORIZED_ACCESS_BLOCKED'
    | 'TOKEN_REVOCATION'
    | 'MFA_CHALLENGE_FAILED'
    | 'ADMIN_LOGIN_SUCCESS'
    | 'API_KEY_ROTATION';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  sourceIp: string;
  location: string;
  timestamp: string;
  targetUser?: string;
  details: string;
  status: 'BLOCKED' | 'MITIGATED' | 'AUDITED' | 'FLAGGED';
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userEmail: string;
  subject: string;
  category: 'TELEMETRY_SYNC' | 'ACCOUNT_ACCESS' | 'BILLING' | 'SENSOR_CALIBRATION' | 'CLINICAL_INTEGRATION';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  assignedAgent: string;
}

export interface SystemConfig {
  emergencySpO2Threshold: number;
  emergencyHeartRateThreshold: number;
  emergencyPm25Threshold: number;
  duplicateAlertCooldownMinutes: number;
  defaultAiModel: string;
  maintenanceMode: boolean;
  enforceMfaForStaff: boolean;
  rateLimitPerMinute: number;
  dataRetentionMonths: number;
  fhirExportVersion: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  targetAudience: 'ALL_USERS' | 'DOCTORS_ONLY' | 'ASTHMA_COHORT' | 'ADMINISTRATORS';
  type: 'SYSTEM_MAINTENANCE' | 'ENVIRONMENTAL_ADVISORY' | 'CLINICAL_UPDATE' | 'SECURITY_BULLETIN';
  sentAt: string;
  deliveryRatePercent: number;
  openRatePercent: number;
  status: 'SENT' | 'SCHEDULED' | 'DRAFT';
}

export type AdminRouteId =
  | 'admin_dashboard'
  | 'admin_users'
  | 'admin_system_monitoring'
  | 'admin_notifications'
  | 'admin_audit_logs'
  | 'admin_ai_services'
  | 'admin_api_health'
  | 'admin_storage'
  | 'admin_security_events'
  | 'admin_support_tickets'
  | 'admin_configuration';
