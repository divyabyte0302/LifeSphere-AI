import {
  UserProfile,
  HealthMetrics,
  EnvironmentalData,
  BeverageType,
  BEVERAGE_TYPES,
  HydrationLogEntry,
  DynamicGoalFactors,
  DayHydrationSummary,
  DehydrationRiskAssessment
} from '../types';
import { firebaseSyncService } from './firebaseSyncService';
import {
  persistHydrationRecordToFirestore,
  loadHydrationRecordsFromFirestore,
  deleteHydrationRecordFromFirestore,
} from '../lib/firebase';

const STORAGE_KEY = 'lifesphere_hydration_logs_v1';

/**
 * Calculates a dynamic daily hydration goal adapting to:
 * 1. Clinical Weight Baseline: ~35 ml / kg
 * 2. Ambient Environmental Heat: Compensates for perspiration loss above 24°C
 * 3. Relative Humidity: Accounts for dry air evaporative deficit or hot-humid heat index
 * 4. Physical Activity: Step counts and active calorie burn
 * 5. Physiological Vital Strain: Elevated resting heart rate or body temperature
 */
export function calculateDynamicGoal(
  user?: Partial<UserProfile> | null,
  vitals?: Partial<HealthMetrics> | null,
  environment?: Partial<EnvironmentalData> | null
): DynamicGoalFactors {
  const weightKg = user?.weightKg && user.weightKg > 30 ? user.weightKg : 74;
  const baseWeightMl = Math.round(weightKg * 35); // 74kg -> 2590 ml

  // 1. Ambient Temperature Adjustment
  const temp = environment?.temperature ?? 27; // Default 27°C
  let temperatureAdjustmentMl = 0;
  if (temp > 24) {
    const tempDelta = temp - 24;
    // +250 ml for each 5°C increment above 24°C
    temperatureAdjustmentMl = Math.round((tempDelta / 5) * 250);
    if (temp >= 33) {
      temperatureAdjustmentMl += 150; // High heat strain surcharge
    }
  }

  // 2. Relative Humidity Adjustment
  const humidity = environment?.humidity ?? 45; // Default 45%
  let humidityAdjustmentMl = 0;
  if (humidity < 35) {
    // Dry atmosphere accelerates insensible respiratory & dermal fluid loss
    humidityAdjustmentMl = 150;
  } else if (temp > 28 && humidity > 70) {
    // High heat index where evaporative sweating is inefficient
    humidityAdjustmentMl = 200;
  }

  // 3. Physical Activity Adjustment
  const stepCount = vitals?.stepCount ?? 6420;
  const activeCalories = vitals?.activeCalories ?? 380;
  let activityAdjustmentMl = 0;
  if (stepCount > 3000) {
    activityAdjustmentMl += Math.round(((stepCount - 3000) / 3000) * 200);
  }
  if (activeCalories > 300) {
    activityAdjustmentMl += Math.round(((activeCalories - 300) / 200) * 100);
  }

  // 4. Vital Strain Adjustment
  const heartRate = vitals?.heartRate ?? 72;
  const bodyTemp = vitals?.bodyTemperature ?? 36.6;
  let vitalStrainAdjustmentMl = 0;
  if (heartRate > 85) {
    vitalStrainAdjustmentMl += 150;
  }
  if (bodyTemp > 37.2) {
    vitalStrainAdjustmentMl += 250;
  }

  const rawTotal =
    baseWeightMl +
    temperatureAdjustmentMl +
    humidityAdjustmentMl +
    activityAdjustmentMl +
    vitalStrainAdjustmentMl;

  // Round to nearest 50 ml
  const totalGoalMl = Math.round(rawTotal / 50) * 50;

  return {
    baseWeightMl,
    temperatureAdjustmentMl,
    humidityAdjustmentMl,
    activityAdjustmentMl,
    vitalStrainAdjustmentMl,
    totalGoalMl,
  };
}

/**
 * Calculates current dehydration & heat stress risk based on intake vs target and vitals
 */
export function evaluateDehydrationRisk(
  currentIntakeMl: number,
  goalMl: number,
  vitals?: Partial<HealthMetrics> | null,
  environment?: Partial<EnvironmentalData> | null
): DehydrationRiskAssessment {
  const currentRatio = goalMl > 0 ? currentIntakeMl / goalMl : 0.5;
  const temp = environment?.temperature ?? 27;
  const humidity = environment?.humidity ?? 45;

  // Simplified heat index calculation
  const heatIndexC = Math.round(temp + 0.05 * humidity);

  let riskScore = 0;
  let primaryContributingFactor = 'Hydration intake is tracking within normal parameters.';

  if (currentRatio >= 0.9) {
    riskScore = 12;
    primaryContributingFactor = 'Optimal hydration maintenance. Fluid loss is fully balanced.';
  } else if (currentRatio >= 0.65) {
    riskScore = 32;
    primaryContributingFactor = 'Mild fluid deficit. Maintain standard fluid intake pace.';
  } else if (currentRatio >= 0.4) {
    riskScore = 58;
    primaryContributingFactor = temp > 28
      ? `High ambient heat (${temp}°C) combined with a fluid intake deficit (${Math.round((1 - currentRatio) * 100)}% remaining).`
      : 'Intake is lagging behind expected physiological expenditure.';
  } else {
    riskScore = 84;
    primaryContributingFactor = `Critical fluid deficit under ${temp}°C conditions. Risk of cognitive sluggishness and cardiac workload elevation.`;
  }

  // Vital amplification
  if (vitals?.heartRate && vitals.heartRate > 88 && currentRatio < 0.6) {
    riskScore = Math.min(99, riskScore + 10);
    primaryContributingFactor += ' Compensatory tachycardia observed.';
  }

  let riskCategory: DehydrationRiskAssessment['riskCategory'] = 'Optimal';
  let recommendation = 'Drink water whenever thirsty to sustain cellular homeostasis.';

  if (riskScore >= 75) {
    riskCategory = 'Acute Dehydration Strain';
    recommendation = 'Drink 350-500 ml of cool water or electrolyte solution immediately. Rest in a shaded or cooled environment.';
  } else if (riskScore >= 50) {
    riskCategory = 'Moderate Risk';
    recommendation = `Target 250 ml of water every 30-45 minutes. Environment is warm (${temp}°C) with elevated insensible perspiration.`;
  } else if (riskScore >= 25) {
    riskCategory = 'Mild Fluid Deficit';
    recommendation = 'Drink a glass of water (250 ml) during your next transition break to stay ahead of the daily goal.';
  }

  return {
    riskScore,
    riskCategory,
    heatIndexC,
    recommendation,
    primaryContributingFactor,
  };
}

/**
 * Generates synthetic seed entries for the current day
 */
function createDefaultSeedEntries(): HydrationLogEntry[] {
  const now = new Date();
  const formatTime = (hours: number, minutes: number) => {
    const d = new Date(now);
    d.setHours(hours, minutes, 0, 0);
    return {
      iso: d.toISOString(),
      formatted: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
  };

  const t1 = formatTime(7, 30);
  const t2 = formatTime(9, 45);
  const t3 = formatTime(12, 15);
  const t4 = formatTime(14, 30);

  return [
    {
      id: 'log-seed-1',
      timestamp: t1.iso,
      timeFormatted: t1.formatted,
      volumeMl: 350,
      effectiveMl: 350,
      beverageType: 'water',
      source: 'quick_preset',
      notes: 'Morning wake-up hydration',
    },
    {
      id: 'log-seed-2',
      timestamp: t2.iso,
      timeFormatted: t2.formatted,
      volumeMl: 250,
      effectiveMl: 200,
      beverageType: 'coffee',
      source: 'custom_entry',
      notes: 'Morning Americano (0.8x hydration coefficient)',
    },
    {
      id: 'log-seed-3',
      timestamp: t3.iso,
      timeFormatted: t3.formatted,
      volumeMl: 500,
      effectiveMl: 550,
      beverageType: 'electrolyte',
      source: 'quick_preset',
      notes: 'Post-midday walk hydration',
    },
    {
      id: 'log-seed-4',
      timestamp: t4.iso,
      timeFormatted: t4.formatted,
      volumeMl: 250,
      effectiveMl: 250,
      beverageType: 'water',
      source: 'quick_preset',
      notes: 'Workstation tumbler',
    },
  ];
}

class HydrationService {
  private logs: HydrationLogEntry[] = [];
  private listeners: (() => void)[] = [];
  private currentUserId = 'LS-8842';
  private lastSyncTime: Date = new Date();
  private lastSyncPath = 'users/LS-8842/hydration';
  private isCloudSynced = false;

  constructor() {
    this.loadLogs();
  }

  public setUserId(uid: string): void {
    if (!uid || uid === this.currentUserId) return;
    this.currentUserId = uid;
    this.lastSyncPath = `users/${uid}/hydration`;
    this.fetchUserHydration(uid);
  }

  public getUserId(): string {
    return this.currentUserId;
  }

  public getFirestorePath(recordId?: string, targetUid?: string): string {
    const uid = targetUid || this.currentUserId;
    return recordId ? `users/${uid}/hydration/${recordId}` : `users/${uid}/hydration`;
  }

  public getFirestoreSyncStatus() {
    return {
      isCloudSynced: this.isCloudSynced,
      lastSyncTime: this.lastSyncTime,
      activePath: this.lastSyncPath,
      currentUserId: this.currentUserId,
    };
  }

  private loadLogs(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.logs = parsed;
          return;
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }

    // Default seed
    this.logs = createDefaultSeedEntries();
    this.saveLogs();
  }

  private saveLogs(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
    } catch {
      // Handle quota exceeded gracefully
    }
    this.notify();
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public getTodayLogs(): HydrationLogEntry[] {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.logs.filter((log) => log.timestamp.startsWith(todayStr));
  }

  public getAllLogs(): HydrationLogEntry[] {
    return [...this.logs];
  }

  public getTodayTotalEffectiveIntake(): number {
    return this.getTodayLogs().reduce((acc, log) => acc + log.effectiveMl, 0);
  }

  public getTodayTotalRawIntake(): number {
    return this.getTodayLogs().reduce((acc, log) => acc + log.volumeMl, 0);
  }

  /**
   * Persists daily water intake entry to user's Firestore collection: users/{uid}/hydration/{recordId}
   */
  public logIntake(
    volumeMl: number,
    beverageType: BeverageType = 'water',
    source: 'quick_preset' | 'custom_entry' | 'wearable_prompt' = 'quick_preset',
    notes?: string,
    targetUid?: string
  ): HydrationLogEntry {
    const uid = targetUid || this.currentUserId;
    const meta = BEVERAGE_TYPES[beverageType] || BEVERAGE_TYPES.water;
    const effectiveMl = Math.round(volumeMl * meta.hydrationCoefficient);
    const now = new Date();
    const timestamp = now.toISOString();

    const newEntry: HydrationLogEntry = {
      id: `hydro-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: uid,
      timestamp,
      timeFormatted: now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      volumeMl,
      effectiveMl,
      beverageType,
      source,
      notes: notes || `${meta.label} (${volumeMl} ml)`,
      createdAt: timestamp,
    };

    // 1. Immediate optimistic update locally
    this.logs = [newEntry, ...this.logs];
    this.saveLogs();

    // 2. Persist to Firestore: users/{uid}/hydration/{recordId}
    persistHydrationRecordToFirestore(uid, newEntry)
      .then((res) => {
        this.isCloudSynced = res.success;
        this.lastSyncTime = new Date();
        this.lastSyncPath = res.path;
      })
      .catch((err) => {
        console.warn('Background Firestore hydration persistence caught:', err);
      });

    // 3. Register with Unified Sync Manager and Audit Log
    try {
      firebaseSyncService.syncHydrationLog({
        id: newEntry.id,
        volumeMl: newEntry.volumeMl,
        effectiveMl: newEntry.effectiveMl,
        beverageType: meta.label,
        timestamp: newEntry.timestamp,
        userId: uid,
      });
    } catch {
      // Ignore background sync errors
    }

    return newEntry;
  }

  /**
   * Deletes a hydration log locally and purges from users/{uid}/hydration/{recordId}
   */
  public deleteLog(id: string, targetUid?: string): boolean {
    const uid = targetUid || this.currentUserId;
    const prevCount = this.logs.length;
    this.logs = this.logs.filter((log) => log.id !== id);
    if (this.logs.length !== prevCount) {
      this.saveLogs();

      // Delete from Firestore
      deleteHydrationRecordFromFirestore(uid, id).catch((err) => {
        console.warn('Firestore hydration deletion note:', err);
      });

      return true;
    }
    return false;
  }

  public resetTodayLogs(targetUid?: string): void {
    const uid = targetUid || this.currentUserId;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayEntries = this.logs.filter((log) => log.timestamp.startsWith(todayStr));
    this.logs = this.logs.filter((log) => !log.timestamp.startsWith(todayStr));
    this.saveLogs();

    // Clean from Firestore in background
    for (const entry of todayEntries) {
      deleteHydrationRecordFromFirestore(uid, entry.id).catch(() => {});
    }
  }

  /**
   * Fetches latest remote hydration records from users/{uid}/hydration and synchronizes state
   */
  public async fetchUserHydration(targetUid?: string): Promise<HydrationLogEntry[]> {
    const uid = targetUid || this.currentUserId;
    this.lastSyncPath = `users/${uid}/hydration`;

    try {
      const res = await loadHydrationRecordsFromFirestore(uid, 50);
      if (res.success && res.records.length > 0) {
        // Merge remote entries with current logs (deduplicate by id)
        const existingIds = new Set(this.logs.map((l) => l.id));
        const newRecords = res.records.filter((r) => !existingIds.has(r.id));
        if (newRecords.length > 0) {
          this.logs = [...newRecords, ...this.logs].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          this.saveLogs();
        }
        this.isCloudSynced = true;
        this.lastSyncTime = new Date();
      }
    } catch (err) {
      console.warn('Could not load hydration records from Firestore:', err);
    }
    return this.logs;
  }

  /**
   * Generates a 7-day historical summary comparison
   */
  public getPastWeekSummaries(currentGoalMl: number): DayHydrationSummary[] {
    const days: DayHydrationSummary[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Generate past 7 days (including today as the 7th element)
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = i === 0 ? 'Today' : dayNames[d.getDay()];

      let intake = 0;
      let count = 0;

      if (i === 0) {
        intake = this.getTodayTotalEffectiveIntake();
        count = this.getTodayLogs().length;
      } else {
        // Synthetic realistic values for previous 6 days
        const mockIntakes = [2450, 2800, 2200, 3100, 2650, 2900];
        const mockGoals = [2600, 2750, 2550, 2950, 2600, 2850];
        intake = mockIntakes[i - 1] || 2500;
        count = Math.floor(intake / 350);
        currentGoalMl = mockGoals[i - 1] || 2700;
      }

      const percentage = Math.round((intake / currentGoalMl) * 100);
      let status: DayHydrationSummary['status'] = 'deficit';
      if (percentage >= 100) status = 'achieved';
      else if (percentage >= 70) status = 'on_track';

      days.push({
        date: dateStr,
        dayLabel,
        totalIntakeMl: intake,
        goalMl: currentGoalMl,
        percentage,
        logCount: count,
        status,
      });
    }

    return days;
  }
}

export const hydrationService = new HydrationService();
