import { HealthMetrics, EnvironmentalData, MedicalRecordItem, UserProfile } from './index';

export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  npi: string;
  clinic: string;
  email: string;
  licenseNumber: string;
}

export interface PatientAuthorization {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  status: 'AUTHORIZED' | 'REVOKED' | 'EXPIRED';
  grantedAt: string;
  revokedAt: string | null;
  expiresAt: string;
  authorizedScopes: Array<'HEALTH_METRICS' | 'REPORTS' | 'MEDICATIONS' | 'CHECKUPS' | 'CARE_PLAN_WRITE'>;
}

export interface DoctorCareNote {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorNpi: string;
  clinic: string;
  recommendations: string[];
  followUpDate: string;
  careInstructions: string;
  carePlanInformation: string;
  isPhysicianOverride: boolean; // Explicit flag: Doctor instructions must not be silently overwritten by AI-generated plans
  createdAt: string;
  updatedAt: string;
  signatureHash: string;
}

export interface AiCarePlanItem {
  id: string;
  patientId: string;
  title: string;
  generatedAt: string;
  planDetails: string;
  aiModel: string;
  confidenceScore: number;
  physicianStatus: 'ACTIVE_SUPERVISED' | 'OVERRIDDEN_BY_PHYSICIAN' | 'PENDING_CLINICAL_SIGN_OFF';
  overridingDoctorNoteId?: string;
}

export interface DoctorAccessAuditLog {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorNpi: string;
  patientId: string;
  patientName: string;
  accessedFeature:
    | 'PATIENT_LIST'
    | 'TIMELINE'
    | 'HEALTH_TRENDS'
    | 'REPORTS'
    | 'MEDICATIONS'
    | 'CHECKUP_HISTORY'
    | 'DOCTOR_RECOMMENDATIONS'
    | 'CARE_PLAN_NOTES'
    | 'REVOKE_AUTHORIZATION_ACTION'
    | 'GRANT_AUTHORIZATION_ACTION';
  timestamp: string;
  purposeOfAccess: string;
  clientIp: string;
}

export interface PatientTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  category: 'CLINICAL_ORDER' | 'AI_ALERT' | 'PATIENT_LOG' | 'DIAGNOSTIC_REPORT' | 'MEDICATION_CHANGE';
  authorType: 'DOCTOR' | 'AI' | 'PATIENT';
  authorName: string;
  summary: string;
  details?: string;
  isDoctorVerified: boolean;
}

export interface PatientCheckupRecord {
  id: string;
  date: string;
  symptomSeverity: 'MILD' | 'MODERATE' | 'SEVERE';
  reportedSymptoms: string[];
  peakFlowOrSpirometry: string;
  patientNotes: string;
  aiSuggestedRiskScore: number;
  doctorReviewed: boolean;
}

export interface DoctorPatientRecord {
  patient: UserProfile;
  vitals: HealthMetrics;
  environment: EnvironmentalData;
  authorization: PatientAuthorization;
  timeline: PatientTimelineEvent[];
  healthTrends: Array<{
    date: string;
    restingHeartRate: number;
    spO2: number;
    hrv: number;
    ambientPm25: number;
    temperature: number;
  }>;
  reports: MedicalRecordItem[];
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    prescribedDate: string;
    isDoctorPrescribed: boolean;
    aiAdherenceAnalysis: string;
  }>;
  checkups: PatientCheckupRecord[];
  doctorNotes: DoctorCareNote[];
  aiPlans: AiCarePlanItem[];
}
