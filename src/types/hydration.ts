export type BeverageType =
  | 'water'
  | 'electrolyte'
  | 'herbal_tea'
  | 'coconut_water'
  | 'coffee'
  | 'juice';

export interface BeverageMetadata {
  id: BeverageType;
  label: string;
  hydrationCoefficient: number; // e.g. water = 1.0, coffee = 0.8, electrolyte = 1.1
  iconName: string;
  color: string;
}

export const BEVERAGE_TYPES: Record<BeverageType, BeverageMetadata> = {
  water: {
    id: 'water',
    label: 'Pure Water',
    hydrationCoefficient: 1.0,
    iconName: 'Droplets',
    color: '#38BDF8', // Sky 400
  },
  electrolyte: {
    id: 'electrolyte',
    label: 'Electrolyte Solution',
    hydrationCoefficient: 1.1,
    iconName: 'Zap',
    color: '#34D399', // Emerald 400
  },
  coconut_water: {
    id: 'coconut_water',
    label: 'Coconut Water',
    hydrationCoefficient: 1.05,
    iconName: 'Sparkles',
    color: '#2DD4BF', // Teal 400
  },
  herbal_tea: {
    id: 'herbal_tea',
    label: 'Herbal Infusion / Tea',
    hydrationCoefficient: 0.95,
    iconName: 'Coffee',
    color: '#A78BFA', // Purple 400
  },
  juice: {
    id: 'juice',
    label: 'Natural Fruit Juice',
    hydrationCoefficient: 0.9,
    iconName: 'Apple',
    color: '#FB923C', // Orange 400
  },
  coffee: {
    id: 'coffee',
    label: 'Coffee / Black Tea',
    hydrationCoefficient: 0.8,
    iconName: 'CupSoda',
    color: '#FBBF24', // Amber 400
  },
};

export interface HydrationLogEntry {
  id: string;
  userId?: string;
  timestamp: string; // ISO 8601 string
  timeFormatted: string; // e.g. "09:15 AM"
  volumeMl: number; // Raw volume ingested
  effectiveMl: number; // volumeMl * hydrationCoefficient
  beverageType: BeverageType;
  source: 'quick_preset' | 'custom_entry' | 'wearable_prompt';
  notes?: string;
  createdAt?: string;
}

export interface DynamicGoalFactors {
  baseWeightMl: number; // Weight in kg * 35 ml
  temperatureAdjustmentMl: number; // Environmental heat compensation
  humidityAdjustmentMl: number; // Dry air deficit adjustment
  activityAdjustmentMl: number; // Step count and active calories
  vitalStrainAdjustmentMl: number; // Elevated heart rate or body temperature
  totalGoalMl: number;
}

export interface DayHydrationSummary {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue, etc.
  totalIntakeMl: number;
  goalMl: number;
  percentage: number;
  logCount: number;
  status: 'achieved' | 'on_track' | 'deficit';
}

export interface DehydrationRiskAssessment {
  riskScore: number; // 0 - 100
  riskCategory: 'Optimal' | 'Mild Fluid Deficit' | 'Moderate Risk' | 'Acute Dehydration Strain';
  heatIndexC: number;
  recommendation: string;
  primaryContributingFactor: string;
}
