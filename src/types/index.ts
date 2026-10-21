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
  pollenCount: number; // grains/m³
  pollenCategory: 'Low' | 'Medium' | 'High';
  temperature: number; // °C
  humidity: number; // %
  noiseDecibels: number; // dB
  atmosphericPressure: number; // hPa
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
