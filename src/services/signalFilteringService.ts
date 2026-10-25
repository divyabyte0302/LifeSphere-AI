/**
 * LifeSphere AI-X — Time-Series Sensor Artifact Filtering Service
 * 
 * Implements configurable rolling median filters and noise spike suppression:
 * - Preserves raw telemetry measurements separately
 * - Computes filtered values with window size parameters (default 5 points)
 * - Identifies low-quality readings and motion artifacts without silently hiding serious physiological spikes
 * - Marks suspicious data with quality flags (isArtifact, qualityScore)
 */

export interface FilteredReading {
  timestamp: string;
  rawValue: number;
  filteredValue: number;
  isArtifact: boolean;
  qualityScore: number; // 0.0 (artifact) to 1.0 (pristine signal)
  measurementType: string;
}

export class SignalFilteringService {
  /**
   * Apply rolling median filter to a series of numerical time-series values.
   */
  filterRollingMedian(
    rawReadings: Array<{ timestamp: string; value: number }>,
    windowSize: number = 5,
    measurementType: string = 'heart_rate'
  ): FilteredReading[] {
    if (!rawReadings || rawReadings.length === 0) return [];

    const result: FilteredReading[] = [];

    for (let i = 0; i < rawReadings.length; i++) {
      const startIdx = Math.max(0, i - Math.floor(windowSize / 2));
      const endIdx = Math.min(rawReadings.length, i + Math.floor(windowSize / 2) + 1);
      const windowValues = rawReadings.slice(startIdx, endIdx).map((r) => r.value);

      // Compute median
      windowValues.sort((a, b) => a - b);
      const median =
        windowValues.length % 2 === 1
          ? windowValues[Math.floor(windowValues.length / 2)]
          : (windowValues[windowValues.length / 2 - 1] + windowValues[windowValues.length / 2]) / 2;

      const rawVal = rawReadings[i].value;
      const deviation = Math.abs(rawVal - median);

      // Artifact threshold detection
      let isArtifact = false;
      let qualityScore = 1.0;

      if (measurementType === 'heart_rate' && deviation > 35) {
        // Sudden spike >35 bpm from rolling median indicates motion artifact
        isArtifact = true;
        qualityScore = 0.25;
      } else if (measurementType === 'spo2' && (rawVal < 70 || rawVal > 100)) {
        isArtifact = true;
        qualityScore = 0.1;
      }

      result.push({
        timestamp: rawReadings[i].timestamp,
        rawValue: rawVal,
        filteredValue: Math.round(median * 10) / 10,
        isArtifact,
        qualityScore,
        measurementType,
      });
    }

    return result;
  }
}

export const signalFilteringService = new SignalFilteringService();
