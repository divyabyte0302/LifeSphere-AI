export interface HealthMetrics {
  heartRate: number;
  restingHeartRate: number;
  hrv: number; // ms
  spO2: number; // %
  bloodPressure: string; // e.g. 118/76
  systolic: number;
  diastolic: number;
  bodyTemperature: number; // °C
  respiratoryRate: number; // bpm
  glucose: number; // mg/dL
  stressLevel: number; // 0-100
  sleepScore: number; // 0-100
  totalSleepHours: number;
  deepSleepHours: number;
  remSleepHours: number;
  stepCount: number;
  activeCalories: number;
  steps?: number;
  caloriesBurned?: number;
  hydrationLevel?: number;
  environmentalSensitivityScore?: number;
  deepSleepMinutes?: number;
  remSleepMinutes?: number;
  lightSleepMinutes?: number;
  activeMinutes?: number;
}

export interface EnvironmentalData {
  locationName: string;
  airQualityIndex: number;
  airQualityCategory: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  ozone: number; // ppb
  uvIndex: number;
  uvCategory: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  pollenCount: number | string; // grains/m³ or string category
  pollenCategory?: 'Low' | 'Medium' | 'High';
  temperature: number; // °C
  humidity: number; // %
  noiseDecibels?: number; // dB
  atmosphericPressure?: number; // hPa
  aqi?: number;
  cautionLevel?: string;
  heatIndex?: number;
  no2?: number;
  so2?: number;
  co?: number;
  primaryPollutant?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  scheduledTimes: string[];
  isTakenToday: boolean;
  notes: string;
  environmentalWarning?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'respiratory' | 'cardiovascular' | 'uv_protection' | 'lifestyle' | 'hydration';
  priority: 'high' | 'moderate' | 'low';
  triggerSource: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  bloodType: string;
  chronicConditions: string[];
  primaryCondition?: string;
  allergies: string[];
  hasGivenConsent: boolean;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface MeasurementRecord {
  id: string;
  type: 'Heart Rate' | 'Blood Pressure' | 'SpO2' | 'Blood Glucose' | 'Body Temperature' | 'Respiratory Rate';
  value: string;
  unit: string;
  timestamp: string;
  source: 'Apple Watch Ultra' | 'Oura Ring' | 'Manual Log' | 'BLE Sensor';
  status: 'normal' | 'attention' | 'optimal';
}

export interface MedicalRecordItem {
  id: string;
  title: string;
  category: 'Lab Test' | 'Spirometry' | 'Vaccination' | 'Radiology' | 'Prescription';
  date: string;
  provider: string;
  fileName: string;
  fileSize: string;
  summary: string;
}

export interface CheckupComparisonData {
  metric: string;
  previousMonth: string;
  currentMonth: string;
  delta: string;
  trend: 'improved' | 'declined' | 'stable';
}

export type UserRole = 'USER' | 'DOCTOR' | 'ADMIN';

export type ViewMode =
  | 'public_web'
  | 'authenticated_web'
  | 'tablet_web'
  | 'mobile_web'
  | 'android'
  | 'admin_portal'
  | 'doctor_portal'
  | 'cross_platform_test';

// The 15 LifeSphere AI-X primary modules and supporting routes
export type ScreenModule =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'registration'
  | 'forgot_password'
  | 'profile'
  | 'consent'
  | 'dashboard'
  | 'digital_twin'
  | 'measurements'
  | 'wearable'
  | 'medical_records'
  | 'reports'
  | 'medications'
  | 'lifestyle'
  | 'environment'
  | 'fusion_engine'
  | 'ml_prediction'
  | 'life_risk_score'
  | 'trends'
  | 'ai_insights'
  | 'recommendations'
  | 'safe_routes'
  | 'community_hazards'
  | 'checkup'
  | 'post_checkup'
  | 'checkup_comparison'
  | 'checkup_calendar'
  | 'health_analytics'
  | 'health_plan'
  | 'diet_plan'
  | 'notifications'
  | 'emergency'
  | 'city_analytics'
  | 'hydration'
  | 'privacy'
  | 'audit_logs'
  | 'data_export'
  | 'account_deletion'
  | 'logout'
  | 'settings';

export * from './hydration';

// Alias for backward compatibility
export type ScreenTab = ScreenModule;

// Digital Twin Models
export interface DigitalTwinOrganState {
  name: string;
  stressLevel: number; // 0-100%
  resilienceScore: number; // 0-100
  status: 'optimal' | 'mild_strain' | 'elevated_risk' | 'critical';
  primaryFactor: string;
  activeMitigation: string;
}

export interface DigitalTwinState {
  twinId: string;
  lastSimulatedAt: string;
  cardiacReserveScore: number; // 0-100
  respiratoryResilienceIndex: number; // 0-100
  thermalLoadTolerance: number; // °C threshold
  hydrationIndex: number; // 0-100%
  organs: DigitalTwinOrganState[];
  simulationScenarios: Array<{
    id: string;
    title: string;
    description: string;
    baselineRisk: number;
    predictedRiskWithIntervention: number;
    recommendation: string;
  }>;
}

// Health-Environment Fusion Engine Models
export interface FusionSynergyMetric {
  factorA: string;
  factorB: string;
  synergyType: 'synergistic_hazard' | 'antagonistic' | 'additive';
  multiplier: number; // e.g. 1.8x
  riskImpactDescription: string;
}

export interface FusionEngineMetrics {
  calculatedAt: string;
  exposureWindowHours: number;
  cumulativePm25Inhaled: number; // µg
  heatStressDurationMinutes: number;
  physiologicalVulnerabilityScore: number; // 0-100
  environmentalHazardScore: number; // 0-100
  combinedFusionScore: number; // 0-100
  synergies: FusionSynergyMetric[];
  laggedImpactForecasts: Array<{
    lagHours: number;
    predictedSymptom: string;
    probabilityPercent: number;
  }>;
}

// Machine Learning Risk Prediction Models
export interface MlFeatureImportance {
  featureName: string;
  importanceScore: number; // e.g. 0.34
  shapValue: number; // positive or negative contribution
  direction: 'increases_risk' | 'decreases_risk';
}

export interface HorizonRiskPrediction {
  horizonHours: 1 | 6 | 12 | 24;
  riskCategory: 'Low' | 'Moderate' | 'High' | 'Severe';
  riskScore: number; // 0-100
  confidenceScore: number; // 0.0 - 1.0 (calibrated)
  primaryContributingFactors: string[];
}

export interface MlModelEvaluation {
  modelName: string;
  algorithm: 'XGBoost v2.0' | 'RandomForestClassifier';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  aucRoc: number;
  datasetReference: string;
  academicDisclaimer: string;
}

export interface MlPredictionResult {
  evaluation: MlModelEvaluation;
  heatStressRisk: HorizonRiskPrediction;
  dehydrationRisk: HorizonRiskPrediction;
  respiratoryEnvironmentalRisk: HorizonRiskPrediction;
  horizonPredictions: HorizonRiskPrediction[];
  featureImportances: MlFeatureImportance[];
}

// Life Risk Score Models
export interface LifeRiskSubScore {
  name: string;
  weightPercent: number;
  score: number; // 0-100
  status: 'normal' | 'moderate' | 'high' | 'critical';
  details: string;
}

export interface LifeRiskScoreModel {
  overallScore: number; // 0-100
  category: 'Minimal Risk' | 'Moderate Vigilance' | 'Elevated Precaution' | 'High Alert';
  formulaExplanation: string;
  subScores: LifeRiskSubScore[];
  academicDisclaimer: string;
}

// Safe Route Planning Models
export interface RouteWaypoint {
  name: string;
  distanceKm: number;
  estimatedMinutes: number;
  aqi: number;
  pm25: number;
  temperature: number;
  hazardNote?: string;
}

export interface SafeRouteOption {
  id: string;
  title: string;
  type: 'cleanest_air' | 'fastest' | 'low_heat_sheltered';
  totalDistanceKm: number;
  durationMinutes: number;
  averageAqi: number;
  averagePm25: number;
  heatExposureMinutes: number;
  pm25ReductionVsFastestPercent: number;
  routeColor: string;
  waypoints: RouteWaypoint[];
  advisory: string;
}

// Community Hazard Reporting & Verification Models
export interface CommunityHazardReport {
  id: string;
  title: string;
  hazardType: 'wildfire_smoke' | 'industrial_emission' | 'urban_heat_island' | 'stagnant_air' | 'construction_dust';
  locationName: string;
  reportedAt: string;
  reportedByAnonymized: string;
  severity: 'moderate' | 'high' | 'hazardous';
  verificationVotes: number;
  status: 'unverified' | 'community_verified' | 'investigating' | 'resolved';
  measuredPm25?: number;
  measuredTemp?: number;
  userVoted?: boolean;
}

// City-Level Analytics Models
export interface CityWardRisk {
  wardId: string;
  wardName: string;
  population: number;
  vulnerabilityIndex: number; // 0-100
  aqiCurrent: number;
  pm25Current: number;
  temperatureCurrent: number;
  heatStressLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  hospitalCapacityPercent: number;
}

export interface CityAnalyticsData {
  cityName: string;
  updatedAt: string;
  cityWideAverageAqi: number;
  cityWideAverageTemp: number;
  activeAdvisory: string;
  totalMonitorsActive: number;
  wards: CityWardRisk[];
}

export interface EmergencyEvidence {
  whyAlertAppeared: string;
  measurementsInvolved: Array<{
    name: string;
    value: string | number;
    unit: string;
    threshold: string;
    status: 'critical' | 'abnormal' | 'concerning';
  }>;
  timeOfMeasurements: string;
  possibleSignificance: string;
  uncertaintyExplanation: string;
}

export interface EmergencyAlert {
  alertId: string;
  userId: string;
  trigger: string;
  evidence: EmergencyEvidence;
  createdAt: string;
  shownAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  actionResult:
    | 'PENDING_USER_CONFIRMATION'
    | 'AUTHORIZED_EMERGENCY_DISPATCHED'
    | 'CANCELLED_BY_USER'
    | 'SAFE_CONFIRMED_BY_USER'
    | 'NETWORK_FAILURE_SMS_QUEUED'
    | 'DUPLICATE_SUPPRESSED';
  isDuplicate?: boolean;
  networkSimulatedFailure?: boolean;
}

export interface EmergencyAuditLog {
  id: string;
  alertId: string;
  userId: string;
  action:
    | 'EMERGENCY_ALERT_GENERATED'
    | 'EMERGENCY_ALERT_SHOWN'
    | 'EMERGENCY_ACTION_CONFIRMED'
    | 'EMERGENCY_ACTION_CANCELLED'
    | 'EMERGENCY_SAFE_CONFIRMED'
    | 'NETWORK_FAILURE_FALLBACK'
    | 'DUPLICATE_ALERT_SUPPRESSED';
  timestamp: string;
  details: string;
  clientPlatform: 'Web SaaS' | 'Android Mobile';
}

// ============================================================================
// Module 2: Emergency Detection and Response Types
// ============================================================================

export type EmergencyRelationship =
  | 'Spouse'
  | 'Parent'
  | 'Child'
  | 'Sibling'
  | 'Friend'
  | 'Physician'
  | 'Caregiver'
  | 'Other';

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: EmergencyRelationship;
  phone: string;
  email?: string;
  isPrimary: boolean;
  notificationPreferences: {
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
  hasExplicitConsent: boolean;
  consentGrantedAt?: string;
  createdAt: string;
}

export type AlertSeverity = 'low' | 'moderate' | 'high' | 'critical';

export interface EmergencyAlertRule {
  id: string;
  userId: string;
  name: string;
  metric: 'heart_rate' | 'spo2' | 'blood_pressure_systolic' | 'blood_pressure_diastolic' | 'pm25' | 'heat_index';
  condition: 'greater_than' | 'less_than';
  threshold: number;
  secondaryMetric?: string;
  secondaryThreshold?: number;
  durationSeconds: number;
  severity: AlertSeverity;
  isEnabled: boolean;
  rejectInvalidReadings: boolean;
  maxReadingAgeMinutes: number;
}

export type EmergencyEventStatus = 'active' | 'acknowledged' | 'escalated' | 'resolved' | 'cancelled';

export interface EmergencyNotificationDeliveryReceipt {
  contactId: string;
  contactName: string;
  channel: 'browser_push' | 'sms' | 'in_app';
  status: 'sent' | 'delivered' | 'acknowledged' | 'failed';
  timestamp: string;
  failureReason?: string;
  latencyMs?: number;
}

export interface EmergencyEventRecord {
  id: string;
  userId: string;
  triggerType: 'MANUAL_SOS' | 'AUTOMATED_RULE_TRIGGER';
  ruleId?: string;
  title: string;
  severity: AlertSeverity;
  reason: string;
  vitalsSnapshot: {
    heartRate?: number;
    spO2?: number;
    bloodPressure?: string;
    temperature?: number;
    respiratoryRate?: number;
    readingTimestamp?: string;
  };
  environmentSnapshot: {
    aqi?: number;
    pm25?: number;
    temperature?: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    accuracyMeters?: number;
    address?: string;
    isConsented: boolean;
  };
  triggeredAt: string;
  userConfirmed: boolean;
  confirmedAt?: string;
  cancelledAt?: string;
  status: EmergencyEventStatus;
  notificationsDispatched: EmergencyNotificationDeliveryReceipt[];
  ambulanceAction: {
    dialed: boolean;
    number: string;
    dialTimestamp?: string;
    userConfirmationRequired: boolean;
    status: 'ready_to_call' | 'dialer_launched' | 'manual_confirmation_advised';
  };
  escalationTimeoutSeconds: number;
  escalatedAt?: string;
  acknowledgements: Array<{
    acknowledgedBy: string;
    acknowledgedAt: string;
    notes?: string;
  }>;
  dataQualityChecks: {
    passed: boolean;
    issues: string[];
    readingTimestampIso?: string;
    sensorAgeMinutes?: number;
  };
}

// ============================================================================
// Module 1: Health Appointment and Recurring Reminders Types
// ============================================================================

export type AppointmentCategory =
  | 'routine_checkup'
  | 'cardiology'
  | 'pulmonology'
  | 'allergy_immunology'
  | 'annual_physical'
  | 'lab_work'
  | 'telehealth';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'missed';
export type ReminderFrequency = 'once' | 'monthly' | 'quarterly' | 'annual';
export type NotificationDeliveryStatus = 'scheduled' | 'delivered' | 'dismissed' | 'failed';

export interface ReminderPreferences {
  leadTimeHours: number; // e.g. 1, 2, 24, 48
  pushEnabled: boolean;
  emailEnabled: boolean;
  inAppEnabled: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  title: string;
  description?: string;
  doctorOrSpecialist: string;
  category: AppointmentCategory;
  scheduledDateTime: string; // ISO UTC string
  durationMinutes: number;
  status: AppointmentStatus;
  frequency: ReminderFrequency;
  nextRecurrenceDate?: string;
  parentAppointmentId?: string;
  recurrenceCycle?: number;
  location?: string;
  isTelehealth: boolean;
  telehealthLink?: string;
  reminderPreferences: ReminderPreferences;
  notificationDeliveryStatus: NotificationDeliveryStatus;
  deliveryTimestamp?: string;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderDeliveryLog {
  id: string;
  appointmentId: string;
  appointmentTitle: string;
  channel: 'browser_push' | 'in_app' | 'email';
  status: 'delivered' | 'scheduled' | 'failed';
  failureReason?: string;
  timestamp: string;
  leadTimeHours: number;
}

// ============================================================================
// Module 6: Health Analytics & Longitudinal Biomarker Charts Types
// ============================================================================

export type BiomarkerType =
  | 'heart_rate'
  | 'blood_pressure'
  | 'spo2'
  | 'sleep'
  | 'temperature'
  | 'steps'
  | 'aqi_exposure'
  | 'risk_score';

export type AnalyticsTimeHorizon = 'daily' | 'weekly' | 'monthly';

export interface VitalTrendAlert {
  id: string;
  metricType: BiomarkerType;
  title: string;
  severity: 'moderate' | 'high' | 'critical';
  currentValue: number;
  secondaryCurrentValue?: number;
  baselineAverage: number;
  secondaryBaselineAverage?: number;
  deviationValue: number;
  deviationPercent: number;
  unit: string;
  timestamp: string;
  clinicalContext: string;
  recommendedAction: string;
}

export interface BiomarkerTrendPoint {
  timestamp: string;
  metricType: BiomarkerType;
  value: number;
  secondaryValue?: number; // e.g. diastolic BP or deep sleep
  unit: string;
  siteOrStage?: string;
  isInterpolated?: boolean;
  isMissing?: boolean;
  qualityScore?: number; // 0-100%
  source?: string;
}

export interface BiomarkerSummaryCard {
  metricType: BiomarkerType;
  label: string;
  currentValue: number;
  secondaryCurrent?: number;
  unit: string;
  averageValue: number;
  minValue: number;
  maxValue: number;
  trendDirection: 'improving' | 'declining' | 'stable';
  percentageChange: number;
  clinicalEvaluation: string;
  thresholdBand: string;
}

export interface ValidationChecklistItem {
  id: string;
  title: string;
  requirement: string;
  status: 'passed' | 'warning' | 'pending';
  summary: string;
  technicalDetails: string;
  verifiedAt: string;
}


