import {
  DigitalTwinState,
  FusionEngineMetrics,
  MlPredictionResult,
  LifeRiskScoreModel,
  SafeRouteOption,
  CommunityHazardReport,
  CityAnalyticsData
} from '../types';

/**
 * LifeSphere AI-X Synthetic Demonstration Dataset
 * ===============================================
 * Academic Research Prototype Synthetic Data
 * Explicitly separated from production patient telemetry.
 * All values are simulated physiological and atmospheric parameters.
 */

export const DEMO_DIGITAL_TWIN: DigitalTwinState = {
  twinId: 'TWIN-AIX-7749',
  lastSimulatedAt: 'Just now (Real-time Continuous Sync)',
  cardiacReserveScore: 78,
  respiratoryResilienceIndex: 64,
  thermalLoadTolerance: 34.5, // °C
  hydrationIndex: 72,
  organs: [
    {
      name: 'Cardiovascular Complex',
      stressLevel: 38,
      resilienceScore: 82,
      status: 'optimal',
      primaryFactor: 'Normal ejection velocity & resting HR 72 BPM',
      activeMitigation: 'Regular aerobic baseline buffer active'
    },
    {
      name: 'Pulmonary / Bronchial Tree',
      stressLevel: 58,
      resilienceScore: 64,
      status: 'mild_strain',
      primaryFactor: 'Fine particulate (PM2.5 18.4 µg/m³) airway deposition',
      activeMitigation: 'HEPA filtration recommended during outdoor transit'
    },
    {
      name: 'Thermoregulatory Core',
      stressLevel: 42,
      resilienceScore: 76,
      status: 'optimal',
      primaryFactor: 'Moderate ambient temp 23.5°C & 52% relative humidity',
      activeMitigation: 'Maintain scheduled 250ml hydration intervals'
    },
    {
      name: 'Autonomic / Neuro-Stress Axis',
      stressLevel: 32,
      resilienceScore: 85,
      status: 'optimal',
      primaryFactor: 'HRV (rMSSD) 58 ms indicating balanced parasympathetic tone',
      activeMitigation: 'No acute autonomic dysregulation detected'
    }
  ],
  simulationScenarios: [
    {
      id: 'sim_jog_unhealthy_air',
      title: 'Simulate 45-min Aerobic Run at AQI 125 & 33°C',
      description: 'Tests pulmonary bronchospasm and cardiac strain threshold without protective interventions.',
      baselineRisk: 34,
      predictedRiskWithIntervention: 72,
      recommendation: 'Risk escalates to High (+38 pts). Move exercise indoors to air-purified space or postpone to 06:00 AM.'
    },
    {
      id: 'sim_n95_hydration',
      title: 'Simulate N95 Respirator + 500ml Electrolyte Buffer',
      description: 'Calculates physiological barrier efficacy against current 18.4 µg/m³ ambient PM2.5.',
      baselineRisk: 48,
      predictedRiskWithIntervention: 22,
      recommendation: 'Reduces bronchial particle deposition by ~88% and lowers overall Life Risk Score to Minimal.'
    },
    {
      id: 'sim_safe_route_transit',
      title: 'Simulate Green Corridor Commute via Riverside Park',
      description: 'Re-routes 3.2 km commute away from highway corridor (AQI 86 → 34).',
      baselineRisk: 52,
      predictedRiskWithIntervention: 28,
      recommendation: 'Reduces cumulative particulate burden by 48% over a 35-minute exposure window.'
    }
  ]
};

export const DEMO_FUSION_METRICS: FusionEngineMetrics = {
  calculatedAt: 'Real-time (Cross-Correlation Window: 4 hours)',
  exposureWindowHours: 4,
  cumulativePm25Inhaled: 74.2, // µg
  heatStressDurationMinutes: 45,
  physiologicalVulnerabilityScore: 38,
  environmentalHazardScore: 54,
  combinedFusionScore: 46,
  synergies: [
    {
      factorA: 'PM2.5 Micro-particle Exposure (18.4 µg/m³)',
      factorB: 'Mild Asthma History + Elevated Ozone (42 ppb)',
      synergyType: 'synergistic_hazard',
      multiplier: 1.65,
      riskImpactDescription: 'Co-exposure to ozone and fine particulates increases bronchial epithelial permeability by 65% compared to isolated particulate exposure.'
    },
    {
      factorA: 'Heat Index 25.8°C with UV Index 4.8',
      factorB: 'Prescription Medication (Photosensitivity Warning)',
      synergyType: 'synergistic_hazard',
      multiplier: 1.4,
      riskImpactDescription: 'Doxycycline photosensitization amplifies cellular erythema risk under direct solar irradiance.'
    },
    {
      factorA: 'Resting Heart Rate Elevation (+8 BPM above baseline)',
      factorB: 'Ambient Humidity (52%)',
      synergyType: 'additive',
      multiplier: 1.15,
      riskImpactDescription: 'Mild increase in evaporative cardiac workload without acute cardiovascular threat.'
    }
  ],
  laggedImpactForecasts: [
    {
      lagHours: 2,
      predictedSymptom: 'Subclinical airway irritation / coughing reflex',
      probabilityPercent: 38
    },
    {
      lagHours: 6,
      predictedSymptom: 'Thermal fatigue / dehydration headache',
      probabilityPercent: 24
    },
    {
      lagHours: 12,
      predictedSymptom: 'Delayed nocturnal sleep fragmentation from particle clearance',
      probabilityPercent: 18
    }
  ]
};

export const DEMO_ML_PREDICTION: MlPredictionResult = {
  evaluation: {
    modelName: 'LifeSphere Multi-Horizon Gradient Boosted Ensemble',
    algorithm: 'XGBoost v2.0',
    accuracy: 0.894,
    precision: 0.881,
    recall: 0.876,
    f1Score: 0.878,
    aucRoc: 0.932,
    datasetReference: 'Academic Synthetic Benchmarks: MIMIC-IV Clinical Extract + EPA AirNow Historical Cohort (10,000 synthetic patient-hours)',
    academicDisclaimer: 'Academic prototype machine learning models. Not evaluated by regulatory medical authorities (FDA/CE). Calibrated for risk prioritization research.'
  },
  heatStressRisk: {
    horizonHours: 1,
    riskCategory: 'Low',
    riskScore: 24,
    confidenceScore: 0.91,
    primaryContributingFactors: ['Ambient Temp 23.5°C', 'Core Temp 36.6°C', 'Hydration 72%']
  },
  dehydrationRisk: {
    horizonHours: 6,
    riskCategory: 'Moderate',
    riskScore: 48,
    confidenceScore: 0.86,
    primaryContributingFactors: ['Accumulated Activity 8,420 steps', 'Fluid intake deficit 450ml', 'Ambient humidity 52%']
  },
  respiratoryEnvironmentalRisk: {
    horizonHours: 1,
    riskCategory: 'Moderate',
    riskScore: 54,
    confidenceScore: 0.89,
    primaryContributingFactors: ['PM2.5 18.4 µg/m³', 'Pollen 142 grains/m³', 'Allergic rhinitis diagnosis']
  },
  horizonPredictions: [
    {
      horizonHours: 1,
      riskCategory: 'Low',
      riskScore: 32,
      confidenceScore: 0.92,
      primaryContributingFactors: ['Stable resting vitals', 'Daytime baseline AQI 68', 'Adequate immediate hydration']
    },
    {
      horizonHours: 6,
      riskCategory: 'Moderate',
      riskScore: 52,
      confidenceScore: 0.88,
      primaryContributingFactors: ['Forecasted afternoon PM2.5 spike (28 µg/m³)', 'Cumulative diurnal fatigue', 'Elevated UV 5.2']
    },
    {
      horizonHours: 12,
      riskCategory: 'Moderate',
      riskScore: 44,
      confidenceScore: 0.84,
      primaryContributingFactors: ['Evening temperature inversion', 'Stagnant boundary layer air', 'Post-commute exposure']
    },
    {
      horizonHours: 24,
      riskCategory: 'Low',
      riskScore: 28,
      confidenceScore: 0.79,
      primaryContributingFactors: ['Overnight rainfall cleansing air', 'Restorative sleep cycle recovery', 'Reduced atmospheric ozone']
    }
  ],
  featureImportances: [
    {
      featureName: 'Hyperlocal PM2.5 (18.4 µg/m³)',
      importanceScore: 0.28,
      shapValue: 0.18,
      direction: 'increases_risk'
    },
    {
      featureName: 'Cardiac Reserve / HRV (58 ms)',
      importanceScore: 0.22,
      shapValue: -0.14,
      direction: 'decreases_risk'
    },
    {
      featureName: 'Wet Bulb Globe Temperature (21.2°C)',
      importanceScore: 0.18,
      shapValue: 0.08,
      direction: 'increases_risk'
    },
    {
      featureName: 'Resting SpO2 Saturation (98.4%)',
      importanceScore: 0.15,
      shapValue: -0.12,
      direction: 'decreases_risk'
    },
    {
      featureName: 'Active Medication Interaction',
      importanceScore: 0.10,
      shapValue: 0.06,
      direction: 'increases_risk'
    },
    {
      featureName: 'Hydration Status Index',
      importanceScore: 0.07,
      shapValue: -0.05,
      direction: 'decreases_risk'
    }
  ]
};

export const DEMO_LIFE_RISK_SCORE: LifeRiskScoreModel = {
  overallScore: 42,
  category: 'Moderate Vigilance',
  formulaExplanation: 'Life Risk Score = 0.30 × Cardiac Stress + 0.30 × Respiratory Hazard + 0.25 × Thermal Strain + 0.15 × Environmental Exposure. Derived as an academic multi-system composite risk metric.',
  subScores: [
    {
      name: 'Cardiac Stress Index',
      weightPercent: 30,
      score: 28,
      status: 'normal',
      details: 'Resting HR 72 BPM, HRV 58 ms, blood pressure 118/76 mmHg. Cardiovascular workload is within standard baseline limits.'
    },
    {
      name: 'Respiratory Hazard Index',
      weightPercent: 30,
      score: 56,
      status: 'moderate',
      details: 'SpO2 98.4%, RR 14.5 bpm combined with ambient PM2.5 18.4 µg/m³ and pollen count 142 grains/m³. Mild bronchial irritation potential.'
    },
    {
      name: 'Thermal Strain Index',
      weightPercent: 25,
      score: 36,
      status: 'normal',
      details: 'Wet Bulb Globe Temp 21.2°C, core body temp 36.6°C. Sweating efficiency and heat dissipation are uncompromised.'
    },
    {
      name: 'Environmental Exposure Index',
      weightPercent: 15,
      score: 52,
      status: 'moderate',
      details: 'AQI 68 (Moderate), Ozone 42 ppb, UV Index 4.8. Ambient outdoor environment exhibits moderate particulate loading.'
    }
  ],
  academicDisclaimer: 'Notice: LifeSphere AI-X Life Risk Score is an academic demonstration index. It is not an FDA-approved clinical probability or diagnostic certainty.'
};

export const DEMO_SAFE_ROUTES: SafeRouteOption[] = [
  {
    id: 'route_clean_air',
    title: 'Clean Air Greenway Corridor (Recommended)',
    type: 'cleanest_air',
    totalDistanceKm: 3.4,
    durationMinutes: 24,
    averageAqi: 36,
    averagePm25: 8.6,
    heatExposureMinutes: 6,
    pm25ReductionVsFastestPercent: 54,
    routeColor: '#10b981', // emerald-500
    advisory: 'Passes through Riverside Park and tree-canopied pedestrian esplanade. 54% lower fine particulate inhalation.',
    waypoints: [
      { name: 'Start: Medical District', distanceKm: 0.0, estimatedMinutes: 0, aqi: 48, pm25: 12.2, temperature: 23.2 },
      { name: 'Riverside Botanical Trail', distanceKm: 1.2, estimatedMinutes: 8, aqi: 28, pm25: 6.4, temperature: 21.8, hazardNote: 'High tree canopy, 70% shaded' },
      { name: 'Eco-Corridor Overpass', distanceKm: 2.3, estimatedMinutes: 16, aqi: 34, pm25: 8.1, temperature: 22.4 },
      { name: 'Destination: Biosphere Campus', distanceKm: 3.4, estimatedMinutes: 24, aqi: 38, pm25: 9.2, temperature: 22.9 }
    ]
  },
  {
    id: 'route_fastest',
    title: 'Direct Urban Arterial (Fastest)',
    type: 'fastest',
    totalDistanceKm: 2.6,
    durationMinutes: 18,
    averageAqi: 78,
    averagePm25: 22.4,
    heatExposureMinutes: 18,
    pm25ReductionVsFastestPercent: 0,
    routeColor: '#f59e0b', // amber-500
    advisory: 'Follows 4th Avenue multi-lane arterial. High vehicle tailpipe emissions and continuous asphalt heat radiation.',
    waypoints: [
      { name: 'Start: Medical District', distanceKm: 0.0, estimatedMinutes: 0, aqi: 48, pm25: 12.2, temperature: 23.2 },
      { name: '4th Avenue Transit Intersection', distanceKm: 1.1, estimatedMinutes: 7, aqi: 86, pm25: 26.8, temperature: 25.4, hazardNote: 'Heavy diesel bus particulate plume' },
      { name: 'Downtown Central Expressway Cross', distanceKm: 1.9, estimatedMinutes: 13, aqi: 92, pm25: 28.4, temperature: 26.1, hazardNote: 'Asphalt micro-heat island' },
      { name: 'Destination: Biosphere Campus', distanceKm: 2.6, estimatedMinutes: 18, aqi: 78, pm25: 21.2, temperature: 24.8 }
    ]
  },
  {
    id: 'route_sheltered',
    title: 'Climate-Sheltered Arcades & Shaded Alleyways',
    type: 'low_heat_sheltered',
    totalDistanceKm: 3.0,
    durationMinutes: 22,
    averageAqi: 52,
    averagePm25: 14.1,
    heatExposureMinutes: 4,
    pm25ReductionVsFastestPercent: 37,
    routeColor: '#06b6d4', // cyan-500
    advisory: 'Maximizes covered pedestrian walkways, misting zones, and architectural solar shading.',
    waypoints: [
      { name: 'Start: Medical District', distanceKm: 0.0, estimatedMinutes: 0, aqi: 48, pm25: 12.2, temperature: 23.2 },
      { name: 'University Covered Galleria', distanceKm: 0.9, estimatedMinutes: 6, aqi: 42, pm25: 10.5, temperature: 21.5, hazardNote: 'HVAC cooled transit corridor' },
      { name: 'Civic Plaza Shaded Arcade', distanceKm: 2.1, estimatedMinutes: 15, aqi: 54, pm25: 15.2, temperature: 22.8 },
      { name: 'Destination: Biosphere Campus', distanceKm: 3.0, estimatedMinutes: 22, aqi: 50, pm25: 13.8, temperature: 23.1 }
    ]
  }
];

export const DEMO_COMMUNITY_HAZARDS: CommunityHazardReport[] = [
  {
    id: 'haz_01',
    title: 'Industrial Exhaust Plume near East Rail Yard',
    hazardType: 'industrial_emission',
    locationName: 'East Industrial District, Sector 4',
    reportedAt: '24 mins ago',
    reportedByAnonymized: 'Citizen Monitor #842',
    severity: 'high',
    verificationVotes: 18,
    status: 'community_verified',
    measuredPm25: 46.8,
    measuredTemp: 26.2,
    userVoted: false
  },
  {
    id: 'haz_02',
    title: 'Construction Concrete Dust & Silica Cloud',
    hazardType: 'construction_dust',
    locationName: 'North Metro Extension Boulevard',
    reportedAt: '1 hour ago',
    reportedByAnonymized: 'Resident #109',
    severity: 'moderate',
    verificationVotes: 12,
    status: 'investigating',
    measuredPm25: 34.2,
    measuredTemp: 24.1,
    userVoted: false
  },
  {
    id: 'haz_03',
    title: 'Asphalt Thermal Island (>36°C Surface Radiance)',
    hazardType: 'urban_heat_island',
    locationName: 'Central Commercial Plaza Car Park',
    reportedAt: '2 hours ago',
    reportedByAnonymized: 'Health Volunteer #33',
    severity: 'moderate',
    verificationVotes: 9,
    status: 'community_verified',
    measuredTemp: 34.8,
    userVoted: false
  },
  {
    id: 'haz_04',
    title: 'Stagnant Smog Inversion Layer in South Valley Basin',
    hazardType: 'stagnant_air',
    locationName: 'South River Valley Lowlands',
    reportedAt: '3 hours ago',
    reportedByAnonymized: 'Atmospheric Lab Sensor #09',
    severity: 'hazardous',
    verificationVotes: 32,
    status: 'community_verified',
    measuredPm25: 58.4,
    measuredTemp: 27.5,
    userVoted: true
  }
];

export const DEMO_CITY_ANALYTICS: CityAnalyticsData = {
  cityName: 'Metropolitan Biosphere District',
  updatedAt: 'Live Spatial Sensor Grid (Updated 2 mins ago)',
  cityWideAverageAqi: 64,
  cityWideAverageTemp: 24.2,
  activeAdvisory: 'Air Quality Moderate (Advisory for Asthmatic & Elderly Citizens in Wards 4 & 7)',
  totalMonitorsActive: 148,
  wards: [
    {
      wardId: 'W-01',
      wardName: 'Ward 1: Civic & Health Center',
      population: 42000,
      vulnerabilityIndex: 28,
      aqiCurrent: 44,
      pm25Current: 10.8,
      temperatureCurrent: 22.8,
      heatStressLevel: 'Low',
      hospitalCapacityPercent: 68
    },
    {
      wardId: 'W-02',
      wardName: 'Ward 2: Riverside Greenbelt',
      population: 31000,
      vulnerabilityIndex: 22,
      aqiCurrent: 32,
      pm25Current: 7.4,
      temperatureCurrent: 21.6,
      heatStressLevel: 'Low',
      hospitalCapacityPercent: 54
    },
    {
      wardId: 'W-03',
      wardName: 'Ward 3: Midtown Commercial Hub',
      population: 68000,
      vulnerabilityIndex: 45,
      aqiCurrent: 74,
      pm25Current: 21.2,
      temperatureCurrent: 25.8,
      heatStressLevel: 'Moderate',
      hospitalCapacityPercent: 78
    },
    {
      wardId: 'W-04',
      wardName: 'Ward 4: East Industrial Rail Basin',
      population: 54000,
      vulnerabilityIndex: 72,
      aqiCurrent: 118,
      pm25Current: 38.6,
      temperatureCurrent: 26.4,
      heatStressLevel: 'High',
      hospitalCapacityPercent: 88
    },
    {
      wardId: 'W-05',
      wardName: 'Ward 5: University Academic Arc',
      population: 48000,
      vulnerabilityIndex: 32,
      aqiCurrent: 48,
      pm25Current: 12.1,
      temperatureCurrent: 23.4,
      heatStressLevel: 'Low',
      hospitalCapacityPercent: 62
    },
    {
      wardId: 'W-06',
      wardName: 'Ward 6: Northern Foothills',
      population: 29000,
      vulnerabilityIndex: 26,
      aqiCurrent: 38,
      pm25Current: 8.8,
      temperatureCurrent: 20.9,
      heatStressLevel: 'Low',
      hospitalCapacityPercent: 51
    },
    {
      wardId: 'W-07',
      wardName: 'Ward 7: South Port Logistics Corridor',
      population: 61000,
      vulnerabilityIndex: 68,
      aqiCurrent: 98,
      pm25Current: 31.5,
      temperatureCurrent: 26.8,
      heatStressLevel: 'High',
      hospitalCapacityPercent: 82
    },
    {
      wardId: 'W-08',
      wardName: 'Ward 8: West Suburban Valley',
      population: 58000,
      vulnerabilityIndex: 36,
      aqiCurrent: 52,
      pm25Current: 13.9,
      temperatureCurrent: 23.1,
      heatStressLevel: 'Low',
      hospitalCapacityPercent: 71
    }
  ]
};
